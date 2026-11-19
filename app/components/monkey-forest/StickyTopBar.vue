<script
  setup
  lang="ts"
>
  import { onMounted } from "vue";
  onMounted(() => { });
  const visible = ref(true);


  const props = defineProps<{
    stickyBarText: string,
    whatsappUrl: string,
    waStickyBarText: string
  }>();

  // Prevents accidental DOM event listeners from being attached (Vue knows it's a custom event)
  // [] means the event carries no payload (no extra data).
  // If it had a payload, you'd write { 'claim-click': [payload: string] }.
  const emits = defineEmits<{
    'claim-click': []
  }>();


</script>

<template>
  <div
    v-show="visible"
    class="sticky-bar"
    role="banner"
  >
    <span class="sticky-bar__msg">
      <div id="signal">O</div>
      <span class="sticky-bar__text">{{stickyBarText}}</span>
    </span>
    <a
      :href="whatsappUrl"
      class="sticky-bar__cta"
      @click=""
    >{{ waStickyBarText }}</a>
  </div>

  <!-- saya akan gunakan grid layout untuk stickybar ini -->
</template>

<style
  lang="css"
  scoped
>
.sticky-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-forest);
  color: var(--color-cream);
  /* font-size: 12px; */
  /* font-weight: 600; */
}

.sticky-bar__msg {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.sticky-bar__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sticky-bar__cta {
  flex-shrink: 0;
  background: var(--color-amber);
  color: var(--color-white);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
/* if the screen is <= 767px, dont show sticky bar */
/* @media (max-width: 767px) {
  .sticky-bar {
    display: flex;
  }
} */
/* //if screen is >= 768px  */
/* @media(min-width:768px) {
  .sticky-bar {
    display:none;
  }
} */

</style>
