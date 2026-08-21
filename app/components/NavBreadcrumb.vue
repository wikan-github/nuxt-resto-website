<!--
  ============================================================================
  NavBreadcrumb.vue — Mobile Breadcrumb Navigation
  ============================================================================
  A compact breadcrumb trail (Home › Current Page) rendered directly below
  the sticky header. It is INVISIBLE on desktop/tablet and only appears on
  phones (max-width: 767px) — exactly the breakpoint where the horizontal
  `.nav-links` menu is hidden (see main.css phone breakpoint).

  Why it exists: previously mobile users relied on footer links to navigate.
  The footer "Useful Links" column has been removed, so this breadcrumb is
  now the lightweight replacement for phone-sized screens. It renders on
  EVERY page (including the homepage, where it shows "Home" as the current
  crumb) so mobile navigation is always available and consistent.

  📚 LEARNING — Nuxt auto-imported composables used here:
  - `useRoute()`       — reactive access to the CURRENT route (path, params…)
  - `useI18n()`        — `t()` translates labels, `locale` gives active code
  - `useLocalePath()`  — builds LOCALE-AWARE URLs: '/menu' becomes '/id/menu'
                         when Indonesian is active (strategy: prefix_except_default)
-->
<template>
  <!--
    Wrapper <nav> element with an ARIA label so screen readers announce it
    as a breadcrumb landmark. Rendered on EVERY page — since the footer
    "Useful Links" column was removed, this trail is the primary mobile
    navigation, so it must stay visible consistently (on the homepage it
    simply shows "Home" as the current-page crumb).
  -->
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <!--
      Ordered list (<ol>) is the semantic element for breadcrumbs:
      order matters, screen readers read the trail sequence correctly.
    -->
    <ol class="breadcrumb-list">
      <!--
        Loop over the computed `crumbs` array (built in <script setup>).
        - :key — unique path string for Vue's reactivity diffing
        - Last crumb = current page → rendered as plain text with
          aria-current="page" (NOT clickable, marks where the user IS)
      -->
      <li
        v-for="(crumb, index) in crumbs"
        :key="crumb.to"
        class="breadcrumb-item"
        :class="{ current: index === crumbs.length - 1 }"
      >
        <!-- Intermediate crumbs are NuxtLink (client-side nav, locale-aware href) -->
        <NuxtLink
          v-if="index < crumbs.length - 1"
          :to="crumb.to"
          class="breadcrumb-link"
        >
          {{ crumb.label }}
        </NuxtLink>
        <!-- Current crumb: static text + aria-current for accessibility -->
        <span v-else class="breadcrumb-current" aria-current="page">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<!--
  📚 LEARNING — <script setup lang="ts">:
  All composables below are AUTO-IMPORTED by Nuxt / @nuxtjs/i18n —
  no manual import statements are needed (Nuxt 4 convention).
-->
<script setup lang="ts">
/*
  Reactive route object — lets us READ the current URL path.
  Recomputes automatically whenever the user navigates.
*/
const route = useRoute()

/*
  Destructure what we need from useI18n():
  - `t`      — translation function: t('nav.menu') → "Menu" / "Menu"
  - `locale` — reactive ref of the active language code ('en' | 'id')
*/
const { t, locale } = useI18n()

/*
  Locale-aware path builder from @nuxtjs/i18n.
  localePath('/about') → '/about' (EN) or '/id/about' (ID).
*/
const localePath = useLocalePath()

/*
  Lookup table mapping a URL segment to its i18n translation key.
  📚 A Record<string, string> type guarantees every entry is a string pair,
     giving autocomplete + compile-time safety in TypeScript.
*/
const SEGMENT_LABEL_KEYS: Record<string, string> = {
  menu: 'nav.menu',           // /menu      → "Menu"
  promotions: 'nav.promos',   // /promotions → "Promos"
  about: 'nav.about',         // /about     → "About Us"
  contact: 'nav.contact',     // /contact   → "Contact Us"
}

/*
  Strip the locale prefix from the current path so both '/menu'
  and '/id/menu' yield the same logical segments ['menu'].
  Returns an array of path segments (empty array on the homepage).
*/
const pathSegments = computed<string[]>(() => {
  // Build the prefix to remove, e.g. '/id' when locale is 'id'
  const localePrefix = `/${locale.value}`
  // If the path starts with the locale prefix, slice it off
  const cleanPath = route.path.startsWith(localePrefix)
    ? route.path.slice(localePrefix.length)
    : route.path
  // Split '/menu' → ['menu']; filter(Boolean) drops empty strings
  return cleanPath.split('/').filter(Boolean)
})

/*
  Build the full breadcrumb trail as a reactive array:
  [ { Home }, { Current Page } ] — always starts at Home,
  followed by one crumb per matched URL segment.
*/
const crumbs = computed(() => [
  // First crumb: Home — always translated and locale-linked
  { label: t('nav.home'), to: localePath('/') },
  // Map each remaining URL segment to a translated crumb object.
  // Unknown segments fall back to displaying the raw segment text.
  ...pathSegments.value.map((segment) => ({
    label: t(SEGMENT_LABEL_KEYS[segment] ?? segment),
    to: localePath(`/${segment}`),
  })),
])
</script>

<!--
  📚 LEARNING — Mobile-first hiding pattern:
  The component is `display: none` by DEFAULT (desktop/tablet never see it),
  then re-enabled inside a max-width media query matching EXACTLY the same
  breakpoint (767px) where main.css hides `.nav-links`. Keeping both rules
  on the same breakpoint guarantees they swap places cleanly.
-->
<style scoped>
/*
  Default state: fully hidden on desktop and tablets — the horizontal
  nav bar handles navigation there, so a breadcrumb would be redundant.
*/
.breadcrumb-nav {
  display: none;
}

/* ── Phone breakpoint — identical to main.css `.nav-links` hide rule ── */
@media (max-width: 767px) {
  /*
    Reveal the breadcrumb as a full-width band sitting right below
    the sticky header. `display: block` lets the inner list control layout.
  */
  .breadcrumb-nav {
    display: block;
    /* Soft brand-tinted background separates it from page content */
    background: var(--color-green-light);
    /* Hairline divider matches the site's standard border token */
    border-bottom: 1px solid var(--color-border);
  }

  /*
    Horizontal flex row for the crumbs; wraps if the trail ever grows long.
    `list-style: none` removes browser bullet points on the <ol>.
  */
  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    /* Side padding mirrors .container (min(4rem, 5vw)) for alignment */
    margin: 0;
    padding: 0.5rem min(4rem, 5vw);
  }

  /*
    Separator between crumbs: a "›" chevron injected via ::before on every
    item EXCEPT the first (`+` sibling selector skips the first item).
  */
  .breadcrumb-item + .breadcrumb-item::before {
    content: '›';           /* Chevron reads more modern than "/" */
    margin-right: 0.25rem;  /* Breathing room after the separator */
    color: var(--color-text-muted); /* Dim gray keeps it subtle */
  }

  /*
    Clickable intermediate crumbs ("Home"): deep green echoes nav link
    hover styling elsewhere in the site for consistent affordance.
  */
  .breadcrumb-link {
    font-family: var(--font-content);
    font-size: 0.8rem;      /* Compact text suited to small screens */
    font-weight: 500;
    color: var(--color-green);
  }

  /*
    Non-clickable current-page crumb: darker neutral gray signals
    "you are here" without inviting a click.
  */
  .breadcrumb-current {
    font-family: var(--font-content);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-body);
  }
}
</style>
