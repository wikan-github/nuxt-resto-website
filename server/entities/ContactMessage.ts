import { defineEntity, p, type InferEntity } from '@mikro-orm/core';

export const ContactMessage = defineEntity({
  name: 'ContactMessage',
  properties: {
    id: p.integer().primary(),
    name: p.string(),
    email: p.string(),
    subject: p.string(),
    message: p.string(),
    read: p.boolean().default(false),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export type ContactMessage = InferEntity<typeof ContactMessage>;
