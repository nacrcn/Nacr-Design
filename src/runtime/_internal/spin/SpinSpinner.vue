<template>
  <div class="n-spin-spinner" :style="{ width: `${size}px`, height: `${size}px` }">
    <span
      v-for="i in 12"
      :key="i"
      class="n-spin-spinner__blade"
      :style="bladeStyle(i)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  color?: string
  size?: number
}>(), {
  color: 'var(--n-color-primary)',
  size: 32,
})

const bladeLen = computed(() => Math.max(4, props.size * 0.35))
const bladeW = computed(() => Math.max(2, props.size * 0.1))

function bladeStyle(i: number) {
  return {
    position: 'absolute' as const,
    left: '50%',
    top: '0',
    width: `${bladeW.value}px`,
    height: `${bladeLen.value}px`,
    borderRadius: `${bladeW.value}px`,
    background: props.color,
    transformOrigin: `center ${props.size / 2}px`,
    transform: `rotate(${i * 30}deg)`,
    opacity: (1 - i / 12).toFixed(2),
    animation: `n-spin-spinner-fade 1.2s linear infinite`,
    animationDelay: `${-1.2 + i * 0.1}s`,
  }
}
</script>

<style scoped>
.n-spin-spinner {
  position: relative;
  display: inline-block;
  animation: n-spin-spinner-rotate 12s linear infinite;
}
@keyframes n-spin-spinner-rotate {
  to { transform: rotate(360deg); }
}
@keyframes n-spin-spinner-fade {
  0%   { opacity: 1; }
  100% { opacity: 0.08; }
}
</style>
