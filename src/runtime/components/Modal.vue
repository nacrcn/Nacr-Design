<template>
  <teleport to="body">
    <transition name="n-modal__fade">
      <div v-if="modelValue" :class="['n-modal__mask', { 'n-modal__mask--center': center }]" @click.self="handleMaskClick">
        <transition name="n-modal__zoom">
          <div
            v-if="modelValue"
            :class="['n-modal', { 'n-modal--card': card }]"
            :style="{ width: typeof width === 'number' ? `${width}px` : width }"
          >
            <!-- Header -->
            <div v-if="title || $slots.header || closable" class="n-modal__header">
              <slot name="header">
                <span class="n-modal__title">
                  <NIcon v-if="presetIcon" :name="presetIcon" size="22" class="n-modal__preset-icon" />
                  {{ title }}
                </span>
              </slot>
              <span v-if="closable" class="n-modal__close" @click="close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
            </div>
            <!-- Body -->
            <div class="n-modal__body">
              <slot />
            </div>
            <!-- Footer -->
            <div v-if="$slots.footer || presetFooter" class="n-modal__footer">
              <slot name="footer">
                <template v-if="presetFooter === 'confirm'">
                  <NButton size="sm" variant="secondary" @click="handleCancel">取消</NButton>
                  <NButton size="sm" :variant="preset === 'danger' ? 'danger' : 'primary'" @click="handleConfirm">确定</NButton>
                </template>
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch, nextTick, computed, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: number | string
  closable?: boolean
  maskClosable?: boolean
  card?: boolean
  center?: boolean
  preset?: 'default' | 'confirm' | 'danger'
}>(), {
  width: 520,
  closable: true,
  maskClosable: true,
  card: true,
  center: true,
  preset: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  close: []
  confirm: []
  cancel: []
  afterEnter: []
}>()

const presetIcon = computed(() => {
  if (props.preset === 'danger') return 'shibai'
  return undefined
})

const presetFooter = computed(() => {
  return props.preset === 'confirm' || props.preset === 'danger' ? 'confirm' : undefined
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleMaskClick() {
  if (props.maskClosable) close()
}

function handleConfirm() {
  emit('confirm')
  close()
}

function handleCancel() {
  emit('cancel')
  close()
}

watch(() => props.modelValue, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) nextTick(() => emit('afterEnter'))
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.n-modal__mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  padding: 24px;
}
.n-modal__mask--center {
  align-items: center;
  justify-content: center;
}
.n-modal {
  background: var(--n-color-bg-elevated);
  border-radius: var(--n-radius-xl);
  box-shadow: var(--n-shadow-xl);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.n-modal--card {
  border: 1px solid var(--n-color-border);
}
.n-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--n-color-border);
}
.n-modal__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--n-font-size-lg);
  font-weight: 600;
  color: var(--n-color-text);
}
.n-modal__preset-icon {
  color: var(--n-color-danger);
}
.n-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: var(--n-radius-sm);
  color: var(--n-color-text-secondary);
  transition: all var(--n-transition-fast);
  flex-shrink: 0;
}
.n-modal__close:hover {
  color: var(--n-color-text);
  background: rgba(0, 0, 0, 0.06);
}
.n-modal__body {
  padding: 24px;
  overflow: auto;
  flex: 1;
  font-size: var(--n-font-size-md);
  color: var(--n-color-text);
  line-height: 1.6;
}
.n-modal__footer {
  padding: 12px 24px;
  border-top: 1px solid var(--n-color-border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.n-modal__fade-enter-active,
.n-modal__fade-leave-active {
  transition: opacity 0.25s ease;
}
.n-modal__fade-enter-from,
.n-modal__fade-leave-to {
  opacity: 0;
}
.n-modal__zoom-enter-active,
.n-modal__zoom-leave-active {
  transition: all 0.25s ease;
}
.n-modal__zoom-enter-from,
.n-modal__zoom-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
