<template>
  <svg class="n-spin-ring" :width="size" :height="size" viewBox="0 0 50 50">
    <circle
      class="n-spin-ring__circle"
      cx="25" cy="25" r="20"
      fill="none"
      :stroke="color"
      stroke-width="4"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  size?: number
}>(), {
  color: 'var(--n-color-primary)',
  size: 32,
})
</script>

<style scoped>
.n-spin-ring { animation: n-spin-ring-rotate 1.2s linear infinite; }
.n-spin-ring__circle {
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0;
  animation: n-spin-ring-dash 1.5s ease-in-out infinite;
}

@keyframes n-spin-ring-rotate {
  to { transform: rotate(360deg); }
}
@keyframes n-spin-ring-dash {
  0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50%  { stroke-dasharray: 90, 200; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124; }
}
</style>
