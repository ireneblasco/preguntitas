import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { questions as bundledQuestions, momentOptions as bundledMomentOptions } from '@/data/questions';
import { getCachedQuestions, setCachedQuestions } from '@/utils/questionsCache';
import { fetchQuestionsFromNotion } from '@/utils/notionQuestions';

export type Question = {
  id: string;
  textEn: string;
  textEs: string;
  moment: string[];
};

export type MomentOption = {
  id: string;
  name: string;
  emoji: string;
};

type QuestionsContextValue = {
  questions: Question[];
  momentOptions: MomentOption[];
  lastFetchedAt: string | null;
  isLoading: boolean;
  refetchError: string | null;
  refetch: () => Promise<string | null>;
};

const QuestionsContext = createContext<QuestionsContextValue | null>(null);

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(bundledQuestions as Question[]);
  const [momentOptions, setMomentOptions] = useState<MomentOption[]>(
    bundledMomentOptions as MomentOption[]
  );
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchError, setRefetchError] = useState<string | null>(null);

  const apiKey = Constants.expoConfig?.extra?.notionApiKey as string | null;
  const databaseId = Constants.expoConfig?.extra?.notionDatabaseId as string | null;
  const hasCredentials = Boolean(apiKey && databaseId);

  const applyFetchResult = useCallback(
    (questions: Question[], momentOptions: MomentOption[], fetchedAt: string) => {
      setQuestions(questions);
      setMomentOptions(momentOptions);
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
        setQuestions(cached.questions);
        setMomentOptions(cached.momentOptions);
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
        await setCachedQuestions(result.questions, result.momentOptions);
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
      await setCachedQuestions(result.questions, result.momentOptions);
      applyFetchResult(result.questions, result.momentOptions, fetchedAt);
      return fetchedAt;
    } catch (e) {
      setRefetchError(e instanceof Error ? e.message : 'Fetch failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [hasCredentials, apiKey, databaseId, applyFetchResult]);

  const value: QuestionsContextValue = {
    questions,
    momentOptions,
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
