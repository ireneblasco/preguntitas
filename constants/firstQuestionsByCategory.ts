/**
 * Primeras 5 preguntas por categoría: siempre en este orden al abrir la categoría;
 * el resto de preguntas salen en orden aleatorio.
 *
 * Edita cada array con los IDs de las preguntas que quieras como primeras
 * (máximo 5; si pones menos, solo esas irán fijas al inicio).
 * Usa el id del momento tal como aparece en la app (ej. "Deep Talk 🧠", "Date Night 🌙").
 */
export const FIRST_5_QUESTION_IDS_BY_MOMENT: Record<string, string[]> = {
  'Deep Talk 🧠': ['ID-224', 'ID-139', 'ID-149', 'ID-153', 'ID-181'],
  'Ikigai 🌸': ['ID-195', 'ID-199', 'ID-235', 'ID-204', 'ID-203'],
  'Date Night 🌙': ['ID-116', 'ID-10', 'ID-231', 'ID-34', 'ID-29'],
  'Con mi abuela': [],
  'Road Trip 🚗': ['ID-11','ID-35', 'ID-109', 'ID-110', 'ID-8'],
  'Table Talks 🍷': ['ID-158', 'ID-4', 'ID-3', 'ID-144','ID-21'],
};
