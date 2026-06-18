<template>
  <div :class="emptyClass" :style="emptyStyle">
    <!-- 自定义图片 -->
    <div v-if="image" class="n-empty__image">
      <img v-if="isImageUrl" :src="image" alt="" />
      <component v-else :is="image" />
    </div>

    <!-- 内置类型图标 -->
    <div v-else class="n-empty__icon">
      <svg v-if="type === 'default'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" />
        <circle cx="22" cy="24" r="3" stroke="currentColor" stroke-width="2" />
        <path d="M8 44l16-14 10 10 8-6 14 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else-if="type === 'simple'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" />
        <path d="M24 32h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="type === 'search'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <circle cx="26" cy="26" r="14" stroke="currentColor" stroke-width="2" />
        <path d="M36 36l16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M20 26h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="type === 'error'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2" />
        <path d="M24 24l16 16M40 24l-16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="type === 'network'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="28" r="20" stroke="currentColor" stroke-width="2" />
        <path d="M16 28h32M32 8c-8 8-8 32 0 40M32 8c8 8 8 32 0 40" stroke="currentColor" stroke-width="2" />
        <path d="M12 46l40 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M12 46v6M52 46v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="type === 'cart'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <path d="M8 12h8l8 32h24l8-24H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="28" cy="54" r="4" stroke="currentColor" stroke-width="2" />
        <circle cx="44" cy="54" r="4" stroke="currentColor" stroke-width="2" />
        <path d="M30 28h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else-if="type === 'inbox'" :style="iconStyle" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2" />
        <path d="M8 36h16l4 8h12l4-8h16" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- 描述文字 -->
    <div v-if="description" class="n-empty__desc">{{ description }}</div>

    <!-- 底部插槽 -->
    <div v-if="$slots.default" class="n-empty__footer">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed} from 'vue'
type EmptyType = 'default' | 'simple' | 'search' | 'error' | 'network' | 'cart' | 'inbox'
type EmptySize = 'sm' | 'md' | 'lg'
type IconStyle = Record<string, string>

const props = withDefaults(defineProps<{
  description?: string
  type?: EmptyType
  size?: EmptySize
  image?: string
}>(), {
  type: 'default',
  size: 'md',
})

const emptyClass = computed(() => [
  'n-empty',
  `n-empty--${props.type}`,
  `n-empty--${props.size}`,
])

const emptyStyle = computed(() => ({}) as Record<string, string>)

const isImageUrl = computed(() => {
  if (!props.image) return false
  return typeof props.image === 'string' && (props.image.startsWith('http') || props.image.startsWith('/') || props.image.startsWith('data:'))
})

const iconSizeMap: Record<string, string> = {
  sm: '48px',
  md: '64px',
  lg: '96px',
}

const iconStyle = computed<IconStyle>(() => ({
  width: iconSizeMap[props.size] || '64px',
  height: iconSizeMap[props.size] || '64px',
  color: 'var(--n-color-text-disabled, #c0c0c0)',
}))
</script>

<style scoped>
.n-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  text-align: center;
}

/* 尺寸 */
.n-empty--sm { padding: 20px 0; }
.n-empty--sm .n-empty__desc { font-size: 12px; }
.n-empty--sm .n-empty__footer { margin-top: 8px; }

.n-empty--md { padding: 32px 0; }
.n-empty--md .n-empty__desc { font-size: 14px; }
.n-empty--md .n-empty__footer { margin-top: 12px; }

.n-empty--lg { padding: 48px 0; }
.n-empty--lg .n-empty__desc { font-size: 16px; }
.n-empty--lg .n-empty__footer { margin-top: 16px; }

/* 图标 */
.n-empty__icon {
  margin-bottom: 12px;
  line-height: 0;
}

.n-empty__icon svg {
  display: block;
}

/* 自定义图片 */
.n-empty__image {
  margin-bottom: 12px;
  line-height: 0;
}

.n-empty__image img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* 描述文字 */
.n-empty__desc {
  color: var(--n-color-text-disabled, #c0c0c0);
  line-height: 1.6;
}

/* 底部 */
.n-empty__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 类型颜色变体 */
.n-empty--error .n-empty__icon {
  color: var(--n-color-danger, #ef4444);
}

.n-empty--error .n-empty__desc {
  color: var(--n-color-danger, #ef4444);
}

.n-empty--network .n-empty__icon {
  color: var(--n-color-warning, #f59e0b);
}

.n-empty--network .n-empty__desc {
  color: var(--n-color-text-secondary, #666);
}
</style>
