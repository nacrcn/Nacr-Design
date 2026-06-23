<template>
  <div ref="affixRef" :style="wrapperStyle">
    <div :class="innerClass" :style="innerStyle">
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
const wrapperStyle = ref<Record<string, string>>({})
const innerStyle = ref<Record<string, string>>({})

const hasTarget = computed(() => !!props.target)

const innerClass = computed(() => ({
  'n-affix__fixed': fixed.value && !hasTarget.value,
  'n-affix__sticky': fixed.value && hasTarget.value,
}))

function onScroll() {
  if (!affixRef.value || props.disabled) {
    if (fixed.value) {
      fixed.value = false
      wrapperStyle.value = {}
      innerStyle.value = {}
      emit('change', false)
    }
    return
  }

  const affixRect = affixRef.value.getBoundingClientRect()
  const targetEl = props.target?.()
  let isFixed = false
  let scrollTop = 0

  if (targetEl) {
    scrollTop = targetEl.scrollTop

    if (props.offsetBottom !== undefined) {
      isFixed = (targetEl.getBoundingClientRect().bottom - props.offsetBottom) < affixRect.bottom
    } else {
      isFixed = (targetEl.getBoundingClientRect().top + props.offsetTop) > affixRect.top
    }
  } else {
    scrollTop = window.scrollY

    if (props.offsetBottom !== undefined) {
      isFixed = (window.innerHeight - props.offsetBottom) < affixRect.bottom
    } else {
      isFixed = props.offsetTop > affixRect.top
    }
  }

  if (isFixed !== fixed.value) {
    fixed.value = isFixed
    emit('change', isFixed)
  }

  emit('scroll', { fixed: isFixed, scrollTop, affixTop: affixRect.top })

  if (isFixed) {
    if (targetEl) {
      /* ─── 容器内固钉：用 absolute 定位在容器滚动坐标系中 ─── */
      wrapperStyle.value = { height: `${affixRect.height}px` }

      if (props.offsetBottom !== undefined) {
        innerStyle.value = {
          position: 'absolute',
          bottom: `${props.offsetBottom}px`,
          left: '0',
          width: '100%',
          zIndex: `${props.zIndex}`,
        }
      } else {
        innerStyle.value = {
          position: 'absolute',
          top: `${targetEl.scrollTop + props.offsetTop}px`,
          left: '0',
          width: '100%',
          zIndex: `${props.zIndex}`,
        }
      }
    } else {
      /* ─── 视口固钉：用 fixed 定位相对视口 ─── */
      wrapperStyle.value = { height: `${affixRect.height}px` }

      if (props.offsetBottom !== undefined) {
        innerStyle.value = {
          position: 'fixed',
          bottom: `${props.offsetBottom}px`,
          left: `${affixRect.left}px`,
          width: `${affixRect.width}px`,
          zIndex: `${props.zIndex}`,
        }
      } else {
        innerStyle.value = {
          position: 'fixed',
          top: `${props.offsetTop}px`,
          left: `${affixRect.left}px`,
          width: `${affixRect.width}px`,
          zIndex: `${props.zIndex}`,
        }
      }
    }
  } else {
    wrapperStyle.value = {}
    innerStyle.value = {}
  }
}

function onResize() {
  if (!affixRef.value || props.disabled) return
  const prevFixed = fixed.value
  fixed.value = false
  wrapperStyle.value = {}
  innerStyle.value = {}
  nextTick(() => {
    onScroll()
    if (fixed.value !== prevFixed) emit('change', fixed.value)
  })
}

let targetEl: HTMLElement | Window = window

onMounted(() => {
  targetEl = props.target?.() ?? window
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  nextTick(onScroll)
})

onBeforeUnmount(() => {
  targetEl.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

watch(() => props.disabled, (val) => {
  if (val) {
    fixed.value = false
    wrapperStyle.value = {}
    innerStyle.value = {}
    emit('change', false)
  } else {
    nextTick(onScroll)
  }
})

watch(() => props.target, () => {
  targetEl.removeEventListener('scroll', onScroll)
  targetEl = props.target?.() ?? window
  targetEl.addEventListener('scroll', onScroll, { passive: true })
  nextTick(onScroll)
})

watch([() => props.offsetTop, () => props.offsetBottom, () => props.zIndex], () => {
  nextTick(onScroll)
})
</script>

<style scoped>
.n-affix__fixed,
.n-affix__sticky {
  transition: none;
}
</style>
