<template>
  <div :class="['n-form-item', `n-form-item--${formContext?.layout || 'horizontal'}`, { 'n-form-item--error': errors.length, 'n-form-item--required': isRequired, 'n-form-item--disabled': disabled, 'n-form-item--no-feedback': !isShowFeedback }]">
    <label v-if="!hideLabel && label" :class="['n-form-item__label', `n-form-item__label--${formContext?.labelPosition || 'right'}`]" :style="labelStyle">
      <span v-if="isRequired && !hideAsterisk" class="n-form-item__asterisk">*</span>
      <slot name="label">{{ label }}</slot>
      <span v-if="formContext?.colon" class="n-form-item__colon">:</span>
    </label>
    <div class="n-form-item__wrapper">
      <div :class="['n-form-item__control', { 'n-form-item__control--error': errors.length }]">
        <slot />
      </div>
      <transition name="n-form-item__fade">
        <div v-if="errors.length" class="n-form-item__error">
          <slot name="error" :errors="errors">
            {{ errors[0] }}
          </slot>
        </div>
      </transition>
      <div v-if="help && !errors.length" class="n-form-item__help">
        <slot name="help">{{ help }}</slot>
      </div>
      <div v-if="extra" class="n-form-item__extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { FORM_KEY } from './Form.vue'
import type { FormRule, FormValidateTrigger } from './Form.vue'

interface Props {
  field?: string
  label?: string
  labelWidth?: string | number
  labelAlign?: 'left' | 'right'
  rules?: FormRule | FormRule[]
  required?: boolean
  disabled?: boolean
  help?: string
  extra?: string
  colon?: boolean
  validateTrigger?: FormValidateTrigger | FormValidateTrigger[]
  validateStatus?: 'success' | 'warning' | 'error' | 'validating'
  feedback?: boolean
  showFeedback?: boolean
  hideLabel?: boolean
  hideAsterisk?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  feedback: true,
  showFeedback: undefined,
  hideLabel: false,
  hideAsterisk: false,
})

const formContext = inject(FORM_KEY, null)
const errors = ref<string[]>([])
let initialValue: any

const isRequired = computed(() => {
  if (props.required) return true
  if (!props.field) return false
  const rules = props.rules || (props.field && formContext?.rules[props.field])
  if (!rules) return false
  const ruleList = Array.isArray(rules) ? rules : [rules]
  return ruleList.some(r => r.required)
})

const disabled = computed(() => {
  return props.disabled || !!formContext?.disabled
})

const isShowFeedback = computed(() => {
  if (props.showFeedback !== undefined) return props.showFeedback
  return formContext?.showFeedback ?? true
})

const resolvedLabelWidth = computed(() => {
  if (props.labelWidth !== undefined) return props.labelWidth
  return formContext?.labelWidth
})

const resolvedLabelAlign = computed(() => {
  if (props.labelAlign !== undefined) return props.labelAlign
  return formContext?.labelAlign
})

const labelStyle = computed(() => {
  const style: Record<string, string> = {}
  if (resolvedLabelWidth.value !== undefined) {
    const w = typeof resolvedLabelWidth.value === 'number' ? `${resolvedLabelWidth.value}px` : resolvedLabelWidth.value
    style.minWidth = w
    style.maxWidth = w
    style.width = w
    style.flexShrink = '0'
  }
  if (resolvedLabelAlign.value) {
    style.justifyContent = resolvedLabelAlign.value === 'right' ? 'flex-end' : 'flex-start'
  }
  return style
})

function getFieldValue() {
  if (!props.field) return undefined
  const keys = props.field.split('.')
  let val: any = formContext?.model
  for (const k of keys) {
    val = val?.[k]
  }
  return val
}

function setErrors(errs: string[]) {
  errors.value = errs
}

function clearValidate() {
  errors.value = []
}

function resetField() {
  if (!props.field || !formContext) return
  const keys = props.field.split('.')
  let obj: any = formContext.model
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  obj[keys[keys.length - 1]] = initialValue
  errors.value = []
}

async function validate(trigger?: FormValidateTrigger) {
  if (!props.field) return []
  const rules = props.rules || (props.field && formContext?.rules[props.field])
  if (!rules) {
    errors.value = []
    return []
  }

  const ruleList = Array.isArray(rules) ? rules : [rules]
  const value = getFieldValue()
  const errs: string[] = []

  for (const rule of ruleList) {
    if (trigger && rule.trigger) {
      const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
      if (!triggers.includes(trigger)) continue
    }

    if (rule.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
      errs.push(rule.message || `${props.field} 为必填项`)
      continue
    }
    if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errs.push(rule.message || '请输入有效的邮箱地址')
      continue
    }
    if (rule.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
      errs.push(rule.message || '请输入有效的URL')
      continue
    }
    if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
      errs.push(rule.message || `最少输入 ${rule.min} 个字符`)
      continue
    }
    if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
      errs.push(rule.message || `最多输入 ${rule.max} 个字符`)
      continue
    }
    if (rule.pattern && !rule.pattern.test(String(value || ''))) {
      errs.push(rule.message || '格式不正确')
      continue
    }
    if (rule.validator) {
      await new Promise<void>((resolve) => {
        rule.validator!(value, (error?: string) => {
          if (error) errs.push(error)
          resolve()
        })
      })
    }
  }

  errors.value = errs
  return errs
}

onMounted(() => {
  if (props.field && formContext) {
    initialValue = getFieldValue()
    formContext.addField(props.field, { setErrors, clearValidate, resetField, validate })
  }
})

onBeforeUnmount(() => {
  if (props.field && formContext) {
    formContext.removeField(props.field)
  }
})

defineExpose({ setErrors, clearValidate, resetField, validate })
</script>

<style scoped>
.n-form-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.n-form-item--vertical {
  flex-direction: column;
  gap: 4px;
}

.n-form-item--inline {
  margin-bottom: 0;
}

.n-form-item__label {
  display: inline-flex;
  align-items: flex-start;
  padding-top: 5px;
  font-size: 14px;
  color: var(--n-color-text-secondary);
  white-space: nowrap;
  min-width: 80px;
}

.n-form-item__label--top {
  text-align: left;
  padding-top: 0;
}

.n-form-item__label--left {
  justify-content: flex-start;
}

.n-form-item__label--right {
  justify-content: flex-end;
}

.n-form-item__asterisk {
  color: var(--n-color-danger);
  margin-right: 2px;
}

.n-form-item__colon {
  margin-left: 2px;
}

.n-form-item__wrapper {
  flex: 1;
  min-width: 0;
}

.n-form-item__control {
  width: 100%;
}

.n-form-item__error {
  font-size: 12px;
  color: var(--n-color-danger);
  margin-top: 4px;
  line-height: 1.4;
}

.n-form-item__help {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  margin-top: 4px;
  line-height: 1.4;
}

.n-form-item__extra {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  margin-top: 4px;
  line-height: 1.4;
}

.n-form-item__fade-enter-active,
.n-form-item__fade-leave-active {
  transition: all 0.2s ease;
}

.n-form-item__fade-enter-from,
.n-form-item__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.n-form-item--no-feedback .n-form-item__error,
.n-form-item--no-feedback .n-form-item__help,
.n-form-item--no-feedback .n-form-item__extra {
  display: none;
}
</style>
