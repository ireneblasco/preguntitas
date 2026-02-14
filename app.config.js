require('dotenv').config();

const base = require('./app.json');

module.exports = {
  ...base,
  expo: {
    ...base.expo,
    extra: {
      notionApiKey: process.env.NOTION_API_KEY ?? null,
      notionDatabaseId: process.env.NOTION_DATABASE_ID ?? null,
    },
  },
};
