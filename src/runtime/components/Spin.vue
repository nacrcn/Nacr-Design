<template>
  <!-- 全屏模式 -->
  <teleport v-if="fullscreen && spinning" to="body">
    <div class="n-spin--fullscreen">
      <div class="n-spin__wrapper">
        <div class="n-spin__indicator" :style="indicatorStyle">
          <SpinRing v-if="type === 'ring'" :color="computedColor" :size="computedSize" />
          <SpinSpinner v-else-if="type === 'spinner'" :color="computedColor" :size="computedSize" />
          <SpinDot v-else :color="computedColor" :size="computedSize" />
        </div>
        <span v-if="tip" class="n-spin__tip">{{ tip }}</span>
      </div>
    </div>
  </teleport>

  <!-- 包裹模式（有子内容） -->
  <div v-else-if="$slots.default" :class="['n-spin', { 'n-spin--spinning': shouldShow }]" :style="wrapStyle">
    <div v-if="shouldShow" class="n-spin__overlay">
      <div class="n-spin__wrapper">
        <div class="n-spin__indicator" :style="indicatorStyle">
          <SpinRing v-if="type === 'ring'" :color="computedColor" :size="computedSize" />
          <SpinSpinner v-else-if="type === 'spinner'" :color="computedColor" :size="computedSize" />
          <SpinDot v-else :color="computedColor" :size="computedSize" />
        </div>
        <span v-if="tip" class="n-spin__tip">{{ tip }}</span>
      </div>
    </div>
    <div :class="['n-spin__container', { 'n-spin__container--blur': shouldShow }]">
      <slot />
    </div>
  </div>

  <!-- 独立模式（无子内容） -->
  <div v-else class="n-spin__wrapper" :style="wrapStyle">
    <div class="n-spin__indicator" :style="indicatorStyle">
      <SpinRing v-if="type === 'ring'" :color="computedColor" :size="computedSize" />
      <SpinSpinner v-else-if="type === 'spinner'" :color="computedColor" :size="computedSize" />
      <SpinDot v-else :color="computedColor" :size="computedSize" />
    </div>
    <span v-if="tip" class="n-spin__tip">{{ tip }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import SpinDot from '../_internal/spin/SpinDot.vue'
import SpinRing from '../_internal/spin/SpinRing.vue'
import SpinSpinner from '../_internal/spin/SpinSpinner.vue'

const props = withDefaults(defineProps<{
  spinning?: boolean
  size?: 'sm' | 'md' | 'lg' | number
  type?: 'dot' | 'ring' | 'spinner'
  color?: string
  tip?: string
  delay?: number
  fullscreen?: boolean
}>(), {
  spinning: true,
  size: 'md',
  type: 'dot',
  delay: 0,
  fullscreen: false,
})

/* ─── 延迟显示 ─── */
const shouldShow = ref(props.spinning)
let delayTimer: ReturnType<typeof setTimeout> | null = null

function clearDelayTimer() {
  if (delayTimer) { clearTimeout(delayTimer); delayTimer = null }
}

watch(() => props.spinning, (v) => {
  clearDelayTimer()
  if (v) {
    if (props.delay > 0) {
      delayTimer = setTimeout(() => { shouldShow.value = true }, props.delay)
    } else {
      shouldShow.value = true
    }
  } else {
    shouldShow.value = false
  }
}, { immediate: true })

onBeforeUnmount(clearDelayTimer)

/* ─── 尺寸映射 ─── */
const sizeMap: Record<string, number> = { sm: 20, md: 32, lg: 48 }
const computedSize = computed(() =>
  typeof props.size === 'number' ? props.size : (sizeMap[props.size] ?? 32)
)

const computedColor = computed(() => props.color || 'var(--n-color-primary)')

const wrapStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : undefined,
}))

const indicatorStyle = computed(() => ({
  width: `${computedSize.value}px`,
  height: `${computedSize.value}px`,
}))
</script>

<style scoped>
.n-spin { position: relative; display: inline-block; }
.n-spin__container--blur { opacity: 0.35; pointer-events: none; filter: blur(1px); transition: opacity 0.3s; }

.n-spin__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--n-radius-lg);
}

.n-spin__wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.n-spin__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.n-spin__tip {
  font-size: var(--n-font-size-sm);
  color: var(--n-color-text-secondary);
}

/* 全屏 */
.n-spin--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
}
:root.dark .n-spin--fullscreen {
  background: rgba(0, 0, 0, 0.6);
}
</style>
