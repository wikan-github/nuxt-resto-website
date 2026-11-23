
<template>
  <div 
    class="pulse-dot-container" 
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <div 
      class="pulse-dot-ping" 
      :style="{ 
        backgroundColor: pingColor, 
        animationDuration: `${speed}s` 
      }"
    ></div>
    <div 
      class="pulse-dot" 
      :style="{ 
        backgroundColor: color,
        width: `${size}px`, 
        height: `${size}px`
      }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 10
  },
  color: {
    type: String,
    default: '#22c55e'
  },
  pingColor: {
    type: String,
    default: '#4ade80'
  },
  speed: {
    type: Number,
    default: 1.5
  }
});
</script>

<style scoped>
.pulse-dot-container {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.pulse-dot-ping {
  animation: ping cubic-bezier(0, 0, 0.2, 1) infinite;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.75;
}

.pulse-dot {
  position: relative;
  border-radius: 50%;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>

