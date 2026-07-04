# Step 6 — Cleanup

Goal: remove all Mantine dependencies and dead CSS now that every component
runs on MUI. No behavior changes.

## Tasks

1. Grep the codebase for any remaining Mantine references:
   ```
   rg "@mantine" client/src
   rg "useMantine" client/src
   rg "var\(--mantine-" client/src
   rg "@tabler/icons-react" client/src
   ```
2. Remove any leftover imports/usages found above.
3. Remove `MantineProvider` from `client/src/main.tsx` (kept during the
   migration as a safety net). Confirm `AuthProvider` + `ThemeProvider` +
   `CssBaseline` remain.
4. Remove the Mantine PostCSS preset from `client/postcss.config.cjs`:
   - Drop `postcss-preset-mantine` and `postcss-simple-vars` (the
     `mantine-breakpoint-*` vars are no longer needed).
   - If no other PostCSS plugins are required, delete the file entirely;
     otherwise keep only the needed plugins.
5. Rewrite or minimize `client/src/theme.css`:
   - Remove all `[data-mantine-color-scheme=...]` selectors.
   - If body styling is fully covered by `CssBaseline` overrides in
     `theme.ts`, delete `theme.css` and its import in `main.tsx`.
   - Otherwise keep only the `body { margin: 0; transition: ... }` rule.
6. Remove unused dependencies from `client/package.json`:
   - `@mantine/core`
   - `@mantine/hooks`
   - `@tabler/icons-react` (only if all icons were swapped to
     `@mui/icons-material` in Step 3)
   - `postcss-preset-mantine`
   - `postcss-simple-vars`
7. Run `bun install` to refresh the lockfile.
8. Run the full verification suite (below).

## Files touched

- `client/src/main.tsx` (remove `MantineProvider`)
- `client/postcss.config.cjs` (strip or delete)
- `client/src/theme.css` (strip or delete)
- `client/package.json` (remove deps)

## Verification

```
rg "@mantine" client/src          # no matches
rg "useMantine" client/src        # no matches
rg "var\(--mantine-" client/src   # no matches
rg "@tabler" client/src           # no matches (if icons fully swapped)
bun lint
tsc -b
bun run build
bun preview
```

Smoke-test every flow in the running app:
- Login (OIDC redirect + silent signin).
- Dashboard tabs (pinned / my / shared) + `?tab=` URL sync.
- Create / delete / pin / unpin / share a list.
- Open a list: add / check / delete items, qty inc/dec, clear selected.
- Optimistic check + revert on API failure.
- Light/dark toggle persists across reloads.
- Logout (OIDC signoutRedirect).
- Silent renew at `/silent-renew` (iframe) does not error.

## Risk notes

- Do not remove `@tabler/icons-react` unless the Step 3 grep confirmed zero
  imports. If any Tabler icon was kept intentionally (e.g. for a specific
  glyph), leave the dep in place.
- `postcss.config.cjs` may be read by Vite even if empty; deleting it is safe
  only if no other PostCSS plugin is needed. When in doubt, keep the file
  with an empty `module.exports = { plugins: {} }`.
- After removing `MantineProvider`, double-check that the OIDC redirect
  handling in `main.tsx` (`handleOidcRedirect`) and `SilentRenew` route still
  work — these are UI-lib-independent but worth re-testing.
