# Step 5 — Language Switcher

Goal: add a UI control so users can switch between Finnish and English
without relying on browser settings. The choice persists in `localStorage`
via the `i18next-browser-languagedetector` cache configured in Step 3.

## Tasks

1. Add the switcher to `AccountMenu.tsx` (the most natural home — it already
   holds theme toggle and logout). Place it in the "Asetukset" section,
   above or below the theme toggle.
2. Render a two-option control. Two acceptable patterns:
   - **Toggle Button Group** (recommended for a two-language app):
     ```tsx
     import { ToggleButton, ToggleButtonGroup } from '@mui/material';
     // or @mantine/core if MUI migration hasn't landed
     ```
     ```tsx
     <ToggleButtonGroup
       exclusive
       value={i18n.language}
       onChange={(_, lng) => lng && i18n.changeLanguage(lng)}
       size="small"
     >
       <ToggleButton value="fi">Suomi</ToggleButton>
       <ToggleButton value="en">English</ToggleButton>
     </ToggleButtonGroup>
     ```
   - **Menu items**: two `MenuItem`s with a checkmark on the active one.
     Simpler but less discoverable.
3. The labels "Suomi" and "English" are **native language names** — always
   shown in the target language, not translated. Do not put these through
   `t()`; hardcode them.
4. Import `i18n` (the instance, not just the hook) into `AccountMenu.tsx`:
   ```ts
   import i18n from '../i18n';
   ```
   Or use the `useTranslation()` hook's `i18n` property:
   ```ts
   const { t, i18n } = useTranslation();
   ```
5. `i18n.changeLanguage(lng)` returns a promise; you can await it but it's
   safe to fire-and-forget. The `languageChanged` event (wired in Step 3)
   updates `<html lang>` and re-renders subscribed components automatically.
6. The `localStorage('lang')` cache is updated automatically by the detector
   — no manual persistence needed.
7. Add a small section label via `t('account.section.language')` — add this
   key to both locale files:
   - `fi`: "Kieli"
   - `en`: "Language"
8. Add aria-labels for accessibility:
   - `aria-label={t('account.aria.languageSwitch')}`
   - Add `account.aria.languageSwitch` key: "Vaihda kieltä" / "Change language".

## Files touched

- `client/src/components/AccountMenu.tsx` (add switcher UI)
- `client/src/locales/fi/translation.json` (add `account.section.language`,
  `account.aria.languageSwitch`)
- `client/src/locales/en/translation.json` (same new keys)

## Verification

- Open the account menu → language toggle is visible in the settings
  section.
- Click "English" → all visible UI text switches to English immediately,
  without a reload.
- Click "Suomi" → switches back to Finnish.
- Reload the page → the selected language persists (read from
  `localStorage('lang')`).
- `<html lang>` attribute updates on switch.
- Browser with `navigator.language === 'en-US'` and no `localStorage('lang')`
  → defaults to English on first visit.
- Browser with `navigator.language === 'fi-FI'` and no `localStorage('lang')`
  → defaults to Finnish on first visit.
- `bun lint`, `tsc -b`, `bun run build` pass.

## Risk notes

- If the MUI migration has landed, use MUI's `ToggleButtonGroup`. If not,
   use Mantine's `SegmentedControl` (the Mantine equivalent) for now and
   swap to MUI's `ToggleButtonGroup` during the MUI migration. The i18n
   wiring (`i18n.changeLanguage`) is UI-lib-agnostic either way.
- Do not translate the language names "Suomi" / "English" — these are the
  convention for language pickers so users can find their language even if
  the app is currently in a language they don't understand.
- If both `feat/i18n-migration` and `feat/mui-migration` are merged, the
  AccountMenu component will have been edited by both refactors. Resolve any
  merge conflicts by keeping the MUI component structure and the i18n `t()`
  calls together.
