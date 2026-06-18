<template>
  <div
    :class="[
      'n-slider',
      `n-slider--${size}`,
      { 'n-slider--disabled': disabled, 'n-slider--vertical': vertical },
    ]"
  >
    <div class="n-slider__track" ref="trackRef" @click="handleTrackClick" :style="trackStyle">
      <div class="n-slider__fill" :style="fillStyle" />
      <template v-if="range">
        <div
          class="n-slider__thumb"
          :class="{ 'n-slider__thumb--dragging': dragging === 'start' }"
          :style="startThumbStyle"
          @mousedown="handleThumbDown($event, 'start')"
          @mouseenter="showThumbTooltip('start')"
          @mouseleave="hideThumbTooltip('start')"
        />
        <div
          class="n-slider__thumb"
          :class="{ 'n-slider__thumb--dragging': dragging === 'end' }"
          :style="endThumbStyle"
          @mousedown="handleThumbDown($event, 'end')"
          @mouseenter="showThumbTooltip('end')"
          @mouseleave="hideThumbTooltip('end')"
        />
      </template>
      <template v-else>
        <div
          class="n-slider__thumb"
          :class="{ 'n-slider__thumb--dragging': dragging === 'single' }"
          :style="singleThumbStyle"
          @mousedown="handleThumbDown($event, 'single')"
          @mouseenter="showThumbTooltip('single')"
          @mouseleave="hideThumbTooltip('single')"
        />
      </template>
    </div>
    <!-- Tooltips -->
    <template v-if="range">
      <span v-if="showTooltip && tooltipVisible.start" class="n-slider__tooltip" :style="startTooltipStyle">
        {{ formatLabel((modelValue as [number, number])[0]) }}
      </span>
      <span v-if="showTooltip && tooltipVisible.end" class="n-slider__tooltip" :style="endTooltipStyle">
        {{ formatLabel((modelValue as [number, number])[1]) }}
      </span>
    </template>
    <template v-else>
      <span v-if="showTooltip && tooltipVisible.single" class="n-slider__tooltip" :style="singleTooltipStyle">
        {{ formatLabel(modelValue as number) }}
      </span>
    </template>
    <div class="n-slider__marks" v-if="marks && !vertical">
      <span v-for="(label, key) in marks" :key="key" class="n-slider__mark" :style="{ left: ((Number(key) - min) / (max - min) * 100) + '%' }">{{ label }}</span>
    </div>
    <!-- Input -->
    <div v-if="input && !range" class="n-slider__input">
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @change="handleInputChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

interface Props {
  modelValue: number | [number, number]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showTooltip?: boolean
  marks?: Record<number, string>
  range?: boolean
  vertical?: boolean
  size?: 'sm' | 'md' | 'lg'
  formatTooltip?: (val: number) => string | number
  input?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showTooltip: false,
  range: false,
  vertical: false,
  size: 'md',
  formatTooltip: undefined,
  input: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: number | [number, number]]
  change: [val: number | [number, number]]
}>()

const trackRef = ref<HTMLElement | null>(null)
const dragging = ref<'start' | 'end' | 'single' | null>(null)
const tooltipVisible = ref({ start: false, end: false, single: false })

function formatLabel(val: number): string | number {
  if (props.formatTooltip) return props.formatTooltip(val)
  return val
}

function clamp(val: number) {
  const steps = Math.round((val - props.min) / props.step) * props.step + props.min
  return Math.min(props.max, Math.max(props.min, Number(steps.toFixed(10))))
}

function getPercent(val: number) {
  return ((val - props.min) / (props.max - props.min)) * 100
}

// Compute fill and thumb styles
const fillStyle = computed(() => {
  if (props.range) {
    const [s, e] = props.modelValue as [number, number]
    const startP = getPercent(Math.min(s, e))
    const endP = getPercent(Math.max(s, e))
    if (props.vertical) {
      return { bottom: startP + '%', height: (endP - startP) + '%' }
    }
    return { left: startP + '%', width: (endP - startP) + '%' }
  }
  const p = getPercent(props.modelValue as number)
  if (props.vertical) {
    return { bottom: '0%', height: p + '%' }
  }
  return { width: p + '%' }
})

const trackStyle = computed(() => {
  if (!props.vertical) return {}
  return {}
})

function thumbPosition(val: number) {
  const p = getPercent(val)
  if (props.vertical) return { bottom: p + '%' }
  return { left: p + '%' }
}

const startThumbStyle = computed(() => thumbPosition((props.modelValue as [number, number])[0]))
const endThumbStyle = computed(() => thumbPosition((props.modelValue as [number, number])[1]))
const singleThumbStyle = computed(() => thumbPosition(props.modelValue as number))

const startTooltipStyle = computed(() => {
  const s = (props.modelValue as [number, number])[0]
  return props.vertical
    ? { bottom: getPercent(s) + '%', transform: 'translateX(-50%) translateY(-100%)', left: '-30px' }
    : { left: getPercent(s) + '%', transform: 'translateX(-50%)' }
})
const endTooltipStyle = computed(() => {
  const e = (props.modelValue as [number, number])[1]
  return props.vertical
    ? { bottom: getPercent(e) + '%', transform: 'translateX(-50%) translateY(-100%)', left: '-30px' }
    : { left: getPercent(e) + '%', transform: 'translateX(-50%)' }
})
const singleTooltipStyle = computed(() => {
  const v = props.modelValue as number
  return props.vertical
    ? { bottom: getPercent(v) + '%', transform: 'translateX(-50%) translateY(-100%)', left: '-30px' }
    : { left: getPercent(v) + '%', transform: 'translateX(-50%)' }
})

function getValueFromEvent(e: MouseEvent) {
  if (!trackRef.value) return props.min
  const rect = trackRef.value.getBoundingClientRect()
  if (props.vertical) {
    const percent = 1 - (e.clientY - rect.top) / rect.height
    return clamp(props.min + percent * (props.max - props.min))
  }
  const percent = (e.clientX - rect.left) / rect.width
  return clamp(props.min + percent * (props.max - props.min))
}

function handleTrackClick(e: MouseEvent) {
  if (props.disabled) return
  const val = getValueFromEvent(e)
  if (props.range) {
    const [s, ev] = props.modelValue as [number, number]
    const mid = (s + ev) / 2
    if (val < mid) {
      emitUpdate([val, ev])
    } else {
      emitUpdate([s, val])
    }
  } else {
    emitUpdate(val)
  }
}

function emitUpdate(val: number | [number, number]) {
  emit('update:modelValue', val)
  emit('change', val)
}

function handleThumbDown(e: MouseEvent, thumb: 'start' | 'end' | 'single') {
  if (props.disabled) return
  e.preventDefault()
  e.stopPropagation()
  dragging.value = thumb

  const onMove = (ev: MouseEvent) => {
    const val = getValueFromEvent(ev)
    if (props.range) {
      const [s, end] = props.modelValue as [number, number]
      if (thumb === 'start') {
        emitUpdate([Math.min(val, end), end])
      } else {
        emitUpdate([s, Math.max(val, s)])
      }
    } else {
      emitUpdate(val)
    }
  }
  const onUp = (ev: MouseEvent) => {
    onMove(ev)
    dragging.value = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  let val = Number(target.value)
  if (isNaN(val)) return
  val = clamp(val)
  emitUpdate(val)
  target.value = String(val)
}

function showThumbTooltip(thumb: 'start' | 'end' | 'single') {
  tooltipVisible.value[thumb] = true
}

function hideThumbTooltip(thumb: 'start' | 'end' | 'single') {
  if (dragging.value !== thumb) {
    tooltipVisible.value[thumb] = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', () => {})
  document.removeEventListener('mouseup', () => {})
})
</script>

<style scoped>
.n-slider {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  cursor: default;
}

.n-slider--vertical {
  flex-direction: column;
  height: 200px;
  padding: 0 8px;
  align-items: stretch;
}

.n-slider--disabled { opacity: 0.5; pointer-events: none; }

.n-slider__track {
  position: relative;
  height: 6px;
  background: var(--n-color-border);
  border-radius: 100px;
  cursor: pointer;
  flex: 1;
}

.n-slider--vertical .n-slider__track {
  width: 6px;
  height: 100%;
  flex: none;
}

.n-slider--sm .n-slider__track { height: 4px; }
.n-slider--lg .n-slider__track { height: 8px; }
.n-slider--sm.n-slider--vertical .n-slider__track { width: 4px; }
.n-slider--lg.n-slider--vertical .n-slider__track { width: 8px; }

.n-slider__fill {
  position: absolute;
  height: 100%;
  background: var(--n-color-primary);
  border-radius: 100px;
  transition: width 0.05s, left 0.05s, height 0.05s, bottom 0.05s;
}

.n-slider--vertical .n-slider__fill {
  width: 100%;
  height: auto;
  left: 0;
  bottom: 0;
}

.n-slider__thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--n-color-bg);
  border: 2px solid var(--n-color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: box-shadow 0.15s, transform 0.05s;
  z-index: 1;
}

.n-slider--vertical .n-slider__thumb {
  top: auto;
  left: 50%;
  transform: translate(-50%, 50%);
}

.n-slider--sm .n-slider__thumb { width: 14px; height: 14px; }
.n-slider--lg .n-slider__thumb { width: 20px; height: 20px; }

.n-slider__thumb:hover,
.n-slider__thumb--dragging {
  box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
}

.n-slider__thumb--dragging {
  cursor: grabbing;
}

.n-slider__tooltip {
  position: absolute;
  top: -30px;
  background: var(--n-color-text-secondary);
  color: var(--n-color-text-inverse);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 2;
}

.n-slider--vertical .n-slider__tooltip {
  top: auto;
  left: -30px;
  transform: translateY(50%);
}

.n-slider__marks {
  position: relative;
  height: 16px;
  font-size: 12px;
  color: var(--n-color-text-disabled);
  margin-top: 2px;
}

.n-slider__mark {
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
}

.n-slider__input input {
  width: 56px;
  padding: 4px 6px;
  border: 1px solid var(--n-color-border);
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  outline: none;
  color: var(--n-color-text);
  background: var(--n-color-bg);
}

.n-slider__input input:focus {
  border-color: var(--n-color-primary);
}

.n-slider__input input::-webkit-inner-spin-button,
.n-slider__input input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
