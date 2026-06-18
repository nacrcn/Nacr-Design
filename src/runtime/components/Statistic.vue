<template>
  <div
    :class="[
      'n-statistic',
      `n-statistic--${size}`,
      `n-statistic--${type}`,
      {
        'n-statistic--trend-up': trend === 'up',
        'n-statistic--trend-down': trend === 'down',
        'n-statistic--loading': loading,
      },
    ]"
  >
    <!-- 标签 -->
    <div v-if="label || $slots.label" class="n-statistic__label">
      <slot name="label">{{ label }}</slot>
    </div>

    <!-- 数值区域 -->
    <div class="n-statistic__value">
      <!-- 趋势箭头 -->
      <span v-if="trend === 'up'" class="n-statistic__trend n-statistic__trend--up">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
      </span>
      <span v-if="trend === 'down'" class="n-statistic__trend n-statistic__trend--down">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </span>

      <!-- 前缀 -->
      <span v-if="prefix || $slots.prefix" class="n-statistic__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>

      <!-- 数值 -->
      <span class="n-statistic__number">
        <template v-if="!loading">{{ animationEnabled ? displayValue : formatted }}</template>
        <template v-else>
          <span class="n-statistic__skeleton" />
        </template>
      </span>

      <!-- 后缀 -->
      <span v-if="suffix || $slots.suffix" class="n-statistic__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>

    <!-- 趋势描述文字 -->
    <div v-if="trendText" :class="['n-statistic__trend-text', `n-statistic__trend-text--${trend}`]">
      {{ trendText }}
    </div>

    <!-- 底部额外内容 -->
    <div v-if="$slots.footer" class="n-statistic__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

type StatisticType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type StatisticSize = 'sm' | 'md' | 'lg'
type StatisticTrend = 'up' | 'down' | 'none'

const props = withDefaults(defineProps<{
  label?: string
  value: number
  prefix?: string
  suffix?: string
  precision?: number
  separator?: boolean
  type?: StatisticType
  size?: StatisticSize
  trend?: StatisticTrend
  trendText?: string
  animation?: boolean
  animationDuration?: number
  loading?: boolean
}>(), {
  precision: 0,
  separator: true,
  type: 'default',
  size: 'md',
  trend: 'none',
  animation: false,
  animationDuration: 1000,
  loading: false,
})

function formatNum(val: number): string {
  let v = props.precision > 0 ? val.toFixed(props.precision) : String(Math.round(val))
  if (props.separator) {
    const [int, dec] = v.split('.')
    v = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '')
  }
  return v
}

const formatted = computed(() => formatNum(props.value))

// 数字动画
const displayValue = ref('0')
const animationEnabled = computed(() => props.animation && !props.loading)
let animFrame: number | null = null

function animateValue(from: number, to: number, duration: number) {
  if (animFrame) cancelAnimationFrame(animFrame)
  const start = performance.now()
  const diff = to - from

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // easeOutCubic
    const ease = 1 - Math.pow(1 - progress, 3)
    const current = from + diff * ease
    displayValue.value = formatNum(current)
    if (progress < 1) {
      animFrame = requestAnimationFrame(tick)
    } else {
      displayValue.value = formatNum(to)
      animFrame = null
    }
  }

  animFrame = requestAnimationFrame(tick)
}

watch(() => props.value, (newVal, oldVal) => {
  if (animationEnabled.value) {
    animateValue(oldVal ?? 0, newVal, props.animationDuration)
  }
})

onMounted(() => {
  if (animationEnabled.value) {
    animateValue(0, props.value, props.animationDuration)
  }
})

onBeforeUnmount(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.n-statistic {
  display: inline-flex;
  flex-direction: column;
}

/* ====== Sizes ====== */
.n-statistic--sm .n-statistic__value {
  font-size: 22px;
}

.n-statistic--sm .n-statistic__label {
  font-size: 12px;
}

.n-statistic--sm .n-statistic__prefix,
.n-statistic--sm .n-statistic__suffix {
  font-size: 12px;
}

.n-statistic--md .n-statistic__value {
  font-size: 28px;
}

.n-statistic--lg .n-statistic__value {
  font-size: 36px;
}

.n-statistic--lg .n-statistic__prefix,
.n-statistic--lg .n-statistic__suffix {
  font-size: 17px;
}

/* ====== Types ====== */
.n-statistic--default .n-statistic__value {
  color: var(--n-color-text, #1f2937);
}

.n-statistic--primary .n-statistic__value {
  color: var(--n-color-primary, #1677ff);
}

.n-statistic--primary .n-statistic__label {
  color: var(--n-color-primary, #1677ff);
}

.n-statistic--success .n-statistic__value {
  color: var(--n-color-success, #52c41a);
}

.n-statistic--success .n-statistic__label {
  color: var(--n-color-success, #52c41a);
}

.n-statistic--warning .n-statistic__value {
  color: var(--n-color-warning, #faad14);
}

.n-statistic--warning .n-statistic__label {
  color: var(--n-color-warning, #faad14);
}

.n-statistic--danger .n-statistic__value {
  color: var(--n-color-danger, #ff4d4f);
}

.n-statistic--danger .n-statistic__label {
  color: var(--n-color-danger, #ff4d4f);
}

/* ====== Label ====== */
.n-statistic__label {
  font-size: var(--n-font-size-sm, 13px);
  color: var(--n-color-text-secondary, #6b7280);
  margin-bottom: 4px;
  line-height: 1.5;
}

/* ====== Value ====== */
.n-statistic__value {
  font-size: 28px;
  font-weight: 600;
  color: var(--n-color-text, #1f2937);
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 4px;
  line-height: 1.3;
}

.n-statistic__prefix,
.n-statistic__suffix {
  font-size: var(--n-font-size-md, 14px);
  font-weight: 400;
  opacity: 0.75;
}

.n-statistic__number {
  display: inline-block;
}

/* ====== Trend ====== */
.n-statistic__trend {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.n-statistic__trend svg {
  width: 18px;
  height: 18px;
}

.n-statistic__trend--up {
  color: var(--n-color-success, #52c41a);
}

.n-statistic__trend--down {
  color: var(--n-color-danger, #ff4d4f);
}

.n-statistic--trend-up .n-statistic__value {
  color: var(--n-color-success, #52c41a);
}

.n-statistic--trend-down .n-statistic__value {
  color: var(--n-color-danger, #ff4d4f);
}

.n-statistic__trend-text {
  font-size: var(--n-font-size-xs, 12px);
  margin-top: 4px;
  line-height: 1.5;
}

.n-statistic__trend-text--up {
  color: var(--n-color-success, #52c41a);
}

.n-statistic__trend-text--down {
  color: var(--n-color-danger, #ff4d4f);
}

/* ====== Loading ====== */
.n-statistic--loading .n-statistic__value {
  opacity: 0.6;
}

.n-statistic__skeleton {
  display: inline-block;
  width: 80px;
  height: 28px;
  border-radius: var(--n-radius-sm, 4px);
  background: linear-gradient(
    90deg,
    var(--n-color-fill, #f3f4f6) 25%,
    var(--n-color-fill-hover, #e5e7eb) 37%,
    var(--n-color-fill, #f3f4f6) 63%
  );
  background-size: 200% 100%;
  animation: n-statistic-skeleton 1.4s ease infinite;
  vertical-align: middle;
}

@keyframes n-statistic-skeleton {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ====== Footer ====== */
.n-statistic__footer {
  margin-top: 8px;
  font-size: var(--n-font-size-xs, 12px);
  color: var(--n-color-text-tertiary, #9ca3af);
  line-height: 1.5;
}
</style>
