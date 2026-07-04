# Step 2 — String Catalog & Locale Files

Goal: catalog every user-facing hardcoded string in the client and populate
`fi/translation.json` (source) and `en/translation.json` (English). After
this step the JSON files contain all keys, but components still render
hardcoded strings — the swap happens in Step 4.

## Tasks

1. Walk every file under `client/src/` that renders user-facing text. The
   current inventory (from the codebase read) is below — verify it is
   complete by grepping for Finnish diacritics and common words:
   ```
   rg "[ÄäÖö]|Kirjaudu|Lisää|Omat|Kiinnitet|Jaettu|Ei |Luo|Tallenna|Peruuta|Poista|Jaa|Hae|Asetukset|Takaisin|Vähennä|Tyhjennä|Avaa|Valitse|Tuntematon" client/src
   ```
2. Organize keys into **feature-based namespaces** to keep the flat JSON
   readable and avoid key collisions. Recommended namespaces:
   - `common` — shared actions (cancel, save, delete, add, etc.) and generic
     labels.
   - `lists` — dashboard / list-collection strings.
   - `items` — single-list view strings.
   - `account` — account menu strings.
   - `auth` — login / front-page strings.
   - `dialogs` — dialog titles and field labels (where not covered by
     `common`).
3. Populate `client/src/locales/fi/translation.json` with the Finnish source
   strings keyed by namespace. Use dot-notation paths
   (e.g. `"lists.tabs.pinned"`) or nested objects — pick one and be
   consistent. Nested objects are recommended for readability.
4. Populate `client/src/locales/en/translation.json` with English
   translations for every key. Verify the key sets match exactly (same shape,
   same keys) — Step 6 verification greps for missing keys.
5. Use interpolation placeholders for dynamic values rather than concatenation:
   - e.g. `"items.count": "{{count}} tuotetta"` (fi) / `"{{count}} items"` (en)
   - e.g. `"lists.empty.pinned": "Ei kiinnitettyjä listoja"` / `"No pinned lists"`
6. Use pluralization via i18next's `_one` / `_other` suffixes where counts
   vary, e.g.:
   ```json
   "items": { "count_one": "{{count}} item", "count_other": "{{count}} items" }
   ```
   (Finnish doesn't have plural inflection on the count word, so `fi` can
   use a single key; `en` needs `_one`/`_other`.)
7. Add `aria-label` strings to the catalog too — they are user-facing:
   - `account.aria.openMenu` ("Avaa käyttäjävalikko" / "Open account menu")
   - `items.aria.openMenu` ("Avaa valikko" / "Open menu")
   - `account.aria.copyUsername` ("Kopioi käyttäjätunnus" / "Copy username")
   - `items.aria.addItem` ("Lisää tuote" / "Add item")

## Reference string inventory

Based on the current codebase, these strings must be cataloged (verify
completeness with the grep above before finalizing):

### `auth` namespace
- `auth.appName` — "Kauppalista" (also used as PWA title)
- `auth.login` — "Kirjaudu"

### `lists` namespace
- `lists.title` — "Listat"
- `lists.actions.new` — "Uusi"
- `lists.tabs.pinned` — "Kiinnitetyt"
- `lists.tabs.my` — "Omat"
- `lists.tabs.shared` — "Jaettu kanssani"
- `lists.empty.pinned` — "Ei kiinnitettyjä listoja"
- `lists.empty.my` — "Ei listoja"
- `lists.empty.shared` — "Ei jaettuja listoja"
- `lists.badge.itemCount` — "{{count}} tuotetta"
- `lists.menu.share` — "Jaa"
- `lists.menu.pin` — "Kiinnitä"
- `lists.menu.unpin` — "Poista kiinnitys"
- `lists.menu.delete` — "Poista"

### `items` namespace
- `items.actions.back` — "Takaisin"
- `items.actions.addItem` — "Lisää tuote"
- `items.menu.increase` — "Lisää"
- `items.menu.decrease` — "Vähennä"
- `items.menu.delete` — "Poista"
- `items.menu.clearSelected` — "Tyhjennä valitut"
- `items.notFound` — "404: listaa ei löydy"
- `items.aria.openMenu` — "Avaa valikko"
- `items.aria.addItem` — "Lisää tuote"

### `account` namespace
- `account.unknown` — "Tuntematon käyttäjä"
- `account.section.settings` — "Asetukset"
- `account.section.userActions` — "Käyttäjätoiminnot"
- `account.theme.light` — "Vaalea tila"
- `account.theme.dark` — "Tumma tila"
- `account.logout` — "Kirjaudu ulos"
- `account.aria.openMenu` — "Avaa käyttäjävalikko"
- `account.aria.copyUsername` — "Kopioi käyttäjätunnus"

### `dialogs` namespace
- `dialogs.createList.title` — "Luo uusi lista"
- `dialogs.createList.namePlaceholder` — "Listan nimi"
- `dialogs.addItem.title` — "Lisää tuote"
- `dialogs.addItem.namePlaceholder` — "Tuotteen nimi"
- `dialogs.shareList.title` — "Jaa lista"
- `dialogs.shareList.searchPrompt` — "Etsi käyttäjää käyttäjätunnuksella"
- `dialogs.shareList.searchPlaceholder` — "Hae käyttäjää"
- `dialogs.shareList.noResults` — "Ei hakutuloksia"
- `dialogs.shareList.select` — "Valitse"
- `dialogs.shareList.selected` — "Valittu"

### `common` namespace
- `common.actions.cancel` — "Peruuta"
- `common.actions.save` — "Tallenna"
- `common.actions.add` — "Lisää"
- `common.actions.share` — "Jaa"

### PWA manifest (`client/vite.config.ts`)
The PWA manifest contains Finnish strings (`name`, `short_name`,
`description`, shortcut names/descriptions). These cannot be i18n'd via
react-i18next at runtime — the manifest is static. Options:
- Keep the manifest in Finnish (current behavior) — acceptable.
- Generate the manifest per-locale at build time (advanced, out of scope).
- Set `lang: 'fi'` in the manifest and accept that the install prompt uses
  Finnish. Document this as a known limitation in Step 6.

## Files touched

- `client/src/locales/fi/translation.json` (populate)
- `client/src/locales/en/translation.json` (populate)

## Verification

- Both JSON files are valid JSON (`bun run build` will fail if not).
- Key sets match: run a quick diff of the key paths (a small script or manual
  review) — every key in `fi` must exist in `en` and vice versa.
- No string left uncataloged: re-run the grep from task 1 and confirm every
  match has a corresponding key in the JSON. (The hardcoded strings are still
  in the components at this point — that's fine; this step just confirms the
  catalog is complete.)
- `bun lint`, `tsc -b`, `bun run build` pass.

## Risk notes

- Pluralization: Finnish doesn't inflect the counted noun by count the way
  English does, so a single `items.count` key works for `fi` but `en` needs
  `_one`/`other`. Get this right now; refactoring plural forms after
  components are migrated is tedious.
- Watch for strings that look identical but mean different things in
  different contexts (e.g. "Lisää" = "Add" the verb vs. "Lisää" = "Increase"
  in the item menu). Use distinct keys (`common.actions.add` vs.
  `items.menu.increase`) so English can distinguish them.
- Do not delete or modify the hardcoded strings in components yet — that's
  Step 4.
