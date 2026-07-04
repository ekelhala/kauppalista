# Step 4 — Component Migration

Goal: replace every hardcoded user-facing string with a `t()` call, using the
keys cataloged in Step 2. This is the bulk of the work; migrate file by file
in the order below (leaf components first, views last).

## General pattern

- In function components: `const { t } = useTranslation();`
- Render: `{t('lists.title')}`, `{t('items.menu.increase')}`, etc.
- For dynamic strings: `{t('lists.badge.itemCount', { count: list.items.length })}`
- For plurals (English only inflects): use the `_one`/`_other` form — i18next
  picks automatically when the key has the suffix and the `count` option is
  passed.
- For `aria-label` and other non-children attributes:
  `aria-label={t('items.aria.addItem')}`.
- For placeholders: `placeholder={t('dialogs.createList.namePlaceholder')}`.

## Tasks (in order)

### 4.1 FrontPage.tsx

`client/src/components/FrontPage.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace `Kauppalista` (Title) → `{t('auth.appName')}`.
3. Replace `Kirjaudu` (Button) → `{t('auth.login')}`.
4. Keep `signinRedirect` / `removeUser` / `clearStaleState` logic unchanged.

### 4.2 AccountMenu.tsx

`client/src/components/AccountMenu.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Tuntematon käyttäjä" → `t('account.unknown')`
   - "Asetukset" (Menu.Label) → `t('account.section.settings')`
   - "Vaalea tila" / "Tumma tila" → `t('account.theme.light')` / `t('account.theme.dark')`
   - "Käyttäjätoiminnot" → `t('account.section.userActions')`
   - "Kirjaudu ulos" → `t('account.logout')`
   - `aria-label="Avaa käyttäjävalikko"` → `aria-label={t('account.aria.openMenu')}`
   - `aria-label="Kopioi käyttäjätunnus"` → `aria-label={t('account.aria.copyUsername')}`
3. Keep display-name/username derivation, logout flow, and `CopyUsername`
   behavior unchanged.

### 4.3 ListOptionsMenu.tsx

`client/src/components/ListOptionsMenu.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace "Tyhjennä valitut" → `t('items.menu.clearSelected')`.

### 4.4 ItemRow.tsx

`client/src/components/ItemRow.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Lisää" (menu inc) → `t('items.menu.increase')`
   - "Vähennä" (menu dec) → `t('items.menu.decrease')`
   - "Poista" (menu delete) → `t('items.menu.delete')`
   - `aria-label={\`more-${item.id}\`}` — this is a programmatic aria; leave
     as-is or replace with `t('items.aria.openMenu')` + the id suffix.
3. Keep `quantity` state and `increaseItemQuantity`/`decreaseItemQuantity`
   calls unchanged.

### 4.5 ShoppingListItem/ListItemMenu.tsx

`client/src/components/ShoppingListItem/ListItemMenu.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Jaa" → `t('lists.menu.share')`
   - "Kiinnitä" / "Poista kiinnitys" → `t('lists.menu.pin')` / `t('lists.menu.unpin')`
   - "Poista" → `t('lists.menu.delete')`
   - `aria-label="Avaa valikko"` → `aria-label={t('items.aria.openMenu')}`
3. Keep `stopAnd` helper and owner-gating unchanged.

### 4.6 ShoppingListItem/ShoppingListItem.tsx

`client/src/components/ShoppingListItem/ShoppingListItem.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace the count Badge text `"{list.items.length} tuotetta"` →
   `{t('lists.badge.itemCount', { count: list.items.length })}`.
   - Ensure the `en` locale has `_one`/`_other` plural forms for this key
     (see Step 2 task 6).

### 4.7 ShoppingLists/ShoppingLists.tsx

No user-facing strings — no change.

### 4.8 dialogs/AddListDialog.tsx

`client/src/dialogs/AddListDialog.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Luo uusi lista" (title) → `t('dialogs.createList.title')`
   - "Listan nimi" (placeholder) → `t('dialogs.createList.namePlaceholder')`
   - "Peruuta" → `t('common.actions.cancel')`
   - "Tallenna" → `t('common.actions.save')`
3. Keep `createList` call + state reset unchanged.

### 4.9 dialogs/AddItemDialog.tsx

`client/src/dialogs/AddItemDialog.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Lisää tuote" (title) → `t('dialogs.addItem.title')`
   - "Tuotteen nimi" (placeholder) → `t('dialogs.addItem.namePlaceholder')`
   - "Peruuta" → `t('common.actions.cancel')`
   - "Lisää" (button) → `t('common.actions.add')`
4. Keep `onItemAdded` + state reset unchanged.

### 4.10 dialogs/ShareListDialog.tsx

`client/src/dialogs/ShareListDialog.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Jaa lista" (title) → `t('dialogs.shareList.title')`
   - "Etsi käyttäjää käyttäjätunnuksella" → `t('dialogs.shareList.searchPrompt')`
   - "Hae käyttäjää" (placeholder) → `t('dialogs.shareList.searchPlaceholder')`
   - "Ei hakutuloksia" → `t('dialogs.shareList.noResults')`
   - "Valitse" / "Valittu" → `t('dialogs.shareList.select')` / `t('dialogs.shareList.selected')`
   - "Peruuta" → `t('common.actions.cancel')`
   - "Jaa" → `t('common.actions.share')`
3. Keep debounced search effect, `shareList` call, and reset-on-open effect
   unchanged.

### 4.11 views/ListsView.tsx

`client/src/views/ListsView.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Listat" (Title) → `t('lists.title')`
   - "Uusi" (Button) → `t('lists.actions.new')`
   - Tab labels: "Kiinnitetyt" / "Omat" / "Jaettu kanssani" →
     `t('lists.tabs.pinned')` / `t('lists.tabs.my')` / `t('lists.tabs.shared')`
   - Empty states: "Ei kiinnitettyjä listoja" / "Ei listoja" /
     "Ei jaettuja listoja" → `t('lists.empty.pinned')` / `t('lists.empty.my')` /
     `t('lists.empty.shared')`
3. Keep tab-count `Typography color="primary"` rendering — just wrap the
   count value, the label text comes from `t()`.
4. Keep all service calls, `?tab=` URL sync, navigation, and dialog wiring
   unchanged.

### 4.12 views/ItemsView.tsx

`client/src/views/ItemsView.tsx`

1. Add `const { t } = useTranslation();`.
2. Replace:
   - "Takaisin" → `t('items.actions.back')`
   - "Lisää tuote" (button / FAB aria) → `t('items.actions.addItem')`
   - "404: listaa ei löydy" → `t('items.notFound')`
3. Keep the optimistic-check logic, 300 ms reorder timer, `fetchListItems`,
   `handleAddItem`, `handleClearSelected`, and unmount cleanup unchanged.

## Verification

- Toggle `localStorage.setItem('lang', 'en')` and reload — every visible
  string is now in English.
- Toggle back to `'fi'` — every string is Finnish.
- No hardcoded Finnish strings remain in `client/src/`:
  ```
  rg "Kirjaudu|Lisää tuote|Omat|Kiinnitetyt|Jaettu kanssani|Ei listoja|Luo uusi|Tallenna|Peruuta|Poista|Hae käyttäjää|Asetukset|Takaisin|Vähennä|Tyhjennä|Avaa käyttäjä|Tuntematon|listaa ei löydy" client/src
  ```
  This should return only comments and the JSON locale files — no JSX text.
- Dynamic counts render correctly in both languages (e.g. a list with 1 item
  shows "1 item" in English, "1 tuotetta" in Finnish).
- `aria-label`s update with language.
- `bun lint`, `tsc -b`, `bun run build` pass.

## Risk notes

- Watch for strings that appear in multiple namespaces with different
  meanings ("Lisää", "Poista", "Jaa"). Use the namespace-specific key, not a
  shared one, so English can translate them differently where needed.
- Pluralization only triggers when the `count` option is passed to `t()`.
  Forgetting the option falls back to the base key, which is fine for Finnish
  but loses the English `_one`/`_other` distinction.
- Do not translate the PWA manifest strings in `vite.config.ts` — they are
  static. See Step 2's "PWA manifest" note and Step 6's known limitation.
- If the MUI migration has already landed, the components may look different
  from the file paths referenced here, but the string locations are the same.
