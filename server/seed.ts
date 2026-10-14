import { MikroORM } from '@mikro-orm/sqlite';
import config from '../mikro-orm.config';
import { Restaurant } from './entities/Restaurant';
import { Category } from './entities/Category';
import { MenuItem } from './entities/MenuItem';
import { Promotion } from './entities/Promotion';

const orm = await MikroORM.init(config);
const em = orm.em.fork();

await em.nativeDelete(MenuItem, {});
await em.nativeDelete(Promotion, {});
await em.nativeDelete(Category, {});
await em.nativeDelete(Restaurant, {});

const restaurant = em.create(Restaurant, {
  id: 1,
  whatsappNumber: '6281805444270',
  whatsappDisplay: '+62 81-805-444-270',
  reservationMessage: 'Hello, I want a reservation',
  mapLatitude: -8.506,
  mapLongitude: 115.262,
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.6!2d115.262!3d-8.506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMjEuNiJTIDExNcKwMTUnNDMuMiJF!5e0!3m2!1sen!2sid!4v1',
  mapLinkUrl: 'https://maps.google.com/?q=-8.506,115.262',
  geofenceRadiusMeters: 30,
  dineInMultiplier: 1.15,
  brandingName: 'Tropical View Ubud',
  brandingTagline: 'A unique dining experience amidst the calming natural atmosphere of Ubud.',
  brandingLogoPath: '/images/logo.png',
  addressStreet: 'Monkey Forest Street',
  addressLocality: 'Ubud',
  addressRegion: 'Gianyar, Bali',
  addressPostalCode: '80571',
  addressCountry: 'Indonesia',
  addressFull: 'Monkey Forest Street, Ubud, Gianyar, Bali 80571, Indonesia',
});
em.persist(restaurant);

const categories = [
  { id: 1, slug: 'starters', label: 'Starters', sortOrder: 1 },
  { id: 2, slug: 'mains', label: 'Mains', sortOrder: 2 },
  { id: 3, slug: 'pasta', label: 'Pasta', sortOrder: 3 },
  { id: 4, slug: 'pizza', label: 'Pizza', sortOrder: 4 },
  { id: 5, slug: 'desserts', label: 'Desserts', sortOrder: 5 },
  { id: 6, slug: 'drinks', label: 'Drinks', sortOrder: 6 },
  { id: 7, slug: 'all', label: 'All', sortOrder: 0 },
];
for (const cat of categories) {
  em.persist(em.create(Category, cat));
}

const menuItems = [
  { name: 'Bruschetta Trio', description: 'Toasted ciabatta topped with tomato basil, ricotta honey, and olive tapenade', priceTakeaway: 12, priceDinein: 14, category: 1, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80' },
  { name: 'Crispy Calamari', description: 'Golden fried squid rings with spicy aioli and lemon wedge', priceTakeaway: 14, priceDinein: 16, category: 1, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80' },
  { name: 'Burrata Caprese', description: 'Creamy burrata with heirloom tomatoes, basil pesto, and aged balsamic', priceTakeaway: 15, priceDinein: 17, category: 1, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80' },
  { name: 'French Onion Soup', description: 'Slow-cooked caramelized onion soup with gruyère crouton', priceTakeaway: 11, priceDinein: 13, category: 1, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80' },
  { name: 'Grilled Ribeye', description: '300g ribeye steak, herb butter, roasted vegetables, and truffle fries', priceTakeaway: 38, priceDinein: 44, category: 2, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80' },
  { name: 'Pan-Seared Salmon', description: 'Atlantic salmon fillet with lemon dill sauce and seasonal greens', priceTakeaway: 28, priceDinein: 32, category: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80' },
  { name: 'Duck Confit', description: 'Slow-cooked duck leg with cherry gastrique and creamy polenta', priceTakeaway: 32, priceDinein: 37, category: 2, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80' },
  { name: 'Herb Roasted Chicken', description: 'Free-range half chicken with rosemary jus and garlic mash', priceTakeaway: 26, priceDinein: 30, category: 2, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80' },
  { name: 'Truffle Carbonara', description: 'Spaghetti with pancetta, pecorino, egg yolk, and black truffle', priceTakeaway: 22, priceDinein: 25, category: 3, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80' },
  { name: 'Lobster Linguine', description: 'Fresh linguine with butter-poached lobster and cherry tomatoes', priceTakeaway: 30, priceDinein: 35, category: 3, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80' },
  { name: 'Wild Mushroom Risotto', description: 'Arborio rice with porcini, chanterelle, and parmesan foam', priceTakeaway: 21, priceDinein: 24, category: 3, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80' },
  { name: 'Margherita DOP', description: 'San Marzano tomatoes, fior di latte, fresh basil, and EVOO', priceTakeaway: 18, priceDinein: 21, category: 4, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80' },
  { name: 'Prosciutto & Arugula', description: 'Tomato base, mozzarella, San Daniele prosciutto, and rocket', priceTakeaway: 22, priceDinein: 25, category: 4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
  { name: 'Truffle Mushroom', description: 'Cream base, mixed wild mushrooms, mozzarella, and truffle oil', priceTakeaway: 24, priceDinein: 28, category: 4, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
  { name: 'Tiramisu', description: 'Classic Italian mascarpone cream with espresso-soaked ladyfingers', priceTakeaway: 12, priceDinein: 14, category: 5, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80' },
  { name: 'Crème Brûlée', description: 'Madagascar vanilla bean custard with caramelized sugar crust', priceTakeaway: 11, priceDinein: 13, category: 5, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80' },
  { name: 'Chocolate Fondant', description: 'Warm dark chocolate cake with a molten centre and vanilla gelato', priceTakeaway: 14, priceDinein: 16, category: 5, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80' },
  { name: 'House Red', description: 'Glass of Chianti Classico — cherry, plum, and soft tannins', priceTakeaway: 14, priceDinein: 16, category: 6, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80' },
  { name: 'Espresso Martini', description: 'Vodka, coffee liqueur, fresh espresso, and vanilla syrup', priceTakeaway: 16, priceDinein: 18, category: 6, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80' },
  { name: 'Sparkling Lemonade', description: 'House-made sparkling lemonade with fresh mint', priceTakeaway: 7, priceDinein: 8, category: 6, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80' },
];
menuItems.forEach((item, index) => {
  const { category, ...rest } = item;
  em.persist(
    em.create(MenuItem, {
      ...rest,
      category: em.getReference(Category, category),
      sortOrder: index,
    }),
  );
});

const promotions = [
  { title: 'Weekend Sunset Set Menu', description: 'Enjoy a curated 3-course dinner with complimentary welcome drink as the sun sets over the rice terraces. Available every Friday and Saturday evening.', discount: '15% OFF', originalPriceTakeaway: 65, originalPriceDinein: 75, promoPriceTakeaway: 55, promoPriceDinein: 64, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', category: 'set-menu', validUntil: 'Dec 31, 2026', isFeatured: true },
  { title: 'Tropical Cocktail Hour', description: 'Every day from 4PM to 7PM, enjoy our signature cocktails at a special price. Try our famous Tropical Sunset or Bali Breeze.', discount: '2 FOR 1', originalPriceTakeaway: 16, originalPriceDinein: 18, promoPriceTakeaway: 16, promoPriceDinein: 18, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', category: 'drink', validUntil: 'Dec 31, 2026', isFeatured: true },
  { title: 'Nasi Goreng Special', description: 'Our signature Nasi Goreng with BBQ Pork Ribs — a perfect combination of Indonesian flavors and smoky ribs. Served with pickled vegetables and prawn crackers.', discount: '20% OFF', originalPriceTakeaway: 22, originalPriceDinein: 25, promoPriceTakeaway: 18, promoPriceDinein: 20, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', category: 'food', validUntil: 'Sep 30, 2026', isFeatured: false },
  { title: 'Crispy Duck Feast', description: 'Traditional Balinese Crispy Duck with sambal matah, steamed rice, and lawar. A true taste of Bali on your plate.', discount: '10% OFF', originalPriceTakeaway: 28, originalPriceDinein: 32, promoPriceTakeaway: 25, promoPriceDinein: 29, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80', category: 'food', validUntil: 'Sep 30, 2026', isFeatured: false },
  { title: 'Wood-Fired Pizza Night', description: 'Every Wednesday, enjoy any pizza from our wood-fired oven at a special price. Pair with a glass of house wine for the perfect midweek treat.', discount: '$15 PIZZAS', originalPriceTakeaway: 24, originalPriceDinein: 28, promoPriceTakeaway: 15, promoPriceDinein: 17, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', category: 'food', validUntil: 'Dec 31, 2026', isFeatured: false },
  { title: 'Grilled Ribeye Night', description: 'Premium 300g Australian ribeye steak, grilled to your liking, served with truffle fries, roasted vegetables, and our signature herb butter.', discount: 'FREE DESSERT', originalPriceTakeaway: 38, originalPriceDinein: 44, promoPriceTakeaway: 38, promoPriceDinein: 44, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', category: 'food', validUntil: 'Oct 31, 2026', isFeatured: false },
  { title: 'Fresh Juice Happy Hour', description: 'Start your morning right with our fresh tropical juices — mango, passion fruit, dragon fruit, and more. Perfect alongside a Balinese breakfast.', discount: '30% OFF', originalPriceTakeaway: 7, originalPriceDinein: 8, promoPriceTakeaway: 5, promoPriceDinein: 6, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80', category: 'drink', validUntil: 'Dec 31, 2026', isFeatured: false },
  { title: 'Wine & Dine Wednesday', description: 'Half-price on all imported wines by the glass when you order any main course. Perfect excuse for a midweek date night.', discount: '50% OFF WINE', originalPriceTakeaway: 14, originalPriceDinein: 16, promoPriceTakeaway: 7, promoPriceDinein: 8, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', category: 'drink', validUntil: 'Dec 31, 2026', isFeatured: false },
  { title: 'Breakfast Bundle', description: 'Choose any breakfast dish from our menu plus a freshly brewed coffee or juice. Available daily from 7AM to 11AM.', discount: 'SAVE $5', originalPriceTakeaway: 18, originalPriceDinein: 21, promoPriceTakeaway: 13, promoPriceDinein: 16, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80', category: 'daily', validUntil: 'Dec 31, 2026', isFeatured: false },
  { title: 'Tropical Dessert Platter', description: 'Share our signature dessert platter for two — Tiramisu, Crème Brûlée, Chocolate Fondant, and tropical fruit selection. The perfect end to your meal.', discount: '25% OFF', originalPriceTakeaway: 36, originalPriceDinein: 41, promoPriceTakeaway: 27, promoPriceDinein: 31, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80', category: 'food', validUntil: 'Nov 30, 2026', isFeatured: false },
];
for (const promo of promotions) {
  em.persist(em.create(Promotion, promo));
}

await em.flush();
console.log('Database seeded successfully!');
await orm.close();
