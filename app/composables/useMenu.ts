// ============================================================================
// useMenu.ts — Composable: Menu Data & Types
// ============================================================================
// A "composable" is a reusable piece of logic in Vue/Nuxt.
// Think of it like a function that provides data and methods to components.
//
// 📚 LEARNING — Composables in Nuxt 4:
// - Files in app/composables/ are AUTO-IMPORTED by Nuxt.
//   You DON'T need to `import { useMenu } from '...'` in your components.
//   Just call `useMenu()` anywhere and Nuxt knows what you mean.
// - The naming convention is `use___` (e.g., useMenu, useAuth, useFetch).
// - This is similar to React Hooks if you've heard of them.

// 📚 LEARNING — Dual Pricing System:
// Each menu item now has TWO prices:
// - `priceTakeaway`: the price when ordering takeaway (lower, no service charge)
// - `priceDinein`: the price when dining in (higher, includes service & ambiance)
//
// The user's physical proximity to the restaurant determines which price is shown.
// If they're within 10 meters → dine-in price. Otherwise → takeaway price.
// This is handled by the AddToCartButton component using the useLocation composable.

// ── TypeScript Interfaces ──

/**
 * MenuItem defines what each dish on the menu looks like.
 *
 * 📚 DUAL PRICING:
 * The old `price` field has been replaced with TWO fields:
 * - `priceTakeaway`: base price for takeaway orders
 * - `priceDinein`: price for dine-in orders (includes service charge)
 *
 * This is more realistic — restaurants often charge slightly more for
 * dine-in due to table service, ambiance, and overhead costs.
 */
export interface MenuItem {
  id: number                // Unique identifier for each dish
  name: string              // Display name (e.g., "Grilled Ribeye")
  description: string       // Short description shown on the menu card
  priceTakeaway: number     // Price for takeaway orders (e.g., 38 means $38)
  priceDinein: number       // Price for dine-in orders (e.g., 44 means $44)
  category: string          // Which section it belongs to (e.g., "mains", "starters")
  image: string             // URL to the dish's photo (e.g., a Unsplash image link)
}

/**
 * Category defines a filter tab on the menu page.
 *
 * 📚 `slug` is a URL-friendly identifier (lowercase, no spaces).
 *    We use slugs for filtering logic, and `label` for what the user sees.
 */
export interface Category {
  slug: string   // e.g., "starters" — used in code and URLs
  label: string  // e.g., "Starters" — shown to the user as a button
}

// ── Data: Now loaded from server-side JSON via API routes ──
//
// 📚 LEARNING — Why Move Data to the Server?
// Previously, all menu data was hardcoded in this composable (client-side).
// Now it lives in `server/data/menu.json` and is served via `GET /api/menu`.
//
// Benefits:
// 1. Data is NOT bundled into the client JavaScript (smaller page load)
// 2. Data can be updated by editing JSON files without rebuilding the app
// 3. The server can add logic (e.g., filtering, sorting, admin auth) later
//
// 📚 How Data Flows Now:
// server/data/menu.json → server/api/menu.get.ts → useFetch('/api/menu') → page template
