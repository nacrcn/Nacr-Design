<template>
  <div
    :class="[
      'n-descriptions',
      `n-descriptions--${size}`,
      `n-descriptions--label-${labelPlacement}`,
      {
        'n-descriptions--bordered': bordered,
        'n-descriptions--vertical': vertical,
      }
    ]"
    :style="{ '--n-desc-cols': column }"
  >
    <div v-if="title" class="n-descriptions__title">{{ title }}</div>
    <div class="n-descriptions__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, type ComputedRef } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  column?: number
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
  labelPlacement?: 'left' | 'top'
  vertical?: boolean
}>(), {
  column: 2,
  bordered: false,
  size: 'md',
  labelPlacement: 'left',
  vertical: false,
})

provide('n-descriptions', {
  labelPlacement: computed(() => props.labelPlacement),
  vertical: computed(() => props.vertical),
  column: computed(() => props.column),
  bordered: computed(() => props.bordered),
  size: computed(() => props.size),
})
</script>

<style scoped>
.n-descriptions {
  font-size: var(--n-font-size-md);
}

/* ── 标题 ── */
.n-descriptions__title {
  font-size: var(--n-font-size-lg);
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--n-color-text);
}

/* ── 默认布局（标签在左） ── */
.n-descriptions--label-left .n-descriptions__body {
  display: grid;
  grid-template-columns: repeat(var(--n-desc-cols), auto 1fr);
}

/* ── 标签在上方 ── */
.n-descriptions--label-top .n-descriptions__body {
  display: grid;
  grid-template-columns: repeat(var(--n-desc-cols), 1fr);
}

/* ── 垂直布局（标题与内容上下排列） ── */
.n-descriptions--vertical.n-descriptions--label-left .n-descriptions__body {
  grid-template-columns: repeat(var(--n-desc-cols), 1fr 1fr);
}

/* ── 边框模式 ── */
.n-descriptions--bordered .n-descriptions__body {
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg, 6px);
  overflow: hidden;
}

.n-descriptions--bordered :deep(.n-descriptions-item__label) {
  border-right: 1px solid var(--n-color-border);
  border-bottom: 1px solid var(--n-color-border);
}

.n-descriptions--bordered :deep(.n-descriptions-item__value) {
  border-bottom: 1px solid var(--n-color-border);
}

.n-descriptions--bordered :deep(.n-descriptions-item:last-child .n-descriptions-item__label),
.n-descriptions--bordered :deep(.n-descriptions-item:last-child .n-descriptions-item__value) {
  border-bottom: none;
}

/* label-top + bordered */
.n-descriptions--label-top.n-descriptions--bordered :deep(.n-descriptions-item__label) {
  border-right: none;
  border-bottom: 1px solid var(--n-color-border);
}

.n-descriptions--label-top.n-descriptions--bordered :deep(.n-descriptions-item__value) {
  border-bottom: 1px solid var(--n-color-border);
}

/* ── 尺寸 ── */
.n-descriptions--sm :deep(.n-descriptions-item__label),
.n-descriptions--sm :deep(.n-descriptions-item__value) {
  padding: 4px 10px;
  font-size: var(--n-font-size-sm);
}

.n-descriptions--md :deep(.n-descriptions-item__label),
.n-descriptions--md :deep(.n-descriptions-item__value) {
  padding: 8px 12px;
  font-size: var(--n-font-size-md);
}

.n-descriptions--lg :deep(.n-descriptions-item__label),
.n-descriptions--lg :deep(.n-descriptions-item__value) {
  padding: 12px 16px;
  font-size: var(--n-font-size-lg);
}
</style>
