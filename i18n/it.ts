export const it = {
  app: {
    title: 'Shallow',
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
        headline: 'Domande per il momento in cui sei.',
        subtext:
          'Road trip, appuntamento, conversazione profonda — le domande sono organizzate per contesto così hai sempre quelle giuste.',
      },
      {
        headline: 'Scorri, torna indietro, salva.',
        subtext:
          'Passa o scorri alla prossima domanda, torna alla precedente o tocca il cuore per salvare i preferiti.',
        cta: 'Inizia',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: 'Qual è il momento?',
    myFavorites: 'I miei preferiti',
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
    title: 'I miei preferiti',
    savedQuestions: 'Domande salvate',
    remove: 'Rimuovi',
    emptyHint: 'Salva le domande toccando il cuore su qualsiasi carta',
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
