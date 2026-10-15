// ============================================================================
// useRedemptionTracking.ts — Composable: fire-and-forget claim analytics
// ============================================================================
// POSTs to /api/redemptions/track when the guest taps a WhatsApp CTA.
// Never blocks navigation and never throws: the endpoint itself always
// resolves `{ success }`, and we swallow transport errors here too.
//
// 📚 Usage inside a click handler (runs BEFORE window.open):
//   const { track } = useRedemptionTracking()
//   track({ placementId, promotionId, utm_source, utm_medium, lang })
// ============================================================================

export interface RedemptionPayload {
  placementId: string
  promotionId?: number | null
  utm_source?: string | null
  utm_medium?: string | null
  lang?: string | null
}

export function useRedemptionTracking() {
  function track(payload: RedemptionPayload): void {
    $fetch('/api/redemptions/track', {
      method: 'POST',
      body: {
        placementId: payload.placementId,
        promotionId: payload.promotionId ?? null,
        utm_source: payload.utm_source ?? payload.placementId,
        utm_medium: payload.utm_medium ?? 'qr',
        lang: payload.lang ?? 'en',
      },
    }).catch((error: unknown) => {
      console.warn('[Redemption] Track failed:', error)
    })
  }
  return { track }
}
