<template>
  <div
    :class="[
      'n-descriptions-item',
      { 'n-descriptions-item--span': span > 1 }
    ]"
    :style="spanStyle"
  >
    <span class="n-descriptions-item__label">{{ label }}</span>
    <span class="n-descriptions-item__value"><slot /></span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  span?: number
}>(), {
  span: 1,
})

const layoutInfo = inject<{
  labelPlacement: ComputedRef<string>
  vertical: ComputedRef<boolean>
  column: ComputedRef<number>
}>('n-descriptions', {
  labelPlacement: computed(() => 'left'),
  vertical: computed(() => false),
  column: computed(() => 2),
})

const spanStyle = computed(() => {
  if (props.span <= 1) return undefined

  const { labelPlacement, vertical, column } = layoutInfo

  if (labelPlacement.value === 'top') {
    return { gridColumn: `span ${props.span}` }
  }

  if (vertical.value) {
    return { gridColumn: `span ${Math.min(props.span, column.value) * 2}` }
  }

  return { gridColumn: `span ${props.span * 2}` }
})
</script>

<style scoped>
.n-descriptions-item {
  display: contents;
}

.n-descriptions-item__label {
  color: var(--n-color-text-secondary);
  font-size: var(--n-font-size-sm);
  background: var(--n-color-fill);
  white-space: nowrap;
}

.n-descriptions-item__value {
  color: var(--n-color-text);
}
</style>
