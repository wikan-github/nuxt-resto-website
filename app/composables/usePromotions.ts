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

// ── Data ──

/**
 * promotions: all current restaurant promotions and special offers.
 *
 * 📚 DUAL PRICING EXAMPLE:
 * "Nasi Goreng Special" promotion:
 * - Takeaway: was $22, now $18 (20% off)
 * - Dine-in: was $25, now $20 (20% off, but base prices are higher)
 */
const promotions: Promotion[] = [
  // ── Featured / Hero Promotions ──
  {
    id: 1,
    title: 'Weekend Sunset Set Menu',
    description: 'Enjoy a curated 3-course dinner with complimentary welcome drink as the sun sets over the rice terraces. Available every Friday and Saturday evening.',
    discount: '15% OFF',
    originalPriceTakeaway: 65,
    originalPriceDinein: 75,
    promoPriceTakeaway: 55,
    promoPriceDinein: 64,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    category: 'set-menu',
    validUntil: 'Dec 31, 2026',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Tropical Cocktail Hour',
    description: 'Every day from 4PM to 7PM, enjoy our signature cocktails at a special price. Try our famous Tropical Sunset or Bali Breeze.',
    discount: '2 FOR 1',
    originalPriceTakeaway: 16,
    originalPriceDinein: 18,
    promoPriceTakeaway: 16,
    promoPriceDinein: 18,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    category: 'drink',
    validUntil: 'Dec 31, 2026',
    isFeatured: true,
  },

  // ── Food Promotions ──
  {
    id: 3,
    title: 'Nasi Goreng Special',
    description: 'Our signature Nasi Goreng with BBQ Pork Ribs — a perfect combination of Indonesian flavors and smoky ribs. Served with pickled vegetables and prawn crackers.',
    discount: '20% OFF',
    originalPriceTakeaway: 22,
    originalPriceDinein: 25,
    promoPriceTakeaway: 18,
    promoPriceDinein: 20,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    category: 'food',
    validUntil: 'Sep 30, 2026',
    isFeatured: false,
  },
  {
    id: 4,
    title: 'Crispy Duck Feast',
    description: 'Traditional Balinese Crispy Duck with sambal matah, steamed rice, and lawar. A true taste of Bali on your plate.',
    discount: '10% OFF',
    originalPriceTakeaway: 28,
    originalPriceDinein: 32,
    promoPriceTakeaway: 25,
    promoPriceDinein: 29,
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80',
    category: 'food',
    validUntil: 'Sep 30, 2026',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'Wood-Fired Pizza Night',
    description: 'Every Wednesday, enjoy any pizza from our wood-fired oven at a special price. Pair with a glass of house wine for the perfect midweek treat.',
    discount: '$15 PIZZAS',
    originalPriceTakeaway: 24,
    originalPriceDinein: 28,
    promoPriceTakeaway: 15,
    promoPriceDinein: 17,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    category: 'food',
    validUntil: 'Dec 31, 2026',
    isFeatured: false,
  },
  {
    id: 6,
    title: 'Grilled Ribeye Night',
    description: 'Premium 300g Australian ribeye steak, grilled to your liking, served with truffle fries, roasted vegetables, and our signature herb butter.',
    discount: 'FREE DESSERT',
    originalPriceTakeaway: 38,
    originalPriceDinein: 44,
    promoPriceTakeaway: 38,
    promoPriceDinein: 44,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    category: 'food',
    validUntil: 'Oct 31, 2026',
    isFeatured: false,
  },

  // ── Drink Promotions ──
  {
    id: 7,
    title: 'Fresh Juice Happy Hour',
    description: 'Start your morning right with our fresh tropical juices — mango, passion fruit, dragon fruit, and more. Perfect alongside a Balinese breakfast.',
    discount: '30% OFF',
    originalPriceTakeaway: 7,
    originalPriceDinein: 8,
    promoPriceTakeaway: 5,
    promoPriceDinein: 6,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
    category: 'drink',
    validUntil: 'Dec 31, 2026',
    isFeatured: false,
  },
  {
    id: 8,
    title: 'Wine & Dine Wednesday',
    description: 'Half-price on all imported wines by the glass when you order any main course. Perfect excuse for a midweek date night.',
    discount: '50% OFF WINE',
    originalPriceTakeaway: 14,
    originalPriceDinein: 16,
    promoPriceTakeaway: 7,
    promoPriceDinein: 8,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    category: 'drink',
    validUntil: 'Dec 31, 2026',
    isFeatured: false,
  },

  // ── Daily Specials ──
  {
    id: 9,
    title: 'Breakfast Bundle',
    description: 'Choose any breakfast dish from our menu plus a freshly brewed coffee or juice. Available daily from 7AM to 11AM.',
    discount: 'SAVE $5',
    originalPriceTakeaway: 18,
    originalPriceDinein: 21,
    promoPriceTakeaway: 13,
    promoPriceDinein: 16,
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    category: 'daily',
    validUntil: 'Dec 31, 2026',
    isFeatured: false,
  },
  {
    id: 10,
    title: 'Tropical Dessert Platter',
    description: 'Share our signature dessert platter for two — Tiramisu, Crème Brûlée, Chocolate Fondant, and tropical fruit selection. The perfect end to your meal.',
    discount: '25% OFF',
    originalPriceTakeaway: 36,
    originalPriceDinein: 41,
    promoPriceTakeaway: 27,
    promoPriceDinein: 31,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    category: 'food',
    validUntil: 'Nov 30, 2026',
    isFeatured: false,
  },
]

// ── Composable Function ──

/**
 * usePromotions() returns all promotion data for components to use.
 *
 * 📚 LEARNING — Why This Pattern Works:
 * 1. The data lives in one place (single source of truth)
 * 2. Components just call `const { promotions } = usePromotions()`
 * 3. If you later want to fetch promos from an API, you change this ONE file
 *    and nothing breaks in the components.
 */
export function usePromotions() {
  return {
    promotions,  // The array of all promotion objects (with dual pricing)
  }
}
