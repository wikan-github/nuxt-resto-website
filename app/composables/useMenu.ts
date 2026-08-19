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

// ── Data ──

/**
 * categories: the list of filter tabs shown at the top of the menu page.
 *
 * 📚 `Category[]` means "an array of Category objects".
 *    Each item must match the { slug, label } shape defined above.
 */
const categories: Category[] = [
  { slug: 'all', label: 'All' },       // "All" shows every dish
  { slug: 'starters', label: 'Starters' },
  { slug: 'mains', label: 'Mains' },
  { slug: 'pasta', label: 'Pasta' },
  { slug: 'pizza', label: 'Pizza' },
  { slug: 'desserts', label: 'Desserts' },
  { slug: 'drinks', label: 'Drinks' },
]

/**
 * menuItems: all the dishes on the restaurant's menu.
 *
 * 📚 DUAL PRICING — Each item has `priceTakeaway` and `priceDinein`.
 *    Dine-in prices are ~15% higher than takeaway prices, reflecting
 *    the additional cost of table service and dining experience.
 *
 * 📚 Each item matches the MenuItem interface:
 *    { id, name, description, priceTakeaway, priceDinein, category, image }
 */
const menuItems: MenuItem[] = [
  // ── Starters ──
  {
    id: 1,
    name: 'Bruschetta Trio',
    description: 'Toasted ciabatta topped with tomato basil, ricotta honey, and olive tapenade',
    priceTakeaway: 12,
    priceDinein: 14,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80',
  },
  {
    id: 2,
    name: 'Crispy Calamari',
    description: 'Golden fried squid rings with spicy aioli and lemon wedge',
    priceTakeaway: 14,
    priceDinein: 16,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  },
  {
    id: 3,
    name: 'Burrata Caprese',
    description: 'Creamy burrata with heirloom tomatoes, basil pesto, and aged balsamic',
    priceTakeaway: 15,
    priceDinein: 17,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80',
  },
  {
    id: 4,
    name: 'French Onion Soup',
    description: 'Slow-cooked caramelized onion soup with gruyère crouton',
    priceTakeaway: 11,
    priceDinein: 13,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  },

  // ── Mains ──
  {
    id: 5,
    name: 'Grilled Ribeye',
    description: '300g ribeye steak, herb butter, roasted vegetables, and truffle fries',
    priceTakeaway: 38,
    priceDinein: 44,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80',
  },
  {
    id: 6,
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon fillet with lemon dill sauce and seasonal greens',
    priceTakeaway: 28,
    priceDinein: 32,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  },
  {
    id: 7,
    name: 'Duck Confit',
    description: 'Slow-cooked duck leg with cherry gastrique and creamy polenta',
    priceTakeaway: 32,
    priceDinein: 37,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80',
  },
  {
    id: 8,
    name: 'Herb Roasted Chicken',
    description: 'Free-range half chicken with rosemary jus and garlic mash',
    priceTakeaway: 26,
    priceDinein: 30,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
  },

  // ── Pasta ──
  {
    id: 9,
    name: 'Truffle Carbonara',
    description: 'Spaghetti with pancetta, pecorino, egg yolk, and black truffle',
    priceTakeaway: 22,
    priceDinein: 25,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
  },
  {
    id: 10,
    name: 'Lobster Linguine',
    description: 'Fresh linguine with butter-poached lobster and cherry tomatoes',
    priceTakeaway: 30,
    priceDinein: 35,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
  },
  {
    id: 11,
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice with porcini, chanterelle, and parmesan foam',
    priceTakeaway: 21,
    priceDinein: 24,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80',
  },

  // ── Pizza ──
  {
    id: 12,
    name: 'Margherita DOP',
    description: 'San Marzano tomatoes, fior di latte, fresh basil, and EVOO',
    priceTakeaway: 18,
    priceDinein: 21,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
  },
  {
    id: 13,
    name: 'Prosciutto & Arugula',
    description: 'Tomato base, mozzarella, San Daniele prosciutto, and rocket',
    priceTakeaway: 22,
    priceDinein: 25,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  },
  {
    id: 14,
    name: 'Truffle Mushroom',
    description: 'Cream base, mixed wild mushrooms, mozzarella, and truffle oil',
    priceTakeaway: 24,
    priceDinein: 28,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
  },

  // ── Desserts ──
  {
    id: 15,
    name: 'Tiramisu',
    description: 'Classic Italian mascarpone cream with espresso-soaked ladyfingers',
    priceTakeaway: 12,
    priceDinein: 14,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
  },
  {
    id: 16,
    name: 'Crème Brûlée',
    description: 'Madagascar vanilla bean custard with caramelized sugar crust',
    priceTakeaway: 11,
    priceDinein: 13,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80',
  },
  {
    id: 17,
    name: 'Chocolate Fondant',
    description: 'Warm dark chocolate cake with a molten centre and vanilla gelato',
    priceTakeaway: 14,
    priceDinein: 16,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
  },

  // ── Drinks ──
  {
    id: 18,
    name: 'House Red',
    description: 'Glass of Chianti Classico — cherry, plum, and soft tannins',
    priceTakeaway: 14,
    priceDinein: 16,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
  },
  {
    id: 19,
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, fresh espresso, and vanilla syrup',
    priceTakeaway: 16,
    priceDinein: 18,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80',
  },
  {
    id: 20,
    name: 'Sparkling Lemonade',
    description: 'House-made sparkling lemonade with fresh mint',
    priceTakeaway: 7,
    priceDinein: 8,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80',
  },
]

// ── Composable Function ──

/**
 * useMenu() is the composable function that components call to get menu data.
 *
 * 📚 LEARNING — How Auto-Import Works:
 *    In any .vue file or composable, you can just write:
 *      const { categories, menuItems } = useMenu()
 *    Nuxt automatically resolves this because the file is in composables/.
 */
export function useMenu() {
  return {
    categories,   // The filter tabs
    menuItems,    // All dishes (with dual pricing)
  }
}
