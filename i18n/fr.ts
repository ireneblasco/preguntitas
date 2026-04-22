export const fr = {
  app: {
    title: 'mellow',
  },
  onboarding: {
    skip: 'Passer',
    next: 'Suivant',
    screens: [
      {
        headline: 'Laisse la conversation s\'installer.',
        subtext:
          'Si une question t\'intéresse, n\'hésite pas à creuser et explorer.',
        tileQuestions: [
          'Qu’est-ce qui t’a fait sourire récemment ?',
          'Où te sens-tu le plus toi-même ?',
          'Qu’est-ce qui t’intrigue en ce moment ?',
          'Comment passerais-tu une journée libre parfaite ?',
        ],
      },
      {
        headline: 'Choisis le moment.',
        subtext:
          'Sur l’écran d’accueil, choisis un moment — chaque catégorie regroupe des questions adaptées au contexte.',
      },
      {
        headline: 'Chaque carte affiche le niveau de proximité.',
        subtext:
          'Icebreaker pour du léger, Personal pour se rapprocher, Vulnerable pour l’essentiel.',
      },
      {
        headline: 'Fini les conversations ennuyeuses.',
        subtext: '',
        cta: 'C\'est parti',
      },
    ],
  },
  home: {
    appName: 'mellow',
    sectionTitle: 'C\'est quoi le moment ?',
    myFavorites: 'Enregistrés',
    start: 'Commencer →',
    questionsLabel: 'questions',
    startHere: 'Par ici',
    entrySectionTitle: 'Par ici',
    breakIceEntry: 'Appuyer pour commencer',
    surpriseMe: 'Brise-glace',
    surpriseMeDesc: 'Questions simples pour lancer la conversation sans pression.',
    goDeeper: 'Aller plus loin',
    goDeeperDesc: 'Des conversations qui font réfléchir.',
    browseByCategory: 'Par catégorie',
    seeAll: 'Tout voir >',
    premiumTitle: 'Débloque des conversations plus profondes',
    premiumSubtitle: 'Accès illimité à toutes les catégories et packs.',
    goPremium: 'Passer à Premium',
    premiumSoon: 'Le Premium n’est pas encore disponible — on te préviendra.',
    tabHome: 'Accueil',
    tabSaved: 'Enregistrés',
    tabSettings: 'Réglages',
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
