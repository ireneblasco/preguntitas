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
    setFavorites((prev) => (prev.includes(questionId) ? prev : [...prev, questionId]));
    await favoritesUtils.addFavorite(questionId);
  }, []);

  const removeFavorite = useCallback(async (questionId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== questionId));
    await favoritesUtils.removeFavorite(questionId);
  }, []);

  const toggleFavorite = useCallback(async (questionId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(questionId);
      return isFav ? prev.filter((id) => id !== questionId) : [...prev, questionId];
    });
    await favoritesUtils.toggleFavorite(questionId);
  }, []);

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
