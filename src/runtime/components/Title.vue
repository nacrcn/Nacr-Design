<template>
  <div
    :class="[
      'n-title',
      `n-title--${level}`,
      `n-title--${size}`,
      {
        'n-title--bold': bold,
        'n-title--underline': underline,
        'n-title--italic': italic,
        'n-title--disabled': disabled,
      },
    ]"
  >
    <span v-if="icon || $slots.icon" class="n-title__icon">
      <slot name="icon">
        <NIcon v-if="icon" :name="icon" :size="iconSize" />
      </slot>
    </span>
    <span class="n-title__text">
      <slot>{{ text }}</slot>
    </span>
    <span v-if="sub || $slots.sub" class="n-title__sub">
      <slot name="sub">{{ sub }}</slot>
    </span>
    <div v-if="$slots.extra" class="n-title__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TitleSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  text?: string
  level?: TitleLevel
  size?: TitleSize
  sub?: string
  icon?: string
  bold?: boolean
  underline?: boolean
  italic?: boolean
  disabled?: boolean
}>(), {
  level: 'h3',
  size: 'md',
  bold: true,
})

const iconSize = computed(() => {
  const map: Record<TitleLevel, number> = { h1: 24, h2: 22, h3: 20, h4: 18, h5: 16, h6: 14 }
  return map[props.level]
})
</script>

<style scoped>
.n-title {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
  color: var(--n-color-text, #1f2937);
  margin: 0;
}

/* ====== Levels ====== */
.n-title--h1 .n-title__text { font-size: 24px; }
.n-title--h2 .n-title__text { font-size: 20px; }
.n-title--h3 .n-title__text { font-size: 16px; }
.n-title--h4 .n-title__text { font-size: 14px; }
.n-title--h5 .n-title__text { font-size: 13px; }
.n-title--h6 .n-title__text { font-size: 12px; }

/* ====== Sizes override ====== */
.n-title--sm .n-title__text { font-size: calc(var(--n-font-size-sm, 13px)); }
.n-title--md .n-title__text { font-size: calc(var(--n-font-size-md, 14px)); }
.n-title--lg .n-title__text { font-size: calc(var(--n-font-size-lg, 16px)); }

/* ====== Bold ====== */
.n-title--bold .n-title__text {
  font-weight: 600;
}

/* ====== Underline ====== */
.n-title--underline .n-title__text {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ====== Italic ====== */
.n-title--italic .n-title__text {
  font-style: italic;
}

/* ====== Disabled ====== */
.n-title--disabled {
  color: var(--n-color-text-disabled, #9ca3af);
}

/* ====== Icon ====== */
.n-title__icon {
  display: inline-flex;
  align-items: center;
  color: var(--n-color-primary, #3b82f6);
  flex-shrink: 0;
}

/* ====== Text ====== */
.n-title__text {
  flex-shrink: 0;
}

/* ====== Sub ====== */
.n-title__sub {
  font-size: var(--n-font-size-xs, 12px);
  color: var(--n-color-text-secondary, #6b7280);
  font-weight: 400;
  margin-left: 8px;
}

/* ====== Extra ====== */
.n-title__extra {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
