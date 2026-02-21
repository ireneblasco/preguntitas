import { enUS } from './en-US';
import { esES } from './es-ES';
import { pt } from './pt';
import { de } from './de';
import { it } from './it';
import { fr } from './fr';
import { enGB } from './en-GB';
import { esMX } from './es-MX';
import { ptBR } from './pt-BR';

// ---------------------------------------------------------------------------
// Claves de traducción: en-US y es-ES son explícitos (inglés EE.UU., español España)
// ---------------------------------------------------------------------------
export type TranslationMapKey =
  | 'en-US'
  | 'es-ES'
  | 'en-GB'
  | 'es-MX'
  | 'pt-BR'
  | 'pt'
  | 'de'
  | 'it'
  | 'fr';

// ---------------------------------------------------------------------------
// Locales soportados por la app (idioma solo o idioma-región ISO)
// Añade aquí nuevos códigos; las cadenas se buscan por idioma base (getTranslationLocale).
// ---------------------------------------------------------------------------
export const SUPPORTED_LOCALES = [
  'en',
  'en-GB',
  'en-US',
  'en-AU',
  'en-CA',
  'es',
  'es-ES',
  'es-MX',
  'es-AR',
  'es-CL',
  'es-CO',
  'pt',
  'pt-BR',
  'pt-PT',
  'de',
  'de-DE',
  'de-AT',
  'de-CH',
  'it',
  'it-IT',
  'fr',
  'fr-FR',
  'fr-CA',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Locales que se muestran en el menú de Ajustes: un idioma por opción, más las variantes
 * regionales con traducción propia (en-GB, es-MX, pt-BR). En-US y es-ES explícitos para el usuario.
 */
export const SETTINGS_MENU_LOCALES = [
  'en-US',
  'en-GB',
  'es-ES',
  'es-MX',
  'pt',
  'pt-BR',
  'de',
  'it',
  'fr',
] as const;

export type SettingsMenuLocale = (typeof SETTINGS_MENU_LOCALES)[number];

/**
 * Para un locale cualquiera (p. ej. en, en-AU, pt-BR), devuelve el locale del menú de Ajustes
 * que lo representa (en-US, es-ES, pt, etc.) para la etiqueta y la selección actual.
 */
export function getSettingsMenuLocale(locale: Locale): SettingsMenuLocale {
  if ((SETTINGS_MENU_LOCALES as readonly string[]).includes(locale)) {
    return locale as SettingsMenuLocale;
  }
  const lang = locale.split('-')[0];
  if (lang === 'en') return 'en-US';
  if (lang === 'es') return 'es-ES';
  const found = SETTINGS_MENU_LOCALES.find((loc) => loc.split('-')[0] === lang);
  return (found ?? SETTINGS_MENU_LOCALES[0]) as SettingsMenuLocale;
}

/**
 * Obtiene la clave de traducción para el locale (en-US, es-ES, en-GB, es-MX, pt-BR, etc.).
 * en / en-US / en-AU → en-US; es / es-ES → es-ES; es-MX → es-MX; en-GB → en-GB.
 */
export function getTranslationLocale(locale: Locale): TranslationMapKey {
  if (locale === 'en-GB' || locale === 'es-MX' || locale === 'pt-BR') return locale;
  const lang = locale.split('-')[0];
  if (lang === 'en') return 'en-US';
  if (lang === 'es') return 'es-ES';
  if (lang === 'pt' || lang === 'de' || lang === 'it' || lang === 'fr') return lang as TranslationMapKey;
  return 'en-US';
}

/** Nombre de cada locale para el selector en Ajustes (idioma y, si aplica, región) */
export const LOCALE_DISPLAY_NAMES: Record<Locale, string> = {
  en: 'English (US)',
  'en-GB': 'English (UK)',
  'en-US': 'English (US)',
  'en-AU': 'English (Australia)',
  'en-CA': 'English (Canada)',
  es: 'Español (España)',
  'es-ES': 'Español (España)',
  'es-MX': 'Español (México)',
  'es-AR': 'Español (Argentina)',
  'es-CL': 'Español (Chile)',
  'es-CO': 'Español (Colombia)',
  pt: 'Português',
  'pt-BR': 'Português (Brasil)',
  'pt-PT': 'Português (Portugal)',
  de: 'Deutsch',
  'de-DE': 'Deutsch (Deutschland)',
  'de-AT': 'Deutsch (Österreich)',
  'de-CH': 'Deutsch (Schweiz)',
  it: 'Italiano',
  'it-IT': 'Italiano (Italia)',
  fr: 'Français',
  'fr-FR': 'Français (France)',
  'fr-CA': 'Français (Canada)',
};

export type Translations = Record<string, unknown>;

const translationMap: Record<TranslationMapKey, Translations> = {
  'en-US': enUS as Translations,
  'es-ES': esES as Translations,
  pt: pt as Translations,
  de: de as Translations,
  it: it as Translations,
  fr: fr as Translations,
  'en-GB': enGB as Translations,
  'es-MX': esMX as Translations,
  'pt-BR': ptBR as Translations,
};

/** Diccionarios por idioma base y, si existen, por locale regional (en-GB, es-MX) */
export const translations: Record<TranslationMapKey, Translations> = translationMap;

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Normaliza un tag BCP 47 para comparar con SUPPORTED_LOCALES (idioma en minúscula, región en mayúscula).
 */
function normalizeLanguageTag(tag: string): string {
  const parts = tag.trim().split('-');
  if (parts.length >= 2) {
    parts[0] = parts[0].toLowerCase();
    parts[1] = parts[1].toUpperCase();
    return parts.join('-');
  }
  return parts[0]?.toLowerCase() ?? '';
}

/**
 * Resuelve un languageTag del dispositivo a un Locale soportado.
 * "en" o "en-US" → en-US; "es" o "es-ES" → es-ES (explícitos de cara al usuario).
 */
export function resolveDeviceLocale(languageTag: string): Locale {
  const normalized = normalizeLanguageTag(languageTag);
  if (normalized === 'en') return 'en-US';
  if (normalized === 'es') return 'es-ES';
  if (isSupportedLocale(normalized)) return normalized;
  const lang = normalized.split('-')[0] ?? '';
  const byLang = SUPPORTED_LOCALES.filter((loc) => loc.split('-')[0] === lang);
  if (byLang.length > 0) {
    if (lang === 'en') return 'en-US';
    if (lang === 'es') return 'es-ES';
    const withRegion = byLang.find((loc) => loc.includes('-'));
    return (withRegion ?? byLang[0]) as Locale;
  }
  return SUPPORTED_LOCALES[0];
}

export { enUS, esES, pt, de, it, fr, enGB, esMX, ptBR };
