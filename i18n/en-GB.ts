/** British English (en-GB) – spelling and wording variants */
export const enGB = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Skip',
    next: 'Next',
    screens: [
      {
        headline: 'Questions that spark real conversations.',
        subtext:
          'Let the conversation flow, and if a question clicks, dive deeper and see where it takes you.',
        tileQuestions: [
          'What made you smile lately?',
          'Where do you feel most like yourself?',
          'What are you curious about right now?',
          'How would you spend a perfect day off?',
        ],
      },
      {
        headline: 'Pick the moment.',
        subtext: 'Each category groups questions for that kind of time together.',
      },
      {
        headline: 'Each card shows how deep it goes.',
        subtext: 'Tap the level to filter, or leave it as Random.',
      },
      {
        headline: 'No more boring conversations.',
        subtext: '',
        cta: "Let's go",
      },
    ],
  },
  home: {
    appName: 'mellow',
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
