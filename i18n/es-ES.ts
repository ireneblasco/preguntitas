/** Español (España) – UI strings for es-ES locale */
export const esES = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Omitir',
    next: 'Siguiente',
    screens: [
      {
        headline: 'Deja que la conversación fluya.',
        subtext: 'Si una pregunta te interesa, profundiza y explora con libertad.',
        tileQuestions: [
          '¿Qué te ha hecho sonreír últimamente?',
          '¿Dónde te sientes más tú?',
          '¿Qué te intriga ahora mismo?',
          '¿Cómo pasarías un día libre perfecto?',
        ],
      },
      {
        headline: 'Elige el momento.',
        subtext:
          'En el inicio, elige un momento: cada categoría agrupa preguntas para ese tipo de situación.',
      },
      {
        headline: 'Listos: empezamos suave.',
        subtext:
          'Te llevamos a preguntas ligeras para arrancar. Desliza o toca cuando quieras la siguiente.',
        cta: 'Empezar',
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
    surpriseMeDesc: 'Preguntas ligeras para arrancar la charla sin complicaciones.',
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
    fetchLatest: 'Obtener preguntas recientes',
    resetOnboarding: 'Reiniciar onboarding',
    cancel: 'Cancelar',
    devMenu: 'Menú Dev',
  },
  alerts: {
    notConfigured: 'No configurado',
    notConfiguredMessage: 'Añade NOTION_API_KEY y NOTION_DATABASE_ID al .env',
    questionsUpdated: 'Preguntas actualizadas',
    error: 'Error',
    fetchFailed: 'Error al obtener',
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
    onboardingProgress: 'Pregunta {{current}} de {{total}}',
    onboardingSkip: 'Saltar',
    onboardingDone: 'Listo',
    onboardingHint: 'Tres preguntas rápidas; después irás al inicio.',
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
    title: 'Ajustes',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;

export type EsESTranslations = typeof esES;
