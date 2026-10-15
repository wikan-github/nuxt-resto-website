# Handoff - Translation Editor - 2026-10-13

## Goal
Side-by-side EN/ID translation review + editing, because current Indonesian copy is poor quality. Deferred — handle later. Project: Nuxt-Resto-Website (`/media/kastawan/Kingston250-SSD/MEGAsync/@OpenCode/Output/Nuxt-Resto-Website/`).

## Stack & Constraints
- Runtime stays `i18n/locales/{en,id}.json` (lazy, SSR-safe). Do NOT rewire `@nuxtjs/i18n` to a dynamic source.
- Editor writes the JSON files server-side via Nitro (`node:fs`, temp-file + rename for atomicity).
- Auth mandatory: shared secret in `.env`, checked on endpoints + page (sessionStorage token). No full user system.
- Write path from env `I18N_DIR` (dev: `<project>/i18n/locales`; prod bundle may differ).
- 156 keys, fully symmetric — keep parity on every save (reject unknown keys).

## Decisions Made (with reason)
- Option A (in-app editor) chosen over DB-backed translations (SSR/hydration risk) and spreadsheet round-trip (drift risk).
- Reuse `translations.html` table look for the admin page.

## Current State
- Done: `translations.html` (read-only searchable EN/ID table, 156 rows) exists in project root.
- Not done: read endpoint, write endpoint, admin page, auth, `I18N_DIR` handling, ID re-translation itself.

## Next Steps
1. [ ] `server/api/admin/translations.get.ts` → flattened `[{key,en,id}]`
2. [ ] `server/api/admin/translations.put.ts` → validate key, atomic JSON rewrite
3. [ ] `app/pages/admin/translations.vue` → editable table + search + save
4. [ ] Env-gated auth on all three
5. [ ] Re-translate ID copy (all 156 keys) — human or model pass, then review in editor

## Open Questions
- Who does the ID re-translation (owner/staff vs model)?
- Prod deploy layout (does `I18N_DIR` resolve there)?
