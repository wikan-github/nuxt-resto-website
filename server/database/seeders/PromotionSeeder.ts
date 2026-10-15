import { Seeder } from '@mikro-orm/seeder';
import type { EntityManager } from '@mikro-orm/sqlite';
import { CampaignPromotion } from '../entities/promotion.entity';
import { CampaignPromotionTranslation } from '../entities/promotion-translation.entity';
import { CampaignPromotionCategory } from '../entities/promotion-category.entity';
import { CampaignPromotionCode } from '../entities/promotion-code.entity';

/**
 * Seeds the Sanctuary Cool-Down Combo campaign promotion.
 * Idempotent: every row is upserted on its natural key
 * (slug / (promotion, locale) / slug / code), so re-running is safe.
 * NOTE: `usedCount` is intentionally omitted from the code upsert so a
 * re-run never resets the live redemption counter (DB default 0 applies
 * on insert; existing rows keep their count on merge).
 */
export class PromotionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const category = await em.upsert(CampaignPromotionCategory, {
      slug: 'sanctuary',
      label: 'Sanctuary Offers',
      sortOrder: 0,
    });

    const promotion = await em.upsert(CampaignPromotion, {
      slug: 'sanctuary-combo',
      kind: 'bundle',
      discountLabel: '15% OFF',
      audience: 'monkey_forest_guest',
      requiresTicket: true,
      minSpend: null,
      maxRedemptions: null,
      perCustomerLimit: 1,
      validFrom: null,
      validUntil: null,
      daysOfWeek: '1,2,3,4,5,6,7',
      timeStart: '11:00',
      timeEnd: '15:00',
      originalPriceTakeaway: null,
      originalPriceDinein: null,
      promoPriceTakeaway: null,
      promoPriceDinein: null,
      heroImage: '/images/hero-rice-field.webp',
      thumbnail: '/images/offer-sanctuary-combo.webp',
      isActive: true,
      isFeatured: true,
      priority: 1,
    });

    // Link category (insert pivot row only when the link is missing).
    await em.populate(promotion, ['categories']);
    if (!promotion.categories.contains(category)) {
      promotion.categories.add(category);
    }

    await em.upsert(CampaignPromotionTranslation, {
      promotion,
      locale: 'en',
      title: 'Sanctuary Cool-Down Combo',
      subtitle: '1 main of your choice + 1 free iced tea',
      description:
        'Shaded rice-field seating 200m from the Monkey Forest exit. Show your ticket for 15% off mains + a free iced tea.',
      terms:
        'One combo per person. Dine-in only. Cannot be combined with other promotions. Ticket or stamp must be shown at the table.',
    });

    await em.upsert(CampaignPromotionTranslation, {
      promotion,
      locale: 'id',
      title: 'Paket Sanctuary Cool-Down',
      subtitle: '1 menu utama pilihan Anda + 1 es teh gratis',
      description:
        'Tempat duduk beratap dengan pemandangan sawah, 200m dari pintu keluar Monkey Forest. Tunjukkan tiket untuk diskon 15% menu utama + es teh gratis.',
      terms:
        'Satu paket per orang. Hanya untuk makan di tempat. Tidak dapat digabung dengan promo lain. Tiket atau stempel wajib ditunjukkan di meja.',
    });

    const codes = [
      { channel: 'qr_exit', code: 'MF-EXIT-01' },
      { channel: 'qr_ticket', code: 'MF-TICKET-01' },
      { channel: 'qr_guesthouse', code: 'MF-GUEST-01' },
      { channel: 'qr_driver', code: 'MF-DRIVER-01' },
      // Strategy-doc placement ID (guest-exit-strategy.md QR codes).
      { channel: 'qr_sf_01', code: 'PROMO_QR_SF_01' },
    ];
    for (const { channel, code } of codes) {
      await em.upsert(CampaignPromotionCode, {
        promotion,
        channel,
        code,
        maxUses: null,
        isActive: true,
      });
    }

    await em.flush();
  }
}
