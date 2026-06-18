<template>
  <button :class="[
    'n-btn',
    `n-btn--${variant}`,
    `n-btn--${size}`,
    { 'n-btn--block': block, 'n-btn--loading': loading, 'n-btn--disabled': disabled }
  ]" :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="n-btn__spinner" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<style scoped>
.n-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

.n-btn--sm {
  padding: 6px 12px;
  font-size: 12px;
}

.n-btn--md {
  padding: 8px 16px;
  font-size: 14px;
}

.n-btn--lg {
  padding: 12px 24px;
  font-size: 16px;
}

.n-btn--primary {
  background: var(--n-color-primary);
  color: var(--n-color-text-inverse);
}

.n-btn--primary:hover {
  background: var(--n-color-primary-hover);
}

.n-btn--secondary {
  background: var(--n-color-secondary);
  color: var(--n-color-text-secondary);
}

.n-btn--secondary:hover {
  background: var(--n-color-secondary-hover);
}

.n-btn--danger {
  background: var(--n-color-danger);
  color: var(--n-color-text-inverse);
}

.n-btn--danger:hover {
  background: var(--n-color-danger-hover);
}

.n-btn--ghost {
  background: transparent;
  color: var(--n-color-primary);
}

.n-btn--ghost:hover {
  background: var(--n-color-primary-light);
}

.n-btn--block {
  display: flex;
  width: 100%;
}

.n-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-btn--loading {
  cursor: wait;
}

.n-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--n-color-text-inverse);
  border-radius: 50%;
  animation: n-spin 0.6s linear infinite;
}

@keyframes n-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
