<template>
  <button
    :class="[
      'n-btn',
      `n-btn--${variant}`,
      `n-btn--${size}`,
      {
        'n-btn--block': block,
        'n-btn--loading': loading,
        'n-btn--disabled': disabled,
        'n-btn--round': round,
        'n-btn--circle': circle,
        'n-btn--active': active,
      }
    ]"
    :disabled="disabled || loading"
    :type="htmlType"
    @click="handleClick"
  >
    <span v-if="loading" class="n-btn__spinner" />
    <span v-if="hasIcon && !loading" class="n-btn__icon">
      <slot name="icon" />
    </span>
    <span v-if="!circle" class="n-btn__content">
      <slot />
    </span>
    <span v-if="hasSuffixIcon" class="n-btn__icon n-btn__icon--suffix">
      <slot name="suffix-icon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  /** 按钮变体风格 */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link'
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否为块级按钮 */
  block?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否圆角胶囊按钮 */
  round?: boolean
  /** 是否圆形图标按钮 */
  circle?: boolean
  /** 是否激活状态（用于切换按钮） */
  active?: boolean
  /** 原生 button type 属性 */
  htmlType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  round: false,
  circle: false,
  active: false,
  htmlType: 'button',
})

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)
const hasSuffixIcon = computed(() => !!slots['suffix-icon'])

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<style scoped>
/* ── 基础 ── */
.n-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  outline: none;
  position: relative;
  overflow: hidden;
  text-decoration: none;
}

.n-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--n-color-bg, #fff), 0 0 0 4px var(--n-color-primary, #3b82f6);
}

/* ── 尺寸 ── */
.n-btn--sm {
  padding: 5px 12px;
  font-size: 12px;
  height: 28px;
}

.n-btn--md {
  padding: 7px 16px;
  font-size: 14px;
  height: 34px;
}

.n-btn--lg {
  padding: 10px 22px;
  font-size: 16px;
  height: 42px;
}

/* ── 圆形按钮尺寸 ── */
.n-btn--circle.n-btn--sm {
  padding: 5px;
  width: 28px;
}

.n-btn--circle.n-btn--md {
  padding: 7px;
  width: 34px;
}

.n-btn--circle.n-btn--lg {
  padding: 10px;
  width: 42px;
}

/* ── 变体 ── */
.n-btn--primary {
  background: var(--n-color-primary);
  color: var(--n-color-text-inverse);
  border-color: var(--n-color-primary);
}

.n-btn--primary:hover {
  background: var(--n-color-primary-hover);
  border-color: var(--n-color-primary-hover);
}

.n-btn--primary:active {
  background: var(--n-color-primary-active, var(--n-color-primary));
  border-color: var(--n-color-primary-active, var(--n-color-primary));
}

.n-btn--secondary {
  background: var(--n-color-secondary);
  color: var(--n-color-text-secondary);
  border-color: var(--n-color-secondary);
}

.n-btn--secondary:hover {
  background: var(--n-color-secondary-hover);
  border-color: var(--n-color-secondary-hover);
}

.n-btn--danger {
  background: var(--n-color-danger);
  color: var(--n-color-text-inverse);
  border-color: var(--n-color-danger);
}

.n-btn--danger:hover {
  background: var(--n-color-danger-hover);
  border-color: var(--n-color-danger-hover);
}

.n-btn--ghost {
  background: transparent;
  color: var(--n-color-primary);
  border-color: transparent;
}

.n-btn--ghost:hover {
  background: var(--n-color-primary-light);
}

.n-btn--outline {
  background: transparent;
  color: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

.n-btn--outline:hover {
  background: var(--n-color-primary-light);
  border-color: var(--n-color-primary-hover);
}

.n-btn--outline:active {
  background: var(--n-color-primary-light);
  border-color: var(--n-color-primary-active, var(--n-color-primary));
}

.n-btn--link {
  background: transparent;
  color: var(--n-color-primary);
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
  height: auto;
}

.n-btn--link:hover {
  color: var(--n-color-primary-hover);
  text-decoration: underline;
}

/* ── 圆角胶囊 ── */
.n-btn--round {
  border-radius: 999px;
}

/* ── 圆形 ── */
.n-btn--circle {
  border-radius: 50%;
}

/* ── 激活状态 ── */
.n-btn--active {
  box-shadow: 0 0 0 2px var(--n-color-primary-light, #bfdbfe);
}

.n-btn--primary.n-btn--active {
  background: var(--n-color-primary-active, var(--n-color-primary));
}

.n-btn--outline.n-btn--active,
.n-btn--ghost.n-btn--active {
  background: var(--n-color-primary-light);
  color: var(--n-color-primary);
}

.n-btn--danger.n-btn--active {
  background: var(--n-color-danger-active, var(--n-color-danger));
}

/* ── 块级 ── */
.n-btn--block {
  display: flex;
  width: 100%;
}

/* ── 禁用 ── */
.n-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── 加载 ── */
.n-btn--loading {
  cursor: wait;
  pointer-events: none;
}

.n-btn--loading .n-btn__content,
.n-btn--loading .n-btn__icon {
  opacity: 0;
}

.n-btn__spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  margin-top: -7px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--n-color-text-inverse);
  border-radius: 50%;
  animation: n-spin 0.6s linear infinite;
}

.n-btn--outline .n-btn__spinner,
.n-btn--ghost .n-btn__spinner,
.n-btn--link .n-btn__spinner,
.n-btn--secondary .n-btn__spinner {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: var(--n-color-primary);
}

/* ── 图标 ── */
.n-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}

.n-btn__icon--suffix {
  margin-left: -2px;
}

.n-btn__content {
  display: inline-flex;
  align-items: center;
}

@keyframes n-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
