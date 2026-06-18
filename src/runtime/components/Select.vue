<template>
  <div :class="['n-select', `n-select--${size}`, { 'n-select--disabled': disabled, 'n-select--open': open, 'n-select--clearable': clearable, 'n-select--multiple': multiple }]">
    <div class="n-select__trigger" @click="toggleOpen">
      <div class="n-select__values">
        <template v-if="multiple && selectedLabels.length">
          <span v-for="item in selectedLabels" :key="item.value" class="n-select__tag">
            {{ item.label }}
            <span v-if="!disabled" class="n-select__tag-close" @click.stop="removeItem(item.value)">×</span>
          </span>
        </template>
        <template v-else-if="currentLabel">
          {{ currentLabel }}
        </template>
        <span v-else class="n-select__placeholder">{{ placeholder }}</span>
      </div>
      <span v-if="clearable && (multiple ? selectedValues.length : modelValue !== undefined && modelValue !== '')" class="n-select__clear" @click.stop="handleClear">×</span>
      <span class="n-select__arrow">▾</span>
    </div>
    <transition name="n-select__fade">
      <div v-show="open" class="n-select__dropdown">
        <div v-if="filterable || remote" class="n-select__search">
          <input v-model="searchText" class="n-select__search-input" :placeholder="remote ? '输入关键字远程搜索...' : '搜索...'" @input="handleSearchInput" />
        </div>
        <div class="n-select__options">
          <template v-if="innerLoading">
            <div class="n-select__loading">
              <svg class="n-select__loading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              搜索中...
            </div>
          </template>
          <template v-else>
            <div
              v-for="opt in filteredOptions"
              :key="opt.value"
              :class="['n-select__option', { 'n-select__option--selected': isSelected(opt.value), 'n-select__option--disabled': opt.disabled }]"
              @click="handleSelect(opt)"
            >
              <NCheckbox v-if="multiple" :model-value="isSelected(opt.value)" :disabled="opt.disabled" style="pointer-events: none; margin-right: 6px;" />
              {{ opt.label }}
            </div>
            <div v-if="!filteredOptions.length" class="n-select__empty">暂无数据</div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

interface Props {
  modelValue: any
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  filterable?: boolean
  size?: 'sm' | 'md' | 'lg'
  remote?: boolean
  remoteMethod?: (query: string) => Promise<SelectOption[]>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  multiple: false,
  filterable: false,
  size: 'md',
  remote: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: any]
  change: [val: any]
  search: [query: string]
}>()

const open = ref(false)
const searchText = ref('')
const innerLoading = ref(false)
const remoteOptions = ref<SelectOption[]>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null

const selectedValues = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []
  return props.modelValue !== undefined ? [props.modelValue] : []
})

const selectedLabels = computed(() => {
  return selectedValues.value.map(v => {
    const opt = props.options.find(o => o.value === v)
    return { label: opt?.label || v, value: v }
  })
})

const currentLabel = computed(() => {
  if (props.multiple) return ''
  const opt = props.options.find(o => o.value === props.modelValue)
  return opt?.label || ''
})

const filteredOptions = computed(() => {
  if (props.remote) return remoteOptions.value.length ? remoteOptions.value : props.options
  if (!searchText.value) return props.options
  return props.options.filter(o => o.label.toLowerCase().includes(searchText.value.toLowerCase()))
})

function isSelected(val: any) {
  return selectedValues.value.includes(val)
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
  if (!open.value) searchText.value = ''
}

function handleSearchInput() {
  if (props.remote) {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => doRemoteSearch(searchText.value), 300)
  }
  emit('search', searchText.value)
}

async function doRemoteSearch(query: string) {
  if (!props.remoteMethod) return
  innerLoading.value = true
  try {
    remoteOptions.value = await props.remoteMethod(query)
  } catch {
    remoteOptions.value = []
  } finally {
    innerLoading.value = false
  }
}

function handleSelect(opt: SelectOption) {
  if (opt.disabled) return
  if (props.multiple) {
    const vals = [...selectedValues.value]
    const idx = vals.indexOf(opt.value)
    if (idx > -1) vals.splice(idx, 1)
    else vals.push(opt.value)
    emit('update:modelValue', vals)
    emit('change', vals)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    open.value = false
  }
}

function removeItem(val: any) {
  const vals = selectedValues.value.filter(v => v !== val)
  emit('update:modelValue', vals)
  emit('change', vals)
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

function onClickOutside(e: Event) {
  const el = (e.target as HTMLElement).closest('.n-select')
  if (!el) open.value = false
}

watch(open, (val) => {
  if (val && props.remote && !remoteOptions.value.length && props.options.length) {
    remoteOptions.value = [...props.options]
  }
})

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
.n-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.n-select--sm .n-select__trigger { height: 28px; font-size: 12px; padding: 0 28px 0 8px; }
.n-select--md .n-select__trigger { height: 36px; font-size: 14px; padding: 0 28px 0 12px; }
.n-select--lg .n-select__trigger { height: 44px; font-size: 16px; padding: 0 28px 0 16px; }

.n-select__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--n-color-border-hover);
  border-radius: 6px;
  background: var(--n-color-bg);
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;
  box-sizing: border-box;
}

.n-select__trigger:hover { border-color: var(--n-color-primary); }
.n-select--open .n-select__trigger { border-color: var(--n-color-primary); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
.n-select--disabled .n-select__trigger { opacity: 0.5; cursor: not-allowed; background: var(--n-color-fill); }

.n-select__values {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.n-select--multiple .n-select__values {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 2px 0;
  white-space: normal;
}

.n-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0 6px;
  background: var(--n-color-primary-light);
  color: var(--n-color-primary);
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
}

.n-select__tag-close {
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.n-select__tag-close:hover { color: var(--n-color-danger); }

.n-select__placeholder {
  color: var(--n-color-text-disabled);
}

.n-select__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--n-color-text-disabled);
  font-size: 16px;
  line-height: 1;
}

.n-select__clear:hover { color: var(--n-color-text-secondary); }

.n-select__arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--n-color-text-disabled);
  font-size: 12px;
  pointer-events: none;
  transition: transform 0.2s;
}

.n-select--open .n-select__arrow { transform: translateY(-50%) rotate(180deg); }

.n-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  overflow: hidden;
}

.n-select__search {
  padding: 8px;
  border-bottom: 1px solid var(--n-color-fill-hover);
}

.n-select__search-input {
  width: 100%;
  border: 1px solid var(--n-color-border);
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.n-select__search-input:focus { border-color: var(--n-color-primary); }

.n-select__options {
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
}

.n-select__option {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
}

.n-select__option:hover { background: var(--n-color-fill-hover); }
.n-select__option--selected { background: var(--n-color-primary-light); color: var(--n-color-primary); font-weight: 500; }
.n-select__option--disabled { opacity: 0.5; cursor: not-allowed; }

.n-select__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
  color: var(--n-color-text-disabled);
  font-size: 14px;
}

.n-select__loading-icon {
  animation: n-spin 1s linear infinite;
}

@keyframes n-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.n-select__empty {
  padding: 24px 0;
  text-align: center;
  color: var(--n-color-text-disabled);
  font-size: 14px;
}

.n-select__fade-enter-active,
.n-select__fade-leave-active {
  transition: all 0.15s ease;
}
.n-select__fade-enter-from,
.n-select__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
