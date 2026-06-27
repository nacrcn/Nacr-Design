<template>
  <div :class="['n-timeline', `n-timeline--${mode}`, `n-timeline--${direction}`, { 'n-timeline--reverse': reverse }]">
    <div
      v-for="(item, idx) in displayItems"
      :key="idx"
      :class="[
        'n-timeline__item',
        `n-timeline__item--${item.type || 'default'}`,
        `n-timeline__item--${mode}`,
        {
          'n-timeline__item--last': idx === displayItems.length - 1 && !pending,
          'n-timeline__item--pending': item._pending,
          'n-timeline__item--custom': item.dot || item.icon,
        },
      ]"
    >
      <!-- Label (only for alternate / right mode) -->
      <div v-if="mode !== 'left' && item.time" class="n-timeline__label">
        {{ item.time }}
      </div>

      <div class="n-timeline__tail" />

      <div :class="['n-timeline__dot-wrapper', { 'n-timeline__dot-wrapper--custom': item.dot || item.icon }]">
        <!-- Custom dot slot -->
        <div v-if="item.dot" class="n-timeline__custom-dot">
          <component :is="item.dot" v-if="typeof item.dot === 'object'" />
          <div v-else v-html="item.dot" />
        </div>
        <!-- Icon dot -->
        <NIcon
          v-else-if="item.icon"
          :name="item.icon"
          :size="14"
          :color="iconColor(item.type)"
          class="n-timeline__icon-dot"
        />
        <!-- Default dot -->
        <div v-else class="n-timeline__dot" />
      </div>

      <div class="n-timeline__content">
        <div v-if="item.title" class="n-timeline__title">{{ item.title }}</div>
        <div v-if="item.content" class="n-timeline__desc">{{ item.content }}</div>
        <div v-if="mode === 'left' && item.time && labelPosition === 'bottom'" class="n-timeline__time">{{ item.time }}</div>
      </div>
    </div>

    <!-- Pending ghost node -->
    <div v-if="pending" class="n-timeline__item n-timeline__item--pending n-timeline__item--last">
      <div v-if="mode !== 'left' && pendingTime" class="n-timeline__label">{{ pendingTime }}</div>
      <div class="n-timeline__tail n-timeline__tail--pending" />
      <div class="n-timeline__dot-wrapper">
        <div class="n-timeline__dot n-timeline__dot--pending" />
      </div>
      <div class="n-timeline__content">
        <div class="n-timeline__title">{{ typeof pending === 'string' ? pending : '进行中...' }}</div>
        <div v-if="mode === 'left' && pendingTime && labelPosition === 'bottom'" class="n-timeline__time">{{ pendingTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type VNode } from 'vue'
import NIcon from './Icon.vue'

type TimelineType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type TimelineMode = 'left' | 'right' | 'alternate'
type TimelineDirection = 'vertical' | 'horizontal'
type LabelPosition = 'bottom' | 'same'

export interface TimelineItem {
  title?: string
  content?: string
  time?: string
  type?: TimelineType
  /** iconfont name, e.g. 'chenggong', 'shibai' */
  icon?: string
  /** custom dot: HTML string or VNode */
  dot?: string | VNode
  _pending?: boolean
}

const props = withDefaults(defineProps<{
  items: TimelineItem[]
  /** Layout mode */
  mode?: TimelineMode
  /** Display direction */
  direction?: TimelineDirection
  /** Show pending ghost node; string = custom text */
  pending?: boolean | string
  /** Time for pending node */
  pendingTime?: string
  /** Reverse order */
  reverse?: boolean
  /** Time label position (only effective when mode is left) */
  labelPosition?: LabelPosition
}>(), {
  mode: 'left',
  direction: 'vertical',
  pending: false,
  pendingTime: '',
  reverse: false,
  labelPosition: 'bottom',
})

const displayItems = computed(() => {
  const list = [...props.items]
  return props.reverse ? list.reverse() : list
})

function iconColor(type?: TimelineType): string | undefined {
  const map: Record<string, string> = {
    primary: 'var(--n-color-primary)',
    success: 'var(--n-color-success)',
    warning: 'var(--n-color-warning)',
    danger: 'var(--n-color-danger)',
  }
  return type ? map[type] : undefined
}
</script>

<style scoped>
.n-timeline {
  --n-timeline-dot-size: 12px;
  --n-timeline-dot-border: 2px;
  --n-timeline-line-width: 2px;
  --n-timeline-gap: 6px;
  font-size: var(--n-font-size-md, 14px);
  line-height: 1.6;
}

/* ====== Vertical ====== */
.n-timeline--vertical {
  display: flex;
  flex-direction: column;
}

.n-timeline__item {
  position: relative;
  padding-left: calc(var(--n-timeline-dot-size) + 14px);
  padding-bottom: 20px;
}
.n-timeline__item--last { padding-bottom: 0; }

/* Tail */
.n-timeline__tail {
  position: absolute;
  left: calc((var(--n-timeline-dot-size) - var(--n-timeline-line-width)) / 2);
  top: calc(var(--n-timeline-dot-size) + var(--n-timeline-dot-border));
  bottom: 0;
  width: var(--n-timeline-line-width);
  background: var(--n-color-border, #e0e0e0);
}
.n-timeline__item--last .n-timeline__tail { display: none; }
.n-timeline__tail--pending {
  background: repeating-linear-gradient(
    to bottom,
    var(--n-color-border, #e0e0e0) 0,
    var(--n-color-border, #e0e0e0) 4px,
    transparent 4px,
    transparent 8px
  );
}

/* Dot */
.n-timeline__dot-wrapper {
  position: absolute;
  left: 0;
  top: calc((1.6em - var(--n-timeline-dot-size)) / 2 + 1px);
  width: var(--n-timeline-dot-size);
  height: var(--n-timeline-dot-size);
  display: flex;
  align-items: center;
  justify-content: center;
}
.n-timeline__dot-wrapper--custom {
  width: auto;
  height: auto;
}
.n-timeline__dot {
  width: var(--n-timeline-dot-size);
  height: var(--n-timeline-dot-size);
  border-radius: 50%;
  border: var(--n-timeline-dot-border) solid var(--n-color-border, #e0e0e0);
  background: var(--n-color-bg, #fff);
  box-sizing: border-box;
}
.n-timeline__dot--pending {
  border-color: var(--n-color-primary, #1677ff);
  animation: n-timeline-pulse 1.2s ease-in-out infinite;
}

/* Dot type colors */
.n-timeline__item--primary .n-timeline__dot { border-color: var(--n-color-primary, #1677ff); }
.n-timeline__item--success .n-timeline__dot { border-color: var(--n-color-success, #52c41a); background: var(--n-color-success, #52c41a); }
.n-timeline__item--warning .n-timeline__dot { border-color: var(--n-color-warning, #faad14); background: var(--n-color-warning, #faad14); }
.n-timeline__item--danger  .n-timeline__dot { border-color: var(--n-color-danger, #ff4d4f); background: var(--n-color-danger, #ff4d4f); }

/* Icon dot */
.n-timeline__icon-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.n-timeline__item--primary .n-timeline__icon-dot { background: rgba(22, 119, 255, 0.1); }
.n-timeline__item--success .n-timeline__icon-dot { background: rgba(82, 196, 26, 0.1); }
.n-timeline__item--warning .n-timeline__icon-dot { background: rgba(250, 173, 20, 0.1); }
.n-timeline__item--danger  .n-timeline__icon-dot { background: rgba(255, 77, 79, 0.1); }

/* Custom dot */
.n-timeline__custom-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Content */
.n-timeline__content { min-width: 0; }
.n-timeline__title { font-weight: 600; font-size: var(--n-font-size-md, 14px); color: var(--n-color-text, #333); }
.n-timeline__desc { font-size: var(--n-font-size-sm, 13px); color: var(--n-color-text-secondary, #888); margin-top: 2px; }
.n-timeline__time { font-size: var(--n-font-size-xs, 12px); color: var(--n-color-text-disabled, #bbb); margin-top: 2px; }

/* Pending item */
.n-timeline__item--pending .n-timeline__title {
  color: var(--n-color-text-secondary, #888);
  font-style: italic;
}

/* ====== Alternate / Right mode (vertical) ====== */
.n-timeline--alternate,
.n-timeline--right {
  position: relative;
}

.n-timeline--alternate .n-timeline__item,
.n-timeline--right .n-timeline__item {
  padding-left: 0;
  padding-right: 0;
}

/* Center line for alternate & right */
.n-timeline--alternate::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: var(--n-timeline-line-width);
  background: var(--n-color-border, #e0e0e0);
  transform: translateX(-50%);
}
.n-timeline--right::before {
  content: '';
  position: absolute;
  right: calc(var(--n-timeline-dot-size) / 2 + 1px);
  top: 0;
  bottom: 0;
  width: var(--n-timeline-line-width);
  background: var(--n-color-border, #e0e0e0);
}

/* Alternate item base */
.n-timeline--alternate .n-timeline__item {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-bottom: 20px;
  padding-left: 0;
  padding-right: 0;
}
.n-timeline--alternate .n-timeline__label {
  width: calc(50% - 20px);
  font-size: var(--n-font-size-xs, 12px);
  color: var(--n-color-text-disabled, #bbb);
  padding-top: 2px;
  flex-shrink: 0;
  box-sizing: border-box;
}
.n-timeline--alternate .n-timeline__tail {
  display: none;
}
.n-timeline--alternate .n-timeline__dot-wrapper {
  position: relative;
  left: auto;
  top: auto;
  flex-shrink: 0;
  z-index: 1;
}
.n-timeline--alternate .n-timeline__content {
  width: calc(50% - 20px);
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Odd items (1st, 3rd, 5th...): time on left, dot center, content on right */
.n-timeline--alternate .n-timeline__item:nth-child(odd) .n-timeline__label {
  order: 1;
  text-align: right;
  padding-right: 20px;
}
.n-timeline--alternate .n-timeline__item:nth-child(odd) .n-timeline__dot-wrapper {
  order: 2;
}
.n-timeline--alternate .n-timeline__item:nth-child(odd) .n-timeline__content {
  order: 3;
  padding-left: 20px;
}

/* Even items (2nd, 4th, 6th...): content on left, dot center, time on right */
.n-timeline--alternate .n-timeline__item:nth-child(even) .n-timeline__content {
  order: 1;
  text-align: right;
  padding-right: 20px;
}
.n-timeline--alternate .n-timeline__item:nth-child(even) .n-timeline__dot-wrapper {
  order: 2;
}
.n-timeline--alternate .n-timeline__item:nth-child(even) .n-timeline__label {
  order: 3;
  text-align: left;
  padding-left: 20px;
}

/* Right mode */
.n-timeline--right .n-timeline__item {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  padding-left: 0;
}
.n-timeline--right .n-timeline__label {
  width: auto;
  text-align: left;
  padding-left: 20px;
  font-size: var(--n-font-size-xs, 12px);
  color: var(--n-color-text-disabled, #bbb);
  padding-top: 2px;
  flex-shrink: 0;
}
.n-timeline--right .n-timeline__tail { display: none; }
.n-timeline--right .n-timeline__dot-wrapper {
  position: relative;
  left: auto;
  top: auto;
  flex-shrink: 0;
  z-index: 1;
}
.n-timeline--right .n-timeline__content {
  flex: 1;
  text-align: right;
  padding-right: 16px;
}

/* ====== Horizontal ====== */
.n-timeline--horizontal {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}

.n-timeline--horizontal .n-timeline__item {
  padding-left: 0;
  padding-bottom: 0;
  padding-right: 32px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.n-timeline--horizontal .n-timeline__tail {
  left: 0;
  top: calc((var(--n-timeline-dot-size) - var(--n-timeline-line-width)) / 2 + var(--n-timeline-dot-border) / 2);
  bottom: auto;
  width: auto;
  height: var(--n-timeline-line-width);
  right: 0;
}

.n-timeline--horizontal .n-timeline__last .n-timeline__tail::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--n-color-border, #e0e0e0);
}

.n-timeline--horizontal .n-timeline__last .n-timeline__tail {
  display: block;
  width: 24px;
  background: transparent;
}

.n-timeline--horizontal .n-timeline__dot-wrapper {
  position: relative;
  left: auto;
  top: auto;
  margin-bottom: var(--n-timeline-gap);
}

.n-timeline--horizontal .n-timeline__content {
  flex: 1;
}

/* Pulse animation */
@keyframes n-timeline-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
</style>
