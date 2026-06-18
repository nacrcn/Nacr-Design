<template>
  <div :class="['n-steps', `n-steps--${direction}`, `n-steps--${size}`, { 'n-steps--dot': dot }]">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      :class="[
        'n-steps__item',
        `n-steps__item--${getStatus(idx)}`,
        { 'n-steps__item--last': idx === items.length - 1, 'n-steps__item--clickable': item.clickable !== false && clickable },
      ]"
      @click="onStepClick(idx)"
    >
      <div class="n-steps__head">
        <div v-if="idx > 0" class="n-steps__line n-steps__line--left" />
        <div class="n-steps__node">
          <template v-if="!dot">
            <slot :name="`icon-${idx}`" :status="getStatus(idx)">
              <template v-if="getStatus(idx) === 'finish'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg>
              </template>
              <template v-else-if="getStatus(idx) === 'error'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </template>
              <template v-else-if="item.icon">
                <component :is="item.icon" />
              </template>
              <span v-else>{{ idx + 1 }}</span>
            </slot>
          </template>
        </div>
        <div v-if="idx < items.length - 1" class="n-steps__line n-steps__line--right" />
      </div>
      <div class="n-steps__main">
        <div class="n-steps__title">{{ item.title }}</div>
        <div v-if="item.description" class="n-steps__desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface StepItem {
  title: string
  description?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
  icon?: Component
  clickable?: boolean
}

const props = withDefaults(defineProps<{
  items: StepItem[]
  current?: number
  status?: 'process' | 'error' | 'finish'
  direction?: 'horizontal' | 'vertical'
  size?: 'md' | 'sm'
  dot?: boolean
  clickable?: boolean
}>(), {
  current: 0,
  status: 'process',
  direction: 'horizontal',
  size: 'md',
  dot: false,
  clickable: false,
})

const emit = defineEmits<{
  'update:current': [current: number]
  change: [current: number]
}>()

function getStatus(idx: number): string {
  if (props.items[idx]?.status) return props.items[idx].status!
  if (idx < props.current) return 'finish'
  if (idx === props.current) return props.status
  return 'wait'
}

function onStepClick(idx: number) {
  const item = props.items[idx]
  if (item.clickable === false) return
  if (!props.clickable && item.clickable !== true) return
  emit('update:current', idx)
  emit('change', idx)
}
</script>

<style scoped>
.n-steps { display: flex; width: 100%; }
.n-steps--horizontal { flex-direction: row; }
.n-steps--vertical { flex-direction: column; }

/* ── Item ── */
.n-steps__item { position: relative; }
.n-steps--horizontal .n-steps__item { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 0; }
.n-steps--vertical .n-steps__item { display: flex; flex-direction: row; min-height: 72px; padding-bottom: 20px; }
.n-steps--vertical .n-steps__item--last { min-height: auto; padding-bottom: 0; }
.n-steps__item--clickable { cursor: pointer; }

/* ── Head ── */
.n-steps__head { display: flex; align-items: center; justify-content: center; }
.n-steps--horizontal .n-steps__head { width: 100%; }
.n-steps--vertical .n-steps__head { flex-direction: column; flex-shrink: 0; width: 28px; }

/* ── Line ── */
.n-steps__line { flex: 1; height: 2px; background: var(--n-color-border, #e5e7eb); transition: background 0.3s; min-width: 16px; }
.n-steps__item--finish .n-steps__line { background: var(--n-color-primary, #1677ff); }
.n-steps--vertical .n-steps__line { width: 2px; height: auto; min-height: 20px; flex: 1; margin: 4px auto; }
.n-steps__item--finish + .n-steps__item .n-steps__line--left,
.n-steps__item--finish .n-steps__line--right { background: var(--n-color-primary, #1677ff); }

/* ── Node ── */
.n-steps__node {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--n-color-border, #e5e7eb);
  background: var(--n-color-bg, #fff);
  color: var(--n-color-text-secondary, #999);
  font-size: var(--n-font-size-sm, 14px); font-weight: 600;
  flex-shrink: 0; transition: all 0.3s; z-index: 1;
}
.n-steps__item--process .n-steps__node { background: var(--n-color-primary, #1677ff); border-color: var(--n-color-primary, #1677ff); color: #fff; }
.n-steps__item--finish .n-steps__node { background: var(--n-color-primary, #1677ff); border-color: var(--n-color-primary, #1677ff); color: #fff; }
.n-steps__item--error .n-steps__node { background: var(--n-color-danger, #ef4444); border-color: var(--n-color-danger, #ef4444); color: #fff; }

/* ── Dot style ── */
.n-steps--dot .n-steps__node {
  width: 10px; height: 10px; border: none;
  background: var(--n-color-border, #e5e7eb);
}
.n-steps--dot .n-steps__item--process .n-steps__node { background: var(--n-color-primary, #1677ff); }
.n-steps--dot .n-steps__item--finish .n-steps__node { background: var(--n-color-primary, #1677ff); }
.n-steps--dot .n-steps__item--error .n-steps__node { background: var(--n-color-danger, #ef4444); }
.n-steps--dot .n-steps__line { top: 12px; }

/* ── Small ── */
.n-steps--sm .n-steps__node { width: 24px; height: 24px; font-size: var(--n-font-size-xs, 12px); }
.n-steps--sm .n-steps__title { font-size: var(--n-font-size-sm, 14px); }
.n-steps--sm .n-steps__desc { font-size: var(--n-font-size-xs, 12px); }
.n-steps--dot.n-steps--sm .n-steps__node { width: 8px; height: 8px; }

/* ── Main ── */
.n-steps--horizontal .n-steps__main { padding-top: 8px; text-align: center; width: 100%; }
.n-steps--vertical .n-steps__main { padding-left: 12px; flex: 1; padding-top: 2px; }
.n-steps--dot.n-steps--horizontal .n-steps__main { padding-top: 12px; }

/* ── Title ── */
.n-steps__title { font-size: var(--n-font-size-md, 16px); font-weight: 600; color: var(--n-color-text, #1f2937); line-height: 1.4; }
.n-steps__item--wait .n-steps__title { color: var(--n-color-text-secondary, #999); font-weight: 400; }
.n-steps__item--error .n-steps__title { color: var(--n-color-danger, #ef4444); }
.n-steps__item--clickable:hover .n-steps__title { color: var(--n-color-primary, #1677ff); }

/* ── Desc ── */
.n-steps__desc { font-size: var(--n-font-size-sm, 14px); color: var(--n-color-text-secondary, #999); margin-top: 2px; line-height: 1.5; }
</style>
