import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const Category = defineEntity({
  name: 'Category',
  properties: {
    id: p.integer().primary(),
    slug: p.string(),
    label: p.string(),
    sortOrder: p.integer().default(0),
  },
});

export type Category = InferEntity<typeof Category>;
