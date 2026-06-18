<template>
  <div :class="['n-avatar-group', `n-avatar-group--${direction}`, { 'n-avatar-group--closable': closable }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'

type AvatarGroupDirection = 'left' | 'right'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  shape?: 'circle' | 'square' | 'rounded'
  color?: string
  bordered?: boolean
  max?: number
  direction?: AvatarGroupDirection
  closable?: boolean
}>(), {
  size: 'md',
  shape: 'circle',
  bordered: true,
  max: Infinity,
  direction: 'left',
  closable: false,
})

const emit = defineEmits<{
  close: [index: number]
}>()

provide('n-avatar-group', {
  size: props.size,
  shape: props.shape,
  color: props.color,
  bordered: props.bordered,
})

provide('n-avatar-group-max', props.max)
provide('n-avatar-group-direction', props.direction)
</script>

<style scoped>
.n-avatar-group {
  display: inline-flex;
  align-items: center;
}

.n-avatar-group--left > :deep(.n-avatar + .n-avatar) {
  margin-left: -8px;
}

.n-avatar-group--right > :deep(.n-avatar + .n-avatar) {
  margin-right: -8px;
}

.n-avatar-group > :deep(.n-avatar) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.n-avatar-group > :deep(.n-avatar:hover) {
  transform: translateY(-2px);
  z-index: 1;
}
</style>
