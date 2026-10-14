import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { Category } from './Category';

export const MenuItem = defineEntity({
  name: 'MenuItem',
  properties: {
    id: p.integer().primary(),
    name: p.string(),
    description: p.string(),
    priceTakeaway: p.float(),
    priceDinein: p.float(),
    category: p.manyToOne(Category),
    image: p.string(),
    sortOrder: p.integer().default(0),
  },
});

export type MenuItem = InferEntity<typeof MenuItem>;
