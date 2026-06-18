<template>
  <div class="n-checkbox-group" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'

interface Props {
  modelValue: any[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: any[]]
  change: [val: any[]]
}>()

function updateValue(vals: any[]) {
  emit('update:modelValue', vals)
  emit('change', vals)
}

provide('n-checkbox-group', { modelValue: props.modelValue, disabled: props.disabled, updateValue })
</script>

<style scoped>
.n-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
