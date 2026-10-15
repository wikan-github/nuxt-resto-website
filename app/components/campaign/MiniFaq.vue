<!--
  ============================================================================
  MiniFaq.vue — exit-funnel FAQs (auto-import: CampaignMiniFaq)
  ============================================================================
  Native <details> accordions: zero JS, bilingual via
  monkey_forest_exit.faq.* (EN/ID symmetric).
-->
<template>
  <section class="section">
    <div class="container">
      <div class="faq-card">
        <h2 class="faq-title">{{ $t('monkey_forest_exit.faq.title') }}</h2>
        <details
          v-for="n in 5"
          :key="n"
          class="faq-item"
          :open="n === 1"
        >
          <summary>{{ $t(`monkey_forest_exit.faq.q${n}`) }}</summary>
          <p>{{ $t(`monkey_forest_exit.faq.a${n}`) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-card {
  max-width: 720px;
  margin: 0 auto;
}
.faq-title {
  text-align: center;
  margin-bottom: 1rem;
}
.faq-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0.75rem 0;
  font-family: var(--font-content);
}
.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-green);
  min-height: 44px;
}
.faq-item p {
  margin: 0.5rem 0 0;
  line-height: 1.55;
  color: var(--color-text-body);
}
</style>
