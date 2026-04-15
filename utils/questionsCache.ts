import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question } from '../types/questions';

const QUESTIONS_CACHE_KEY = 'questions_cache';

export interface CachedQuestionsPayload {
  questions: Array<Question | { id: string; textEn?: string; textEs?: string; moment: string[] }>;
  momentOptions: Array<{ id: string; name: string; emoji: string }>;
  fetchedAt: string;
  /** Optional: when present, overrides bundled questionTextByLocale */
  questionTextByLocale?: Record<string, Record<string, string>>;
}

export async function getCachedQuestions(): Promise<CachedQuestionsPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(QUESTIONS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedQuestionsPayload;
    if (!parsed.questions?.length || !parsed.momentOptions?.length || !parsed.fetchedAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setCachedQuestions(
  questions: CachedQuestionsPayload['questions'],
  momentOptions: CachedQuestionsPayload['momentOptions'],
  questionTextByLocale?: CachedQuestionsPayload['questionTextByLocale']
): Promise<void> {
  const payload: CachedQuestionsPayload = {
    questions,
    momentOptions,
    fetchedAt: new Date().toISOString(),
    ...(questionTextByLocale && { questionTextByLocale }),
  };
  await AsyncStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(payload));
}
