<template>
  <div v-if="loading" class="n-skeleton" :style="rootStyle">
    <!-- 圆形骨架 -->
    <template v-if="shape === 'circle'">
      <div :class="rowClass" :style="circleStyle" ></div>
    </template>

    <!-- 单个矩形骨架（头像/按钮/图片等） -->
    <template v-else-if="shape === 'rect'">
      <div :class="rowClass" :style="rectStyle"></div>
    </template>

    <!-- 段落骨架（多行文字） -->
    <template v-else>
      <div v-if="showAvatar" class="n-skeleton__header">
        <div :class="[rowClass, 'n-skeleton__avatar']" :style="avatarStyle"></div>
      </div>
      <div class="n-skeleton__paragraph">
        <div
          v-for="i in rows"
          :key="i"
          :class="rowClass"
          :style="getRowStyle(i)"
        ></div>
      </div>
    </template>
  </div>

  <!-- 加载完成显示真实内容 -->
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  loading?: boolean
  rows?: number
  animated?: boolean
  width?: string | number | Array<string | number>
  height?: number | string
  shape?: 'text' | 'circle' | 'rect'
  size?: 'sm' | 'md' | 'lg' | number
  showAvatar?: boolean
  avatarSize?: number
  round?: boolean
}>(), {
  loading: true,
  rows: 3,
  animated: true,
  height: 16,
  shape: 'text',
  size: 'md',
  showAvatar: false,
  avatarSize: 40,
  round: false,
})

const rowClass = computed(() => ({
  'n-skeleton__row': true,
  'n-skeleton__row--animated': props.animated,
}))

/* ─── 圆形骨架 ─── */
const sizeMap: Record<string, number> = { sm: 32, md: 48, lg: 64 }

const circleSize = computed(() =>
  typeof props.size === 'number' ? props.size : (sizeMap[props.size] ?? 48)
)

const circleStyle = computed(() => ({
  width: `${circleSize.value}px`,
  height: `${circleSize.value}px`,
  borderRadius: '50%',
}))

/* ─── 矩形骨架 ─── */
function toWidthStr(val: string | number | Array<string | number> | undefined, fallback: string): string {
  if (val === undefined) return fallback
  if (typeof val === 'number') return `${val}px`
  if (typeof val === 'string') return val
  return fallback
}

const rectStyle = computed(() => {
  const s = circleSize.value
  return {
    width: toWidthStr(props.width, `${s}px`),
    height: typeof props.height === 'string' ? props.height : `${props.height}px`,
    borderRadius: props.round ? '999px' : '4px',
  }
})

/* ─── 段落行样式 ─── */
function getRowStyle(i: number) {
  let w = '100%'
  if (Array.isArray(props.width)) {
    const val = props.width[i - 1]
    w = typeof val === 'number' ? `${val}px` : (val as string)
  } else if (props.width !== undefined) {
    w = typeof props.width === 'number' ? `${props.width}px` : props.width
  } else if (i === props.rows) {
    w = '60%'
  }

  return {
    width: w,
    height: typeof props.height === 'string' ? props.height : `${props.height}px`,
    borderRadius: props.round ? '999px' : '4px',
  }
}

/* ─── 头像 ─── */
const avatarStyle = computed(() => ({
  width: `${props.avatarSize}px`,
  height: `${props.avatarSize}px`,
  borderRadius: '50%',
}))

/* ─── 根样式 ─── */
const rootStyle = computed(() => ({
  display: props.shape === 'text' ? undefined : 'inline-block',
}))
</script>

<style scoped>
.n-skeleton {
  display: flex;
  gap: 12px;
}

.n-skeleton__row {
  background: var(--n-color-fill-hover);
}

.n-skeleton__row--animated {
  background: linear-gradient(
    90deg,
    var(--n-color-fill-hover) 25%,
    var(--n-color-fill) 50%,
    var(--n-color-fill-hover) 75%
  );
  background-size: 400% 100%;
  animation: n-skeleton-loading 1.4s ease infinite;
}

/* 段落布局 */
.n-skeleton__paragraph {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.n-skeleton__header {
  display: flex;
  align-items: flex-start;
}

.n-skeleton__avatar {
  flex-shrink: 0;
}

@keyframes n-skeleton-loading {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
