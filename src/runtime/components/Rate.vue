<template>
  <div
    :class="['n-rate', `n-rate--${size}`, { 'n-rate--disabled': disabled }]"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-for="i in count"
      :key="i"
      :class="[
        'n-rate__star',
        {
          'n-rate__star--active': isActive(i),
          'n-rate__star--half': isHalf(i),
        },
      ]"
      :style="activeStarStyle"
      @mousemove="handleMouseMove(i, $event)"
      @click="handleClick(i)"
    >
      <span v-if="$slots.icon" class="n-rate__icon">
        <slot name="icon" :index="i" :active="isActive(i)" />
      </span>
      <span v-else class="n-rate__character">{{ icon }}</span>
    </span>
    <span v-if="showText" class="n-rate__text">{{ displayText }}</span>
    <span v-if="tooltips && hoverIndex > 0" class="n-rate__tooltip">{{ tooltips[hoverIndex - 1] }}</span>
    <span v-if="clearable && modelValue > 0" class="n-rate__clear" @click.stop="handleClear">✕</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
  count?: number
  allowHalf?: boolean
  showText?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  icon?: string
  clearable?: boolean
  tooltips?: string[]
  texts?: Record<number, string>
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
  allowHalf: false,
  showText: false,
  disabled: false,
  size: 'md',
  color: undefined,
  icon: '★',
  clearable: false,
  tooltips: undefined,
  texts: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [val: number]
  change: [val: number]
}>()

const hoverVal = ref(0)
const hoverIndex = ref(0)

const activeStarStyle = computed(() => {
  if (!props.color) return {}
  return { '--n-rate-active-color': props.color }
})

function isActive(i: number): boolean {
  const val = hoverVal.value || props.modelValue
  if (props.allowHalf) {
    return i <= Math.ceil(val)
  }
  return i <= val
}

function isHalf(i: number): boolean {
  if (!props.allowHalf) return false
  const val = hoverVal.value || props.modelValue
  return i === Math.ceil(val) && val % 1 !== 0
}

const displayText = computed(() => {
  if (props.texts) {
    const rounded = Math.round(props.modelValue)
    return props.texts[rounded] || `${props.modelValue} 星`
  }
  return `${props.modelValue} 星`
})

function handleMouseMove(i: number, e: MouseEvent) {
  if (props.disabled) return
  hoverIndex.value = i
  if (props.allowHalf) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const isLeft = e.clientX - rect.left < rect.width / 2
    hoverVal.value = isLeft ? i - 0.5 : i
  } else {
    hoverVal.value = i
  }
}

function handleMouseLeave() {
  if (props.disabled) return
  hoverVal.value = 0
  hoverIndex.value = 0
}

function handleClick(i: number) {
  if (props.disabled) return
  const newVal = hoverVal.value || i
  if (props.clearable && newVal === props.modelValue) {
    emit('update:modelValue', 0)
    emit('change', 0)
  } else {
    emit('update:modelValue', newVal)
    emit('change', newVal)
  }
}

function handleClear() {
  if (props.disabled) return
  emit('update:modelValue', 0)
  emit('change', 0)
}
</script>

<style scoped>
.n-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.n-rate--disabled .n-rate__star {
  cursor: not-allowed;
  opacity: 0.6;
}

.n-rate__star {
  position: relative;
  font-size: 24px;
  color: var(--n-color-border-hover);
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
  line-height: 1;
}

.n-rate--sm .n-rate__star { font-size: 16px; }
.n-rate--lg .n-rate__star { font-size: 32px; }

.n-rate__star--active {
  color: var(--n-rate-active-color, var(--n-color-warning));
}

.n-rate__star--half {
  color: var(--n-color-border-hover);
}

.n-rate__star--half::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  color: var(--n-rate-active-color, var(--n-color-warning));
}

.n-rate__star:hover {
  transform: scale(1.15);
}

.n-rate--disabled .n-rate__star:hover {
  transform: none;
}

.n-rate__character {
  display: inline-block;
}

.n-rate__icon {
  display: inline-flex;
  align-items: center;
}

.n-rate__text {
  font-size: 14px;
  color: var(--n-color-text-secondary);
  margin-left: 8px;
}

.n-rate__tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--n-color-text-secondary);
  color: var(--n-color-text-inverse);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.n-rate__clear {
  margin-left: 4px;
  font-size: 12px;
  color: var(--n-color-text-disabled);
  cursor: pointer;
  transition: color 0.2s;
}

.n-rate__clear:hover {
  color: var(--n-color-danger, #ef4444);
}
</style>
