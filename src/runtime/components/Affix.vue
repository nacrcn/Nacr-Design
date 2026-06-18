<template>
  <div ref="affixRef" :style="affixStyle">
    <div :class="fixedClass" :style="fixedStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  offsetTop?: number
  offsetBottom?: number
  target?: () => HTMLElement | null | undefined
  zIndex?: number
  disabled?: boolean
}>(), {
  offsetTop: 0,
  offsetBottom: undefined,
  target: undefined,
  zIndex: 100,
  disabled: false,
})

const emit = defineEmits<{
  change: [fixed: boolean]
  scroll: [info: { fixed: boolean; scrollTop: number; affixTop: number }]
}>()

const affixRef = ref<HTMLElement | null>(null)
const fixed = ref(false)
const affixStyle = ref<Record<string, string>>({})
const fixedStyle = ref<Record<string, string>>({})

const fixedClass = computed(() => ({
  'n-affix__fixed': fixed.value,
}))

function getTargetEl(): HTMLElement | Window {
  if (props.disabled) return window
  return props.target?.() ?? window
}

function getTargetRect(): { top: number; bottom: number; height: number } {
  const el = props.target?.()
  if (el) {
    const rect = el.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom, height: rect.height }
  }
  return { top: 0, bottom: window.innerHeight, height: window.innerHeight }
}

function onScroll() {
  if (!affixRef.value || props.disabled) {
    if (fixed.value) {
      fixed.value = false
      affixStyle.value = {}
      fixedStyle.value = {}
      emit('change', false)
    }
    return
  }

  const rect = affixRef.value.getBoundingClientRect()
  const targetRect = getTargetRect()
  const scrollTop = props.target?.()?.scrollTop ?? window.scrollY

  let isFixed = false

  if (props.offsetBottom !== undefined) {
    // 底部固钉：元素底部超出容器可视底部
    isFixed = rect.bottom > targetRect.bottom - props.offsetBottom
  } else {
    // 顶部固钉：元素顶部超出容器可视顶部
    isFixed = rect.top < targetRect.top + props.offsetTop
  }

  if (isFixed !== fixed.value) {
    fixed.value = isFixed
    emit('change', isFixed)
  }

  emit('scroll', {
    fixed: isFixed,
    scrollTop,
    affixTop: rect.top,
  })

  if (isFixed) {
    affixStyle.value = { height: `${rect.height}px` }

    if (props.offsetBottom !== undefined) {
      fixedStyle.value = {
        position: 'fixed',
        bottom: `${props.offsetBottom}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: `${props.zIndex}`,
      }
    } else {
      fixedStyle.value = {
        position: 'fixed',
        top: `${(props.target?.()?.getBoundingClientRect().top ?? 0) + props.offsetTop}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: `${props.zIndex}`,
      }
    }
  } else {
    affixStyle.value = {}
    fixedStyle.value = {}
  }
}

function onResize() {
  // 强制重新计算位置（不触发 change 事件）
  if (!affixRef.value || props.disabled) return
  const prevFixed = fixed.value
  fixed.value = false
  affixStyle.value = {}
  fixedStyle.value = {}
  nextTick(() => {
    onScroll()
    if (fixed.value !== prevFixed) {
      emit('change', fixed.value)
    }
  })
}

let targetEl: HTMLElement | Window = window

onMounted(() => {
  targetEl = getTargetEl()
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  targetEl.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

watch(() => props.disabled, (val) => {
  if (val) {
    fixed.value = false
    affixStyle.value = {}
    fixedStyle.value = {}
    emit('change', false)
  } else {
    nextTick(onScroll)
  }
})

watch(() => props.target, () => {
  targetEl.removeEventListener('scroll', onScroll)
  targetEl = getTargetEl()
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  nextTick(onScroll)
})

watch([() => props.offsetTop, () => props.offsetBottom, () => props.zIndex], () => {
  nextTick(onScroll)
})
</script>

<style scoped>
.n-affix__fixed {
  transition: none;
}
</style>
