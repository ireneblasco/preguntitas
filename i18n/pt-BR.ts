/** Português do Brasil (pt-BR) – vocabulário e formas do português brasileiro */
export const ptBR = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Pular',
    next: 'Próximo',
    screens: [
      {
        headline: 'Deixe a conversa fluir.',
        subtext:
          'Se uma pergunta despertar seu interesse, mergulhe e explore à vontade.',
        tileQuestions: [
          'O que te fez sorrir ultimamente?',
          'Onde você se sente mais você mesmo?',
          'O que desperta sua curiosidade agora?',
          'Como você passaria um dia livre perfeito?',
        ],
      },
      {
        headline: 'Escolha o momento.',
        subtext:
          'Na tela inicial, escolha um momento — cada categoria agrupa perguntas para aquele tipo de situação.',
      },
      {
        headline: 'Prontos — começamos leve.',
        subtext:
          'Abrimos perguntas fáceis para começar. Deslize ou toque quando quiser passar para a próxima.',
        cta: 'Começar',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: 'Qual é o momento?',
    myFavorites: 'Salvos',
    start: 'Começar →',
    questionsLabel: 'perguntas',
    startHere: 'Comece aqui',
    entrySectionTitle: 'Comece aqui',
    breakIceEntry: 'Toque para começar',
    surpriseMe: 'Quebra-gelo',
    surpriseMeDesc: 'Perguntas leves para começar a conversar sem pressão.',
    goDeeper: 'Ir mais fundo',
    goDeeperDesc: 'Conversas que fazem pensar.',
    browseByCategory: 'Por categoria',
    seeAll: 'Ver tudo >',
    premiumTitle: 'Desbloqueie conversas mais profundas',
    premiumSubtitle: 'Acesso ilimitado a todas as categorias e pacotes.',
    goPremium: 'Assinar Premium',
    premiumSoon: 'O Premium ainda não está disponível — avisaremos você.',
    tabHome: 'Início',
    tabSaved: 'Salvos',
    tabSettings: 'Configurações',
  },
  dev: {
    menuTitle: 'Menu do desenvolvedor',
    usingBundled: 'Usando perguntas em pacote',
    lastUpdatedLabel: 'Última atualização',
    fetchLatest: 'Buscar perguntas recentes',
    resetOnboarding: 'Reiniciar onboarding',
    cancel: 'Cancelar',
    devMenu: 'Menu Dev',
  },
  alerts: {
    notConfigured: 'Não configurado',
    notConfiguredMessage: 'Adicione NOTION_API_KEY e NOTION_DATABASE_ID ao .env',
    questionsUpdated: 'Perguntas atualizadas',
    error: 'Erro',
    fetchFailed: 'Falha ao buscar',
  },
  favorites: {
    title: 'Salvos',
    savedQuestions: 'Perguntas salvas',
    remove: 'Remover',
    emptyHint: 'Guarde perguntas tocando no marcador em qualquer cartão',
  },
  questions: {
    previous: 'Anterior',
    next: 'Próximo',
    onboardingProgress: 'Pergunta {{current}} de {{total}}',
    onboardingSkip: 'Pular',
    onboardingDone: 'Pronto',
    onboardingHint: 'Três perguntas rápidas — depois você vai ao início.',
    hint: 'Deslize ou toque para mudar de pergunta',
    emptySelectMoment: 'Escolha um momento na tela inicial para começar',
    emptyNoQuestions: 'Não há perguntas para este momento',
    closenessLabels: {
      level1: 'Nível 1 · Quebra-gelo',
      level2: 'Nível 2 · Pessoal',
      level3: 'Nível 3 · Íntimo',
    },
  },
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;
