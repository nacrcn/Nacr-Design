<template>
  <div
    :class="[
      'n-input-tag',
      `n-input-tag--${size}`,
      {
        'n-input-tag--disabled': disabled,
        'n-input-tag--focused': focused,
        'n-input-tag--error': error,
      },
    ]"
    @click="focusInput"
  >
    <TransitionGroup name="n-input-tag__tag" tag="div" class="n-input-tag__tags">
      <span
        v-for="(tag, i) in modelValue"
        :key="tag + i"
        :class="['n-input-tag__tag', tagClass]"
        :style="tagStyle"
      >
        <span class="n-input-tag__tag-text">{{ tag }}</span>
        <span v-if="!disabled && !readonly" class="n-input-tag__tag-close" @click.stop="removeTag(i)">×</span>
      </span>
    </TransitionGroup>
    <span v-if="max && modelValue.length >= max" class="n-input-tag__overflow">+{{ modelValue.length - max }}</span>
    <input
      ref="inputRef"
      class="n-input-tag__input"
      :value="inputVal"
      :placeholder="placeholderText"
      :disabled="disabled"
      :readonly="readonly"
      @input="inputVal = ($event.target as HTMLInputElement).value"
      @keydown="handleKeydown"
      @focus="onFocus"
      @blur="handleBlur"
      @compositionstart="isComposing = true"
      @compositionend="isComposing = false; handleCompositionEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string[]
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  max?: number
  tagClass?: string
  tagStyle?: Record<string, string>
  error?: string
  unique?: boolean
  separator?: string | RegExp
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入后按回车',
  disabled: false,
  readonly: false,
  size: 'md',
  unique: true,
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [val: string[]]
  change: [val: string[]]
  add: [val: string]
  remove: [val: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const inputVal = ref('')
const focused = ref(false)
const isComposing = ref(false)

const placeholderText = computed(() => {
  if (props.modelValue.length) return ''
  return props.placeholder
})

function addTag() {
  const raw = inputVal.value.trim()
  if (!raw) return

  const separator = props.separator
  const values = separator ? raw.split(separator).map(s => s.trim()).filter(Boolean) : [raw]

  const newTags = [...props.modelValue]
  for (const val of values) {
    if (props.unique && newTags.includes(val)) continue
    newTags.push(val)
    emit('add', val)
  }

  if (newTags.length !== props.modelValue.length) {
    emit('update:modelValue', newTags)
    emit('change', newTags)
  }
  inputVal.value = ''
}

function removeTag(idx: number) {
  if (props.disabled || props.readonly) return
  const removed = props.modelValue[idx]
  const newTags = props.modelValue.filter((_, i) => i !== idx)
  emit('update:modelValue', newTags)
  emit('change', newTags)
  emit('remove', removed)
}

function handleKeydown(e: KeyboardEvent) {
  if (isComposing.value) return
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && !inputVal.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  }
}

function handleCompositionEnd() {
  if (!isComposing.value) addTag()
}

function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  if (inputVal.value.trim()) addTag()
  emit('blur', e)
}

function focusInput() {
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  inputRef,
})
</script>

<style scoped>
.n-input-tag {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--n-color-border-hover);
  border-radius: 6px;
  background: var(--n-color-bg);
  cursor: text;
  transition: border-color 0.2s, box-shadow 0.2s;
  padding: 4px 8px;
}

.n-input-tag--focused {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.n-input-tag--error {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-input-tag--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--n-color-fill);
}

/* ====== Sizes ====== */
.n-input-tag--sm { min-height: 28px; font-size: 12px; padding: 2px 6px; }
.n-input-tag--md { min-height: 36px; font-size: 14px; }
.n-input-tag--lg { min-height: 44px; font-size: 16px; padding: 6px 12px; }

/* ====== Tags ====== */
.n-input-tag__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.n-input-tag__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.1));
  color: var(--n-color-primary);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  transition: background 0.2s;
}

.n-input-tag__tag:hover {
  background: var(--n-color-primary-light-hover, rgba(59, 130, 246, 0.18));
}

.n-input-tag__tag-text {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.n-input-tag__tag-close {
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  margin-left: 2px;
  transition: color 0.2s;
}

.n-input-tag__tag-close:hover {
  color: var(--n-color-danger, #ef4444);
}

.n-input-tag__overflow {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  padding: 2px 4px;
  flex-shrink: 0;
}

/* ====== Input ====== */
.n-input-tag__input {
  flex: 1;
  min-width: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  color: var(--n-color-text);
  padding: 0;
  height: 24px;
}

.n-input-tag__input::placeholder {
  color: var(--n-color-text-disabled);
}

/* ====== Tag transition ====== */
.n-input-tag__tag-enter-active {
  transition: all 0.2s ease;
}

.n-input-tag__tag-leave-active {
  transition: all 0.15s ease;
  position: absolute;
}

.n-input-tag__tag-enter-from,
.n-input-tag__tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
