<template>
  <transition name="n-back-top">
    <div
      v-show="visible"
      class="n-back-top"
      :class="[
        `n-back-top--${type}`,
        `n-back-top--${shape}`,
        { 'n-back-top--custom': $slots.default, 'n-back-top--in-container': hasTarget },
      ]"
      :style="btnStyle"
      @click="scrollToTop"
    >
      <slot>
        <svg v-if="!$slots.default" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  visibilityHeight?: number
  right?: number
  bottom?: number
  target?: () => HTMLElement | null | undefined
  duration?: number
  type?: 'default' | 'primary'
  shape?: 'circle' | 'square'
  size?: number
}>(), {
  visibilityHeight: 400,
  right: 40,
  bottom: 40,
  target: undefined,
  duration: 500,
  type: 'default',
  shape: 'circle',
  size: 40,
})

const emit = defineEmits<{
  click: []
  show: [visible: boolean]
}>()

const visible = ref(false)
let targetEl: HTMLElement | Window = window
const hasTarget = computed(() => !!props.target)

const btnStyle = computed(() => {
  const base: Record<string, string> = {
    right: `${props.right}px`,
    bottom: `${props.bottom}px`,
    width: `${props.size}px`,
    height: `${props.size}px`,
  }
  return base
})

function getScrollElement(): HTMLElement | Window {
  return props.target?.() ?? window
}

function getScrollTop(): number {
  if (targetEl instanceof Window) {
    return window.scrollY
  }
  return (targetEl as HTMLElement).scrollTop
}

function onScroll() {
  visible.value = getScrollTop() >= props.visibilityHeight
}

function scrollToTop() {
  const el = targetEl
  const startTime = performance.now()
  const startTop = getScrollTop()
  const distance = startTop
  const dur = props.duration

  if (dur <= 0) {
    if (el instanceof Window) {
      window.scrollTo(0, 0)
    } else {
      ;(el as HTMLElement).scrollTop = 0
    }
    emit('click')
    return
  }

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / dur, 1)
    // easeInOutCubic
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const newTop = startTop - distance * ease
    if (el instanceof Window) {
      window.scrollTo(0, newTop)
    } else {
      ;(el as HTMLElement).scrollTop = newTop
    }

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
  emit('click')
}

watch(visible, (val) => {
  emit('show', val)
})

watch(() => props.target, () => {
  targetEl.removeEventListener('scroll', onScroll)
  targetEl = getScrollElement()
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onMounted(() => {
  targetEl = getScrollElement()
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // 当有 target 容器时，确保容器有 position: relative
  if (props.target) {
    const el = props.target()
    if (el && getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }
  }
})

onBeforeUnmount(() => {
  targetEl.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.n-back-top {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all var(--n-transition-normal, 0.2s);
}

/* 当有 target 容器时使用 absolute 定位 */
.n-back-top--in-container {
  position: absolute;
}

/* ── Type ── */
.n-back-top--default {
  background: var(--n-color-bg-elevated, #fff);
  box-shadow: var(--n-shadow-md, 0 4px 12px rgba(0,0,0,0.1));
  color: var(--n-color-text-secondary, #666);
}
.n-back-top--default:hover {
  color: var(--n-color-primary, #1677ff);
  box-shadow: var(--n-shadow-lg, 0 8px 24px rgba(0,0,0,0.15));
}

.n-back-top--primary {
  background: var(--n-color-primary, #1677ff);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.35);
  color: #fff;
}
.n-back-top--primary:hover {
  background: var(--n-color-primary-hover, #4096ff);
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.45);
}

/* ── Shape ── */
.n-back-top--circle {
  border-radius: 50%;
}
.n-back-top--square {
  border-radius: var(--n-radius-md, 8px);
}

/* ── Transition ── */
.n-back-top-enter-active,
.n-back-top-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.n-back-top-enter-from,
.n-back-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
