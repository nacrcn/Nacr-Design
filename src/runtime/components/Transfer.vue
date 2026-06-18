<template>
  <div :class="['n-transfer', `n-transfer--${size}`, { 'n-transfer--disabled': disabled }]">
    <!-- Left Panel -->
    <div class="n-transfer__panel">
      <div class="n-transfer__header">
        <NCheckbox
          :model-value="isAllLeft"
          :indeterminate="isSomeLeft"
          :disabled="disabled || filteredLeft.length === 0"
          @change="toggleAllLeft"
        />
        <span class="n-transfer__header-title">{{ titles[0] }}</span>
        <span class="n-transfer__header-count">{{ leftChecked.length }}/{{ filteredLeft.length }}</span>
      </div>
      <div v-if="showSearch" class="n-transfer__search">
        <input
          v-model="leftSearch"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
          class="n-transfer__search-input"
        />
      </div>
      <div class="n-transfer__list" @scroll="onScroll($event, 'left')">
        <template v-if="filteredLeft.length">
          <label
            v-for="item in paginatedLeft"
            :key="item.value"
            :class="['n-transfer__item', { 'n-transfer__item--disabled': item.disabled, 'n-transfer__item--highlight': highlightValue === item.value }]"
            @click="onItemClick(item, 'left')"
          >
            <NCheckbox
              :model-value="leftChecked.includes(item.value)"
              :disabled="item.disabled || disabled"
              @change="toggleLeft(item.value)"
              @click.stop
            />
            <slot name="item" :option="item" :direction="'left'">
              <span class="n-transfer__item-label">{{ item.label }}</span>
            </slot>
          </label>
          <div v-if="hasMoreLeft" class="n-transfer__load-more">滚动加载更多...</div>
        </template>
        <div v-else class="n-transfer__empty">{{ emptyText }}</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="n-transfer__actions">
      <NButton size="sm" :disabled="disabled || !leftChecked.length" @click="moveToRight">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </NButton>
      <NButton size="sm" :disabled="disabled || !rightChecked.length" @click="moveToLeft">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </NButton>
    </div>

    <!-- Right Panel -->
    <div class="n-transfer__panel">
      <div class="n-transfer__header">
        <NCheckbox
          :model-value="isAllRight"
          :indeterminate="isSomeRight"
          :disabled="disabled || filteredRight.length === 0"
          @change="toggleAllRight"
        />
        <span class="n-transfer__header-title">{{ titles[1] }}</span>
        <span class="n-transfer__header-count">{{ rightChecked.length }}/{{ filteredRight.length }}</span>
      </div>
      <div v-if="showSearch" class="n-transfer__search">
        <input
          v-model="rightSearch"
          :placeholder="filterPlaceholder"
          :disabled="disabled"
          class="n-transfer__search-input"
        />
      </div>
      <div class="n-transfer__list" @scroll="onScroll($event, 'right')">
        <template v-if="filteredRight.length">
          <label
            v-for="item in paginatedRight"
            :key="item.value"
            :class="['n-transfer__item', { 'n-transfer__item--disabled': item.disabled, 'n-transfer__item--highlight': highlightValue === item.value }]"
            @click="onItemClick(item, 'right')"
          >
            <NCheckbox
              :model-value="rightChecked.includes(item.value)"
              :disabled="item.disabled || disabled"
              @change="toggleRight(item.value)"
              @click.stop
            />
            <slot name="item" :option="item" :direction="'right'">
              <span class="n-transfer__item-label">{{ item.label }}</span>
            </slot>
          </label>
          <div v-if="hasMoreRight" class="n-transfer__load-more">滚动加载更多...</div>
        </template>
        <div v-else class="n-transfer__empty">{{ emptyText }}</div>
      </div>
      <div v-if="showClearRight && rightData.length > 0" class="n-transfer__footer">
        <span class="n-transfer__clear-btn" @click="clearRight">清空</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface TransferOption {
  label: string
  value: any
  disabled?: boolean
  [key: string]: any
}

const props = withDefaults(defineProps<{
  options: TransferOption[]
  modelValue: any[]
  disabled?: boolean
  showSearch?: boolean
  filterable?: boolean
  filter?: (query: string, option: TransferOption) => boolean
  titles?: [string, string]
  filterPlaceholder?: string
  pageSize?: number
  size?: 'sm' | 'md' | 'lg'
  showClearRight?: boolean
  emptyText?: string
}>(), {
  disabled: false,
  showSearch: false,
  filterable: true,
  titles: () => ['源列表', '目标列表'] as [string, string],
  filterPlaceholder: '搜索...',
  pageSize: 50,
  size: 'md',
  showClearRight: false,
  emptyText: '暂无数据',
})

const emit = defineEmits<{
  'update:modelValue': [v: any[]]
  change: [targetValues: any[], direction: 'left' | 'right', movedValues: any[]]
  search: [direction: 'left' | 'right', query: string]
  scroll: [direction: 'left' | 'right', event: Event]
}>()

const leftSearch = ref('')
const rightSearch = ref('')
const leftChecked = ref<any[]>([])
const rightChecked = ref<any[]>([])
const leftPage = ref(1)
const rightPage = ref(1)
const highlightValue = ref<any>(null)
let highlightTimer: ReturnType<typeof setTimeout> | null = null

const leftData = computed(() => props.options.filter(o => !props.modelValue.includes(o.value)))
const rightData = computed(() => props.options.filter(o => props.modelValue.includes(o.value)))

const defaultFilter = (query: string, option: TransferOption) =>
  option.label.toLowerCase().includes(query.toLowerCase()) ||
  String(option.value).toLowerCase().includes(query.toLowerCase())

const filteredLeft = computed(() => {
  let list = leftData.value
  if (leftSearch.value) {
    const fn = props.filter || defaultFilter
    list = list.filter(o => fn(leftSearch.value, o))
  }
  return list
})

const filteredRight = computed(() => {
  let list = rightData.value
  if (rightSearch.value) {
    const fn = props.filter || defaultFilter
    list = list.filter(o => fn(rightSearch.value, o))
  }
  return list
})

const paginatedLeft = computed(() => {
  return filteredLeft.value.slice(0, props.pageSize * leftPage.value)
})
const hasMoreLeft = computed(() => filteredLeft.value.length > props.pageSize * leftPage.value)

const paginatedRight = computed(() => {
  return filteredRight.value.slice(0, props.pageSize * rightPage.value)
})
const hasMoreRight = computed(() => filteredRight.value.length > props.pageSize * rightPage.value)

const isAllLeft = computed(() => filteredLeft.value.length > 0 && filteredLeft.value.every(o => leftChecked.value.includes(o.value) || o.disabled))
const isSomeLeft = computed(() => filteredLeft.value.some(o => leftChecked.value.includes(o.value)) && !isAllLeft.value)
const isAllRight = computed(() => filteredRight.value.length > 0 && filteredRight.value.every(o => rightChecked.value.includes(o.value) || o.disabled))
const isSomeRight = computed(() => filteredRight.value.some(o => rightChecked.value.includes(o.value)) && !isAllRight.value)

watch(leftSearch, () => { leftPage.value = 1; leftChecked.value = [] })
watch(rightSearch, () => { rightPage.value = 1; rightChecked.value = [] })

function toggleLeft(val: any) {
  if (props.disabled) return
  leftChecked.value = leftChecked.value.includes(val)
    ? leftChecked.value.filter(v => v !== val)
    : [...leftChecked.value, val]
}
function toggleRight(val: any) {
  if (props.disabled) return
  rightChecked.value = rightChecked.value.includes(val)
    ? rightChecked.value.filter(v => v !== val)
    : [...rightChecked.value, val]
}
function toggleAllLeft() {
  leftChecked.value = isAllLeft.value
    ? []
    : filteredLeft.value.filter(o => !o.disabled).map(o => o.value)
}
function toggleAllRight() {
  rightChecked.value = isAllRight.value
    ? []
    : filteredRight.value.filter(o => !o.disabled).map(o => o.value)
}

function onItemClick(item: TransferOption, dir: 'left' | 'right') {
  if (item.disabled || props.disabled) return
  if (dir === 'left') toggleLeft(item.value)
  else toggleRight(item.value)
}

function moveToRight() {
  const movedValues = [...leftChecked.value]
  const newVal = [...props.modelValue, ...movedValues]
  emit('update:modelValue', newVal)
  emit('change', newVal, 'right', movedValues)
  highlightItems(movedValues)
  leftChecked.value = []
}
function moveToLeft() {
  const movedValues = [...rightChecked.value]
  const newVal = props.modelValue.filter((v: any) => !rightChecked.value.includes(v))
  emit('update:modelValue', newVal)
  emit('change', newVal, 'left', movedValues)
  highlightItems(movedValues)
  rightChecked.value = []
}

function highlightItems(values: any[]) {
  if (highlightTimer) clearTimeout(highlightTimer)
  values.forEach(v => {
    highlightValue.value = v
  })
  highlightTimer = setTimeout(() => { highlightValue.value = null }, 1500)
}

function clearRight() {
  if (props.disabled) return
  const movedValues = rightData.value.map(o => o.value)
  emit('update:modelValue', [])
  emit('change', [], 'left', movedValues)
}

function onScroll(e: Event, direction: 'left' | 'right') {
  emit('scroll', direction, e)
  const el = e.target as HTMLElement
  const threshold = 50
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
    if (direction === 'left' && hasMoreLeft.value) leftPage.value++
    if (direction === 'right' && hasMoreRight.value) rightPage.value++
  }
}

defineExpose({ clearRight })
</script>

<style scoped>
.n-transfer { display: flex; gap: 12px; align-items: flex-start; }
.n-transfer--disabled { opacity: .5; pointer-events: none; }

.n-transfer__panel {
  width: 260px; border: 1px solid var(--n-color-border); border-radius: 8px;
  background: var(--n-color-bg); overflow: hidden; display: flex; flex-direction: column;
}
.n-transfer--sm .n-transfer__panel { width: 200px; }
.n-transfer--lg .n-transfer__panel { width: 320px; }

.n-transfer__header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-bottom: 1px solid var(--n-color-fill-hover); background: var(--n-color-fill-quaternary);
}
.n-transfer__header-title { flex: 1; font-size: 14px; font-weight: 500; color: var(--n-color-text-secondary); }
.n-transfer__header-count { font-size: 12px; color: var(--n-color-text-quaternary); }

.n-transfer__search { padding: 8px 10px; }
.n-transfer__search-input {
  width: 100%; border: 1px solid var(--n-color-border); border-radius: 6px;
  padding: 6px 10px; font-size: 13px; outline: none; box-sizing: border-box;
  color: var(--n-color-text-secondary); background: var(--n-color-bg); transition: border-color .2s;
}
.n-transfer__search-input::placeholder { color: var(--n-color-text-quaternary); }
.n-transfer__search-input:focus { border-color: var(--n-color-primary); box-shadow: 0 0 0 2px rgba(59,130,246,.1); }

.n-transfer__list { min-height: 60px; max-height: 260px; overflow-y: auto; padding: 4px; flex: 1; }
.n-transfer--sm .n-transfer__list { max-height: 180px; }
.n-transfer--lg .n-transfer__list { max-height: 340px; }

.n-transfer__item {
  display: flex; align-items: center; gap: 8px; padding: 7px 10px; cursor: pointer;
  border-radius: 6px; font-size: 14px; color: var(--n-color-text-secondary);
  transition: background .15s, color .15s;
}
.n-transfer--sm .n-transfer__item { padding: 5px 8px; font-size: 12px; }
.n-transfer--lg .n-transfer__item { padding: 10px 12px; font-size: 15px; }

.n-transfer__item:hover:not(.n-transfer__item--disabled) { background: var(--n-color-fill-hover); }
.n-transfer__item--disabled { opacity: .45; cursor: not-allowed; }
.n-transfer__item--highlight { background: rgba(59,130,246,.08); transition: background .3s; }

.n-transfer__item-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.n-transfer__empty { padding: 24px 0; text-align: center; color: var(--n-color-text-quaternary); font-size: 13px; }

.n-transfer__load-more { padding: 8px; text-align: center; font-size: 12px; color: var(--n-color-text-quaternary); }

.n-transfer__footer { padding: 6px 14px; border-top: 1px solid var(--n-color-fill-hover); text-align: right; }
.n-transfer__clear-btn { font-size: 12px; color: var(--n-color-primary); cursor: pointer; transition: opacity .2s; }
.n-transfer__clear-btn:hover { opacity: .8; }

.n-transfer__actions { display: flex; flex-direction: column; gap: 8px; padding-top: 50px; }
</style>
