'use strict';

/**
 * EAS Build runs this after install / prebuild / pods (see eas-build-post-install).
 * Only runs Notion fetch when credentials exist; otherwise exits 0 so the build
 * uses committed data/questions.ts.
 */
const { spawnSync } = require('child_process');

function main() {
  const key = process.env.NOTION_API_KEY;
  const db = process.env.NOTION_DATABASE_ID;

  if (!key || !db) {
    console.warn(
      '[eas-post-install] NOTION_API_KEY / NOTION_DATABASE_ID not set; skipping fetch-questions.',
    );
    console.warn(
      '[eas-post-install] Using committed data/questions.ts. Add project env on expo.dev to refresh at build time.',
    );
    process.exit(0);
  }

  const result = spawnSync('npm', ['run', 'fetch-questions'], {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const code = result.status;
  if (code === null) {
    process.exit(1);
  }
  process.exit(code);
}

main();
