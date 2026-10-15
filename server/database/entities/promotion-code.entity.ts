import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CampaignPromotion } from './promotion.entity';

export const CampaignPromotionCode = defineEntity({
  name: 'CampaignPromotionCode',
  tableName: 'promotion_code',
  properties: {
    id: p.integer().primary(),
    promotion: p.manyToOne(CampaignPromotion),
    channel: p.string(),
    code: p.string().unique(),
    maxUses: p.integer().nullable(),
    usedCount: p.integer().default(0),
    isActive: p.boolean().default(true),
  },
});

export type CampaignPromotionCode = InferEntity<typeof CampaignPromotionCode>;
