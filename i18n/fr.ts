export const fr = {
  app: {
    title: 'Mellow',
  },
  onboarding: {
    skip: 'Passer',
    next: 'Suivant',
    screens: [
      {
        headline: 'Des questions qui font naître de vraies conversations.',
        subtext: 'Découvre des questions amusantes, profondes et réfléchies en un seul endroit.',
      },
      {
        headline: 'Choisis le moment.',
        subtext:
          'Road trip, rendez-vous, conversation profonde — les questions sont organisées par contexte pour avoir toujours les bonnes.',
      },
      {
        headline: 'Chaque carte affiche le niveau de proximité.',
        subtext:
          'Icebreaker pour du léger, Personal pour se rapprocher, Vulnerable pour l’essentiel.',
      },
      {
        headline: 'Glisse, reviens, enregistre.',
        subtext:
          'Passe ou glisse à la question suivante, reviens en arrière ou appuie sur le signet pour enregistrer.',
      },
      {
        headline: 'Fini les conversations ennuyeuses.',
        subtext: '',
        cta: 'C\'est parti',
      },
    ],
  },
  home: {
    appName: 'Mellow',
    sectionTitle: 'C\'est quoi le moment ?',
    myFavorites: 'Enregistrés',
    start: 'Commencer →',
    questionsLabel: 'questions',
  },
  dev: {
    menuTitle: 'Menu développeur',
    usingBundled: 'Utilisation des questions en paquet',
    lastUpdatedLabel: 'Dernière mise à jour',
    fetchLatest: 'Récupérer les questions récentes',
    resetOnboarding: 'Réinitialiser l\'onboarding',
    cancel: 'Annuler',
    devMenu: 'Menu Dev',
  },
  alerts: {
    notConfigured: 'Non configuré',
    notConfiguredMessage: 'Ajoute NOTION_API_KEY et NOTION_DATABASE_ID au fichier .env',
    questionsUpdated: 'Questions mises à jour',
    error: 'Erreur',
    fetchFailed: 'Échec du chargement',
  },
  favorites: {
    title: 'Enregistrés',
    savedQuestions: 'Questions enregistrées',
    remove: 'Retirer',
    emptyHint: 'Enregistre des questions en appuyant sur le signet sur n\'importe quelle carte',
  },
  questions: {
    previous: 'Précédent',
    next: 'Suivant',
    hint: 'Glisse ou appuie pour changer de question',
    emptySelectMoment: 'Choisis un moment depuis l\'accueil pour commencer',
    emptyNoQuestions: 'Aucune question pour ce moment',
  },
  settings: {
    title: 'Paramètres',
    language: 'Langue',
    english: 'English',
    spanish: 'Español',
  },
} as const;
