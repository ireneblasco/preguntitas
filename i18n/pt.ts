export const pt = {
  app: {
    title: 'Shallow',
  },
  onboarding: {
    skip: 'Saltar',
    next: 'Seguinte',
    screens: [
      {
        headline: 'Perguntas que geram conversas de verdade.',
        subtext: 'Descubra perguntas divertidas, profundas e reflexivas num só lugar.',
      },
      {
        headline: 'Perguntas para o momento em que estás.',
        subtext:
          'Viagem, jantar a dois, conversa profunda — as perguntas estão organizadas por contexto para teres sempre as certas.',
      },
      {
        headline: 'Desliza, volta, guarda.',
        subtext:
          'Passa ou desliza para a próxima pergunta, volta atrás ou toca no coração para guardar as favoritas.',
        cta: 'Começar',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: 'Qual é o momento?',
    myFavorites: 'Os meus favoritos',
    start: 'Começar →',
    questionsLabel: 'perguntas',
  },
  dev: {
    menuTitle: 'Menu de programador',
    usingBundled: 'A usar perguntas em pacote',
    lastUpdatedLabel: 'Última atualização',
    fetchLatest: 'Obter perguntas recentes',
    resetOnboarding: 'Repor onboarding',
    cancel: 'Cancelar',
    devMenu: 'Menu Dev',
  },
  alerts: {
    notConfigured: 'Não configurado',
    notConfiguredMessage: 'Adiciona NOTION_API_KEY e NOTION_DATABASE_ID ao .env',
    questionsUpdated: 'Perguntas atualizadas',
    error: 'Erro',
    fetchFailed: 'Falha ao obter',
  },
  favorites: {
    title: 'Os meus favoritos',
    savedQuestions: 'Perguntas guardadas',
    remove: 'Remover',
    emptyHint: 'Guarda perguntas tocando no coração em qualquer cartão',
  },
  questions: {
    previous: 'Anterior',
    next: 'Seguinte',
    hint: 'Desliza ou toca para mudar de pergunta',
    emptySelectMoment: 'Escolhe um momento no início para começar',
    emptyNoQuestions: 'Não há perguntas para este momento',
  },
  settings: {
    title: 'Definições',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;
