export const de = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Überspringen',
    next: 'Weiter',
    screens: [
      {
        headline: 'Lass das Gespräch fließen.',
        subtext:
          'Wenn dich eine Frage neugierig macht, geh ruhig tiefer und entdecke mehr.',
        tileQuestions: [
          'Was hat dich in letzter Zeit zum Lächeln gebracht?',
          'Wo fühlst du dich am meisten du selbst?',
          'Worüber bist du gerade neugierig?',
          'Wie würdest du einen perfekten freien Tag verbringen?',
        ],
      },
      {
        headline: 'Wähl den Moment.',
        subtext:
          'Wähle auf dem Startbildschirm einen Moment — jede Kategorie gruppiert Fragen für diese Art von Situation.',
      },
      {
        headline: 'Jede Karte zeigt, wie tief die Frage geht.',
        subtext:
          'Eine dezente Beschriftung zeigt die Stufe. Beim Wischen siehst du alle Fragen dieses Moments.',
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
    startHere: 'Starte hier',
    entrySectionTitle: 'Starte hier',
    breakIceEntry: 'Tippen zum Start',
    surpriseMe: 'Eis brechen',
    surpriseMeDesc: 'Leichte Fragen, um locker ins Gespräch zu kommen.',
    goDeeper: 'Tiefer gehen',
    goDeeperDesc: 'Gespräche, die zum Nachdenken anregen.',
    browseByCategory: 'Nach Kategorie',
    seeAll: 'Alle anzeigen >',
    premiumTitle: 'Tiefere Gespräche freischalten',
    premiumSubtitle: 'Unbegrenzter Zugang zu allen Kategorien und Paketen.',
    goPremium: 'Premium werden',
    premiumSoon: 'Premium ist noch nicht verfügbar — wir melden uns.',
    tabHome: 'Start',
    tabSaved: 'Gespeichert',
    tabSettings: 'Einstellungen',
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
    closenessLabels: {
      level1: 'Stufe 1 · Eisbrecher',
      level2: 'Stufe 2 · Persönlich',
      level3: 'Stufe 3 · Verletzlich',
    },
  },
  settings: {
    title: 'Einstellungen',
    language: 'Sprache',
    english: 'English',
    spanish: 'Español',
  },
} as const;
