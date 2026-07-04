# Step 7 — Material 3 Polish (optional)

Goal: after reaching full parity with MUI, refine the visual language toward
Material Design 3 where MUI supports it. All changes are non-breaking and
purely cosmetic.

## Tasks

1. Adopt MD3 button styling via theme component defaults in
   `client/src/theme.ts`:
   - `MuiButton.defaultProps.disableElevation = true` (flat tonal buttons).
   - `MuiButton.styleOverrides.root.borderRadius = 20` (pill shape).
   - Use `tonalButton` pattern: secondary actions get `color="secondary"` or a
     custom palette token.
2. Refine `Card` to MD3 outlined style: `elevation={0}`, `variant="outlined"`,
   `borderRadius: 12`.
3. Refine `Chip` to MD3 (filter/assist chips): rounded, `variant="outlined"`
   for counts.
4. Replace `@mui/icons-material` legacy icons with Material Symbols where
   available (the `@mui/icons-material` package already ships these; no new
   dep needed). Standardize on `Filled` / `Outlined` variants consistently.
5. Optional: add an `AppBar` + `Toolbar` as a real top app bar (replaces the
   inline header `Box` in `ListsView`). Include the app title and the
   `AccountMenu`. This gives a consistent MD3 top bar across routes.
6. Optional: on mobile, replace the sticky "Lisää tuote" button with an
   extended `FloatingActionButton` (FAB) pinned to the bottom-right.
7. Optional: add a `BottomNavigation` for the three tabs (pinned / my /
   shared) on small screens, hiding the `Tabs` bar — improves mobile UX.
8. Tune dark theme surface colors toward MD3 dark scheme tonal elevation
   (use `theme.palette.background.paper` + `alpha()` overlays for elevated
   surfaces).
9. Verify the PWA manifest colors in `client/vite.config.ts`
   (`theme_color: '#2d6a4f'`, `background_color: '#f4f1e8'`) still match the
   new theme; update only if the brand palette changed.

## Files touched

- `client/src/theme.ts` (component overrides)
- `client/src/views/ListsView.tsx` (optional `AppBar`/`BottomNavigation`)
- `client/src/views/ItemsView.tsx` (optional FAB)
- `client/vite.config.ts` (manifest colors, only if changed)

## Verification

- App still builds and lints clean.
- Visual review on mobile + desktop breakpoints.
- No regressions in any flow from Step 6's smoke-test list.
- `bun run build` succeeds; PWA install still works with correct theme color.

## Risk notes

- MUI v6 implements Material 2 + partial Material 3; full MD3 is not
  available without `@mui/material-pigment` / future MUI v7. Keep polish
  within what the installed MUI version supports.
- `AppBar` introduces a fixed/sticky position that may shift the existing
  `Container` layout; test on small viewports to avoid content being hidden
  under the bar.
- This step is optional and can be deferred indefinitely without affecting
  correctness.
