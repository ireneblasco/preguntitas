import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Notion API types
interface NotionPage {
  id: string;
  properties: {
    English?: { title?: Array<{ plain_text: string }> };
    Spanish?: { rich_text?: Array<{ plain_text: string }> };
    Moment?: { multi_select?: Array<{ name: string }> };
    ID?: { unique_id?: { prefix: string; number: number } };
  };
}

// Same shape as app: Question with text by locale (en-US, es-ES from Notion)
interface QuestionText {
  'en-US': string;
  'es-ES': string;
  [key: string]: string;
}
interface Question {
  id: string;
  moment: string[];
  text: QuestionText;
}

// Check environment variables
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ Error: Missing required environment variables');
  console.error('');
  console.error('Please create a .env file with:');
  console.error('  NOTION_API_KEY=secret_xxxxx');
  console.error('  NOTION_DATABASE_ID=xxxxx');
  console.error('');
  console.error('See .env.example for details');
  process.exit(1);
}

async function fetchAllQuestions(): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = true;

  console.log('📥 Fetching questions from Notion...');

  try {
    while (hasMore) {
      const body: any = {
        page_size: 100,
      };
      
      if (cursor) {
        body.start_cursor = cursor;
      }

      const response = await fetch(
        `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      pages.push(...data.results);
      hasMore = data.has_more || false;
      cursor = data.next_cursor || undefined;
    }

    console.log(`   Found ${pages.length} questions`);
    return pages;
  } catch (error: any) {
    console.error('❌ Error fetching from Notion:');
    console.error(`   ${error.message}`);
    if (error.message.includes('401')) {
      console.error('');
      console.error('Make sure:');
      console.error('  1. Your API key is correct');
      console.error('  2. Your integration has access to the database');
      console.error('  3. Share the database with your integration in Notion');
    }
    process.exit(1);
  }
}

function extractPlainText(richText?: Array<{ plain_text: string }>): string {
  if (!richText || richText.length === 0) return '';
  return richText.map(item => item.plain_text).join('');
}

function mapNotionPageToQuestion(page: NotionPage): Question | null {
  try {
    const props = page.properties;

    // Extract English text (from title)
    const textEn = extractPlainText(props.English?.title);

    // Extract Spanish text (from rich_text)
    const textEs = extractPlainText(props.Spanish?.rich_text);

    // Extract moments from Moment multi-select
    const moment = props.Moment?.multi_select?.map(m => m.name) || [];

    // Extract ID from unique_id
    const uniqueId = props.ID?.unique_id;
    const id = uniqueId ? `${uniqueId.prefix}-${uniqueId.number}` : page.id;

    // Validate required fields
    if (!textEn && !textEs) {
      console.warn(`⚠️  Skipping question ${id}: missing both English and Spanish text`);
      return null;
    }

    const text: QuestionText = {
      'en-US': textEn || textEs,
      'es-ES': textEs || textEn,
    };
    return { id, moment, text };
  } catch (error: any) {
    console.warn(`⚠️  Error mapping question: ${error.message}`);
    return null;
  }
}

function extractUniqueMoments(questions: Question[]): string[] {
  const set = new Set<string>();
  questions.forEach(q => q.moment.forEach(m => set.add(m)));
  return Array.from(set).sort();
}

/** Parse "Deep Talk 🧠" into { name: "Deep Talk", emoji: "🧠" }. */
function parseMomentNameWithEmoji(fullName: string): { name: string; emoji: string } {
  const match = fullName.match(/\s*(\p{Emoji_Presentation})$/u);
  if (match) {
    return {
      name: fullName.slice(0, match.index).trim(),
      emoji: match[1],
    };
  }
  return { name: fullName, emoji: '💬' };
}

function generateMomentType(momentNames: string[]): string {
  if (momentNames.length === 0) return 'string';
  return momentNames.map(m => `"${m}"`).join(' | ');
}

function generateMomentOptions(momentNames: string[]): string {
  const options = momentNames.map(fullName => {
    const { name, emoji } = parseMomentNameWithEmoji(fullName);
    const displayName = name || fullName;
    return `  { id: ${JSON.stringify(fullName)}, name: ${JSON.stringify(displayName)}, emoji: ${JSON.stringify(emoji)} }`;
  });
  return `[\n${options.join(',\n')}\n]`;
}

function generateTypeScriptFile(questions: Question[], momentNames: string[]): string {
  const timestamp = new Date().toISOString();
  const momentType = generateMomentType(momentNames);
  const momentOptions = generateMomentOptions(momentNames);

  return `// Auto-generated from Notion on ${timestamp}
// Do not edit manually - changes will be overwritten

export type MomentType = ${momentType};

export const momentOptions: Array<{
  id: MomentType;
  name: string;
  emoji: string;
}> = ${momentOptions};

export interface QuestionText {
  'en-US': string;
  'es-ES': string;
  [key: string]: string;
}

export interface Question {
  id: string;
  moment: MomentType[];
  text: QuestionText;
}

export const questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;
}

async function main() {
  try {
    // Fetch all questions from Notion
    const pages = await fetchAllQuestions();

    // Map Notion pages to Question objects
    const questions = pages
      .map(mapNotionPageToQuestion)
      .filter((q): q is Question => q !== null);

    const skippedCount = pages.length - questions.length;
    if (skippedCount > 0) {
      console.log(`   ⚠️  Skipped ${skippedCount} invalid questions`);
    }

    if (questions.length === 0) {
      console.error('❌ Error: No valid questions found in database');
      process.exit(1);
    }

    // Extract unique moments
    const momentNames = extractUniqueMoments(questions);
    console.log(`   Extracted ${momentNames.length} unique moments`);

    // Generate TypeScript file content
    const fileContent = generateTypeScriptFile(questions, momentNames);

    // Write to file
    const outputPath = path.join(__dirname, '..', 'data', 'questions.ts');
    fs.writeFileSync(outputPath, fileContent, 'utf-8');

    console.log(`✅ Generated data/questions.ts with ${questions.length} questions`);
    console.log('');
    console.log('Moments:', momentNames.join(', '));
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

main();
