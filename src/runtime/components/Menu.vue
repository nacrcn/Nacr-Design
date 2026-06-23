<template>
  <div :class="menuClass" :style="menuStyle" ref="menuRef">
    <!-- Logo slot -->
    <div v-if="$slots.logo" class="n-menu__logo">
      <slot name="logo" :collapsed="isCollapsed" />
    </div>

    <!-- Menu body (scrollable) -->
    <div class="n-menu__body">
      <template v-for="(item, idx) in items" :key="idx">
        <!-- Divider -->
        <div v-if="item.divider" class="n-menu__divider" />

        <!-- Menu Group -->
        <div v-else-if="item.type === 'group'" class="n-menu__group">
          <div v-if="item.label" class="n-menu__group-title" :style="groupTitleStyle">
            <NIcon v-if="item.icon" :name="item.icon" class="n-menu__icon" size="14" />
            <span>{{ item.label }}</span>
          </div>
          <div class="n-menu__group-list">
            <template v-for="(child, cidx) in item.children" :key="cidx">
              <!-- Sub menu inside group -->
              <div
                v-if="child.children?.length"
                :class="['n-menu__sub-menu', { 'n-menu__sub-menu--open': isOpen(child.key) }]"
                @mouseenter="(e) => onMouseEnter(e, child)"
                @mouseleave="onMouseLeave"
              >
                <div class="n-menu__sub-title" :style="subTitleStyle(2)" @click="toggleSubMenu(child)">
                  <span v-if="child.icon" class="n-menu__icon-wrapper">
                    <NIcon :name="child.icon" class="n-menu__icon" size="16" />
                  </span>
                  <span class="n-menu__label">{{ child.label }}</span>
                  <svg class="n-menu__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
                <!-- Vertical expand (not collapsed) -->
                <transition v-if="!isCollapsed" name="n-menu__expand">
                  <div v-show="isOpen(child.key)" class="n-menu__sub-list">
                    <div
                      v-for="(sub, sidx) in child.children"
                      :key="sidx"
                      :class="itemClasses(sub)"
                      :style="itemStyle(3)"
                      @click="handleSelect(sub)"
                    >
                      <NIcon v-if="sub.icon" :name="sub.icon" class="n-menu__icon" size="16" />
                      <span class="n-menu__label">{{ sub.label }}</span>
                      <span v-if="sub.badge" class="n-menu__badge">{{ sub.badge }}</span>
                    </div>
                  </div>
                </transition>
              </div>
              <!-- Item inside group -->
              <div
                v-else
                :class="itemClasses(child)"
                :style="itemStyle(2)"
                @click="handleSelect(child)"
                @mouseenter="(e) => onMouseEnter(e, child)"
                @mouseleave="onMouseLeave"
              >
                <span v-if="child.icon" class="n-menu__icon-wrapper">
                  <NIcon :name="child.icon" class="n-menu__icon" size="16" />
                </span>
                <span class="n-menu__label">{{ child.label }}</span>
                <span v-if="child.badge" class="n-menu__badge">{{ child.badge }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Sub menu -->
        <div
          v-else-if="item.children?.length"
          :class="['n-menu__sub-menu', { 'n-menu__sub-menu--open': isOpen(item.key), 'n-menu__sub-menu--horizontal': mode === 'horizontal' }]"
          @mouseenter="(e) => onMouseEnter(e, item)"
          @mouseleave="onMouseLeave"
        >
          <div class="n-menu__sub-title" :style="subTitleStyle(1)" @click="toggleSubMenu(item)">
            <span v-if="item.icon" class="n-menu__icon-wrapper">
              <NIcon :name="item.icon" class="n-menu__icon" size="16" />
            </span>
            <span class="n-menu__label">{{ item.label }}</span>
            <svg class="n-menu__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          <!-- Vertical expand (not collapsed) -->
          <transition v-if="mode === 'vertical' && !isCollapsed" name="n-menu__expand">
            <div v-show="isOpen(item.key)" class="n-menu__sub-list">
              <div
                v-for="(child, cidx) in item.children"
                :key="cidx"
                :class="itemClasses(child)"
                :style="itemStyle(2)"
                @click="handleSelect(child)"
              >
                <NIcon v-if="child.icon" :name="child.icon" class="n-menu__icon" size="16" />
                <span class="n-menu__label">{{ child.label }}</span>
                <span v-if="child.badge" class="n-menu__badge">{{ child.badge }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- Menu item -->
        <div
          v-else
          :class="itemClasses(item)"
          :style="itemStyle(1)"
          @click="handleSelect(item)"
          @mouseenter="(e) => onMouseEnter(e, item)"
          @mouseleave="onMouseLeave"
        >
          <span v-if="item.icon" class="n-menu__icon-wrapper">
            <NIcon :name="item.icon" class="n-menu__icon" size="16" />
          </span>
          <span class="n-menu__label">{{ item.label }}</span>
          <span v-if="item.badge" class="n-menu__badge">{{ item.badge }}</span>
        </div>
      </template>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="n-menu__footer">
      <slot name="footer" :collapsed="isCollapsed" />
    </div>
  </div>

  <!-- Floating popup / tooltip (teleported to body) -->
  <Teleport to="body">
    <transition name="n-menu__float">
      <div
        v-if="floatVisible"
        :class="floatClass"
        :style="floatStyle"
        @mouseenter="onFloatEnter"
        @mouseleave="onFloatLeave"
      >
        <template v-if="floatItem?.children?.length">
          <div class="n-menu__float-title">{{ floatItem.label }}</div>
          <div
            v-for="(child, cidx) in floatItem.children"
            :key="cidx"
            :class="popupItemClasses(child)"
            @click="handleFloatSelect(child)"
          >
            <NIcon v-if="child.icon" :name="child.icon" class="n-menu__icon" size="16" />
            <span>{{ child.label }}</span>
          </div>
        </template>
        <template v-else-if="floatItem">
          <div class="n-menu__float-tooltip-text">{{ floatItem.label }}</div>
        </template>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export interface MenuItem {
  key?: string | number
  label?: string
  icon?: string
  disabled?: boolean
  divider?: boolean
  selectable?: boolean
  type?: 'group'
  badge?: string | number
  children?: MenuItem[]
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  items: MenuItem[]
  mode?: 'vertical' | 'horizontal'
  theme?: 'light' | 'dark'
  /** 折叠宽度阈值（px），组件实际宽度 <= 此值时自动折叠。默认 64 */
  collapsedWidth?: number
  /** 展开状态的默认宽度（px 或 string）。默认 224 */
  width?: string | number
  accordion?: boolean
  defaultOpenKeys?: (string | number)[]
  openKeys?: (string | number)[]
  inlineIndent?: number
  popupClassName?: string
}>(), {
  mode: 'vertical',
  theme: 'light',
  collapsedWidth: 64,
  width: 224,
  accordion: false,
  defaultOpenKeys: () => [],
  inlineIndent: 16,
  popupClassName: '',
})

const emit = defineEmits<{
  'update:modelValue': [key: string | number]
  'update:openKeys': [keys: (string | number)[]]
  select: [key: string | number, item: MenuItem]
  openChange: [keys: (string | number)[]]
  'update:collapsed': [collapsed: boolean]
}>()

// ---- Auto-detect collapsed from actual width ----
const menuRef = ref<HTMLElement | null>(null)
const isCollapsed = ref(false)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (menuRef.value) {
    checkCollapsed(menuRef.value)
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        checkCollapsed(entry.target as HTMLElement)
      }
    })
    resizeObserver.observe(menuRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (hoverTimer) clearTimeout(hoverTimer)
  floatVisible.value = false
})

function checkCollapsed(el: HTMLElement) {
  const w = el.offsetWidth
  const newCollapsed = props.mode === 'vertical' && w <= props.collapsedWidth
  if (newCollapsed !== isCollapsed.value) {
    isCollapsed.value = newCollapsed
    emit('update:collapsed', newCollapsed)
  }
}

// ---- Open keys ----
const innerOpenKeys = ref<(string | number)[]>([...props.defaultOpenKeys])

const currentOpenKeys = computed(() => {
  return props.openKeys !== undefined ? props.openKeys : innerOpenKeys.value
})

function isOpen(key: string | number | undefined) {
  return key !== undefined && currentOpenKeys.value.includes(key)
}

function toggleSubMenu(item: MenuItem) {
  if (props.mode === 'horizontal') return
  if (isCollapsed.value) return
  const key = item.key!
  let newKeys: (string | number)[]
  if (currentOpenKeys.value.includes(key)) {
    newKeys = currentOpenKeys.value.filter(k => k !== key)
  } else {
    if (props.accordion) {
      newKeys = [key]
    } else {
      newKeys = [...currentOpenKeys.value, key]
    }
  }
  if (props.openKeys === undefined) {
    innerOpenKeys.value = newKeys
  }
  emit('update:openKeys', newKeys)
  emit('openChange', newKeys)
}

function handleSelect(item: MenuItem) {
  if (item.disabled) return
  if (item.selectable === false || item.key === undefined) return
  emit('update:modelValue', item.key)
  emit('select', item.key, item)
}

// ---- Floating popup / tooltip ----
const floatVisible = ref(false)
const floatItem = ref<MenuItem | null>(null)
const floatStyle = ref<Record<string, string>>({})
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let isFloatingHovered = false

const needsFloat = computed(() => isCollapsed.value || props.mode === 'horizontal')

const floatClass = computed(() => [
  'n-menu__float',
  `n-menu__float--${props.theme}`,
  {
    'n-menu__float--popup': !!(floatItem.value?.children?.length),
    'n-menu__float--tooltip': !(floatItem.value?.children?.length),
    'n-menu__float--collapsed': isCollapsed.value,
    'n-menu__float--horizontal': props.mode === 'horizontal',
  },
])

function onMouseEnter(e: MouseEvent, item: MenuItem) {
  if (!needsFloat.value) return
  if (!item.key) return

  if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }

  floatItem.value = item
  floatVisible.value = true

  nextTick(() => {
    const trigger = e.currentTarget as HTMLElement
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const style: Record<string, string> = { position: 'fixed' }

    if (isCollapsed.value && props.mode === 'vertical') {
      style.left = `${rect.right + 8}px`
      style.top = `${rect.top + rect.height / 2}px`
      style.transform = 'translateY(-50%)'
    } else if (props.mode === 'horizontal') {
      style.left = `${rect.left}px`
      style.top = `${rect.bottom + 4}px`
    }
    floatStyle.value = style
  })
}

function onMouseLeave() {
  if (!needsFloat.value) return
  hoverTimer = setTimeout(() => {
    if (!isFloatingHovered) {
      floatVisible.value = false
      floatItem.value = null
    }
  }, 150)
}

function onFloatEnter() {
  isFloatingHovered = true
  if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
}

function onFloatLeave() {
  isFloatingHovered = false
  hoverTimer = setTimeout(() => {
    floatVisible.value = false
    floatItem.value = null
  }, 100)
}

function handleFloatSelect(child: MenuItem) {
  handleSelect(child)
  floatVisible.value = false
  floatItem.value = null
}

function popupItemClasses(item: MenuItem) {
  return [
    'n-menu__float-item',
    {
      'n-menu__float-item--active': props.modelValue === item.key && item.selectable !== false,
      'n-menu__float-item--disabled': item.disabled,
    },
  ]
}

// ---- Style helpers ----
function indentLevel(level: number) {
  return props.inlineIndent * level
}

function subTitleStyle(level: number) {
  if (props.mode === 'horizontal' || isCollapsed.value) return {}
  return { paddingLeft: `${indentLevel(level)}px` }
}

function itemStyle(level: number) {
  if (props.mode === 'horizontal' || isCollapsed.value) return {}
  return { paddingLeft: `${indentLevel(level)}px` }
}

const groupTitleStyle = computed(() => {
  if (props.mode === 'horizontal') return {}
  return { paddingLeft: `${indentLevel(1)}px` }
})

function itemClasses(item: MenuItem) {
  return [
    'n-menu__item',
    {
      'n-menu__item--active': props.modelValue === item.key && item.selectable !== false,
      'n-menu__item--disabled': item.disabled,
    },
  ]
}

const menuClass = computed(() => [
  'n-menu',
  `n-menu--${props.mode}`,
  `n-menu--${props.theme}`,
  { 'n-menu--collapsed': isCollapsed.value },
])

const menuStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.mode === 'horizontal') {
    style.width = '100%'
  } else {
    const w = props.width
    style.width = typeof w === 'number' ? `${w}px` : w
  }
  return style
})

watch(() => props.defaultOpenKeys, (v) => {
  if (props.openKeys === undefined) {
    innerOpenKeys.value = [...v]
  }
})

// When mode changes to horizontal, reset collapsed
watch(() => props.mode, () => {
  if (menuRef.value) checkCollapsed(menuRef.value)
})
</script>

<style scoped>
.n-menu {
  display: flex;
  flex-direction: column;
  font-size: var(--n-font-size-md, 14px);
  list-style: none;
  margin: 0;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  position: relative;
}
.n-menu--horizontal {
  overflow: visible;
}

/* ---- Layout regions ---- */
.n-menu__logo {
  flex-shrink: 0;
  padding: 16px 16px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
}

.n-menu__body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 6px 6px;
}

.n-menu__footer {
  flex-shrink: 0;
  padding: 10px 12px;
  border-top: 1px solid var(--n-color-border);
}

/* ---- Horizontal ---- */
.n-menu--horizontal {
  flex-direction: row;
  align-items: stretch;
  height: auto;
  min-height: 48px;
  border-bottom: 1px solid var(--n-color-border);
}
.n-menu--horizontal .n-menu__body {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  padding: 0 20px;
  overflow: visible;
}
.n-menu--horizontal .n-menu__logo {
  padding: 0 24px 0 20px;
  min-height: auto;
}
.n-menu--horizontal .n-menu__footer {
  border-top: none;
  border-left: 1px solid var(--n-color-border);
  margin-left: auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

/* ---- Themes ---- */
.n-menu--light {
  background: var(--n-color-bg);
  color: var(--n-color-text);
}
.n-menu--dark {
  background: #18181b;
  color: rgba(255, 255, 255, 0.9);
  --n-menu-hover-bg: rgba(255, 255, 255, 0.06);
  --n-menu-active-bg: rgba(255, 255, 255, 0.08);
  --n-menu-active-color: #60a5fa;
  --n-menu-border: rgba(255, 255, 255, 0.1);
  --n-menu-item-color: rgba(255, 255, 255, 0.85);
  --n-menu-item-hover-color: #ffffff;
  --n-menu-divider-bg: rgba(255, 255, 255, 0.08);
}
.n-menu--dark .n-menu__logo { color: rgba(255, 255, 255, 0.95); }
.n-menu--dark .n-menu__divider { background: var(--n-menu-divider-bg); }
.n-menu--dark .n-menu__group-title { color: rgba(255, 255, 255, 0.4); }
.n-menu--dark .n-menu__item { color: var(--n-menu-item-color); }
.n-menu--dark .n-menu__item:hover { background: var(--n-menu-hover-bg); color: var(--n-menu-item-hover-color); }
.n-menu--dark .n-menu__item--active { color: var(--n-menu-active-color); background: var(--n-menu-active-bg); }
.n-menu--dark.n-menu--horizontal .n-menu__item--active { background: var(--n-menu-active-bg); }
.n-menu--dark .n-menu__item--active::before { background: var(--n-menu-active-color); }
.n-menu--dark .n-menu__item--disabled,
.n-menu--dark .n-menu__item--disabled:hover { color: rgba(255, 255, 255, 0.25); background: transparent; }
.n-menu--dark .n-menu__sub-title { color: var(--n-menu-item-color); }
.n-menu--dark .n-menu__sub-title:hover { background: var(--n-menu-hover-bg); color: #ffffff; }
.n-menu--dark .n-menu__arrow { color: rgba(255, 255, 255, 0.5); }
.n-menu--dark .n-menu__badge { background: rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.75); }
.n-menu--dark .n-menu__footer { border-top-color: var(--n-menu-border); }

/* ---- Item ---- */
.n-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  cursor: pointer;
  color: var(--n-color-text);
  border-radius: 6px;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  margin: 1px 0;
  position: relative;
  user-select: none;
  font-size: 14px;
  line-height: 22px;
}
.n-menu__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  min-height: 16px;
  border-radius: 0 3px 3px 0;
  background: var(--n-color-primary, #1677ff);
  transition: height 0.2s, opacity 0.2s;
}
.n-menu__item:hover { background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04)); }
.n-menu__item--active {
  color: var(--n-color-primary, #1677ff);
  background: var(--n-color-primary-light, rgba(22, 119, 255, 0.06));
  font-weight: 500;
}
.n-menu__item--disabled { opacity: 0.4; cursor: not-allowed; }
.n-menu__item--disabled:hover { background: transparent; }

/* ---- Icon ---- */
.n-menu__icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
.n-menu__icon {
  flex-shrink: 0;
  opacity: 0.75;
  transition: opacity 0.15s;
}
.n-menu__item:hover .n-menu__icon,
.n-menu__item--active .n-menu__icon { opacity: 1; }

/* ---- Label ---- */
.n-menu__label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ---- Badge ---- */
.n-menu__badge {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  height: 18px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  border-radius: 9px;
  background: var(--n-color-fill, rgba(0, 0, 0, 0.06));
  color: var(--n-color-text-secondary);
  flex-shrink: 0;
}

/* ---- Sub menu ---- */
.n-menu__sub-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  cursor: pointer;
  color: var(--n-color-text);
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  margin: 1px 0;
  font-size: 14px;
  line-height: 22px;
  user-select: none;
}
.n-menu__sub-title:hover { background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04)); }
.n-menu__arrow { margin-left: auto; transition: transform 0.2s; flex-shrink: 0; opacity: 0.5; }
.n-menu__sub-menu--open > .n-menu__sub-title .n-menu__arrow { transform: rotate(180deg); opacity: 0.8; }
.n-menu__sub-list { padding-left: 16px; overflow: hidden; }

/* ---- Menu Group ---- */
.n-menu__group { margin: 4px 0; }
.n-menu__group-title {
  padding: 10px 12px 4px;
  font-size: 11px;
  color: var(--n-color-text-secondary, #999);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.n-menu__group-list { overflow: hidden; }

/* ---- Divider ---- */
.n-menu__divider { height: 1px; background: var(--n-color-border, rgba(0, 0, 0, 0.06)); margin: 6px 12px; }

/* ---- Collapsed (auto-detected) ---- */
.n-menu--collapsed .n-menu__label { display: none; }
.n-menu--collapsed .n-menu__arrow { display: none; }
.n-menu--collapsed .n-menu__badge { display: none; }
.n-menu--collapsed .n-menu__item,
.n-menu--collapsed .n-menu__sub-title {
  justify-content: center;
  padding: 10px 0;
  position: relative;
  gap: 0;
}
.n-menu--collapsed .n-menu__icon-wrapper { width: auto; height: auto; }
.n-menu--collapsed .n-menu__item::before { display: none; }
.n-menu--collapsed .n-menu__sub-list { display: none; }
.n-menu--collapsed .n-menu__group-title span { display: none; }
.n-menu--collapsed .n-menu__group-list { overflow: visible; }
.n-menu--collapsed .n-menu__logo { justify-content: center; padding: 12px 0; }
.n-menu--collapsed .n-menu__body { overflow: visible; }
.n-menu--collapsed .n-menu__sub-menu { position: relative; }

/* ---- Horizontal mode ---- */
.n-menu--horizontal .n-menu__item {
  padding: 6px 14px;
  margin: 0;
  border-radius: 6px;
  border-bottom: none;
  transition: all 0.2s;
}
.n-menu--horizontal .n-menu__item::before { display: none; }
.n-menu--horizontal .n-menu__item--active {
  background: var(--n-color-primary-light, rgba(22, 119, 255, 0.08));
  border-radius: 6px;
  font-weight: 500;
}
.n-menu--horizontal .n-menu__item:hover:not(.n-menu__item--active) {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}
.n-menu--horizontal .n-menu__sub-menu { position: relative; }
.n-menu--horizontal .n-menu__sub-title {
  padding: 6px 14px;
  margin: 0;
  border-bottom: none;
  border-radius: 6px;
}
.n-menu--horizontal .n-menu__sub-title:hover { border-radius: 6px; }
.n-menu--horizontal .n-menu__arrow { margin-left: 4px; }

.n-menu--horizontal::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--n-color-border);
}

/* ---- Expand animation ---- */
.n-menu__expand-enter-active, .n-menu__expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.n-menu__expand-enter-from, .n-menu__expand-leave-to { opacity: 0; max-height: 0; }
.n-menu__expand-enter-to, .n-menu__expand-leave-from { max-height: 500px; }
</style>

<style>
/* ---- Floating popup / tooltip (NOT scoped, teleported to body) ---- */
.n-menu__float {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  transition: opacity 0.15s, transform 0.15s;
}

.n-menu__float--tooltip {
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.n-menu__float--tooltip.n-menu__float--light {
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
}
.n-menu__float--tooltip.n-menu__float--dark {
  background: rgba(0, 0, 0, 0.9);
  color: rgba(255, 255, 255, 0.95);
}
.n-menu__float-tooltip-text {
  padding: 2px 0;
}

.n-menu__float--popup {
  min-width: 180px;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
}
.n-menu__float--popup.n-menu__float--light {
  background: var(--n-color-bg, #fff);
  border: 1px solid var(--n-color-border, rgba(0, 0, 0, 0.06));
}
.n-menu__float--popup.n-menu__float--dark {
  background: #27272a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.n-menu__float-title {
  padding: 8px 12px 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.n-menu__float--light .n-menu__float-title {
  color: var(--n-color-text-secondary, #999);
}
.n-menu__float--dark .n-menu__float-title {
  color: rgba(255, 255, 255, 0.4);
}

.n-menu__float-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  border-radius: 6px;
  font-size: 14px;
  margin: 1px 0;
}
.n-menu__float--light .n-menu__float-item {
  color: var(--n-color-text, rgba(0, 0, 0, 0.88));
}
.n-menu__float--light .n-menu__float-item:hover {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}
.n-menu__float--light .n-menu__float-item--active {
  color: var(--n-color-primary, #1677ff);
  font-weight: 500;
}
.n-menu__float--dark .n-menu__float-item {
  color: rgba(255, 255, 255, 0.85);
}
.n-menu__float--dark .n-menu__float-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}
.n-menu__float--dark .n-menu__float-item--active {
  color: #60a5fa;
}
.n-menu__float-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.n-menu__float-item--disabled:hover {
  background: transparent;
}

.n-menu__float-enter-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.n-menu__float-leave-active {
  transition: opacity 0.1s ease-in, transform 0.1s ease-in;
}
.n-menu__float-enter-from { opacity: 0; }
.n-menu__float-leave-to { opacity: 0; }

.n-menu__float--collapsed.n-menu__float-enter-from { transform: translateX(-6px) translateY(-50%); }
.n-menu__float--collapsed.n-menu__float-leave-to { transform: translateX(-6px) translateY(-50%); }
.n-menu__float--horizontal.n-menu__float-enter-from { transform: translateY(-6px); }
.n-menu__float--horizontal.n-menu__float-leave-to { transform: translateY(-6px); }

.n-menu__float-item .n-menu__icon { flex-shrink: 0; opacity: 0.75; }
.n-menu__float-item:hover .n-menu__icon { opacity: 1; }
</style>
