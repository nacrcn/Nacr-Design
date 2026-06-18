<template>
  <slot />
</template>

<script setup lang="ts">
provide('nacrConfig', {
  prefix: 'N',
  ...defineProps<{
    prefix?: string
    theme?: 'light' | 'dark'
  }>(),
})
</script>
