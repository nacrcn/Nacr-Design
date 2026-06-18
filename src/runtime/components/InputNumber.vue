<template>
  <div
    :class="[
      'n-input-number',
      `n-input-number--${size}`,
      {
        'n-input-number--disabled': disabled,
        'n-input-number--focused': focused,
        'n-input-number--error': error,
        [`n-input-number--controls-${controlsPosition}`]: controls,
      },
    ]"
  >
    <template v-if="controls && controlsPosition === 'right'">
      <div class="n-input-number__input-wrap">
        <span v-if="$slots.prefix || prefixText" class="n-input-number__prefix">
          <slot name="prefix">{{ prefixText }}</slot>
        </span>
        <input
          ref="inputRef"
          type="text"
          class="n-input-number__input"
          :value="formatDisplay"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
          @keydown="handleKeydown"
        />
        <span v-if="$slots.suffix || suffixText" class="n-input-number__suffix">
          <slot name="suffix">{{ suffixText }}</slot>
        </span>
      </div>
      <div class="n-input-number__controls-vertical">
        <button
          class="n-input-number__btn n-input-number__btn-up"
          :disabled="disabled || isMax"
          @click="increase"
          @mousedown.prevent
        >
          <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 3l4 5H2z"/></svg>
        </button>
        <button
          class="n-input-number__btn n-input-number__btn-down"
          :disabled="disabled || isMin"
          @click="decrease"
          @mousedown.prevent
        >
          <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 9l4-5H2z"/></svg>
        </button>
      </div>
    </template>
    <template v-else>
      <button
        v-if="controls"
        class="n-input-number__btn n-input-number__btn-left"
        :disabled="disabled || isMin"
        @click="decrease"
        @mousedown.prevent
      >
        <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="n-input-number__input-wrap">
        <span v-if="$slots.prefix || prefixText" class="n-input-number__prefix">
          <slot name="prefix">{{ prefixText }}</slot>
        </span>
        <input
          ref="inputRef"
          type="text"
          class="n-input-number__input"
          :value="formatDisplay"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
          @keydown="handleKeydown"
        />
        <span v-if="$slots.suffix || suffixText" class="n-input-number__suffix">
          <slot name="suffix">{{ suffixText }}</slot>
        </span>
      </div>
      <button
        v-if="controls"
        class="n-input-number__btn n-input-number__btn-right"
        :disabled="disabled || isMax"
        @click="increase"
        @mousedown.prevent
      >
        <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  controls?: boolean
  controlsPosition?: 'right' | 'side'
  prefixText?: string
  suffixText?: string
  error?: string
  formatter?: (value: number) => string
  parser?: (value: string) => number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
  disabled: false,
  readonly: false,
  placeholder: '',
  size: 'md',
  controls: true,
  controlsPosition: 'side',
  prefixText: '',
  suffixText: '',
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [val: number]
  change: [val: number]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)

const isMin = computed(() => props.modelValue <= props.min)
const isMax = computed(() => props.modelValue >= props.max)

const formatDisplay = computed(() => {
  if (props.formatter) return props.formatter(props.modelValue)
  if (props.precision !== undefined) return props.modelValue.toFixed(props.precision)
  return String(props.modelValue)
})

function clamp(val: number) {
  return Math.min(props.max, Math.max(props.min, val))
}

function increase() {
  if (props.disabled || props.readonly) return
  const val = clamp(Number((props.modelValue + props.step).toFixed(10)))
  emit('update:modelValue', val)
  emit('change', val)
}

function decrease() {
  if (props.disabled || props.readonly) return
  const val = clamp(Number((props.modelValue - props.step).toFixed(10)))
  emit('update:modelValue', val)
  emit('change', val)
}

function handleInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  if (props.parser) {
    const parsed = props.parser(raw)
    if (!isNaN(parsed)) {
      const val = clamp(parsed)
      emit('update:modelValue', val)
    }
    return
  }
  const num = Number(raw)
  if (!isNaN(num) && raw !== '' && raw !== '-') {
    const val = clamp(num)
    emit('update:modelValue', val)
  }
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    increase()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    decrease()
  } else if (e.key === 'Enter') {
    ;(e.target as HTMLInputElement).blur()
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  inputRef,
})
</script>

<style scoped>
.n-input-number {
  display: inline-flex;
  align-items: stretch;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  border: 1px solid var(--n-color-border-hover);
  background: var(--n-color-bg);
}

.n-input-number--focused {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-input-number--error {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-input-number--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-input-number__input-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

/* ====== Sizes ====== */
.n-input-number--sm { height: 28px; }
.n-input-number--sm .n-input-number__input { font-size: 12px; width: 48px; }
.n-input-number--sm .n-input-number__prefix,
.n-input-number--sm .n-input-number__suffix { padding: 0 4px; font-size: 12px; }
.n-input-number--sm .n-input-number__btn { width: 24px; }

.n-input-number--md { height: 36px; }
.n-input-number--md .n-input-number__input { font-size: 14px; width: 60px; }
.n-input-number--md .n-input-number__prefix,
.n-input-number--md .n-input-number__suffix { padding: 0 8px; font-size: 14px; }
.n-input-number--md .n-input-number__btn { width: 32px; }

.n-input-number--lg { height: 44px; }
.n-input-number--lg .n-input-number__input { font-size: 16px; width: 72px; }
.n-input-number--lg .n-input-number__prefix,
.n-input-number--lg .n-input-number__suffix { padding: 0 10px; font-size: 16px; }
.n-input-number--lg .n-input-number__btn { width: 36px; }

/* ====== Buttons ====== */
.n-input-number__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--n-color-fill);
  color: var(--n-color-text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  height: 100%;
}

.n-input-number__btn:hover:not(:disabled) {
  background: var(--n-color-fill-hover);
  color: var(--n-color-primary);
}

.n-input-number__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.n-input-number__btn-left {
  border-right: 1px solid var(--n-color-border-hover);
}

.n-input-number__btn-right {
  border-left: 1px solid var(--n-color-border-hover);
}

/* ====== Vertical controls ====== */
.n-input-number__controls-vertical {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--n-color-border-hover);
  flex-shrink: 0;
}

.n-input-number__btn-up,
.n-input-number__btn-down {
  flex: 1;
  border: none;
  background: var(--n-color-fill);
  color: var(--n-color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.n-input-number__btn-up {
  border-bottom: 1px solid var(--n-color-border-hover);
}

.n-input-number__btn-up:hover:not(:disabled),
.n-input-number__btn-down:hover:not(:disabled) {
  background: var(--n-color-fill-hover);
  color: var(--n-color-primary);
}

.n-input-number__btn-up:disabled,
.n-input-number__btn-down:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ====== Input ====== */
.n-input-number__input {
  border: none;
  outline: none;
  text-align: center;
  background: transparent;
  color: var(--n-color-text);
  min-width: 0;
}

.n-input-number__input:disabled {
  cursor: not-allowed;
}

.n-input-number__input::placeholder {
  color: var(--n-color-text-disabled);
}

.n-input-number__prefix,
.n-input-number__suffix {
  display: flex;
  align-items: center;
  color: var(--n-color-text-disabled);
  flex-shrink: 0;
}
</style>
