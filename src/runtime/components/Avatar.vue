<template>
  <span
    :class="[
      'n-avatar',
      `n-avatar--${computedSize}`,
      `n-avatar--${shape}`,
      {
        'n-avatar--bordered': bordered,
        'n-avatar--indicator': showIndicator,
        [`n-avatar--indicator-${indicatorPosition}`]: showIndicator,
      },
    ]"
    :style="avatarStyle"
  >
    <img
      v-if="displaySrc && !imgError"
      :src="displaySrc"
      :alt="alt"
      :style="{ objectFit: fit }"
      class="n-avatar__img"
      @load="handleLoad"
      @error="handleError"
    />
    <span v-else-if="$slots.default" class="n-avatar__text"><slot /></span>
    <span v-else-if="fallbackSrc && imgError" class="n-avatar__fallback-text">?</span>
    <span v-else class="n-avatar__text">{{ initials }}</span>

    <!-- 在线状态指示器 -->
    <span
      v-if="showIndicator"
      :class="['n-avatar__indicator', `n-avatar__indicator--${indicatorStatus}`]"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'

type AvatarShape = 'circle' | 'square' | 'rounded'
type AvatarFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type IndicatorStatus = 'online' | 'offline' | 'busy' | 'away'
type IndicatorPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  shape?: AvatarShape
  round?: boolean
  fit?: AvatarFit
  color?: string
  bordered?: boolean
  fallback?: string
  showIndicator?: boolean
  indicatorStatus?: IndicatorStatus
  indicatorPosition?: IndicatorPosition
}>(), {
  size: 'md',
  shape: 'circle',
  round: true,
  fit: 'cover',
  bordered: false,
  fallback: '',
  showIndicator: false,
  indicatorStatus: 'online',
  indicatorPosition: 'bottom-right',
})

const emit = defineEmits<{
  load: [e: Event]
  error: [e: Event]
}>()

// AvatarGroup 注入
const groupProps = inject<Record<string, any>>('n-avatar-group', {})

const imgError = ref(false)
const loaded = ref(false)

const computedSize = computed(() => {
  if (typeof props.size === 'number') return 'custom'
  return props.size
})

const displaySrc = computed(() => {
  return props.src || ''
})

const fallbackSrc = computed(() => props.fallback || '')

const initials = computed(() => {
  if (!props.alt) return '?'
  const parts = props.alt.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return props.alt.charAt(0).toUpperCase()
})

const sizeMap: Record<string, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
}

const avatarStyle = computed(() => {
  const style: Record<string, string> = {}

  // 尺寸
  const size = groupProps.size ?? props.size
  if (typeof size === 'number') {
    style.width = `${size}px`
    style.height = `${size}px`
    style.fontSize = `${size / 2.5}px`
  } else if (sizeMap[size]) {
    style.width = `${sizeMap[size]}px`
    style.height = `${sizeMap[size]}px`
    style.fontSize = `${sizeMap[size] / 2.5}px`
  }

  // 背景色
  const bgColor = groupProps.color ?? props.color
  if (bgColor) {
    style.background = bgColor
  }

  // 边框
  if (groupProps.bordered ?? props.bordered) {
    style.boxShadow = '0 0 0 2px var(--n-color-bg, #fff)'
  }

  return style
})

function handleLoad(e: Event) {
  imgError.value = false
  loaded.value = true
  emit('load', e)
}

function handleError(e: Event) {
  imgError.value = true
  loaded.value = false
  emit('error', e)
}
</script>

<style scoped>
.n-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--n-color-primary, #1677ff);
  color: var(--n-color-text-inverse, #fff);
  font-weight: 500;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  line-height: 1;
  vertical-align: middle;
}

/* ====== Shapes ====== */
.n-avatar--circle {
  border-radius: 50%;
}

.n-avatar--square {
  border-radius: var(--n-radius-sm, 4px);
}

.n-avatar--rounded {
  border-radius: var(--n-radius-lg, 12px);
}

/* ====== Sizes ====== */
.n-avatar--xs {
  width: 20px;
  height: 20px;
  font-size: 10px;
}

.n-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.n-avatar--md {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.n-avatar--lg {
  width: 56px;
  height: 56px;
  font-size: 22px;
}

.n-avatar--xl {
  width: 72px;
  height: 72px;
  font-size: 28px;
}

/* ====== Image ====== */
.n-avatar__img {
  width: 100%;
  height: 100%;
}

/* ====== Text ====== */
.n-avatar__text {
  line-height: 1;
  user-select: none;
}

/* ====== Bordered ====== */
.n-avatar--bordered {
  box-shadow: 0 0 0 2px var(--n-color-bg, #fff);
}

/* ====== Indicator ====== */
.n-avatar__indicator {
  position: absolute;
  width: 25%;
  height: 25%;
  min-width: 6px;
  min-height: 6px;
  max-width: 14px;
  max-height: 14px;
  border-radius: 50%;
  border: 2px solid var(--n-color-bg, #fff);
  z-index: 1;
}

.n-avatar--indicator-top-right .n-avatar__indicator {
  top: 0;
  right: 0;
  transform: translate(10%, -10%);
}

.n-avatar--indicator-top-left .n-avatar__indicator {
  top: 0;
  left: 0;
  transform: translate(-10%, -10%);
}

.n-avatar--indicator-bottom-right .n-avatar__indicator {
  bottom: 0;
  right: 0;
  transform: translate(10%, 10%);
}

.n-avatar--indicator-bottom-left .n-avatar__indicator {
  bottom: 0;
  left: 0;
  transform: translate(-10%, 10%);
}

.n-avatar__indicator--online {
  background: #52c41a;
}

.n-avatar__indicator--offline {
  background: #d9d9d9;
}

.n-avatar__indicator--busy {
  background: #ff4d4f;
}

.n-avatar__indicator--away {
  background: #faad14;
}
</style>
