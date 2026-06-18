<template>
  <div v-if="forceRender" v-show="active" class="n-tabs-panel">
    <slot />
  </div>
  <div v-else-if="active" class="n-tabs-panel">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean
  /** Force render the panel even when inactive (keeps DOM for state preservation) */
  forceRender?: boolean
}>()
</script>
