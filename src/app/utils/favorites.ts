export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

export function addFavorite(questionId: string): void {
  if (typeof window === "undefined") return;
  const favorites = getFavorites();
  if (!favorites.includes(questionId)) {
    favorites.push(questionId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

export function removeFavorite(questionId: string): void {
  if (typeof window === "undefined") return;
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== questionId);
  localStorage.setItem("favorites", JSON.stringify(updated));
}

export function isFavorite(questionId: string): boolean {
  const favorites = getFavorites();
  return favorites.includes(questionId);
}

