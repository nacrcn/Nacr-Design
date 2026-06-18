<template>
  <div :class="[
    'n-input',
    `n-input--${size}`,
    `n-input--${variant}`,
    {
      'n-input--error': error,
      'n-input--disabled': disabled,
      'n-input--focused': focused,
      'n-input--clearable': clearable,
      'n-input--password': type === 'password',
      'n-input--no-label': !label,
    },
  ]">
    <label v-if="label" class="n-input__label">
      {{ label }}
      <span v-if="required" class="n-input__required">*</span>
    </label>
    <div class="n-input__wrapper" @click="focus">
      <span v-if="$slots.prefix || prefixText" class="n-input__prefix">
        <slot name="prefix">{{ prefixText }}</slot>
      </span>
      <input ref="inputRef" class="n-input__field" :type="showPassword ? 'text' : nativeType" :value="modelValue"
        :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxlength"
        :autofocus="autofocus" @input="onInput" @focus="onFocus" @blur="onBlur" @change="onChange"
        @keydown="$emit('keydown', $event)" @keyup="$emit('keyup', $event)" @keypress="$emit('keypress', $event)" />
      <span v-if="clearable && modelValue && !disabled && !readonly" class="n-input__clear" @click.stop="handleClear">
        <svg viewBox="0 0 12 12" width="14" height="14" fill="currentColor">
          <path
            d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 11-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
        </svg>
      </span>
      <span v-if="type === 'password' && !disabled" class="n-input__password-toggle"
        @click.stop="showPassword = !showPassword">
        <svg v-if="showPassword" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </span>
      <span v-if="$slots.suffix || suffixText" class="n-input__suffix">
        <slot name="suffix">{{ suffixText }}</slot>
      </span>
    </div>
    <div v-if="error || (maxlength && showCount)" class="n-input__bottom">
      <p v-if="error" class="n-input__error">{{ error }}</p>
      <span v-if="maxlength && showCount" class="n-input__count">
        {{ currentLength }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  variant?: 'outline' | 'filled' | 'borderless'
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  prefixText?: string
  suffixText?: string
  required?: boolean
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  variant: 'outline',
  size: 'md',
  placeholder: '',
  label: '',
  error: '',
  disabled: false,
  readonly: false,
  clearable: false,
  showCount: false,
  prefixText: '',
  suffixText: '',
  required: false,
  autofocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  change: [event: Event]
  clear: []
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
  keypress: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const showPassword = ref(false)

const nativeType = computed(() => props.type)

const currentLength = computed(() => String(props.modelValue).length)

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function onBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function onChange(e: Event) {
  emit('change', e)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus, blur: () => inputRef.value?.blur(), inputRef })
</script>

<style scoped>
.n-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.n-input__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-color-text-secondary);
}

.n-input__required {
  color: var(--n-color-danger, #ef4444);
  margin-left: 2px;
}

.n-input__wrapper {
  display: flex;
  align-items: center;
  border-radius: 6px;
  background: var(--n-color-bg);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  overflow: hidden;
}

/* ====== Variants ====== */
.n-input--outline .n-input__wrapper {
  border: 1px solid var(--n-color-border-hover);
}

.n-input--outline .n-input__wrapper:focus-within,
.n-input--outline.n-input--focused .n-input__wrapper {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-input--filled .n-input__wrapper {
  border: 1px solid transparent;
  background: var(--n-color-fill-light, #f5f5f5);
}

.n-input--filled .n-input__wrapper:focus-within,
.n-input--filled.n-input--focused .n-input__wrapper {
  border-color: var(--n-color-primary);
  background: var(--n-color-bg);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-input--borderless .n-input__wrapper {
  border: 1px solid transparent;
  border-bottom: 1px solid var(--n-color-border-hover);
  border-radius: 0;
}

.n-input--borderless .n-input__wrapper:focus-within,
.n-input--borderless.n-input--focused .n-input__wrapper {
  border-bottom-color: var(--n-color-primary);
  box-shadow: none;
}

/* ====== Sizes ====== */
.n-input--sm .n-input__wrapper {
  height: 28px;
}

.n-input--sm .n-input__field {
  font-size: 12px;
  padding: 0 8px;
}

.n-input--sm .n-input__prefix,
.n-input--sm .n-input__suffix {
  padding: 0 6px;
  font-size: 12px;
}

.n-input--md .n-input__wrapper {
  height: 36px;
}

.n-input--md .n-input__field {
  font-size: 14px;
  padding: 0 12px;
}

.n-input--md .n-input__prefix,
.n-input--md .n-input__suffix {
  padding: 0 10px;
}

.n-input--lg .n-input__wrapper {
  height: 44px;
}

.n-input--lg .n-input__field {
  font-size: 16px;
  padding: 0 16px;
}

.n-input--lg .n-input__prefix,
.n-input--lg .n-input__suffix {
  padding: 0 12px;
  font-size: 16px;
}

/* ====== States ====== */
.n-input--error .n-input__wrapper {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-input--error.n-input--outline .n-input__wrapper:focus-within,
.n-input--error.n-input--outline.n-input--focused .n-input__wrapper {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.n-input--disabled .n-input__wrapper {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--n-color-fill-hover);
}

.n-input__prefix,
.n-input__suffix {
  display: flex;
  align-items: center;
  color: var(--n-color-text-disabled);
  flex-shrink: 0;
}

.n-input__field {
  flex: 1;
  border: none;
  outline: none;
  color: var(--n-color-text);
  background: transparent;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
}

.n-input__field:disabled {
  cursor: not-allowed;
}

.n-input__field::placeholder {
  color: var(--n-color-text-disabled);
}

/* ====== Clear button ====== */
.n-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s;
}

.n-input__clear:hover {
  color: var(--n-color-text-secondary);
}

/* ====== Password toggle ====== */
.n-input__password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.2s;
}

.n-input__password-toggle:hover {
  color: var(--n-color-text-secondary);
}

/* ====== Bottom area ====== */
.n-input__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 18px;
}

.n-input__error {
  font-size: 12px;
  color: var(--n-color-danger, #ef4444);
  margin: 0;
}

.n-input__count {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  margin-left: auto;
}

.n-input__count:only-child {
  margin-left: auto;
}
</style>
