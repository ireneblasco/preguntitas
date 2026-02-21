export const en = {
  app: {
    title: 'Shallow',
  },
  onboarding: {
    skip: 'Skip',
    next: 'Next',
    screens: [
      {
        headline: 'Questions that spark real conversations.',
        subtext: 'Discover fun, deep, and thoughtful questions in one place.',
      },
      {
        headline: "Questions for the moment you're in.",
        subtext:
          'Road trip, date night, deep talk — the questions are organized by context so you always get the right ones for the situation.',
      },
      {
        headline: 'Swipe, go back, save.',
        subtext:
          'Pass or swipe to the next question, go back to the previous one, and tap the heart to save your favorites.',
        cta: "Let's Go",
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: "What's the moment?",
    myFavorites: 'My favorites',
    start: 'Start →',
  },
  dev: {
    menuTitle: 'Developer Menu',
    usingBundled: 'Using bundled questions',
    lastUpdatedLabel: 'Last updated',
    fetchLatest: 'Fetch latest questions',
    resetOnboarding: 'Reset Onboarding',
    cancel: 'Cancel',
    devMenu: 'Dev Menu',
  },
  alerts: {
    notConfigured: 'Not configured',
    notConfiguredMessage: 'Add NOTION_API_KEY and NOTION_DATABASE_ID to .env',
    questionsUpdated: 'Questions updated',
    error: 'Error',
    fetchFailed: 'Fetch failed',
  },
  favorites: {
    title: 'My favorites',
    savedQuestions: 'Saved questions',
    remove: 'Remove',
    emptyHint: 'Save questions by tapping the heart on any card',
  },
  questions: {
    previous: 'Previous',
    next: 'Next',
    hint: 'Swipe or tap to change question',
    emptySelectMoment: 'Select a moment from home to start',
    emptyNoQuestions: 'No questions for this moment',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    english: 'English',
    spanish: 'Español',
  },
} as const;

export type EnTranslations = typeof en;
