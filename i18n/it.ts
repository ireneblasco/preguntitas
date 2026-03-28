export const it = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Salta',
    next: 'Avanti',
    screens: [
      {
        headline: 'Domande che accendono conversazioni vere.',
        subtext: 'Scopri domande divertenti, profonde e riflessive in un solo posto.',
      },
      {
        headline: 'Scegli il momento.',
        subtext:
          'Road trip, serata romantica, conversazione profonda — le domande sono organizzate per contesto così hai sempre quelle giuste per la situazione.',
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
