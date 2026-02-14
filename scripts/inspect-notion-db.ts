/**
 * Inspect the Notion questions database: schema (properties) and a sample row.
 * Uses NOTION_API_KEY and NOTION_DATABASE_ID from .env
 *
 * Run: npx tsx scripts/inspect-notion-db.ts
 */
import * as dotenv from 'dotenv';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env');
  process.exit(1);
}

const NOTION_VERSION = '2022-06-28';
const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
};

async function getDatabase() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`,
    { method: 'GET', headers }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${res.status}: ${text}`);
  }
  return res.json();
}

async function queryOnePage() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ page_size: 1 }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.results?.[0] ?? null;
}

async function main() {
  console.log('📋 Notion Questions Database Structure\n');

  const db = await getDatabase();

  console.log('Database title:', db.title?.map((t: { plain_text: string }) => t.plain_text).join('') || '(none)');
  console.log('Database ID:', db.id);
  console.log('');

  console.log('--- Properties (schema) ---\n');
  const properties = db.properties || {};
  for (const [name, prop] of Object.entries(properties) as [string, Record<string, unknown>][]) {
    const type = prop.type as string;
    console.log(`  ${name}`);
    console.log(`    type: ${type}`);
    if (type === 'title' && Array.isArray(prop.title)) {
      // title has no extra config usually
    }
    if (type === 'rich_text' && Array.isArray(prop.rich_text)) {
      // rich_text
    }
    if (type === 'multi_select' && prop.multi_select) {
      const options = (prop.multi_select as { options?: Array<{ name: string }> }).options;
      if (options?.length) {
        console.log(`    options: ${options.map((o) => o.name).join(', ')}`);
      }
    }
    if (type === 'unique_id' && prop.unique_id) {
      const uid = prop.unique_id as { prefix?: string };
      if (uid.prefix) console.log(`    prefix: ${uid.prefix}`);
    }
    console.log('');
  }

  const sample = await queryOnePage();
  if (sample) {
    console.log('--- Sample row (first page) ---\n');
    console.log(JSON.stringify(sample.properties, null, 2));
  } else {
    console.log('--- No pages in database (sample row skipped) ---');
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
