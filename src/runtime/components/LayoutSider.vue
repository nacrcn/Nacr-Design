<template>
  <aside :class="['n-layout-sider', { 'n-layout-sider--collapsed': collapsed }]" :style="{ width: collapsed ? `${collapsedWidth}px` : `${width}px` }">
    <slot />
    <div v-if="collapsible" class="n-layout-sider__trigger" @click="emit('update:collapsed', !collapsed)">
      {{ collapsed ? '›' : '‹' }}
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  width?: number
  collapsedWidth?: number
  collapsed?: boolean
  collapsible?: boolean
}>(), {
  width: 240,
  collapsedWidth: 64,
  collapsed: false,
  collapsible: false,
})

const emit = defineEmits<{ 'update:collapsed': [val: boolean] }>()
</script>

<style scoped>
.n-layout-sider { flex-shrink: 0; transition: width 0.2s ease; position: relative; }
.n-layout-sider__trigger { position: absolute; bottom: 0; left: 0; right: 0; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-top: 1px solid var(--n-color-border); color: var(--n-color-text-secondary); background: var(--n-color-fill); transition: color 0.2s; }
.n-layout-sider__trigger:hover { color: var(--n-color-primary); }
</style>
