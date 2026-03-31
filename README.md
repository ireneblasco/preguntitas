Expo SDK 54 app (Expo Router, React Native). Project structure and data flow are described in [CLAUDE.md](./CLAUDE.md).

## Localisation (locale and region)

The app uses **ISO-style locales**: language only (`en`, `es`) or language + region (`en-GB`, `es-MX`, `pt-BR`). The device `languageTag` (e.g. from `getLocales()[0].languageTag`) is resolved to a supported locale via `resolveDeviceLocale()` in `i18n/index.ts`.

- **Locale**: full value shown in Settings and stored in AsyncStorage (e.g. `en-US`, `es-MX`). Defined in `SUPPORTED_LOCALES`.
- **Translation locale**: base language used to load UI strings from `i18n/xx.ts`. Derived with `getTranslationLocale(locale)` (e.g. `es-MX` → `es`). So one translation file per language; regions share it unless you add region-specific overrides later.

| Language   | Base | Supported locales (examples)                    |
| ---------- | ---- | ----------------------------------------------- |
| English    | en   | en, en-GB, en-US, en-AU, en-CA                  |
| Spanish    | es   | es, es-ES, es-MX, es-AR, es-CL, es-CO          |
| Portuguese | pt   | pt, pt-BR, pt-PT                               |
| German     | de   | de, de-DE, de-AT, de-CH                        |
| Italian    | it   | it, it-IT                                      |
| French     | fr   | fr, fr-FR, fr-CA                               |

**To add a new region** for an existing language: add the code to `SUPPORTED_LOCALES` and a label to `LOCALE_DISPLAY_NAMES` in `i18n/index.ts`. No new translation file; strings stay from the base language.

**To add a new language**: add the base code to `TRANSLATION_LOCALES`, create `i18n/xx.ts`, add it to `translations`, and add at least one locale (e.g. `xx` or `xx-YY`) to `SUPPORTED_LOCALES` and `LOCALE_DISPLAY_NAMES`. Device detection works via `resolveDeviceLocale(languageTag)` using the first segment of the tag (e.g. `xx-YY` → base `xx`).

Question content (from Notion) currently has English and Spanish only; other UI languages show English until you add more fields to the data.

## Local development

1. Create `.env` with `NOTION_API_KEY` and `NOTION_DATABASE_ID`. `app.config.js` reads them for `expo.extra` and local tooling.
2. Install and start:

```bash
npm install
npm start
```

`prestart` runs `fetch-questions` (Notion → `data/questions.ts`). To start Metro without fetching, run `npx expo start` directly.

Other scripts: `npm run ios` / `npm run android` (dev clients via `expo run:*`), `npm run lint`, `npm run build:web` (static web export).

## Build and publish (EAS)

Store binaries are built with [EAS Build](https://docs.expo.dev/build/introduction/). This repo uses **`eas.json`** and links the project via **`expo.extra.eas.projectId`** in `app.config.js` (required when using dynamic config instead of `app.json` only).

### One-time setup

1. Install and log in: `npm install -g eas-cli` then `eas login`.
2. **iOS:** Apple Developer account; App Store Connect app whose bundle ID matches `app.json` → `expo.ios.bundleIdentifier`. Run `eas credentials` when the CLI prompts you (distribution cert / provisioning).
3. **Android:** Play Console app; matching `expo.android.package`. Configure upload keystore via `eas credentials` if needed.
4. **Notion on EAS:** `eas-build-post-install` runs `scripts/eas-post-install.cjs`, which calls `fetch-questions` only when `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set on the worker; otherwise it **exits successfully** and the build uses committed `data/questions.ts`. Set [EAS environment variables / secrets](https://docs.expo.dev/build-reference/variables/) for both that step and `expo.extra` at build time (`app.config.js`). Local `.env` is not uploaded by default.

### Version numbers (before each store upload)

- **`expo.version`** in `app.json` — user-facing version (e.g. `1.0.1`).
- **iOS:** set or bump **`expo.ios.buildNumber`** (string, must increase per TestFlight/App Store upload), or use `ios.autoIncrement` on the EAS build profile ([app versions](https://docs.expo.dev/build-reference/app-versions/)).
- **Android:** bump **`expo.android.versionCode`** (integer) for each Play upload.

### Build

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

Use `eas build --platform all --profile production` for both. Profiles are defined in `eas.json` (`development` / `preview` / `production`).

### Submit to the stores

After a successful build:

```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```

First run: provide an [App Store Connect API key](https://docs.expo.dev/submit/ios/) and/or [Google Play service account](https://docs.expo.dev/submit/android/) when prompted; later submissions reuse them.

**TestFlight:** when `eas submit` finishes, open [App Store Connect](https://appstoreconnect.apple.com/) → your app → **TestFlight**, wait for processing, complete compliance if asked, then add testers.

**Play internal / production:** use the Play Console once the `.aab` from submit is accepted.

### Useful links

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [iOS app.json / credentials](https://docs.expo.dev/build-reference/app-versions/)
