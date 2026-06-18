<template>
  <div :class="menuClass" :style="menuStyle">
    <!-- Logo slot -->
    <div v-if="$slots.logo" class="n-menu__logo">
      <slot name="logo" :collapsed="collapsed" />
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
                :class="['n-menu__sub-menu', { 'n-menu__sub-menu--open': isOpen(child.key), 'n-menu__sub-menu--horizontal': mode === 'horizontal' }]"
                @mouseenter="mode === 'horizontal' && !collapsed && (hoverKey = child.key)"
                @mouseleave="mode === 'horizontal' && !collapsed && (hoverKey = '')"
              >
                <div class="n-menu__sub-title" :style="subTitleStyle(2)" @click="toggleSubMenu(child)">
                  <NIcon v-if="child.icon" :name="child.icon" class="n-menu__icon" size="16" />
                  <span class="n-menu__label">{{ child.label }}</span>
                  <svg class="n-menu__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
                <transition v-if="mode === 'vertical'" name="n-menu__expand">
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
                <transition v-else name="n-menu__dropdown">
                  <div v-show="hoverKey === child.key" class="n-menu__dropdown" :class="popupClassName">
                    <div
                      v-for="(sub, sidx) in child.children"
                      :key="sidx"
                      :class="dropdownItemClasses(sub)"
                      @click="handleSelect(sub); hoverKey = ''"
                    >
                      <NIcon v-if="sub.icon" :name="sub.icon" class="n-menu__icon" size="16" />
                      <span>{{ sub.label }}</span>
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
              >
                <span v-if="child.icon" class="n-menu__icon-wrapper">
                  <NIcon :name="child.icon" class="n-menu__icon" size="16" />
                </span>
                <span class="n-menu__label">{{ child.label }}</span>
                <span v-if="child.badge" class="n-menu__badge">{{ child.badge }}</span>
                <template v-if="collapsed && child.icon">
                  <div class="n-menu__tooltip">{{ child.label }}</div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <!-- Sub menu -->
        <div
          v-else-if="item.children?.length"
          :class="['n-menu__sub-menu', { 'n-menu__sub-menu--open': isOpen(item.key), 'n-menu__sub-menu--horizontal': mode === 'horizontal' }]"
          @mouseenter="mode === 'horizontal' && !collapsed && (hoverKey = item.key)"
          @mouseleave="mode === 'horizontal' && !collapsed && (hoverKey = '')"
        >
          <div class="n-menu__sub-title" :style="subTitleStyle(1)" @click="toggleSubMenu(item)">
            <NIcon v-if="item.icon" :name="item.icon" class="n-menu__icon" size="16" />
            <span class="n-menu__label">{{ item.label }}</span>
            <svg class="n-menu__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          <!-- Vertical expand -->
          <transition v-if="mode === 'vertical'" name="n-menu__expand">
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

          <!-- Horizontal dropdown -->
          <transition v-else name="n-menu__dropdown">
            <div
              v-show="hoverKey === item.key"
              class="n-menu__dropdown"
              :class="popupClassName"
            >
              <div
                v-for="(child, cidx) in item.children"
                :key="cidx"
                :class="dropdownItemClasses(child)"
                @click="handleSelect(child); hoverKey = ''"
              >
                <NIcon v-if="child.icon" :name="child.icon" class="n-menu__icon" size="16" />
                <span>{{ child.label }}</span>
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
        >
          <span v-if="item.icon" class="n-menu__icon-wrapper">
            <NIcon :name="item.icon" class="n-menu__icon" size="16" />
          </span>
          <span class="n-menu__label">{{ item.label }}</span>
          <span v-if="item.badge" class="n-menu__badge">{{ item.badge }}</span>
          <!-- Collapsed tooltip -->
          <template v-if="collapsed && item.icon">
            <div class="n-menu__tooltip">{{ item.label }}</div>
          </template>
        </div>
      </template>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="n-menu__footer">
      <slot name="footer" :collapsed="collapsed" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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
  collapsed?: boolean
  accordion?: boolean
  defaultOpenKeys?: (string | number)[]
  openKeys?: (string | number)[]
  inlineIndent?: number
  popupClassName?: string
  width?: string | number
}>(), {
  mode: 'vertical',
  theme: 'light',
  collapsed: false,
  accordion: false,
  defaultOpenKeys: () => [],
  inlineIndent: 16,
  popupClassName: '',
  width: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [key: string | number]
  'update:openKeys': [keys: (string | number)[]]
  select: [key: string | number, item: MenuItem]
  openChange: [keys: (string | number)[]]
}>()

const hoverKey = ref<string | number | undefined>('')

// Internal open keys management
const innerOpenKeys = ref<(string | number)[]>([...props.defaultOpenKeys])

const currentOpenKeys = computed(() => {
  return props.openKeys !== undefined ? props.openKeys : innerOpenKeys.value
})

function isOpen(key: string | number | undefined) {
  return key !== undefined && currentOpenKeys.value.includes(key)
}

function toggleSubMenu(item: MenuItem) {
  if (props.mode === 'horizontal') return
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

// Style helpers
function indentLevel(level: number) {
  return props.inlineIndent * level
}

function subTitleStyle(level: number) {
  if (props.mode === 'horizontal' || props.collapsed) return {}
  return { paddingLeft: `${indentLevel(level)}px` }
}

function itemStyle(level: number) {
  if (props.mode === 'horizontal' || props.collapsed) return {}
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

function dropdownItemClasses(item: MenuItem) {
  return [
    'n-menu__dropdown-item',
    {
      'n-menu__dropdown-item--active': props.modelValue === item.key && item.selectable !== false,
      'n-menu__dropdown-item--disabled': item.disabled,
    },
  ]
}

const menuClass = computed(() => [
  'n-menu',
  `n-menu--${props.mode}`,
  `n-menu--${props.theme}`,
  {
    'n-menu--collapsed': props.collapsed,
  },
])

const menuStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width !== undefined) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  return style
})

watch(() => props.defaultOpenKeys, (v) => {
  if (props.openKeys === undefined) {
    innerOpenKeys.value = [...v]
  }
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
.n-menu--dark .n-menu__logo {
  color: rgba(255, 255, 255, 0.95);
}
.n-menu--dark .n-menu__divider {
  background: var(--n-menu-divider-bg);
}
.n-menu--dark .n-menu__group-title {
  color: rgba(255, 255, 255, 0.4);
}
.n-menu--dark .n-menu__item {
  color: var(--n-menu-item-color);
}
.n-menu--dark .n-menu__item:hover {
  background: var(--n-menu-hover-bg);
  color: var(--n-menu-item-hover-color);
}
.n-menu--dark .n-menu__item--active {
  color: var(--n-menu-active-color);
  background: var(--n-menu-active-bg);
}
.n-menu--dark.n-menu--horizontal .n-menu__item--active {
  background: var(--n-menu-active-bg);
}
.n-menu--dark .n-menu__item--active::before {
  background: var(--n-menu-active-color);
}
.n-menu--dark .n-menu__item--disabled,
.n-menu--dark .n-menu__item--disabled:hover {
  color: rgba(255, 255, 255, 0.25);
  background: transparent;
}
.n-menu--dark .n-menu__sub-title {
  color: var(--n-menu-item-color);
}
.n-menu--dark .n-menu__sub-title:hover {
  background: var(--n-menu-hover-bg);
  color: #ffffff;
}
.n-menu--dark .n-menu__arrow {
  color: rgba(255, 255, 255, 0.5);
}
.n-menu--dark .n-menu__badge {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.75);
}
.n-menu--dark .n-menu__dropdown {
  background: #27272a;
  border-color: var(--n-menu-border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1060;
}
.n-menu--dark .n-menu__dropdown-item {
  color: rgba(255, 255, 255, 0.85);
}
.n-menu--dark .n-menu__dropdown-item:hover {
  background: var(--n-menu-hover-bg);
  color: #ffffff;
}
.n-menu--dark .n-menu__dropdown-item--active {
  color: var(--n-menu-active-color);
}
.n-menu--dark .n-menu__dropdown-item--disabled,
.n-menu--dark .n-menu__dropdown-item--disabled:hover {
  color: rgba(255, 255, 255, 0.25);
  background: transparent;
}
.n-menu--dark .n-menu__footer {
  border-top-color: var(--n-menu-border);
}

/* ---- Item with left indicator bar ---- */
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
/* Active left bar indicator */
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
.n-menu__item:hover {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}
.n-menu__item--active {
  color: var(--n-color-primary, #1677ff);
  background: var(--n-color-primary-light, rgba(22, 119, 255, 0.06));
  font-weight: 500;
}
.n-menu__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.n-menu__item--disabled:hover {
  background: transparent;
}

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
.n-menu__item--active .n-menu__icon {
  opacity: 1;
}

/* ---- Label ---- */
.n-menu__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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
.n-menu__sub-title:hover {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}
.n-menu__arrow {
  margin-left: auto;
  transition: transform 0.2s;
  flex-shrink: 0;
  opacity: 0.5;
}
.n-menu__sub-menu--open > .n-menu__sub-title .n-menu__arrow {
  transform: rotate(180deg);
  opacity: 0.8;
}
.n-menu__sub-list {
  padding-left: 16px;
  overflow: hidden;
}

/* ---- Menu Group ---- */
.n-menu__group {
  margin: 4px 0;
}
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
.n-menu__group-list {
  overflow: hidden;
}

/* ---- Divider ---- */
.n-menu__divider {
  height: 1px;
  background: var(--n-color-border, rgba(0, 0, 0, 0.06));
  margin: 6px 12px;
}

/* ---- Collapsed ---- */
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
.n-menu--collapsed .n-menu__group-title { display: none; }
.n-menu--collapsed .n-menu__group-list { display: none; }
.n-menu--collapsed .n-menu__logo { justify-content: center; padding: 12px 0; }

/* ---- Tooltip on collapsed ---- */
.n-menu__tooltip {
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.78);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1050;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.n-menu--collapsed .n-menu__item:hover .n-menu__tooltip {
  display: block;
}

/* ---- Horizontal mode items ---- */
.n-menu--horizontal .n-menu__item {
  padding: 6px 14px;
  margin: 0;
  border-radius: 6px;
  border-bottom: none;
  transition: all 0.2s;
}
.n-menu--horizontal .n-menu__item::before {
  display: none;
}
.n-menu--horizontal .n-menu__item--active {
  background: var(--n-color-primary-light, rgba(22, 119, 255, 0.08));
  border-radius: 6px;
  font-weight: 500;
}
.n-menu--horizontal .n-menu__item:hover:not(.n-menu__item--active) {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}

.n-menu--horizontal .n-menu__sub-menu {
  position: relative;
}
.n-menu--horizontal .n-menu__sub-title {
  padding: 6px 14px;
  margin: 0;
  border-bottom: none;
  border-radius: 6px;
}
.n-menu--horizontal .n-menu__sub-title:hover {
  border-radius: 6px;
}
.n-menu--horizontal .n-menu__arrow {
  margin-left: 4px;
}

/* Horizontal bottom highlight bar */
.n-menu--horizontal::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--n-color-border);
}

/* ---- Dropdown ---- */
.n-menu__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 180px;
  padding: 4px;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 1060;
}
.n-menu__dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  cursor: pointer;
  color: var(--n-color-text);
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  border-radius: 6px;
  font-size: 14px;
  margin: 1px 0;
}
.n-menu__dropdown-item:hover {
  background: var(--n-color-fill-hover, rgba(0, 0, 0, 0.04));
}
.n-menu__dropdown-item--active {
  color: var(--n-color-primary, #1677ff);
  font-weight: 500;
}
.n-menu__dropdown-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.n-menu__dropdown-item--disabled:hover {
  background: transparent;
}

/* ---- Expand animation ---- */
.n-menu__expand-enter-active, .n-menu__expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.n-menu__expand-enter-from, .n-menu__expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.n-menu__expand-enter-to, .n-menu__expand-leave-from {
  max-height: 500px;
}

/* ---- Dropdown animation ---- */
.n-menu__dropdown-enter-active, .n-menu__dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.n-menu__dropdown-enter-from, .n-menu__dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
