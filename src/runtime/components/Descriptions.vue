<template>
  <div class="n-descriptions" :style="{ '--n-desc-cols': column }">
    <div v-if="title" class="n-descriptions__title">{{ title }}</div>
    <div class="n-descriptions__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  column?: number
  bordered?: boolean
}>(), {
  column: 2,
  bordered: false,
})
</script>

<style scoped>
.n-descriptions { font-size: var(--n-font-size-md); }
.n-descriptions__title { font-size: var(--n-font-size-lg); font-weight: 600; margin-bottom: 12px; color: var(--n-color-text); }
.n-descriptions__body { display: grid; grid-template-columns: repeat(var(--n-desc-cols), auto 1fr); gap: 0; }
</style>
