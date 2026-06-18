<template>
  <transition name="n-alert__fade">
    <div
      v-if="visible"
      :class="[
        'n-alert',
        `n-alert--${type}`,
        {
          'n-alert--banner': banner,
          'n-alert--outlined': outlined,
          'n-alert--border-accent': borderAccent,
          'n-alert--no-icon': !showIcon,
        },
      ]"
    >
      <span v-if="showIcon" class="n-alert__icon">
        <slot name="icon">
          <NIcon :name="iconNames[type]" size="20" />
        </slot>
      </span>
      <div class="n-alert__body">
        <div v-if="title || $slots.title" class="n-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="n-alert__content">
          <slot />
        </div>
      </div>
      <span v-if="closable" class="n-alert__close" @click="handleClose">
        <slot name="close-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </slot>
      </span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  banner?: boolean
  showIcon?: boolean
  outlined?: boolean
  borderAccent?: boolean
}>(), {
  type: 'info',
  closable: false,
  banner: false,
  showIcon: true,
  outlined: false,
  borderAccent: false,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref<boolean>(true)

const iconNames: Record<string, string> = {
  info: 'tishi',
  success: 'chenggong',
  warning: 'tanhao',
  error: 'shibai',
}

function handleClose() {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.n-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--n-radius-md);
  border: 1px solid;
  font-size: var(--n-font-size-md);
  line-height: 1.6;
  transition: opacity 0.2s, transform 0.2s;
}

/* ── Filled (default) ── */
.n-alert--info {
  background: var(--n-color-info-light);
  border-color: var(--n-color-info-border);
  color: var(--n-color-info-text);
}
.n-alert--success {
  background: var(--n-color-success-light);
  border-color: var(--n-color-success-border);
  color: var(--n-color-success-text);
}
.n-alert--warning {
  background: var(--n-color-warning-light);
  border-color: var(--n-color-warning-border);
  color: var(--n-color-warning-text);
}
.n-alert--error {
  background: var(--n-color-danger-light);
  border-color: var(--n-color-danger-border);
  color: var(--n-color-danger-text);
}

/* ── Outlined variant ── */
.n-alert--outlined {
  background: transparent;
}
.n-alert--outlined.n-alert--info {
  border-color: var(--n-color-info);
  color: var(--n-color-info);
}
.n-alert--outlined.n-alert--success {
  border-color: var(--n-color-success);
  color: var(--n-color-success);
}
.n-alert--outlined.n-alert--warning {
  border-color: var(--n-color-warning);
  color: var(--n-color-warning);
}
.n-alert--outlined.n-alert--error {
  border-color: var(--n-color-danger);
  color: var(--n-color-danger);
}

/* ── Border accent (left thick border) ── */
.n-alert--border-accent {
  border-left-width: 4px;
  border-left-style: solid;
}
.n-alert--border-accent.n-alert--info {
  border-left-color: var(--n-color-info);
}
.n-alert--border-accent.n-alert--success {
  border-left-color: var(--n-color-success);
}
.n-alert--border-accent.n-alert--warning {
  border-left-color: var(--n-color-warning);
}
.n-alert--border-accent.n-alert--error {
  border-left-color: var(--n-color-danger);
}

/* ── Banner ── */
.n-alert--banner {
  border-radius: 0;
  border-left: none;
  border-right: none;
}

/* ── Icon ── */
.n-alert__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 1px;
}
.n-alert--info .n-alert__icon { color: var(--n-color-info); }
.n-alert--success .n-alert__icon { color: var(--n-color-success); }
.n-alert--warning .n-alert__icon { color: var(--n-color-warning); }
.n-alert--error .n-alert__icon { color: var(--n-color-danger); }
.n-alert--outlined .n-alert__icon { color: inherit; }
.n-alert--border-accent .n-alert__icon { color: inherit; }

/* ── No icon ── */
.n-alert--no-icon {
  gap: 0;
}

/* ── Body ── */
.n-alert__body {
  flex: 1;
  min-width: 0;
}
.n-alert__title {
  font-weight: 600;
  font-size: var(--n-font-size-md);
  line-height: 1.5;
  margin-bottom: 2px;
}
.n-alert__content {
  font-size: var(--n-font-size-sm);
  line-height: 1.6;
  opacity: 0.9;
}

/* ── Close ── */
.n-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: var(--n-radius-sm);
  color: inherit;
  opacity: 0.5;
  transition: all var(--n-transition-fast);
  margin-top: 1px;
}
.n-alert__close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.06);
}

/* ── Transition ── */
.n-alert__fade-enter-active,
.n-alert__fade-leave-active {
  transition: all 0.25s ease;
}
.n-alert__fade-enter-from,
.n-alert__fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
