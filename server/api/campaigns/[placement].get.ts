import { getRouterParam, getQuery } from 'h3';
import { useEntityManager } from '~~/server/utils/orm';
import { CampaignPromotion } from '~~/server/database/entities/promotion.entity';
import { CampaignPromotionTranslation } from '~~/server/database/entities/promotion-translation.entity';
import { CampaignPromotionCode } from '~~/server/database/entities/promotion-code.entity';

/**
 * GET /api/campaigns/:placement — resolve a QR placement to its offer.
 *
 * The placement is either a QR channel (promotion_code.channel, e.g. "qr_exit",
 * "guest_exit") or a promotion slug (e.g. "sanctuary-combo"). Channel takes
 * precedence. Only active promotions matching the requested audience resolve;
 * otherwise `{ offer: null }` with HTTP 200.
 *
 * Aliases: "guest_exit" resolves to the "qr_exit" channel (same Sanctuary-exit
 * funnel, friendlier URL param for /monkey-forest-exit links).
 *
 * Read-only: no counters are mutated here. In particular
 * promotion_code.used_count is left untouched (incremented on redemption only).
 * There is no scan_count column; adding scan analytics needs a migration.
 */
export default defineEventHandler(async (event) => {
  const em = useEntityManager(event);
  const rawPlacement = getRouterParam(event, 'placement') ?? getRouterParam(event, 'slug') ?? '';
  // "guest_exit" is the public alias used by /monkey-forest-exit links.
  const placement = rawPlacement === 'guest_exit' ? 'qr_exit' : rawPlacement;
  const audience = ((getQuery(event).audience as string) || 'monkey_forest_guest').trim() || 'monkey_forest_guest';

  async function shapeOffer(
    // In type position, CampaignPromotion resolves to the inferred entity type
    // (the file exports both the schema value and the InferEntity type).
    promotion: CampaignPromotion,
    code: string | null,
  ) {
    const translations = await em.find(CampaignPromotionTranslation, { promotion });
    const byLocale: Record<string, { title: string; subtitle: string; description: string; terms: string }> = {};
    for (const t of translations) {
      byLocale[t.locale] = {
        title: t.title,
        subtitle: t.subtitle,
        description: t.description,
        terms: t.terms,
      };
    }
    return {
      offer: {
        id: promotion.id,
        slug: promotion.slug,
        kind: promotion.kind,
        discountLabel: promotion.discountLabel,
        audience: promotion.audience,
        requiresTicket: promotion.requiresTicket,
        minSpend: promotion.minSpend,
        maxRedemptions: promotion.maxRedemptions,
        perCustomerLimit: promotion.perCustomerLimit,
        validFrom: promotion.validFrom,
        validUntil: promotion.validUntil,
        daysOfWeek: promotion.daysOfWeek,
        timeStart: promotion.timeStart,
        timeEnd: promotion.timeEnd,
        originalPriceTakeaway: promotion.originalPriceTakeaway,
        originalPriceDinein: promotion.originalPriceDinein,
        promoPriceTakeaway: promotion.promoPriceTakeaway,
        promoPriceDinein: promotion.promoPriceDinein,
        heroImage: promotion.heroImage,
        thumbnail: promotion.thumbnail,
        isActive: promotion.isActive,
        isFeatured: promotion.isFeatured,
        priority: promotion.priority,
        createdAt: promotion.createdAt,
        updatedAt: promotion.updatedAt,
        translations: {
          en: byLocale.en ?? null,
          id: byLocale.id ?? null,
        },
      },
      code,
    };
  }

  // 1. Channel → code → promotion.
  const promoCode = await em.findOne(
    CampaignPromotionCode,
    { channel: placement, isActive: true },
    { populate: ['promotion'] },
  );
  if (promoCode?.promotion) {
    const p = promoCode.promotion;
    if (p.isActive && p.audience === audience) {
      return shapeOffer(p, promoCode.code);
    }
    return { offer: null };
  }

  // 2. Direct promotion slug.
  const direct = await em.findOne(CampaignPromotion, {
    slug: placement,
    isActive: true,
    audience,
  });
  if (!direct) {
    return { offer: null };
  }
  return shapeOffer(direct, null);
});
