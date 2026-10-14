import { defineConfig } from '@mikro-orm/sqlite';
import { Restaurant } from './server/entities/Restaurant';
import { Category } from './server/entities/Category';
import { MenuItem } from './server/entities/MenuItem';
import { Promotion } from './server/entities/Promotion';
import { Order } from './server/entities/Order';
import { OrderItem } from './server/entities/OrderItem';
import { Reservation } from './server/entities/Reservation';
import { ContactMessage } from './server/entities/ContactMessage';

export default defineConfig({
  entities: [Restaurant, Category, MenuItem, Promotion, Order, OrderItem, Reservation, ContactMessage],
  dbName: './data/resto.db',
  migrations: {
    path: './server/migrations',
    snapshot: false,
  },
  debug: process.env.NODE_ENV !== 'production',
});
