<template>
  <div ref="pickerRef" :class="[
    'n-time-picker',
    `n-time-picker--${size}`,
    `n-time-picker--${type}`,
    {
      'n-time-picker--disabled': disabled,
      'n-time-picker--open': open,
      'n-time-picker--has-value': hasValue,
    },
  ]">
    <!-- Trigger: single -->
    <div v-if="type !== 'timerange'" class="n-time-picker__trigger" @click="toggleOpen">
      <NIcon name="shijian" :size="16" class="n-time-picker__icon" />
      <span v-if="displayValue" class="n-time-picker__value">{{ displayValue }}</span>
      <span v-else class="n-time-picker__placeholder">{{ placeholder }}</span>
      <span v-if="clearable && hasValue" class="n-time-picker__clear" @click.stop="handleClear">×</span>
    </div>

    <!-- Trigger: timerange -->
    <div v-else class="n-time-picker__trigger n-time-picker__trigger--range" @click="toggleOpen">
      <NIcon name="shijian" :size="16" class="n-time-picker__icon" />
      <span :class="['n-time-picker__range-cell', { 'n-time-picker__range-cell--active': rangeStart }]">
        {{ rangeStartDisplay || startPlaceholder }}
      </span>
      <span class="n-time-picker__range-sep">至</span>
      <span :class="['n-time-picker__range-cell', { 'n-time-picker__range-cell--active': rangeEnd }]">
        {{ rangeEndDisplay || endPlaceholder }}
      </span>
      <span v-if="clearable && hasRangeValue" class="n-time-picker__clear" @click.stop="handleClear">×</span>
    </div>

    <transition name="n-time-picker__fade">
      <div v-show="open" class="n-time-picker__panel">
        <!-- Single time picker -->
        <template v-if="type !== 'timerange'">
          <div class="n-time-picker__columns">
            <div class="n-time-picker__column">
              <div class="n-time-picker__column-title">时</div>
              <div class="n-time-picker__scroll-area">
                <div ref="hourRef" class="n-time-picker__scroll" @scroll="onScroll('hour'); onScrollEnd('hour')">
                  <div class="n-time-picker__pad"></div>
                  <div v-for="h in hourCount" :key="h - 1"
                    :class="['n-time-picker__cell', { 'n-time-picker__cell--active': currentHour === h - 1, 'n-time-picker__cell--disabled': isHourDisabled(h - 1) }]"
                    @click="!isHourDisabled(h - 1) && selectTime('hour', h - 1)">{{ String(h - 1).padStart(2, '0') }}</div>
                  <div class="n-time-picker__pad"></div>
                </div>
                <div class="n-time-picker__highlight"></div>
              </div>
            </div>
            <div v-if="showMinute" class="n-time-picker__column">
              <div class="n-time-picker__column-title">分</div>
              <div class="n-time-picker__scroll-area">
                <div ref="minuteRef" class="n-time-picker__scroll" @scroll="onScroll('minute'); onScrollEnd('minute')">
                  <div class="n-time-picker__pad"></div>
                  <div v-for="m in 60" :key="m - 1"
                    :class="['n-time-picker__cell', { 'n-time-picker__cell--active': currentMinute === m - 1, 'n-time-picker__cell--disabled': isMinuteDisabled(m - 1) }]"
                    @click="!isMinuteDisabled(m - 1) && selectTime('minute', m - 1)">{{ String(m - 1).padStart(2, '0') }}</div>
                  <div class="n-time-picker__pad"></div>
                </div>
                <div class="n-time-picker__highlight"></div>
              </div>
            </div>
            <div v-if="showSecond" class="n-time-picker__column">
              <div class="n-time-picker__column-title">秒</div>
              <div class="n-time-picker__scroll-area">
                <div ref="secondRef" class="n-time-picker__scroll" @scroll="onScroll('second'); onScrollEnd('second')">
                  <div class="n-time-picker__pad"></div>
                  <div v-for="s in 60" :key="s - 1"
                    :class="['n-time-picker__cell', { 'n-time-picker__cell--active': currentSecond === s - 1, 'n-time-picker__cell--disabled': isSecondDisabled(s - 1) }]"
                    @click="!isSecondDisabled(s - 1) && selectTime('second', s - 1)">{{ String(s - 1).padStart(2, '0') }}</div>
                  <div class="n-time-picker__pad"></div>
                </div>
                <div class="n-time-picker__highlight"></div>
              </div>
            </div>
          </div>
          <div class="n-time-picker__footer">
            <button class="n-time-picker__btn" @click="handleClear">清除</button>
            <button class="n-time-picker__btn n-time-picker__btn--primary" @click="handleConfirm">确定</button>
          </div>
        </template>

        <!-- Range time picker -->
        <template v-else>
          <div class="n-time-picker__range-blocks">
            <div class="n-time-picker__range-block" :class="{ 'n-time-picker__range-block--active': !selectingEnd }" @click="selectingEnd = false">
              <div class="n-time-picker__range-block-title">开始时间</div>
              <div class="n-time-picker__columns">
                <div class="n-time-picker__column">
                  <div class="n-time-picker__column-title">时</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="startHourRef" class="n-time-picker__scroll" @scroll="onScroll('hour', false); onScrollEnd('hour', false)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="h in 24" :key="h - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': startHour === h - 1 }]"
                        @click.stop="selectTime('hour', h - 1, false)">{{ String(h - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
                <div v-if="showMinute" class="n-time-picker__column">
                  <div class="n-time-picker__column-title">分</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="startMinuteRef" class="n-time-picker__scroll" @scroll="onScroll('minute', false); onScrollEnd('minute', false)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="m in 60" :key="m - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': startMinute === m - 1 }]"
                        @click.stop="selectTime('minute', m - 1, false)">{{ String(m - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
                <div v-if="showSecond" class="n-time-picker__column">
                  <div class="n-time-picker__column-title">秒</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="startSecondRef" class="n-time-picker__scroll" @scroll="onScroll('second', false); onScrollEnd('second', false)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="s in 60" :key="s - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': startSecond === s - 1 }]"
                        @click.stop="selectTime('second', s - 1, false)">{{ String(s - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="n-time-picker__range-block" :class="{ 'n-time-picker__range-block--active': selectingEnd }" @click="selectingEnd = true">
              <div class="n-time-picker__range-block-title">结束时间</div>
              <div class="n-time-picker__columns">
                <div class="n-time-picker__column">
                  <div class="n-time-picker__column-title">时</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="endHourRef" class="n-time-picker__scroll" @scroll="onScroll('hour', true); onScrollEnd('hour', true)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="h in 24" :key="h - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': endHour === h - 1 }]"
                        @click.stop="selectTime('hour', h - 1, true)">{{ String(h - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
                <div v-if="showMinute" class="n-time-picker__column">
                  <div class="n-time-picker__column-title">分</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="endMinuteRef" class="n-time-picker__scroll" @scroll="onScroll('minute', true); onScrollEnd('minute', true)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="m in 60" :key="m - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': endMinute === m - 1 }]"
                        @click.stop="selectTime('minute', m - 1, true)">{{ String(m - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
                <div v-if="showSecond" class="n-time-picker__column">
                  <div class="n-time-picker__column-title">秒</div>
                  <div class="n-time-picker__scroll-area">
                    <div ref="endSecondRef" class="n-time-picker__scroll" @scroll="onScroll('second', true); onScrollEnd('second', true)">
                      <div class="n-time-picker__pad"></div>
                      <div v-for="s in 60" :key="s - 1"
                        :class="['n-time-picker__cell', { 'n-time-picker__cell--active': endSecond === s - 1 }]"
                        @click.stop="selectTime('second', s - 1, true)">{{ String(s - 1).padStart(2, '0') }}</div>
                      <div class="n-time-picker__pad"></div>
                    </div>
                    <div class="n-time-picker__highlight"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="n-time-picker__footer n-time-picker__footer--range">
            <button class="n-time-picker__btn" @click="handleClear">清除</button>
            <button class="n-time-picker__btn n-time-picker__btn--primary" @click="handleConfirm">确定</button>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import NIcon from './Icon.vue'

type TimePickerType = 'hour' | 'time' | 'timerange'

interface Props {
  modelValue?: string | [string, string]
  type?: TimePickerType
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
  format?: string
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'time',
  placeholder: '请选择时间',
  startPlaceholder: '开始时间',
  endPlaceholder: '结束时间',
  disabled: false,
  clearable: false,
  size: 'md',
  format: undefined,
  disabledHours: undefined,
  disabledMinutes: undefined,
  disabledSeconds: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [val: string | [string, string] | undefined]
  change: [val: string | [string, string] | undefined]
}>()

const CELL_HEIGHT = 28
const pickerRef = ref<HTMLElement>()
const open = ref(false)
const selectingEnd = ref(false)

// Single time state
const currentHour = ref(0)
const currentMinute = ref(0)
const currentSecond = ref(0)

// Range time state
const startHour = ref(0)
const startMinute = ref(0)
const startSecond = ref(0)
const endHour = ref(0)
const endMinute = ref(0)
const endSecond = ref(0)

// Range trigger display values
const rangeStart = ref('')
const rangeEnd = ref('')

// Scroll refs
const hourRef = ref<HTMLElement>()
const minuteRef = ref<HTMLElement>()
const secondRef = ref<HTMLElement>()
const startHourRef = ref<HTMLElement>()
const startMinuteRef = ref<HTMLElement>()
const startSecondRef = ref<HTMLElement>()
const endHourRef = ref<HTMLElement>()
const endMinuteRef = ref<HTMLElement>()
const endSecondRef = ref<HTMLElement>()

// Computed
const isRangeType = computed(() => props.type === 'timerange')

const hourCount = computed(() => props.type === 'hour' ? 24 : 24)
const showMinute = computed(() => props.type !== 'hour')
const showSecond = computed(() => props.type === 'time' || props.type === 'timerange')

const hasValue = computed(() => {
  if (isRangeType.value) return false
  return !!props.modelValue && !Array.isArray(props.modelValue)
})

const hasRangeValue = computed(() => {
  if (!isRangeType.value) return false
  return Array.isArray(props.modelValue) && !!props.modelValue[0]
})

const formatStr = computed(() => {
  if (props.format) return props.format
  if (props.type === 'hour') return 'HH'
  if (props.type === 'time' || props.type === 'timerange') return 'HH:mm:ss'
  return 'HH:mm'
})

function formatTime(h: number, m: number, s: number): string {
  return formatStr.value
    .replace('HH', String(h).padStart(2, '0'))
    .replace('mm', String(m).padStart(2, '0'))
    .replace('ss', String(s).padStart(2, '0'))
}

function parseTimeStr(val: string): { h: number, m: number, s: number } | null {
  if (!val) return null
  const parts = val.split(':')
  return {
    h: Number(parts[0]) || 0,
    m: Number(parts[1]) || 0,
    s: Number(parts[2]) || 0,
  }
}

const displayValue = computed(() => {
  if (!hasValue.value || Array.isArray(props.modelValue)) return ''
  const t = parseTimeStr(props.modelValue as string)
  if (!t) return ''
  let h = t.h, m = t.m, s = t.s
  // Adjust based on format
  if (!showSecond.value) s = 0
  if (!showMinute.value) m = 0
  return formatTime(h, m, s)
})

const rangeStartDisplay = computed(() => {
  if (!rangeStart.value) return ''
  const t = parseTimeStr(rangeStart.value)
  if (!t) return ''
  return formatTime(t.h, t.m, t.s)
})

const rangeEndDisplay = computed(() => {
  if (!rangeEnd.value) return ''
  const t = parseTimeStr(rangeEnd.value)
  if (!t) return ''
  return formatTime(t.h, t.m, t.s)
})

// Disabled helpers
function isHourDisabled(h: number): boolean {
  if (!props.disabledHours) return false
  return props.disabledHours().includes(h)
}

function isMinuteDisabled(m: number): boolean {
  if (!props.disabledMinutes) return false
  return props.disabledMinutes(currentHour.value).includes(m)
}

function isSecondDisabled(s: number): boolean {
  if (!props.disabledSeconds) return false
  return props.disabledSeconds(currentHour.value, currentMinute.value).includes(s)
}

// Sync from modelValue
watch(() => props.modelValue, (val) => {
  if (isRangeType.value && Array.isArray(val)) {
    const s = parseTimeStr(val[0] || '')
    const e = parseTimeStr(val[1] || '')
    if (s) { startHour.value = s.h; startMinute.value = s.m; startSecond.value = s.s }
    if (e) { endHour.value = e.h; endMinute.value = e.m; endSecond.value = e.s }
    rangeStart.value = val[0] || ''
    rangeEnd.value = val[1] || ''
  } else if (!Array.isArray(val) && val) {
    const t = parseTimeStr(val)
    if (t) { currentHour.value = t.h; currentMinute.value = t.m; currentSecond.value = t.s }
  }
}, { immediate: true })

// When panel opens, scroll to active cells
watch(open, (v) => {
  if (v) {
    selectingEnd.value = false
    if (isRangeType.value) {
      nextTick(() => {
        scrollToValue(startHourRef, startHour.value)
        scrollToValue(startMinuteRef, startMinute.value)
        scrollToValue(startSecondRef, startSecond.value)
        scrollToValue(endHourRef, endHour.value)
        scrollToValue(endMinuteRef, endMinute.value)
        scrollToValue(endSecondRef, endSecond.value)
      })
    } else {
      nextTick(() => {
        scrollToValue(hourRef, currentHour.value)
        scrollToValue(minuteRef, currentMinute.value)
        scrollToValue(secondRef, currentSecond.value)
      })
    }
  }
})

watch(selectingEnd, () => {
  nextTick(() => {
    scrollToValue(startHourRef, startHour.value)
    scrollToValue(startMinuteRef, startMinute.value)
    scrollToValue(startSecondRef, startSecond.value)
    scrollToValue(endHourRef, endHour.value)
    scrollToValue(endMinuteRef, endMinute.value)
    scrollToValue(endSecondRef, endSecond.value)
  })
})

// ========== Scroll helpers ==========

function scrollToValue(elRef: typeof hourRef, value: number) {
  const el = elRef?.value
  if (!el) return
  el.scrollTop = value * CELL_HEIGHT
}

function selectTime(type: 'hour' | 'minute' | 'second', value: number, isEnd = false) {
  if (isEnd) {
    if (type === 'hour') endHour.value = value
    else if (type === 'minute') endMinute.value = value
    else endSecond.value = value
  } else {
    if (type === 'hour') currentHour.value = value
    else if (type === 'minute') currentMinute.value = value
    else currentSecond.value = value
  }
  const refMap: Record<string, Record<string, typeof hourRef>> = {
    single: { hour: hourRef, minute: minuteRef, second: secondRef },
    start: { hour: startHourRef, minute: startMinuteRef, second: startSecondRef },
    end: { hour: endHourRef, minute: endMinuteRef, second: endSecondRef },
  }
  const target = isRangeType.value ? (isEnd ? 'end' : 'start') : 'single'
  nextTick(() => {
    const el = refMap[target][type]?.value
    if (el) el.scrollTop = value * CELL_HEIGHT
  })
}

function onScroll(type: 'hour' | 'minute' | 'second', isEnd = false) {
  if (isRangeType.value) return onScrollRange(type, isEnd)

  const refMap: Record<string, typeof hourRef> = { hour: hourRef, minute: minuteRef, second: secondRef }
  const el = refMap[type]?.value
  if (!el) return
  const idx = Math.round(el.scrollTop / CELL_HEIGHT)
  const max = type === 'hour' ? 23 : 59
  const clamped = Math.min(Math.max(idx, 0), max)
  if (type === 'hour' && currentHour.value !== clamped) currentHour.value = clamped
  else if (type === 'minute' && currentMinute.value !== clamped) currentMinute.value = clamped
  else if (type === 'second' && currentSecond.value !== clamped) currentSecond.value = clamped
}

function onScrollRange(type: 'hour' | 'minute' | 'second', isEnd: boolean) {
  const refMap: Record<string, Record<string, typeof hourRef>> = {
    start: { hour: startHourRef, minute: startMinuteRef, second: startSecondRef },
    end: { hour: endHourRef, minute: endMinuteRef, second: endSecondRef },
  }
  const target = isEnd ? 'end' : 'start'
  const el = refMap[target][type]?.value
  if (!el) return
  const idx = Math.round(el.scrollTop / CELL_HEIGHT)
  const max = type === 'hour' ? 23 : 59
  const clamped = Math.min(Math.max(idx, 0), max)
  if (type === 'hour') {
    if (isEnd && endHour.value !== clamped) endHour.value = clamped
    else if (!isEnd && startHour.value !== clamped) startHour.value = clamped
  } else if (type === 'minute') {
    if (isEnd && endMinute.value !== clamped) endMinute.value = clamped
    else if (!isEnd && startMinute.value !== clamped) startMinute.value = clamped
  } else {
    if (isEnd && endSecond.value !== clamped) endSecond.value = clamped
    else if (!isEnd && startSecond.value !== clamped) startSecond.value = clamped
  }
}

let scrollTimers: Record<string, ReturnType<typeof setTimeout>> = {}
function onScrollEnd(type: 'hour' | 'minute' | 'second', isEnd = false) {
  const key = `${type}-${isEnd ? 'end' : 'start'}`
  clearTimeout(scrollTimers[key])
  scrollTimers[key] = setTimeout(() => {
    const target = isRangeType.value ? (isEnd ? 'end' : 'start') : 'single'
    const refMap: Record<string, Record<string, typeof hourRef>> = {
      single: { hour: hourRef, minute: minuteRef, second: secondRef },
      start: { hour: startHourRef, minute: startMinuteRef, second: startSecondRef },
      end: { hour: endHourRef, minute: endMinuteRef, second: endSecondRef },
    }
    const valMap: Record<string, Record<string, typeof currentHour>> = {
      single: { hour: currentHour, minute: currentMinute, second: currentSecond },
      start: { hour: startHour, minute: startMinute, second: startSecond },
      end: { hour: endHour, minute: endMinute, second: endSecond },
    }
    const el = refMap[target][type]?.value
    if (el) el.scrollTop = valMap[target][type].value * CELL_HEIGHT
  }, 80)
}

// ========== Actions ==========

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

function handleConfirm() {
  if (isRangeType.value) {
    const sh = String(startHour.value).padStart(2, '0')
    const sm = String(startMinute.value).padStart(2, '0')
    const ss = String(startSecond.value).padStart(2, '0')
    const eh = String(endHour.value).padStart(2, '0')
    const em = String(endMinute.value).padStart(2, '0')
    const es = String(endSecond.value).padStart(2, '0')

    let startVal = `${sh}:${sm}`
    let endVal = `${eh}:${em}`
    if (showSecond.value) {
      startVal = `${startVal}:${ss}`
      endVal = `${endVal}:${es}`
    }
    const val: [string, string] = [startVal, endVal]
    rangeStart.value = startVal
    rangeEnd.value = endVal
    emit('update:modelValue', val)
    emit('change', val)
    open.value = false
    return
  }

  const sh = String(currentHour.value).padStart(2, '0')
  const sm = String(currentMinute.value).padStart(2, '0')
  const ss = String(currentSecond.value).padStart(2, '0')

  let val = `${sh}:${sm}`
  if (showSecond.value) val = `${val}:${ss}`

  emit('update:modelValue', val)
  emit('change', val)
  open.value = false
}

function handleClear() {
  if (isRangeType.value) {
    rangeStart.value = ''
    rangeEnd.value = ''
    emit('update:modelValue', undefined)
    emit('change', undefined)
  } else {
    emit('update:modelValue', undefined)
    emit('change', undefined)
  }
}

function onClickOutside(e: Event) {
  if (pickerRef.value && !pickerRef.value.contains(e.target as HTMLElement)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.n-time-picker {
  position: relative;
  display: inline-block;
  width: 100%;
}

.n-time-picker--hour,
.n-time-picker--time {
  max-width: 200px;
}

.n-time-picker--timerange {
  max-width: 360px;
  min-width: 240px;
}

.n-time-picker--sm .n-time-picker__trigger { height: 28px; font-size: 12px; padding: 0 8px; }
.n-time-picker--md .n-time-picker__trigger { height: 36px; font-size: 14px; padding: 0 12px; }
.n-time-picker--lg .n-time-picker__trigger { height: 44px; font-size: 16px; padding: 0 16px; }

/* Trigger */
.n-time-picker__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: 1px solid var(--n-color-border-hover);
  border-radius: 6px;
  background: var(--n-color-bg);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.n-time-picker__trigger:hover {
  border-color: var(--n-color-primary);
}

.n-time-picker--open .n-time-picker__trigger {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.n-time-picker--disabled .n-time-picker__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-time-picker__icon {
  color: var(--n-color-text-disabled);
  flex-shrink: 0;
}

.n-time-picker__value {
  flex: 1;
  color: var(--n-color-text);
  overflow: hidden;
  white-space: nowrap;
}

.n-time-picker__placeholder {
  color: var(--n-color-text-disabled);
  flex: 1;
}

.n-time-picker__clear {
  color: var(--n-color-text-disabled);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.n-time-picker__clear:hover {
  color: var(--n-color-text-secondary);
}

/* Range trigger */
.n-time-picker__trigger--range {
  gap: 4px;
}

.n-time-picker__range-cell {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: inherit;
  color: var(--n-color-text-disabled);
  overflow: hidden;
  white-space: nowrap;
  transition: color 0.2s;
}

.n-time-picker__range-cell--active {
  color: var(--n-color-text);
}

.n-time-picker__range-sep {
  color: var(--n-color-text-disabled);
  flex-shrink: 0;
  font-size: 12px;
}

/* Panel */
.n-time-picker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  padding: 12px;
  min-width: 180px;
}

.n-time-picker--timerange .n-time-picker__panel {
  min-width: 380px;
}

/* Columns */
.n-time-picker__columns {
  display: flex;
  gap: 0;
  height: 196px;
  position: relative;
  border: 1px solid var(--n-color-border);
  border-radius: 6px;
  overflow: hidden;
}

.n-time-picker__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.n-time-picker__column + .n-time-picker__column {
  border-left: 1px solid var(--n-color-border);
}

.n-time-picker__column-title {
  text-align: center;
  font-size: 12px;
  color: var(--n-color-text-disabled);
  padding: 4px 0;
  background: var(--n-color-fill-hover, rgba(0,0,0,0.02));
  border-bottom: 1px solid var(--n-color-border);
  flex-shrink: 0;
}

/* Scroll area — contains the scroll container + highlight + masks */
.n-time-picker__scroll-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.n-time-picker__scroll {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.n-time-picker__scroll::-webkit-scrollbar {
  width: 0;
  display: none;
}

.n-time-picker__pad {
  height: 84px; /* 3 cells padding */
}

.n-time-picker__cell {
  text-align: center;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  cursor: pointer;
  color: var(--n-color-text-secondary);
  transition: color 0.12s, font-weight 0.12s;
  user-select: none;
  position: relative;
  z-index: 3;
}

.n-time-picker__cell:hover {
  color: var(--n-color-primary);
  font-weight: 600;
}

.n-time-picker__cell--active {
  color: var(--n-color-primary);
  font-weight: 700;
  font-size: 14px;
}

.n-time-picker__cell--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.n-time-picker__cell--disabled:hover {
  color: var(--n-color-text-secondary);
  font-weight: 400;
}

/* Center highlight bar inside scroll-area */
.n-time-picker__highlight {
  position: absolute;
  top: 84px;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
  border-top: 1px solid var(--n-color-primary-light, rgba(59, 130, 246, 0.15));
  border-bottom: 1px solid var(--n-color-primary-light, rgba(59, 130, 246, 0.15));
  pointer-events: none;
  z-index: 0;
}

/* Top/bottom fade masks per scroll-area */
.n-time-picker__scroll-area::before,
.n-time-picker__scroll-area::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 80px;
  pointer-events: none;
  z-index: 4;
}

.n-time-picker__scroll-area::before {
  top: 0;
  background: linear-gradient(to bottom, var(--n-color-bg), transparent);
}

.n-time-picker__scroll-area::after {
  bottom: 0;
  background: linear-gradient(to top, var(--n-color-bg), transparent);
}

/* Footer */
.n-time-picker__footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.n-time-picker__footer--range {
  justify-content: center;
}

.n-time-picker__btn {
  padding: 4px 14px;
  border: 1px solid var(--n-color-border);
  border-radius: 4px;
  background: var(--n-color-bg);
  color: var(--n-color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.n-time-picker__btn:hover {
  border-color: var(--n-color-primary);
  color: var(--n-color-primary);
}

.n-time-picker__btn--primary {
  background: var(--n-color-primary);
  border-color: var(--n-color-primary);
  color: #fff;
}

.n-time-picker__btn--primary:hover {
  opacity: 0.85;
  color: #fff;
}

/* Range blocks */
.n-time-picker__range-blocks {
  display: flex;
  gap: 10px;
}

.n-time-picker__range-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.n-time-picker__range-block .n-time-picker__columns {
  height: 196px;
}

.n-time-picker__range-block--active {
  opacity: 1;
}

.n-time-picker__range-block-title {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--n-color-primary);
  padding: 2px 0;
}

/* Transition */
.n-time-picker__fade-enter-active,
.n-time-picker__fade-leave-active {
  transition: all 0.15s ease;
}

.n-time-picker__fade-enter-from,
.n-time-picker__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
