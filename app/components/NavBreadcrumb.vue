<!--
  ============================================================================
  NavBreadcrumb.vue — Mobile Site Navigation Bar (all pages, always visible)
  ============================================================================
  A compact horizontal navigation bar rendered directly below the sticky
  header. It lists EVERY available page — Home · Menu · Promos · About Us ·
  Contact Us — so mobile users always have complete site navigation,
  regardless of which page they are currently viewing.

  It is INVISIBLE on desktop/tablet and only appears on phones
  (max-width: 767px) — exactly the breakpoint where the horizontal
  `.nav-links` menu is hidden (see main.css phone breakpoint).

  The CURRENT page is highlighted with deep-green bold text (plus the
  aria-current="page" attribute for screen readers) while all other pages
  stay muted gray but remain clickable.

  Why it exists: previously mobile users relied on footer links to navigate.
  The footer "Useful Links" column has been removed and no hamburger menu
  exists yet, so this bar is now THE primary mobile navigation.

  📚 LEARNING — Nuxt auto-imported composables used here:
  - `useRoute()`       — reactive access to the CURRENT route (path, params…)
  - `useI18n()`        — `t()` translates labels, `locale` gives active code
  - `useLocalePath()`  — builds LOCALE-AWARE URLs: '/menu' becomes '/id/menu'
                         when Indonesian is active (strategy: prefix_except_default)
-->
<template>
  <!--
    Wrapper <nav> element with an ARIA label so screen readers announce it
    as a navigation landmark. Rendered on EVERY page — this bar IS the
    mobile site menu, so it must never disappear.
  -->
  <nav class="mobile-nav-bar" aria-label="Site navigation">
    <!--
      Ordered list (<ol>) holds one list item per site page.
      Semantic markup keeps the navigation understandable for assistive tech.
    -->
    <ol class="mobile-nav-list">
      <!--
        Loop over the computed `links` array (built in <script setup>):
        - :key   — unique internal path string for Vue's reactivity diffing
        - :class — adds 'active' when this entry matches the current page
        Every entry renders as a NuxtLink (client-side navigation), INCLUDING
        the current page — only its color/weight changes, it stays clickable.
      -->
      <li
        v-for="link in links"
        :key="link.to"
        class="mobile-nav-item"
        :class="{ active: link.active }"
      >
        <!--
          Locale-aware link; aria-current marks the live page for
          accessibility (only set when `active`, otherwise undefined omits
          the attribute entirely).
        -->
        <NuxtLink
          :to="link.to"
          class="mobile-nav-link"
          :aria-current="link.active ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
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
  The complete list of site pages shown in the bar.
  - `path` — the canonical (locale-independent) route path
  - `key`  — i18n translation key for that page's label
  📚 `as const` freezes the array shape so TypeScript infers literal types,
     catching typos in keys/paths at compile time instead of at runtime.
*/
const SITE_PAGES = [
  { path: '/', key: 'nav.home' },
  { path: '/menu', key: 'nav.menu' },
  { path: '/promotions', key: 'nav.promos' },
  { path: '/about', key: 'nav.about' },
  { path: '/contact', key: 'nav.contact' },
] as const

/*
  Strip the locale prefix from the current path so both '/menu'
  and '/id/menu' normalize to '/menu'. This lets us reliably compare
  against SITE_PAGES paths to detect which page is active.
*/
const currentPath = computed<string>(() => {
  // Build the prefix to remove, e.g. '/id' when locale is 'id'
  const localePrefix = `/${locale.value}`
  // If the path starts with the locale prefix, slice it off;
  // ensure a trailing-slash-free result so '/menu' === '/menu'
  const clean = route.path.startsWith(localePrefix)
    ? route.path.slice(localePrefix.length) || '/'
    : route.path
  // Drop any trailing slash ('/menu/' → '/menu') for safe comparison
  return clean !== '/' && clean.endsWith('/') ? clean.slice(0, -1) : clean
})

/*
  Build the reactive link objects consumed by the template:
  one entry per site page, each carrying its translated label,
  locale-aware href, and an `active` flag for highlighting.
*/
const links = computed(() =>
  SITE_PAGES.map((page) => ({
    // Translated display text ("Home", "Menu", "Promos", …)
    label: t(page.key),
    // Locale-aware URL ('/menu' or '/id/menu' depending on language)
    to: localePath(page.path),
    // True when THIS page is the one currently being viewed
    active: page.path === currentPath.value,
  })),
)
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
  nav bar in the header handles navigation there, making this redundant.
*/
.mobile-nav-bar {
  display: none;
}

/* ── Phone breakpoint — identical to main.css `.nav-links` hide rule ── */
@media (max-width: 767px) {
  /*
    Reveal the nav bar as a full-width band sitting right below the
    sticky header. `display: block` lets the inner list control layout.
  */
  .mobile-nav-bar {
    display: block;
    /* Soft brand-tinted background separates it from page content */
    background: var(--color-green-light);
    /* Hairline divider matches the site's standard border token */
    border-bottom: 1px solid var(--color-border);
  }

  /*
    Horizontal flex row holding ALL page links:
    - `flex-wrap: nowrap` keeps everything on ONE line
    - `overflow-x: auto` makes the row swipe-scrollable when 5 labels
      exceed a narrow phone's width
    - `scrollbar-width: none` + ::-webkit-scrollbar hide the scrollbar
      itself for a clean look while scrolling still works
  */
  .mobile-nav-list {
    display: flex;
    flex-wrap: nowrap;          /* Never wrap — scroll horizontally instead */
    align-items: center;        /* Vertically center labels in the row */
    gap: 0.5rem;                /* Space between items AND dot separators */
    list-style: none;           /* Remove browser bullet points */
    margin: 0;                  /* Reset default <ol> margins */
    /* Side padding mirrors .container (min(4rem, 5vw)) for alignment */
    padding: 0.6rem min(4rem, 5vw);
    overflow-x: auto;           /* Enable horizontal swiping on narrow screens */
    white-space: nowrap;        /* Prevent individual labels from wrapping */
    scrollbar-width: none;      /* Firefox: hide scrollbar track/thumb */
    -ms-overflow-style: none;   /* Legacy Edge: hide scrollbar */
  }

  /* Chrome/Safari/WebKit browsers: hide the scrollbar completely */
  .mobile-nav-list::-webkit-scrollbar {
    display: none;
  }

  /*
    Dot separator between items: a "·" injected via ::before on every
    item EXCEPT the first (`+` sibling selector skips the first item).
    Muted gray keeps it subtle next to the text labels.
  */
  .mobile-nav-item + .mobile-nav-item::before {
    content: '·';                     /* Middle-dot separator character */
    margin-right: 0.5rem;             /* Breathing room after the dot */
    color: var(--color-text-muted);   /* Dim gray — decorative only */
  }

  /*
    Base style shared by ALL page links (active and inactive):
    compact text sized for small screens, medium gray by default.
  */
  .mobile-nav-link {
    font-family: var(--font-content); /* Site-wide content font */
    font-size: 0.8rem;                /* Compact size fits 5 labels better */
    font-weight: 400;                 /* Regular weight for inactive pages */
    color: var(--color-text-muted);   /* Dark gray — readable but subdued */
  }

  /*
    ACTIVE page highlight: the page the user is currently viewing gets
    deep brand green + bold weight so it stands out from gray neighbors.
  */
  .mobile-nav-link.active,
  .mobile-nav-item.active .mobile-nav-link {
    color: var(--color-green);  /* Deep forest green — unmistakably "you are here" */
    font-weight: 700;           /* Bold adds emphasis without extra decoration */
  }
}
</style>
