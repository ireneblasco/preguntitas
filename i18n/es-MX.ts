/** Español de México (es-MX) – vocabulario y giros mexicanos */
export const esMX = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Saltar',
    next: 'Siguiente',
    screens: [
      {
        headline: 'Deja que la conversación fluya.',
        subtext: 'Si una pregunta te interesa, profundiza y explora con libertad.',
        tileQuestions: [
          '¿Qué te ha hecho sonreír últimamente?',
          '¿Dónde te sientes más tú?',
          '¿Qué te intriga ahorita?',
          '¿Cómo pasarías un día libre perfecto?',
        ],
      },
      {
        headline: 'Elige el momento.',
        subtext:
          'En el inicio, elige un momento: cada categoría agrupa preguntas para ese tipo de situación.',
      },
      {
        headline: 'Cada tarjeta muestra el nivel de confianza.',
        subtext:
          'Icebreaker para algo ligero, Personal para conectar más y Vulnerable para lo que de verdad importa.',
      },
      {
        headline: 'No más conversaciones aburridas.',
        subtext: '',
        cta: 'Vamos',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: '¿Cuál es el momento?',
    myFavorites: 'Guardados',
    start: 'Empezar →',
    questionsLabel: 'preguntas',
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
    title: 'Guardados',
    savedQuestions: 'Preguntas guardadas',
    remove: 'Quitar',
    emptyHint: 'Guarda preguntas tocando el marcador en cualquier tarjeta',
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
