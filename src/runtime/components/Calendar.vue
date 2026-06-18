<template>
  <div :class="['n-calendar', `n-calendar--${size}`]">
    <!-- 头部 -->
    <div class="n-calendar__header">
      <div class="n-calendar__header-nav">
        <button class="n-calendar__btn" title="上一年" @click="prevYear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
        </button>
        <button class="n-calendar__btn" title="上个月" @click="prevMonth">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>

      <span class="n-calendar__title" @click="toggleYearPicker">
        {{ titleText }}
        <svg v-if="showYearPicker" class="n-calendar__title-arrow n-calendar__title-arrow--open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
        <svg v-else class="n-calendar__title-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg>
      </span>

      <div class="n-calendar__header-nav">
        <button class="n-calendar__btn" title="下个月" @click="nextMonth">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <button class="n-calendar__btn" title="下一年" @click="nextYear">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
        </button>
      </div>
    </div>

    <!-- 年份选择面板 -->
    <div v-if="showYearPicker" class="n-calendar__year-panel">
      <div class="n-calendar__year-panel-nav">
        <button class="n-calendar__btn n-calendar__btn--sm" @click="yearPage--">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span class="n-calendar__year-range">{{ yearPageStart }} - {{ yearPageEnd }}</span>
        <button class="n-calendar__btn n-calendar__btn--sm" @click="yearPage++">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div class="n-calendar__year-grid">
        <button
          v-for="y in yearList"
          :key="y"
          :class="['n-calendar__year-cell', { 'n-calendar__year-cell--current': y === viewYear, 'n-calendar__year-cell--selected': y === viewYear }]"
          @click="selectYear(y)"
        >{{ y }}</button>
      </div>
    </div>

    <!-- 星期表头 -->
    <div class="n-calendar__weekdays">
      <span v-for="d in weekdayLabels" :key="d" class="n-calendar__weekday">{{ d }}</span>
    </div>

    <!-- 日期网格 -->
    <div class="n-calendar__days">
      <div
        v-for="(day, idx) in days"
        :key="idx"
        :class="[
          'n-calendar__day',
          {
            'n-calendar__day--other': !day.current,
            'n-calendar__day--today': day.isToday,
            'n-calendar__day--selected': isSelected(day),
            'n-calendar__day--disabled': isDisabled(day),
            'n-calendar__day--in-range': isInRange(day),
            'n-calendar__day--range-start': isRangeStart(day),
            'n-calendar__day--range-end': isRangeEnd(day),
          },
        ]"
        @click="selectDay(day)"
      >
        <span class="n-calendar__day-text">{{ day.date }}</span>
        <!-- 事件标记点 -->
        <div v-if="hasEvents(day)" class="n-calendar__day-dots">
          <span
            v-for="(evt, eIdx) in getEvents(day).slice(0, 3)"
            :key="eIdx"
            class="n-calendar__day-dot"
            :style="{ background: evt.color || 'var(--n-color-primary, #1677ff)' }"
          />
        </div>
        <!-- 自定义内容插槽 -->
        <div v-if="$slots['cell']" class="n-calendar__day-cell">
          <slot name="cell" :date="day.full" :current="day.current" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type CalendarSize = 'sm' | 'md' | 'lg'
type CalendarMode = 'date' | 'range'
type WeekStart = 0 | 1 | 6

interface CalendarEvent {
  date: string // YYYY-MM-DD
  color?: string
  content?: string
}

const props = withDefaults(defineProps<{
  modelValue?: Date
  mode?: CalendarMode
  size?: CalendarSize
  weekStart?: WeekStart
  disabledDate?: (date: Date) => boolean
  events?: CalendarEvent[]
  rangeStart?: Date
  rangeEnd?: Date
}>(), {
  modelValue: () => new Date(),
  mode: 'date',
  size: 'md',
  weekStart: 0,
  events: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [val: Date]
  change: [val: Date]
  'update:rangeStart': [val: Date | null]
  'update:rangeEnd': [val: Date | null]
  rangeChange: [start: Date | null, end: Date | null]
}>()

const viewYear = ref(props.modelValue.getFullYear())
const viewMonth = ref(props.modelValue.getMonth())
const showYearPicker = ref(false)
const yearPage = ref(Math.floor(viewYear.value / 12))

// 内部 range 状态
const internalRangeStart = ref<Date | null>(props.rangeStart ?? null)
const internalRangeEnd = ref<Date | null>(props.rangeEnd ?? null)
const selectingRange = ref<'start' | 'end'>('start')

// 星期标签
const allWeekdays = ['日', '一', '二', '三', '四', '五', '六']
const weekdayLabels = computed(() => {
  const start = props.weekStart
  return [...allWeekdays.slice(start), ...allWeekdays.slice(0, start)]
})

// 同步外部 range 变化
watch(() => props.rangeStart, (v) => { if (v) internalRangeStart.value = v })
watch(() => props.rangeEnd, (v) => { if (v) internalRangeEnd.value = v })

const titleText = computed(() => `${viewYear.value}年${viewMonth.value + 1}月`)

// 年份选择面板
const yearPageStart = computed(() => yearPage.value * 12)
const yearPageEnd = computed(() => yearPageStart.value + 11)
const yearList = computed(() => {
  const list: number[] = []
  for (let y = yearPageStart.value; y <= yearPageEnd.value; y++) list.push(y)
  return list
})

// 日期网格
const days = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startDay = (first.getDay() - props.weekStart + 7) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const today = new Date()

  const result: { date: number; current: boolean; isToday: boolean; full: Date }[] = []

  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(viewYear.value, viewMonth.value - 1, prevDays - i)
    result.push({ date: prevDays - i, current: false, isToday: false, full: d })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear.value, viewMonth.value, i)
    result.push({
      date: i,
      current: true,
      isToday: today.getFullYear() === viewYear.value && today.getMonth() === viewMonth.value && today.getDate() === i,
      full: d,
    })
  }
  const totalRows = Math.ceil(result.length / 7)
  const totalCells = totalRows * 7
  const remain = totalCells - result.length
  for (let i = 1; i <= remain; i++) {
    const d = new Date(viewYear.value, viewMonth.value + 1, i)
    result.push({ date: i, current: false, isToday: false, full: d })
  }
  return result
})

function isSelected(day: { current: boolean; date: number; full: Date }) {
  if (props.mode === 'range') return false
  if (!day.current) return false
  const v = props.modelValue
  return v.getFullYear() === viewYear.value && v.getMonth() === viewMonth.value && v.getDate() === day.date
}

function isDisabled(day: { full: Date }) {
  return props.disabledDate ? props.disabledDate(day.full) : false
}

function isSameDay(a: Date | null, b: Date) {
  if (!a) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(day: { full: Date; current: boolean }) {
  if (props.mode !== 'range') return false
  if (!day.current) return false
  const s = internalRangeStart.value
  const e = internalRangeEnd.value
  if (!s || !e) return false
  const t = day.full.getTime()
  return t > s.getTime() && t < e.getTime()
}

function isRangeStart(day: { full: Date; current: boolean }) {
  if (props.mode !== 'range' || !day.current) return false
  return isSameDay(internalRangeStart.value, day.full)
}

function isRangeEnd(day: { full: Date; current: boolean }) {
  if (props.mode !== 'range' || !day.current) return false
  return isSameDay(internalRangeEnd.value, day.full)
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function hasEvents(day: { full: Date }) {
  if (!props.events?.length) return false
  const key = formatDate(day.full)
  return props.events.some(e => e.date === key)
}

function getEvents(day: { full: Date }) {
  const key = formatDate(day.full)
  return props.events.filter(e => e.date === key)
}

function selectDay(day: { current: boolean; date: number; full: Date }) {
  if (isDisabled(day)) return

  if (props.mode === 'range') {
    const d = day.current ? day.full : day.full
    if (selectingRange.value === 'start') {
      internalRangeStart.value = d
      internalRangeEnd.value = null
      selectingRange.value = 'end'
      emit('update:rangeStart', d)
      emit('rangeChange', d, null)
    } else {
      if (d.getTime() < (internalRangeStart.value?.getTime() ?? 0)) {
        internalRangeEnd.value = internalRangeStart.value
        internalRangeStart.value = d
      } else {
        internalRangeEnd.value = d
      }
      selectingRange.value = 'start'
      emit('update:rangeEnd', internalRangeEnd.value)
      emit('rangeChange', internalRangeStart.value, internalRangeEnd.value)
    }
    return
  }

  if (!day.current) {
    // 点击非当月日期，跳转到对应月份
    viewYear.value = day.full.getFullYear()
    viewMonth.value = day.full.getMonth()
  }

  const d = new Date(viewYear.value, viewMonth.value, day.date)
  emit('update:modelValue', d)
  emit('change', d)
}

function toggleYearPicker() {
  showYearPicker.value = !showYearPicker.value
  if (showYearPicker.value) {
    yearPage.value = Math.floor(viewYear.value / 12)
  }
}

function selectYear(y: number) {
  viewYear.value = y
  showYearPicker.value = false
}

function prevMonth() {
  if (viewMonth.value === 0) { viewYear.value--; viewMonth.value = 11 } else { viewMonth.value-- }
  showYearPicker.value = false
}
function nextMonth() {
  if (viewMonth.value === 11) { viewYear.value++; viewMonth.value = 0 } else { viewMonth.value++ }
  showYearPicker.value = false
}
function prevYear() {
  viewYear.value--
  showYearPicker.value = false
}
function nextYear() {
  viewYear.value++
  showYearPicker.value = false
}

defineExpose({ prevMonth, nextMonth, prevYear, nextYear })
</script>

<style scoped>
.n-calendar {
  --n-calendar-width: 280px;
  --n-calendar-cell: 36px;
  --n-calendar-font: 14px;
  width: var(--n-calendar-width);
  font-size: var(--n-calendar-font);
  user-select: none;
}

/* ====== Sizes ====== */
.n-calendar--sm {
  --n-calendar-width: 240px;
  --n-calendar-cell: 30px;
  --n-calendar-font: 13px;
}

.n-calendar--lg {
  --n-calendar-width: 340px;
  --n-calendar-cell: 44px;
  --n-calendar-font: 15px;
}

/* ====== Header ====== */
.n-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.n-calendar__header-nav {
  display: flex;
  gap: 2px;
}

.n-calendar__title {
  font-weight: 600;
  color: var(--n-color-text, #1f2937);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--n-radius-sm, 4px);
  transition: background 0.2s;
}

.n-calendar__title:hover {
  background: var(--n-color-fill, #f3f4f6);
}

.n-calendar__title-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.n-calendar__title-arrow--open {
  transform: rotate(180deg);
}

.n-calendar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--n-color-text-secondary, #6b7280);
  padding: 6px;
  border-radius: var(--n-radius-sm, 4px);
  transition: all 0.2s;
}

.n-calendar__btn svg {
  width: 16px;
  height: 16px;
}

.n-calendar__btn:hover {
  background: var(--n-color-fill, #f3f4f6);
  color: var(--n-color-primary, #1677ff);
}

.n-calendar__btn--sm svg {
  width: 14px;
  height: 14px;
}

/* ====== Year Panel ====== */
.n-calendar__year-panel {
  margin-bottom: 8px;
  padding: 8px;
  background: var(--n-color-fill, #f9fafb);
  border-radius: var(--n-radius-md, 8px);
}

.n-calendar__year-panel-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.n-calendar__year-range {
  font-size: var(--n-font-size-sm, 13px);
  font-weight: 500;
  color: var(--n-color-text, #1f2937);
}

.n-calendar__year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.n-calendar__year-cell {
  padding: 6px 0;
  border: none;
  background: transparent;
  border-radius: var(--n-radius-sm, 4px);
  cursor: pointer;
  font-size: var(--n-font-size-sm, 13px);
  color: var(--n-color-text, #1f2937);
  transition: all 0.2s;
  text-align: center;
}

.n-calendar__year-cell:hover {
  background: var(--n-color-fill-hover, #e5e7eb);
}

.n-calendar__year-cell--current {
  color: var(--n-color-primary, #1677ff);
  font-weight: 600;
}

.n-calendar__year-cell--selected {
  background: var(--n-color-primary, #1677ff) !important;
  color: var(--n-color-text-inverse, #fff) !important;
}

/* ====== Weekdays ====== */
.n-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.n-calendar__weekday {
  font-size: var(--n-font-size-xs, 12px);
  color: var(--n-color-text-disabled, #9ca3af);
  padding: 4px 0;
  font-weight: 500;
}

/* ====== Days ====== */
.n-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.n-calendar__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: var(--n-calendar-cell);
  cursor: pointer;
  border-radius: var(--n-radius-sm, 4px);
  transition: all 0.2s;
  position: relative;
  gap: 2px;
}

.n-calendar__day:hover:not(.n-calendar__day--disabled) {
  background: var(--n-color-fill-hover, #e5e7eb);
}

.n-calendar__day-text {
  line-height: 1;
}

.n-calendar__day--other {
  color: var(--n-color-text-disabled, #d1d5db);
}

.n-calendar__day--today .n-calendar__day-text {
  color: var(--n-color-primary, #1677ff);
  font-weight: 600;
}

.n-calendar__day--selected {
  background: var(--n-color-primary, #1677ff) !important;
}

.n-calendar__day--selected .n-calendar__day-text {
  color: var(--n-color-text-inverse, #fff) !important;
  font-weight: 600;
}

.n-calendar__day--disabled {
  color: var(--n-color-text-disabled, #d1d5db);
  cursor: not-allowed;
}

/* ====== Range ====== */
.n-calendar__day--in-range {
  background: var(--n-color-primary-light, #e6f4ff);
  border-radius: 0;
}

.n-calendar__day--range-start {
  background: var(--n-color-primary, #1677ff) !important;
  border-radius: var(--n-radius-sm, 4px) 0 0 var(--n-radius-sm, 4px);
}

.n-calendar__day--range-end {
  background: var(--n-color-primary, #1677ff) !important;
  border-radius: 0 var(--n-radius-sm, 4px) var(--n-radius-sm, 4px) 0;
}

.n-calendar__day--range-start .n-calendar__day-text,
.n-calendar__day--range-end .n-calendar__day-text {
  color: var(--n-color-text-inverse, #fff) !important;
  font-weight: 600;
}

.n-calendar__day--range-start.n-calendar__day--range-end {
  border-radius: var(--n-radius-sm, 4px);
}

/* ====== Event Dots ====== */
.n-calendar__day-dots {
  display: flex;
  gap: 2px;
  justify-content: center;
  line-height: 1;
}

.n-calendar__day-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ====== Cell Slot ====== */
.n-calendar__day-cell {
  font-size: 10px;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
