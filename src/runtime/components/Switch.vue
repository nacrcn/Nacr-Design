<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :class="[
      'n-switch',
      `n-switch--${size}`,
      {
        'n-switch--checked': modelValue,
        'n-switch--disabled': disabled || loading,
        'n-switch--has-text': checkedText || uncheckedText,
      },
    ]"
    :style="switchStyle"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span class="n-switch__thumb">
      <span v-if="loading" class="n-switch__loading" />
    </span>
    <span v-if="modelValue && checkedText" class="n-switch__text n-switch__text--checked">{{ checkedText }}</span>
    <span v-if="!modelValue && uncheckedText" class="n-switch__text n-switch__text--unchecked">{{ uncheckedText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  checkedText?: string
  uncheckedText?: string
  checkedColor?: string
  uncheckedColor?: string
  loading?: boolean
  beforeChange?: (val: boolean) => boolean | Promise<boolean>
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  checkedColor: undefined,
  uncheckedColor: undefined,
  loading: false,
  beforeChange: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  change: [val: boolean]
}>()

const switchStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.modelValue && props.checkedColor) {
    style['--n-switch-color'] = props.checkedColor
    style.background = props.checkedColor
  }
  if (!props.modelValue && props.uncheckedColor) {
    style['--n-switch-color'] = props.uncheckedColor
    style.background = props.uncheckedColor
  }
  return style
})

async function handleClick() {
  if (props.disabled || props.loading) return
  const nextVal = !props.modelValue
  if (props.beforeChange) {
    const allow = await props.beforeChange(nextVal)
    if (!allow) return
  }
  emit('update:modelValue', nextVal)
  emit('change', nextVal)
}
</script>

<style scoped>
.n-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: 100px;
  background: var(--n-color-border-hover);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: middle;
  box-sizing: border-box;
  padding: 0 4px;
  flex-shrink: 0;
}

.n-switch--sm { min-width: 36px; height: 20px; }
.n-switch--md { min-width: 44px; height: 24px; }
.n-switch--lg { min-width: 56px; height: 28px; }

.n-switch--has-text.n-switch--sm { min-width: 46px; }
.n-switch--has-text.n-switch--md { min-width: 56px; }
.n-switch--has-text.n-switch--lg { min-width: 68px; }

.n-switch--checked {
  background: var(--n-color-primary);
}

.n-switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-switch__thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--n-color-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.n-switch--sm .n-switch__thumb { width: 14px; height: 14px; }
.n-switch--lg .n-switch__thumb { width: 22px; height: 22px; }

.n-switch--checked .n-switch__thumb {
  transform: translateX(20px);
}

.n-switch--sm.n-switch--checked .n-switch__thumb { transform: translateX(16px); }
.n-switch--lg.n-switch--checked .n-switch__thumb { transform: translateX(28px); }

.n-switch__loading {
  width: 10px;
  height: 10px;
  border: 1.5px solid var(--n-color-text-disabled);
  border-top-color: var(--n-color-primary);
  border-radius: 50%;
  animation: n-switch-spin 0.6s linear infinite;
}

.n-switch--sm .n-switch__loading { width: 8px; height: 8px; border-width: 1.5px; }
.n-switch--lg .n-switch__loading { width: 14px; height: 14px; }

@keyframes n-switch-spin {
  to { transform: rotate(360deg); }
}

.n-switch__text {
  position: absolute;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
}

.n-switch--sm .n-switch__text { font-size: 10px; }
.n-switch--lg .n-switch__text { font-size: 13px; }

.n-switch__text--checked {
  left: 6px;
  color: #fff;
}

.n-switch__text--unchecked {
  right: 6px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
