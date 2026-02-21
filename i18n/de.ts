export const de = {
  app: {
    title: 'Shallow',
  },
  onboarding: {
    skip: 'Überspringen',
    next: 'Weiter',
    screens: [
      {
        headline: 'Fragen, die echte Gespräche entfachen.',
        subtext: 'Entdecke witzige, tiefgründige und nachdenkliche Fragen an einem Ort.',
      },
      {
        headline: 'Fragen für den Moment, in dem du bist.',
        subtext:
          'Roadtrip, Date Night, tiefes Gespräch — die Fragen sind nach Kontext sortiert, damit du immer die passenden hast.',
      },
      {
        headline: 'Wischen, zurück, speichern.',
        subtext:
          'Weiterwischen zur nächsten Frage, zurück zur vorherigen, oder Herz antippen um Favoriten zu speichern.',
        cta: 'Los geht\'s',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: 'Was ist der Moment?',
    myFavorites: 'Meine Favoriten',
    start: 'Starten →',
  },
  dev: {
    menuTitle: 'Entwickler-Menü',
    usingBundled: 'Gebündelte Fragen werden verwendet',
    lastUpdatedLabel: 'Zuletzt aktualisiert',
    fetchLatest: 'Neueste Fragen laden',
    resetOnboarding: 'Onboarding zurücksetzen',
    cancel: 'Abbrechen',
    devMenu: 'Dev-Menü',
  },
  alerts: {
    notConfigured: 'Nicht konfiguriert',
    notConfiguredMessage: 'NOTION_API_KEY und NOTION_DATABASE_ID in der .env hinzufügen',
    questionsUpdated: 'Fragen aktualisiert',
    error: 'Fehler',
    fetchFailed: 'Laden fehlgeschlagen',
  },
  favorites: {
    title: 'Meine Favoriten',
    savedQuestions: 'Gespeicherte Fragen',
    remove: 'Entfernen',
    emptyHint: 'Speichere Fragen, indem du das Herz auf einer Karte antippst',
  },
  questions: {
    previous: 'Zurück',
    next: 'Weiter',
    hint: 'Wische oder tippe, um die Frage zu wechseln',
    emptySelectMoment: 'Wähle zuerst einen Moment auf der Startseite',
    emptyNoQuestions: 'Keine Fragen für diesen Moment',
  },
  settings: {
    title: 'Einstellungen',
    language: 'Sprache',
    english: 'English',
    spanish: 'Español',
  },
} as const;
