import AsyncStorage from '@react-native-async-storage/async-storage';

const QUESTIONS_CACHE_KEY = 'questions_cache';

export interface CachedQuestionsPayload {
  questions: Array<{
    id: string;
    textEn: string;
    textEs: string;
    moment: string[];
  }>;
  momentOptions: Array<{ id: string; name: string; emoji: string }>;
  fetchedAt: string;
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
  momentOptions: CachedQuestionsPayload['momentOptions']
): Promise<void> {
  const payload: CachedQuestionsPayload = {
    questions,
    momentOptions,
    fetchedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(payload));
}
