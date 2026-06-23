<template>
  <teleport to="body">
    <transition name="n-drawer__fade">
      <div v-if="modelValue" class="n-drawer__mask" @click="handleMaskClick" />
    </transition>
    <transition :name="`n-drawer__slide-${placement}`">
      <div v-if="modelValue" :class="['n-drawer', `n-drawer--${placement}`, { 'n-drawer--rounded': rounded }]" :style="drawerStyle">
        <div class="n-drawer__header">
          <span class="n-drawer__title">{{ title }}</span>
          <span class="n-drawer__close" @click="close">×</span>
        </div>
        <div class="n-drawer__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="n-drawer__footer">
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  width?: number | string
  height?: number | string
  maskClosable?: boolean
  rounded?: boolean
  margin?: number | string
  radius?: number | string
}>(), {
  placement: 'right',
  width: 360,
  maskClosable: true,
  rounded: false,
  margin: 10,
  radius: '',
})

const emit = defineEmits<{ 'update:modelValue': [val: boolean]; close: [] }>()

const marginValue = computed(() => typeof props.margin === 'number' ? `${props.margin}px` : props.margin)
const radiusValue = computed(() => {
  if (!props.radius) return 'var(--n-radius-xl, 12px)'
  return typeof props.radius === 'number' ? `${props.radius}px` : props.radius
})

const drawerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.placement === 'left' || props.placement === 'right') {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    if (props.rounded) {
      style.height = `calc(100% - ${marginValue.value} * 2)`
      if (props.placement === 'right') { style.right = marginValue.value; style.top = marginValue.value }
      else { style.left = marginValue.value; style.top = marginValue.value }
      style.borderRadius = radiusValue.value
    }
  } else {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height || '360px'
    if (props.rounded) {
      style.width = `calc(100% - ${marginValue.value} * 2)`
      if (props.placement === 'top') { style.top = marginValue.value; style.left = marginValue.value }
      else { style.bottom = marginValue.value; style.left = marginValue.value }
      style.borderRadius = radiusValue.value
    }
  }
  return style
})

function close() { emit('update:modelValue', false); emit('close') }
function handleMaskClick() { if (props.maskClosable) close() }
</script>

<style scoped>
.n-drawer__mask { position: fixed; inset: 0; z-index: 1090; background: rgba(0,0,0,0.4); }
.n-drawer { position: fixed; z-index: 1100; background: var(--n-color-bg-elevated); display: flex; flex-direction: column; box-shadow: var(--n-shadow-xl); }
.n-drawer--right { top: 0; right: 0; bottom: 0; }
.n-drawer--left { top: 0; left: 0; bottom: 0; }
.n-drawer--top { top: 0; left: 0; right: 0; }
.n-drawer--bottom { bottom: 0; left: 0; right: 0; }
.n-drawer--rounded { overflow: hidden; }
.n-drawer__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--n-color-border); }
.n-drawer__title { font-size: var(--n-font-size-lg); font-weight: 600; color: var(--n-color-text); }
.n-drawer__close { cursor: pointer; font-size: 20px; color: var(--n-color-text-secondary); }
.n-drawer__close:hover { color: var(--n-color-text); }
.n-drawer__body { flex: 1; padding: 20px; overflow: auto; }
.n-drawer__footer { padding: 12px 20px; border-top: 1px solid var(--n-color-border); }
.n-drawer__fade-enter-active, .n-drawer__fade-leave-active { transition: opacity 0.25s; }
.n-drawer__fade-enter-from, .n-drawer__fade-leave-to { opacity: 0; }
.n-drawer__slide-right-enter-active, .n-drawer__slide-right-leave-active,
.n-drawer__slide-left-enter-active, .n-drawer__slide-left-leave-active { transition: transform 0.25s ease; }
.n-drawer__slide-right-enter-from, .n-drawer__slide-right-leave-to { transform: translateX(100%); }
.n-drawer__slide-left-enter-from, .n-drawer__slide-left-leave-to { transform: translateX(-100%); }
.n-drawer__slide-top-enter-active, .n-drawer__slide-top-leave-active,
.n-drawer__slide-bottom-enter-active, .n-drawer__slide-bottom-leave-active { transition: transform 0.25s ease; }
.n-drawer__slide-top-enter-from, .n-drawer__slide-top-leave-to { transform: translateY(-100%); }
.n-drawer__slide-bottom-enter-from, .n-drawer__slide-bottom-leave-to { transform: translateY(100%); }
</style>
