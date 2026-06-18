<template>
    <div :class="[
        'n-radio-group',
        `n-radio-group--${size}`,
        { 'n-radio-group--button': variant === 'button' },
    ]" role="radiogroup">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'

interface Props {
    modelValue: any
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'circle' | 'rect' | 'button'
    gap?: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    size: 'md',
    variant: 'circle',
    gap: undefined,
})

const emit = defineEmits<{
    'update:modelValue': [val: any]
    change: [val: any]
}>()

function updateValue(val: any) {
    emit('update:modelValue', val)
    emit('change', val)
}

provide('n-radio-group', {
    modelValue: computed(() => props.modelValue),
    disabled: computed(() => props.disabled),
    size: computed(() => props.size),
    variant: computed(() => props.variant),
    updateValue,
})
</script>

<style scoped>
.n-radio-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
}

.n-radio-group--button {
    gap: 0;
}
</style>
