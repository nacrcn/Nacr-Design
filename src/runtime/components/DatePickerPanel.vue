<template>
  <div class="n-dp-panel">
    <div v-if="!hideHeader" class="n-dp-panel__header">
      <button class="n-dp-panel__nav" @click="$emit('prevMonth')">‹</button>
      <span class="n-dp-panel__title" @click="$emit('clickTitle')">{{ viewYear }}年 {{ viewMonth + 1 }}月</span>
      <button class="n-dp-panel__nav" @click="$emit('nextMonth')">›</button>
    </div>
    <div class="n-dp-panel__weekdays">
      <span v-for="d in weekdays" :key="d" class="n-dp-panel__weekday">{{ d }}</span>
    </div>
    <div class="n-dp-panel__days">
      <span
        v-for="(day, i) in days"
        :key="i"
        :class="[
          'n-dp-panel__day',
          {
            'n-dp-panel__day--other': day.other,
            'n-dp-panel__day--today': day.today,
            'n-dp-panel__day--selected': day.date === modelValue,
            'n-dp-panel__day--range-start': day.date === rangeStart,
            'n-dp-panel__day--range-end': day.date === rangeEnd,
            'n-dp-panel__day--in-range': isInRange(day.date),
            'n-dp-panel__day--disabled': day.disabled,
          },
        ]"
        @click="$emit('selectDay', day.date)"
        @mouseenter="$emit('hoverDay', day.date)"
      >{{ day.num }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  viewYear: number
  viewMonth: number
  modelValue?: string
  rangeEnd?: string
  rangeStart?: string
  hoveringDate?: string | null
  selectingRange?: boolean
  disabledDate?: (date: string) => boolean
  hideHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  rangeEnd: undefined,
  rangeStart: undefined,
  hoveringDate: null,
  selectingRange: false,
  disabledDate: undefined,
  hideHeader: false,
})

defineEmits<{
  prevMonth: []
  nextMonth: []
  selectDay: [date: string]
  hoverDay: [date: string]
  clickTitle: []
}>()

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const now = new Date()

interface DayInfo {
  num: number
  date: string
  other: boolean
  today: boolean
  disabled: boolean
}

const days = computed<DayInfo[]>(() => {
  const result: DayInfo[] = []
  const y = props.viewYear
  const m = props.viewMonth
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const prevDays = new Date(y, m, 0).getDate()
  const todayStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate())

  // Previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const nm = m === 0 ? 11 : m - 1
    const ny = m === 0 ? y - 1 : y
    const d = prevDays - i
    const date = toDateString(ny, nm, d)
    result.push({ num: d, date, other: true, today: date === todayStr, disabled: !!props.disabledDate?.(date) })
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = toDateString(y, m, i)
    result.push({ num: i, date, other: false, today: date === todayStr, disabled: !!props.disabledDate?.(date) })
  }
  // Next month
  const remaining = 42 - result.length
  for (let i = 1; i <= remaining; i++) {
    const nm = m === 11 ? 0 : m + 1
    const ny = m === 11 ? y + 1 : y
    const date = toDateString(ny, nm, i)
    result.push({ num: i, date, other: true, today: date === todayStr, disabled: !!props.disabledDate?.(date) })
  }
  return result
})

function toDateString(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function isInRange(date: string): boolean {
  if (!props.rangeStart || !props.rangeEnd) return false
  return date > props.rangeStart && date < props.rangeEnd
}
</script>

<style scoped>
.n-dp-panel {
  min-width: 252px;
}

.n-dp-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.n-dp-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-color-text);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.15s;
}

.n-dp-panel__title:hover {
  background: var(--n-color-fill-hover);
}

.n-dp-panel__nav {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: var(--n-color-text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}

.n-dp-panel__nav:hover {
  background: var(--n-color-fill-hover);
  color: var(--n-color-primary);
}

.n-dp-panel__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 4px;
}

.n-dp-panel__weekday {
  font-size: 12px;
  color: var(--n-color-text-disabled);
  padding: 4px 0;
}

.n-dp-panel__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.n-dp-panel__day {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border-radius: 50%;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: var(--n-color-text-secondary);
  position: relative;
}

.n-dp-panel__day:hover:not(.n-dp-panel__day--disabled):not(.n-dp-panel__day--selected):not(.n-dp-panel__day--in-range) {
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
  color: var(--n-color-primary);
}

.n-dp-panel__day--other {
  color: var(--n-color-border-hover);
}

.n-dp-panel__day--today {
  border: 1px solid var(--n-color-primary);
  color: var(--n-color-primary);
  font-weight: 600;
}

.n-dp-panel__day--selected {
  background: var(--n-color-primary) !important;
  color: #fff !important;
}

.n-dp-panel__day--range-start {
  background: var(--n-color-primary) !important;
  color: #fff !important;
  border-radius: 50% 0 0 50%;
}

.n-dp-panel__day--range-end {
  background: var(--n-color-primary) !important;
  color: #fff !important;
  border-radius: 0 50% 50% 0;
}

.n-dp-panel__day--range-start.n-dp-panel__day--range-end {
  border-radius: 50%;
}

.n-dp-panel__day--in-range {
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.12)) !important;
  color: var(--n-color-primary) !important;
  border-radius: 0;
}

.n-dp-panel__day--range-start.n-dp-panel__day--other,
.n-dp-panel__day--range-end.n-dp-panel__day--other,
.n-dp-panel__day--in-range.n-dp-panel__day--other {
  background: var(--n-color-primary-light, rgba(59, 130, 246, 0.06)) !important;
  color: var(--n-color-primary) !important;
  opacity: 0.7;
}

.n-dp-panel__day--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.n-dp-panel__day--disabled:hover {
  background: transparent;
  color: var(--n-color-text-secondary);
}
</style>
