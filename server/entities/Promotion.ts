import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const Promotion = defineEntity({
  name: 'Promotion',
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
