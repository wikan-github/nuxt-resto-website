import { defineConfig } from '@mikro-orm/sqlite';
import { Restaurant } from './server/entities/Restaurant';
import { Category } from './server/entities/Category';
import { MenuItem } from './server/entities/MenuItem';
import { Promotion } from './server/entities/Promotion';
import { Order } from './server/entities/Order';
import { OrderItem } from './server/entities/OrderItem';
import { Reservation } from './server/entities/Reservation';
import { ContactMessage } from './server/entities/ContactMessage';
import { CampaignPromotion } from './server/database/entities/promotion.entity';
import { CampaignPromotionTranslation } from './server/database/entities/promotion-translation.entity';
import { CampaignPromotionCategory } from './server/database/entities/promotion-category.entity';
import { CampaignPromotionCode } from './server/database/entities/promotion-code.entity';
import { PromotionRedemption } from './server/database/entities/promotion-redemption.entity';

export default defineConfig({
  entities: [
    Restaurant, Category, MenuItem, Promotion, Order, OrderItem, Reservation, ContactMessage,
    CampaignPromotion, CampaignPromotionTranslation, CampaignPromotionCategory, CampaignPromotionCode,
    PromotionRedemption,
  ],
  dbName: './data/resto.db',
  migrations: {
    path: './server/migrations',
    snapshot: false,
  },
  seeder: {
    path: './server/database/seeders',
  },
  debug: process.env.NODE_ENV !== 'production',
});
