# Step 3 — Leaf Primitives

Goal: migrate the low-level, dependency-free UI components from Mantine to MUI.
These have no child components depending on them, so they are the safest to
swap first. Migrate in the order listed.

## 3.1 FrontPage.tsx

`client/src/components/FrontPage.tsx`

1. Replace `Center` with `Box sx={{ display:'flex', flexDirection:'column',
   alignItems:'center', justifyContent:'center', minHeight:'60vh' }}`.
2. Replace `Title order={1}` with `Typography variant="h4"` (or `"h5"`).
3. Replace `Button` with MUI `Button variant="contained"`.
4. Keep `useAuth` + `signinRedirect` logic (`FrontPage.tsx:8-18`) unchanged.
5. Keep `userManager.clearStaleState()` fallback on failure.

## 3.2 AccountMenu.tsx

`client/src/components/AccountMenu.tsx`

1. Replace `Menu`/`Menu.Target`/`Menu.Dropdown`/`Menu.Item`/`Menu.Divider`/
   `Menu.Label` with MUI `Menu` + `IconButton` (avatar) target + `MenuItem` /
   `Divider` / `ListSubheader`.
2. Replace `Avatar radius="xl"` with MUI `Avatar`.
3. Replace `UnstyledButton` with `ButtonBase`.
4. Replace `ActionIcon` with `IconButton`.
5. Swap `@tabler/icons-react` icons (`IconLogout`, `IconCopy`, `IconCheck`,
   `IconMoon`, `IconSun`) with `@mui/icons-material` equivalents
   (`Logout`, `ContentCopy`, `Check`, `DarkMode`, `LightMode`).
6. Keep display-name/username derivation logic
   (`AccountMenu.tsx:15-19`) intact.
7. Keep `CopyUsername` sub-component behavior (clipboard + 1.5s feedback).
8. Keep logout flow (`signoutRedirect` + `removeUser` fallback) intact.
9. Props unchanged: `{ onThemeToggle, theme }`. (If Step 2 changed these to
   `mode`/`toggle`, update accordingly.)

## 3.3 ListOptionsMenu.tsx

`client/src/components/ListOptionsMenu.tsx`

1. Replace `Menu` with MUI `Menu` using an `IconButton` (`MoreVert` icon)
   target.
2. Replace `Menu.Item color="red"` with `MenuItem` rendered with
   `color="error"` and `ListItemIcon` (`Trash` icon).
3. Props unchanged: `{ onClearSelected }`.

## 3.4 ItemRow.tsx

`client/src/components/ItemRow.tsx`

1. Replace `Card` with MUI `Card variant="outlined"`, `elevation={0}`.
2. Replace `Checkbox` with MUI `Checkbox`.
3. Replace `Text` with `Typography`; apply
   `sx={{ textDecoration: item.checked ? 'line-through' : 'none',
   wordBreak: 'break-word' }}`.
4. Replace overflow `Menu`/`ActionIcon` with `IconButton MoreVert` + MUI
   `Menu` + `MenuItem`s (`Add`, `Remove`, `Delete` with `color="error"`).
5. Replace `useMantineColorScheme` color lookups (`ItemRow.tsx:27-39`) with
   `useTheme()` + `theme.palette.mode` checks:
   - light checked → `theme.palette.primary.light`
   - light unchecked → a tonal primary tint (use `alpha()` from `@mui/material`
     or a fixed `primary.light`).
   - dark variants → `theme.palette.background.paper` / default.
6. Keep local `quantity` state + `increaseItemQuantity`/`decreaseItemQuantity`
   calls (`ItemRow.tsx:18-25`) intact.
7. Props unchanged: `{ item, onCheck, onDelete }`.

## 3.5 ShoppingListItem/ShoppingListItem.tsx

`client/src/components/ShoppingListItem/ShoppingListItem.tsx`

1. Replace `Card` with MUI `Card variant="outlined"`.
2. Wrap clickable area in `CardActionArea` (replaces inline `onClick` on Card)
   calling `onClick?.(list.id)`.
3. Replace `Text` with `Typography`.
4. Replace `Badge` with MUI `Chip size="small" color="primary"
   variant="outlined"` (or `Badge` if a count overlay is preferred).
5. Replace `useMantineColorScheme` background logic
   (`ShoppingListItem.tsx:21,31`) with `useTheme()` + `theme.palette.mode`.
6. Props unchanged.

## 3.6 ShoppingListItem/ListItemMenu.tsx

`client/src/components/ShoppingListItem/ListItemMenu.tsx`

1. Replace `Menu`/`ActionIcon` with MUI `Menu` + `IconButton` (`MoreHoriz`
   or `MoreVert`).
2. Replace `MenuItem`s with MUI `MenuItem` + `ListItemIcon`:
   - Share → `Share` icon (owner-gated, keep `list.isOwner` check).
   - Pin toggle → `PushPin` icon; label flips
     "Kiinnitä"/"Poista kiinnitys".
   - Delete → `Delete` icon, `color="error"` (owner-gated).
3. Keep `stopAnd` helper (`ListItemMenu.tsx:15-18`) for `stopPropagation`.
4. Props unchanged.

## 3.7 ShoppingLists/ShoppingLists.tsx

`client/src/components/ShoppingLists/ShoppingLists.tsx`

1. Replace wrapper `div` with MUI `Stack spacing={1.5}`.
2. No other changes; mapping logic unchanged.

## 3.8 SilentRenew.tsx

`client/src/components/SilentRenew.tsx`

1. No UI changes (component returns `null`).
2. Remove any Mantine imports if present (currently none).

## Verification (per component, then all together)

- Click through each migrated component in the running app.
- Light/dark mode toggle works for `ItemRow` and `ShoppingListItem`.
- Owner-gated menu items appear only when `list.isOwner` is true.
- Pin/unpin, delete, share, copy-username all behave as before.
- `bun lint`, `tsc -b`, `bun run build` pass.
- Grep confirms no `@mantine` imports remain in the migrated files.

## Risk notes

- `ItemRow` and `ShoppingListItem` both call `useMantineColorScheme`; if
  Step 2 kept `MantineProvider` mounted, this still works — but prefer
  migrating these two together with the theme swap so no component reads
  color scheme from two sources.
- Keep `@tabler/icons-react` installed until Step 3 is fully done; it will be
  removed in Step 6 once all icons are swapped.
