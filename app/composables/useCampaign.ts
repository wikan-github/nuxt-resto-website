// ============================================================================
// useCampaign.ts — Composable: resolve a QR placement to its campaign offer
// ============================================================================
// Thin wrapper around GET /api/campaigns/:placement (see
// server/api/campaigns/[placement].get.ts). The placement is a QR channel
// (e.g. "guest_exit", "qr_sf_01") or a promotion slug ("sanctuary-combo").
// SSR-awaited by callers so first paint already includes the offer card.
//
// 📚 Files in app/composables/ are auto-imported — no import needed.
// ============================================================================

export interface CampaignOfferSummary {
  id: number
  slug: string
  promoPriceTakeaway: number | null
  promoPriceDinein: number | null
  [key: string]: unknown
}

export interface CampaignResolution {
  offer: CampaignOfferSummary | null
  code: string | null
}

export async function useCampaign(placementId: string, audience = 'monkey_forest_guest') {
  const { data, error, status } = await useFetch<CampaignResolution>(
    `/api/campaigns/${placementId}`,
    {
      query: { audience },
      key: `campaign-${placementId}-${audience}`,
    },
  )
  return { campaign: data, error, status }
}
