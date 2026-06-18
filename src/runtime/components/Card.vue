<template>
  <div
    v-if="!dismissed"
    :class="[
      'n-card',
      `n-card--${size}`,
      `n-card--${variant}`,
      {
        'n-card--hoverable': hoverable,
        'n-card--bordered': bordered,
        'n-card--segmented': segmented,
        'n-card--collapsible': collapsible,
        'n-card--collapsed': collapsed,
      },
    ]"
  >
    <!-- 封面图 -->
    <div v-if="$slots.cover" class="n-card__cover">
      <slot name="cover" />
    </div>

    <!-- 头部 -->
    <div v-if="hasHeader" :class="['n-card__header', { 'n-card__header--segmented': segmented }]">
      <div class="n-card__header-main">
        <slot name="header">
          <span class="n-card__title">{{ title }}</span>
        </slot>
        <div v-if="$slots['header-extra'] || headerExtra" class="n-card__header-extra">
          <slot name="header-extra">
            <span class="n-card__header-extra-text">{{ headerExtra }}</span>
          </slot>
        </div>
      </div>
      <div class="n-card__header-actions">
        <button v-if="collapsible" class="n-card__action-btn" @click="toggleCollapse" :title="collapsed ? '展开' : '收起'">
          <svg :class="['n-card__collapse-icon', { 'n-card__collapse-icon--collapsed': collapsed }]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button v-if="closable" class="n-card__action-btn" @click="handleClose" title="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 主体 -->
    <div v-show="!collapsed" class="n-card__body">
      <slot />
    </div>

    <!-- 操作区 -->
    <div v-if="$slots.actions && !collapsed" :class="['n-card__actions', { 'n-card__actions--segmented': segmented }]">
      <slot name="actions" />
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer && !collapsed" :class="['n-card__footer', { 'n-card__footer--segmented': segmented }]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

type CardVariant = 'default' | 'bordered' | 'shadow'
type CardSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  title?: string
  variant?: CardVariant
  size?: CardSize
  hoverable?: boolean
  bordered?: boolean
  segmented?: boolean
  closable?: boolean
  collapsible?: boolean
  headerExtra?: string
}>(), {
  title: '',
  variant: 'default',
  size: 'md',
  hoverable: false,
  bordered: false,
  segmented: false,
  closable: false,
  collapsible: false,
  headerExtra: '',
})

const emit = defineEmits<{
  close: []
  'update:collapsed': [val: boolean]
}>()

const slots = useSlots()

const dismissed = ref(false)
const collapsed = ref(false)

const hasHeader = computed(() => {
  return slots.header || props.title || slots['header-extra'] || props.headerExtra || props.closable || props.collapsible
})

function handleClose() {
  dismissed.value = true
  emit('close')
}

function toggleCollapse() {
  collapsed.value = !collapsed.value
  emit('update:collapsed', collapsed.value)
}
</script>

<style scoped>
.n-card {
  --n-card-radius: var(--n-radius-lg, 12px);
  --n-card-padding: 20px;
  --n-card-font-size: 14px;
  border-radius: var(--n-card-radius);
  background: var(--n-color-bg, #fff);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

/* ====== Sizes ====== */
.n-card--sm {
  --n-card-padding: 14px;
  --n-card-font-size: 13px;
}

.n-card--lg {
  --n-card-padding: 24px;
  --n-card-font-size: 15px;
}

/* ====== Variants ====== */
.n-card--default {
  border: 1px solid var(--n-color-border, #e5e7eb);
}

.n-card--bordered {
  border: 2px solid var(--n-color-primary, #1677ff);
}

.n-card--shadow {
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.n-card--shadow.n-card--hoverable:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06);
}

/* ====== Bordered ====== */
.n-card--bordered:not(.n-card--shadow) {
  border: 1px solid var(--n-color-border, #e5e7eb);
}

/* ====== Hoverable ====== */
.n-card--hoverable {
  cursor: pointer;
}

.n-card--hoverable:not(.n-card--shadow):hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* ====== Cover ====== */
.n-card__cover {
  overflow: hidden;
  border-radius: var(--n-card-radius) var(--n-card-radius) 0 0;
}

.n-card__cover > :deep(*) {
  width: 100%;
  display: block;
}

/* ====== Header ====== */
.n-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--n-card-padding) * 0.7) var(--n-card-padding);
  border-bottom: 1px solid var(--n-color-border, #e5e7eb);
}

.n-card__header--segmented {
  border-bottom: none;
  margin: 0 var(--n-card-padding);
  padding: calc(var(--n-card-padding) * 0.7) 0;
  box-shadow: 0 1px 0 var(--n-color-border, #e5e7eb);
}

.n-card__header-main {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.n-card__title {
  font-size: calc(var(--n-card-font-size) + 2px);
  font-weight: 600;
  color: var(--n-color-text, #1f2937);
  line-height: 1.5;
  flex-shrink: 0;
}

.n-card__header-extra {
  margin-left: auto;
  flex-shrink: 0;
}

.n-card__header-extra-text {
  font-size: var(--n-card-font-size);
  color: var(--n-color-text-secondary, #6b7280);
}

.n-card__header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 8px;
  flex-shrink: 0;
}

.n-card__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--n-radius-sm, 4px);
  border: none;
  background: transparent;
  color: var(--n-color-text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.n-card__action-btn:hover {
  background: var(--n-color-fill, #f3f4f6);
  color: var(--n-color-text, #1f2937);
}

.n-card__action-btn svg {
  width: 16px;
  height: 16px;
}

.n-card__collapse-icon {
  transition: transform 0.3s ease;
}

.n-card__collapse-icon--collapsed {
  transform: rotate(-90deg);
}

/* ====== Body ====== */
.n-card__body {
  padding: var(--n-card-padding);
  font-size: var(--n-card-font-size);
  color: var(--n-color-text, #1f2937);
  line-height: 1.6;
}

/* 如果有 cover，body 上方不加额外间距由 cover 撑开 */
.n-card__cover + .n-card__body {
  padding-top: var(--n-card-padding);
}

/* ====== Actions ====== */
.n-card__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: calc(var(--n-card-padding) * 0.6) var(--n-card-padding);
  border-top: 1px solid var(--n-color-border, #e5e7eb);
}

.n-card__actions--segmented {
  border-top: none;
  margin: 0 var(--n-card-padding);
  padding: calc(var(--n-card-padding) * 0.6) 0;
  box-shadow: 0 -1px 0 var(--n-color-border, #e5e7eb);
}

/* ====== Footer ====== */
.n-card__footer {
  padding: calc(var(--n-card-padding) * 0.7) var(--n-card-padding);
  border-top: 1px solid var(--n-color-border, #e5e7eb);
}

.n-card__footer--segmented {
  border-top: none;
  margin: 0 var(--n-card-padding);
  padding: calc(var(--n-card-padding) * 0.7) 0;
  box-shadow: 0 -1px 0 var(--n-color-border, #e5e7eb);
}

/* ====== Segmented ====== */
.n-card--segmented .n-card__body {
  padding-top: calc(var(--n-card-padding) * 0.5);
  padding-bottom: calc(var(--n-card-padding) * 0.5);
}
</style>
