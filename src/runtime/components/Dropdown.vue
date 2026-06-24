<template>
  <div class="n-dropdown" ref="dropdownRef">
    <div class="n-dropdown__trigger" @click="toggle" @mouseenter="onEnter" @mouseleave="onLeave">
      <slot name="trigger" />
    </div>
    <teleport to="body">
      <transition name="n-dropdown__fade">
        <div v-show="visible" ref="panelRef" class="n-dropdown__panel" :style="panelStyle" @mouseenter="onPanelEnter" @mouseleave="onPanelLeave">
          <div class="n-dropdown__menu">
            <template v-for="(item, idx) in items" :key="idx">
              <div v-if="item.divider" class="n-dropdown__divider" />
              <div
                v-else
                :class="['n-dropdown__item', { 'n-dropdown__item--disabled': item.disabled, 'n-dropdown__item--danger': item.danger }]"
                @click="handleClick(item, idx)"
              >
                <NIcon v-if="item.icon" :name="item.icon" class="n-dropdown__item-icon" size="16" />
                <span>{{ item.label }}</span>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref,watch,nextTick,onBeforeUnmount} from 'vue'

interface DropdownItem {
  label?: string
  key?: string | number
  icon?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

const props = withDefaults(defineProps<{
  items: DropdownItem[]
  trigger?: 'hover' | 'click'
  placement?: 'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end'
}>(), {
  trigger: 'hover',
  placement: 'bottom-start',
})

const emit = defineEmits<{
  select: [key: string | number | undefined, item: DropdownItem]
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const panelStyle = ref<Record<string, string>>({})
let timer: ReturnType<typeof setTimeout> | null = null

function toggle() {
  if (props.trigger === 'click') {
    visible.value = !visible.value
    if (visible.value) nextTick(updatePos)
  }
}

function onEnter() {
  if (props.trigger !== 'hover') return
  if (timer) clearTimeout(timer)
  visible.value = true
  nextTick(updatePos)
}

function onLeave() {
  if (props.trigger !== 'hover') return
  timer = setTimeout(() => { visible.value = false }, 150)
}

function onPanelEnter() {
  if (props.trigger !== 'hover') return
  if (timer) clearTimeout(timer)
}

function onPanelLeave() {
  if (props.trigger !== 'hover') return
  timer = setTimeout(() => { visible.value = false }, 150)
}

function updatePos() {
  if (!dropdownRef.value || !panelRef.value) return
  const trigger = dropdownRef.value.getBoundingClientRect()
  const panel = panelRef.value.getBoundingClientRect()
  const gap = 4
  let top = 0, left = 0

  if (props.placement.startsWith('bottom')) {
    top = trigger.bottom + gap
  } else {
    top = trigger.top - panel.height - gap
  }

  if (props.placement.endsWith('start')) {
    left = trigger.left
  } else if (props.placement.endsWith('end')) {
    left = trigger.right - panel.width
  } else {
    left = trigger.left + (trigger.width - panel.width) / 2
  }

  panelStyle.value = { position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: '1050' }
}

function handleClick(item: DropdownItem, idx: number) {
  if (item.disabled) return
  emit('select', item.key ?? idx, item)
  visible.value = false
}

function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value?.contains(e.target as Node) || panelRef.value?.contains(e.target as Node)) return
  visible.value = false
}

watch(visible, (v) => {
  if (v && props.trigger === 'click') {
    nextTick(() => document.addEventListener('click', onClickOutside))
  } else {
    document.removeEventListener('click', onClickOutside)
  }
})

onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.n-dropdown { display: inline-block; }
.n-dropdown__trigger { display: inline-flex; cursor: pointer; }
.n-dropdown__panel { background: var(--n-color-bg-elevated); border-radius: var(--n-radius-lg); box-shadow: var(--n-shadow-lg); padding: 4px 0; min-width: 140px; }
.n-dropdown__menu { }
.n-dropdown__item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: var(--n-font-size-md); color: var(--n-color-text); cursor: pointer; transition: background 0.15s, color 0.15s; white-space: nowrap; }
.n-dropdown__item:hover { background: var(--n-color-fill-hover); }
.n-dropdown__item--disabled { opacity: 0.5; cursor: not-allowed; }
.n-dropdown__item--disabled:hover { background: transparent; }
.n-dropdown__item--danger { color: var(--n-color-danger); }
.n-dropdown__item--danger:hover { background: var(--n-color-danger-light); }
.n-dropdown__item-icon { flex-shrink: 0; }
.n-dropdown__divider { height: 1px; background: var(--n-color-border); margin: 4px 0; }
.n-dropdown__fade-enter-active, .n-dropdown__fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.n-dropdown__fade-enter-from, .n-dropdown__fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
