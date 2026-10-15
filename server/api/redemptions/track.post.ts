import { getHeader, readBody } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { resolveCampaignPromotion } from '~~/server/utils/campaign';
import { CampaignPromotion } from '~~/server/database/entities/promotion.entity';
import { PromotionRedemption } from '~~/server/database/entities/promotion-redemption.entity';

interface TrackPayload {
  placementId?: string
  promotionId?: number | string
  utm_source?: string
  utm_medium?: string
  lang?: string
}

/**
 * POST /api/redemptions/track — log a WhatsApp-claim tap (analytics only).
 * Fire-and-forget by contract: always resolves `{ success }`, never throws,
 * so a tracking failure can never block the user's WhatsApp redirect.
 */
export default defineEventHandler(async (event) => {
  let body: TrackPayload;
  try {
    body = await readBody<TrackPayload>(event);
  }
  catch {
    return { success: false, reason: 'Invalid request body' };
  }

  try {
    const em = useEntityManager(event);

    let promotion: CampaignPromotion | null = null;
    const placementId = (body.placementId ?? '').trim() || 'guest_exit';

    if (body.promotionId != null && body.promotionId !== '') {
      promotion = await em.findOne(CampaignPromotion, {
        id: Number(body.promotionId),
        isActive: true,
      });
    }
    if (!promotion) {
      const resolved = await resolveCampaignPromotion(em, placementId);
      promotion = resolved?.promotion ?? null;
    }
    if (!promotion) {
      return { success: false, reason: 'Unknown placement' };
    }

    const redemption = em.create(PromotionRedemption, {
      promotion,
      placement: placementId,
      utmSource: (body.utm_source ?? placementId).trim() || placementId,
      utmMedium: (body.utm_medium ?? 'qr').trim() || 'qr',
      userAgent: getHeader(event, 'user-agent') ?? null,
      language: (body.lang ?? 'en').trim() || 'en',
      whatsappClaimAt: new Date(),
      checkedInAt: null,
      orderedAt: null,
      orderValue: null,
      notes: null,
    });
    await em.flush();

    return { success: true, redemptionId: redemption.id };
  }
  catch (error) {
    console.error('[Redemption Track] Error:', error);
    return { success: false, reason: 'Failed to log redemption' };
  }
});
