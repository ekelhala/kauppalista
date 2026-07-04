# Step 2 — Theme & Color Mode Foundation

Goal: replace Mantine's color-scheme system with a MUI-backed theme and a
custom color-mode provider, so migrated components can read light/dark mode
without depending on `useMantineColorScheme`.

## Tasks

1. Create `client/src/theme.ts`:
   - `createTheme()` with the existing brand green palette mapped to
     `palette.primary` (shades `#e9f5ee`..`#1b4332`).
   - Set `typography` (Roboto or keep current stack).
   - Set `shape.borderRadius` and component defaults
     (e.g. `MuiButton.defaultProps.disableElevation` for the flat MD3 look).
   - Export a `getTheme(mode: 'light' | 'dark')` helper that returns a theme
     with `palette.mode` set accordingly and dark-specific background colors
     (`#112f26` body, `#e9f5ee` text) mirroring `theme.css`.
2. Create `client/src/ColorModeProvider.tsx`:
   - A small React context exposing `{ mode, toggle, setMode }`.
   - On mount, read `localStorage.getItem('theme')` (`'light' | 'dark'`).
   - `setMode` writes back to `localStorage` and updates state.
   - Replaces the role of `useMantineColorScheme` + the manual theme state in
     `App.tsx`.
3. Update `client/src/main.tsx`:
   - Wrap app: `ColorModeProvider` → `ThemeProvider theme={getTheme(mode)}` →
     `<CssBaseline/>` → existing `AuthProvider` → `<App/>`.
   - Remove `MantineProvider` `createTheme` brand block (keep MantineProvider
     for now only if Phase 2+ components still need it; otherwise remove).
4. Update `client/src/App.tsx`:
   - Replace `useState<Theme>` + `useMantineColorScheme` with `useColorMode()`.
   - Pass `mode`/`toggle` down to `ListsView` instead of `theme`/`setTheme`.
   - Preserve OIDC silent-signin + `registerTokenGetter` logic at
     `App.tsx:25-43` verbatim.
5. Rewrite `client/src/theme.css`:
   - Remove `[data-mantine-color-scheme=...]` selectors.
   - Move body background into `CssBaseline` overrides (via theme
     `components.MuiCssBaseline.styleOverrides.body`) or keep a minimal
     `body { margin: 0; transition: background-color 150ms ease }`.
6. Keep `client/src/types/Theme.ts` (`'light' | 'dark'`) — reuse it as the
   color-mode type.

## Files touched

- `client/src/theme.ts` (new)
- `client/src/ColorModeProvider.tsx` (new)
- `client/src/main.tsx` (provider wiring)
- `client/src/App.tsx` (color-mode swap)
- `client/src/theme.css` (strip Mantine selectors)
- `client/src/types/Theme.ts` (unchanged, reused)

## Verification

- Light/dark toggle persists across reloads via `localStorage('theme')`.
- No `useMantineColorScheme` / `useMantineTheme` imports remain in `App.tsx`.
- `bun lint`, `tsc -b`, `bun run build` all pass.
- Login screen and dashboard render with correct brand colors and correct
  light/dark backgrounds.

## Risk notes

- `useMantineColorScheme` is currently called in `App`, `ItemRow`, and
  `ShoppingListItem`. Until those components migrate (Step 3), they will break
  if `MantineProvider` is fully removed. Either keep `MantineProvider` mounted
  through Step 3, or migrate `App` + the two leaf components together in this
  step. Recommended: keep `MantineProvider` during Step 2 and remove it in
  Step 6 (cleanup) once all components are migrated.
- If you keep `MantineProvider`, ensure the Mantine color scheme still follows
  the MUI mode by calling Mantine's `setColorScheme` inside the new
  `ColorModeProvider` effect until Mantine is removed.
