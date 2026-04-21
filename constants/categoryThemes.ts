/**
 * Single source of truth for category card and question card colors.
 * Used on home (category cards), questions (question cards), and saved
 * so each category has a consistent color identity across the app.
 */

export type CategoryTheme = { bg: string; text: string };

/** Primeras 4 desde referencia (fondo + acento); resto igual */
export const CARD_THEMES: readonly CategoryTheme[] = [
  { bg: '#2D584F', text: '#E0FF5A' },   // Deep Talk — Verde bosque + lima (Values/Beliefs)
  { bg: '#FCE29A', text: '#F08051' },   // Road Trip — Melocotón + naranja-rojo (Emotions)
  { bg: '#94D8C8', text: '#37706A' },   // Table Talk — Teal claro + teal oscuro (Stories)
  { bg: '#7A1F3B', text: '#EFC9D6' },   // Date Night — Burdeos + rosa claro (Stories)
  { bg: '#EAC1CC', text: '#6B2A2D' },   // Ikigai
  { bg: '#E0FF5A', text: '#2D584F' },   // Grandparents — mismos que Deep Talk, invertidos (lima + verde bosque)
] as const;

/**
 * Orden en home / onboarding (IDs como en Notion / data/questions).
 * Incluye fallback legacy "Con mi abuela" por cachés antiguas.
 */
const CARD_ORDER_IDS = [
  'Break the Ice 🧊',
  'Drinks with Friends 🍸',
  'Deep Stuff 🧠',
  'Date Night 🌙',
  'Road Trip 🚗',
  'Ikigai 🌸',
  'With Grandparents 💌',
  'Con mi abuela',
] as const;

export function sortMomentOptions<T extends { id: string; name: string }>(options: T[]): T[] {
  const order = [...CARD_ORDER_IDS];
  const ordered: T[] = [];
  for (const id of order) {
    const option = options.find((o) => {
      if (id === 'Con mi abuela') {
        return (
          o.name === 'Con mi abuela' ||
          o.id === 'Con mi abuela' ||
          o.id.startsWith('Con mi abuela') ||
          o.id === 'With Grandparents 💌' ||
          o.name === 'With Grandparents'
        );
      }
      return o.id === id;
    });
    if (option && !ordered.includes(option)) ordered.push(option);
  }
  const rest = options.filter((o) => !ordered.includes(o));
  for (const o of rest) ordered.push(o);
  return ordered;
}

/**
 * Returns the same theme used for this category on the homepage.
 * Use this for question cards and saved screen so colors match the category card.
 */
export function getThemeForMomentId(
  momentId: string,
  momentOptions: Array<{ id: string; name: string; emoji?: string }>
): CategoryTheme {
  const ordered = sortMomentOptions(momentOptions);
  const index = ordered.findIndex((m) => m.id === momentId);
  return CARD_THEMES[index >= 0 ? index % CARD_THEMES.length : 0];
}

/** Display name for categories (e.g. "Con mi abuela" → "Grandparents"). */
export function getCategoryDisplayName(option: { id: string; name: string } | null | undefined): string {
  if (!option) return '';
  const { id, name } = option;
  if (
    name === 'Con mi abuela' ||
    name === 'Con mi abuela 👵' ||
    id === 'Con mi abuela' ||
    id === 'Con mi abuela 👵' ||
    id === 'With Grandparents 💌'
  ) {
    return 'Grandparents';
  }
  return name || id || '';
}
