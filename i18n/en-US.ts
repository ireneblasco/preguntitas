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
        headline: 'Questions that spark real conversations.',
        subtext: 'Discover fun, deep, and thoughtful questions in one place.',
      },
      {
        headline: 'Pick the moment.',
        subtext:
          'Road trip, date night, deep talk — the questions are organized by context so you always get the right ones for the situation.',
      },
      {
        headline: 'Each card shows how deep it goes.',
        subtext:
          'Icebreaker for light fun, Personal for getting closer, and Vulnerable for the real stuff.',
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
