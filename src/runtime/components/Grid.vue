<template>
  <div :class="['n-grid', { 'n-grid--gutter': gutter }]" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed} from 'vue'
const props = withDefaults(defineProps<{
  cols?: number
  gap?: number
  gutter?: boolean
}>(), {
  cols: 24,
  gap: 0,
  gutter: false,
})

const gridStyle = computed(() => ({
  'grid-template-columns': `repeat(${props.cols}, 1fr)`,
  gap: `${props.gap}px`,
}))
</script>

<style scoped>
.n-grid {
  display: grid;
  box-sizing: border-box;
}
.n-grid--gutter { padding: 8px; }
</style>
