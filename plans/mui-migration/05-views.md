# Step 5 — Views

Goal: migrate the two top-level view containers (`ListsView`, `ItemsView`)
from Mantine to MUI, wiring in the already-migrated child components and
dialogs. These depend on everything from Steps 2–4 being complete.

## 5.1 ListsView.tsx

`client/src/views/ListsView.tsx`

### Header
1. Replace `Container size="sm" py="xl"` with MUI `Container maxWidth="sm"
   sx={{ py: 4 }}`.
2. Replace `Title order={1}` ("Listat") with `Typography variant="h4"`.
3. Replace the header flex `div` with `Box sx={{ display:'flex',
   justifyContent:'space-between', alignItems:'center', mb: 2 }}`.
4. Replace the "Uusi" `Button` with MUI `Button variant="contained"
   startIcon={<Add/>}`.
5. Keep `AccountMenu` invocation (now MUI-based from Step 3).

### Tabs
6. Replace `Tabs`/`Tabs.List`/`Tabs.Tab`/`Tabs.Panel` with MUI `Tabs` +
   `TabList` + `Tab` + `Box` (or `TabPanel`) panels.
7. Render per-tab count: inside each `Tab` label, include a `Typography`
   component with `color="primary"` showing the count (mirrors current
   `mantineTheme.colors[...]` usage at `ListsView.tsx:113-127`).
8. Set `Tabs` `value={activeTab}` + `onChange` to update state and sync the
   `?tab=` URL search param — keep the existing `setSearchParams` logic
   (`ListsView.tsx:99-105`) verbatim.
9. Preserve `keepMounted={false}` behavior with MUI by conditionally
   rendering only the active panel (unmount inactive) — verify no stale state
   lingers.

### Panels
10. Pinned panel (`value="pinned"`): render `ShoppingLists` with the pinned
    lists; empty state → `Typography color="text.secondary"` ("Ei kiinnitettyjä
    listoja").
11. My lists panel (`value="my"`): same pattern with `lists`.
12. Shared panel (`value="shared"`): same with `sharedWithMeLists`; note that
    share/delete callbacks are no-ops here and `isListOwner` returns `false`
    (`ListsView.tsx:170-183`).

### Service calls & navigation
13. Keep `getAndSetLists()` (`ListsView.tsx:37-49`) — calls `getLists`,
    `getPinnedLists`, `getSharedWithMeLists` and sets all three state arrays.
14. Keep the auth-gated fetch effect (`ListsView.tsx:56-60`).
15. Keep `?tab=` URL → state sync effect (`ListsView.tsx:62-67`).
16. Keep `navigate('/lists/:id', { state: { name } })` for list selection.
17. Keep dialog state (`dialogOpen`, `shareDialogOpen`, `shareListId`) and
    handlers wiring `AddListDialog` / `ShareListDialog` (now MUI from Step 4).
18. Keep `handleThemeToggle` (or replace with `toggle` from `useColorMode` if
    Step 2 changed the props).

### Props
19. Update `ListsViewParams` interface to match the new color-mode props from
    Step 2 (`mode`, `toggle`/`setMode`) instead of `theme`/`setTheme`, if
    applicable.

### Loading
20. Replace `Loader` with `CircularProgress` centered in a `Box`.

## 5.2 ItemsView.tsx

`client/src/views/ItemsView.tsx`

### Top bar
1. Replace `Button variant="subtle"` ("Takaisin") with MUI `Button
   color="inherit" startIcon={<ArrowBack/>}`.
2. Replace `Title order={3}` (`listName`) with `Typography variant="h6"`.
3. Keep `ListOptionsMenu` (MUI from Step 3) next to the title.
4. Replace `Divider` with MUI `Divider`.

### Loading & 404
5. Replace `Loader` with `CircularProgress`.
6. Keep `listExists` 404 branch (`ItemsView.tsx:100-106`) — render a
   `Typography variant="h6"` ("404: listaa ei löydy").

### Item list
7. Replace Mantine `List`/`spacing` with MUI `List` + `ListItem` (or
   `Stack spacing={1}`) of `ItemRow` (MUI from Step 3).
8. **Preserve the optimistic-check logic verbatim** (`ItemsView.tsx:44-70`):
   - immediate local state update on `handleCheck`,
   - 300 ms `reorderDelay` via `timersRef`,
   - re-sort after delay (`sortItems` moves checked to bottom),
   - revert on API error and clear pending timer.
9. Keep `sortItems` helper (`ItemsView.tsx:24-25`).
10. Keep `fetchListItems` + `setListExists(false)` on error
    (`ItemsView.tsx:30-42`).
11. Keep `handleAddItem` + `handleClearSelected` (`ItemsView.tsx:72-89`).
12. Keep the unmount cleanup effect that clears pending timers
    (`ItemsView.tsx:91-98`).
13. Keep `deleteItem` callback wiring.

### Sticky footer
14. Replace sticky `div` with `Box sx={{ position:'sticky', bottom:0,
    width:'100%', bgcolor:'background.default', py:1 }}`.
15. Replace `Button` ("Lisää tuote") with MUI `Button variant="contained"
    fullWidth size="small" endIcon={<Add/>}` (move icon to end to match current
    layout, or keep `startIcon`).

### Dialog
16. Keep `AddItemDialog` wiring (MUI from Step 4) unchanged.

## Verification

- Dashboard: tabs switch, counts update, `?tab=` reflects in URL on reload.
- Create/delete/pin/unpin/share lists work end-to-end.
- Navigating to a list shows items; back button returns to dashboard.
- Checking an item: checkbox updates immediately, item moves down after ~300ms,
  and reverts if the API call fails (simulate by stopping the API).
- Add item, delete item, clear-selected, qty inc/dec all work.
- 404 renders when navigating to a non-existent list id.
- `bun lint`, `tsc -b`, `bun run build` pass.
- No `@mantine` imports remain in `views/`.

## Risk notes

- The 300 ms reorder timer in `ItemsView` is the most behavior-sensitive UI
  code in the app. Migrate the components only; do not refactor the timer
  logic. If you must refactor, add a manual test that checks an item, kills
  the API, and confirms the checkbox reverts after the timer fires.
- MUI `Tabs` does not have a `keepMounted` prop; unmount inactive panels
  explicitly or accept that all panels stay mounted (less ideal because
  `ShoppingLists` instances would all remain in the tree). Preferred:
  render only the active panel via a `switch` on `activeTab`.
