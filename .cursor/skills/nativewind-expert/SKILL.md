---
name: nativewind-expert
description: Helps the agent answer questions about NativeWind v4 using the official documentation, especially llms-full.txt. Use when the user mentions NativeWind, Tailwind-style classes in React Native, or styling topics like dark mode, responsive design, themes, or cssInterop with NativeWind.
---

# NativeWind Expert

## When to use this skill

Use this skill whenever:

- The user asks about **NativeWind** specifically (installation, configuration, upgrading).
- The user asks how to use **Tailwind-style classes** in a React Native or Expo app.
- The question involves **dark mode**, **responsive design**, **themes**, or **pseudo-classes** like hover/focus in React Native.
- You need to reason about **NativeWind APIs** such as `cssInterop`, `withNativeWind`, or `useColorScheme()`.

Always prefer answers grounded in the NativeWind documentation rather than generic Tailwind or React Native styling knowledge.

Key documentation entry points:

- Overview and guides: `https://nativewind.dev/docs`
- LLMS summary (high level): `https://www.nativewind.dev/llms.txt`
- Full LLMS reference (detailed): `https://nativewind.dev/llms-full.txt` ([NativeWind v4 docs for LLMs](https://nativewind.dev/llms.txt))

## Answering workflow

Follow this workflow whenever you use this skill:

1. **Identify the question type**
   - Setup / installation (e.g. "How do I install NativeWind with Expo?")
   - Styling usage (e.g. "How do I make a rounded button with shadows?")
   - Concepts / behavior (e.g. "How does dark mode work in NativeWind?")
   - Troubleshooting (e.g. "Classes are not applying", "variants not working")
   - Performance / optimization.

2. **Decide whether you need the full docs**
   - If the question is **basic or conceptual**, you can answer from your existing NativeWind knowledge plus the summary in `llms.txt`.
   - If the question is **API-specific, version-sensitive, or about edge cases**, first consult `llms-full.txt` with `WebFetch` and search for the relevant section (for example, "Themes", "Dark Mode", "cssInterop", "Configuration").

3. **Locate the relevant NativeWind section**
   - For **installation and setup**, look under **Getting Started → Installation** and **Editor Setup / TypeScript**.
   - For **styling patterns**, look under **Tailwind CSS Utilities**, **Core Concepts**, and **Responsive Design**.
   - For **platform differences**, see **Core Concepts → Platform Differences**.
   - For **themes and dark mode**, see **Guides → Themes** and **Core Concepts → Dark Mode**.
   - For **APIs**, see **API → cssInterop**, **withNativeWind**, **useColorScheme()**, and **vars()**.
   - For **troubleshooting**, look for **Getting Started → Troubleshooting** and **Core Concepts → Quirks**.

4. **Synthesize a concise, practical answer**
   - Explain **what** to do in clear steps.
   - Highlight any **NativeWind-specific behavior** that differs from web Tailwind (for example, supported utilities, platform differences, or limitations).
   - Whenever you provide code, keep it **minimal and focused** on the question.
   - When relevant, mention the NativeWind page/section you used (for example, "Based on the NativeWind Dark Mode docs").

5. **Offer a short checklist or example**
   - When the user is configuring something (e.g. "how to set up dark mode"), give a **short ordered list** of steps.
   - When the user is styling UI, give **1–2 concrete component examples** using NativeWind classes.

## Core NativeWind concepts to remember

From the NativeWind v4 overview (`https://www.nativewind.dev/llms.txt` and linked docs):

- **Tailwind as a scripting language**: NativeWind uses Tailwind CSS to define styles, but compiles them to React Native `StyleSheet` objects at build time.
- **Efficient runtime**: Runtime support is mainly for **conditional styles** (pseudo-classes, media queries, container queries, etc.), not for generating arbitrary new styles.
- **Universal style system**: The same Tailwind-style utilities work across **iOS, Android, and web**, with some platform-specific quirks documented under **Platform Differences**.
- **Customization via Tailwind config**: Colors, spacing, typography, and themes are centralized in `tailwind.config` and then used through utility classes.
- **APIs** like `cssInterop`, `withNativeWind`, and `vars()` exist to bridge between Tailwind utilities and React Native components/props.

When in doubt, assume:

- You should **reuse Tailwind utility names** (e.g. `bg-blue-500`, `rounded-xl`, `px-4`, `py-2`) as long as they are listed as supported in the NativeWind Tailwind documentation.
- Some **web-only Tailwind utilities** will not work; check the NativeWind utilities list.

## Patterns for different question types

### 1. Installation and configuration questions

When the user asks how to install or configure NativeWind:

1. Clarify the stack in your reasoning (Expo vs bare React Native, web support or not), but do **not** ask the user unless necessary.
2. Ground your steps in the **Getting Started → Installation** docs (`https://nativewind.dev/docs/getting-started/installation`).
3. Provide a high-level checklist, for example:
   - Install NativeWind and its peer dependencies using the package manager (`npm`/`yarn`/`pnpm`).
   - Set up `tailwind.config` with the correct `content` globs for React Native/Expo files (`*.tsx` etc.).
   - Configure the bundler/transformer (for example, Babel) to use the NativeWind plugin so class names compile.
   - Ensure any required global CSS file is imported for web usage if the docs mention it.
4. If the question is version-specific (e.g. "v3 → v4"), check `llms-full.txt` for upgrade notes before answering.

### 2. Styling and component questions

When the user wants to style a component with NativeWind:

- Prefer **class-based examples** over inline styles:

```tsx
// Example: Primary button
<Pressable className="px-4 py-2 rounded-full bg-indigo-600 active:bg-indigo-700">
  <Text className="text-white font-semibold">Tap me</Text>
</Pressable>
```

- Show how to combine **layout, spacing, and typography** utilities rather than mixing Tailwind and hand-written styles unless necessary.
- For stateful styling (pressed/hover/focus), rely on the documented pseudo-class support (see **Core Concepts → States & Pseudo-classes**).
- If the user is building **custom reusable components**, consider mentioning `withNativeWind` or `cssInterop` so that Tailwind-style `className` props work seamlessly.

### 3. Dark mode and theming

For dark mode or theme questions:

1. Consult **Core Concepts → Dark Mode** and **Guides → Themes** in the docs.
2. Explain whether NativeWind is using:
   - System color scheme (via `useColorScheme()`), or
   - A custom theme provider and class strategy (e.g. `dark:` variants, theme tokens with `vars()`).
3. Show at least one example with `dark:` variants or theme-aware utilities, for example:

```tsx
<View className="flex-1 bg-white dark:bg-slate-900">
  <Text className="text-slate-900 dark:text-slate-50">
    Hello NativeWind
  </Text>
</View>
```

4. If the user is building a **theme switcher**, describe where to store the theme state (context/store) and how it connects to NativeWind (for example, toggling a theme class or provider as per the Themes guide).

### 4. Troubleshooting questions

When the user says NativeWind is "not working" or utilities are not applying:

1. Check the **Getting Started → Troubleshooting** and **Core Concepts → Quirks** sections in `llms-full.txt`.
2. In your reasoning, run through this checklist:
   - Is NativeWind **installed and configured** correctly in the bundler (Babel/Metro/Vite/etc.)?
   - Do the files using classes match the **`content` globs** in `tailwind.config`?
   - Are the used utilities actually **supported** by NativeWind (not web-only Tailwind utilities)?
   - Is the `className`/`style` prop correctly wired (particularly when using third-party components that need `cssInterop`)?
   - Is the issue platform-specific (iOS vs Android vs web)?
3. Provide a **prioritized list** of likely causes and concrete checks/edits the user can perform.
4. Avoid guessing unsupported utilities; if unsure, explicitly say you are basing the answer on NativeWind’s docs and advise checking the utilities table.

### 5. Performance and best practices

For performance or architectural questions:

- Emphasize that NativeWind **compiles classes at build time**, so:
  - Prefer **static class strings** instead of dynamically building large strings at runtime when possible.
  - Use simple conditional patterns for variants (e.g. `isActive ? "bg-indigo-600" : "bg-slate-600"`).
- Encourage using **theme tokens** and centralized configuration (`tailwind.config`) instead of custom ad‑hoc styles everywhere.
- If the question involves heavy lists or complex layouts, briefly mention standard React Native performance techniques (memoization, `FlashList`/`FlatList` optimization) and confirm that NativeWind styles work within those components as usual.

## Examples of applying this skill

When answering future questions, follow these patterns:

- **"How do I add shadows to a card?"**
  - Look up supported box shadow utilities in the Tailwind utilities section for NativeWind.
  - Provide 1–2 example components with `shadow-*` utilities and a note about platform differences if applicable.

- **"How do I use cssInterop with a third-party component?"**
  - Open the `cssInterop` API docs.
  - Explain, in a few steps, how to wrap the component so it accepts `className` and maps the correct props.

- **"Why doesn't `backdrop-blur` work on Android?"**
  - Check the Filters/Effects utilities and Platform Differences.
  - Answer based on whether the utility is supported and, if not, suggest alternatives or platform-specific fallbacks.

Always keep answers **short, accurate, and grounded in the NativeWind docs**, and prefer linking concepts back to the official documentation sections rather than re-deriving them from generic Tailwind or React Native knowledge.

