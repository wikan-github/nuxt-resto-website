<template>
  <section class="hero">
    <!-- Why AppImage instead of raw <img>?
        /images/hero-rice-field.webp does not exist yet in /public.
        AppImage will swap to placeholder.svg automatically until
        the photo is shot and dropped in. Zero broken-image icons. 
    -->
    <AppImage
      src="/images/monkey-forest-exit.png"
      alt="Monkey Forest Exit To Tropical View Ubud"
      class="hero__bg" 
   
    />
   <!--  
   <div class="hero__content">
      <p class="hero__eyebrow">{{ campaignData.eyebrow }}</p>

      <h1 class="hero__title">{{ campaignData.h1 }}</h1>

      <p class="hero__sub">{{ campaignData.sub }}</p>
    </div> -->

  </section>
</template>

<script
  lang="ts"
  setup
>
  import AppImage from '../base/WKPicture.vue/index.js';

  const campaignData = {
    "eyebrow": "Ubud Monkey Forest · 200m from the exit",
    "h1": "Just finished the Sanctuary? Cool down 2 minutes away.",
    "sub": "Shaded rice-field seating, cold drinks, and hot food — 200 meters from the Monkey Forest exit. Show your sanctuary ticket for 15% off mains + a free iced tea.",
  }


</script>

<style
  scoped
  lang="css"
>

/* ---------- HERO CONTAINER ---------- */
.hero {
  /* position: relative creates the containing block for the
     absolutely-positioned background image. Without this, the
     .hero__bg would escape and try to position against <body>. */
  position: relative;

  /* overflow: hidden clips anything that spills outside — in
     particular, the background image (which is 1920px wide on
     some devices) can't bleed past the hero's edges. */
  overflow: hidden;

  /* Padding: top / left-right / bottom.
     Mobile default — tighter. Desktop override below. */
  padding: 40px 24px 36px;

  /* Fallback background while the image loads (or if it fails).
     Dark forest green matches the photo's dominant tone, so the
     transition from placeholder → photo is seamless. */
  background: var(--color-forest);

  /* Text color — cream against dark background for high contrast. */
  color: var(--color-cream);
}

/* ---------- BACKGROUND IMAGE LAYER ---------- */
.hero__bg {
  /* Remove from normal flow and pin to all four edges of .hero. */
  position: absolute;

  /* inset: 0 is shorthand for top:0; right:0; bottom:0; left:0.
     Cleaner than writing all four. */
  inset: 0;

  /* Fill the container fully — with object-fit: cover (defined in
     AppImage's scoped styles), the image scales to cover the hero
     without distortion. */
  width: 100%;
  height: 100%;

  /* Dim the image to 40% opacity so text on top stays readable.
     Without this, a bright rice-field photo would make white
     text invisible in patches. Classic "dark overlay" trick,
     done with opacity instead of a colored gradient because
     it's simpler and doesn't clash with the photo's color. */
  /* opacity: 0.4; */
}
.hero__content {
  /* Bring above the absolute background. Because .hero has
     position:relative and .hero__bg is absolute, any relative-
     positioned sibling (this) naturally stacks above it. */
  position: relative;

  /* Cap width for readability. 640px is roughly 65–75 characters
     per line at this font size — the sweet spot for scan-ability. */
  max-width: 640px;

  /* Center the block horizontally inside .hero. */
  margin: 0 auto;
}
</style>