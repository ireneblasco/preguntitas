export const de = {
  app: {
    title: 'mellow',
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
        headline: 'Wähl den Moment.',
        subtext:
          'Roadtrip, Date Night, tiefes Gespräch — die Fragen sind nach Kontext sortiert, damit du immer die passenden für die Situation hast.',
      },
      {
        headline: 'Jede Karte zeigt die Tiefe.',
        subtext:
          'Icebreaker für Leichtes, Personal zum Näherkommen, Vulnerable für das Echte.',
      },
      {
        headline: 'Wischen, zurück, speichern.',
        subtext:
          'Weiterwischen zur nächsten Frage, zurück zur vorherigen, oder Lesezeichen antippen zum Speichern.',
      },
      {
        headline: 'Keine langweiligen Gespräche mehr.',
        subtext: '',
        cta: 'Los geht\'s',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: 'Was ist der Moment?',
    myFavorites: 'Gespeichert',
    start: 'Starten →',
    questionsLabel: 'Fragen',
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
    title: 'Gespeichert',
    savedQuestions: 'Gespeicherte Fragen',
    remove: 'Entfernen',
    emptyHint: 'Speichere Fragen, indem du das Lesezeichen auf einer Karte antippst',
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
