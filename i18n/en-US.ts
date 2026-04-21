/** English (United States) – UI strings for en-US locale */
export const enUS = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Skip',
    next: 'Next',
    screens: [
      {
        headline: 'Let the conversation flow.',
        subtext:
          'If a question catches your interest, feel free to dive deeper and explore.',
        tileQuestions: [
          'What made you smile lately?',
          'Where do you feel most like yourself?',
          'What are you curious about right now?',
          'How would you spend a perfect day off?',
        ],
      },
      {
        headline: 'Pick the moment.',
        subtext:
          'On the home screen, choose a moment — each category groups questions for that kind of time together.',
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

export type EnUSTranslations = typeof enUS;
