<script
	setup
	lang="ts"
>
	const props = withDefaults(
		defineProps<{
			src?: string | null;
			alt: string;
			fallback?: string;
		}>(),
		{
			fallback: "/images/placeholder.svg",
		},
	);
	const failed = ref(false);

	const resolvedSrc = computed(() =>
		!props.src || failed.value ? props.fallback : props.src,
	);
	function handleError() {
		failed.value = true;
		if (import.meta.dev) {
			console.warn(`[AppImage] missing asset: ${props.src} — using fallback`);
		}
	}
</script>

<template>
	<Picture>
		<img
			:src="resolvedSrc"
			:alt="alt"
			loading="lazy"
			class="app-image"
			@error="handleError"
		/>
	</Picture>

</template>

<style scoped>
.app-image {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
