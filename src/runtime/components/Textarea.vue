<template>
  <div
    :class="[
      'n-textarea',
      `n-textarea--${size}`,
      `n-textarea--${variant}`,
      {
        'n-textarea--disabled': disabled,
        'n-textarea--error': error || status === 'error',
        'n-textarea--focused': focused,
        'n-textarea--resizable': resizable,
        'n-textarea--auto-size': autoSize,
      },
    ]"
  >
    <label v-if="label" class="n-textarea__label">
      {{ label }}
      <span v-if="required" class="n-textarea__required">*</span>
    </label>
    <div class="n-textarea__wrapper">
      <textarea
        ref="textareaRef"
        :class="['n-textarea__field']"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="computedRows"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      <span
        v-if="clearable && modelValue && !disabled && !readonly"
        class="n-textarea__clear"
        @click.stop="handleClear"
      >
        <svg viewBox="0 0 12 12" width="14" height="14" fill="currentColor">
          <path d="M6 4.586L9.293 1.293a1 1 0 111.414 1.414L7.414 6l3.293 3.293a1 1 0 11-1.414 1.414L6 7.414l-3.293 3.293a1 1 0 01-1.414-1.414L4.586 6 1.293 2.707a1 1 0 011.414-1.414L6 4.586z" />
        </svg>
      </span>
    </div>
    <div v-if="error || (maxlength && showCount) || statusText" class="n-textarea__bottom">
      <p v-if="error || statusText" class="n-textarea__error">{{ error || statusText }}</p>
      <span v-if="maxlength && showCount" class="n-textarea__count" :class="{ 'n-textarea__count--exceed': currentLength > maxlength }">
        {{ currentLength }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'

interface Props {
  modelValue?: string
  variant?: 'outline' | 'filled' | 'borderless'
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
  label?: string
  error?: string
  status?: 'default' | 'error' | 'warning'
  statusText?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  rows?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  resizable?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  variant: 'outline',
  size: 'md',
  placeholder: '',
  label: '',
  error: '',
  status: 'default',
  statusText: '',
  disabled: false,
  readonly: false,
  clearable: false,
  showCount: false,
  rows: 4,
  resizable: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: string]
  input: [val: string, e: Event]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
  clear: []
  keydown: [e: KeyboardEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const focused = ref(false)
const currentLength = computed(() => props.modelValue.length)

const computedRows = computed(() => {
  if (props.autoSize) {
    if (typeof props.autoSize === 'object' && props.autoSize.minRows) {
      return props.autoSize.minRows
    }
    return 1
  }
  return props.rows
})

const maxRows = computed(() => {
  if (typeof props.autoSize === 'object' && props.autoSize.maxRows) {
    return props.autoSize.maxRows
  }
  return Infinity
})

function handleInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', val)
  emit('input', val, e)
  if (props.autoSize) {
    nextTick(autoResize)
  }
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function handleKeydown(e: KeyboardEvent) {
  emit('keydown', e)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
  textareaRef.value?.focus()
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
  const paddingTop = parseFloat(getComputedStyle(el).paddingTop) || 0
  const paddingBottom = parseFloat(getComputedStyle(el).paddingBottom) || 0
  const scrollHeight = el.scrollHeight
  const minH = (typeof props.autoSize === 'object' && props.autoSize.minRows ? props.autoSize.minRows : 1) * lineHeight + paddingTop + paddingBottom
  const maxH = maxRows.value !== Infinity ? maxRows.value * lineHeight + paddingTop + paddingBottom : Infinity
  el.style.height = Math.min(Math.max(scrollHeight, minH), maxH) + 'px'
}

watch(() => props.modelValue, () => {
  if (props.autoSize) {
    nextTick(autoResize)
  }
})

onMounted(() => {
  if (props.autoSize && props.modelValue) {
    nextTick(autoResize)
  }
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  textareaRef,
  resize: autoResize,
})
</script>

<style scoped>
.n-textarea {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.n-textarea__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-color-text-secondary);
}

.n-textarea__required {
  color: var(--n-color-danger, #ef4444);
  margin-left: 2px;
}

.n-textarea__wrapper {
  position: relative;
  display: flex;
}

.n-textarea__field {
  display: block;
  width: 100%;
  border-radius: 6px;
  background: var(--n-color-bg);
  color: var(--n-color-text);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  font-family: inherit;
  line-height: 1.6;
  box-sizing: border-box;
  resize: none;
}

.n-textarea--resizable .n-textarea__field {
  resize: vertical;
}

/* ====== Variants ====== */
.n-textarea--outline .n-textarea__field {
  border: 1px solid var(--n-color-border-hover);
}

.n-textarea--outline.n-textarea--focused .n-textarea__field {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-textarea--filled .n-textarea__field {
  border: 1px solid transparent;
  background: var(--n-color-fill-light, #f5f5f5);
}

.n-textarea--filled.n-textarea--focused .n-textarea__field {
  border-color: var(--n-color-primary);
  background: var(--n-color-bg);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-textarea--borderless .n-textarea__field {
  border: 1px solid transparent;
  border-bottom: 1px solid var(--n-color-border-hover);
  border-radius: 0;
}

.n-textarea--borderless.n-textarea--focused .n-textarea__field {
  border-bottom-color: var(--n-color-primary);
  box-shadow: none;
}

/* ====== Sizes ====== */
.n-textarea--sm .n-textarea__field {
  padding: 6px 8px;
  font-size: 12px;
}

.n-textarea--md .n-textarea__field {
  padding: 8px 12px;
  font-size: 14px;
}

.n-textarea--lg .n-textarea__field {
  padding: 12px 16px;
  font-size: 16px;
}

/* ====== States ====== */
.n-textarea--error .n-textarea__field {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-textarea--error.n-textarea--outline.n-textarea--focused .n-textarea__field,
.n-textarea--error.n-textarea--filled.n-textarea--focused .n-textarea__field {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.n-textarea--disabled .n-textarea__field {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--n-color-fill-hover);
}

.n-textarea__field::placeholder {
  color: var(--n-color-text-disabled);
}

/* ====== Clear button ====== */
.n-textarea__clear {
  position: absolute;
  right: 8px;
  top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}

.n-textarea__clear:hover {
  color: var(--n-color-text-secondary);
}

/* ====== Bottom area ====== */
.n-textarea__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 18px;
}

.n-textarea__error {
  font-size: 12px;
  color: var(--n-color-danger, #ef4444);
  margin: 0;
}

.n-textarea__count {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  margin-left: auto;
}

.n-textarea__count--exceed {
  color: var(--n-color-danger, #ef4444);
}

.n-textarea__count:only-child {
  margin-left: auto;
}
</style>
