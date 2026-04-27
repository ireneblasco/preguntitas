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
        headline: 'Cada tarjeta indica qué tan profunda es la pregunta.',
        subtext:
          'Verás una etiqueta discreta con el nivel. Al deslizar aparecen todas las preguntas de ese momento.',
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
    startHere: 'Empieza aquí',
    entrySectionTitle: 'Empieza aquí',
    breakIceEntry: 'Toca para empezar',
    surpriseMe: 'Rompe el hielo',
    surpriseMeDesc: 'Preguntas ligeras para arrancar la plática sin complicaciones.',
    goDeeper: 'Ir más hondo',
    goDeeperDesc: 'Conversaciones que invitan a reflexionar.',
    browseByCategory: 'Por categoría',
    seeAll: 'Ver todo >',
    premiumTitle: 'Desbloquea conversaciones más profundas',
    premiumSubtitle: 'Acceso ilimitado a todas las categorías y paquetes.',
    goPremium: 'Hazte Premium',
    premiumSoon: 'El plan Premium aún no está disponible — te avisaremos.',
    tabHome: 'Inicio',
    tabSaved: 'Guardados',
    tabSettings: 'Ajustes',
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
    closenessLabels: {
      level1: 'Nivel 1 · Rompehielos',
      level2: 'Nivel 2 · Personal',
      level3: 'Nivel 3 · Íntima',
    },
  },
  settings: {
    title: 'Configuración',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;
