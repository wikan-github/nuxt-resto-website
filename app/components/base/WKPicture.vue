<script
     setup
     lang="ts"
>
     import { drawPlaceholderToCanvas } from '../../utils/drawPlaceholderToCanvas';

     // ============================================================
     // WKPicture.vue — the image primitive
     //
     // WHY: A plain <img> shows a broken-image icon when the source is missing or 404s. 
     // This component guarantees a clean fallback in every failure
     // mode while preserving dev-time visibility into missing assets.
     // ============================================================

     // ─── Types ────────────────────────────────────────────────────────────────
     // Shape of one <source> entry. Mirrors the native HTML attributes 1:1
     // so anyone who knows <picture> can use this without learning a new DSL.
     export type ImageSource = {
          srcset: string; // required — comma-separated candidate list
          media?: string; // e.g. "(min-width: 768px)"
          type?: string; // e.g. "image/avif", "image/webp"
          sizes?: string; // slot size hint, usually set on <img> but allowed here
     };

     // ─── Props mimicking HTML Picture and Image attributes────────────────────
     //ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
     const props = withDefaults(
          defineProps<{
               src?: string | null; // fallback image — REQUIRED by <img>
               alt: string; // a11y text
               fallback?: string; // shown when src is missing or errors
               sources?: ImageSource[]; // optional responsive/format variants
               sizes?: string; // passed to <img> for srcset math
               loading?: "lazy" | "eager"; //passed to <img> for loading behavior
               decoding?: "sync" | "async" | "auto"; //passed to <img> for decoding behavior
          }>(),
          {
               fallback: "/images/placeholder.svg", // default fallback image (in case src is missing or fails)
               sources: () => [], 	// factory function so every instance gets its own array (no shared ref),
               loading: "lazy", //default to lazy loading performance optimization\
               decoding: "async",
          },
     );



     // const failedSrcUrl = ref<string | null | undefined>(null);
     //save failed <img src> url, may be for logging 
     // or just for telling parent component in future, so parent can make decision then
     //later we can emit event for this
     const failedImgSrc = ref('');
     const runtimePlaceholderSrc = ref('');
     const primarySrcFailed = ref(false);

     //boolean flag for failed loading <picture> -> <source> -> <srcset> 
     const pictureSourceFailed = ref(false);

     // Derived: is the CURRENT src the one that errored?
     // Automatically false when src changes — no watcher, no reset effect.
     // const failed = computed(() => !!props.src && failedSrc.value === props.src); //lazy

     // const isCurrentSrcFailed = computed(() => Boolean(normalizedImgUrl) && failedSrcUrl.value === props.src); //lazy

     // Bumped to force the <img> to re-fetch after a failed <source>.
     const retryKey = ref(0);

     // ─── Watchers ─────────────────────────────────────────────────────────────
     //observes the component’s src and sources props   
     //so if parent change props.src or props.sources, 
     // it will trigger image rerendering
     watch(
          () => [props.src, props.sources] as const,
          () => {
               failedImgSrc.value = ''; //reset
               runtimePlaceholderSrc.value = ''; //reset
               primarySrcFailed.value = false; //reset
               pictureSourceFailed.value = false; //reset
               retryKey.value = 0; //reset
          },
          { deep: false, immediate: false }
     );

     // const shouldRenderPictureSources will always true if selected <picture source srcset> not failed to load and props.sources.length > 0, otherwise false.
     const shouldRenderPictureSources = computed(
          (): boolean =>
               // Boolean(normalizedImgSrc.value) &&
               // !isCurrentSrcFailed.value &&
               // pictureSourcesEnabled.value &&
               props.sources.length > 0 && !pictureSourceFailed.value
     );

     //reports the image url currently loaded, for dev-time logging.
     function handleLoad(event: Event) {
          if (import.meta.dev) {
               const img = event.target as HTMLImageElement;
               console.log(`[WKPicture] image loaded: ${img.currentSrc}`);
          }
     }

     //handleError — source, primary, fallback, then runtime placeholder
     // ─── Error handler ────────────────────────────────────────────────────────
     // Disable failed <source> candidates, then try the primary src and fallback.
     async function handleError(event: Event) {
          const el = event.target as HTMLImageElement;
          //(property) HTMLImageElement.currentSrc: string

          // The currentSrc read-only property of the HTMLImageElement interface indicates the URL of the image selected by the browser to load.
          //HTMLImageElement.currentSrc is the browser-selected final URL after evaluating the <picture>/<source> candidates and the <img src> fallback.

          const imgUrl = el.currentSrc || '';

          if (runtimePlaceholderSrc.value && imgUrl === runtimePlaceholderSrc.value) {
               if (import.meta.dev) {
                    console.error('[WKPicture] Runtime placeholder image failed to load.');
               }
               return;
          }

          // Stage A — make sure it was a selected <picture> -> <source> -> <srcset> that failed, not the <img> -> src property itself.
          if (
               props.sources.length > 0 && !pictureSourceFailed.value &&
               imgUrl !== el.src
               //failedImageUrl !== normalizedImgSrc.value cek belakangan, bisa jadi <img src> memiliki url yang sama dengan salah satu <source set> yang gagal,
          ) {
               // pictureSourcesEnabled.value = false;


               // force vue to recreate the <img> element with the same src, which will now be used as the fallback.
               //but if new <img> el is created, it will do <source> selection again, 
               //so we need to remove the <source> el from DOM, so that the browser will not select <source> again, and it will use <img src> as fallback.
               //the v-if="shouldRenderPictureSources" will remove the <source> el from DOM, so that the browser will not select <source> again, 
               // and it will use <img src> as fallback. 
               //the shouldRenderPictureSurces will be recomputed to false 
               // when the ractive property pictureSourceFailed.value changed to true 
               //flag untuk menandai bahwa selected <source srcset> gagal 
               pictureSourceFailed.value = true;
               retryKey.value++;
               if (import.meta.dev) {
                    console.error (`Selected WKPicture source image failed to load : ${imgUrl}`,
                     `\nRetrying with <img src> fallback: ${resolvedImgSrc.value}`    
                    );
               }
               
               return; //stage 1 handled, exit function, do not continue to stage 2
          }

          const primarySrcAtFailure = normalizedImgSrc.value; //trimmed props.src or empty string if missing
          const fallbackSrc = props.fallback;

          // Normalize fallback URL for comparison with the absolute el.src.
          const fallbackUrl = new URL(fallbackSrc, el.ownerDocument.baseURI).href;

          if (primarySrcAtFailure && imgUrl === el.src && el.src !== fallbackUrl) {
               failedImgSrc.value = imgUrl;
               primarySrcFailed.value = true;
               retryKey.value++;
               return;
          }

          failedImgSrc.value = imgUrl;
          if (import.meta.dev) {
               console.error(`[WKPicture] image src failed: ${failedImgSrc.value}`); 
               console.warn('[WKPicture] Both image sources failed; rendering a runtime placeholder.');
          }

          try {
               const placeholderSrc = await drawPlaceholderToCanvas(el, { title: el.alt });
               // Do not apply a stale placeholder if the parent changed the image while rendering.
               if (
                    normalizedImgSrc.value === primarySrcAtFailure &&
                    props.fallback === fallbackSrc &&
                    failedImgSrc.value === imgUrl
               ) {
                    runtimePlaceholderSrc.value = placeholderSrc;
                    retryKey.value++;
               }
          } catch (error) {
               console.error('[WKPicture] Could not render the runtime placeholder.', error);
          }
     }

     // ─── Normalized src ───────────────────────────────────────────────────────
     // Trim whitespace and convert empty string to null. This is the "real" src  
     const normalizedImgSrc = computed(() => props.src?.trim() || '');

     // Use the fallback for an empty or failed primary src; use the generated image if both fail.
     const resolvedImgSrc = computed(() => {
          const src: string = normalizedImgSrc.value;
          if (runtimePlaceholderSrc.value) return runtimePlaceholderSrc.value;
          if (!src || primarySrcFailed.value) return props.fallback;
          return src;
     });

     
</script>
<template>
     <!-- <picture> is a selector, not a renderer: it must WRAP the <img>.
       If the <img> is a sibling, the whole element does nothing. -->
     <picture>
          <!-- Guarded block: sources are only considered when we have a valid src.
         Without this, the browser may resolve a <source> and bypass fallback. -->
          <template v-if="shouldRenderPictureSources">
               <source
                    v-for="(s, i) in sources"
                    :key="i"
                    :srcset="s.srcset"
                    :media="s.media"
                    :type="s.type"
                    :sizes="s.sizes"
               />
          </template>

          <!-- The <img> is mandatory and must be the last child of <picture>.
         It's what actually renders and carries alt/class/error handling. -->
          <!-- :key="retryKey" force re-render on retry  -->
          <!-- :key="retryKey" adalah petunjuk khusus untuk Vue, bukan atribut HTML biasa. 
            retryKey awalnya 0; saat kode menjalankan retryKey.value++, key berubah. 
            Vue lalu menganggap <img> lama berbeda dan menggantinya dengan elemen <img> baru. -->
          <!-- Ordering rule for sources: 
           if <source> element is present,
           browsers pick the first matching <source> top-to-bottom.
           Put the most modern format (avif) and the widest breakpoint first; 
            <img src> is the final fallback. 
            -->
          <img
               :key="retryKey"
               :src="resolvedImgSrc"
               :sizes="sizes"
               :alt="alt"
               :loading="loading"
               :decoding="decoding"
               class="app-image"
               @error="handleError"
               @load="handleLoad"
          />
     </picture>

</template>
<style scoped>
.app-image {
     /* Images are inline by default — they sit on the text baseline,
     creating a mysterious 4px gap below. `block` removes it. */
     display: block;

     /* Fill the container width. Combined with the parent's sizing,
     this makes AppImage behave predictably inside flex and grid
     layouts. */
     width: 100%;

     /* Fill the container height. Without this, a flex parent might
     shrink or stretch the image unexpectedly. */
     height: 100%;

     /* The critical one: fill the container while preserving the
     image's aspect ratio. Crops the overflow instead of
     stretching (fill) or letterboxing (contain).
     Photos look professional; faces don't distort. */
     object-fit: cover;
}
</style>
