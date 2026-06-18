<template>
  <div :class="['n-descriptions-item', { 'n-descriptions-item--span': span > 1 }]" :style="{ gridColumn: span > 1 ? `span ${span * 2}` : undefined }">
    <span class="n-descriptions-item__label">{{ label }}</span>
    <span class="n-descriptions-item__value"><slot /></span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  span?: number
}>(), {
  span: 1,
})
</script>

<style scoped>
.n-descriptions-item { display: contents; }
.n-descriptions-item__label { padding: 8px 12px; color: var(--n-color-text-secondary); font-size: var(--n-font-size-sm); background: var(--n-color-fill); white-space: nowrap; }
.n-descriptions-item__value { padding: 8px 12px; color: var(--n-color-text); }
</style>
