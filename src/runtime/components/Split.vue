<template>
  <div
    ref="splitRef"
    class="n-split"
    :class="rootClass"
    :style="rootStyle"
  >
    <div class="n-split__panel" :style="panel1Style">
      <slot name="1" />
    </div>
    <div
      class="n-split__bar"
      :style="barStyle"
      @mousedown.prevent="onMouseDown"
    >
      <div class="n-split__bar-handle" />
    </div>
    <div class="n-split__panel" :style="panel2Style">
      <slot name="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  defaultRatio?: number
  ratio?: number
  min?: number
  max?: number
  barSize?: number
  disabled?: boolean
  collapsible?: boolean
}>(), {
  direction: 'horizontal',
  defaultRatio: 0.5,
  min: 0.1,
  max: 0.9,
  barSize: 4,
  disabled: false,
  collapsible: false,
})

const emit = defineEmits<{
  'update:ratio': [value: number]
  resize: [ratio: number]
}>()

const splitRef = ref<HTMLElement | null>(null)
const currentRatio = ref(props.defaultRatio)

// 支持 v-model:ratio
watch(() => props.ratio, (v) => {
  if (v !== undefined) currentRatio.value = v
})

const isHorizontal = computed(() => props.direction === 'horizontal')

const rootClass = computed(() => {
  const classes = [`n-split--${props.direction}`]
  if (props.disabled) classes.push('n-split--disabled')
  return classes.join(' ')
})

const rootStyle = computed<Record<string, string>>(() => ({
  flexDirection: isHorizontal.value ? 'row' : 'column',
}))

const panel1Style = computed<Record<string, string>>(() => ({
  flex: `0 0 ${currentRatio.value * 100}%`,
  overflow: 'auto',
}))

const panel2Style = computed<Record<string, string>>(() => ({
  flex: '1',
  overflow: 'auto',
}))

const barStyle = computed<Record<string, string>>(() => {
  const dir = isHorizontal.value ? 'width' : 'height'
  const cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  return {
    flex: '0 0 auto',
    [dir]: `${props.barSize}px`,
    cursor: props.disabled ? 'default' : cursor,
  }
})

function onMouseDown() {
  if (props.disabled) return
  const el = splitRef.value!
  const rect = el.getBoundingClientRect()

  function onMove(ev: MouseEvent) {
    let r = isHorizontal.value
      ? (ev.clientX - rect.left) / rect.width
      : (ev.clientY - rect.top) / rect.height
    r = Math.max(props.min, Math.min(props.max, r))
    currentRatio.value = r
    emit('update:ratio', r)
    emit('resize', r)
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = isHorizontal.value ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.n-split {
  display: flex;
  width: 100%;
  height: 100%;
}

.n-split--disabled .n-split__bar {
  cursor: default;
  pointer-events: none;
}

.n-split__panel {
  overflow: auto;
}

.n-split__bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.15s;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.n-split__bar:hover {
  background: var(--n-color-primary-light);
}

/* 分割条手柄：水平时竖线，垂直时横线 */
.n-split__bar-handle {
  background: var(--n-color-border-hover);
  border-radius: 2px;
  transition: background 0.15s;
}

.n-split--horizontal .n-split__bar-handle {
  width: 2px;
  height: 24px;
}

.n-split--vertical .n-split__bar-handle {
  width: 24px;
  height: 2px;
}

.n-split__bar:hover .n-split__bar-handle {
  background: var(--n-color-primary);
}
</style>
