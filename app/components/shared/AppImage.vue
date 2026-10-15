<!--
  ============================================================================
  AppImage.vue — <img> with graceful SVG fallback (auto-import: SharedAppImage)
  ============================================================================
  Plain <img> (NOT <picture>): the error event fires on 404 so the fallback
  swap actually works. Warns once per missing src and resets if `src` changes.
-->
<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
    :class="imgClass"
    @error="onImageError"
  />
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  fallbackSrc?: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
  imgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackSrc: '/images/placeholder.svg',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'auto',
  imgClass: undefined,
  width: undefined,
  height: undefined,
})

const currentSrc = ref(props.src)
const warned = ref(false)

watch(
  () => props.src,
  (next) => {
    warned.value = false
    currentSrc.value = next
  },
)

function onImageError(): void {
  if (currentSrc.value === props.fallbackSrc) return
  if (!warned.value) {
    warned.value = true
    console.warn(`[Image] Failed to load: ${props.src}`)
  }
  currentSrc.value = props.fallbackSrc
}
</script>
