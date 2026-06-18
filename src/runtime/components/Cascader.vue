<template>
  <div
    ref="cascaderRef"
    :class="[
      'n-cascader',
      `n-cascader--${size}`,
      {
        'n-cascader--disabled': disabled,
        'n-cascader--open': open,
        'n-cascader--borderless': borderless,
        'n-cascader--error': error,
      },
    ]"
  >
    <div class="n-cascader__trigger" @click="toggleOpen">
      <!-- Search mode -->
      <template v-if="searchable && open">
        <input
          ref="searchInputRef"
          class="n-cascader__search-input"
          :value="searchText"
          :placeholder="selectedLabels.length ? '' : placeholder"
          @input="onSearchInput"
          @click.stop
        />
      </template>
      <!-- Display -->
      <template v-else>
        <template v-if="multiple && selectedLabels.length">
          <div class="n-cascader__tags">
            <span v-for="(label, i) in selectedLabels" :key="i" class="n-cascader__tag">
              {{ label }}
              <span class="n-cascader__tag-close" @click.stop="removeMultiValue(i)">×</span>
            </span>
          </div>
        </template>
        <template v-else-if="selectedLabels.length">
          <span class="n-cascader__value">{{ selectedLabels.join(separator) }}</span>
        </template>
        <template v-else>
          <span class="n-cascader__placeholder">{{ placeholder }}</span>
        </template>
      </template>
      <span v-if="clearable && hasValue && !disabled" class="n-cascader__clear" @click.stop="handleClear">×</span>
      <span class="n-cascader__arrow" :class="{ 'n-cascader__arrow--open': open }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    </div>
    <transition name="n-cascader__fade">
      <div v-show="open" class="n-cascader__dropdown">
        <!-- Search results -->
        <template v-if="searchable && searchText">
          <div class="n-cascader__search-results">
            <div v-if="filteredPaths.length === 0" class="n-cascader__empty">无匹配结果</div>
            <div
              v-for="path in filteredPaths"
              :key="path.path.join('/')"
              class="n-cascader__search-option"
              @click="handleSearchSelect(path)"
            >
              {{ path.labels.join(separator) }}
            </div>
          </div>
        </template>
        <!-- Normal panels -->
        <template v-else>
          <div v-if="loading" class="n-cascader__loading">
            <span class="n-cascader__loading-spinner" />
            <span>加载中...</span>
          </div>
          <div v-else class="n-cascader__panels">
            <div v-for="(options, level) in panelOptions" :key="level" class="n-cascader__panel">
              <div
                v-for="opt in options"
                :key="opt.value"
                :class="[
                  'n-cascader__option',
                  {
                    'n-cascader__option--active': isActive(opt.value, level as number),
                    'n-cascader__option--disabled': opt.disabled,
                  },
                ]"
                @click="handleSelect(opt, level as number)"
              >
                <template v-if="multiple && (checkStrategy === 'child' ? !opt.children : true)">
                  <span class="n-cascader__checkbox" :class="{ 'n-cascader__checkbox--checked': isMultiChecked(opt.value, level as number) }" />
                </template>
                <span class="n-cascader__option-label">{{ opt.label }}</span>
                <span v-if="opt.children?.length" class="n-cascader__option-arrow">›</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export interface CascaderOption {
  label: string
  value: any
  children?: CascaderOption[]
  disabled?: boolean
}

interface PathResult {
  path: any[]
  labels: string[]
  option: CascaderOption
}

interface Props {
  modelValue: any[]
  options: CascaderOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  separator?: string
  multiple?: boolean
  searchable?: boolean
  checkStrategy?: 'all' | 'parent' | 'child'
  borderless?: boolean
  loading?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  size: 'md',
  separator: ' / ',
  multiple: false,
  searchable: false,
  checkStrategy: 'child',
  borderless: false,
  loading: false,
  error: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: any[]]
  change: [val: any[]]
  search: [val: string]
}>()

const cascaderRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const open = ref(false)
const activeValues = ref<any[]>([])
const searchText = ref('')

const hasValue = computed(() => props.multiple ? props.modelValue.length > 0 : props.modelValue.length > 0 && props.modelValue.some(v => v !== undefined && v !== null && v !== ''))

const panelOptions = computed(() => {
  const panels: CascaderOption[][] = [props.options]
  for (const val of activeValues.value) {
    const parent = panels[panels.length - 1].find(o => o.value === val)
    if (parent?.children?.length) panels.push(parent.children)
    else break
  }
  return panels
})

const selectedLabels = computed(() => {
  if (props.multiple) {
    return props.modelValue.map(path => {
      const labels: string[] = []
      let list = props.options
      for (const val of path) {
        const opt = list.find(o => o.value === val)
        if (opt) {
          labels.push(opt.label)
          list = opt.children || []
        } else break
      }
      return labels.join(props.separator)
    })
  }
  const labels: string[] = []
  let list = props.options
  for (const val of props.modelValue) {
    const opt = list.find(o => o.value === val)
    if (opt) {
      labels.push(opt.label)
      list = opt.children || []
    } else break
  }
  return labels
})

// Search: flatten all leaf paths
function flattenPaths(options: CascaderOption[], parentPath: any[] = [], parentLabels: string[] = []): PathResult[] {
  const results: PathResult[] = []
  for (const opt of options) {
    const currentPath = [...parentPath, opt.value]
    const currentLabels = [...parentLabels, opt.label]
    if (opt.children?.length) {
      results.push(...flattenPaths(opt.children, currentPath, currentLabels))
    } else {
      results.push({ path: currentPath, labels: currentLabels, option: opt })
    }
  }
  return results
}

const allPaths = computed(() => flattenPaths(props.options))

const filteredPaths = computed(() => {
  if (!searchText.value) return allPaths.value
  const kw = searchText.value.toLowerCase()
  return allPaths.value.filter(p =>
    p.labels.some(l => l.toLowerCase().includes(kw)) ||
    p.path.join(props.separator).toLowerCase().includes(kw)
  )
})

watch(() => props.modelValue, (val) => {
  if (!props.multiple) {
    activeValues.value = [...val]
  }
}, { immediate: true })

function isActive(val: any, level: number) {
  return activeValues.value[level] === val
}

function isMultiChecked(val: any, level: number) {
  return props.modelValue.some((path: any[]) => path[level] === val)
}

function handleSelect(opt: CascaderOption, level: number) {
  if (opt.disabled) return
  activeValues.value = [...activeValues.value.slice(0, level), opt.value]

  if (props.multiple) {
    if (!opt.children?.length || props.checkStrategy === 'all') {
      const newPath = [...activeValues.value]
      const idx = props.modelValue.findIndex((p: any[]) => JSON.stringify(p) === JSON.stringify(newPath))
      const newVal = [...props.modelValue]
      if (idx > -1) {
        newVal.splice(idx, 1)
      } else {
        newVal.push(newPath)
      }
      emit('update:modelValue', newVal)
      emit('change', newVal)
    }
  } else {
    if (!opt.children?.length) {
      emit('update:modelValue', [...activeValues.value])
      emit('change', [...activeValues.value])
      open.value = false
    }
  }
}

function handleSearchSelect(path: PathResult) {
  if (props.multiple) {
    const idx = props.modelValue.findIndex((p: any[]) => JSON.stringify(p) === JSON.stringify(path.path))
    const newVal = [...props.modelValue]
    if (idx > -1) {
      newVal.splice(idx, 1)
    } else {
      newVal.push(path.path)
    }
    emit('update:modelValue', newVal)
    emit('change', newVal)
  } else {
    emit('update:modelValue', path.path)
    emit('change', path.path)
    open.value = false
  }
  searchText.value = ''
}

function removeMultiValue(i: number) {
  const newVal = [...props.modelValue]
  newVal.splice(i, 1)
  emit('update:modelValue', newVal)
  emit('change', newVal)
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value && props.searchable) {
    nextTick(() => searchInputRef.value?.focus())
  }
}

function handleClear() {
  activeValues.value = []
  emit('update:modelValue', [])
  emit('change', [])
}

function onSearchInput(e: Event) {
  searchText.value = (e.target as HTMLInputElement).value
  emit('search', searchText.value)
}

function onClickOutside(e: Event) {
  if (cascaderRef.value && !cascaderRef.value.contains(e.target as HTMLElement)) {
    open.value = false
    searchText.value = ''
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

defineExpose({ focus: () => open.value = true, blur: () => { open.value = false; searchText.value = '' } })
</script>

<style scoped>
.n-cascader {
  position: relative;
  display: inline-block;
  width: 100%;
}

.n-cascader__trigger {
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

.n-cascader--borderless .n-cascader__trigger {
  border-color: transparent;
}

.n-cascader__trigger:hover {
  border-color: var(--n-color-primary);
}

.n-cascader--open .n-cascader__trigger {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.n-cascader--error .n-cascader__trigger {
  border-color: var(--n-color-danger, #ef4444) !important;
}

.n-cascader--disabled .n-cascader__trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--n-color-fill-hover);
}

/* ====== Sizes ====== */
.n-cascader--sm .n-cascader__trigger {
  min-height: 28px;
  font-size: 12px;
  padding: 0 28px 0 8px;
}

.n-cascader--md .n-cascader__trigger {
  min-height: 36px;
  font-size: 14px;
  padding: 0 28px 0 12px;
}

.n-cascader--lg .n-cascader__trigger {
  min-height: 44px;
  font-size: 16px;
  padding: 0 32px 0 16px;
}

.n-cascader__value {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.n-cascader__placeholder {
  flex: 1;
  color: var(--n-color-text-disabled);
  user-select: none;
}

.n-cascader__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  padding: 2px 0;
}

.n-cascader__tag {
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

.n-cascader__tag-close {
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  margin-left: 2px;
}

.n-cascader__tag-close:hover {
  color: var(--n-color-danger, #ef4444);
}

.n-cascader__clear {
  position: absolute;
  right: 24px;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.n-cascader__clear:hover {
  color: var(--n-color-text-secondary);
}

.n-cascader__arrow {
  position: absolute;
  right: 8px;
  color: var(--n-color-text-disabled);
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.n-cascader__arrow--open {
  transform: rotate(180deg);
}

/* ====== Search input ====== */
.n-cascader__search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  color: var(--n-color-text);
  padding: 0;
  min-width: 60px;
}

.n-cascader__search-input::placeholder {
  color: var(--n-color-text-disabled);
}

/* ====== Dropdown ====== */
.n-cascader__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  overflow: hidden;
}

.n-cascader__panels {
  display: flex;
  max-height: 240px;
}

.n-cascader__panel {
  min-width: 160px;
  max-height: 240px;
  overflow-y: auto;
  border-right: 1px solid var(--n-color-fill-hover);
  padding: 4px;
}

.n-cascader__panel:last-child {
  border-right: none;
}

.n-cascader__option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  white-space: nowrap;
  color: var(--n-color-text-secondary);
}

.n-cascader__option:hover {
  background: var(--n-color-fill-hover);
}

.n-cascader__option--active {
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.1));
  color: var(--n-color-primary);
  font-weight: 500;
}

.n-cascader__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-cascader__option-label {
  flex: 1;
}

.n-cascader__option-arrow {
  color: var(--n-color-text-disabled);
  margin-left: auto;
}

/* ====== Checkbox for multiple ====== */
.n-cascader__checkbox {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--n-color-border-hover);
  border-radius: 3px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.15s;
}

.n-cascader__checkbox--checked {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

.n-cascader__checkbox--checked::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 0px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

/* ====== Search results ====== */
.n-cascader__search-results {
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
  min-width: 200px;
}

.n-cascader__search-option {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--n-color-text-secondary);
  transition: background 0.15s;
  white-space: nowrap;
}

.n-cascader__search-option:hover {
  background: var(--n-color-fill-hover);
}

.n-cascader__empty {
  padding: 16px;
  text-align: center;
  color: var(--n-color-text-disabled);
  font-size: 13px;
}

/* ====== Loading ====== */
.n-cascader__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: var(--n-color-text-disabled);
  font-size: 13px;
  justify-content: center;
}

.n-cascader__loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--n-color-border);
  border-top-color: var(--n-color-primary);
  border-radius: 50%;
  animation: n-spin 0.6s linear infinite;
}

@keyframes n-spin {
  to { transform: rotate(360deg); }
}

/* ====== Transition ====== */
.n-cascader__fade-enter-active,
.n-cascader__fade-leave-active {
  transition: all 0.15s ease;
}

.n-cascader__fade-enter-from,
.n-cascader__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
