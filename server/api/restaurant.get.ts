// ============================================================================
// server/api/restaurant.get.ts — GET /api/restaurant API Route
// ============================================================================
// This Nitro server route reads the restaurant JSON data file (WhatsApp
// number, map coordinates, branding text, address) and returns it to the
// frontend as a single JSON object.
//
// 📚 LEARNING — Nuxt 4 Server Routes:
// - Any file inside `server/api/` automatically becomes an API endpoint.
// - The filename defines the HTTP verb: `restaurant.get.ts` responds to
//   GET /api/restaurant. A POST handler would be named `restaurant.post.ts`.
// - Nuxt auto-imports `defineEventHandler`, so no manual import is needed.
//
// 📚 LEARNING — Why serve config from the server?
// The frontend fetches this data at runtime instead of hardcoding it in
// components, so the restaurant owner can update ONE JSON file and every
// page (header CTA, footer map, contact page) reflects the change.
// ============================================================================

import { readFileSync } from 'fs'        // Node.js helper to read a file's full contents as a string
import { join, resolve } from 'path'     // Path helpers to build a safe absolute file path

// ── TypeScript Interface: describes the exact "shape" of restaurant.json ──
// 📚 This gives type safety everywhere the data is consumed (API + frontend).
export interface RestaurantInfo {
  whatsapp: {                 // WhatsApp contact block
    number: string            // Digits-only international format for wa.me links (e.g. "6281338774969")
    display: string           // Human-friendly formatted number shown in the UI (e.g. "+62 813-3877-4969")
    reservationMessage: string // Pre-filled text sent with the wa.me reservation link
  }
  map: {                      // Google Maps / geolocation block
    latitude: number          // Restaurant latitude in decimal degrees (negative = southern hemisphere)
    longitude: number         // Restaurant longitude in decimal degrees (positive = east of Greenwich)
    embedUrl: string          // Ready-to-use URL for <iframe> map embeds in the footer/contact page
    linkUrl: string           // External link that opens the position in Google Maps
  }
  branding: {                 // Brand identity block
    name: string              // Official restaurant name ("Tropical View Ubud")
    tagline: string           // Short marketing sentence used in headers/SEO
    logoPath: string          // Public path of the logo image served from /public
  }
  address: {                  // Physical address block
    street: string            // Street name only ("Monkey Forest Street")
    locality: string          // City/village ("Ubud")
    region: string            // Regency + island ("Gianyar, Bali")
    postalCode: string        // Postal code ("80571")
    country: string           // Country name ("Indonesia")
    full: string              // Single-line combined address ready for display
  }
}

// ── Route Handler ──
// 📚 `defineEventHandler` wraps our function; whatever it returns is
//    serialized to JSON and sent as the HTTP response body.
export default defineEventHandler((): RestaurantInfo => {

  // Build the ABSOLUTE path to the JSON file from the project root.
  // 📚 `resolve('.')` = current working directory at runtime (project root),
  //    then we safely append server/data/restaurant.json with `join`.
  const filePath = join(resolve('.'), 'server', 'data', 'restaurant.json')

  // Read the raw file contents synchronously as a UTF-8 text string.
  // 📚 Sync reading is fine here: the file is tiny and read once per request.
  const rawData = readFileSync(filePath, 'utf-8')

  // Parse the text into a JavaScript object matching RestaurantInfo.
  // 📚 JSON.parse throws if the file contains invalid JSON — that failure
  //    surfaces as a 500 response, which is exactly what we want.
  const restaurant = JSON.parse(rawData) as RestaurantInfo

  // Return the parsed object — Nitro serializes it as the JSON response.
  return restaurant
})
