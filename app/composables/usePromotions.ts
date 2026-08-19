// ============================================================================
// usePromotions.ts — Composable: Promotion Data & Types
// ============================================================================
// This composable stores all current promotions and special offers.
// Components call `usePromotions()` to get the promo data.
//
// 📚 LEARNING — Dual Pricing for Promotions:
// Each promotion now has TWO price fields:
// - `originalPriceTakeaway` / `promoPriceTakeaway`: for takeaway orders
// - `originalPriceDinein` / `promoPriceDinein`: for dine-in orders
//
// The discount text (e.g., "20% OFF") stays the same regardless of order type.
// Only the actual dollar amounts change based on proximity to the restaurant.

// ── TypeScript Interface ──

/**
 * Promotion defines what each promotion/offering looks like.
 *
 * 📚 DUAL PRICING — Four price fields instead of two:
 * - `originalPriceTakeaway`: regular takeaway price before discount (null if not applicable)
 * - `originalPriceDinein`: regular dine-in price before discount (null if not applicable)
 * - `promoPriceTakeaway`: discounted takeaway price
 * - `promoPriceDinein`: discounted dine-in price
 */
export interface Promotion {
  id: number                      // Unique identifier (e.g., 1, 2, 3)
  title: string                   // Short catchy name (e.g., "Happy Hour Special")
  description: string             // Detailed explanation of the promotion
  discount: string                // Badge text (e.g., "20% OFF", "FREE DRINK")
  originalPriceTakeaway: number | null  // Original takeaway price before discount (null if not applicable)
  originalPriceDinein: number | null    // Original dine-in price before discount (null if not applicable)
  promoPriceTakeaway: number            // Discounted takeaway price
  promoPriceDinein: number              // Discounted dine-in price
  image: string                   // URL to a photo that represents this promotion
  category: string                // Group for filtering (e.g., "food", "drink", "set-menu", "daily")
  validUntil: string              // Expiry date shown to the user (e.g., "Dec 31, 2026")
  isFeatured: boolean             // If true, this promo gets a special "Featured" badge
}

// ── Data: Now loaded from server-side JSON via API routes ──
//
// 📚 LEARNING — Data Migration Pattern:
// Previously, all promotion data was hardcoded here (client-side).
// Now it lives in `server/data/promotions.json` and is served via `GET /api/promotions`.
//
// Pages use `useFetch('/api/promotions')` to load data from the server.
// This composable now ONLY provides the TypeScript interface — the "shape"
// of the data. Pages and components still reference this interface for type safety.
//
// 📚 How Data Flows Now:
// server/data/promotions.json → server/api/promotions.get.ts → useFetch('/api/promotions') → page
