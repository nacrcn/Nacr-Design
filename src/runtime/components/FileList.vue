<template>
    <div :class="['n-file-list', `n-file-list--${mode}`]">
        <div v-if="header || $slots.header" class="n-file-list__header">
            <slot name="header">
                <span class="n-file-list__title">{{ header }}</span>
            </slot>
            <div v-if="showModeToggle" class="n-file-list__mode-toggle">
                <button :class="['n-file-list__mode-btn', { 'n-file-list__mode-btn--active': mode === 'list' }]"
                    @click="$emit('update:mode', 'list')" title="列表模式">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </button>
                <button :class="['n-file-list__mode-btn', { 'n-file-list__mode-btn--active': mode === 'grid' }]"
                    @click="$emit('update:mode', 'grid')" title="小卡片模式">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                </button>
                <button :class="['n-file-list__mode-btn', { 'n-file-list__mode-btn--active': mode === 'card' }]"
                    @click="$emit('update:mode', 'card')" title="大卡片模式">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                    </svg>
                </button>
            </div>
        </div>

        <div :class="['n-file-list__body', { 'n-file-list__body--grid': mode === 'grid', 'n-file-list__body--card': mode === 'card' }]">
            <NFileListItem v-for="(file, index) in files" :key="file.uid || index" :file="file" :mode="mode"
                :selectable="selectable" :selected="isSelected(file)" :show-size="showSize" :show-date="showDate"
                :show-actions="showActions" :icons="icons" :colorful-icons="colorfulIcons"
                @click="$emit('file-click', file)"
                @select="handleSelect(file, $event)" @remove="handleRemove(file, index)">
                <template v-if="$slots['file-icon']" #icon="scope">
                    <slot name="file-icon" v-bind="scope" />
                </template>
                <template v-if="$slots['file-name']" #name="scope">
                    <slot name="file-name" v-bind="scope" />
                </template>
                <template v-if="$slots['file-actions']" #actions="scope">
                    <slot name="file-actions" v-bind="scope" />
                </template>
            </NFileListItem>

            <div v-if="!files.length" class="n-file-list__empty">
                <NIcon name="file" :size="32" color="var(--n-color-text-disabled, #9ca3af)" />
                <span>{{ emptyText }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
export interface FileItem {
    uid?: string | number
    name: string
    size?: number
    date?: string
    url?: string
    type?: string
    [key: string]: any
}

export type FileListMode = 'list' | 'grid' | 'card'

export interface FileIconMap {
    [ext: string]: string
}

const props = withDefaults(defineProps<{
    files?: FileItem[]
    mode?: FileListMode
    header?: string
    selectable?: boolean
    modelValue?: (string | number)[]
    showSize?: boolean
    showDate?: boolean
    showActions?: boolean
    showModeToggle?: boolean
    icons?: FileIconMap
    colorfulIcons?: string[]
    emptyText?: string
}>(), {
    files: () => [],
    mode: 'list',
    selectable: false,
    modelValue: () => [],
    showSize: true,
    showDate: false,
    showActions: true,
    showModeToggle: false,
    icons: () => ({}),
    colorfulIcons: () => [],
    emptyText: '暂无文件',
})

const emit = defineEmits<{
    'update:mode': [val: FileListMode]
    'update:modelValue': [val: (string | number)[]]
    'file-click': [file: FileItem]
    select: [file: FileItem, selected: boolean]
    remove: [file: FileItem, index: number]
}>()

function isSelected(file: FileItem) {
    const key = file.uid ?? file.name
    return props.modelValue.includes(key)
}

function handleSelect(file: FileItem, selected: boolean) {
    const key = file.uid ?? file.name
    let keys = [...props.modelValue]
    if (selected) {
        if (!keys.includes(key)) keys.push(key)
    } else {
        keys = keys.filter(k => k !== key)
    }
    emit('update:modelValue', keys)
    emit('select', file, selected)
}

function handleRemove(file: FileItem, index: number) {
    emit('remove', file, index)
}
</script>

<style scoped>
.n-file-list {
    --n-file-list-radius: var(--n-radius-lg, 8px);
    border: 1px solid var(--n-color-border);
    border-radius: var(--n-file-list-radius);
    background: var(--n-color-bg);
    overflow: hidden;
}

/* ====== Header ====== */
.n-file-list__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--n-color-border);
    background: var(--n-color-fill);
}

.n-file-list__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--n-color-text);
}

.n-file-list__mode-toggle {
    display: flex;
    gap: 2px;
    background: var(--n-color-fill-hover);
    border-radius: var(--n-radius-sm, 4px);
    padding: 2px;
}

.n-file-list__mode-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--n-radius-sm, 4px);
    background: transparent;
    color: var(--n-color-text-disabled);
    cursor: pointer;
    transition: all 0.2s;
}

.n-file-list__mode-btn--active {
    background: var(--n-color-bg);
    color: var(--n-color-primary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.n-file-list__mode-btn:not(.n-file-list__mode-btn--active):hover {
    color: var(--n-color-text-secondary);
}

/* ====== Body ====== */
.n-file-list__body {
    max-height: 480px;
    overflow-y: auto;
}

.n-file-list__body--grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
    padding: 12px;
    max-height: none;
}

.n-file-list__body--card {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
    max-height: none;
}

/* ====== Empty ====== */
.n-file-list__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 40px 16px;
    color: var(--n-color-text-disabled);
    font-size: 13px;
}
</style>
