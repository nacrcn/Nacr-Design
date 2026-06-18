<template>
    <div class="n-popover" ref="popoverRef">
        <div class="n-popover__trigger" @click="onTriggerClick" @mouseenter="onEnter" @mouseleave="onLeave"
            @focus="onFocus" @blur="onBlur">
            <slot name="trigger" />
        </div>
        <teleport to="body">
            <transition name="n-popover__fade">
                <div v-show="isVisible" ref="panelRef" :class="[
                    'n-popover__panel',
                    `n-popover__panel--${placement}`,
                    { 'n-popover__panel--no-arrow': !arrow },
                ]" :style="panelStyle" @mouseenter="onPanelEnter" @mouseleave="onPanelLeave">
                    <div v-if="arrow" class="n-popover__arrow" />
                    <div v-if="title || $slots.header" class="n-popover__header">
                        <slot name="header">
                            <div class="n-popover__title">{{ title }}</div>
                        </slot>
                    </div>
                    <div class="n-popover__content">
                        <slot />
                    </div>
                    <div v-if="$slots.footer" class="n-popover__footer">
                        <slot name="footer" />
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount,watch,nextTick } from 'vue'
type Placement =
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'

const props = withDefaults(defineProps<{
    title?: string
    trigger?: 'hover' | 'click' | 'focus' | 'manual'
    placement?: Placement
    arrow?: boolean
    offset?: number
    width?: number | string
    delay?: number | [number, number]
    disabled?: boolean
    modelValue?: boolean
}>(), {
    trigger: 'hover',
    placement: 'top',
    arrow: true,
    offset: 8,
    width: undefined,
    delay: undefined,
    disabled: false,
    modelValue: undefined,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'update:visible': [value: boolean]
    'show': []
    'hide': []
}>()

const popoverRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const innerVisible = ref(false)
const panelStyle = ref<Record<string, string>>({})

let hoverTimer: ReturnType<typeof setTimeout> | null = null
let focusTimer: ReturnType<typeof setTimeout> | null = null

const isVisible = computed({
    get: () => props.modelValue !== undefined ? props.modelValue : innerVisible.value,
    set: (v: boolean) => {
        innerVisible.value = v
        emit('update:modelValue', v)
        emit('update:visible', v)
        if (v) emit('show')
        else emit('hide')
    },
})

const delayShow = computed(() => {
    if (props.delay === undefined) return 0
    return Array.isArray(props.delay) ? props.delay[0] : props.delay
})

const delayHide = computed(() => {
    if (props.delay === undefined) return 150
    return Array.isArray(props.delay) ? props.delay[1] : props.delay
})

function show() {
    if (props.disabled) return
    isVisible.value = true
    nextTick(updatePos)
}

function hide() {
    isVisible.value = false
}

function onTriggerClick() {
    if (props.trigger !== 'click') return
    if (isVisible.value) hide()
    else show()
}

function onEnter() {
    if (props.trigger !== 'hover') return
    if (hoverTimer) clearTimeout(hoverTimer)
    hoverTimer = setTimeout(show, delayShow.value)
}

function onLeave() {
    if (props.trigger !== 'hover') return
    if (hoverTimer) clearTimeout(hoverTimer)
    hoverTimer = setTimeout(hide, delayHide.value)
}

function onPanelEnter() {
    if (props.trigger !== 'hover') return
    if (hoverTimer) clearTimeout(hoverTimer)
}

function onPanelLeave() {
    if (props.trigger !== 'hover') return
    if (hoverTimer) clearTimeout(hoverTimer)
    hoverTimer = setTimeout(hide, delayHide.value)
}

function onFocus() {
    if (props.trigger !== 'focus') return
    if (focusTimer) clearTimeout(focusTimer)
    show()
}

function onBlur() {
    if (props.trigger !== 'focus') return
    focusTimer = setTimeout(hide, 100)
}

function updatePos() {
    if (!popoverRef.value || !panelRef.value) return
    const trigger = popoverRef.value.getBoundingClientRect()
    const panel = panelRef.value.getBoundingClientRect()
    const gap = props.offset
    let top = 0, left = 0

    const p = props.placement
    if (p === 'top') {
        top = trigger.top - panel.height - gap
        left = trigger.left + (trigger.width - panel.width) / 2
    } else if (p === 'top-start') {
        top = trigger.top - panel.height - gap
        left = trigger.left
    } else if (p === 'top-end') {
        top = trigger.top - panel.height - gap
        left = trigger.right - panel.width
    } else if (p === 'bottom') {
        top = trigger.bottom + gap
        left = trigger.left + (trigger.width - panel.width) / 2
    } else if (p === 'bottom-start') {
        top = trigger.bottom + gap
        left = trigger.left
    } else if (p === 'bottom-end') {
        top = trigger.bottom + gap
        left = trigger.right - panel.width
    } else if (p === 'left') {
        top = trigger.top + (trigger.height - panel.height) / 2
        left = trigger.left - panel.width - gap
    } else if (p === 'left-start') {
        top = trigger.top
        left = trigger.left - panel.width - gap
    } else if (p === 'left-end') {
        top = trigger.bottom - panel.height
        left = trigger.left - panel.width - gap
    } else if (p === 'right') {
        top = trigger.top + (trigger.height - panel.height) / 2
        left = trigger.right + gap
    } else if (p === 'right-start') {
        top = trigger.top
        left = trigger.right + gap
    } else if (p === 'right-end') {
        top = trigger.bottom - panel.height
        left = trigger.right + gap
    }

    const style: Record<string, string> = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: '1050',
    }

    if (props.width !== undefined) {
        style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }

    panelStyle.value = style
}

function onClickOutside(e: MouseEvent) {
    if (popoverRef.value?.contains(e.target as Node) || panelRef.value?.contains(e.target as Node)) return
    isVisible.value = false
}

function onScroll() {
    if (isVisible.value) updatePos()
}

watch(isVisible, (v) => {
    if (v) {
        nextTick(updatePos)
        if (props.trigger === 'click') document.addEventListener('click', onClickOutside)
    } else {
        if (props.trigger === 'click') document.removeEventListener('click', onClickOutside)
    }
})

watch(() => props.modelValue, (v) => {
    if (v !== undefined) {
        innerVisible.value = v
        if (v) nextTick(updatePos)
    }
})

onMounted(() => window.addEventListener('scroll', onScroll, true))
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    window.removeEventListener('scroll', onScroll, true)
})

defineExpose({ show, hide, updatePos })
</script>

<style scoped>
.n-popover {
    display: inline-block;
}

.n-popover__trigger {
    display: inline-flex;
    cursor: pointer;
}

.n-popover__panel {
    background: var(--n-color-bg-elevated);
    border-radius: var(--n-radius-lg);
    box-shadow: var(--n-shadow-lg);
    padding: 12px 16px;
    max-width: 360px;
    word-wrap: break-word;
}

.n-popover__panel--no-arrow {
    padding: 12px 16px;
}

.n-popover__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--n-color-bg-elevated);
    transform: rotate(45deg);
}

/* Arrow positions */
.n-popover__panel--top .n-popover__arrow,
.n-popover__panel--top-start .n-popover__arrow,
.n-popover__panel--top-end .n-popover__arrow {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
}

.n-popover__panel--top-start .n-popover__arrow {
    left: 16px;
    margin-left: 0;
}

.n-popover__panel--top-end .n-popover__arrow {
    left: auto;
    right: 16px;
    margin-left: 0;
}

.n-popover__panel--bottom .n-popover__arrow,
.n-popover__panel--bottom-start .n-popover__arrow,
.n-popover__panel--bottom-end .n-popover__arrow {
    top: -4px;
    left: 50%;
    margin-left: -4px;
}

.n-popover__panel--bottom-start .n-popover__arrow {
    left: 16px;
    margin-left: 0;
}

.n-popover__panel--bottom-end .n-popover__arrow {
    left: auto;
    right: 16px;
    margin-left: 0;
}

.n-popover__panel--left .n-popover__arrow,
.n-popover__panel--left-start .n-popover__arrow,
.n-popover__panel--left-end .n-popover__arrow {
    right: -4px;
    top: 50%;
    margin-top: -4px;
}

.n-popover__panel--left-start .n-popover__arrow {
    top: 16px;
    margin-top: 0;
}

.n-popover__panel--left-end .n-popover__arrow {
    top: auto;
    bottom: 16px;
    margin-top: 0;
}

.n-popover__panel--right .n-popover__arrow,
.n-popover__panel--right-start .n-popover__arrow,
.n-popover__panel--right-end .n-popover__arrow {
    left: -4px;
    top: 50%;
    margin-top: -4px;
}

.n-popover__panel--right-start .n-popover__arrow {
    top: 16px;
    margin-top: 0;
}

.n-popover__panel--right-end .n-popover__arrow {
    top: auto;
    bottom: 16px;
    margin-top: 0;
}

.n-popover__header {
    margin-bottom: 8px;
}

.n-popover__title {
    font-weight: 600;
    font-size: var(--n-font-size-md);
    color: var(--n-color-text);
}

.n-popover__content {
    font-size: var(--n-font-size-sm);
    color: var(--n-color-text-secondary);
    line-height: 1.6;
}

.n-popover__footer {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.n-popover__fade-enter-active,
.n-popover__fade-leave-active {
    transition: opacity 0.15s ease;
}

.n-popover__fade-enter-from,
.n-popover__fade-leave-to {
    opacity: 0;
}
</style>
