import type { TranslationMapKey } from '../i18n';

/**
 * Question without text: id and moment only.
 * Text is resolved per locale from data/questions.{locale}.ts (same pattern as i18n).
 */
export interface Question {
  id: string;
  moment: string[];
}

/** Map of locale key → (question id → text). Filled by data/questions.ts and locale files. */
export type QuestionTextByLocale = Record<TranslationMapKey, Record<string, string>>;
