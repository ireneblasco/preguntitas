require('dotenv').config();

const base = require('./app.json');

module.exports = {
  ...base,
  expo: {
    ...base.expo,
    extra: {
      ...base.expo.extra,
      eas: {
        projectId: 'ce7e9cfd-a831-4d85-ac91-c976f7e9f128',
      },
      notionApiKey: process.env.NOTION_API_KEY ?? null,
      notionDatabaseId: process.env.NOTION_DATABASE_ID ?? null,
    },
  },
};
