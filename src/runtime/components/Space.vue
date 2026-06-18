<template>
  <div :class="['n-space', `n-space--${direction}`, `n-space--align-${align}`]" :style="spaceStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {computed } from 'vue'
const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end' | 'baseline'
  size?: number | string
  wrap?: boolean
}>(), {
  direction: 'horizontal',
  align: 'center',
  size: 8,
  wrap: false,
})

const spaceStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    gap: s,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
  }
})
</script>

<style scoped>
.n-space { display: inline-flex; }
.n-space--horizontal { flex-direction: row; }
.n-space--vertical { flex-direction: column; }
.n-space--align-start { align-items: flex-start; }
.n-space--align-center { align-items: center; }
.n-space--align-end { align-items: flex-end; }
.n-space--align-baseline { align-items: baseline; }
</style>
