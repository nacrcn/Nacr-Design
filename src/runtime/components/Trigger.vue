<template>
  <div class="n-trigger" @mouseenter="show" @mouseleave="hide" @click="toggle">
    <slot name="trigger" />
    <transition name="n-trigger__fade">
      <div v-show="visible" class="n-trigger__popup" :class="[`n-trigger__popup--${placement}`]">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  trigger?: 'hover' | 'click'
  placement?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  trigger: 'hover',
  placement: 'bottom',
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show() {
  if (props.trigger !== 'hover') return
  if (timer) clearTimeout(timer)
  visible.value = true
}
function hide() {
  if (props.trigger !== 'hover') return
  timer = setTimeout(() => { visible.value = false }, 100)
}
function toggle() {
  if (props.trigger !== 'click') return
  visible.value = !visible.value
}
</script>

<style scoped>
.n-trigger { position: relative; display: inline-block; }
.n-trigger__popup {
  position: absolute; z-index: 1050;
  background: var(--n-color-bg-elevated);
  border-radius: var(--n-radius-md);
  box-shadow: var(--n-shadow-lg);
  padding: 8px 12px;
  white-space: nowrap;
}
.n-trigger__popup--top { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.n-trigger__popup--bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
.n-trigger__popup--left { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.n-trigger__popup--right { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
.n-trigger__fade-enter-active, .n-trigger__fade-leave-active { transition: opacity 0.15s; }
.n-trigger__fade-enter-from, .n-trigger__fade-leave-to { opacity: 0; }
</style>
