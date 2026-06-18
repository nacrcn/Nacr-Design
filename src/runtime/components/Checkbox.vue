<template>
  <label :class="['n-checkbox', { 'n-checkbox--checked': checked, 'n-checkbox--disabled': disabled, 'n-checkbox--indeterminate': indeterminate }]">
    <input
      type="checkbox"
      class="n-checkbox__input"
      :checked="checked"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="handleChange"
    />
    <span class="n-checkbox__mark">
      <svg v-if="indeterminate" class="n-checkbox__icon" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <svg v-else-if="checked" class="n-checkbox__icon" viewBox="0 0 16 16"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    </span>
    <span class="n-checkbox__label"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  modelValue?: boolean
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  value?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  checked: undefined,
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  change: [val: boolean, e: Event]
}>()

const group = inject<any>('n-checkbox-group', null)

const isChecked = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (props.checked !== undefined) return props.checked
  if (group && props.value !== undefined) return group.modelValue.includes(props.value)
  return false
})

const checked = computed(() => isChecked.value)

function handleChange(e: Event) {
  const val = (e.target as HTMLInputElement).checked
  if (group && props.value !== undefined) {
    const vals = [...group.modelValue]
    if (val) vals.push(props.value)
    else vals.splice(vals.indexOf(props.value), 1)
    group.updateValue(vals)
  } else {
    emit('update:modelValue', val)
    emit('change', val, e)
  }
}
</script>

<style scoped>
.n-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--n-color-text-secondary);
}

.n-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.n-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.n-checkbox__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid var(--n-color-border-hover);
  border-radius: 4px;
  background: var(--n-color-bg);
  transition: all 0.2s;
  flex-shrink: 0;
}

.n-checkbox--checked .n-checkbox__mark {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

.n-checkbox--indeterminate .n-checkbox__mark {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
}

.n-checkbox__icon {
  width: 14px;
  height: 14px;
  color: var(--n-color-text-inverse);
}

.n-checkbox:hover .n-checkbox__mark {
  border-color: var(--n-color-primary);
}

.n-checkbox--disabled:hover .n-checkbox__mark {
  border-color: var(--n-color-border-hover);
}

.n-checkbox__label {
  line-height: 1;
}
</style>
