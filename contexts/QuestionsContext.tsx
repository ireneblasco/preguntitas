import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import {
  questions as bundledQuestions,
  momentOptions as bundledMomentOptions,
} from '../data/questions';
import { getCachedQuestions, setCachedQuestions } from '../utils/questionsCache';
import { fetchQuestionsFromNotion, type FetchedQuestion } from '../utils/notionQuestions';
import type { Question } from '../types/questions';

export type { Question } from '../types/questions';

export type MomentOption = {
  id: string;
  name: string;
  emoji: string;
};

type QuestionsContextValue = {
  questions: Question[];
  momentOptions: MomentOption[];
  questionTextByLocale: Record<string, Record<string, string>>;
  lastFetchedAt: string | null;
  isLoading: boolean;
  refetchError: string | null;
  refetch: () => Promise<string | null>;
};

const QuestionsContext = createContext<QuestionsContextValue | null>(null);

const bundledQuestionTextByLocale: Record<string, Record<string, string>> = {
  'en-US': Object.fromEntries(
    bundledQuestions.map((q) => [q.id, q.text?.['en-US'] ?? q.text?.['es-ES'] ?? ''])
  ),
  'es-ES': Object.fromEntries(
    bundledQuestions.map((q) => [q.id, q.text?.['es-ES'] ?? q.text?.['en-US'] ?? ''])
  ),
};

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(bundledQuestions);
  const [momentOptions, setMomentOptions] = useState<MomentOption[]>(bundledMomentOptions);
  const [questionTextByLocale, setQuestionTextByLocale] = useState(bundledQuestionTextByLocale);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchError, setRefetchError] = useState<string | null>(null);

  const apiKey = Constants.expoConfig?.extra?.notionApiKey as string | null;
  const databaseId = Constants.expoConfig?.extra?.notionDatabaseId as string | null;
  const hasCredentials = Boolean(apiKey && databaseId);

  const applyFetchResult = useCallback(
    (fetched: FetchedQuestion[], momentOptions: MomentOption[], fetchedAt: string) => {
      setQuestions(
        fetched.map((q) => ({
          id: q.id,
          moment: q.moment,
          ...(q.closenessLevel != null && { closenessLevel: q.closenessLevel }),
        }))
      );
      setMomentOptions(momentOptions);
      setQuestionTextByLocale((prev) => ({
        ...prev,
        'en-US': Object.fromEntries(fetched.map((q) => [q.id, q.text['en-US']])),
        'es-ES': Object.fromEntries(fetched.map((q) => [q.id, q.text['es-ES']])),
      }));
      setLastFetchedAt(fetchedAt);
      setRefetchError(null);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await getCachedQuestions();
      if (cancelled) return;
      if (cached) {
        setQuestions(
          (cached.questions as Array<{ id: string; moment: string[]; closenessLevel?: 1 | 2 | 3 }>).map(
            (q) => ({
              id: q.id,
              moment: q.moment,
              ...(q.closenessLevel != null && { closenessLevel: q.closenessLevel }),
            })
          )
        );
        setMomentOptions(cached.momentOptions);
        if (cached.questionTextByLocale) setQuestionTextByLocale(cached.questionTextByLocale);
        setLastFetchedAt(cached.fetchedAt);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasCredentials) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await fetchQuestionsFromNotion(apiKey!, databaseId!);
        if (cancelled) return;
        const fetchedAt = new Date().toISOString();
        await setCachedQuestions(
          result.questions.map((q) => ({
            id: q.id,
            moment: q.moment,
            ...(q.closenessLevel != null && { closenessLevel: q.closenessLevel }),
          })),
          result.momentOptions,
          {
            ...bundledQuestionTextByLocale,
            'en-US': Object.fromEntries(result.questions.map((q) => [q.id, q.text['en-US']])),
            'es-ES': Object.fromEntries(result.questions.map((q) => [q.id, q.text['es-ES']])),
          }
        );
        if (cancelled) return;
        applyFetchResult(result.questions, result.momentOptions, fetchedAt);
      } catch (_e) {
        if (!cancelled) setRefetchError(_e instanceof Error ? _e.message : 'Fetch failed');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasCredentials, apiKey, databaseId, applyFetchResult]);

  const refetch = useCallback(async (): Promise<string | null> => {
    if (!hasCredentials) {
      setRefetchError('Not configured: add NOTION_API_KEY and NOTION_DATABASE_ID to .env');
      return null;
    }
    setIsLoading(true);
    setRefetchError(null);
    try {
      const result = await fetchQuestionsFromNotion(apiKey!, databaseId!);
      const fetchedAt = new Date().toISOString();
      await setCachedQuestions(
        result.questions.map((q) => ({
          id: q.id,
          moment: q.moment,
          ...(q.closenessLevel != null && { closenessLevel: q.closenessLevel }),
        })),
        result.momentOptions,
        {
          ...bundledQuestionTextByLocale,
          'en-US': Object.fromEntries(result.questions.map((q) => [q.id, q.text['en-US']])),
          'es-ES': Object.fromEntries(result.questions.map((q) => [q.id, q.text['es-ES']])),
        }
      );
      applyFetchResult(result.questions, result.momentOptions, fetchedAt);
      return fetchedAt;
    } catch (e) {
      setRefetchError(e instanceof Error ? e.message : 'Fetch failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [hasCredentials, apiKey, databaseId, applyFetchResult]);

  const momentOptionsDisplay = useMemo(
    () =>
      momentOptions.map((m) =>
        m.id.includes('Road Trip') || m.name === 'Road Trip' || m.id.includes('On the Road') || m.name === 'On the Road'
          ? { ...m, emoji: '🌎' }
          : m
      ),
    [momentOptions]
  );

  const value: QuestionsContextValue = {
    questions,
    momentOptions: momentOptionsDisplay,
    questionTextByLocale,
    lastFetchedAt,
    isLoading,
    refetchError,
    refetch,
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions(): QuestionsContextValue {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error('useQuestions must be used within QuestionsProvider');
  return ctx;
}
