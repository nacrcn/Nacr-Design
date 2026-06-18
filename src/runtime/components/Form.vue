<template>
    <form :class="['n-form', `n-form--${layout}`, `n-form--${size}`]" @submit.prevent="handleSubmit">
        <slot />
    </form>
</template>

<script lang="ts">
import type { InjectionKey } from 'vue'

export type FormValidateTrigger = 'change' | 'blur'

export interface FormRule {
    type?: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'array'
    required?: boolean
    message?: string
    min?: number
    max?: number
    len?: number
    pattern?: RegExp
    validator?: (value: any, callback: (error?: string) => void) => void
    trigger?: FormValidateTrigger | FormValidateTrigger[]
}

export interface FormContext {
    model: Record<string, any>
    rules: Record<string, FormRule | FormRule[]>
    disabled: boolean
    size:  'xs' | 'sm' | 'md' | 'lg'
    layout: 'horizontal' | 'vertical' | 'inline'
    labelPosition: 'left' | 'right' | 'top'
    labelWidth: string | number | undefined
    labelAlign: 'left' | 'right' | undefined
    colon: boolean
    showFeedback: boolean
    validateTrigger: FormValidateTrigger | FormValidateTrigger[]
    addField: (field: string, el: any) => void
    removeField: (field: string) => void
    validateField: (field: string, trigger?: FormValidateTrigger) => Promise<string[]>
    clearValidate: (field?: string) => void
    resetField: (field: string) => void
}

export const FORM_KEY: InjectionKey<FormContext> = Symbol('n-form')
</script>

<script setup lang="ts">
import { provide, toRaw } from 'vue'

interface Props {
    model: Record<string, any>
    rules?: Record<string, FormRule | FormRule[]>
    layout?: 'horizontal' | 'vertical' | 'inline'
    labelPosition?: 'left' | 'right' | 'top'
    labelWidth?: string | number
    labelAlign?: 'left' | 'right'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    disabled?: boolean
    colon?: boolean
    showFeedback?: boolean
    validateTrigger?: FormValidateTrigger | FormValidateTrigger[]
}

const props = withDefaults(defineProps<Props>(), {
    rules: () => ({}),
    layout: 'horizontal',
    labelPosition: 'right',
    labelWidth: undefined,
    labelAlign: undefined,
    size: 'md',
    disabled: false,
    colon: false,
    showFeedback: true,
    validateTrigger: 'change',
})

const emit = defineEmits<{
    submit: [e: Event]
    'submit-success': [values: Record<string, any>]
    'submit-fail': [errors: Record<string, string[]>]
    validate: [field: string, value: any, errors: string[] | undefined]
}>()

const fields = new Map<string, any>()

function addField(field: string, el: any) {
    if (field) fields.set(field, el)
}

function removeField(field: string) {
    fields.delete(field)
}

function getFieldValue(field: string) {
    const keys = field.split('.')
    let val: any = props.model
    for (const k of keys) {
        val = val?.[k]
    }
    return val
}

async function validateFieldRules(field: string, trigger?: FormValidateTrigger): Promise<string[]> {
    const rules = props.rules[field]
    if (!rules) return []

    const ruleList = Array.isArray(rules) ? rules : [rules]
    const value = getFieldValue(field)
    const errors: string[] = []

    for (const rule of ruleList) {
        if (trigger && rule.trigger) {
            const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
            if (!triggers.includes(trigger)) continue
        }

        if (rule.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
            errors.push(rule.message || `${field} 为必填项`)
            continue
        }

        if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(rule.message || '请输入有效的邮箱地址')
            continue
        }

        if (rule.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
            errors.push(rule.message || '请输入有效的URL')
            continue
        }

        if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
            errors.push(rule.message || `最少输入 ${rule.min} 个字符`)
            continue
        }

        if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
            errors.push(rule.message || `最多输入 ${rule.max} 个字符`)
            continue
        }

        if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
            errors.push(rule.message || `值不能小于 ${rule.min}`)
            continue
        }

        if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
            errors.push(rule.message || `值不能大于 ${rule.max}`)
            continue
        }

        if (rule.len !== undefined && String(value).length !== rule.len) {
            errors.push(rule.message || `请输入 ${rule.len} 个字符`)
            continue
        }

        if (rule.pattern && !rule.pattern.test(String(value))) {
            errors.push(rule.message || '格式不正确')
            continue
        }

        if (rule.validator) {
            await new Promise<void>((resolve) => {
                rule.validator!(value, (error?: string) => {
                    if (error) errors.push(error)
                    resolve()
                })
            })
        }
    }

    emit('validate', field, value, errors.length ? errors : undefined)
    return errors
}

function clearValidate(field?: string) {
    if (field) {
        const el = fields.get(field)
        if (el) el.clearValidate()
    } else {
        fields.forEach((el) => el.clearValidate())
    }
}

function resetField(field: string) {
    const el = fields.get(field)
    if (el) el.resetField()
}

const context: FormContext = {
    model: props.model,
    rules: props.rules,
    disabled: props.disabled,
    size: props.size,
    layout: props.layout,
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    labelAlign: props.labelAlign,
    colon: props.colon,
    showFeedback: props.showFeedback,
    validateTrigger: props.validateTrigger,
    addField,
    removeField,
    validateField: validateFieldRules,
    clearValidate,
    resetField,
}

provide(FORM_KEY, context)

async function handleSubmit(e: Event) {
    emit('submit', e)
    const allErrors: Record<string, string[]> = {}
    let hasError = false
    for (const field of fields.keys()) {
        const errors = await validateFieldRules(field)
        if (errors.length) {
            allErrors[field] = errors
            hasError = true
        }
        const el = fields.get(field)
        if (el) el.setErrors(errors)
    }
    if (hasError) {
        emit('submit-fail', allErrors)
    } else {
        emit('submit-success', toRaw(props.model))
    }
}

async function validate(callback?: (errors: Record<string, string[]> | undefined) => void) {
    const allErrors: Record<string, string[]> = {}
    let hasError = false
    for (const field of fields.keys()) {
        const errors = await validateFieldRules(field)
        if (errors.length) {
            allErrors[field] = errors
            hasError = true
        }
        const el = fields.get(field)
        if (el) el.setErrors(errors)
    }
    const result = hasError ? allErrors : undefined
    callback?.(result)
    return result
}

async function validateField(field: string | string[], callback?: (errors: string[] | undefined) => void) {
    const fieldList = Array.isArray(field) ? field : [field]
    const allErrors: Record<string, string[]> = {}
    for (const f of fieldList) {
        const errors = await validateFieldRules(f)
        if (errors.length) allErrors[f] = errors
        const el = fields.get(f)
        if (el) el.setErrors(errors)
    }
    const firstErrors = Object.values(allErrors).flat()
    callback?.(firstErrors.length ? firstErrors : undefined)
    return firstErrors
}

function resetFields(field?: string | string[]) {
    if (field) {
        const fieldList = Array.isArray(field) ? field : [field]
        fieldList.forEach(resetField)
    } else {
        fields.forEach((_, field) => resetField(field))
    }
}

defineExpose({ validate, validateField, resetFields, clearValidate })
</script>

<style scoped>
.n-form--horizontal {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.n-form--vertical {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.n-form--inline {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
}
</style>
