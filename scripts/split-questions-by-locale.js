/**
 * One-time script: reads data/questions.ts (current format with text per question)
 * and writes data/questions.ts (entry point) + data/questions.{locale}.ts for each locale.
 * Run from repo root: node scripts/split-questions-by-locale.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SRC = path.join(DATA_DIR, 'questions.ts');

const LOCALES = ['en-US', 'es-ES', 'en-GB', 'es-MX', 'pt-BR', 'pt', 'de', 'it', 'fr'];

function extractQuestionsArray(content) {
  const marker = 'export const questions: Question[] = [';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) throw new Error('Could not find questions array marker');
  const start = startIdx + marker.length - 1; // position of '['
  let depth = 0;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) return content.slice(start, i + 1);
    }
  }
  throw new Error('Could not find questions array end');
}

function extractMomentTypeAndOptions(content) {
  const momentTypeMatch = content.match(/export type MomentType = ([^;]+);/);
  const momentOptionsMatch = content.match(/export const momentOptions[^=]+= (\[[\s\S]*?\]);/);
  return {
    momentType: momentTypeMatch ? momentTypeMatch[1].trim() : '',
    momentOptions: momentOptionsMatch ? momentOptionsMatch[1] : '[]',
  };
}

const content = fs.readFileSync(SRC, 'utf-8');
const arrJson = extractQuestionsArray(content);
const questions = JSON.parse(arrJson);
const { momentType, momentOptions } = extractMomentTypeAndOptions(content);

// Build list of { id, moment } and per-locale maps
const questionsList = questions.map((q) => ({ id: q.id, moment: q.moment }));
const byLocale = {};
for (const loc of LOCALES) {
  byLocale[loc] = {};
  for (const q of questions) {
    const t = q.text && q.text[loc];
    if (t != null) byLocale[loc][q.id] = t;
  }
}

// Write locale files
for (const loc of LOCALES) {
  const obj = byLocale[loc];
  const lines = Object.entries(obj).map(([id, text]) => `  ${JSON.stringify(id)}: ${JSON.stringify(text)}`);
  const fileContent = `// Question texts for locale: ${loc}
// Do not edit manually - generated from Notion / translation pipeline

export const questionTexts: Record<string, string> = {\n${lines.join(',\n')}\n};
`;
  const outPath = path.join(DATA_DIR, `questions.${loc}.ts`);
  fs.writeFileSync(outPath, fileContent, 'utf-8');
  console.log('Wrote', outPath);
}

// Write entry point
const localeImports = LOCALES.map(
  (loc) => `import { questionTexts as ${loc.replace(/-/g, '')} } from './questions.${loc}';`
).join('\n');
const localeEntries = LOCALES.map((loc) => `  '${loc}': ${loc.replace(/-/g, '')},`).join('\n');

const entryContent = `// Entry point for questions: list + texts by locale (same pattern as i18n)
// Do not edit manually - run scripts/fetch-questions.js and translation pipeline

${localeImports}
import type { TranslationMapKey } from '../i18n';

export type MomentType = ${momentType};

export const momentOptions: Array<{
  id: MomentType;
  name: string;
  emoji: string;
}> = ${momentOptions};

export interface Question {
  id: string;
  moment: MomentType[];
}

export const questions: Question[] = ${JSON.stringify(questionsList, null, 2)};

export const questionTextByLocale: Record<TranslationMapKey, Record<string, string>> = {
${localeEntries}
};
`;

fs.writeFileSync(path.join(DATA_DIR, 'questions.ts'), entryContent, 'utf-8');
console.log('Wrote', path.join(DATA_DIR, 'questions.ts'));
console.log('Done. Locales:', LOCALES.join(', '));
