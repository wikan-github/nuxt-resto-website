import type { EntityManager } from '@mikro-orm/sqlite';
import { CampaignPromotion } from '~~/server/database/entities/promotion.entity';
import { CampaignPromotionCode } from '~~/server/database/entities/promotion-code.entity';

/** Public placement aliases → QR channel stored in `promotion_code.channel`. */
const PLACEMENT_ALIASES: Record<string, string> = {
  guest_exit: 'qr_exit',
};

export async function resolveCampaignPromotion(
  em: EntityManager,
  rawPlacement: string,
): Promise<{ promotion: CampaignPromotion; code: string | null } | null> {
  const placement = PLACEMENT_ALIASES[rawPlacement] ?? rawPlacement;

  const promoCode = await em.findOne(
    CampaignPromotionCode,
    { channel: placement, isActive: true },
    { populate: ['promotion'] },
  );
  if (promoCode?.promotion && promoCode.promotion.isActive) {
    return { promotion: promoCode.promotion, code: promoCode.code };
  }

  const direct = await em.findOne(CampaignPromotion, {
    slug: placement,
    isActive: true,
  });
  if (!direct) return null;
  return { promotion: direct, code: null };
}
