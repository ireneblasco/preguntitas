import { useMemo } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { translations, getTranslationLocale } from '../i18n';

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function useTranslation() {
  const { locale } = useLocale();
  const translationLocale = getTranslationLocale(locale);
  const dict = translations[translationLocale];

  const t = useMemo(() => {
    return (key: string): string => {
      const value = getByPath(dict, key);
      if (typeof value === 'string') return value;
      if (value != null && typeof value === 'object') return String(value);
      return key;
    };
  }, [dict, locale, translationLocale]);

  const tArray = useMemo(() => {
    return (key: string): string[] => {
      const value = getByPath(dict, key);
      if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
        return value as string[];
      }
      return [];
    };
  }, [dict, locale, translationLocale]);

  return { t, tArray };
}
