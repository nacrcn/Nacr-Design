<template>
  <div class="n-tooltip" ref="tooltipRef" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="handleClick">
    <slot name="trigger" />
    <teleport to="body">
      <div
        v-show="visible"
        ref="panelRef"
        :class="panelClass"
        :style="panelStyle"
        @mouseenter="handlePanelEnter"
        @mouseleave="handlePanelLeave"
      >
        <div v-if="arrow" class="n-tooltip__arrow" :style="arrowStyle" />
        <div class="n-tooltip__content">
          <slot />
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
type Trigger = 'hover' | 'click'

const props = withDefaults(defineProps<{
  placement?: Placement
  trigger?: Trigger
  color?: string
  textColor?: string
  arrow?: boolean
  disabled?: boolean
  showDelay?: number
  hideDelay?: number
  offset?: number
}>(), {
  placement: 'top',
  trigger: 'hover',
  arrow: true,
  disabled: false,
  showDelay: 0,
  hideDelay: 100,
  offset: 8,
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  show: []
  hide: []
}>()

const tooltipRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const panelStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const isHoverTrigger = computed(() => props.trigger === 'hover')

function clearTimers() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function doShow() {
  if (props.disabled) return
  clearTimers()
  showTimer = setTimeout(() => {
    visible.value = true
    emit('show')
    nextTick(() => {
      requestAnimationFrame(updatePos)
    })
  }, props.showDelay)
}

function doHide() {
  clearTimers()
  hideTimer = setTimeout(() => {
    visible.value = false
    emit('hide')
  }, props.hideDelay)
}

function handleMouseEnter() {
  if (!isHoverTrigger.value) return
  doShow()
}

function handleMouseLeave() {
  if (!isHoverTrigger.value) return
  doHide()
}

function handlePanelEnter() {
  if (!isHoverTrigger.value) return
  clearTimers()
}

function handlePanelLeave() {
  if (!isHoverTrigger.value) return
  doHide()
}

function handleClick() {
  if (props.trigger !== 'click') return
  if (visible.value) {
    visible.value = false
    emit('hide')
  } else {
    doShow()
  }
}

function getSide(placement: Placement): string {
  return placement.split('-')[0]
}

function getAlign(placement: Placement): string {
  return placement.split('-')[1] || 'center'
}

function updatePos() {
  if (!tooltipRef.value || !panelRef.value || !visible.value) return

  const trigger = tooltipRef.value.getBoundingClientRect()
  // Force the panel to be visible but transparent for measurement
  const panel = panelRef.value

  // Reset any inline styles temporarily to get natural size
  const prevStyle = panel.style.cssText
  panel.style.cssText = 'position:fixed;visibility:hidden;top:-9999px;left:-9999px;'

  // Force reflow
  void panel.offsetHeight

  const panelRect = panel.getBoundingClientRect()
  const pw = panelRect.width
  const ph = panelRect.height

  // Restore styling
  panel.style.cssText = prevStyle

  const gap = props.offset
  const side = getSide(props.placement)
  const align = getAlign(props.placement)

  let top = 0, left = 0

  // Calculate position based on side
  switch (side) {
    case 'top':
      top = trigger.top - ph - gap
      break
    case 'bottom':
      top = trigger.bottom + gap
      break
    case 'left':
      left = trigger.left - pw - gap
      break
    case 'right':
      left = trigger.right + gap
      break
  }

  // Calculate alignment
  switch (side) {
    case 'top':
    case 'bottom':
      switch (align) {
        case 'start': left = trigger.left; break
        case 'end': left = trigger.right - pw; break
        default: left = trigger.left + (trigger.width - pw) / 2; break
      }
      break
    case 'left':
    case 'right':
      switch (align) {
        case 'start': top = trigger.top; break
        case 'end': top = trigger.bottom - ph; break
        default: top = trigger.top + (trigger.height - ph) / 2; break
      }
      break
  }

  // Build style
  const style: Record<string, string> = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '1060',
  }

  if (props.color) {
    style.background = props.color
  }
  if (props.textColor) {
    style.color = props.textColor
  }

  panelStyle.value = style

  // Arrow position
  if (props.arrow) {
    const arrowSize = 6
    const arrowOffset = Math.min(16, Math.max(8, trigger.width / 2 - 4))
    const aStyle: Record<string, string> = {}

    const arrowColor = props.color || 'rgba(0,0,0,0.75)'

    switch (side) {
      case 'top':
        aStyle.bottom = `-${arrowSize}px`
        aStyle.left = `${pw / 2 - arrowSize}px`
        aStyle.borderTopColor = arrowColor
        break
      case 'bottom':
        aStyle.top = `-${arrowSize}px`
        aStyle.left = `${pw / 2 - arrowSize}px`
        aStyle.borderBottomColor = arrowColor
        break
      case 'left':
        aStyle.right = `-${arrowSize}px`
        aStyle.top = `${ph / 2 - arrowSize}px`
        aStyle.borderLeftColor = arrowColor
        break
      case 'right':
        aStyle.left = `-${arrowSize}px`
        aStyle.top = `${ph / 2 - arrowSize}px`
        aStyle.borderRightColor = arrowColor
        break
    }

    // Adjust arrow for start/end alignment
    if (align === 'start') {
      if (side === 'top' || side === 'bottom') {
        aStyle.left = `${arrowOffset - arrowSize}px`
      } else {
        aStyle.top = `${arrowOffset - arrowSize}px`
      }
    } else if (align === 'end') {
      if (side === 'top' || side === 'bottom') {
        delete aStyle.left
        aStyle.right = `${arrowOffset - arrowSize}px`
      } else {
        delete aStyle.top
        aStyle.bottom = `${arrowOffset - arrowSize}px`
      }
    }

    arrowStyle.value = aStyle
  }
}

const panelClass = computed(() => [
  'n-tooltip__panel',
  `n-tooltip__panel--${getSide(props.placement)}`,
])

// Close on outside click for trigger="click"
function onDocumentClick(e: MouseEvent) {
  if (props.trigger !== 'click') return
  if (!visible.value) return
  const target = e.target as Node
  if (tooltipRef.value?.contains(target) || panelRef.value?.contains(target)) return
  visible.value = false
  emit('hide')
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick)
}

onBeforeUnmount(() => {
  clearTimers()
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick)
  }
})
</script>

<style scoped>
.n-tooltip {
  display: inline-block;
}

.n-tooltip__panel {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 6px 12px;
  border-radius: var(--n-radius-sm, 4px);
  font-size: var(--n-font-size-sm, 13px);
  line-height: 1.5;
  white-space: nowrap;
  pointer-events: auto;
  position: fixed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: n-tooltip-fade-in 0.15s ease;
}

.n-tooltip__content {
  position: relative;
  z-index: 1;
}

/* Arrow */
.n-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* Animation */
@keyframes n-tooltip-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
