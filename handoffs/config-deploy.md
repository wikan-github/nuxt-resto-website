# Handoff — Config & deploy

> **Agent:** read this file FIRST before touching Nuxt/MikroORM config,
> scripts, env, or build output. Log every modification in `## Changelog` below.

## Scope
`nuxt.config.ts` (134 lines), `mikro-orm.config.ts`, `package.json`,
`tsconfig.json`, `.env`, `.output/`.

## Key facts
- `nuxt.config.ts`: `compatibilityDate 2025-07-15`; devServer `0.0.0.0:3001`
  (LAN preview); `runtimeConfig.public.whatsappPhone: 6281805444270`
  (mirror of DB row — keep in sync); global CSS `~/assets/css/main.css`;
  Google Fonts (Cardo/Inter/Mulish) + preconnect; i18n `prefix_except_default`,
  `lazy: true`, `langDir: locales/`, cookie `i18n_lang`.
- Modules: `@nuxtjs/i18n` only. No eslint/prettier/typecheck/tests/CI.
- Scripts: `dev/build/generate/preview/postinstall`, `seed` (tsx
  `server/seed.ts`), `migration:create`, `migration:up`.
- Deps: Nuxt ^4.5.2, Vue ^3.5.41, MikroORM 7.2.5, better-sqlite3, tsx.

## Rules
- No `nitro.prerender` routes for DB-backed pages (DB is gitignored; build-time
  prerender would bake stale/missing data). Correct QR URLs are
  `/monkey-forest-exit?...` + `/id/monkey-forest-exit?...` (never `/en/...`).
- No `nitro.cache` 1h on campaign APIs unless staleness is acceptable.
- No third-party scripts on funnel pages (4G budget).
- Secrets never in `runtimeConfig.public`. No `.env.example` exists yet.

## Open issues
- Missing `.env.example` (`.gitignore` already whitelists it).
- `README.md` is still Nuxt starter.
- No `app/error.vue`, no SEO (`useSeoMeta` only on funnel pages), no `i18n.baseUrl`/hreflang.
- Unused `vue-router` dep; `console.log`s in codebase.

## Changelog
- (seed) 2026-10-15 — handoff created from config state; no change yet.
