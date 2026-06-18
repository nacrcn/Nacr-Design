<template>
    <span :class="[
        'n-tag',
        `n-tag--${effect}`,
        `n-tag--${size}`,
        `n-tag--${type}`,
        {
            'n-tag--round': round,
            'n-tag--closable': closable,
            'n-tag--checkable': checkable,
            'n-tag--checked': checkable && isChecked,
            'n-tag--disabled': disabled,
            'n-tag--bordered': bordered,
        },
    ]" :style="customStyle" @click="handleClick">
        <NIcon v-if="icon" :name="icon" :size="size === 'sm' ? 12 : size === 'lg' ? 16 : 14" class="n-tag__icon" />
        <span class="n-tag__content">
            <slot />
        </span>
        <span v-if="closable" class="n-tag__close" @click.stop="emit('close')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </span>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NIcon from './Icon.vue'

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type TagSize = 'sm' | 'md' | 'lg'
type TagEffect = 'light' | 'dark' | 'outlined' | 'plain'

const props = withDefaults(defineProps<{
    type?: TagType
    size?: TagSize
    effect?: TagEffect
    round?: boolean
    closable?: boolean
    icon?: string
    color?: string
    textColor?: string
    bordered?: boolean
    disabled?: boolean
    checkable?: boolean
    checked?: boolean
    modelValue?: boolean
}>(), {
    type: 'default',
    size: 'md',
    effect: 'light',
    round: false,
    closable: false,
    icon: undefined,
    color: undefined,
    textColor: undefined,
    bordered: false,
    disabled: false,
    checkable: false,
    checked: undefined,
    modelValue: undefined,
})

const emit = defineEmits<{
    close: []
    click: [e: MouseEvent]
    'update:checked': [val: boolean]
    'update:modelValue': [val: boolean]
    change: [val: boolean]
}>()

const isChecked = computed(() => {
    if (props.modelValue !== undefined) return props.modelValue
    if (props.checked !== undefined) return props.checked
    return false
})

const customStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.color) style['--n-tag-bg'] = props.color
    if (props.textColor) style['--n-tag-color'] = props.textColor
    return style
})

function handleClick(e: MouseEvent) {
    if (props.disabled) return
    emit('click', e)
    if (props.checkable) {
        const newVal = !isChecked.value
        emit('update:checked', newVal)
        emit('update:modelValue', newVal)
        emit('change', newVal)
    }
}
</script>

<style scoped>
.n-tag {
    --n-tag-bg: var(--n-tag-bg-default, var(--n-color-fill, #f5f5f5));
    --n-tag-color: var(--n-tag-color-default, var(--n-color-text-secondary, #888));
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    font-size: var(--n-font-size-xs, 12px);
    line-height: 20px;
    border-radius: var(--n-radius-sm, 4px);
    white-space: nowrap;
    vertical-align: middle;
    background: var(--n-tag-bg);
    color: var(--n-tag-color);
    border: 1px solid transparent;
    transition: all 0.2s ease;
    cursor: default;
    box-sizing: border-box;
}

/* ====== Sizes ====== */
.n-tag--sm {
    padding: 0 8px;
    font-size: 11px;
    line-height: 18px;
}

.n-tag--lg {
    padding: 4px 14px;
    font-size: var(--n-font-size-sm, 13px);
    line-height: 24px;
}

/* ====== Round ====== */
.n-tag--round {
    border-radius: var(--n-radius-round, 999px);
    padding: 2px 12px;
}

.n-tag--round.n-tag--lg {
    padding: 4px 16px;
}

/* ====== Light effect (default) ====== */
.n-tag--light.n-tag--default {
    --n-tag-bg: var(--n-color-fill, #f5f5f5);
    --n-tag-color: var(--n-color-text-secondary, #888);
}

.n-tag--light.n-tag--primary {
    --n-tag-bg: var(--n-color-primary-light, #e6f4ff);
    --n-tag-color: var(--n-color-primary, #1677ff);
}

.n-tag--light.n-tag--success {
    --n-tag-bg: var(--n-color-success-light, #f6ffed);
    --n-tag-color: var(--n-color-success, #52c41a);
}

.n-tag--light.n-tag--warning {
    --n-tag-bg: var(--n-color-warning-light, #fffbe6);
    --n-tag-color: var(--n-color-warning-hover, #d48806);
}

.n-tag--light.n-tag--danger {
    --n-tag-bg: var(--n-color-danger-light, #fff2f0);
    --n-tag-color: var(--n-color-danger, #ff4d4f);
}

.n-tag--light.n-tag--info {
    --n-tag-bg: var(--n-color-info-light, #e6f7ff);
    --n-tag-color: var(--n-color-info, #1677ff);
}

/* ====== Dark effect ====== */
.n-tag--dark.n-tag--default {
    --n-tag-bg: var(--n-color-text-secondary, #888);
    --n-tag-color: #fff;
}

.n-tag--dark.n-tag--primary {
    --n-tag-bg: var(--n-color-primary, #1677ff);
    --n-tag-color: #fff;
}

.n-tag--dark.n-tag--success {
    --n-tag-bg: var(--n-color-success, #52c41a);
    --n-tag-color: #fff;
}

.n-tag--dark.n-tag--warning {
    --n-tag-bg: var(--n-color-warning, #faad14);
    --n-tag-color: #fff;
}

.n-tag--dark.n-tag--danger {
    --n-tag-bg: var(--n-color-danger, #ff4d4f);
    --n-tag-color: #fff;
}

.n-tag--dark.n-tag--info {
    --n-tag-bg: var(--n-color-info, #1677ff);
    --n-tag-color: #fff;
}

/* ====== Outlined effect ====== */
.n-tag--outlined {
    background: transparent !important;
    border: 1px solid;
}

.n-tag--outlined.n-tag--default {
    border-color: var(--n-color-border, #d9d9d9);
    --n-tag-color: var(--n-color-text-secondary, #888);
}

.n-tag--outlined.n-tag--primary {
    border-color: var(--n-color-primary, #1677ff);
    --n-tag-color: var(--n-color-primary, #1677ff);
}

.n-tag--outlined.n-tag--success {
    border-color: var(--n-color-success, #52c41a);
    --n-tag-color: var(--n-color-success, #52c41a);
}

.n-tag--outlined.n-tag--warning {
    border-color: var(--n-color-warning, #faad14);
    --n-tag-color: var(--n-color-warning-hover, #d48806);
}

.n-tag--outlined.n-tag--danger {
    border-color: var(--n-color-danger, #ff4d4f);
    --n-tag-color: var(--n-color-danger, #ff4d4f);
}

.n-tag--outlined.n-tag--info {
    border-color: var(--n-color-info, #1677ff);
    --n-tag-color: var(--n-color-info, #1677ff);
}

/* ====== Plain effect ====== */
.n-tag--plain {
    background: transparent !important;
}

.n-tag--plain.n-tag--default {
    --n-tag-color: var(--n-color-text-secondary, #888);
}

.n-tag--plain.n-tag--primary {
    --n-tag-color: var(--n-color-primary, #1677ff);
}

.n-tag--plain.n-tag--success {
    --n-tag-color: var(--n-color-success, #52c41a);
}

.n-tag--plain.n-tag--warning {
    --n-tag-color: var(--n-color-warning-hover, #d48806);
}

.n-tag--plain.n-tag--danger {
    --n-tag-color: var(--n-color-danger, #ff4d4f);
}

.n-tag--plain.n-tag--info {
    --n-tag-color: var(--n-color-info, #1677ff);
}

/* ====== Bordered (adds border on dark/light/plain) ====== */
.n-tag--bordered.n-tag--light {
    border: 1px solid var(--n-tag-color);
    opacity: 0.85;
}

.n-tag--bordered.n-tag--dark {
    border: 1px solid rgba(255, 255, 255, 0.35);
}

.n-tag--bordered.n-tag--plain {
    border: 1px solid var(--n-tag-color);
}

/* ====== Closable ====== */
.n-tag__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 2px;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    transition: all 0.2s;
    flex-shrink: 0;
}

.n-tag__close:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
}

.n-tag--dark .n-tag__close:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* ====== Icon ====== */
.n-tag__icon {
    flex-shrink: 0;
}

/* ====== Disabled ====== */
.n-tag--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

/* ====== Checkable ====== */
.n-tag--checkable {
    cursor: pointer;
    user-select: none;
}

.n-tag--checkable:hover {
    filter: brightness(0.95);
}

.n-tag--checkable.n-tag--checked {
    filter: brightness(1);
}

.n-tag--checkable:not(.n-tag--checked) {
    opacity: 0.65;
}

.n-tag--checkable:not(.n-tag--checked):hover {
    opacity: 0.85;
}
</style>
