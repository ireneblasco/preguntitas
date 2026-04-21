/**
 * Primeras 5 preguntas por categoría: siempre en este orden al abrir la categoría;
 * el resto de preguntas salen en orden aleatorio.
 *
 * Edita cada array con los IDs de las preguntas que quieras como primeras
 * (máximo 5; si pones menos, solo esas irán fijas al inicio).
 * Usa el id del momento tal como en Notion / data/questions (ej. "Deep Stuff 🧠").
 */
export const FIRST_5_QUESTION_IDS_BY_MOMENT: Record<string, string[]> = {
  'Deep Stuff 🧠': ['ID-224', 'ID-139', 'ID-149', 'ID-153', 'ID-181'],
  'Deep Talk 🧠': ['ID-224', 'ID-139', 'ID-149', 'ID-153', 'ID-181'],
  'Ikigai 🌸': ['ID-195', 'ID-199', 'ID-235', 'ID-204', 'ID-203'],
  'Date Night 🌙': ['ID-116', 'ID-10', 'ID-231', 'ID-34', 'ID-29'],
  'Con mi abuela': [],
  'With Grandparents 💌': [],
  'Road Trip 🚗': ['ID-11', 'ID-35', 'ID-109', 'ID-110', 'ID-8'],
  'Drinks with Friends 🍸': ['ID-265', 'ID-248', 'ID-241', 'ID-236', 'ID-21'],
  'Table Talks 🍷': ['ID-265', 'ID-248', 'ID-241', 'ID-236', 'ID-21'],
  'Break the Ice 🧊': [],
};
