<!--
  ============================================================================
  SocialProof.vue — live claim stats for the exit funnel (CampaignSocialProof)
  ============================================================================
  Trust line renders the LIVE weekly check-in count from
  GET /api/campaigns/:placement/stats. The star-rating row is opt-in via
  props (no reviews source in the DB yet — hidden until one exists).
-->
<template>
  <section class="section">
    <div class="container">
      <div class="proof-card">
        <p class="proof-trust">
          <span aria-hidden="true">🐒</span>
          {{ $t('monkey_forest_exit.social_proof.trust_line', { count: weeklyGuests }) }}
        </p>
        <div v-if="rating != null && reviewCount != null" class="proof-stats">
          <div class="proof-stat">
            <strong>{{ rating }}</strong>
            <small>★ {{ $t('monkey_forest_exit.social_proof.rating_label') }}</small>
          </div>
          <div class="proof-stat">
            <strong>{{ reviewCount }}</strong>
            <small>{{ $t('monkey_forest_exit.social_proof.reviews_label') }}</small>
          </div>
          <div class="proof-stat">
            <strong>{{ weeklyGuests }}</strong>
            <small>{{ $t('monkey_forest_exit.social_proof.guests_label') }}</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  placement: string
  rating?: number | null
  reviewCount?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  rating: null,
  reviewCount: null,
})

// Stats are SSR-fetched so the trust line paints with content, not a spinner.
const { data } = await useFetch(`/api/campaigns/${props.placement}/stats`, {
  key: `campaign-stats-${props.placement}`,
})

const weeklyGuests = computed(() => data.value?.weeklyGuestCount ?? 0)
</script>

<style scoped>
.proof-card {
  background: var(--color-cream, #faf6ef);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  text-align: center;
}
.proof-trust {
  font-family: var(--font-content);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-green);
  margin: 0;
}
.proof-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}
.proof-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.proof-stat strong {
  font-size: 1.25rem;
  color: var(--color-text-heading, inherit);
}
.proof-stat small {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
