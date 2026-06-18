<template>
    <label :class="[
        'n-radio',
        `n-radio--${size}`,
        `n-radio--${variant}`,
        {
            'n-radio--checked': checked,
            'n-radio--disabled': disabled,
            'n-radio--button': isButton,
            'n-radio--button-checked': isButton && checked,
        },
    ]">
        <input type="radio" class="n-radio__input" :checked="checked" :disabled="disabled" :value="value"
            @change="handleChange" />
        <span v-if="!isButton" class="n-radio__mark">
            <span v-if="checked" class="n-radio__dot" />
        </span>
        <span class="n-radio__label">
            <slot />
        </span>
    </label>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
    modelValue?: any
    value: any
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'circle' | 'rect'
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    size: 'md',
    variant: 'circle',
})

const emit = defineEmits<{
    'update:modelValue': [val: any]
    change: [val: any, e: Event]
}>()

const group = inject<any>('n-radio-group', null)

const isButton = computed(() => group?.variant?.value === 'button')
const size = computed(() => group?.size?.value || props.size)
const variant = computed(() => group?.variant?.value || props.variant)

const checked = computed(() => {
    const mv = group ? group.modelValue.value : props.modelValue
    return mv === props.value
})

function handleChange(e: Event) {
    if (group) {
        group.updateValue(props.value)
    } else {
        emit('update:modelValue', props.value)
        emit('change', props.value, e)
    }
}
</script>

<style scoped>
.n-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    color: var(--n-color-text-secondary);
    transition: color 0.25s;
}

.n-radio--sm {
    font-size: 12px;
}

.n-radio--lg {
    font-size: 16px;
}

.n-radio--checked {
    color: var(--n-color-primary);
}

.n-radio--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.n-radio__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

/* Circle & Rect variant */
.n-radio__mark {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 2px solid var(--n-color-border-hover);
    background: var(--n-color-bg);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.n-radio--circle .n-radio__mark {
    border-radius: 50%;
}

.n-radio--rect .n-radio__mark {
    border-radius: 4px;
}

.n-radio--checked .n-radio__mark {
    border-color: var(--n-color-primary);
    background: var(--n-color-primary);
    box-shadow: 0 0 0 2px var(--n-color-primary-light, rgba(59, 130, 246, 0.12));
}

.n-radio__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    transform: scale(0);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.n-radio--checked .n-radio__dot {
    transform: scale(1);
}

.n-radio--rect .n-radio__dot {
    border-radius: 2px;
}

.n-radio--sm .n-radio__mark {
    width: 14px;
    height: 14px;
}

.n-radio--sm .n-radio__dot {
    width: 6px;
    height: 6px;
}

.n-radio--lg .n-radio__mark {
    width: 22px;
    height: 22px;
}

.n-radio--lg .n-radio__dot {
    width: 10px;
    height: 10px;
}

.n-radio:not(.n-radio--disabled):hover .n-radio__mark {
    border-color: var(--n-color-primary);
}

.n-radio--disabled:hover .n-radio__mark {
    border-color: var(--n-color-border-hover);
}

.n-radio__label {
    flex: 1;
    line-height: 1.5;
    transition: color 0.25s;
}

/* Button variant */
.n-radio--button {
    padding: 0 16px;
    height: 32px;
    border: 1px solid var(--n-color-border);
    background: var(--n-color-bg);
    border-radius: 0;
    margin: 0;
    gap: 0;
}

.n-radio--button+.n-radio--button {
    margin-left: -1px;
}

.n-radio--button:first-child {
    border-radius: 6px 0 0 6px;
}

.n-radio--button:last-child {
    border-radius: 0 6px 6px 0;
}

.n-radio--button-checked {
    color: var(--n-color-primary);
    border-color: var(--n-color-primary);
    background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
    z-index: 1;
    position: relative;
}

.n-radio--sm.n-radio--button {
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
}

.n-radio--lg.n-radio--button {
    height: 38px;
    padding: 0 20px;
    font-size: 16px;
}

.n-radio--button:hover {
    color: var(--n-color-primary);
}

.n-radio--button.n-radio--disabled {
    opacity: 0.5;
}
</style>
