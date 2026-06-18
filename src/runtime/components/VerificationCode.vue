<template>
    <div :class="[
        'n-verification-code',
        `n-verification-code--${size}`,
        `n-verification-code--${variant}`,
        {
            'n-verification-code--disabled': disabled,
            'n-verification-code--readonly': readonly,
            'n-verification-code--error': error || status === 'error',
            'n-verification-code--success': status === 'success',
            'n-verification-code--warning': status === 'warning',
        },
    ]" :style="{ gap: typeof gap === 'number' ? gap + 'px' : gap }">
        <div v-for="(_, i) in length" :key="i" :class="[
            'n-verification-code__cell',
            {
                'n-verification-code__cell--active': focused === i,
                'n-verification-code__cell--filled': !!modelValue[i],
                'n-verification-code__cell--divider': dividerIndexes.includes(i),
            },
        ]" @click="focusInput(i)">
            <template v-if="modelValue[i]">
                <span v-if="type === 'password'" class="n-verification-code__dot" />
                <span v-else class="n-verification-code__char">{{ modelValue[i] }}</span>
            </template>
            <span v-if="focused === i && !modelValue[i]" class="n-verification-code__caret" />
        </div>
        <!-- Hidden input for mobile keyboard -->
        <input ref="hiddenInputRef" class="n-verification-code__hidden-input" :inputmode="inputMode"
            :type="type === 'number' ? 'tel' : 'text'" :disabled="disabled" :readonly="readonly" :maxlength="length"
            autocomplete="one-time-code" @input="handleHiddenInput" @keydown="handleKeydown" @focus="onHiddenFocus"
            @blur="onHiddenBlur" @paste="handlePaste" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
    modelValue: string
    length?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'box' | 'underline' | 'circle'
    type?: 'text' | 'number' | 'password'
    gap?: number | string
    disabled?: boolean
    readonly?: boolean
    error?: boolean
    status?: 'default' | 'error' | 'success' | 'warning'
    divider?: number | number[]
    plain?: boolean
    mask?: boolean | string
}

const props = withDefaults(defineProps<Props>(), {
    length: 6,
    size: 'md',
    variant: 'box',
    type: 'text',
    gap: 8,
    disabled: false,
    readonly: false,
    error: false,
    status: 'default',
    plain: false,
    mask: false,
})

const emit = defineEmits<{
    'update:modelValue': [v: string]
    finish: [v: string]
    change: [v: string]
    focus: []
    blur: []
}>()

const hiddenInputRef = ref<HTMLInputElement>()
const focused = ref(-1)

const inputMode = computed(() => {
    if (props.type === 'number') return 'numeric'
    return 'text'
})

const dividerIndexes = computed(() => {
    if (props.divider === undefined) return []
    if (typeof props.divider === 'number') {
        const indexes: number[] = []
        for (let i = props.divider; i < props.length; i += props.divider) {
            if (i < props.length) indexes.push(i)
        }
        return indexes
    }
    return props.divider
})

function focusInput(index?: number) {
    if (props.disabled || props.readonly) return
    hiddenInputRef.value?.focus()
    if (index !== undefined) {
        focused.value = index
    }
}

function onHiddenFocus() {
    const idx = Math.min(props.modelValue.length, props.length - 1)
    focused.value = idx
    emit('focus')
}

function onHiddenBlur() {
    focused.value = -1
    emit('blur')
}

function handleHiddenInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value
    let val = raw.replace(/\s/g, '')

    if (props.type === 'number') {
        val = val.replace(/\D/g, '')
    }

    val = val.slice(0, props.length)

    // Sync visible cursor
    focused.value = Math.min(val.length, props.length - 1)

    emit('update:modelValue', val)
    emit('change', val)

    if (val.length === props.length) {
        emit('finish', val)
    }

    // Reset input value so paste works properly next time
    nextTick(() => {
        if (hiddenInputRef.value) {
            hiddenInputRef.value.value = ''
        }
    })
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
        if (props.modelValue.length > 0) {
            const newVal = props.modelValue.slice(0, -1)
            emit('update:modelValue', newVal)
            emit('change', newVal)
            focused.value = Math.min(newVal.length, props.length - 1)
        }
    } else if (e.key === 'ArrowLeft') {
        focused.value = Math.max(0, focused.value - 1)
    } else if (e.key === 'ArrowRight') {
        focused.value = Math.min(props.length - 1, focused.value + 1)
    }
}

function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const text = (e.clipboardData || (window as any).clipboardData)
        ?.getData('text')
        ?.replace(/\s/g, '')
        ?.slice(0, props.length)

    if (!text) return

    let val = text
    if (props.type === 'number') {
        val = val.replace(/\D/g, '')
    }

    emit('update:modelValue', val)
    emit('change', val)
    focused.value = Math.min(val.length, props.length - 1)

    if (val.length === props.length) {
        emit('finish', val)
    }

    nextTick(() => {
        if (hiddenInputRef.value) {
            hiddenInputRef.value.value = ''
        }
    })
}

function clear() {
    emit('update:modelValue', '')
    emit('change', '')
    focused.value = -1
}

defineExpose({
    focus: () => focusInput(),
    blur: () => hiddenInputRef.value?.blur(),
    clear,
    hiddenInputRef,
})
</script>

<style scoped>
.n-verification-code {
    display: inline-flex;
    align-items: center;
    position: relative;
}

/* ====== Hidden input ====== */
.n-verification-code__hidden-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
    font-size: 16px;
    /* prevent iOS zoom */
}

.n-verification-code--disabled .n-verification-code__hidden-input,
.n-verification-code--readonly .n-verification-code__hidden-input {
    cursor: not-allowed;
    pointer-events: none;
}

/* ====== Cell ====== */
.n-verification-code__cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--n-color-bg);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    flex-shrink: 0;
}

.n-verification-code__char {
    font-weight: 600;
    color: var(--n-color-text);
    user-select: none;
}

.n-verification-code__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--n-color-text);
}

/* ====== Caret blink ====== */
.n-verification-code__caret {
    width: 2px;
    height: 60%;
    background: var(--n-color-primary);
    border-radius: 1px;
    animation: n-caret-blink 1s step-end infinite;
}

@keyframes n-caret-blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

/* ====== Variant: box ====== */
.n-verification-code--box .n-verification-code__cell {
    border: 2px solid var(--n-color-border-hover);
    border-radius: 8px;
}

.n-verification-code--box .n-verification-code__cell--active {
    border-color: var(--n-color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-verification-code--box .n-verification-code__cell--filled {
    border-color: var(--n-color-border);
}

/* ====== Variant: underline ====== */
.n-verification-code--underline .n-verification-code__cell {
    border: none;
    border-bottom: 2px solid var(--n-color-border-hover);
    border-radius: 0;
}

.n-verification-code--underline .n-verification-code__cell--active {
    border-bottom-color: var(--n-color-primary);
}

.n-verification-code--underline .n-verification-code__cell--filled {
    border-bottom-color: var(--n-color-border);
}

/* ====== Variant: circle ====== */
.n-verification-code--circle .n-verification-code__cell {
    border: 2px solid var(--n-color-border-hover);
    border-radius: 50%;
}

.n-verification-code--circle .n-verification-code__cell--active {
    border-color: var(--n-color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.n-verification-code--circle .n-verification-code__cell--filled {
    border-color: var(--n-color-border);
}

/* ====== Sizes ====== */
.n-verification-code--sm .n-verification-code__cell {
    width: 32px;
    height: 38px;
    font-size: 14px;
}

.n-verification-code--md .n-verification-code__cell {
    width: 42px;
    height: 48px;
    font-size: 20px;
}

.n-verification-code--lg .n-verification-code__cell {
    width: 52px;
    height: 58px;
    font-size: 24px;
}

.n-verification-code--sm .n-verification-code__dot {
    width: 8px;
    height: 8px;
}

.n-verification-code--lg .n-verification-code__dot {
    width: 12px;
    height: 12px;
}

/* ====== Divider ====== */
.n-verification-code__cell--divider {
    margin-left: calc(var(--n-vc-gap, 8px) + 8px);
}

/* ====== States ====== */
.n-verification-code--error .n-verification-code__cell,
.n-verification-code--error .n-verification-code__cell--filled {
    border-color: var(--n-color-danger, #ef4444) !important;
}

.n-verification-code--error .n-verification-code__cell--active {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
}

.n-verification-code--success .n-verification-code__cell,
.n-verification-code--success .n-verification-code__cell--filled {
    border-color: var(--n-color-success, #22c55e) !important;
}

.n-verification-code--success .n-verification-code__cell--active {
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15) !important;
}

.n-verification-code--warning .n-verification-code__cell,
.n-verification-code--warning .n-verification-code__cell--filled {
    border-color: var(--n-color-warning, #f59e0b) !important;
}

.n-verification-code--warning .n-verification-code__cell--active {
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15) !important;
}

.n-verification-code--disabled .n-verification-code__cell {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--n-color-fill);
}

.n-verification-code--readonly .n-verification-code__cell {
    background: var(--n-color-fill-light, #f9f9f9);
}

.n-verification-code--plain .n-verification-code__cell {
    background: transparent;
}
</style>
