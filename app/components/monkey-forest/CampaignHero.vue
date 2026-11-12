<script
  lang="ts"
  setup
>
  import SamplePragraph from '../base/SamplePragraph.vue';
import WKPicture from '../base/WKPicture.vue';
  import type { ImageSource } from '../base/WKPicture.vue';



  const campaignData = {
    "eyebrow": "Ubud Monkey Forest · 200m from the exit",
    "h1": "Just finish Monkey Forest? Cool down 1 minute away.",
    "sub": "Shaded rice-field seating, cold drinks, and hot food — 100 meters from Monkey Forest exit"
  }
  const fallback_img = '/images/monkey-forest-reward-768x.webp';
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
    const imgReward: string ='/images/monkey-forest-reward-1536.webp';
    const alt = 'Reward after visiting Monkey Forest in Tropical View Ubud';

</script>

<template>
  <section class="hero">
    
    <WKPicture :src="imgReward" :alt loading="eager" />
    <div id="overlay"></div>

    <SamplePragraph />
    <SamplePragraph />
    <SamplePragraph />
    <SamplePragraph />
    <SamplePragraph />
    
  </section>
</template>

<style scoped lang="css">

/* ---------- HERO CONTAINER ---------- */
.hero {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  flex-direction: column;
}


</style>