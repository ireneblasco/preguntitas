/** Español de México (es-MX) – vocabulario y giros mexicanos */
export const esMX = {
  app: {
    title: 'Shallow',
  },
  onboarding: {
    skip: 'Saltar',
    next: 'Siguiente',
    screens: [
      {
        headline: 'Preguntas que encienden conversaciones de verdad.',
        subtext: 'Descubre preguntas divertidas, profundas y reflexivas en un solo lugar.',
      },
      {
        headline: 'Preguntas para el momento en el que estás.',
        subtext:
          'Road trip, cita, plática profunda — las preguntas están organizadas por contexto para que siempre tengas las adecuadas.',
      },
      {
        headline: 'Desliza, regresa, guarda.',
        subtext:
          'Pasa o desliza a la siguiente pregunta, regresa a la anterior o toca el corazón para guardar tus favoritas.',
        cta: 'Vamos',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: '¿Cuál es el momento?',
    myFavorites: 'Mis favoritas',
    start: 'Empezar →',
  },
  dev: {
    menuTitle: 'Menú de desarrollo',
    usingBundled: 'Usando preguntas empaquetadas',
    lastUpdatedLabel: 'Última actualización',
    fetchLatest: 'Traer preguntas recientes',
    resetOnboarding: 'Reiniciar onboarding',
    cancel: 'Cancelar',
    devMenu: 'Menú Dev',
  },
  alerts: {
    notConfigured: 'No configurado',
    notConfiguredMessage: 'Agrega NOTION_API_KEY y NOTION_DATABASE_ID al .env',
    questionsUpdated: 'Preguntas actualizadas',
    error: 'Error',
    fetchFailed: 'Error al traer',
  },
  favorites: {
    title: 'Mis favoritas',
    savedQuestions: 'Preguntas guardadas',
    remove: 'Quitar',
    emptyHint: 'Guarda preguntas tocando el corazón en cualquier tarjeta',
  },
  questions: {
    previous: 'Anterior',
    next: 'Siguiente',
    hint: 'Desliza o toca para cambiar de pregunta',
    emptySelectMoment: 'Elige un momento desde el inicio para empezar',
    emptyNoQuestions: 'No hay preguntas para este momento',
  },
  settings: {
    title: 'Configuración',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;
