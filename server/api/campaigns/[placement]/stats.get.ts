import { getRouterParam } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { resolveCampaignPromotion } from '~~/server/utils/campaign';
import { PromotionRedemption } from '~~/server/database/entities/promotion-redemption.entity';

/**
 * GET /api/campaigns/:placement/stats — funnel numbers for SocialProof.
 * checkedInAt / orderedAt / orderValue are filled by the (not yet built)
 * staff check-in flow, so counts start at zero and grow once it lands.
 */
export default defineEventHandler(async (event) => {
  const placement = getRouterParam(event, 'placement') ?? '';
  const em = useEntityManager(event);

  const resolved = await resolveCampaignPromotion(em, placement);
  if (!resolved) {
    throw createError({ statusCode: 404, message: `Campaign not found: ${placement}` });
  }
  const { promotion } = resolved;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const weeklyClaims = await em.count(PromotionRedemption, {
    promotion,
    createdAt: { $gte: weekAgo },
  });
  const weeklyGuests = await em.count(PromotionRedemption, {
    promotion,
    checkedInAt: { $gte: weekAgo },
  });
  const totalRedemptions = await em.count(PromotionRedemption, { promotion });

  const valuedOrders = await em.find(PromotionRedemption, {
    promotion,
    orderValue: { $gt: 0 },
  });
  const averageOrderValue = valuedOrders.length > 0
    ? Math.round(
      valuedOrders.reduce((sum, r) => sum + (r.orderValue ?? 0), 0) / valuedOrders.length,
    )
    : 0;

  return {
    placementId: placement,
    weeklyGuestCount: weeklyGuests,
    averageOrderValue,
    totalRedemptions,
    conversionRate: weeklyClaims > 0
      ? ((weeklyGuests / weeklyClaims) * 100).toFixed(1)
      : '0',
  };
});
