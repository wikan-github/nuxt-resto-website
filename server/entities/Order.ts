import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { OrderItem } from './OrderItem';

export const Order = defineEntity({
  name: 'Order',
  properties: {
    id: p.integer().primary(),
    customerName: p.string(),
    customerPhone: p.string(),
    orderType: p.string(),
    tableNumber: p.string().nullable(),
    deliveryAddress: p.string().nullable(),
    totalAmount: p.float(),
    status: p.string(),
    whatsappSent: p.boolean().default(false),
    createdAt: p.datetime().onCreate(() => new Date()),
    items: () => p.oneToMany(OrderItem).mappedBy('order'),
  },
});

export type Order = InferEntity<typeof Order>;
