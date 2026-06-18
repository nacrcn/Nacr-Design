<template>
  <div class="n-comment">
    <div class="n-comment__avatar">
      <slot name="avatar">
        <NAvatar :src="avatar" :alt="author" size="md" round />
      </slot>
    </div>
    <div class="n-comment__main">
      <div class="n-comment__header">
        <span class="n-comment__author">{{ author }}</span>
        <span v-if="datetime" class="n-comment__datetime">{{ datetime }}</span>
      </div>
      <div class="n-comment__content">
        <slot />
      </div>
      <div v-if="$slots.actions" class="n-comment__actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  author?: string
  avatar?: string
  datetime?: string
}>()
</script>

<style scoped>
.n-comment { display: flex; gap: 12px; }
.n-comment__avatar { flex-shrink: 0; }
.n-comment__main { flex: 1; min-width: 0; }
.n-comment__header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.n-comment__author { font-weight: 600; font-size: var(--n-font-size-md); color: var(--n-color-text); }
.n-comment__datetime { font-size: var(--n-font-size-xs); color: var(--n-color-text-disabled); }
.n-comment__content { font-size: var(--n-font-size-md); color: var(--n-color-text-secondary); line-height: 1.6; }
.n-comment__actions { margin-top: 8px; display: flex; gap: 12px; font-size: var(--n-font-size-sm); color: var(--n-color-text-secondary); }
</style>
