<template>
  <div :class="['n-result', `n-result--${status}`]">
    <div class="n-result__icon">{{ iconMap[status] }}</div>
    <div v-if="title" class="n-result__title">{{ title }}</div>
    <div v-if="description" class="n-result__desc">{{ description }}</div>
    <div v-if="$slots.default" class="n-result__footer"><slot /></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  status?: 'info' | 'success' | 'warning' | 'error' | '404' | '403' | '500'
  title?: string
  description?: string
}>(), {
  status: 'info',
})

const iconMap: Record<string, string> = {
  info: 'ℹ', success: '✓', warning: '⚠', error: '✕',
  '404': '?', '403': '⊘', '500': '⚡',
}
</script>

<style scoped>
.n-result { display: flex; flex-direction: column; align-items: center; padding: 48px 32px; text-align: center; }
.n-result__icon { font-size: 72px; font-weight: 300; line-height: 1; margin-bottom: 24px; }
.n-result--info .n-result__icon { color: var(--n-color-info); }
.n-result--success .n-result__icon { color: var(--n-color-success); }
.n-result--warning .n-result__icon { color: var(--n-color-warning); }
.n-result--error .n-result__icon, .n-result--500 .n-result__icon { color: var(--n-color-danger); }
.n-result--404 .n-result__icon, .n-result--403 .n-result__icon { color: var(--n-color-text-disabled); }
.n-result__title { font-size: 24px; font-weight: 600; color: var(--n-color-text); margin-bottom: 8px; }
.n-result__desc { font-size: var(--n-font-size-md); color: var(--n-color-text-secondary); line-height: 1.6; max-width: 480px; }
.n-result__footer { margin-top: 24px; }
</style>
