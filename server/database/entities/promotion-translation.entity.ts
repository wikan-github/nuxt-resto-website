import { defineEntity, p, type InferEntity } from '@mikro-orm/core';
import { CampaignPromotion } from './promotion.entity';

export const CampaignPromotionTranslation = defineEntity({
  name: 'CampaignPromotionTranslation',
  tableName: 'promotion_translation',
  uniques: [{ properties: ['promotion', 'locale'] }],
  properties: {
    id: p.integer().primary(),
    promotion: p.manyToOne(CampaignPromotion),
    locale: p.string(),
    title: p.string(),
    subtitle: p.string(),
    description: p.string(),
    terms: p.string(),
  },
});

export type CampaignPromotionTranslation = InferEntity<typeof CampaignPromotionTranslation>;
