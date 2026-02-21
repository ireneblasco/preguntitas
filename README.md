This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
