<template>
  <div :class="['n-grid-item', { 'n-grid-item--offset': offset > 0 }]" :style="itemStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'

const props = withDefaults(defineProps<{
  span?: number
  offset?: number
  push?: number
  pull?: number
}>(), {
  span: 1,
  offset: 0,
  push: 0,
  pull: 0,
})

const gridCols = inject<Ref<number>>('n-grid-cols', { value: 24 } as any)

const itemStyle = computed(() => {
  const style: Record<string, string> = {}
  const cols = gridCols.value ?? 24
  const clampedSpan = Math.min(props.span, cols)
  style.gridColumn = `span ${clampedSpan} / span ${clampedSpan}`

  if (props.offset > 0) {
    style.gridColumnStart = `${props.offset + 1}`
  }

  if (props.push > 0) {
    style.marginLeft = `${(props.push / cols) * 100}%`
  }
  if (props.pull > 0) {
    style.marginLeft = `${-(props.pull / cols) * 100}%`
  }

  return style
})
</script>

<style scoped>
.n-grid-item {
  min-width: 0;
  box-sizing: border-box;
}
</style>
