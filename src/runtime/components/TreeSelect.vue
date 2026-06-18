<template>
  <div
    ref="treeSelectRef"
    :class="[
      'n-tree-select',
      `n-tree-select--${size}`,
      {
        'n-tree-select--disabled': disabled,
        'n-tree-select--open': open,
        'n-tree-select--borderless': borderless,
        'n-tree-select--error': error,
      },
    ]"
  >
    <div class="n-tree-select__trigger" @click="toggleOpen">
      <!-- Search mode -->
      <template v-if="searchable && open">
        <input
          ref="searchInputRef"
          class="n-tree-select__search-input"
          :value="searchText"
          :placeholder="displayLabel || placeholder"
          @input="onSearchInput"
          @click.stop
        />
      </template>
      <!-- Display -->
      <template v-else>
        <template v-if="multiple && currentLabels.length">
          <div class="n-tree-select__tags">
            <span v-for="(label, i) in currentLabels" :key="i" class="n-tree-select__tag">
              {{ label }}
              <span class="n-tree-select__tag-close" @click.stop="removeChecked(i)">×</span>
            </span>
          </div>
        </template>
        <template v-else-if="displayLabel">
          <span class="n-tree-select__value">{{ displayLabel }}</span>
        </template>
        <template v-else>
          <span class="n-tree-select__placeholder">{{ placeholder }}</span>
        </template>
      </template>
      <span v-if="clearable && hasValue && !disabled" class="n-tree-select__clear" @click.stop="handleClear">×</span>
      <span class="n-tree-select__arrow" :class="{ 'n-tree-select__arrow--open': open }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    </div>
    <transition name="n-tree-select__fade">
      <div v-show="open" class="n-tree-select__dropdown">
        <div v-if="loading" class="n-tree-select__loading">
          <span class="n-tree-select__loading-spinner" />
          <span>加载中...</span>
        </div>
        <template v-else-if="searchable && searchText">
          <div class="n-tree-select__search-results">
            <div v-if="filteredNodes.length === 0" class="n-tree-select__empty">无匹配结果</div>
            <div
              v-for="node in filteredNodes"
              :key="node[keyField]"
              class="n-tree-select__search-option"
              :class="{ 'n-tree-select__search-option--disabled': node.disabled }"
              @click="handleSearchSelect(node)"
            >
              {{ getNodePath(node[keyField]) }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="n-tree-select__tree">
            <TreeNode
              v-for="node in data"
              :key="node[keyField]"
              :node="node"
              :level="0"
              :selected-value="multiple ? undefined : modelValue"
              :checked-keys="multiple ? (modelValue as any[]) : []"
              :multiple="multiple"
              :label-field="labelField"
              :key-field="keyField"
              :children-field="childrenField"
              :default-expand-all="defaultExpandAll"
              @select="handleSelect"
              @check="handleCheck"
            />
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import TreeNode from './TreeNodeInner.vue'

interface TreeData {
  [key: string]: any
  children?: TreeData[]
  disabled?: boolean
}

interface Props {
  modelValue: any
  data: TreeData[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  keyField?: string
  labelField?: string
  childrenField?: string
  multiple?: boolean
  searchable?: boolean
  defaultExpandAll?: boolean
  borderless?: boolean
  loading?: boolean
  error?: boolean
  cascade?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  size: 'md',
  keyField: 'key',
  labelField: 'label',
  childrenField: 'children',
  multiple: false,
  searchable: false,
  defaultExpandAll: false,
  borderless: false,
  loading: false,
  error: false,
  cascade: true,
})

const emit = defineEmits<{
  'update:modelValue': [v: any]
  change: [v: any]
  search: [v: string]
}>()

const treeSelectRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const open = ref(false)
const searchText = ref('')
const justOpened = ref(false)

const hasValue = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
})

function findLabel(list: TreeData[], val: any): string {
  for (const node of list) {
    if (node[props.keyField] === val) return node[props.labelField]
    if (node[props.childrenField]) {
      const found = findLabel(node[props.childrenField], val)
      if (found) return found
    }
  }
  return ''
}

function getNodePath(val: any): string {
  const path = findPathLabels(props.data, val)
  return path.join(' / ')
}

function findPathLabels(list: TreeData[], val: any, parentLabels: string[] = []): string[] {
  for (const node of list) {
    const currentLabels = [...parentLabels, node[props.labelField]]
    if (node[props.keyField] === val) return currentLabels
    if (node[props.childrenField]) {
      const found = findPathLabels(node[props.childrenField], val, currentLabels)
      if (found.length) return found
    }
  }
  return []
}

const displayLabel = computed(() => {
  if (props.multiple) return ''
  return props.modelValue ? findLabel(props.data, props.modelValue) : ''
})

const currentLabels = computed(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return []
  return props.modelValue.map((v: any) => findLabel(props.data, v))
})

// Search: flatten all selectable nodes
const allNodes = computed(() => {
  const nodes: TreeData[] = []
  function walk(list: TreeData[]) {
    for (const node of list) {
      nodes.push(node)
      if (node[props.childrenField]) walk(node[props.childrenField])
    }
  }
  walk(props.data)
  return nodes
})

const filteredNodes = computed(() => {
  if (!searchText.value) return allNodes.value
  const kw = searchText.value.toLowerCase()
  return allNodes.value.filter(n =>
    n[props.labelField]?.toString().toLowerCase().includes(kw) &&
    !n.disabled
  )
})

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    justOpened.value = true
    nextTick(() => { justOpened.value = false })
    if (props.searchable) {
      nextTick(() => searchInputRef.value?.focus())
    }
  }
}

function handleSelect(val: any) {
  emit('update:modelValue', val)
  emit('change', val)
  open.value = false
  searchText.value = ''
}

function handleCheck(val: any) {
  if (!props.multiple) return
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = current.indexOf(val)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(val)
  }
  emit('update:modelValue', current)
  emit('change', current)
}

function handleSearchSelect(node: TreeData) {
  if (node.disabled) return
  const val = node[props.keyField]
  if (props.multiple) {
    handleCheck(val)
  } else {
    handleSelect(val)
  }
}

function removeChecked(i: number) {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  current.splice(i, 1)
  emit('update:modelValue', current)
  emit('change', current)
}

function handleClear() {
  if (props.multiple) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    emit('update:modelValue', undefined)
    emit('change', undefined)
  }
}

function onSearchInput(e: Event) {
  searchText.value = (e.target as HTMLInputElement).value
  emit('search', searchText.value)
}

function onClickOutside(e: Event) {
  if (justOpened.value) return
  if (treeSelectRef.value && !treeSelectRef.value.contains(e.target as HTMLElement)) {
    open.value = false
    searchText.value = ''
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

defineExpose({ focus: () => { open.value = true }, blur: () => { open.value = false; searchText.value = '' } })
</script>

<style scoped>
.n-tree-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.n-tree-select__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--n-color-border-hover);
  border-radius: 6px;
  background: var(--n-color-bg);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  position: relative;
  min-height: 36px;
}

.n-tree-select--borderless .n-tree-select__trigger {
  border-color: transparent;
}

.n-tree-select__trigger:hover {
  border-color: var(--n-color-primary);
}

.n-tree-select--open .n-tree-select__trigger {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.n-tree-select--error .n-tree-select__trigger {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-tree-select--disabled .n-tree-select__trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--n-color-fill-hover);
}

/* ====== Sizes ====== */
.n-tree-select--sm .n-tree-select__trigger { min-height: 28px; font-size: 12px; padding: 0 28px 0 8px; }
.n-tree-select--md .n-tree-select__trigger { min-height: 36px; font-size: 14px; padding: 0 28px 0 12px; }
.n-tree-select--lg .n-tree-select__trigger { min-height: 44px; font-size: 16px; padding: 0 32px 0 16px; }

.n-tree-select__value {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.n-tree-select__placeholder {
  flex: 1;
  color: var(--n-color-text-disabled);
  user-select: none;
}

.n-tree-select__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  padding: 2px 0;
}

.n-tree-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 6px;
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.1));
  color: var(--n-color-primary);
  border-radius: 3px;
  font-size: 12px;
  line-height: 1.6;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.n-tree-select__tag-close {
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
}

.n-tree-select__tag-close:hover {
  color: var(--n-color-danger, #ef4444);
}

.n-tree-select__clear {
  position: absolute;
  right: 24px;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.n-tree-select__clear:hover {
  color: var(--n-color-text-secondary);
}

.n-tree-select__arrow {
  position: absolute;
  right: 8px;
  color: var(--n-color-text-disabled);
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.n-tree-select__arrow--open {
  transform: rotate(180deg);
}

/* ====== Search input ====== */
.n-tree-select__search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  color: var(--n-color-text);
  padding: 0;
  min-width: 60px;
}

.n-tree-select__search-input::placeholder {
  color: var(--n-color-text-disabled);
}

/* ====== Dropdown ====== */
.n-tree-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  padding: 4px;
}

/* ====== Search results ====== */
.n-tree-select__search-results {
  max-height: 240px;
  overflow-y: auto;
}

.n-tree-select__search-option {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--n-color-text-secondary);
  transition: background 0.15s;
  white-space: nowrap;
}

.n-tree-select__search-option:hover {
  background: var(--n-color-fill-hover);
}

.n-tree-select__search-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-tree-select__empty {
  padding: 16px;
  text-align: center;
  color: var(--n-color-text-disabled);
  font-size: 13px;
}

/* ====== Loading ====== */
.n-tree-select__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: var(--n-color-text-disabled);
  font-size: 13px;
  justify-content: center;
}

.n-tree-select__loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--n-color-border);
  border-top-color: var(--n-color-primary);
  border-radius: 50%;
  animation: n-ts-spin 0.6s linear infinite;
}

@keyframes n-ts-spin {
  to { transform: rotate(360deg); }
}

/* ====== Transition ====== */
.n-tree-select__fade-enter-active,
.n-tree-select__fade-leave-active {
  transition: all 0.15s ease;
}

.n-tree-select__fade-enter-from,
.n-tree-select__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
