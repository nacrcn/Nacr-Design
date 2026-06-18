<template>
  <component :is="tag" :class="layoutClass" :style="layoutStyle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  tag?: string
  gap?: number
  wrap?: boolean
}>(), {
  direction: 'vertical',
  tag: 'div',
  gap: 0,
  wrap: true,
})

const layoutClass = computed(() => [
  'n-layout',
  `n-layout--${props.direction}`,
  { 'n-layout--wrap': props.wrap },
])

const layoutStyle = computed(() => ({ gap: `${props.gap}px` }))
</script>

<style scoped>
.n-layout { display: flex; box-sizing: border-box; }
.n-layout--horizontal { flex-direction: row; }
.n-layout--vertical { flex-direction: column; }
.n-layout--wrap { flex-wrap: wrap; }
</style>
