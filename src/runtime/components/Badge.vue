<template>
  <span class="n-badge">
    <slot />
    <sup v-if="!dot" :class="['n-badge__count', `n-badge__count--${type}`]">{{ displayCount }}</sup>
    <span v-else :class="['n-badge__dot', `n-badge__dot--${type}`]" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  count?: number
  max?: number
  dot?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>(), {
  count: 0,
  max: 99,
  dot: false,
  type: 'danger',
})

const displayCount = computed(() => props.count > props.max ? `${props.max}+` : props.count)
</script>

<style scoped>
.n-badge { position: relative; display: inline-block; }
.n-badge__count {
  position: absolute; top: 0; right: 0; transform: translate(50%, -50%);
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
  font-size: 11px; font-weight: 600; line-height: 18px; text-align: center; color: #fff; white-space: nowrap;
}
.n-badge__count--primary { background: var(--n-color-primary); }
.n-badge__count--success { background: var(--n-color-success); }
.n-badge__count--warning { background: var(--n-color-warning); }
.n-badge__count--danger { background: var(--n-color-danger); }
.n-badge__count--info { background: var(--n-color-info); }
.n-badge__dot { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; border-radius: 50%; transform: translate(50%, -50%); }
.n-badge__dot--primary { background: var(--n-color-primary); }
.n-badge__dot--success { background: var(--n-color-success); }
.n-badge__dot--warning { background: var(--n-color-warning); }
.n-badge__dot--danger { background: var(--n-color-danger); }
.n-badge__dot--info { background: var(--n-color-info); }
</style>
