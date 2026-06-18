<template>
  <div class="n-spin-dot" :style="{ width: `${size}px`, height: `${size}px` }">
    <span class="n-spin-dot__item" :style="itemStyle" />
    <span class="n-spin-dot__item" :style="itemStyle" />
    <span class="n-spin-dot__item" :style="itemStyle" />
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

const dotSize = computed(() => Math.max(6, props.size * 0.25))
const gap = computed(() => Math.max(3, props.size * 0.15))

const itemStyle = computed(() => ({
  width: `${dotSize.value}px`,
  height: `${dotSize.value}px`,
  background: props.color,
  margin: `0 ${gap.value / 2}px`,
}))
</script>

<style scoped>
.n-spin-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.n-spin-dot__item {
  border-radius: 50%;
  animation: n-spin-dot-bounce 1.4s ease-in-out infinite both;
}
.n-spin-dot__item:nth-child(1) { animation-delay: -0.32s; }
.n-spin-dot__item:nth-child(2) { animation-delay: -0.16s; }

@keyframes n-spin-dot-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
