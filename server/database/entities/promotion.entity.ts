import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CampaignPromotionCategory } from './promotion-category.entity';

/**
 * Campaign promotion (the `promotion` table).
 * Metadata name is CampaignPromotion to avoid colliding with the legacy
 * menu-promos `Promotion` entity (now in `menu_promotion`).
 * Display copy lives in `promotion_translation`; this row holds
 * mechanics (validity, prices, flags) only.
 */
export const CampaignPromotion = defineEntity({
  name: 'CampaignPromotion',
  tableName: 'promotion',
  properties: {
    id: p.integer().primary(),
    slug: p.string().unique(),
    kind: p.string(),
    discountLabel: p.string(),
    audience: p.string(),
    requiresTicket: p.boolean().default(false),
    minSpend: p.float().nullable(),
    maxRedemptions: p.integer().nullable(),
    perCustomerLimit: p.integer().nullable(),
    validFrom: p.datetime().nullable(),
    validUntil: p.datetime().nullable(),
    daysOfWeek: p.string(),
    timeStart: p.string(),
    timeEnd: p.string(),
    originalPriceTakeaway: p.float().nullable(),
    originalPriceDinein: p.float().nullable(),
    promoPriceTakeaway: p.float().nullable(),
    promoPriceDinein: p.float().nullable(),
    heroImage: p.string().nullable(),
    thumbnail: p.string().nullable(),
    isActive: p.boolean().default(true),
    isFeatured: p.boolean().default(false),
    priority: p.integer().default(0),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
    categories: () => p.manyToMany(CampaignPromotionCategory).inversedBy('promotions'),
  },
});

export type CampaignPromotion = InferEntity<typeof CampaignPromotion>;
