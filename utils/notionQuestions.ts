import type { Question } from '../types/questions';

export type { Question } from '../types/questions';

/** 1 = Icebreaker, 2 = Personal, 3 = Vulnerable */
export type ClosenessLevel = 1 | 2 | 3;

/** Shape returned by Notion fetch (en-US + es-ES only). Context converts to Question[] + questionTextByLocale. */
export interface FetchedQuestion {
  id: string;
  moment: string[];
  closenessLevel?: ClosenessLevel;
  text: { 'en-US': string; 'es-ES': string };
}

export interface MomentOption {
  id: string;
  name: string;
  emoji: string;
}

interface NotionPage {
  id: string;
  properties: Record<
    string,
    | { title?: Array<{ plain_text: string }> }
    | { rich_text?: Array<{ plain_text: string }> }
    | { multi_select?: Array<{ name: string }> }
    | { unique_id?: { prefix: string; number: number } }
    | { select?: { name: string } | null; number?: number | null }
    | { number?: number | null }
  >;
}

const DEFAULT_EMOJI = '💬';

/** Parse "Deep Talk 🧠" into { name: "Deep Talk", emoji: "🧠" }. Falls back to default emoji if no trailing emoji. */
function parseMomentNameWithEmoji(fullName: string): { name: string; emoji: string } {
  const match = fullName.match(/\s*(\p{Emoji_Presentation})$/u);
  if (match) {
    return {
      name: fullName.slice(0, match.index).trim(),
      emoji: match[1],
    };
  }
  return { name: fullName, emoji: DEFAULT_EMOJI };
}

function extractPlainText(richText?: Array<{ plain_text: string }>): string {
  if (!richText || richText.length === 0) return '';
  return richText.map((item) => item.plain_text).join('');
}

/** Find Closeness property (Notion may use name "Closeness" or internal id as key). */
function getClosenessProp(props: NotionPage['properties']): { number?: number | null; select?: { name: string } | null } | undefined {
  const entry = Object.entries(props).find(([key]) => key.toLowerCase().includes('closeness'));
  if (!entry) return undefined;
  const val = entry[1] as unknown;
  if (!val || typeof val !== 'object') return undefined;
  const obj = val as Record<string, unknown>;
  if ('number' in obj || 'select' in obj) return obj as { number?: number | null; select?: { name: string } | null };
  if (obj.type === 'number' && typeof (obj as { number?: number }).number === 'number')
    return { number: (obj as { number: number }).number };
  if (obj.type === 'select' && (obj as { select?: { name: string } }).select)
    return { select: (obj as { select: { name: string } }).select };
  return undefined;
}

/** Parse Notion Closeness (number 1–3 or select name) to 1 | 2 | 3. */
function parseClosenessLevel(props: NotionPage['properties']): ClosenessLevel | undefined {
  const closeness = getClosenessProp(props);
  if (!closeness) return undefined;
  const num = closeness.number;
  if (num === 1 || num === 2 || num === 3) return num;
  const name = closeness.select?.name?.trim();
  if (!name) return undefined;
  const lower = name.toLowerCase();
  if (lower.includes('icebreaker') || name === '1' || lower.includes('level 1')) return 1;
  if (lower.includes('personal') || name === '2' || lower.includes('level 2')) return 2;
  if (lower.includes('vulnerable') || name === '3' || lower.includes('level 3')) return 3;
  const n = parseInt(name, 10);
  if (n === 1 || n === 2 || n === 3) return n;
  return undefined;
}

function mapNotionPageToQuestion(page: NotionPage): FetchedQuestion | null {
  try {
    const props = page.properties;
    const english = props['English'] as { title?: Array<{ plain_text: string }> } | undefined;
    const spanish = props['Spanish'] as { rich_text?: Array<{ plain_text: string }> } | undefined;
    const momentProp = props['Moment'] as { multi_select?: Array<{ name: string }> } | undefined;
    const idProp = props['ID'] as { unique_id?: { prefix: string; number: number } } | undefined;
    const textEn = extractPlainText(english?.title);
    const textEs = extractPlainText(spanish?.rich_text);
    const moment = momentProp?.multi_select?.map((m: { name: string }) => m.name) ?? [];
    const uniqueId = idProp?.unique_id;
    const id = uniqueId ? `${uniqueId.prefix}-${uniqueId.number}` : page.id;
    const closenessLevel = parseClosenessLevel(props);

    if (!textEn && !textEs) return null;

    return {
      id,
      moment,
      ...(closenessLevel != null && { closenessLevel }),
      text: {
        'en-US': textEn || textEs,
        'es-ES': textEs || textEn,
      },
    };
  } catch {
    return null;
  }
}

function extractUniqueMoments(questions: FetchedQuestion[]): string[] {
  const set = new Set<string>();
  questions.forEach((q) => q.moment.forEach((m) => set.add(m)));
  return Array.from(set).sort();
}

function buildMomentOptions(momentNames: string[]): MomentOption[] {
  return momentNames.map((fullName) => {
    const { name, emoji } = parseMomentNameWithEmoji(fullName);
    return {
      id: fullName,
      name: name || fullName,
      emoji,
    };
  });
}

export interface FetchQuestionsResult {
  questions: FetchedQuestion[];
  momentOptions: MomentOption[];
}

export async function fetchQuestionsFromNotion(
  apiKey: string,
  databaseId: string
): Promise<FetchQuestionsResult> {
  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const body: { page_size: number; start_cursor?: string } = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion API ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      results: NotionPage[];
      has_more: boolean;
      next_cursor?: string;
    };
    pages.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const questions = pages
    .map(mapNotionPageToQuestion)
    .filter((q): q is FetchedQuestion => q !== null);
  const momentNames = extractUniqueMoments(questions);
  const momentOptions = buildMomentOptions(momentNames);

  return { questions, momentOptions };
}
