import { useState, useEffect, useCallback } from 'react';
import * as favoritesUtils from './favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const loadedFavorites = await favoritesUtils.getFavorites();
    setFavorites(loadedFavorites);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (questionId: string) => {
    await favoritesUtils.addFavorite(questionId);
    await loadFavorites();
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (questionId: string) => {
    await favoritesUtils.removeFavorite(questionId);
    await loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (questionId: string) => {
    const isFav = await favoritesUtils.isFavorite(questionId);
    if (isFav) {
      await removeFavorite(questionId);
    } else {
      await addFavorite(questionId);
    }
  }, [addFavorite, removeFavorite]);

  const isFavorite = useCallback((questionId: string) => {
    return favorites.includes(questionId);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}
