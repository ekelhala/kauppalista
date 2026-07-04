# Step 6 — Verification & Polish

Goal: confirm both languages are complete and correct across the whole app,
and document the known limitations (PWA manifest, server-side strings).

## Tasks

1. **Key completeness audit.** Run a script or manual check to confirm every
   key in `fi/translation.json` exists in `en/translation.json` and vice
   versa. A quick approach:
   ```bash
   # from client/
   node -e "
     const fi = require('./src/locales/fi/translation.json');
     const en = require('./src/locales/en/translation.json');
     const flat = (o, p='') => Object.entries(o).flatMap(([k,v]) => typeof v === 'object' ? flat(v, p+p+'.') : [p+k]);
     const f = new Set(flat(fi)), e = new Set(flat(en));
     console.log('missing in en:', [...f].filter(k => !e.has(k)));
     console.log('missing in fi:', [...e].filter(k => !f.has(k)));
   "
   ```
   Both lists must be empty. (If plural `_one`/`_other` keys are used in
   `en` only, account for those manually — they're intentionally
   asymmetric.)
2. **No hardcoded strings remain.** Re-run the grep from Step 4 and confirm
   zero matches in `.tsx` files (excluding comments):
   ```bash
   rg "Kirjaudu|Lisää tuote|Omat|Kiinnitetyt|Jaettu kanssani|Ei listoja|Luo uusi|Tallenna|Peruuta|Poista|Hae käyttäjää|Asetukset|Takaisin|Vähennä|Tyhjennä|Avaa käyttäjä|Tuntematon|listaa ei löydy" client/src --glob '!*.json'
   ```
3. **Full smoke test in both languages.** With `localStorage('lang')` set
   to each value in turn, verify:
   - Login screen ("Kirjaudu" / "Log in").
   - Dashboard: title, "Uusi" button, all three tab labels + counts, all
     three empty states.
   - List card: item count badge with both 1-item and multi-item lists
     (plural form check for English).
   - List menu: share, pin/unpin, delete labels.
   - List view: back button, list name, item menu (inc/dec/delete), clear-
     selected menu, 404 message, add-item FAB aria-label.
   - Add list dialog: title, placeholder, cancel/save.
   - Add item dialog: title, placeholder, cancel/add.
   - Share dialog: title, prompt, placeholder, no-results, select/selected,
     cancel/share.
   - Account menu: name fallback, settings section, theme toggle labels,
     user-actions section, logout, language switcher labels, all aria-labels.
4. **Language persistence.** Switch to English, hard-reload, confirm English
   persists. Switch to Finnish, hard-reload, confirm Finnish persists.
5. **Browser language detection.** Clear `localStorage('lang')` and set
   browser language to `en-US` → app loads in English. Set to `fi-FI` →
   app loads in Finnish. Set to `de-DE` (unsupported) → falls back to
   Finnish (`fallbackLng: 'fi'`).
6. **`<html lang>` updates.** Open devtools, switch languages, confirm
   `<html lang="fi">` / `<html lang="en">` updates live.
7. **PWA manifest — known limitation.** The manifest in
   `client/vite.config.ts` has Finnish `name`, `short_name`, `description`,
   and shortcut names. This is static and cannot be i18n'd at runtime.
   Options (pick one):
   - **Keep Finnish (default):** acceptable; the install prompt and home-
     screen label are in Finnish regardless of in-app language. Document
     this in `docs/` or a code comment.
   - **Set manifest `lang: 'fi'`:** already the case; no change.
   - **Advanced:** generate per-locale manifests at build time. Out of
     scope for this refactor; file a follow-up issue if needed.
8. **Server-side strings.** Audit the Go API for any user-facing strings
   (error messages in `handlers.ErrorResponse`, etc.). These are returned
   over the API and are not covered by client-side i18n. Options:
   - Accept English/Go-default error messages and translate only the
     client's *presentation* of them (e.g. a generic "Jotain meni pieleen"
     / "Something went wrong" toast on any API error).
   - Add an `Accept-Language` header to API requests and have the API
     localize responses. Out of scope for this refactor; file a follow-up.
9. **Document the i18n setup.** Add a short section to `docs/` (or a new
   `docs/i18n/README.md`) covering:
   - Supported languages (`fi`, `en`).
   - How to add a new language (copy `en/translation.json`, translate,
     register in `SUPPORTED_LANGUAGES` in `i18n.ts`).
   - The `localStorage('lang')` cache key.
   - The PWA manifest limitation.

## Files touched

- (Optional) `docs/i18n/README.md` (new documentation)
- (Optional) a code comment near the PWA manifest in `vite.config.ts`
  noting the static-string limitation.

## Verification

- All checks above pass.
- `bun lint`, `tsc -b`, `bun run build` pass.
- No regression in any flow from the Step 4 smoke-test list, in both
  languages.
- The `node` key-diff script reports both lists empty (modulo plural
  asymmetry).

## Risk notes

- Plural forms are the most common source of "works in one language, not
  the other" bugs. Pay special attention to the item-count badge and any
  future count-bearing strings.
- The PWA manifest limitation is a known, accepted trade-off. Do not block
  the i18n PR on it; document and move on.
- If server-side error localization is desired later, the client should
  *not* translate API messages directly — it should map known error codes
  to localized strings. File a follow-up issue for this rather than
  attempting it inside this refactor.
