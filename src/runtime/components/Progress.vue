<template>
  <!-- ─── 线形 ─── -->
  <div v-if="type === 'line'" class="n-progress n-progress--line">
    <div class="n-progress__bar" :style="barStyle">
      <div class="n-progress__fill" :class="fillClass" :style="fillStyle">
        <span v-if="showText && textInside" class="n-progress__text-inside">{{ percentFmt }}</span>
      </div>
    </div>
    <span v-if="showText && !textInside" class="n-progress__text" :style="textColorStyle">{{ percentFmt }}</span>
  </div>

  <!-- ─── 环形 ─── -->
  <div v-else-if="type === 'circle'" class="n-progress n-progress--circle" :style="circleWrapStyle">
    <svg class="n-progress__circle" viewBox="0 0 100 100">
      <circle class="n-progress__circle-bg" cx="50" cy="50" :r="circleR" fill="none" :stroke-width="strokeWidth" />
      <circle
        class="n-progress__circle-fill"
        cx="50" cy="50" :r="circleR"
        fill="none"
        :stroke-width="strokeWidth"
        :stroke="circleStroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circleOffset"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="showText" class="n-progress__circle-text" :style="textColorStyle">{{ percentFmt }}</span>
  </div>

  <!-- ─── 仪表盘 ─── -->
  <div v-else-if="type === 'dashboard'" class="n-progress n-progress--dashboard" :style="circleWrapStyle">
    <svg class="n-progress__circle" viewBox="0 0 100 100">
      <circle class="n-progress__circle-bg" cx="50" cy="50" :r="circleR" fill="none" :stroke-width="strokeWidth" :stroke-dasharray="dashCircumference" :stroke-dashoffset="dashBgOffset" />
      <circle
        class="n-progress__circle-fill"
        cx="50" cy="50" :r="circleR"
        fill="none"
        :stroke-width="strokeWidth"
        :stroke="circleStroke"
        :stroke-dasharray="dashCircumference"
        :stroke-dashoffset="dashFillOffset"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="showText" class="n-progress__circle-text" :style="textColorStyle">{{ percentFmt }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percent: number
  type?: 'line' | 'circle' | 'dashboard'
  height?: number
  color?: string
  showText?: boolean
  textInside?: boolean
  status?: 'default' | 'success' | 'warning' | 'error'
  stripe?: boolean
  animated?: boolean
  strokeWidth?: number
  size?: number
  format?: (percent: number) => string
}>(), {
  type: 'line',
  height: 8,
  showText: true,
  textInside: false,
  status: 'default',
  stripe: false,
  animated: false,
  strokeWidth: 6,
  size: 120,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))

const percentFmt = computed(() => {
  if (props.format) return props.format(clamped.value)
  return `${clamped.value}%`
})

/* ─── 状态颜色 ─── */
const statusColor = computed(() => {
  if (props.color) return props.color
  switch (props.status) {
    case 'success': return 'var(--n-color-success)'
    case 'warning': return 'var(--n-color-warning)'
    case 'error':   return 'var(--n-color-danger)'
    default:        return 'var(--n-color-primary)'
  }
})

const textColorStyle = computed(() => {
  if (props.status === 'success') return { color: 'var(--n-color-success)' }
  if (props.status === 'warning') return { color: 'var(--n-color-warning)' }
  if (props.status === 'error')   return { color: 'var(--n-color-danger)' }
  return {}
})

/* ─── 线形 ─── */
const barStyle = computed(() => ({ height: `${props.height}px` }))

const fillClass = computed(() => ({
  'n-progress__fill--stripe': props.stripe,
  'n-progress__fill--animated': props.animated,
}))

const fillStyle = computed(() => ({
  width: `${clamped.value}%`,
  background: statusColor.value,
}))

/* ─── 环形 / 仪表盘 ─── */
const circleWrapStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const circleR = computed(() => 50 - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * circleR.value)
const circleOffset = computed(() => circumference.value * (1 - clamped.value / 100))

const circleStroke = computed(() => statusColor.value)

// 仪表盘：225° 扇区 (总角度 270°)
const dashCircumference = computed(() => (2 * Math.PI * circleR.value * 270) / 360)
const dashBgOffset = computed(() => (2 * Math.PI * circleR.value * 135) / 360 * -1)
const dashFillOffset = computed(() => {
  const total = dashCircumference.value
  return total * (1 - clamped.value / 100)
})
</script>

<style scoped>
/* ─── 线形 ─── */
.n-progress--line {
  display: flex;
  align-items: center;
  gap: 12px;
}
.n-progress__bar {
  flex: 1;
  background: var(--n-color-fill);
  border-radius: var(--n-radius-round);
  overflow: hidden;
}
.n-progress__fill {
  height: 100%;
  border-radius: var(--n-radius-round);
  position: relative;
  transition: width 0.3s ease;
}
.n-progress__text {
  font-size: var(--n-font-size-sm);
  color: var(--n-color-text-secondary);
  flex-shrink: 0;
  min-width: 36px;
  text-align: right;
}
.n-progress__text-inside {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #fff;
}

/* 条纹 */
.n-progress__fill--stripe {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}
.n-progress__fill--animated {
  animation: n-stripe-move 1s linear infinite;
}
@keyframes n-stripe-move {
  from { background-position: 20px 0; }
  to   { background-position: 0 0; }
}

/* ─── 环形 ─── */
.n-progress--circle,
.n-progress--dashboard {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.n-progress__circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.n-progress--dashboard .n-progress__circle {
  transform: rotate(225deg);
}
.n-progress__circle-bg {
  stroke: var(--n-color-fill);
}
.n-progress__circle-fill {
  transition: stroke-dashoffset 0.3s ease;
}
.n-progress__circle-text {
  position: absolute;
  font-size: var(--n-font-size-lg);
  font-weight: 600;
  color: var(--n-color-text);
}
</style>
