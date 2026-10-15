import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const Promotion = defineEntity({
  name: 'Promotion',
  // Legacy menu promotions live in `menu_promotion` since v7 campaign model
  // claimed the `promotion` table name. API routes use this entity, unchanged.
  tableName: 'menu_promotion',
  properties: {
    id: p.integer().primary(),
    title: p.string(),
    description: p.string(),
    discount: p.string(),
    originalPriceTakeaway: p.float(),
    originalPriceDinein: p.float(),
    promoPriceTakeaway: p.float(),
    promoPriceDinein: p.float(),
    image: p.string(),
    category: p.string(),
    validUntil: p.string(),
    isFeatured: p.boolean().default(false),
  },
});

export type Promotion = InferEntity<typeof Promotion>;
