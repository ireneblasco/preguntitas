# Question Spot (preguntitas-expo)

A conversation-starter app built with Expo. Users pick a "moment" (e.g. Self-Reflection, Stories), then swipe through questions. Questions are bilingual (English/Spanish) and synced from a personal Notion database.

## Tech stack

- **Expo SDK 54** with **Expo Router** (file-based routing)
- **React Native** (iOS, Android, web)
- **react-native-reanimated** + **react-native-gesture-handler** for swipe/animations
- **AsyncStorage** for favorites and onboarding state
- **TypeScript** (strict mode)
- Path alias: `@/*` → project root (see `tsconfig.json`)

## Project structure

```
app/                    # Expo Router screens
  _layout.tsx           # Root: fonts, splash, QuestionsProvider, Stack (no header)
  index.tsx             # Splash → onboarding or home
  onboarding.tsx        # First-time intro
  home.tsx              # Moment selector + Start / Random / Favorites; dev menu
  questions/[category].tsx   # Swipeable cards for a moment (category = moment type)
  favorites.tsx         # List of favorited questions (swipe to delete)
  silly.tsx             # Random "Fun / Light" and "Games" questions
app.config.js           # Loads .env, sets expo.extra.notionApiKey / notionDatabaseId
components/             # Shared UI (e.g. RotatingCopy)
constants/              # Colors, typography, spacing
contexts/
  QuestionsContext.tsx  # Provider + useQuestions(); cache + bundled fallback, runtime fetch
data/
  questions.ts          # AUTO-GENERATED: bundled fallback (do not edit)
scripts/
  fetch-questions.ts    # Build-time: fetches from Notion, writes data/questions.ts
utils/
  favorites.ts          # AsyncStorage: get/add/remove/toggle favorites
  onboarding.ts        # AsyncStorage: hasSeenOnboarding, markSeen, reset
  useFavorites.ts      # Hook wrapping favorites utils
  notionQuestions.ts    # Runtime: fetchQuestionsFromNotion(apiKey, databaseId)
  questionsCache.ts    # AsyncStorage: getCachedQuestions, setCachedQuestions (with fetchedAt)
```

## How questions get into the app

**Source of truth**: The **latest fetch** from Notion. The app stores it in AsyncStorage (key `questions_cache`) with a **fetchedAt** date. Bundled `data/questions.ts` is used only when no cache exists (e.g. first install).

**Two ways data is loaded:**

1. **Build / dev server**  
   - `scripts/fetch-questions.ts` runs on `prestart` and `prebuild`, writes `data/questions.ts`.  
   - That file is the **bundled fallback**; do not edit it by hand.

2. **Runtime (in the app)**  
   - **QuestionsProvider** (in `_layout.tsx`) initializes from cache via `getCachedQuestions()`, or from bundled data if cache is empty.  
   - If `app.config.js` has Notion credentials (from `.env`: `NOTION_API_KEY`, `NOTION_DATABASE_ID`), the app **fetches from Notion in the background** on startup and updates the cache (and `fetchedAt`).  
   - **Dev menu** (home screen, DEV button): "Fetch questions from Notion" calls `refetch()` to fetch now and update cache; the menu shows "Last updated: &lt;date&gt;" or "Using bundled questions".

**Notion database shape**: **English** (title), **Spanish** (rich_text), **Category** (multi_select), **ID** (unique_id). Mapped to `Question`: `id` (e.g. `ID-123`), `textEn`, `textEs`, `moment[]`. Same mapping in `scripts/fetch-questions.ts` and `utils/notionQuestions.ts`.

## App flow

1. **Splash** (`app/index.tsx`): Short animated splash, then:
   - If `hasSeenOnboarding()` → `router.replace('/home')`
   - Else → `router.replace('/onboarding')`
2. **Onboarding** (`app/onboarding.tsx`): Intro; on finish calls `markOnboardingSeen()` and navigates to `/home`.
3. **Home** (`app/home.tsx`):
   - Uses `useQuestions()` for `momentOptions` and `lastFetchedAt`.
   - Renders **moment selector** from `momentOptions`; buttons: **Start** → `/questions/[category]`, **Random** → `/silly`, **My favorites** → `/favorites`.
   - In dev: floating **Dev** button opens dev menu with "Last updated: &lt;date&gt;" or "Using bundled questions", **Fetch questions from Notion**, and **Reset Onboarding**.
4. **Questions** (`app/questions/[category].tsx`): Uses `useQuestions()` for `questions` and `momentOptions`. `category` = selected moment type; filters by `q.moment.includes(category)`. Swipe or tap to advance; long-press or heart to toggle favorite. Display uses `textEs` (Spanish).
5. **Silly** (`app/silly.tsx`): Uses `useQuestions()` for `questions`; filters where `moment` includes `"Fun / Light"` or `"Games"`; same swipe/favorite UX.
6. **Favorites** (`app/favorites.tsx`): Uses `useQuestions()` for `questions`; shows questions whose `id` is in AsyncStorage `favorites`; swipe to remove.

## Data model (in app)

- **Question**: `id`, `textEn`, `textEs`, `moment: string[]` (category names from Notion).
- **momentOptions**: `{ id: string, name: string, emoji: string }[]` for the home chip selector.
- **QuestionsContext** (`useQuestions()`): exposes `questions`, `momentOptions`, `lastFetchedAt` (ISO string or null), `isLoading`, `refetchError`, `refetch()`.
- **Cache** (AsyncStorage `questions_cache`): `{ questions, momentOptions, fetchedAt }`. Source of truth when present.
- **Favorites**: array of question IDs in AsyncStorage under key `favorites`.

## Conventions

- **Path alias**: Use `@/...` for imports from project root (e.g. `@/contexts/QuestionsContext`, `@/utils/useFavorites`).
- **Getting questions**: Use `useQuestions()` from `@/contexts/QuestionsContext`; do not import `questions` or `momentOptions` from `@/data/questions` in screens (bundled data is used only inside the provider as fallback).
- **Questions display**: Spanish via `question.textEs`; `textEn` for future language toggle.
- **IDs**: Question IDs from Notion (`ID-123`). Favorites store these IDs; changing Notion IDs will orphan old favorites.
- **Env**: `.env` with `NOTION_API_KEY` and `NOTION_DATABASE_ID` is read by `app.config.js` and exposed as `expo.extra` for runtime fetch. Required for "Fetch questions from Notion" and background refresh.

## Scripts (package.json)

- `npm run fetch-questions` — Build-time: fetch from Notion and regenerate `data/questions.ts` (bundled fallback).
- `npm start` — Runs `prestart` (fetch-questions) then `expo start`.
- `prebuild` — Runs fetch-questions (for EAS/build flows).
- `npm run lint` — `tsc --noEmit`.

## Summary for AI / future edits

- **Source of truth**: Latest Notion fetch, stored in AsyncStorage cache with `fetchedAt`. Bundled `data/questions.ts` is fallback when no cache.
- **Runtime**: `QuestionsProvider` in `_layout.tsx`; screens use `useQuestions()`. Background fetch on startup if credentials in `app.config.js` (from `.env`). Dev menu: "Fetch questions from Notion" and "Last updated" / "Using bundled questions".
- **Build-time**: `scripts/fetch-questions.ts` still writes `data/questions.ts` for bundled fallback.
- **Notion mapping**: Same in `scripts/fetch-questions.ts` and `utils/notionQuestions.ts`; keep in sync if Question shape or Notion props change.
- Favorites and onboarding: `utils/favorites.ts`, `utils/onboarding.ts`. UI: `constants/`, `components/`. Routing: Expo Router under `app/`.
