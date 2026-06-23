<template>
  <div :class="['n-grid', { 'n-grid--gutter': gutter }]" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  cols?: number
  gap?: number | [number, number]
  gutter?: boolean
}>(), {
  cols: 24,
  gap: 0,
  gutter: false,
})

const colsRef = ref(props.cols)
watch(() => props.cols, (v) => { colsRef.value = v })

provide('n-grid-cols', colsRef)

const gridStyle = computed(() => {
  const rowGap = Array.isArray(props.gap) ? props.gap[0] : props.gap
  const colGap = Array.isArray(props.gap) ? props.gap[1] : props.gap
  return {
    'grid-template-columns': `repeat(${props.cols}, minmax(0, 1fr))`,
    'row-gap': `${rowGap}px`,
    'column-gap': `${colGap}px`,
  }
})
</script>

<style scoped>
.n-grid {
  display: grid;
  box-sizing: border-box;
}
.n-grid--gutter { padding: 8px; }
</style>
