<template>
  <teleport to="body">
    <transition name="n-tour__mask-fade">
      <div v-if="open" class="n-tour__overlay" @click="onOverlayClick">
        <!-- 遮罩 - 4块矩形围绕高亮区域 -->
        <div class="n-tour__mask-block n-tour__mask--top" :style="maskTop" />
        <div class="n-tour__mask-block n-tour__mask--bottom" :style="maskBottom" />
        <div class="n-tour__mask-block n-tour__mask--left" :style="maskLeft" />
        <div class="n-tour__mask-block n-tour__mask--right" :style="maskRight" />
      </div>
    </transition>

    <transition name="n-tour__fade">
      <div v-if="open && currentStep" ref="panelRef" :class="['n-tour__panel', `n-tour__panel--${actualPlacement}`]" :style="panelStyle">
        <div class="n-tour__arrow" :style="arrowStyle" />
        <div class="n-tour__header">
          <span class="n-tour__step-indicator">{{ current + 1 }} / {{ steps.length }}</span>
          <button v-if="showClose" class="n-tour__close" @click="onClose">
            <NIcon name="guanbi" size="14" />
          </button>
        </div>
        <div v-if="currentStep.title" class="n-tour__title">{{ currentStep.title }}</div>
        <div class="n-tour__description">
          <slot :name="`step-${current}`" :step="currentStep" :current="current">
            {{ currentStep.description }}
          </slot>
        </div>
        <div class="n-tour__footer">
          <span v-if="steps.length > 1" class="n-tour__dots">
            <span
              v-for="(_, idx) in steps"
              :key="idx"
              :class="['n-tour__dot', { 'n-tour__dot--active': idx === current }]"
            />
          </span>
          <span v-else />
          <span class="n-tour__actions">
            <NButton v-if="current > 0" size="sm" variant="outline" @click="onPrev">
              {{ prevText }}
            </NButton>
            <NButton v-if="current < steps.length - 1" size="sm" type="primary" @click="onNext">
              {{ nextText }}
            </NButton>
            <NButton v-else size="sm" type="primary" @click="onFinish">
              {{ finishText }}
            </NButton>
          </span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export interface TourStep {
  target: string
  title?: string
  description?: string
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
}

const props = withDefaults(defineProps<{
  steps: TourStep[]
  current?: number
  open?: boolean
  placement?: TourStep['placement']
  mask?: boolean
  showClose?: boolean
  closeOnOverlay?: boolean
  scrollIntoView?: boolean
  prevText?: string
  nextText?: string
  finishText?: string
  gap?: number
}>(), {
  current: 0,
  open: false,
  placement: 'bottom',
  mask: true,
  showClose: true,
  closeOnOverlay: true,
  scrollIntoView: true,
  prevText: '上一步',
  nextText: '下一步',
  finishText: '完成',
  gap: 8,
})

const emit = defineEmits<{
  'update:current': [current: number]
  'update:open': [open: boolean]
  'close': [current: number]
  'finish': []
  'change': [current: number]
}>()

const panelRef = ref<HTMLElement | null>(null)
const targetRect = ref<DOMRect | null>(null)
const panelStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
const maskTop = ref<Record<string, string>>({})
const maskBottom = ref<Record<string, string>>({})
const maskLeft = ref<Record<string, string>>({})
const maskRight = ref<Record<string, string>>({})

const current = computed({
  get: () => props.current,
  set: (v) => emit('update:current', v),
})

const currentStep = computed(() => props.steps[current.value] ?? null)
const actualPlacement = computed(() => currentStep.value?.placement ?? props.placement)

function getSide(p: string): string {
  return p.split('-')[0]
}
function getAlign(p: string): string {
  return p.split('-')[1] || 'center'
}

function getTargetEl(): HTMLElement | null {
  if (!currentStep.value?.target) return null
  return document.querySelector(currentStep.value.target)
}

function updateTargetRect() {
  const el = getTargetEl()
  if (el) {
    targetRect.value = el.getBoundingClientRect()
  } else {
    targetRect.value = null
  }
}

function updateMask() {
  if (!props.mask || !targetRect.value) {
    maskTop.value = maskBottom.value = maskLeft.value = maskRight.value = {}
    return
  }
  const r = targetRect.value
  const pad = 4
  maskTop.value = { top: '0', left: '0', right: '0', height: `${Math.max(0, r.top - pad)}px` }
  maskBottom.value = { top: `${r.bottom + pad}px`, left: '0', right: '0', bottom: '0' }
  maskLeft.value = { top: `${Math.max(0, r.top - pad)}px`, left: '0', width: `${Math.max(0, r.left - pad)}px`, height: `${r.height + pad * 2}px` }
  maskRight.value = { top: `${Math.max(0, r.top - pad)}px`, left: `${r.right + pad}px`, right: '0', height: `${r.height + pad * 2}px` }
}

function updatePos() {
  updateTargetRect()
  updateMask()

  if (!targetRect.value) {
    // 没有目标元素时，居中显示
    panelStyle.value = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '1090',
    }
    arrowStyle.value = {}
    return
  }

  if (!panelRef.value) return

  const tr = targetRect.value
  // 先测量面板尺寸
  const panel = panelRef.value
  const prevCSS = panel.style.cssText
  panel.style.cssText = 'position:fixed;visibility:hidden;top:-9999px;left:-9999px;'
  void panel.offsetHeight
  const pr = panel.getBoundingClientRect()
  panel.style.cssText = prevCSS

  const gap = props.gap
  const side = getSide(actualPlacement.value)
  const align = getAlign(actualPlacement.value)

  let top = 0, left = 0

  switch (side) {
    case 'top':
      top = tr.top - pr.height - gap
      break
    case 'bottom':
      top = tr.bottom + gap
      break
    case 'left':
      left = tr.left - pr.width - gap
      break
    case 'right':
      left = tr.right + gap
      break
  }

  switch (side) {
    case 'top':
    case 'bottom':
      switch (align) {
        case 'start': left = tr.left; break
        case 'end': left = tr.right - pr.width; break
        default: left = tr.left + (tr.width - pr.width) / 2; break
      }
      break
    case 'left':
    case 'right':
      switch (align) {
        case 'start': top = tr.top; break
        case 'end': top = tr.bottom - pr.height; break
        default: top = tr.top + (tr.height - pr.height) / 2; break
      }
      break
  }

  panelStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '1090',
  }

  // 箭头
  const arrowSize = 6
  const aStyle: Record<string, string> = {}
  const arrowOffset = Math.min(16, Math.max(8, tr.width / 2 - 4))

  switch (side) {
    case 'top':
      aStyle.bottom = `-${arrowSize}px`
      aStyle.borderTopColor = 'var(--n-color-bg-elevated)'
      if (align === 'start') aStyle.left = `${arrowOffset}px`
      else if (align === 'end') { aStyle.right = `${arrowOffset}px` }
      else aStyle.left = `${pr.width / 2 - arrowSize}px`
      break
    case 'bottom':
      aStyle.top = `-${arrowSize}px`
      aStyle.borderBottomColor = 'var(--n-color-bg-elevated)'
      if (align === 'start') aStyle.left = `${arrowOffset}px`
      else if (align === 'end') { aStyle.right = `${arrowOffset}px` }
      else aStyle.left = `${pr.width / 2 - arrowSize}px`
      break
    case 'left':
      aStyle.right = `-${arrowSize}px`
      aStyle.borderLeftColor = 'var(--n-color-bg-elevated)'
      if (align === 'start') aStyle.top = `${arrowOffset}px`
      else if (align === 'end') { aStyle.bottom = `${arrowOffset}px` }
      else aStyle.top = `${pr.height / 2 - arrowSize}px`
      break
    case 'right':
      aStyle.left = `-${arrowSize}px`
      aStyle.borderRightColor = 'var(--n-color-bg-elevated)'
      if (align === 'start') aStyle.top = `${arrowOffset}px`
      else if (align === 'end') { aStyle.bottom = `${arrowOffset}px` }
      else aStyle.top = `${pr.height / 2 - arrowSize}px`
      break
  }

  arrowStyle.value = aStyle
}

function onPrev() {
  if (current.value > 0) {
    current.value--
    emit('change', current.value)
  }
}

function onNext() {
  if (current.value < props.steps.length - 1) {
    current.value++
    emit('change', current.value)
  }
}

function onFinish() {
  emit('update:open', false)
  emit('finish')
}

function onClose() {
  emit('update:open', false)
  emit('close', current.value)
}

function onOverlayClick() {
  if (props.closeOnOverlay) {
    onClose()
  }
}

function scrollToTarget() {
  const el = getTargetEl()
  if (el && props.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }
}

// 监听步骤变化
watch(current, () => {
  nextTick(() => {
    scrollToTarget()
    // 等滚动完成后再定位
    setTimeout(() => updatePos(), 300)
  })
})

watch(() => props.open, (v) => {
  if (v) {
    nextTick(() => {
      scrollToTarget()
      setTimeout(() => updatePos(), 300)
    })
  }
})

function onScroll() {
  if (props.open) updatePos()
}

function onResize() {
  if (props.open) updatePos()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
})

defineExpose({ updatePos })
</script>

<style scoped>
.n-tour__overlay {
  position: fixed;
  inset: 0;
  z-index: 1080;
  pointer-events: auto;
}

.n-tour__mask-block {
  position: fixed;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.n-tour__panel {
  position: fixed;
  z-index: 1090;
  background: var(--n-color-bg-elevated);
  border-radius: var(--n-radius-xl, 12px);
  box-shadow: var(--n-shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.15));
  padding: 16px 20px;
  width: 380px;
  max-width: 90vw;
  pointer-events: auto;
}

.n-tour__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.n-tour__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.n-tour__step-indicator {
  font-size: 12px;
  color: var(--n-color-text-tertiary, #9ca3af);
  font-weight: 500;
}

.n-tour__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: var(--n-radius-sm, 4px);
  color: var(--n-color-text-tertiary, #9ca3af);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.n-tour__close:hover {
  background: var(--n-color-fill-hover, #f3f4f6);
  color: var(--n-color-text-secondary, #6b7280);
}

.n-tour__title {
  font-size: var(--n-font-size-lg, 16px);
  font-weight: 600;
  color: var(--n-color-text, #1f2937);
  margin-bottom: 6px;
  line-height: 1.4;
}

.n-tour__description {
  font-size: var(--n-font-size-sm, 13px);
  color: var(--n-color-text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 16px;
}

.n-tour__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.n-tour__dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.n-tour__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--n-color-border, #e5e7eb);
  transition: all 0.3s;
}

.n-tour__dot--active {
  background: var(--n-color-primary, #3b82f6);
  width: 16px;
  border-radius: 3px;
}

.n-tour__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 过渡动画 */
.n-tour__fade-enter-active,
.n-tour__fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.n-tour__fade-enter-from,
.n-tour__fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.n-tour__mask-fade-enter-active,
.n-tour__mask-fade-leave-active {
  transition: opacity 0.3s ease;
}

.n-tour__mask-fade-enter-from,
.n-tour__mask-fade-leave-to {
  opacity: 0;
}
</style>
