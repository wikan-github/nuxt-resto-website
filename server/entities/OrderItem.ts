import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { Order } from './Order';

export const OrderItem = defineEntity({
  name: 'OrderItem',
  properties: {
    id: p.integer().primary(),
    order: () => p.manyToOne(Order),
    itemId: p.integer(),
    itemName: p.string(),
    quantity: p.integer(),
    price: p.float(),
    orderType: p.string(),
  },
});

export type OrderItem = InferEntity<typeof OrderItem>;
