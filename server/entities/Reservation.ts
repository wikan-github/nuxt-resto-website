import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const Reservation = defineEntity({
  name: 'Reservation',
  properties: {
    id: p.integer().primary(),
    customerName: p.string(),
    customerPhone: p.string(),
    customerEmail: p.string(),
    date: p.string(),
    time: p.string(),
    partySize: p.integer(),
    specialRequests: p.string().nullable(),
    status: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export type Reservation = InferEntity<typeof Reservation>;
