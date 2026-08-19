// ============================================================================
// nuxt.config.ts — Nuxt Configuration File
// ============================================================================
// This is the CENTRAL CONFIG for your entire Nuxt app. Nuxt reads this file
// when you run `nuxt dev` or `nuxt build`. It controls global settings.
//
// 📚 LEARNING:
// - This file runs in Node.js (NOT in the browser)
// - Nuxt auto-imports `defineNuxtConfig` so you don't need to import it
// - The `~` alias in Nuxt points to your project root
// ============================================================================

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  // compatibilityDate locks the Nuxt behavior to a specific date.
  // This prevents surprises when you upgrade Nuxt later.
  // 📚 Think of it like a "minimum version guarantee" for API behavior.
  compatibilityDate: '2025-07-15',

  // css: an array of global CSS files applied to EVERY page in your app.
  // 📚 `~/` is a Nuxt alias that means "the root of this project".
  //    So ~/assets/css/main.css → /app/assets/css/main.css
  css: ['~/assets/css/main.css'],

  // Enable Nuxt DevTools (a browser panel for debugging your app).
  // Press Ctrl+Shift+D in the browser to open it when dev server is running.
  devtools: { enabled: true },

  // ── app: settings for the client-side (browser) application ──
  app: {

    // head: sets global <head> tags (meta, title, links) for every page.
    // 📚 In HTML, <head> is where you put metadata that is NOT visible
    //    on the page itself (like page title, SEO description, fonts).
    head: {

      // The text shown in the browser tab.
      title: 'Tropical View Ubud — Restaurant',

      // htmlAttrs: sets attributes on the <html> tag.
      // `lang="en"` tells search engines and screen readers the page is English.
      htmlAttrs: { lang: 'en' },

      // meta: an array of <meta> tags for SEO and browser behavior.
      meta: [
        // charset: tells the browser to use UTF-8 encoding (supports all languages).
        { charset: 'utf-8' },

        // viewport: makes the site responsive on mobile devices.
        // width=device-width = the layout width matches the screen width.
        // initial-scale=1.0 = no zoom when the page loads.
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // description: shown in Google search results below your page title.
        { name: 'description', content: 'A unique dining experience amidst the calming natural atmosphere of Ubud. Indonesian and international dishes, specialty coffee, and cocktails.' },
      ],

      // link: an array of <link> tags (favicon, fonts, stylesheets, etc.)
      link: [
        // favicon: the small icon shown in the browser tab.
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },

        // ── Google Fonts loading strategy ──
        // Step 1: preconnect tells the browser "we WILL need resources from
        //         these servers, so start the connection early". This saves ~100ms.
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

        // Step 2: actually load the font stylesheet.
        // We load 3 font families:
        //   - Cardo: elegant serif font → used for headings (h1, h2, etc.)
        //   - Inter: clean sans-serif → used for body text
        //   - Mulish: friendly sans-serif → used for UI text, buttons, labels
        // 📚 `family=Cardo:ital,wght@0,400;0,700;1,400` means:
        //    load Cardo italic=off, weight 400 and 700, and italic weight 400.
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
