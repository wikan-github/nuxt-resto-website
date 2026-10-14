// ============================================================================
// useRestaurant.ts — Composable: Restaurant Info (WA · Map · Branding · Address)
// ============================================================================
// This composable is the FRONTEND bridge to the GET /api/restaurant endpoint.
// Components call `useRestaurant()` to access the WhatsApp number, Google
// Maps coordinates/embed URL, branding text, and physical address.
//
// 📚 LEARNING — Data Flow (Nuxt 4 full-stack):
//   SQLite table `restaurant` (seeded)   ← single source of truth
//   → server/api/restaurant.get.ts       ← API route reads it via MikroORM
//   → useFetch('/api/restaurant')        ← this composable fetches it
//   → components/pages                   ← consume via useRestaurant()
//
// 📚 LEARNING — useFetch vs $fetch:
// - `useFetch` is SSR-aware: it runs on the server during initial render
//   AND transfers the result to the client (no duplicate request).
// - `$fetch` would fire a second HTTP call after hydration.
// - useFetch also returns `status` so we can show loading/error states.
//
// 📚 LEARNING — Composables in Nuxt 4:
// Files in `app/composables/` are auto-imported. Any component can call
// `useRestaurant()` without writing an import statement.
// ============================================================================

/**
 * RestaurantInfo is the flat shape returned by GET /api/restaurant
 * (the `restaurant` row from the SQLite database).
 */
export interface RestaurantInfo {
  id: number
  whatsappNumber: string
  whatsappDisplay: string
  reservationMessage: string
  mapLatitude: number
  mapLongitude: number
  mapEmbedUrl: string
  mapLinkUrl: string
  geofenceRadiusMeters: number
  dineInMultiplier: number
  brandingName: string
  brandingTagline: string
  brandingLogoPath: string
  addressStreet: string
  addressLocality: string
  addressRegion: string
  addressPostalCode: string
  addressCountry: string
  addressFull: string
}

/**
 * useRestaurant provides reactive access to all restaurant identity data:
 * WhatsApp contact, map coordinates, branding text, and address.
 *
 * 📚 Usage example inside any component:
 *   const { restaurant, waMeUrl } = useRestaurant()
 *   // restaurant.value?.brandingName  → "Tropical View Ubud"
 *   // waMeUrl.value                    → ready-to-open WhatsApp link
 */
export function useRestaurant() {

  // ── Server Fetch ──
  // Request GET /api/restaurant once; `key` dedupes the call app-wide so
  // multiple components share ONE payload instead of refetching each time.
  // 📚 `useFetch` returns a Vue Ref — access values with `.value`.
  const { data: restaurant, status, error } = useFetch<RestaurantInfo>(
    '/api/restaurant',              // The Nitro route created in server/api/restaurant.get.ts
    { key: 'restaurant-info' },     // Cache key: same payload reused across every caller
  )

  // ── Convenience Helpers ──
  // Pre-computed values that save components from repetitive null-checks.

  /**
   * waMeUrl builds a complete WhatsApp click-to-chat link including an
   * optional pre-filled message.
   *
   * 📚 Format required by WhatsApp: https://wa.me/<digits-only>?text=<url-encoded>
   *    encodeURIComponent escapes spaces/emoji so the URL stays valid.
   *
   * @param message - Optional text pre-filled in the chat input box
   * @returns Full wa.me URL, or '#' as a safe fallback while data loads
   */
  function waMeUrl(message?: string): string {
    // Guard: if the payload hasn't arrived yet there is no number to link to
    if (!restaurant.value) return '#'
    // Start from the digits-only international number stored in the DB
    const url = `https://wa.me/${restaurant.value.whatsappNumber}`
    // Append the encoded message only when the caller supplied one
    return message ? `${url}?text=${encodeURIComponent(message)}` : url
  }

  /**
   * mapsLink opens the restaurant position directly in Google Maps.
   *
   * 📚 A computed value recalculates automatically whenever the fetched
   *    data arrives — no manual refresh logic needed in components.
   */
  const mapsLink = computed<string>(() =>
    // Prefer the dedicated mapLinkUrl field, falling back to '#' while loading
    restaurant.value?.mapLinkUrl ?? '#',
  )

  // ── Return ──
  return {
    restaurant: readonly(restaurant), // Full RestaurantInfo object (or null before load)
    status,                           // 'idle' | 'pending' | 'success' | 'error' — for loading spinners
    error,                            // Error object if the fetch failed, otherwise null
    waMeUrl,                          // Helper: build WhatsApp chat URLs with optional prefilled text
    mapsLink,                         // Computed: direct Google Maps link for buttons/iframes
  }
}
