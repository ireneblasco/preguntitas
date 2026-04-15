import { useLocale } from '../contexts/LocaleContext';
import { getTranslationLocale, type Locale } from '../i18n';

export type QuestionLanguage = Locale;

/**
 * Returns the preferred language for question text.
 * Uses app locale from LocaleContext (device at start, or user choice from Settings).
 */
export function usePreferredLanguage(): QuestionLanguage {
  const { locale } = useLocale();
  return locale;
}

/** Devuelve el texto de la pregunta para el locale (textos por locale en questionTextByLocale). */
export function getQuestionText(
  question: { id: string },
  lang: QuestionLanguage,
  questionTextByLocale: Record<string, Record<string, string>>
): string {
  const key = getTranslationLocale(lang);
  const byLocale = questionTextByLocale[key];
  return byLocale?.[question.id] ?? questionTextByLocale['es-ES']?.[question.id] ?? questionTextByLocale['en-US']?.[question.id] ?? '';
}
