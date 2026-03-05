/**
 * Single source of truth for category card and question card colors.
 * Used on home (category cards), questions (question cards), and saved
 * so each category has a consistent color identity across the app.
 */

export type CategoryTheme = { bg: string; text: string };

/** Paleta cohesiva estilo iOS (orden = orden de categorías: Deep Talk, Road Trip, Table Talk, Date Night, Ikigai, Grandparents) */
export const CARD_THEMES: readonly CategoryTheme[] = [
  { bg: '#BEE656', text: '#3C6112' },   // Deep Talk: lima / verde bosque
  { bg: '#5B9BD1', text: '#1A2E45' },   // Road Trip: azul intenso / azul oscuro
  { bg: '#C9B8A8', text: '#3D2E28' },   // Table Talks: beige terracota / marrón
  { bg: '#3E614A', text: '#BEE656' },   // Date Night: verde bosque / lima
  { bg: '#EAC1CC', text: '#6B2A2D' },   // Ikigai: rosa polvo / burdeos
  { bg: '#FDCF42', text: '#6B2A2D' },   // Con mi abuela: amarillo dorado / burdeos
] as const;

/** Orden deseado: Deep Talk, Road Trip, Table Talk, Date Night, Ikigai, Grandparents (Con mi abuela) */
const CARD_ORDER_IDS = [
  'Deep Talk 🧠',
  'Road Trip 🚗',
  'Table Talks 🍷',
  'Date Night 🌙',
  'Ikigai 🌸',
  'Con mi abuela',
] as const;

export function sortMomentOptions<T extends { id: string; name: string }>(options: T[]): T[] {
  const order = [...CARD_ORDER_IDS];
  const ordered: T[] = [];
  for (const id of order) {
    const option = options.find((o) => {
      if (id === 'Con mi abuela') return o.name === 'Con mi abuela' || o.id === 'Con mi abuela' || o.id.startsWith('Con mi abuela');
      return o.id === id;
    });
    if (option) ordered.push(option);
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
  if (name === 'Con mi abuela' || name === 'Con mi abuela 👵' || id === 'Con mi abuela' || id === 'Con mi abuela 👵') {
    return 'Grandparents';
  }
  return name || id || '';
}
