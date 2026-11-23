<script
  setup
  lang="ts"
>
  import { onMounted } from "vue";
import BlinkingDot from "../base/BlinkingDot.vue";
  onMounted(() => { });
  const visible = ref(true);


  const props = defineProps<{
    /** Main text displayed on sticky bar */
    stickyBarText: string,
    /** Text displayed on the sticky bar's call-to-action button. */
    ctaText: string 
  }>();

  const displayedStickyBarText = computed(
    ()=> props.stickyBarText?.trim() || 'Show Your Ticket, Get Free Drink !!'
  );
  const displayedCTAText = computed(
    ()=> props.ctaText?.trim() || 'Claim'  
  );

  // Prevents accidental DOM event listeners from being attached (Vue knows it's a custom event)
  // [] means the event carries no payload (no extra data).
  // If it had a payload, you'd write { 'claim-click': [payload: string] }.
  const emits = defineEmits<{
    'claim-click': []
  }>();


</script>

<template>
  <!-- <div
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
  </div> -->

  <!-- saya akan gunakan grid layout untuk stickybar ini -->
   <div class="stickybar_container">
    <div class="sticky_blinking">
      <BlinkingDot />
    </div>
    <div class="sticky_message">{{ displayedStickyBarText }}</div>
    <div class="sticky_cta">
      <div class="cta_button">
        <span>{{ displayedCTAText }}</span>
      </div>
    </div>
   </div>
</template>

<style
  lang="css"
  scoped
>

.stickybar_container {
  min-height: 35px;
  display: grid;
  /* grid-template-columns:minmax(50px, max-content) minmax(0,1fr) minmax(150px,max-content); */
  grid-template-columns:35px 1fr 100px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-forest);
  font-size: 0.9rem;
  color: white;
}

.sticky_blinking {
  /* border: solid 1px red; */
  display: grid;
  place-items: center;
}
.sticky_message {
  /* border: solid 1px yellow; */
  display: grid;
  align-items: center;
  text-align: justify;

  /* Stretch the grid item to fill the available horizontal space. */
  justify-items: stretch;
  /* place-items: center; */
  /* line-height: 1.2; */
}

.sticky_cta {
  /* border: solid 1px violet; */
  display: grid;
  grid-template-columns: 1fr;
  padding: 5px;
  /* column-gap: 12px; */
  /* place-items: stretch; */
}

.cta_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--color-amber);
  color: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 13px;
  line-height: 1;
  /* font-weight: 800; */
  /* text-transform: uppercase; */
}


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
