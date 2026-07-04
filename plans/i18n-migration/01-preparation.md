# Step 1 — Preparation

Goal: add `i18next` + `react-i18next` to the project and create the locale
folder structure. No runtime behavior changes in this step — the app still
renders hardcoded Finnish strings.

## Tasks

1. Verify the working tree is clean and you are on a new branch
   `feat/i18n-migration` (branched from `main` or `dev`, not from
   `feat/mui-migration` — these two refactors are independent and can be
   merged in either order).
2. Add i18n dependencies to `client/`:
   - `i18next`
   - `react-i18next`
   - `i18next-browser-languagedetector`
   - `i18next-http-backend` (optional, for lazy-loading translation JSON; only
     if you prefer fetch-on-demand over bundling. For a two-language app this
     is likely overkill — bundling is simpler and recommended.)
3. Install with `bun install` (from `client/`).
4. Create the locale folder structure:
   ```
   client/src/locales/
   ├─ en/
   │  └─ translation.json
   └─ fi/
      └─ translation.json
   ```
   Start with empty objects `{}` in each file; content is filled in Step 2.
5. Create `client/src/i18n.ts` — a placeholder initialization module:
   - Import `i18next` and `initReactI18next`.
   - Call `i18n.use(initReactI18next).init({ resources, lng, fallbackLng,
     interpolation: { escapeValue: false } })`.
   - For now, hardcode `lng: 'fi'` and import the two JSON files as
     `resources`. This is wired into the app in Step 3.
6. Do **not** yet import `i18n.ts` in `main.tsx`. Do **not** touch any
   component. The goal of this step is only to have the dependency and the
   skeleton in place.
7. Confirm a clean build:
   ```
   bun lint
   tsc -b
   bun run build
   ```
8. Commit the dependency + scaffolding change.

## Files touched

- `client/package.json` (add deps)
- `client/src/i18n.ts` (new — skeleton)
- `client/src/locales/en/translation.json` (new, `{}`)
- `client/src/locales/fi/translation.json` (new, `{}`)

## Verification

- `bun run build` succeeds with no type or lint errors.
- App behavior is unchanged (i18n is not yet imported).
- Both locale JSON files exist and are valid JSON.

## Risk notes

- React 19 compatibility: `react-i18next` v15+ supports React 19. Confirm
  the installed version is >= 15.
- Do not lazy-load translation files with `i18next-http-backend` unless you
  have a clear reason. Bundled JSON is simpler for a two-language app and
  avoids a flash-of-untranslated-content on first load.
- This refactor is independent of the MUI migration (`plans/mui-migration/`).
  They can be merged in either order, but if both land, coordinate so that
  component-level edits don't conflict (e.g. don't run both steps' component
  migrations on the same lines simultaneously).
