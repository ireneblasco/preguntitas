require('dotenv').config();

const base = require('./app.json');

module.exports = {
  ...base,
  expo: {
    ...base.expo,
    splash: {
      ...base.expo.splash,
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF',
    },
    ios: {
      ...base.expo.ios,
      splash: {
        ...base.expo.ios?.splash,
        backgroundColor: '#FFFFFF',
      },
      infoPlist: {
        ...base.expo.ios?.infoPlist,
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      ...base.expo.android,
      splash: {
        ...base.expo.android?.splash,
        backgroundColor: '#FFFFFF',
      },
      adaptiveIcon: {
        ...base.expo.android?.adaptiveIcon,
        backgroundColor: '#FFFFFF',
      },
    },
    extra: {
      ...base.expo.extra,
      eas: {
        projectId: 'ce7e9cfd-a831-4d85-ac91-c976f7e9f128',
      },
      notionDatabaseId: process.env.NOTION_DATABASE_ID ?? null,
    },
  },
};
