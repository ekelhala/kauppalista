# Step 3 — i18n Initialization

Goal: wire the i18n module into the app so `useTranslation()` works
everywhere. Language is detected from the browser and persisted in
`localStorage`. After this step, components can start calling `t()`
(Step 4 does the actual string swap).

## Tasks

1. Complete `client/src/i18n.ts` (skeleton created in Step 1):
   ```ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';
   import fi from './locales/fi/translation.json';
   import en from './locales/en/translation.json';

   export const SUPPORTED_LANGUAGES = ['fi', 'en'] as const;
   export type AppLanguage = typeof SUPPORTED_LANGUAGES[number];

   void i18n
     .use(initReactI18next)
     .use(LanguageDetector)
     .init({
       resources: {
         fi: { translation: fi },
         en: { translation: en },
       },
       fallbackLng: 'fi',
       supportedLngs: [...SUPPORTED_LANGUAGES],
       interpolation: { escapeValue: false },
       detection: {
         order: ['localStorage', 'navigator', 'htmlTag'],
         lookupLocalStorage: 'lang',
         caches: ['localStorage'],
       },
     });

   export default i18n;
   ```
2. Import `i18n.ts` in `client/src/main.tsx` — **before** `App` renders so
   the `i18n` instance is initialized before any component calls
   `useTranslation`:
   ```ts
   import './i18n';
   ```
   Place this import above `import App from './App.tsx'`.
3. Confirm the existing `localStorage('theme')` key for color mode is not
   disturbed — the i18n detector uses a separate `'lang'` key.
4. Set `<html lang>` to reflect the detected language. Two options:
   - **Recommended:** set it imperatively in `i18n.ts` after init:
     ```ts
     document.documentElement.lang = i18n.language;
     i18n.on('languageChanged', (lng) => {
       document.documentElement.lang = lng;
     });
     ```
   - This keeps the `<html lang="en">` in `index.html` from being stale.
5. Do **not** yet swap any hardcoded strings. Do **not** add the language
   switcher UI yet (Step 5). Verify only that the app still boots and that
   `i18n.language` resolves to `'fi'` or `'en'` based on the browser.

## Files touched

- `client/src/i18n.ts` (complete initialization)
- `client/src/main.tsx` (add `import './i18n';`)

## Verification

- App boots with no console errors.
- In the browser console: `i18n.language` returns `'fi'` (or `'en'` if the
  browser is English-first) on first load.
- `localStorage.getItem('lang')` is set after first load to the detected
  language.
- `<html lang="...">` matches `i18n.language`.
- Setting `localStorage.setItem('lang', 'en')` and reloading switches
  `i18n.language` to `'en'`.
- UI is unchanged (still renders Finnish hardcoded strings).
- `bun lint`, `tsc -b`, `bun run build` pass.

## Risk notes

- The `LanguageDetector` `lookupLocalStorage: 'lang'` key must not collide
  with the existing `theme` key used by color mode. They are distinct, so
  this is safe.
- Do not lazy-load translation JSON via `i18next-http-backend` in this step —
  the bundled-import approach above is sufficient for two languages and
  avoids a network round-trip on first paint.
- If both `feat/i18n-migration` and `feat/mui-migration` are in flight, the
  only shared file is `main.tsx`. Coordinate the `import './i18n';` line and
  the provider wrappers so the merge is clean.
- The `void i18n.use(...).init(...)` pattern (instead of `await`) is correct
  here — `i18n.init` is synchronous when resources are bundled inline, so no
  async gating is needed before `App` renders.
