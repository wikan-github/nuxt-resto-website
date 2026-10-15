import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CampaignPromotion } from './promotion.entity';

/**
 * PromotionRedemption — one row per WhatsApp-claim tap (analytics only).
 * Check-in / order columns are filled later by staff flow (no UI yet);
 * stats endpoints treat missing values as zero, never as errors.
 */
export const PromotionRedemption = defineEntity({
  name: 'PromotionRedemption',
  tableName: 'promotion_redemption',
  indexes: [
    { properties: ['promotion', 'createdAt'] },
    { properties: ['utmSource'] },
  ],
  properties: {
    id: p.integer().primary(),
    promotion: p.manyToOne(CampaignPromotion),
    placement: p.string(),
    utmSource: p.string(),
    utmMedium: p.string(),
    userAgent: p.string().nullable(),
    language: p.string(),
    whatsappClaimAt: p.datetime(),
    checkedInAt: p.datetime().nullable(),
    orderedAt: p.datetime().nullable(),
    orderValue: p.float().nullable(),
    notes: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export type PromotionRedemption = InferEntity<typeof PromotionRedemption>;
