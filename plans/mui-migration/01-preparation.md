# Step 1 — Preparation

Goal: add MUI to the project alongside Mantine so both can coexist during the
incremental migration. No user-visible UI changes in this step.

## Tasks

1. Verify the working tree is clean and you are on `feat/mui-migration`.
2. Add MUI dependencies to `client/`:
   - `@mui/material`
   - `@emotion/react`
   - `@emotion/styled`
   - `@mui/icons-material`
   - (`@fontsource/roboto` optional, for MD3 default font)
3. Install with `bun install` (from `client/`).
4. Add a temporary dual-provider setup in `client/src/main.tsx`:
   - Keep the existing `MantineProvider` + `AuthProvider` wrapping `<App/>`.
   - Inside Mantine, wrap with MUI `ThemeProvider` + `<CssBaseline/>` using a
     placeholder theme for now (palette primary = brand green, mode `light`).
   - This lets migrated components use MUI while un-migrated ones keep Mantine.
5. Do **not** remove any Mantine deps yet. Do **not** touch `postcss.config.cjs`.
6. Leave `theme.css`, `authConfig.ts`, OIDC handling, and PWA config untouched.
7. Confirm a clean build:
   ```
   bun lint
   tsc -b
   bun run build
   ```
8. Commit the dependency + dual-provider change.

## Files touched

- `client/package.json` (add deps)
- `client/src/main.tsx` (add MUI `ThemeProvider` + `CssBaseline`)
- (optional) `client/index.html` — Roboto font link if using `@fontsource/roboto`

## Verification

- App boots at `http://localhost:5173` (or via `bun dev`) with no console errors.
- Existing Mantine UI looks identical.
- `bun run build` succeeds.
- Both `MantineProvider` and MUI `ThemeProvider` are present in the React tree.

## Risk notes

- React 19 compatibility: `@mui/material` v6+ supports React 19. Confirm the
  installed MUI version is >= 6 (prefer latest) before committing.
- `CssBaseline` will reset some base styles; verify the login screen and list
  view still look correct. If Mantine's body background is overridden,
  temporarily move that CSS into the MUI theme for now.
