export const fr = {
  app: {
    title: 'Shallow',
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
        headline: 'Des questions pour le moment où tu es.',
        subtext:
          'Road trip, rendez-vous, conversation profonde — les questions sont organisées par contexte pour avoir toujours les bonnes.',
      },
      {
        headline: 'Glisse, reviens, enregistre.',
        subtext:
          'Passe ou glisse à la question suivante, reviens en arrière ou appuie sur le cœur pour enregistrer tes favoris.',
        cta: 'C\'est parti',
      },
    ],
  },
  home: {
    appName: 'Shallow',
    sectionTitle: 'C\'est quoi le moment ?',
    myFavorites: 'Mes favoris',
    start: 'Commencer →',
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
    title: 'Mes favoris',
    savedQuestions: 'Questions enregistrées',
    remove: 'Retirer',
    emptyHint: 'Enregistre des questions en appuyant sur le cœur sur n\'importe quelle carte',
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
