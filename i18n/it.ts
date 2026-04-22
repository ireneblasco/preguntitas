export const it = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Salta',
    next: 'Avanti',
    screens: [
      {
        headline: 'Lascia che la conversazione fluisca.',
        subtext: 'Se una domanda ti incuriosisce, approfondisci ed esplora pure.',
        tileQuestions: [
          'Cosa ti ha fatto sorridere di recente?',
          'Dove ti senti più te stesso?',
          'Di cosa sei curioso in questo momento?',
          'Come passeresti una giornata libera perfetta?',
        ],
      },
      {
        headline: 'Scegli il momento.',
        subtext:
          'Nella home scegli un momento: ogni categoria raggruppa domande per quel tipo di situazione.',
      },
      {
        headline: 'Ogni carta mostra il livello di confidenza.',
        subtext:
          'Icebreaker per qualcosa di leggero, Personal per avvicinarsi, Vulnerable per ciò che conta.',
      },
      {
        headline: 'Basta conversazioni noiose.',
        subtext: '',
        cta: 'Inizia',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: 'Qual è il momento?',
    myFavorites: 'Salvati',
    start: 'Inizia →',
    questionsLabel: 'domande',
    startHere: 'Inizia da qui',
    entrySectionTitle: 'Inizia da qui',
    breakIceEntry: 'Tocca per iniziare',
    surpriseMe: 'Rompi il ghiaccio',
    surpriseMeDesc: 'Domande leggere per iniziare a chiacchierare senza imbarazzo.',
    goDeeper: 'Vai più a fondo',
    goDeeperDesc: 'Conversazioni che invitano a riflettere.',
    browseByCategory: 'Per categoria',
    seeAll: 'Vedi tutto >',
    premiumTitle: 'Sblocca conversazioni più profonde',
    premiumSubtitle: 'Accesso illimitato a tutte le categorie e i pacchetti.',
    goPremium: 'Passa a Premium',
    premiumSoon: 'Premium non è ancora disponibile — ti avviseremo.',
    tabHome: 'Home',
    tabSaved: 'Salvati',
    tabSettings: 'Impostazioni',
  },
  dev: {
    menuTitle: 'Menu sviluppatore',
    usingBundled: 'Uso domande in pacchetto',
    lastUpdatedLabel: 'Ultimo aggiornamento',
    fetchLatest: 'Carica domande recenti',
    resetOnboarding: 'Ripristina onboarding',
    cancel: 'Annulla',
    devMenu: 'Menu Dev',
  },
  alerts: {
    notConfigured: 'Non configurato',
    notConfiguredMessage: 'Aggiungi NOTION_API_KEY e NOTION_DATABASE_ID al file .env',
    questionsUpdated: 'Domande aggiornate',
    error: 'Errore',
    fetchFailed: 'Caricamento fallito',
  },
  favorites: {
    title: 'Salvati',
    savedQuestions: 'Domande salvate',
    remove: 'Rimuovi',
    emptyHint: 'Salva le domande toccando il segnalibro su qualsiasi carta',
  },
  questions: {
    previous: 'Precedente',
    next: 'Avanti',
    hint: 'Scorri o tocca per cambiare domanda',
    emptySelectMoment: 'Scegli un momento dalla home per iniziare',
    emptyNoQuestions: 'Nessuna domanda per questo momento',
  },
  settings: {
    title: 'Impostazioni',
    language: 'Lingua',
    english: 'English',
    spanish: 'Español',
  },
} as const;
