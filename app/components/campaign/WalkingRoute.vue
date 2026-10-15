<!--
  ============================================================================
  WalkingRoute.vue — sanctuary-exit → restaurant route card (CampaignWalkingRoute)
  ============================================================================
  Deliberately NO map embed: the strategy doc bans external scripts for the
  <2.5s 4G budget, and an embed needs a vendor token we don't have. Instead:
  live haversine walking estimate from the exit coords to the DB restaurant
  coords + a "Open in Google Maps" link. Zero external requests until tapped.
-->
<template>
  <section class="section">
    <div class="container">
      <div class="route-card">
        <p class="route-eyebrow">📍 {{ $t('monkey_forest_exit.route.title') }}</p>
        <p class="route-line">
          <strong>{{ exitLabel }}</strong>
          <span aria-hidden="true" class="route-arrow">→</span>
          <strong>{{ restaurant?.brandingName ?? 'Tropical View Ubud' }}</strong>
        </p>
        <p class="route-time">
          🚶 {{ $t('monkey_forest_exit.route.walking_time', { minutes: walkingMinutes }) }}
        </p>
        <a
          :href="mapsLink"
          class="btn btn-green"
          target="_blank"
          rel="noopener"
        >
          {{ $t('monkey_forest_exit.route.open_in_maps') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  exitLat: number
  exitLng: number
  exitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  exitLabel: 'Monkey Forest Sanctuary exit',
})

const { restaurant, mapsLink } = useRestaurant()

function haversineMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const earth = 6371000
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * earth * Math.asin(Math.sqrt(s))
}

// ~80 m/min relaxed walking pace, minimum 1 minute.
const walkingMinutes = computed(() => {
  if (!restaurant.value) return 3
  const meters = haversineMeters(
    props.exitLat,
    props.exitLng,
    restaurant.value.mapLatitude,
    restaurant.value.mapLongitude,
  )
  return Math.max(1, Math.round(meters / 80))
})
</script>

<style scoped>
.route-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  text-align: center;
}
.route-eyebrow {
  font-family: var(--font-content);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-green);
  margin: 0 0 0.5rem;
}
.route-line {
  font-family: var(--font-content);
  margin: 0 0 0.5rem;
}
.route-arrow {
  margin: 0 0.5rem;
  color: var(--color-green-accent, var(--color-green));
}
.route-time {
  font-family: var(--font-content);
  font-weight: 600;
  margin: 0 0 1rem;
}
</style>
