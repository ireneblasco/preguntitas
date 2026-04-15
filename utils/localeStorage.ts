import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Locale, isSupportedLocale } from '../i18n';

const APP_LANGUAGE_KEY = 'app_language';

export type StoredLocale = Locale;

export async function getStoredLocale(): Promise<StoredLocale | null> {
  try {
    const value = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
    if (value && isSupportedLocale(value)) return value;
    return null;
  } catch (error) {
    console.error('Error reading app language:', error);
    return null;
  }
}

export async function setStoredLocale(locale: StoredLocale): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_LANGUAGE_KEY, locale);
  } catch (error) {
    console.error('Error saving app language:', error);
  }
}
