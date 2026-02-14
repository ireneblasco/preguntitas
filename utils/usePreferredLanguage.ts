import { useMemo } from 'react';
import { getLocales } from 'expo-localization';

export type QuestionLanguage = 'en' | 'es';

/**
 * Returns the preferred language for question text based on device locale.
 * Use 'en' (textEn) when the phone is in English, otherwise 'es' (textEs).
 */
export function usePreferredLanguage(): QuestionLanguage {
  return useMemo(() => {
    const code = getLocales()[0]?.languageCode ?? 'es';
    return code.startsWith('en') ? 'en' : 'es';
  }, []);
}

export function getQuestionText(
  question: { textEn: string; textEs: string },
  lang: QuestionLanguage
): string {
  return lang === 'en' ? question.textEn : question.textEs;
}
