<template>
  <div :class="['n-tabs', `n-tabs--${type}`, `n-tabs--${size}`, `n-tabs--${position}`]">
    <!-- Nav wrapper with scroll -->
    <div class="n-tabs__nav-wrapper" ref="navWrapperRef">
      <button
        v-if="showScroll && scrollOffset > 0"
        class="n-tabs__scroll-btn n-tabs__scroll-btn--prev"
        @click="scrollBy(-160)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div class="n-tabs__nav-scroll" ref="navScrollRef" @scroll="onScroll">
        <div class="n-tabs__nav" ref="navRef">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'n-tabs__tab',
              {
                'n-tabs__tab--active': modelValue === tab.key,
                'n-tabs__tab--disabled': tab.disabled,
              },
            ]"
            @click="handleClick(tab)"
          >
            <NIcon v-if="tab.icon" :name="tab.icon" :size="size === 'sm' ? 14 : size === 'lg' ? 18 : 16" class="n-tabs__tab-icon" />
            <span class="n-tabs__tab-label">{{ tab.label }}</span>
            <span v-if="tab.closable !== false && (closable || tab.closable)" class="n-tabs__tab-close" @click.stop="handleClose(tab)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
          </div>

          <!-- Add button -->
          <div v-if="addable" class="n-tabs__tab n-tabs__tab--add" @click="emit('add')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>

          <!-- Line indicator -->
          <div v-if="type === 'line'" class="n-tabs__indicator" :style="indicatorStyle" />
        </div>
      </div>

      <button
        v-if="showScroll && canScrollRight"
        class="n-tabs__scroll-btn n-tabs__scroll-btn--next"
        @click="scrollBy(160)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Panels -->
    <div class="n-tabs__panels">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import NIcon from './Icon.vue'

export interface TabItem {
  key: string
  label: string
  /** iconfont name */
  icon?: string
  disabled?: boolean
  closable?: boolean
}

type TabsType = 'line' | 'card' | 'segment'
type TabsSize = 'sm' | 'md' | 'lg'
type TabsPosition = 'top' | 'right' | 'bottom' | 'left'

const props = withDefaults(defineProps<{
  modelValue: string
  tabs: TabItem[]
  type?: TabsType
  size?: TabsSize
  position?: TabsPosition
  closable?: boolean
  addable?: boolean
  animated?: boolean
}>(), {
  type: 'line',
  size: 'md',
  position: 'top',
  closable: false,
  addable: false,
  animated: true,
})

const emit = defineEmits<{
  'update:modelValue': [key: string]
  'change': [key: string]
  'close': [key: string]
  'add': []
}>()

const navRef = ref<HTMLElement | null>(null)
const navWrapperRef = ref<HTMLElement | null>(null)
const navScrollRef = ref<HTMLElement | null>(null)

// Scroll state
const showScroll = ref(false)
const scrollOffset = ref(0)
const maxScroll = ref(0)

// Indicator
const indicatorStyle = computed(() => {
  if (props.type !== 'line') return {}
  const idx = props.tabs.findIndex(t => t.key === props.modelValue)
  if (idx < 0 || !navRef.value) return { left: '0%', width: '0%' }

  const tabEls = navRef.value.querySelectorAll('.n-tabs__tab:not(.n-tabs__tab--add)')
  if (!tabEls[idx]) return { left: '0%', width: '0%' }

  const tabEl = tabEls[idx] as HTMLElement
  const tabLeft = tabEl.offsetLeft
  const tabWidth = tabEl.offsetWidth

  return {
    left: `${tabLeft}px`,
    width: `${tabWidth}px`,
  }
})

const canScrollRight = computed(() => scrollOffset.value < maxScroll.value)

function handleClick(tab: TabItem) {
  if (tab.disabled) return
  if (props.modelValue === tab.key) return
  emit('update:modelValue', tab.key)
  emit('change', tab.key)
}

function handleClose(tab: TabItem) {
  emit('close', tab.key)
}

function scrollBy(delta: number) {
  if (!navScrollRef.value) return
  navScrollRef.value.scrollLeft += delta
}

function onScroll() {
  if (!navScrollRef.value) return
  scrollOffset.value = navScrollRef.value.scrollLeft
}

function checkScroll() {
  if (!navScrollRef.value || !navWrapperRef.value) return
  const scrollEl = navScrollRef.value
  showScroll.value = scrollEl.scrollWidth > scrollEl.clientWidth + 2
  maxScroll.value = scrollEl.scrollWidth - scrollEl.clientWidth
  scrollOffset.value = scrollEl.scrollLeft
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(checkScroll)
  if (navScrollRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => checkScroll())
    resizeObserver.observe(navScrollRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(() => props.tabs, () => nextTick(checkScroll), { deep: true })
watch(() => props.modelValue, () => {
  nextTick(() => {
    checkScroll()
    scrollToActive()
  })
})

function scrollToActive() {
  if (!navScrollRef.value || !navRef.value) return
  const idx = props.tabs.findIndex(t => t.key === props.modelValue)
  if (idx < 0) return
  const tabEls = navRef.value.querySelectorAll('.n-tabs__tab:not(.n-tabs__tab--add)')
  const tabEl = tabEls[idx] as HTMLElement
  if (!tabEl) return
  const scrollEl = navScrollRef.value
  const tabLeft = tabEl.offsetLeft
  const tabWidth = tabEl.offsetWidth
  const scrollLeft = scrollEl.scrollLeft
  const viewWidth = scrollEl.clientWidth
  if (tabLeft < scrollLeft) {
    scrollEl.scrollLeft = tabLeft - 8
  } else if (tabLeft + tabWidth > scrollLeft + viewWidth) {
    scrollEl.scrollLeft = tabLeft + tabWidth - viewWidth + 8
  }
}
</script>

<style scoped>
.n-tabs {
  --n-tabs-font-size: var(--n-font-size-md, 14px);
  --n-tabs-color: var(--n-color-text, #333);
  --n-tabs-color-secondary: var(--n-color-text-secondary, #888);
  --n-tabs-color-disabled: var(--n-color-text-disabled, #bbb);
  --n-tabs-color-primary: var(--n-color-primary, #1677ff);
  --n-tabs-border: var(--n-color-border, #e0e0e0);
  --n-tabs-bg: var(--n-color-bg, #fff);
  --n-tabs-radius: var(--n-radius, 8px);
  --n-tabs-transition: 0.25s ease;
}

/* Size variants */
.n-tabs--sm { --n-tabs-font-size: var(--n-font-size-sm, 13px); }
.n-tabs--lg { --n-tabs-font-size: var(--n-font-size-lg, 16px); }

/* ====== Nav wrapper ====== */
.n-tabs__nav-wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
}

/* ====== Scroll ====== */
.n-tabs__nav-scroll {
  flex: 1;
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: none;
}
.n-tabs__nav-scroll::-webkit-scrollbar { display: none; }

.n-tabs__scroll-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border: none;
  background: var(--n-tabs-bg);
  color: var(--n-tabs-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}
.n-tabs__scroll-btn:hover { color: var(--n-tabs-color-primary); }
.n-tabs__scroll-btn--prev { box-shadow: inset -6px 0 6px -4px rgba(0,0,0,0.06); }
.n-tabs__scroll-btn--next { box-shadow: inset 6px 0 6px -4px rgba(0,0,0,0.06); }

/* ====== Nav ====== */
.n-tabs__nav {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  white-space: nowrap;
  min-width: 100%;
}

/* ====== Tab ====== */
.n-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: var(--n-tabs-font-size);
  color: var(--n-tabs-color-secondary);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  user-select: none;
  flex-shrink: 0;
  position: relative;
}
.n-tabs__tab:hover { color: var(--n-tabs-color-primary); }
.n-tabs__tab--active { color: var(--n-tabs-color-primary); font-weight: 600; }
.n-tabs__tab--disabled { color: var(--n-tabs-color-disabled); cursor: not-allowed; }
.n-tabs__tab--disabled:hover { color: var(--n-tabs-color-disabled); }

.n-tabs__tab-icon { flex-shrink: 0; }
.n-tabs__tab-label { white-space: nowrap; }

/* Close button */
.n-tabs__tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  border-radius: 50%;
  color: var(--n-tabs-color-disabled);
  transition: all 0.2s;
}
.n-tabs__tab-close:hover {
  color: var(--n-tabs-color);
  background: rgba(0,0,0,0.06);
}
.n-tabs--card .n-tabs__tab-close,
.n-tabs--segment .n-tabs__tab-close {
  margin-left: 4px;
}

/* Add button */
.n-tabs__tab--add {
  padding: 10px 12px;
  color: var(--n-tabs-color-disabled);
}
.n-tabs__tab--add:hover { color: var(--n-tabs-color-primary); }

/* ====== Indicator (line type) ====== */
.n-tabs__indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--n-tabs-color-primary);
  transition: left var(--n-tabs-transition), width var(--n-tabs-transition);
  border-radius: 1px;
}
.n-tabs--sm .n-tabs__indicator { height: 2px; }
.n-tabs--lg .n-tabs__indicator { height: 3px; }

/* ====== Line type ====== */
.n-tabs--line .n-tabs__nav-wrapper {
  border-bottom: 1px solid var(--n-tabs-border);
}

/* ====== Card type ====== */
.n-tabs--card .n-tabs__nav-wrapper {
  border-bottom: 1px solid var(--n-tabs-border);
}
.n-tabs--card .n-tabs__tab {
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--n-tabs-radius) var(--n-tabs-radius) 0 0;
  margin-right: -1px;
  padding: 8px 16px;
}
.n-tabs--card .n-tabs__tab--active {
  background: var(--n-tabs-bg);
  border-color: var(--n-tabs-border);
  color: var(--n-tabs-color-primary);
  position: relative;
}
.n-tabs--card .n-tabs__tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--n-tabs-bg);
}
.n-tabs--card .n-tabs__tab--add {
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--n-tabs-radius) var(--n-tabs-radius) 0 0;
}

/* ====== Segment type ====== */
.n-tabs--segment .n-tabs__nav-wrapper {
  background: rgba(0, 0, 0, 0.04);
  border-radius: var(--n-tabs-radius);
  padding: 3px;
  display: inline-flex;
}
.n-tabs--segment .n-tabs__nav-scroll {
  overflow: visible;
}
.n-tabs--segment .n-tabs__tab {
  padding: 6px 16px;
  border-radius: calc(var(--n-tabs-radius) - 2px);
  z-index: 0;
  transition: color 0.2s, background 0.2s;
}
.n-tabs--segment .n-tabs__tab--active {
  background: var(--n-tabs-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
}
.n-tabs--segment .n-tabs__tab--add {
  border-radius: calc(var(--n-tabs-radius) - 2px);
}

/* ====== Size adjustments ====== */
.n-tabs--sm.n-tabs--line .n-tabs__tab,
.n-tabs--sm.n-tabs--card .n-tabs__tab { padding: 6px 12px; }
.n-tabs--sm.n-tabs--segment .n-tabs__tab { padding: 4px 12px; }

.n-tabs--lg.n-tabs--line .n-tabs__tab,
.n-tabs--lg.n-tabs--card .n-tabs__tab { padding: 14px 20px; }
.n-tabs--lg.n-tabs--segment .n-tabs__tab { padding: 10px 20px; }

/* ====== Panels ====== */
.n-tabs__panels {
  padding: 16px 0;
}

/* ====== Position: left / right ====== */
.n-tabs--left,
.n-tabs--right {
  display: flex;
}
.n-tabs--left .n-tabs__nav-wrapper {
  border-bottom: none;
  border-right: 1px solid var(--n-tabs-border);
  flex-direction: column;
}.n-tabs--left .n-tabs__nav {
  flex-direction: column;
}
.n-tabs--left .n-tabs__tab {
  justify-content: flex-end;
}
.n-tabs--left .n-tabs__indicator {
  bottom: auto;
  right: -1px;
  left: auto;
  top: 0;
  width: 2px;
  height: auto;
}
.n-tabs--left .n-tabs__nav-scroll {
  overflow-x: visible;
  overflow-y: auto;
}
.n-tabs--left .n-tabs__panels {
  flex: 1;
  padding: 0 0 0 16px;
}

.n-tabs--right {
  flex-direction: row-reverse;
}
.n-tabs--right .n-tabs__nav-wrapper {
  border-bottom: none;
  border-left: 1px solid var(--n-tabs-border);
  flex-direction: column;
}
.n-tabs--right .n-tabs__nav {
  flex-direction: column;
}
.n-tabs--right .n-tabs__tab {
  justify-content: flex-start;
}
.n-tabs--right .n-tabs__indicator {
  bottom: auto;
  left: -1px;
  right: auto;
  top: 0;
  width: 2px;
  height: auto;
}
.n-tabs--right .n-tabs__nav-scroll {
  overflow-x: visible;
  overflow-y: auto;
}
.n-tabs--right .n-tabs__panels {
  flex: 1;
  padding: 0 16px 0 0;
}

/* Card & segment left/right overrides */
.n-tabs--left.n-tabs--card .n-tabs__tab,
.n-tabs--right.n-tabs--card .n-tabs__tab {
  border: 1px solid transparent;
  border-right: none;
  border-radius: var(--n-tabs-radius) 0 0 var(--n-tabs-radius);
  margin-bottom: -1px;
  margin-right: 0;
}
.n-tabs--left.n-tabs--card .n-tabs__tab--active::after,
.n-tabs--right.n-tabs--card .n-tabs__tab--active::after {
  bottom: auto;
  right: -1px;
  left: auto;
  top: 0;
  bottom: 0;
  width: 1px;
  height: auto;
}

.n-tabs--left.n-tabs--segment .n-tabs__nav-wrapper,
.n-tabs--right.n-tabs--segment .n-tabs__nav-wrapper {
  display: inline-flex;
  padding: 3px;
}
</style>
