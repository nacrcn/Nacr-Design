<template>
    <div
        :class="['n-mention', `n-mention--${size}`, { 'n-mention--disabled': disabled, 'n-mention--focused': isFocused }]">
        <div class="n-mention__wrapper">
            <textarea ref="textareaRef" class="n-mention__textarea" :value="modelValue" :placeholder="placeholder"
                :disabled="disabled" :readonly="readonly" :rows="rows" :maxlength="maxlength" @input="handleInput"
                @keydown="handleKeydown" @focus="isFocused = true" @blur="handleBlur" />
            <div v-if="showClear" class="n-mention__clear" @mousedown.prevent="handleClear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
        </div>
        <div v-if="showCount && maxlength" class="n-mention__count">{{ currentLength }} / {{ maxlength }}</div>
        <transition name="n-mention-fade">
            <div v-show="showDropdown" ref="dropdownRef"
                :class="['n-mention__dropdown', `n-mention__dropdown--${placement}`]">
                <div v-if="loading" class="n-mention__loading">
                    <span class="n-mention__loading-spinner" />
                    <span>加载中...</span>
                </div>
                <template v-else>
                    <div v-if="filteredOptions.length === 0" class="n-mention__empty">{{ emptyText }}</div>
                    <div v-for="(item, i) in filteredOptions" :key="item.value"
                        :class="['n-mention__option', { 'n-mention__option--active': activeIndex === i }]"
                        @click.stop="handleSelect(item)" @mouseenter="activeIndex = i">
                        <slot name="option" :option="item" :index="i">
                            <img v-if="item.avatar" :src="item.avatar" class="n-mention__option-avatar" />
                            <div class="n-mention__option-content">
                                <span class="n-mention__option-label">{{ item.label }}</span>
                                <span v-if="item.description" class="n-mention__option-desc">{{ item.description
                                    }}</span>
                            </div>
                        </slot>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'

export interface MentionOption {
    label: string
    value: string
    avatar?: string
    description?: string
    disabled?: boolean
    prefix?: string
    [key: string]: any
}

const props = withDefaults(defineProps<{
    modelValue: string
    options?: MentionOption[]
    prefix?: string | string[]
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    rows?: number
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    filter?: (pattern: string, option: MentionOption) => boolean
    placement?: 'bottom-start' | 'bottom' | 'top-start' | 'top'
    whole?: boolean
    clearable?: boolean
    maxlength?: number
    showCount?: boolean
    emptyText?: string
}>(), {
    options: () => [],
    prefix: '@',
    placeholder: '输入 @ 提及',
    disabled: false,
    readonly: false,
    rows: 3,
    size: 'md',
    loading: false,
    placement: 'bottom-start',
    whole: false,
    clearable: false,
    showCount: false,
    emptyText: '无匹配结果',
})

const emit = defineEmits<{
    'update:modelValue': [v: string]
    select: [option: MentionOption, prefix: string]
    search: [pattern: string, prefix: string]
    focus: [e: FocusEvent]
    blur: [e: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const dropdownRef = ref<HTMLDivElement>()
const showDropdown = ref(false)
const activeIndex = ref(0)
const searchStart = ref(-1)
const searchText = ref('')
const activePrefix = ref('')
const isFocused = ref(false)
const cursorPos = ref(0)

const prefixes = computed(() => Array.isArray(props.prefix) ? props.prefix : [props.prefix])

const currentLength = computed(() => (props.modelValue || '').length)

const showClear = computed(() => props.clearable && !props.disabled && !props.readonly && props.modelValue.length > 0)

const filteredOptions = computed(() => {
    let list = props.options.filter(o => !o.disabled)
    // 多前缀时，按当前触发的前缀过滤选项
    if (prefixes.value.length > 1 && activePrefix.value) {
        list = list.filter(o => {
            if (o.prefix !== undefined) return o.prefix === activePrefix.value
            return true
        })
    }
    if (props.filter) {
        list = list.filter(o => props.filter!(searchText.value, o))
    } else if (searchText.value) {
        const lower = searchText.value.toLowerCase()
        list = list.filter(o => o.label.toLowerCase().includes(lower) || o.value.toLowerCase().includes(lower))
    }
    return list
})

function handleInput(e: Event) {
    const el = e.target as HTMLTextAreaElement
    emit('update:modelValue', el.value ?? '')
    cursorPos.value = el.selectionStart ?? el.value.length
    const pos = cursorPos.value
    const val = el.value
    const before = val.slice(0, pos)

    let found = false
    for (const pfx of prefixes.value) {
        const lastIdx = before.lastIndexOf(pfx)
        if (lastIdx !== -1) {
            const after = before.slice(lastIdx + pfx.length)
            if (!after.includes(' ') && !after.includes('\n')) {
                showDropdown.value = true
                searchStart.value = lastIdx
                searchText.value = after
                activePrefix.value = pfx
                activeIndex.value = 0
                found = true
                emit('search', after, pfx)
                break
            }
        }
    }
    if (!found) {
        showDropdown.value = false
    }
}

function handleKeydown(e: KeyboardEvent) {
    if (!showDropdown.value) return
    const len = filteredOptions.value.length
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        activeIndex.value = (activeIndex.value + 1) % Math.max(len, 1)
        scrollToActive()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        activeIndex.value = (activeIndex.value - 1 + len) % Math.max(len, 1)
        scrollToActive()
    } else if (e.key === 'Enter' && !e.shiftKey && len > 0) {
        e.preventDefault()
        handleSelect(filteredOptions.value[activeIndex.value])
    } else if (e.key === 'Escape') {
        showDropdown.value = false
    }
}

function handleSelect(item: MentionOption) {
    const val = props.modelValue
    const replaceText = props.whole ? item.value : `${item.label}`
    const before = val.slice(0, searchStart.value) + activePrefix.value + replaceText + ' '
    const after = val.slice(cursorPos.value)
    emit('update:modelValue', before + after)
    showDropdown.value = false
    emit('select', item, activePrefix.value)
    nextTick(() => {
        if (textareaRef.value) {
            const newPos = searchStart.value + activePrefix.value.length + replaceText.length + 1
            textareaRef.value.focus()
            textareaRef.value.setSelectionRange(newPos, newPos)
        }
    })
}

function handleBlur(e: FocusEvent) {
    isFocused.value = false
    setTimeout(() => {
        showDropdown.value = false
    }, 150)
    emit('blur', e)
}

function handleClear() {
    emit('update:modelValue', '')
    if (textareaRef.value) {
        textareaRef.value.focus()
    }
}

function scrollToActive() {
    nextTick(() => {
        if (!dropdownRef.value) return
        const active = dropdownRef.value.querySelector('.n-mention__option--active') as HTMLElement
        if (active) {
            active.scrollIntoView({ block: 'nearest' })
        }
    })
}

function onClickOutside(e: MouseEvent) {
    const target = e.target as Node
    if (textareaRef.value?.contains(target) || dropdownRef.value?.contains(target)) return
    showDropdown.value = false
}

if (typeof document !== 'undefined') {
    document.addEventListener('mousedown', onClickOutside)
}
onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', onClickOutside)
    }
})

defineExpose({ focus: () => textareaRef.value?.focus(), blur: () => textareaRef.value?.blur() })
</script>

<style scoped>
.n-mention {
    position: relative;
    display: inline-block;
    width: 100%;
}

.n-mention--disabled {
    opacity: .5;
    pointer-events: none;
}

.n-mention--focused .n-mention__wrapper {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, .15);
}

.n-mention__wrapper {
    position: relative;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 6px;
    background: var(--n-color-bg);
    transition: border-color .2s, box-shadow .2s;
    overflow: hidden;
}

.n-mention__wrapper:hover {
    border-color: var(--n-color-primary-light);
}

.n-mention--focused .n-mention__wrapper {
    border-color: var(--n-color-primary);
}

.n-mention__textarea {
    width: 100%;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    color: var(--n-color-text-secondary);
    resize: vertical;
    outline: none;
    background: transparent;
    box-sizing: border-box;
    font-family: inherit;
    line-height: 1.6;
}

.n-mention--sm .n-mention__textarea {
    padding: 4px 10px;
    font-size: 12px;
}

.n-mention--lg .n-mention__textarea {
    padding: 12px 14px;
    font-size: 16px;
}

.n-mention__textarea::placeholder {
    color: var(--n-color-text-quaternary);
}

.n-mention__clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--n-color-text-quaternary);
    border-radius: 50%;
    transition: color .2s, background .2s;
    z-index: 1;
}

.n-mention__clear:hover {
    color: var(--n-color-text-secondary);
    background: var(--n-color-fill);
}

.n-mention__count {
    text-align: right;
    font-size: 12px;
    color: var(--n-color-text-quaternary);
    margin-top: 4px;
    padding-right: 4px;
}

.n-mention__dropdown {
    position: absolute;
    min-width: 220px;
    max-height: 240px;
    overflow-y: auto;
    background: var(--n-color-bg);
    border: 1px solid var(--n-color-border);
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .12);
    z-index: 1050;
    padding: 4px;
}

.n-mention__dropdown--bottom-start {
    top: calc(100% + 4px);
    left: 0;
}

.n-mention__dropdown--bottom {
    top: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
}

.n-mention__dropdown--top-start {
    bottom: calc(100% + 4px);
    left: 0;
}

.n-mention__dropdown--top {
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
}

.n-mention__option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 14px;
    color: var(--n-color-text-secondary);
    transition: all .15s;
}

.n-mention__option:hover,
.n-mention__option--active {
    background: var(--n-color-primary-light);
    color: var(--n-color-primary);
}

.n-mention__option-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.n-mention__option-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.n-mention__option-label {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.n-mention__option-desc {
    font-size: 12px;
    color: var(--n-color-text-quaternary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.n-mention__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    color: var(--n-color-text-quaternary);
    font-size: 13px;
}

.n-mention__loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--n-color-border);
    border-top-color: var(--n-color-primary);
    border-radius: 50%;
    animation: n-mention-spin .6s linear infinite;
}

@keyframes n-mention-spin {
    to {
        transform: rotate(360deg);
    }
}

.n-mention__empty {
    padding: 16px;
    text-align: center;
    color: var(--n-color-text-quaternary);
    font-size: 13px;
}

.n-mention-fade-enter-active,
.n-mention-fade-leave-active {
    transition: all .15s ease;
}

.n-mention-fade-enter-from,
.n-mention-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
