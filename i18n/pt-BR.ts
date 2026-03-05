/** Português do Brasil (pt-BR) – vocabulário e formas do português brasileiro */
export const ptBR = {
  app: {
    title: 'Shallow',
  },
  onboarding: {
    skip: 'Pular',
    next: 'Próximo',
    screens: [
      {
        headline: 'Perguntas que geram conversas de verdade.',
        subtext: 'Descubra perguntas divertidas, profundas e reflexivas em um só lugar.',
      },
      {
        headline: 'Escolha o momento.',
        subtext:
          'Viagem, jantar a dois, conversa profunda — as perguntas estão organizadas por contexto para você sempre ter as certas.',
      },
      {
        headline: 'Cada cartão mostra o nível de intimidade.',
        subtext:
          'Icebreaker para algo leve, Personal para aproximar e Vulnerable para o que importa.',
      },
      {
        headline: 'Deslize, volte, guarde.',
        subtext:
          'Passe ou deslize para a próxima pergunta, volte à anterior ou toque no marcador para guardar.',
      },
      {
        headline: 'Chega de conversas sem graça.',
        subtext: '',
        cta: 'Começar',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: 'Qual é o momento?',
    myFavorites: 'Salvos',
    start: 'Começar →',
    questionsLabel: 'perguntas',
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
    hint: 'Deslize ou toque para mudar de pergunta',
    emptySelectMoment: 'Escolha um momento na tela inicial para começar',
    emptyNoQuestions: 'Não há perguntas para este momento',
  },
  settings: {
    title: 'Configurações',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
} as const;
