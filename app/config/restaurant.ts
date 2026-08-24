// ============================================================================
// restaurant.ts — Central Restaurant Configuration
// ============================================================================
// This file stores ALL restaurant-specific constants in ONE place.
// Instead of hardcoding coordinates, phone numbers, and geofence radius
// across multiple files, we define them here once and import everywhere.
//
// 📚 LEARNING — Single Source of Truth:
// If the restaurant moves to a new location, you ONLY change this file.
// Every component that imports from here automatically gets the updated values.
// This is the DRY principle: "Don't Repeat Yourself."
//
// 📚 LEARNING — Why NOT use a composable for this?
// This file exports plain JavaScript CONSTANTS (not functions or reactive state).
// It doesn't need Vue reactivity — it's just data that never changes at runtime.
// Composables are for logic and state; config files are for static values.

// ── Restaurant Coordinates ──
// Extracted from the Google Maps embed URL in the footer.
// These are the EXACT coordinates of Tropical View Ubud, Bali.
//
// 📚 LEARNING — Latitude & Longitude:
// - Latitude:  how far north/south from the equator (-90 to +90)
//   -8.506 means 8.506 degrees SOUTH of the equator (Bali is in the southern hemisphere)
// - Longitude: how far east/west from the Prime Meridian (-180 to +180)
//   115.262 means 115.262 degrees EAST of Greenwich, England (Indonesia)
//
// These coordinates are used by the Haversine formula in useLocation.ts
// to calculate the distance between the user and the restaurant.
// export const RESTAURANT_LAT = -8.5183644 as const
// export const RESTAURANT_LNG = 115.26155 as const
export const RESTAURANT_LAT = -8.6802432 as const
export const RESTAURANT_LNG = 115.2024576 as const

// ── Geofence Radius ──
// The maximum distance (in meters) for a user to be considered "near" the restaurant.
// 10 meters = roughly 3 feet — basically standing right at the restaurant.
//
// 📚 LEARNING — Why 10 meters?
// The user requested a strict proximity check. 10m means the user must be
// physically at the restaurant to see "Dine In" pricing. If they're even
// 11 meters away, they'll see "Take Away" pricing instead.
//
// 📚 `as const` tells TypeScript this is a LITERAL value (not just a number).
//    This lets other code use it as a precise type, not a generic `number`.
export const GEOFENCE_RADIUS_METERS = 10 as const

// ── Order Type Constants ──
// Defines the two order types available: takeaway and dine-in.
// These string literals are used throughout the app for consistency.
//
// 📚 LEARNING — String Literal Types:
// By exporting these as `as const`, TypeScript treats them as literal types
// (not generic `string`). This means if you try to pass `'delivery'` somewhere
// that expects OrderType, TypeScript will show an error.
export type OrderType = 'takeaway' | 'dine-in'

// ── Dine-in Price Multiplier ──
// Dine-in prices are this factor times the takeaway price.
// 1.15 means dine-in is 15% more expensive than takeaway.
//
// 📚 LEARNING — Why is dine-in more expensive?
// Dine-in includes: table service, ambiance, staff attention, dish washing,
// climate control, etc. Takeaway has lower overhead (packaging is cheaper
// than providing a full dining experience).
export const DINEIN_PRICE_MULTIPLIER = 1.15 as const
