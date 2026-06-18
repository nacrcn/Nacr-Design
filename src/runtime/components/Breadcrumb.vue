<template>
  <nav class="n-breadcrumb" aria-label="Breadcrumb">
    <ol class="n-breadcrumb__list">
      <li v-for="(item, idx) in items" :key="idx" :class="['n-breadcrumb__item', { 'n-breadcrumb__item--last': idx === items.length - 1 }]">
        <NIcon v-if="item.icon" :name="item.icon" class="n-breadcrumb__icon" size="14" />
        <a v-if="item.href && idx < items.length - 1" :href="item.href" class="n-breadcrumb__link" @click.prevent="emit('select', idx)">{{ item.label }}</a>
        <span v-else class="n-breadcrumb__text">{{ item.label }}</span>
        <span v-if="idx < items.length - 1" class="n-breadcrumb__separator">
          <slot name="separator">/</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<style scoped>
.n-breadcrumb { }
.n-breadcrumb__list { display: flex; align-items: center; flex-wrap: wrap; list-style: none; margin: 0; padding: 0; gap: 0; }
.n-breadcrumb__item { display: inline-flex; align-items: center; font-size: var(--n-font-size-md); color: var(--n-color-text-secondary); }
.n-breadcrumb__icon { margin-right: 4px; }
.n-breadcrumb__link { color: var(--n-color-text-secondary); text-decoration: none; cursor: pointer; transition: color 0.15s; }
.n-breadcrumb__link:hover { color: var(--n-color-primary); }
.n-breadcrumb__text { color: var(--n-color-text); font-weight: 500; }
.n-breadcrumb__item--last .n-breadcrumb__text { color: var(--n-color-text); }
.n-breadcrumb__separator { margin: 0 8px; color: var(--n-color-text-disabled); font-size: var(--n-font-size-sm); user-select: none; }
</style>
