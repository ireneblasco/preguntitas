# Shallow (SwiftUI)

Native iOS app mirroring the **Question Spot / Shallow** Expo app: moments, swipeable questions, favorites, Notion sync, and bilingual UI (English / Spanish strings in this repo; device language drives UI).

## Requirements

- Xcode 15+ (Swift 5.9+), iOS 17 deployment target
- Git worktree branch `swiftui-native` (iOS-only tree; Expo sources live on `main` elsewhere)

## Open the project

```bash
open Preguntitas.xcodeproj
```

## Bundled questions (`questions.json`)

Default data ships in `Preguntitas/Resources/questions.json`. To refresh from Notion:

1. In the **Expo** repo run `npm run fetch-questions` (writes `data/questions.ts` and `data/questions.json`).
2. Copy `data/questions.json` into this repo at `Preguntitas/Resources/questions.json` and commit.

## Notion at runtime (optional)

1. Copy `Secrets.xcconfig.example` to `Secrets.xcconfig` (gitignored).
2. Set `NOTION_API_KEY` and `NOTION_DATABASE_ID`, or add the same keys as **Environment Variables** on the **Run** scheme in Xcode.

Without credentials the app uses the bundled JSON and any cached copy in `UserDefaults` (key `questions_cache`, same shape as the Expo app).

## Developer menu (DEBUG)

The **Dev** toolbar item on home opens actions to **fetch latest questions** from Notion and **reset onboarding** (returns to the onboarding flow).

## Parity notes

- UserDefaults keys align with Expo `AsyncStorage`: `hasSeenOnboarding`, `favorites`, `questions_cache`, `app_language`.
- Road Trip moment uses emoji 🌎 in the UI (same override as `QuestionsContext` in Expo).
- Settings language list matches Expo `SETTINGS_MENU_LOCALES`; question text uses English or Spanish per `getTranslationLocale` rules.

## App icon

`AppIcon.appiconset` is a placeholder (1024×1024 marketing slot). Add your own artwork before App Store submission.
