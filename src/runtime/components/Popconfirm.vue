<template>
  <div class="n-popconfirm" ref="popRef">
    <div class="n-popconfirm__trigger" @click="toggle">
      <slot />
    </div>
    <teleport to="body">
      <transition name="n-popconfirm__fade">
        <div v-if="visible" ref="panelRef" class="n-popconfirm__panel" :style="panelStyle">
          <div class="n-popconfirm__arrow" :style="arrowStyle" />
          <div class="n-popconfirm__content">
            <span class="n-popconfirm__icon">
              <NIcon name="tanhao" :size="16" />
            </span>
            <span>{{ content }}</span>
          </div>
          <div class="n-popconfirm__actions">
            <NButton size="sm" variant="secondary" @click="cancel">取消</NButton>
            <NButton size="sm" :variant="danger ? 'danger' : 'primary'" @click="confirm">确定</NButton>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  danger?: boolean
}>(), {
  content: '确定执行此操作？',
  placement: 'top',
  danger: false,
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()
const popRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const panelStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})

function toggle() {
  visible.value = !visible.value
}

function updatePos() {
  if (!popRef.value || !panelRef.value) return
  const trigger = popRef.value.getBoundingClientRect()
  const panel = panelRef.value.getBoundingClientRect()
  const gap = 10
  const arrowSize = 6
  let top = 0, left = 0
  let arrowTop = '', arrowLeft = ''

  switch (props.placement) {
    case 'top':
      top = trigger.top - panel.height - gap
      left = trigger.left + (trigger.width - panel.width) / 2
      arrowTop = `${panel.height}px`
      arrowLeft = `${panel.width / 2 - arrowSize}px`
      break
    case 'bottom':
      top = trigger.bottom + gap
      left = trigger.left + (trigger.width - panel.width) / 2
      arrowTop = `${-arrowSize * 2}px`
      arrowLeft = `${panel.width / 2 - arrowSize}px`
      break
    case 'left':
      top = trigger.top + (trigger.height - panel.height) / 2
      left = trigger.left - panel.width - gap
      arrowTop = `${panel.height / 2 - arrowSize}px`
      arrowLeft = `${panel.width}px`
      break
    case 'right':
      top = trigger.top + (trigger.height - panel.height) / 2
      left = trigger.right + gap
      arrowTop = `${panel.height / 2 - arrowSize}px`
      arrowLeft = `${-arrowSize * 2}px`
      break
  }

  panelStyle.value = { position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: '1060' }

  const arrowBase = {
    position: 'absolute',
    width: '0',
    height: '0',
  }

  switch (props.placement) {
    case 'top':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'bottom':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'left':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderLeft: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'right':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
  }
}

watch(visible, (v) => {
  if (v) nextTick(updatePos)
})

function confirm() {
  visible.value = false
  emit('confirm')
}

function cancel() {
  visible.value = false
  emit('cancel')
}

function onDocClick(e: MouseEvent) {
  if (!visible.value) return
  const target = e.target as Node
  if (popRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  visible.value = false
}

watch(visible, (v) => {
  // Use setTimeout to avoid the same click event that opened the panel
  if (v) setTimeout(() => document.addEventListener('mousedown', onDocClick), 0)
  else document.removeEventListener('mousedown', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick)
})
</script>

<style scoped>
.n-popconfirm { display: inline-block; }
.n-popconfirm__trigger { display: inline-flex; cursor: pointer; }
.n-popconfirm__panel {
  background: var(--n-color-bg-elevated);
  border-radius: var(--n-radius-lg);
  box-shadow: var(--n-shadow-lg);
  padding: 14px 18px;
  min-width: 200px;
}
.n-popconfirm__arrow {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
}
.n-popconfirm__content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--n-font-size-md);
  color: var(--n-color-text);
  line-height: 1.6;
  margin-bottom: 12px;
}
.n-popconfirm__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--n-color-warning);
  margin-top: 2px;
}
.n-popconfirm__actions { display: flex; justify-content: flex-end; gap: 8px; }
.n-popconfirm__fade-enter-active,
.n-popconfirm__fade-leave-active { transition: opacity 0.15s ease; }
.n-popconfirm__fade-enter-from,
.n-popconfirm__fade-leave-to { opacity: 0; }
</style>
