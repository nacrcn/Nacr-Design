<template>
  <div :class="['n-table-wrapper', { 'n-table-wrapper--bordered': bordered }]">
    <!-- Toolbar slot -->
    <div v-if="$slots.toolbar" class="n-table__toolbar">
      <slot name="toolbar" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="n-table__loading">
      <div class="n-table__loading-spinner" />
      <span class="n-table__loading-text">{{ loadingText }}</span>
    </div>

    <div :class="['n-table-scroll', { 'n-table-scroll--x': scroll?.x }]" :style="scrollStyle">
      <table :class="['n-table', `n-table--${size}`, { 'n-table--stripe': stripe, 'n-table--bordered': bordered, 'n-table--fixed': tableLayoutFixed }]">
        <!-- Colgroup for width -->
        <colgroup>
          <col v-if="expandedRowRender || $slots['expand-row']" style="width: 48px;" />
          <col v-if="rowSelection" style="width: 48px;" />
          <col v-for="col in flatColumns" :key="col.dataIndex" :style="getColStyle(col)" />
        </colgroup>

        <!-- Header -->
        <thead>
          <tr v-if="hasGroupHeader">
            <th v-if="expandedRowRender || $slots['expand-row']" class="n-table__th n-table__th--expand" rowspan="2" />
            <th v-if="rowSelection" class="n-table__th n-table__th--selection" rowspan="2">
              <label v-if="rowSelection.type === 'checkbox'" class="n-table__checkbox">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isSomeSelected"
                  @change="handleSelectAll"
                />
                <span class="n-table__checkbox-mark" />
              </label>
            </th>
            <template v-for="(group, gi) in groupedColumns" :key="gi">
              <th v-if="group.children" colspan="group.children.length" class="n-table__th n-table__th--group">
                <slot :name="group.titleSlotName" :column="group">{{ group.title }}</slot>
              </th>
              <th v-else :rowspan="2" :class="['n-table__th', `n-table__th--${group.align || 'left'}`, { 'n-table__th--sortable': group.sortable }]">
                <div class="n-table__th-inner">
                  <slot :name="group.titleSlotName" :column="group">{{ group.title }}</slot>
                  <span v-if="group.sortable" class="n-table__sorter" @click="handleSort(group)">
                    <span :class="['n-table__sorter-up', { active: sortDataIndex === group.dataIndex && sortOrder === 'ascend' }]">▲</span>
                    <span :class="['n-table__sorter-down', { active: sortDataIndex === group.dataIndex && sortOrder === 'descend' }]">▼</span>
                  </span>
                </div>
              </th>
            </template>
          </tr>
          <tr v-else>
            <th v-if="expandedRowRender || $slots['expand-row']" class="n-table__th n-table__th--expand" />
            <th v-if="rowSelection" class="n-table__th n-table__th--selection">
              <label v-if="rowSelection.type === 'checkbox'" class="n-table__checkbox">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isSomeSelected"
                  @change="handleSelectAll"
                />
                <span class="n-table__checkbox-mark" />
              </label>
            </th>
            <th
              v-for="col in flatColumns"
              :key="col.dataIndex"
              :class="['n-table__th', `n-table__th--${col.align || 'left'}`, { 'n-table__th--sortable': col.sortable }]"
            >
              <div class="n-table__th-inner">
                <slot :name="col.titleSlotName" :column="col">{{ col.title }}</slot>
                <span v-if="col.sortable" class="n-table__sorter" @click="handleSort(col)">
                  <span :class="['n-table__sorter-up', { active: sortDataIndex === col.dataIndex && sortOrder === 'ascend' }]">▲</span>
                  <span :class="['n-table__sorter-down', { active: sortDataIndex === col.dataIndex && sortOrder === 'descend' }]">▼</span>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <template v-if="processedData.length">
            <template v-for="(record, ri) in processedData" :key="getRowKey(record, ri)">
              <tr
                :class="trClasses(record, ri)"
                :style="trStyle(record, ri)"
                @click="handleRowClick(record, $event)"
                @dblclick="handleRowDblClick(record, $event)"
              >
                <!-- Expand toggle -->
                <td v-if="expandedRowRender || $slots['expand-row']" class="n-table__td n-table__td--expand">
                  <button
                    v-if="!hideExpandButtonOnEmpty || hasExpandedContent(record)"
                    class="n-table__expand-btn"
                    :class="{ 'n-table__expand-btn--expanded': isExpanded(getRowKey(record, ri)) }"
                    @click.stop="handleExpand(getRowKey(record, ri), record)"
                  >
                    ▸
                  </button>
                </td>
                <!-- Selection -->
                <td v-if="rowSelection" class="n-table__td n-table__td--selection">
                  <label v-if="rowSelection.type === 'checkbox'" class="n-table__checkbox">
                    <input
                      type="checkbox"
                      :checked="isSelected(getRowKey(record, ri))"
                      @change="handleSelect(getRowKey(record, ri), record, $event)"
                    />
                    <span class="n-table__checkbox-mark" />
                  </label>
                  <label v-else-if="rowSelection.type === 'radio'" class="n-table__radio">
                    <input
                      type="radio"
                      :checked="isSelected(getRowKey(record, ri))"
                      @change="handleRadioSelect(getRowKey(record, ri), record)"
                    />
                    <span class="n-table__radio-mark" />
                  </label>
                </td>
                <!-- Cells -->
                <td
                  v-for="col in flatColumns"
                  :key="col.dataIndex"
                  :class="['n-table__td', `n-table__td--${col.align || 'left'}`, { 'n-table__td--ellipsis': col.ellipsis }]"
                  @click="handleCellClick(record, col, $event)"
                >
                  <slot v-if="col.slotName" :name="col.slotName" :record="record" :column="col" :rowIndex="ri">
                    {{ getCellValue(record, col) }}
                  </slot>
                  <template v-else>
                    <span v-if="col.ellipsis" class="n-table__ellipsis-text" :title="String(getCellValue(record, col))">
                      {{ getCellValue(record, col) }}
                    </span>
                    <template v-else>
                      {{ getCellValue(record, col) }}
                    </template>
                  </template>
                </td>
              </tr>
              <!-- Expanded row -->
              <tr v-if="isExpanded(getRowKey(record, ri))" class="n-table__tr n-table__tr--expand-content">
                <td :colspan="totalColSpan" class="n-table__td n-table__td--expand-content">
                  <slot name="expand-row" :record="record">
                    <template v-if="expandedRowRender">
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div v-html="expandedRowRender(record)" />
                    </template>
                  </slot>
                </td>
              </tr>
            </template>
          </template>
          <!-- Empty -->
          <tr v-else>
            <td :colspan="totalColSpan" class="n-table__td n-table__td--empty">
              <slot name="empty">
                <div class="n-table__empty">
                  <NIcon name="kabao" :size="48" color="var(--n-color-border-hover)" />
                  <p>{{ emptyText }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>

        <!-- Footer -->
        <tfoot v-if="$slots.tfoot">
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination !== false" class="n-table__pagination">
      <div class="n-table__pagination-left">
        <slot name="pagination-left" />
      </div>
      <div class="n-table__pagination-center">
        <span v-if="showTotal" class="n-table__pagination-total">共 {{ paginationTotal }} 条</span>
        <select v-if="showPageSize" class="n-table__pagination-size" :value="innerPageSize" @change="handlePageSizeChange">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }} 条/页</option>
        </select>
        <button
          class="n-table__pagination-btn"
          :disabled="innerPage <= 1"
          @click="handlePageChange(innerPage - 1)"
        >‹</button>
        <template v-for="p in pageList" :key="p">
          <span v-if="p === '...'" class="n-table__pagination-ellipsis">...</span>
          <button
            v-else
            :class="['n-table__pagination-btn', { 'n-table__pagination-btn--active': p === innerPage }]"
            @click="handlePageChange(p as number)"
          >{{ p }}</button>
        </template>
        <button
          class="n-table__pagination-btn"
          :disabled="innerPage >= totalPages"
          @click="handlePageChange(innerPage + 1)"
        >›</button>
      </div>
      <div class="n-table__pagination-right">
        <slot name="pagination-right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VNodeChild } from 'vue'
import { ref, computed, watch, useSlots } from 'vue'

export interface TableColumnData {
  title: string
  dataIndex: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean | { sortDirections?: ('ascend' | 'descend')[] }
  filterable?: boolean
  ellipsis?: boolean
  slotName?: string
  titleSlotName?: string
  render?: (data: { record: any; column: TableColumnData; rowIndex: number }) => VNodeChild
  children?: TableColumnData[]
}

interface TableSelection {
  type?: 'checkbox' | 'radio'
  showCheckedAll?: boolean
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void
}

interface Props {
  columns: TableColumnData[]
  data: any[]
  bordered?: boolean
  stripe?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rowKey?: string | ((record: any) => string | number)
  loading?: boolean
  loadingText?: string
  rowSelection?: TableSelection | null
  pagination?: Record<string, any> | boolean
  pagePosition?: 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'bottom'
  scroll?: { x?: number | string; y?: number | string }
  expandedRowRender?: ((record: any) => VNodeChild) | null
  hideExpandButtonOnEmpty?: boolean
  tableLayoutFixed?: boolean
  showTotal?: boolean
  showPageSize?: boolean
  pageSizeOptions?: number[]
  emptyText?: string
  rowClassName?: string | ((record: any, rowIndex: number) => string)
  rowStyle?: Record<string, any> | ((record: any, rowIndex: number) => Record<string, any>)
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false,
  stripe: false,
  size: 'md',
  rowKey: 'key',
  loading: false,
  loadingText: '加载中...',
  rowSelection: null,
  pagination: false,
  pagePosition: 'br',
  scroll: () => ({}),
  expandedRowRender: null,
  hideExpandButtonOnEmpty: false,
  tableLayoutFixed: false,
  showTotal: true,
  showPageSize: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  emptyText: '暂无数据',
  rowClassName: '',
  rowStyle: () => ({}),
})

const emit = defineEmits<{
  select: [selectedRowKeys: (string | number)[], selectedRows: any[]]
  'select-all': [selectedRowKeys: (string | number)[], selectedRows: any[]]
  'selection-change': [selectedRowKeys: (string | number)[], selectedRows: any[]]
  'sorter-change': [dataIndex: string, direction: 'ascend' | 'descend' | '']
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
  expand: [rowKey: string | number, expanded: boolean]
  'row-click': [record: any, event: MouseEvent]
  'row-dblclick': [record: any, event: MouseEvent]
  'cell-click': [record: any, column: TableColumnData, event: MouseEvent]
}>()

// Flatten columns (extract leaf nodes)
const flatColumns = computed(() => {
  const result: TableColumnData[] = []
  const walk = (cols: TableColumnData[]) => {
    for (const col of cols) {
      if (col.children?.length) {
        walk(col.children)
      } else {
        result.push(col)
      }
    }
  }
  walk(props.columns)
  return result
})

// Grouped columns for multi-level header
const groupedColumns = computed(() => props.columns)

const hasGroupHeader = computed(() => props.columns.some(c => c.children?.length))

// Total colspan
const totalColSpan = computed(() => {
  let count = flatColumns.value.length
  if (props.rowSelection) count++
  if (props.expandedRowRender || !!useSlots()['expand-row']) count++
  return count
})

// Row key resolver
function getRowKey(record: any, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(record)
  return record[props.rowKey] ?? index
}

function getCellValue(record: any, col: TableColumnData) {
  return record[col.dataIndex]
}

function getColStyle(col: TableColumnData) {
  const style: Record<string, any> = {}
  if (col.width) style.width = typeof col.width === 'number' ? `${col.width}px` : col.width
  if (col.minWidth) style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
  return style
}

function hasExpandedContent(record: any) {
  return props.expandedRowRender || useSlots()['expand-row']
}

// Scroll style
const scrollStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.scroll?.y) s.maxHeight = typeof props.scroll.y === 'number' ? `${props.scroll.y}px` : props.scroll.y
  if (props.scroll?.x) s.overflowX = 'auto'
  return s
})

// Sort state
const sortDataIndex = ref('')
const sortOrder = ref<'ascend' | 'descend' | ''>('')

function handleSort(col: TableColumnData) {
  const directions = typeof col.sortable === 'object' && col.sortable.sortDirections
    ? col.sortable.sortDirections
    : ['ascend', 'descend'] as const
  if (sortDataIndex.value !== col.dataIndex) {
    sortDataIndex.value = col.dataIndex
    sortOrder.value = directions[0]
  } else {
    const idx = directions.indexOf(sortOrder.value as any)
    sortOrder.value = idx >= 0 && idx < directions.length - 1 ? directions[idx + 1] as any : ''
  }
  emit('sorter-change', col.dataIndex, sortOrder.value)
}

// Selection state
const selectedKeys = ref<(string | number)[]>(props.rowSelection?.selectedRowKeys || [])

watch(() => props.rowSelection?.selectedRowKeys, (val) => {
  if (val) selectedKeys.value = [...val]
}, { deep: true })

const isAllSelected = computed(() => {
  return props.data.length > 0 && props.data.every((r, i) => isSelected(getRowKey(r, i)))
})

const isSomeSelected = computed(() => {
  return props.data.some((r, i) => isSelected(getRowKey(r, i))) && !isAllSelected.value
})

function isSelected(key: string | number) {
  return selectedKeys.value.includes(key)
}

function handleSelectAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  const keys: (string | number)[] = []
  const rows: any[] = []
  if (checked) {
    props.data.forEach((r, i) => {
      const k = getRowKey(r, i)
      if (!selectedKeys.value.includes(k)) {
        keys.push(k)
        rows.push(r)
      }
    })
    selectedKeys.value = [...selectedKeys.value, ...keys]
  } else {
    const dataKeys = new Set(props.data.map((r, i) => getRowKey(r, i)))
    selectedKeys.value = selectedKeys.value.filter(k => !dataKeys.has(k))
  }
  emit('select-all', selectedKeys.value, getSelectedRows())
  emit('selection-change', selectedKeys.value, getSelectedRows())
  props.rowSelection?.onChange?.(selectedKeys.value, getSelectedRows())
}

function handleSelect(key: string | number, record: any, e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (checked) {
    if (!selectedKeys.value.includes(key)) selectedKeys.value.push(key)
  } else {
    selectedKeys.value = selectedKeys.value.filter(k => k !== key)
  }
  emit('select', selectedKeys.value, getSelectedRows())
  emit('selection-change', selectedKeys.value, getSelectedRows())
  props.rowSelection?.onChange?.(selectedKeys.value, getSelectedRows())
}

function handleRadioSelect(key: string | number, record: any) {
  selectedKeys.value = [key]
  emit('select', selectedKeys.value, [record])
  emit('selection-change', selectedKeys.value, [record])
  props.rowSelection?.onChange?.(selectedKeys.value, [record])
}

function getSelectedRows(): any[] {
  const keyToRow = new Map<string | number, any>()
  props.data.forEach((r, i) => keyToRow.set(getRowKey(r, i), r))
  return selectedKeys.value.map(k => keyToRow.get(k)).filter(Boolean)
}

// Expand state
const expandedKeys = ref<Set<string | number>>(new Set())

function isExpanded(key: string | number) {
  return expandedKeys.value.has(key)
}

function handleExpand(key: string | number, record: any) {
  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
    emit('expand', key, false)
  } else {
    expandedKeys.value.add(key)
    emit('expand', key, true)
  }
  // Trigger reactivity
  expandedKeys.value = new Set(expandedKeys.value)
}

// Sort processed data
const processedData = computed(() => {
  let result = [...props.data]
  if (sortDataIndex.value && sortOrder.value) {
    result.sort((a, b) => {
      const va = a[sortDataIndex.value]
      const vb = b[sortDataIndex.value]
      if (va === vb) return 0
      const cmp = va > vb ? 1 : -1
      return sortOrder.value === 'ascend' ? cmp : -cmp
    })
  }
  return result
})

// Pagination
const paginationTotal = computed(() => {
  if (typeof props.pagination === 'object' && props.pagination.total != null) return props.pagination.total
  return props.data.length
})

const innerPage = ref(typeof props.pagination === 'object' ? (props.pagination.current || 1) : 1)
const innerPageSize = ref(typeof props.pagination === 'object' ? (props.pagination.pageSize || 10) : 10)

const totalPages = computed(() => Math.max(1, Math.ceil(paginationTotal.value / innerPageSize.value)))

const pageList = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = innerPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

function handlePageChange(page: number) {
  innerPage.value = Math.max(1, Math.min(page, totalPages.value))
  emit('page-change', innerPage.value)
}

function handlePageSizeChange(e: Event) {
  innerPageSize.value = Number((e.target as HTMLSelectElement).value)
  innerPage.value = 1
  emit('page-size-change', innerPageSize.value)
}

// Row events
function handleRowClick(record: any, event: MouseEvent) {
  emit('row-click', record, event)
}

function handleRowDblClick(record: any, event: MouseEvent) {
  emit('row-dblclick', record, event)
}

function handleCellClick(record: any, column: TableColumnData, event: MouseEvent) {
  emit('cell-click', record, column, event)
}

function trClasses(record: any, ri: number) {
  const key = getRowKey(record, ri)
  const classes: Record<string, boolean> = {
    'n-table__tr': true,
    'n-table__tr--selected': isSelected(key),
    'n-table__tr--expanded': isExpanded(key),
  }
  if (typeof props.rowClassName === 'function') {
    const extra = props.rowClassName(record, ri)
    if (extra) classes[extra] = true
  } else if (props.rowClassName) {
    classes[props.rowClassName] = true
  }
  return classes
}

function trStyle(record: any, ri: number) {
  if (typeof props.rowStyle === 'function') return props.rowStyle(record, ri)
  return props.rowStyle || {}
}

// Expose methods
defineExpose({
  selectAll(checked: boolean) {
    handleSelectAll({ target: { checked } } as any)
  },
  select(key: string | number, checked: boolean) {
    const record = props.data.find((r, i) => getRowKey(r, i) === key)
    if (record) handleSelect(key, record, { target: { checked } } as any)
  },
  expandAll(expanded: boolean) {
    if (expanded) {
      props.data.forEach((r, i) => expandedKeys.value.add(getRowKey(r, i)))
    } else {
      expandedKeys.value.clear()
    }
    expandedKeys.value = new Set(expandedKeys.value)
  },
  expand(key: string | number, expanded: boolean) {
    if (expanded) expandedKeys.value.add(key)
    else expandedKeys.value.delete(key)
    expandedKeys.value = new Set(expandedKeys.value)
  },
  getSelectedRowKeys() {
    return [...selectedKeys.value]
  },
  getSelectedRows() {
    return getSelectedRows()
  },
  clearSelection() {
    selectedKeys.value = []
    emit('selection-change', [], [])
  },
})
</script>

<style scoped>
.n-table-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.n-table-wrapper--bordered {
  border: 1px solid var(--n-color-border);
}

/* Toolbar */
.n-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-color-border);
  background: var(--n-color-bg);
  gap: 12px;
}

.n-table-scroll {
  overflow: auto;
}

.n-table-scroll--x {
  overflow-x: auto;
}

/* Table base */
.n-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: auto;
  font-size: 14px;
  color: var(--n-color-text-secondary);
  background: var(--n-color-bg);
}

.n-table--fixed {
  table-layout: fixed;
}

/* Sizes */
.n-table--xs { font-size: 12px; }
.n-table--sm { font-size: 13px; }
.n-table--md { font-size: 14px; }
.n-table--lg { font-size: 15px; }

.n-table--xs .n-table__th,
.n-table--xs .n-table__td { padding: 6px 8px; }

.n-table--sm .n-table__th,
.n-table--sm .n-table__td { padding: 8px 12px; }

.n-table--md .n-table__th,
.n-table--md .n-table__td { padding: 12px 16px; }

.n-table--lg .n-table__th,
.n-table--lg .n-table__td { padding: 16px 20px; }

/* Bordered */
.n-table--bordered .n-table__th,
.n-table--bordered .n-table__td {
  border: 1px solid var(--n-color-border);
}

/* Stripe */
.n-table--stripe tbody tr:nth-child(even) {
  background: var(--n-color-fill);
}

.n-table--stripe tbody tr:nth-child(even):hover {
  background: var(--n-color-fill-hover);
}

/* Header */
.n-table__th {
  text-align: left;
  font-weight: 600;
  color: var(--n-color-text-secondary);
  background: var(--n-color-fill);
  border-bottom: 2px solid var(--n-color-border);
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.n-table__th--center { text-align: center; }
.n-table__th--right { text-align: right; }

.n-table__th-inner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Sorter */
.n-table__sorter {
  display: inline-flex;
  flex-direction: column;
  cursor: pointer;
  gap: 0;
  line-height: 1;
  font-size: 10px;
  color: var(--n-color-border-hover);
  margin-left: 2px;
}

.n-table__sorter-up,
.n-table__sorter-down {
  line-height: 1;
  transition: color 0.2s;
}

.n-table__sorter-up.active,
.n-table__sorter-down.active {
  color: var(--n-color-primary);
}

.n-table__th--sortable {
  cursor: pointer;
}

.n-table__th--sortable:hover {
  background: var(--n-color-fill-hover);
}

/* Body */
.n-table__td {
  border-bottom: 1px solid var(--n-color-border);
  transition: background 0.2s;
}

.n-table__td--center { text-align: center; }
.n-table__td--right { text-align: right; }

tbody tr:hover td {
  background: var(--n-color-primary-light);
}

.n-table__tr--selected td {
  background: var(--n-color-primary-light) !important;
}

.n-table__tr--expanded td {
  background: var(--n-color-fill);
}

/* Expand */
.n-table__th--expand,
.n-table__td--expand {
  width: 48px;
  text-align: center;
}

.n-table__expand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--n-color-text-secondary);
  border-radius: 4px;
  transition: all 0.2s;
}

.n-table__expand-btn:hover {
  background: var(--n-color-border);
  color: var(--n-color-primary);
}

.n-table__expand-btn--expanded {
  transform: rotate(90deg);
}

.n-table__td--expand-content {
  padding: 12px 16px 12px 48px;
  background: var(--n-color-fill);
  border-bottom: 1px solid var(--n-color-border);
}

/* Selection */
.n-table__th--selection,
.n-table__td--selection {
  width: 48px;
  text-align: center;
}

/* Custom checkbox */
.n-table__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
}

.n-table__checkbox input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.n-table__checkbox-mark {
  width: 16px;
  height: 16px;
  border: 2px solid var(--n-color-border-hover);
  border-radius: 4px;
  background: var(--n-color-bg);
  transition: all 0.2s;
}

.n-table__checkbox input:checked + .n-table__checkbox-mark {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

.n-table__checkbox input:indeterminate + .n-table__checkbox-mark {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

/* Custom radio */
.n-table__radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
}

.n-table__radio input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.n-table__radio-mark {
  width: 16px;
  height: 16px;
  border: 2px solid var(--n-color-border-hover);
  border-radius: 50%;
  background: var(--n-color-bg);
  transition: all 0.2s;
}

.n-table__radio input:checked + .n-table__radio-mark {
  border-color: var(--n-color-primary);
}

.n-table__radio input:checked + .n-table__radio-mark::after {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--n-color-primary);
  margin: 2px auto;
}

/* Ellipsis */
.n-table__td--ellipsis {
  max-width: 0;
  overflow: hidden;
}

.n-table__ellipsis-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Group header */
.n-table__th--group {
  text-align: center;
}

/* Empty */
.n-table__td--empty {
  padding: 48px 16px;
  text-align: center;
}

.n-table__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--n-color-text-disabled);
}

.n-table__empty p {
  margin: 0;
  font-size: 14px;
}

/* Loading */
.n-table__loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.n-table__loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--n-color-border);
  border-top-color: var(--n-color-primary);
  border-radius: 50%;
  animation: n-table-spin 0.8s linear infinite;
}

.n-table__loading-text {
  font-size: 14px;
  color: var(--n-color-text-secondary);
}

@keyframes n-table-spin {
  to { transform: rotate(360deg); }
}

/* Pagination */
.n-table__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--n-color-border);
  gap: 12px;
}

.n-table__pagination-left,
.n-table__pagination-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.n-table__pagination-center {
  display: flex;
  align-items: center;
  gap: 4px;
}

.n-table__pagination-total {
  font-size: 14px;
  color: var(--n-color-text-secondary);
  margin-right: 8px;
}

.n-table__pagination-size {
  padding: 4px 8px;
  border: 1px solid var(--n-color-border-hover);
  border-radius: 6px;
  font-size: 13px;
  color: var(--n-color-text-secondary);
  background: var(--n-color-bg);
  outline: none;
  cursor: pointer;
  margin-right: 8px;
}

.n-table__pagination-size:focus {
  border-color: var(--n-color-primary);
}

.n-table__pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--n-color-border);
  border-radius: 6px;
  background: var(--n-color-bg);
  color: var(--n-color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.n-table__pagination-btn:hover:not(:disabled) {
  border-color: var(--n-color-primary);
  color: var(--n-color-primary);
}

.n-table__pagination-btn:disabled {
  color: var(--n-color-border-hover);
  cursor: not-allowed;
}

.n-table__pagination-btn--active {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
  color: var(--n-color-text-inverse);
}

.n-table__pagination-btn--active:hover {
  background: var(--n-color-primary-hover);
  color: var(--n-color-text-inverse);
}

.n-table__pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 4px;
  font-size: 14px;
  color: var(--n-color-text-disabled);
}
</style>
