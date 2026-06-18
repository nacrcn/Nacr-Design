<template>
    <div :class="paginationClass" v-if="!hideOnSinglePage || totalPages > 1">
        <!-- Total -->
        <span v-if="showTotal" class="n-pagination__total">
            <template v-if="typeof showTotal === 'boolean'">共 {{ total }} 条</template>
            <template v-else>第 {{ rangeStart }}-{{ rangeEnd }} 条 / 共 {{ total }} 条</template>
        </span>

        <!-- Prev -->
        <button class="n-pagination__btn n-pagination__btn--prev" :disabled="currentPage <= 1 || disabled"
            @click="changePage(currentPage - 1)">
            <slot name="prev">
                <template v-if="prevText">{{ prevText }}</template>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </slot>
        </button>

        <!-- Simple mode -->
        <div v-if="simple" class="n-pagination__simple-display">
            <input class="n-pagination__simple-input" :value="currentPage" :disabled="disabled"
                @change="handleSimpleInput" @keyup.enter="handleSimpleInput" />
            <span class="n-pagination__simple-separator">/</span>
            <span>{{ totalPages }}</span>
        </div>

        <!-- Pages -->
        <template v-else v-for="(p, idx) in pagerList" :key="idx">
            <span v-if="p === '...'" class="n-pagination__ellipsis">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            </span>
            <button v-else :class="['n-pagination__btn', { 'n-pagination__btn--active': p === currentPage }]"
                :disabled="disabled" @click="changePage(p as number)">{{ p }}</button>
        </template>

        <!-- Next -->
        <button class="n-pagination__btn n-pagination__btn--next" :disabled="currentPage >= totalPages || disabled"
            @click="changePage(currentPage + 1)">
            <slot name="next">
                <template v-if="nextText">{{ nextText }}</template>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </slot>
        </button>

        <!-- Size changer -->
        <div v-if="showSizeChanger" class="n-pagination__sizes">
            <NSelect v-model="innerPageSize" :options="pageSizeOptions" size="sm" :disabled="disabled"
                @change="handleSizeChange" />
        </div>

        <!-- Quick jumper -->
        <div v-if="showQuickJumper" class="n-pagination__jumper">
            <span>前往</span>
            <input class="n-pagination__jumper-input" :disabled="disabled" @keyup.enter="handleJumper" />
            <span>页</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = withDefaults(defineProps<{
    modelValue: number
    total: number
    pageSize?: number
    pageSizes?: number[]
    pagerCount?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: boolean | 'range'
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    simple?: boolean
    hideOnSinglePage?: boolean
    prevText?: string
    nextText?: string
}>(), {
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100],
    pagerCount: 7,
    showSizeChanger: false,
    showQuickJumper: false,
    showTotal: false,
    disabled: false,
    size: 'md',
    simple: false,
    hideOnSinglePage: false,
    prevText: '',
    nextText: '',
})

const emit = defineEmits<{
    'update:modelValue': [page: number]
    change: [page: number]
    pageSizeChange: [size: number]
}>()

const currentPage = computed(() => props.modelValue)
const innerPageSize = ref(props.pageSize)

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / innerPageSize.value)))

const rangeStart = computed(() => {
    if (props.total === 0) return 0
    return (currentPage.value - 1) * innerPageSize.value + 1
})

const rangeEnd = computed(() => {
    if (props.total === 0) return 0
    return Math.min(currentPage.value * innerPageSize.value, props.total)
})

const pageSizeOptions = computed(() => props.pageSizes.map(s => ({ label: `${s} 条/页`, value: s })))

const paginationClass = computed(() => [
    'n-pagination',
    `n-pagination--${props.size}`,
    {
        'n-pagination--disabled': props.disabled,
        'n-pagination--simple': props.simple,
    },
])

const pagerList = computed(() => {
    if (props.simple) {
        return [] as (number | string)[]
    }
    const pages: (number | string)[] = []
    const total = totalPages.value
    const current = currentPage.value
    const count = props.pagerCount

    if (total <= count) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        const half = Math.floor((count - 2) / 2)
        let start: number
        let end: number

        if (current <= half + 2) {
            start = 2
            end = count - 2
        } else if (current >= total - half - 1) {
            start = total - count + 3
            end = total - 1
        } else {
            start = current - half + 1
            end = current + half - 1
        }

        pages.push(1)
        if (start > 2) pages.push('...')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < total - 1) pages.push('...')
        pages.push(total)
    }
    return pages
})

function changePage(page: number) {
    if (props.disabled) return
    const p = Math.min(Math.max(1, page), totalPages.value)
    if (p !== currentPage.value) {
        emit('update:modelValue', p)
        emit('change', p)
    }
}

function handleSizeChange(val: any) {
    innerPageSize.value = val
    emit('pageSizeChange', val)
    if (currentPage.value > totalPages.value) {
        emit('update:modelValue', totalPages.value)
    }
}

function handleJumper(e: Event) {
  const input = e.target as HTMLInputElement
  const val = parseInt(input.value, 10)
  if (!isNaN(val)) {
    changePage(val)
  }
  input.value = ''
}

function handleSimpleInput(e: Event) {
  const input = e.target as HTMLInputElement
  const val = parseInt(input.value, 10)
  if (!isNaN(val)) {
    const p = Math.min(Math.max(1, val), totalPages.value)
    if (p !== currentPage.value) {
      emit('update:modelValue', p)
      emit('change', p)
    }
  }
  input.value = String(currentPage.value)
}

watch(() => props.pageSize, (v) => { innerPageSize.value = v })
</script>

<style scoped>
.n-pagination {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    user-select: none;
}

.n-pagination--disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* Sizes */
.n-pagination--sm .n-pagination__btn {
    min-width: 28px;
    height: 28px;
    padding: 0 4px;
    font-size: 13px;
}

.n-pagination--md .n-pagination__btn {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
}

.n-pagination--lg .n-pagination__btn {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    font-size: 15px;
}

.n-pagination--sm .n-pagination__ellipsis {
    min-width: 28px;
    height: 28px;
}

.n-pagination--md .n-pagination__ellipsis {
    min-width: 32px;
    height: 32px;
}

.n-pagination--lg .n-pagination__ellipsis {
    min-width: 36px;
    height: 36px;
}

/* Buttons */
.n-pagination__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border: 1px solid var(--n-color-border);
    background: var(--n-color-bg);
    border-radius: var(--n-radius-md);
    font-size: var(--n-font-size-md);
    color: var(--n-color-text);
    cursor: pointer;
    transition: all 0.15s;
}

.n-pagination__btn:hover:not(:disabled):not(.n-pagination__btn--active) {
    border-color: var(--n-color-primary);
    color: var(--n-color-primary);
}

.n-pagination__btn--active {
    background: var(--n-color-primary);
    border-color: var(--n-color-primary);
    color: #fff;
    font-weight: 500;
}

.n-pagination__btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

/* Ellipsis */
.n-pagination__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    color: var(--n-color-text-disabled);
    font-size: var(--n-font-size-md);
}

/* Simple mode */
.n-pagination--simple .n-pagination__ellipsis {
    display: none;
}

.n-pagination--simple {
    gap: 6px;
}

.n-pagination__simple-display {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--n-font-size-md);
    color: var(--n-color-text);
}

.n-pagination__simple-input {
    width: 48px;
    height: 28px;
    text-align: center;
    border: 1px solid var(--n-color-border);
    border-radius: var(--n-radius-md);
    font-size: var(--n-font-size-md);
    color: var(--n-color-text);
    background: var(--n-color-bg);
    outline: none;
    transition: border-color 0.2s;
}

.n-pagination__simple-input:focus {
    border-color: var(--n-color-primary);
}

.n-pagination__simple-separator {
    color: var(--n-color-text-secondary);
}

/* Total */
.n-pagination__total {
    margin-right: 8px;
    font-size: var(--n-font-size-sm);
    color: var(--n-color-text-secondary);
    white-space: nowrap;
}

/* Size changer */
.n-pagination__sizes {
    margin-left: 8px;
    min-width: 110px;
}

/* Quick jumper */
.n-pagination__jumper {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    font-size: var(--n-font-size-sm);
    color: var(--n-color-text-secondary);
    white-space: nowrap;
}

.n-pagination__jumper-input {
    width: 48px;
    height: 28px;
    text-align: center;
    border: 1px solid var(--n-color-border);
    border-radius: var(--n-radius-md);
    font-size: var(--n-font-size-sm);
    color: var(--n-color-text);
    background: var(--n-color-bg);
    outline: none;
    transition: border-color 0.2s;
}

.n-pagination__jumper-input:focus {
    border-color: var(--n-color-primary);
}

.n-pagination__jumper-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
