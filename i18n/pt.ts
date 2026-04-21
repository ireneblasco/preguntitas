export const pt = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Saltar',
    next: 'Seguinte',
    screens: [
      {
        headline: 'Deixa a conversa fluir.',
        subtext:
          'Se uma pergunta despertar o teu interesse, mergulha e explora à vontade.',
        tileQuestions: [
          'O que te fez sorrir ultimamente?',
          'Onde te sentes mais tu mesmo?',
          'O que desperta a tua curiosidade agora?',
          'Como passarias um dia livre perfeito?',
        ],
      },
      {
        headline: 'Escolhe o momento.',
        subtext:
          'No ecrã inicial, escolhe um momento — cada categoria agrupa perguntas para esse tipo de situação.',
      },
      {
        headline: 'Cada cartão mostra o nível de confiança.',
        subtext:
          'Icebreaker para algo leve, Personal para aproximar e Vulnerable para o que importa.',
      },
      {
        headline: 'Chega de conversas sem graça.',
        subtext: '',
        cta: 'Começar',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: 'Qual é o momento?',
    myFavorites: 'Guardados',
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
    title: 'Guardados',
    savedQuestions: 'Perguntas guardadas',
    remove: 'Remover',
    emptyHint: 'Guarda perguntas tocando no marcador em qualquer cartão',
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
