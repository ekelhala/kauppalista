# Step 4 — Dialogs

Goal: migrate the three dialog components from Mantine `Modal`/`TextInput` to
MUI `Dialog`/`TextField`, preserving all service-call behavior.

## 4.1 AddListDialog.tsx

`client/src/dialogs/AddListDialog.tsx`

1. Replace `Modal` with MUI `Dialog open={opened} onClose={...}`.
2. Add `<DialogTitle>Luo uusi lista</DialogTitle>`.
3. Replace `TextInput` with `TextField` (`fullWidth`, `autoFocus`,
   `value={newListName}`, `onChange`).
4. Add `<DialogActions>` containing Cancel (`Button color="inherit"`) and
   Save (`Button` disabled when `!newListName.trim()`).
5. Wrap body in `<DialogContent><TextField .../></DialogContent>`.
6. Keep `createList(newListName.trim())` call + `onListCreated()` +
   `onClose()` (`AddListDialog.tsx:15-25`) intact.
7. Keep input-clearing behavior on close and on successful create.
8. Props unchanged: `{ opened, onClose, onListCreated }`.

## 4.2 AddItemDialog.tsx

`client/src/dialogs/AddItemDialog.tsx`

1. Replace `Modal` with `Dialog`; add `DialogTitle` ("Lisää tuote").
2. Replace `TextInput` with `TextField` (`fullWidth`, `autoFocus`).
3. Move buttons into `<DialogActions>`; Cancel + Lisää (disabled when
   `!itemName.trim()`).
4. Keep `onItemAdded(itemName)` + local state reset + `onClose()` behavior
   (`AddItemDialog.tsx:14-23`).
5. Optional: wrap in `<form onSubmit={handleAddItem}>` and set the TextField
   `onKeyDown` Enter handler to submit (matches typical modal UX).
6. Props unchanged: `{ opened, onClose, onItemAdded }`.

## 4.3 ShareListDialog.tsx

`client/src/dialogs/ShareListDialog.tsx`

1. Replace `Modal` with `Dialog`; add `DialogTitle` ("Jaa lista").
2. Replace `TextInput` with `TextField` (`fullWidth`, `value={query}`,
   `onChange`).
3. Replace `Text mb="xs"` with `Typography variant="body2" sx={{ mb: 1 }}`.
4. Replace `Text c="dimmed"` with `Typography color="text.secondary"`.
5. Render results list with MUI `List` + `ListItem`:
   - `ListItemText primary={u.username}`.
   - `ListItemSecondaryAction` with a `Button size="small"` toggling
     "Valitse"/"Valittu" (variant `outlined`/`contained` based on
     `selectedUser === u.id`).
6. Keep the debounced search effect (`ShareListDialog.tsx:25-43`) — the
   `useEffect` that calls `searchUsers(query)` with the `cancelled` guard —
   verbatim.
7. Keep the reset-on-open effect (`ShareListDialog.tsx:19-23`) verbatim.
8. Keep `shareList(listId, selectedUser)` + `onShared()` + `onClose()`
   (`ShareListDialog.tsx:45-54`) verbatim.
9. Move footer buttons into `<DialogActions>`; keep `loading` prop on the
   share `Button` (use MUI `Button` `loading={loading}` via
   `@mui/lab/LoadingButton` or a `CircularProgress` inside the button).
10. Props unchanged: `{ opened, onClose, listId, onShared }`.

## Verification

- Create a new list from the dashboard ("Uusi" button) — dialog opens, input
  works, Save creates the list and dialog closes.
- Open a list, add an item via "Lisää tuote" — dialog + Enter-to-submit works.
- Open share dialog, type a query — results appear after debounce, selecting a
  user and clicking "Jaa" shares the list.
- Cancel buttons close dialogs and clear local state.
- Escape key and backdrop click close dialogs (MUI default).
- `bun lint`, `tsc -b`, `bun run build` pass.

## Risk notes

- MUI `Dialog` requires explicit `DialogTitle`/`DialogContent`/
  `DialogActions` for proper layout and a11y; do not skip these.
- `autoFocus` on the first field inside `DialogContent` is the correct MUI
  pattern (not on the `Dialog` itself).
- For the loading share button, prefer `@mui/lab/LoadingButton` if already
  available; otherwise wrap a `Button` with `startIcon={<CircularProgress
  size={16}/>}` when `loading` is true and `disable` it.
