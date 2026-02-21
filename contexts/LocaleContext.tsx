import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getLocales } from 'expo-localization';
import { getStoredLocale, setStoredLocale, type StoredLocale } from '@/utils/localeStorage';
import { resolveDeviceLocale } from '@/i18n';

type LocaleContextValue = {
  locale: StoredLocale;
  setLocale: (locale: StoredLocale) => Promise<void>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getDeviceLocale(): StoredLocale {
  const first = getLocales()[0];
  const languageTag = first?.languageTag ?? first?.languageCode ?? '';
  return resolveDeviceLocale(languageTag);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<StoredLocale>(getDeviceLocale());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStoredLocale().then((stored) => {
      if (cancelled) return;
      setLocaleState(stored ?? getDeviceLocale());
      setInitialized(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback(async (newLocale: StoredLocale) => {
    await setStoredLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  const value: LocaleContextValue = initialized
    ? { locale, setLocale }
    : { locale: getDeviceLocale(), setLocale };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    const device = getDeviceLocale();
    return {
      locale: device,
      setLocale: async () => {},
    };
  }
  return ctx;
}
