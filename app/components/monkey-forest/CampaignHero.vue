<script
  lang="ts"
  setup
>
  import SamplePragraph from '../base/SamplePragraph.vue';
  import WKPicture from '../base/WKPicture.vue';
  import type { ImageSource } from '../base/WKPicture.vue';
import InvitationCard from './InvitationCard.vue';



  const campaignData = {
    "eyebrow": "Ubud Monkey Forest · 200m from the exit",
    "h1": "Just finish Monkey Forest? Cool down 1 minute away.",
    "sub": "Shaded rice-field seating, cold drinks, and hot food — 100 meters from Monkey Forest exit"
  }
  // const fallback_img = '/images/monkey-forest-reward-768x.webp';
  // const fallback_img = '/images/xxx.webp';
  // const fallback_img = '/images/monkey-forest-exit-1536.webp';


  const rewardImages: ImageSource[] = [
    {
      srcset: '/images/monkey-forest-reward-768x.webp',
      media: '(max-width:768px)',
      type: 'image/webp',
    },
    {
      srcset: '/images/monkey-forest-reward-1200x.webp',
      media: '(max-width:1200px)',
      type: 'image/webp',
    },
    {
      srcset: '/images/monkey-forest-reward-1536x.webp',
      media: '(min-width:1201px)',
      type: 'image/webp',
    }
  ];

  // const rewardImages : ImageSource[] =[];
  /*  const heroImages: ImageSource[] = [
      {
        srcset: '/images/monkey-forest-exit-768.webp',
        media: '(max-width:768px)',
        type: 'image/webp'
      },
      {
        srcset: '/images/monkey-forest-exit-1200.webp',
        media: '(max-width:1200px)',
        type: 'image/webp'
      },
      {
        srcset: '/images/monkey-forest-exit-1200+.webp',
        media: '(min-width:1201px)',
        type: 'image/webp'
      }
    ]; */
  const imgReward: string = '/images/monkey-forest-reward.webp';
  const alt = 'Reward after visiting Monkey Forest in Tropical View Ubud';

</script>

<template>
  <section class="hero">
    <div class="hero__media">
      <WKPicture
        id="reward_img"
        :src="imgReward"
        :alt
        loading="eager"
      />
      <div
        id="overlay_shape"
        class="hero__overlay"
        aria-hidden="true"
      ></div>
    </div>

    <InvitationCard />



  </section>
</template>

<style
  scoped
  lang="css"
>
/* ---------- HERO CONTAINER ---------- */

.hero {
  display: flex;
  padding: 0;
  /* gap: 1rem; */
  align-items: stretch;
  flex-direction: column;
}

.hero__media {
  position: relative;
  /* containing block for overlay */
  width: 100%;
  overflow: hidden;
  /* optional: clip to bounds  */

  /* avoids inline-gap artifacts around images */
  line-height: 0;
  /* border: solid 3px red; */
}

/* #reward_img is the <picture> root (attr fallthrough) */
.hero__media :deep(#reward_img),
.hero__media :deep(picture),
.hero__media :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  /* or height: 100%; object-fit: cover if you set a fixed height */
}

/* #overlay_shape {
  border: solid 2px darkorchid;
} */

.hero__overlay {
  position: absolute;
  inset: 0;
  /* instead of setting margin*/
  pointer-events: none;
  z-index: 1;
  /* bottom (0%) -> top (100%), dark forest green fading upward */
background: linear-gradient(
  to bottom,
  rgba(3, 72, 51, 0) 0%,
  rgba(3, 72, 51, 0.10) 25%,
  rgba(3, 72, 51, 0.30) 80%,
  rgba(2, 48, 34, 0.85) 90%,
  rgba(1, 21, 15, 1) 100%
);

  /* background: linear-gradient(
    to top,
    rgba(12, 45, 28, 0.9) 0%,
    rgba(0, 8, 4, 0.6) 30%,
    transparent 100%
  ); */
}
</style>