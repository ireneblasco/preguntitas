import { useLocale } from '@/contexts/LocaleContext';
import { getTranslationLocale, type Locale } from '@/i18n';

export type QuestionLanguage = Locale;

/**
 * Returns the preferred language for question text.
 * Uses app locale from LocaleContext (device at start, or user choice from Settings).
 */
export function usePreferredLanguage(): QuestionLanguage {
  const { locale } = useLocale();
  return locale;
}

/** Preguntas tienen textEn y textEs; el locale de traducción determina qué campo usar. */
export function getQuestionText(
  question: { textEn: string; textEs: string },
  lang: QuestionLanguage
): string {
  const key = getTranslationLocale(lang);
  const useSpanish = key === 'es' || key === 'es-MX';
  return useSpanish ? question.textEs : question.textEn;
}
