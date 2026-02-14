export interface Question {
  id: string;
  textEn: string;
  textEs: string;
  moment: string[];
}

export interface MomentOption {
  id: string;
  name: string;
  emoji: string;
}

interface NotionPage {
  id: string;
  properties: {
    English?: { title?: Array<{ plain_text: string }> };
    Spanish?: { rich_text?: Array<{ plain_text: string }> };
    Moment?: { multi_select?: Array<{ name: string }> };
    ID?: { unique_id?: { prefix: string; number: number } };
  };
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

function mapNotionPageToQuestion(page: NotionPage): Question | null {
  try {
    const props = page.properties;
    const textEn = extractPlainText(props.English?.title);
    const textEs = extractPlainText(props.Spanish?.rich_text);
    const moment = props.Moment?.multi_select?.map((m) => m.name) ?? [];
    const uniqueId = props.ID?.unique_id;
    const id = uniqueId ? `${uniqueId.prefix}-${uniqueId.number}` : page.id;

    if (!textEn && !textEs) return null;

    return {
      id,
      textEn: textEn || textEs,
      textEs: textEs || textEn,
      moment,
    };
  } catch {
    return null;
  }
}

function extractUniqueMoments(questions: Question[]): string[] {
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
  questions: Question[];
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
    .filter((q): q is Question => q !== null);
  const momentNames = extractUniqueMoments(questions);
  const momentOptions = buildMomentOptions(momentNames);

  return { questions, momentOptions };
}
