import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CampaignPromotion } from './promotion.entity';

export const CampaignPromotionCategory = defineEntity({
  name: 'CampaignPromotionCategory',
  tableName: 'promotion_category',
  properties: {
    id: p.integer().primary(),
    slug: p.string().unique(),
    label: p.string(),
    sortOrder: p.integer().default(0),
    promotions: () => p.manyToMany(CampaignPromotion).mappedBy('categories'),
  },
});

export type CampaignPromotionCategory = InferEntity<typeof CampaignPromotionCategory>;
