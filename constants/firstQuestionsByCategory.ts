/**
 * Primeras preguntas por categoría (orden fijo al abrir); el resto va en orden aleatorio.
 * Puedes listar más de cinco IDs por momento si quieres.
 *
 * Las claves deben coincidir exactamente con el id del momento en Notion / momentOptions.
 */
export const FIRST_5_QUESTION_IDS_BY_MOMENT: Record<string, string[]> = {
  'Go Deep 🧠': [
    'ID-115',
    'ID-184',
    'ID-149',
    'ID-133',
    'ID-31',
    'ID-139',
    'ID-191',
    'ID-159',
    'ID-195',
  ],
  'Drinks with Friends 🍸': [
    'ID-280',
    'ID-248',
    'ID-241',
    'ID-235',
    'ID-182',
    'ID-23',
    'ID-29',
    'ID-328',
    'ID-329',
    'ID-148',
  ],
  'On the Road 🚗': ['ID-120', 'ID-24', 'ID-108', 'ID-35', 'ID-32'],
  'Date Night 🌙': ['ID-330', 'ID-181', 'ID-331', 'ID-231', 'ID-260'],
  'Ikigai 🌸': ['ID-196', 'ID-200', 'ID-201', 'ID-202', 'ID-205', 'ID-195'],
  'With Grandparents 💌': ['ID-216', 'ID-214', 'ID-218', 'ID-217', 'ID-208'],
  'Break the Ice 👀': ['ID-281', 'ID-11', 'ID-286', 'ID-285', 'ID-109'],
  'Who is most likely to': ['ID-311', 'ID-304', 'ID-301', 'ID-307', 'ID-300'],
};
