/** British English (en-GB) – spelling and wording variants */
export const enGB = {
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
          'Road trip, date night, deep talk — the questions are organised by context so you always get the right ones for the situation.',
      },
      {
        headline: 'Each card shows how deep it goes.',
        subtext:
          'Icebreaker for light fun, Personal for getting closer, and Vulnerable for the real stuff.',
      },
      {
        headline: 'Swipe, go back, save.',
        subtext:
          'Pass or swipe to the next question, go back to the previous one, and tap the bookmark to save.',
        cta: "Let's go",
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: "What's the moment?",
    myFavorites: 'Saved',
    start: 'Start →',
    questionsLabel: 'questions',
  },
  dev: {
    menuTitle: 'Developer menu',
    usingBundled: 'Using bundled questions',
    lastUpdatedLabel: 'Last updated',
    fetchLatest: 'Fetch latest questions',
    resetOnboarding: 'Reset onboarding',
    cancel: 'Cancel',
    devMenu: 'Dev menu',
  },
  alerts: {
    notConfigured: 'Not configured',
    notConfiguredMessage: 'Add NOTION_API_KEY and NOTION_DATABASE_ID to .env',
    questionsUpdated: 'Questions updated',
    error: 'Error',
    fetchFailed: 'Fetch failed',
  },
  favorites: {
    title: 'Saved',
    savedQuestions: 'Saved questions',
    remove: 'Remove',
    emptyHint: 'Save questions by tapping the bookmark on any card',
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
