import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export async function getFavorites(): Promise<string[]> {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export async function addFavorite(questionId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(questionId)) {
      favorites.push(questionId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

export async function removeFavorite(questionId: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((id) => id !== questionId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export async function isFavorite(questionId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(questionId);
}

export async function toggleFavorite(questionId: string): Promise<boolean> {
  const isCurrentlyFavorite = await isFavorite(questionId);
  if (isCurrentlyFavorite) {
    await removeFavorite(questionId);
    return false;
  } else {
    await addFavorite(questionId);
    return true;
  }
}
