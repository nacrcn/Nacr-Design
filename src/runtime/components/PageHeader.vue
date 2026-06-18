<template>
  <div class="n-page-header">
    <div class="n-page-header__main">
      <div v-if="$slots.breadcrumb || breadcrumb" class="n-page-header__breadcrumb">
        <slot name="breadcrumb">
          <NBreadcrumb v-if="breadcrumb" :items="breadcrumb" />
        </slot>
      </div>
      <div class="n-page-header__row">
        <div class="n-page-header__left">
          <span v-if="backArrow" class="n-page-header__back" @click="emit('back')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
          </span>
          <div v-if="icon || $slots.icon" class="n-page-header__icon">
            <slot name="icon">
              <NIcon v-if="icon" :name="icon" size="24" />
            </slot>
          </div>
          <div class="n-page-header__info">
            <h1 class="n-page-header__title">{{ title }}</h1>
            <span v-if="subtitle" class="n-page-header__subtitle">{{ subtitle }}</span>
          </div>
        </div>
        <div v-if="$slots.extra" class="n-page-header__extra">
          <slot name="extra" />
        </div>
      </div>
    </div>
    <div v-if="$slots.default" class="n-page-header__content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="n-page-header__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

withDefaults(defineProps<{
  title: string
  subtitle?: string
  icon?: string
  backArrow?: boolean
  breadcrumb?: BreadcrumbItem[]
}>(), {
  backArrow: false,
})

const emit = defineEmits<{
  back: []
}>()
</script>

<style scoped>
.n-page-header { padding-bottom: 16px; border-bottom: 1px solid var(--n-color-border); }
.n-page-header__breadcrumb { margin-bottom: 8px; }
.n-page-header__row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.n-page-header__left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.n-page-header__back { display: inline-flex; align-items: center; cursor: pointer; color: var(--n-color-text-secondary); transition: color 0.15s; flex-shrink: 0; }
.n-page-header__back:hover { color: var(--n-color-primary); }
.n-page-header__icon { display: flex; align-items: center; color: var(--n-color-primary); flex-shrink: 0; }
.n-page-header__info { min-width: 0; }
.n-page-header__title { font-size: var(--n-font-size-xl); font-weight: 600; color: var(--n-color-text); margin: 0; line-height: 1.4; }
.n-page-header__subtitle { font-size: var(--n-font-size-sm); color: var(--n-color-text-secondary); margin-top: 2px; }
.n-page-header__extra { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.n-page-header__content { margin-top: 16px; }
.n-page-header__footer { margin-top: 16px; }
</style>
