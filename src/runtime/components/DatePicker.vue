<template>
    <div ref="pickerRef" :class="[
        'n-date-picker',
        `n-date-picker--${size}`,
        `n-date-picker--${type}`,
        {
            'n-date-picker--disabled': disabled,
            'n-date-picker--open': open,
            'n-date-picker--has-value': hasValue,
        },
    ]">
        <!-- Trigger: date / datetime / month / year -->
        <div v-if="type !== 'daterange' && type !== 'datetimerange'" class="n-date-picker__trigger" @click="toggleOpen">
            <NIcon name="rili" :size="16" class="n-date-picker__icon" />
            <span v-if="displayValue" class="n-date-picker__value">{{ displayValue }}</span>
            <span v-else class="n-date-picker__placeholder">{{ placeholder }}</span>
            <span v-if="clearable && hasValue" class="n-date-picker__clear" @click.stop="handleClear">×</span>
        </div>

        <!-- Trigger: daterange / datetimerange -->
        <div v-else class="n-date-picker__trigger n-date-picker__trigger--range" @click="toggleOpen">
            <NIcon name="rili" :size="16" class="n-date-picker__icon" />
            <span :class="['n-date-picker__range-cell', { 'n-date-picker__range-cell--active': rangeStart }]">
                {{ rangeStartDisplay || startPlaceholder }}
            </span>
            <span class="n-date-picker__range-sep">至</span>
            <span :class="['n-date-picker__range-cell', { 'n-date-picker__range-cell--active': rangeEnd }]">
                {{ rangeEndDisplay || endPlaceholder }}
            </span>
            <span v-if="clearable && hasValue" class="n-date-picker__clear" @click.stop="handleClear">×</span>
        </div>

        <transition name="n-date-picker__fade">
            <div v-show="open" class="n-date-picker__panel"
                :class="{ 'n-date-picker__panel--range': type === 'daterange' || type === 'datetimerange' }">
                <div class="n-date-picker__main-row">
                <!-- Shortcuts -->
                <div v-if="shortcuts?.length" class="n-date-picker__shortcuts">
                    <button v-for="(s, i) in shortcuts" :key="i" class="n-date-picker__shortcut"
                        @click="applyShortcut(s)">{{ s.label }}</button>
                </div>

                <div class="n-date-picker__body">
                    <!-- ====== Date panel ====== -->
                    <template v-if="panelView === 'date'">
                        <DatePickerPanel :view-year="viewYear" :view-month="viewMonth"
                            :model-value="(type === 'daterange' || type === 'datetimerange') ? rangeHoverStart : (type === 'datetime' && rangeStart ? rangeStart : (modelValue as string))?.slice(0, 10)"
                            :range-start="(type === 'daterange' || type === 'datetimerange') ? rangeHoverStart : undefined"
                            :range-end="(type === 'daterange' || type === 'datetimerange') ? rangeHoverEnd : undefined"
                            :hovering-date="hoveringDate" :selecting-range="selectingRange"
                            :disabled-date="disabledDate" @prev-month="prevMonth(0)"
                            @next-month="nextMonth(0)" @select-day="onSelectDay" @hover-day="onHoverDay"
                            @click-title="panelView = 'month'" />
                        <DatePickerPanel v-if="type === 'daterange' || type === 'datetimerange'"
                            :view-year="viewYear2" :view-month="viewMonth2"
                            :range-start="rangeHoverStart"
                            :range-end="rangeHoverEnd"
                            :disabled-date="disabledDate" :hide-header="true" @prev-month="prevMonth(1)"
                            @next-month="nextMonth(1)" @select-day="onSelectDay" @hover-day="onHoverDay" />
                    </template>

                    <!-- ====== Month panel ====== -->
                    <template v-if="panelView === 'month'">
                        <div class="n-date-picker__header">
                            <button class="n-date-picker__nav" @click="viewYear--">‹</button>
                            <span class="n-date-picker__title" @click="panelView = 'year'">{{ viewYear }}年</span>
                            <button class="n-date-picker__nav" @click="viewYear++">›</button>
                        </div>
                        <div class="n-date-picker__month-grid">
                            <span v-for="(m, idx) in monthNames" :key="idx" :class="[
                                'n-date-picker__month-cell',
                                {
                                    'n-date-picker__month-cell--current': isCurrentMonth(idx),
                                    'n-date-picker__month-cell--selected': isSelectedMonth(idx),
                                    'n-date-picker__month-cell--disabled': isDisabledMonth(idx),
                                },
                            ]" @click="onSelectMonth(idx)">{{ m }}</span>
                        </div>
                    </template>

                    <!-- ====== Year panel ====== -->
                    <template v-if="panelView === 'year'">
                        <div class="n-date-picker__header">
                            <button class="n-date-picker__nav" @click="yearPage--">‹</button>
                            <span class="n-date-picker__title">{{ yearPageStart }} - {{ yearPageEnd }}</span>
                            <button class="n-date-picker__nav" @click="yearPage++">›</button>
                        </div>
                        <div class="n-date-picker__year-grid">
                            <span v-for="y in yearPageYears" :key="y" :class="[
                                'n-date-picker__year-cell',
                                {
                                    'n-date-picker__year-cell--current': y === now.getFullYear(),
                                    'n-date-picker__year-cell--selected': y === selectedYear,
                                    'n-date-picker__year-cell--disabled': isDisabledYear(y),
                                },
                            ]" @click="onSelectYear(y)">{{ y }}</span>
                        </div>
                    </template>
                </div>
                </div>

                    <!-- ====== Inline time (datetime / datetimerange) ====== -->
                    <template v-if="isDatetimeType && panelView === 'date'">
                        <!-- Single datetime -->
                        <div v-if="!isRangeType" class="n-date-picker__datetime-section">
                            <div class="n-date-picker__time-columns">
                                <div class="n-date-picker__time-column">
                                    <div class="n-date-picker__time-column-title">时</div>
                                    <div class="n-date-picker__time-scroll-area">
                                        <div ref="startHourRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'hour'); onScrollEnd('hour')">
                                            <div class="n-date-picker__time-pad"></div>
                                            <div v-for="h in 24" :key="h - 1"
                                                :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startHour === h - 1 }]"
                                                @click="selectTime('hour', h - 1)">{{ String(h - 1).padStart(2, '0') }}</div>
                                            <div class="n-date-picker__time-pad"></div>
                                        </div>
                                        <div class="n-date-picker__time-highlight"></div>
                                    </div>
                                </div>
                                <div class="n-date-picker__time-column">
                                    <div class="n-date-picker__time-column-title">分</div>
                                    <div class="n-date-picker__time-scroll-area">
                                        <div ref="startMinuteRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'minute'); onScrollEnd('minute')">
                                            <div class="n-date-picker__time-pad"></div>
                                            <div v-for="m in 60" :key="m - 1"
                                                :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startMinute === m - 1 }]"
                                                @click="selectTime('minute', m - 1)">{{ String(m - 1).padStart(2, '0') }}</div>
                                            <div class="n-date-picker__time-pad"></div>
                                        </div>
                                        <div class="n-date-picker__time-highlight"></div>
                                    </div>
                                </div>
                                <div class="n-date-picker__time-column">
                                    <div class="n-date-picker__time-column-title">秒</div>
                                    <div class="n-date-picker__time-scroll-area">
                                        <div ref="startSecondRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'second'); onScrollEnd('second')">
                                            <div class="n-date-picker__time-pad"></div>
                                            <div v-for="s in 60" :key="s - 1"
                                                :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startSecond === s - 1 }]"
                                                @click="selectTime('second', s - 1)">{{ String(s - 1).padStart(2, '0') }}</div>
                                            <div class="n-date-picker__time-pad"></div>
                                        </div>
                                        <div class="n-date-picker__time-highlight"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="n-date-picker__time-footer">
                                <button class="n-date-picker__time-btn" @click="handleClear">清除</button>
                                <button class="n-date-picker__time-btn n-date-picker__time-btn--primary" @click="onTimeConfirm">确定</button>
                            </div>
                        </div>

                        <!-- Datetimerange: two time pickers side by side -->
                        <div v-else class="n-date-picker__datetime-section n-date-picker__datetime-section--range">
                            <div class="n-date-picker__time-block" :class="{ 'n-date-picker__time-block--active': !selectingTimeForEnd }" @click="selectingTimeForEnd = false">
                                <div class="n-date-picker__time-block-label">开始时间</div>
                                <div class="n-date-picker__time-columns">
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">时</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="startHourRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'hour', false); onScrollEnd('hour', false)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="h in 24" :key="h - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startHour === h - 1 }]"
                                                    @click="selectTime('hour', h - 1, false)">{{ String(h - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">分</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="startMinuteRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'minute', false); onScrollEnd('minute', false)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="m in 60" :key="m - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startMinute === m - 1 }]"
                                                    @click="selectTime('minute', m - 1, false)">{{ String(m - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">秒</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="startSecondRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'second', false); onScrollEnd('second', false)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="s in 60" :key="s - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': startSecond === s - 1 }]"
                                                    @click="selectTime('second', s - 1, false)">{{ String(s - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="n-date-picker__time-block" :class="{ 'n-date-picker__time-block--active': selectingTimeForEnd }" @click="selectingTimeForEnd = true">
                                <div class="n-date-picker__time-block-label">结束时间</div>
                                <div class="n-date-picker__time-columns">
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">时</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="endHourRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'hour', true); onScrollEnd('hour', true)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="h in 24" :key="h - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': endHour === h - 1 }]"
                                                    @click="selectTime('hour', h - 1, true)">{{ String(h - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">分</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="endMinuteRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'minute', true); onScrollEnd('minute', true)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="m in 60" :key="m - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': endMinute === m - 1 }]"
                                                    @click="selectTime('minute', m - 1, true)">{{ String(m - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                    <div class="n-date-picker__time-column">
                                        <div class="n-date-picker__time-column-title">秒</div>
                                        <div class="n-date-picker__time-scroll-area">
                                            <div ref="endSecondRef" class="n-date-picker__time-scroll" @scroll="onScroll($event, 'second', true); onScrollEnd('second', true)">
                                                <div class="n-date-picker__time-pad"></div>
                                                <div v-for="s in 60" :key="s - 1"
                                                    :class="['n-date-picker__time-cell', { 'n-date-picker__time-cell--active': endSecond === s - 1 }]"
                                                    @click="selectTime('second', s - 1, true)">{{ String(s - 1).padStart(2, '0') }}</div>
                                                <div class="n-date-picker__time-pad"></div>
                                            </div>
                                            <div class="n-date-picker__time-highlight"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="n-date-picker__time-footer n-date-picker__time-footer--range">
                                <button class="n-date-picker__time-btn" @click="handleClear">清除</button>
                                <button class="n-date-picker__time-btn n-date-picker__time-btn--primary" @click="onTimeConfirm">确定</button>
                            </div>
                        </div>
                    </template>
                </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import DatePickerPanel from './DatePickerPanel.vue'
import NIcon from './Icon.vue'

type DatePickerType = 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'

interface Shortcut {
    label: string
    value: string | [string, string]
}

interface Props {
    modelValue?: string | [string, string]
    type?: DatePickerType
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'sm' | 'md' | 'lg'
    format?: string
    disabledDate?: (date: string) => boolean
    shortcuts?: Shortcut[]
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    type: 'date',
    placeholder: '请选择日期',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    disabled: false,
    clearable: false,
    size: 'md',
    format: undefined,
    shortcuts: undefined,
})

const emit = defineEmits<{
    'update:modelValue': [val: string | [string, string] | undefined]
    change: [val: string | [string, string] | undefined]
}>()

const pickerRef = ref<HTMLElement>()
const open = ref(false)
const panelView = ref<'date' | 'month' | 'year'>('date')
const hoveringDate = ref<string | null>(null)
const selectingRange = ref(false)
const rangeStart = ref<string | null>(null)
const rangeEnd = ref<string | null>(null)

// Time state — start
const startHour = ref(0)
const startMinute = ref(0)
const startSecond = ref(0)
// Time state — end (only used for datetimerange)
const endHour = ref(0)
const endMinute = ref(0)
const endSecond = ref(0)
const selectingTimeForEnd = ref(false) // for datetimerange: false=start, true=end
// Scroll refs — start
const startHourRef = ref<HTMLElement>()
const startMinuteRef = ref<HTMLElement>()
const startSecondRef = ref<HTMLElement>()
// Scroll refs — end
const endHourRef = ref<HTMLElement>()
const endMinuteRef = ref<HTMLElement>()
const endSecondRef = ref<HTMLElement>()

const CELL_HEIGHT = 28 // px per time cell

const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth())
const viewYear2 = ref(now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear())
const viewMonth2 = ref(now.getMonth() === 11 ? 0 : now.getMonth() + 1)
const yearPage = ref(Math.floor(now.getFullYear() / 10))

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// Sync viewYear with initial modelValue
watch(() => props.modelValue, (val) => {
    if (val && !open.value) {
        if (Array.isArray(val)) {
            const d = val[0] ? parseDate(val[0]) : null
            if (d) { viewYear.value = d.getFullYear(); viewMonth.value = d.getMonth() }
        } else {
            const d = parseDate(val)
            if (d) { viewYear.value = d.getFullYear(); viewMonth.value = d.getMonth() }
        }
    }
}, { immediate: true })

// When panel opens, reset view
watch(open, (v) => {
    if (v) {
        if (props.type === 'month') panelView.value = 'month'
        else if (props.type === 'year') panelView.value = 'year'
        else panelView.value = 'date'

        // Init range state for range types
        if ((props.type === 'daterange' || props.type === 'datetimerange') && Array.isArray(props.modelValue)) {
            rangeStart.value = props.modelValue[0] || null
            rangeEnd.value = props.modelValue[1] || null
            selectingRange.value = false
        }
        // Init rangeStart from existing value for datetime (single) so panel shows selected date
        if (props.type === 'datetime') {
            rangeStart.value = (!Array.isArray(props.modelValue) && props.modelValue) ? props.modelValue.slice(0, 10) : null
        }
        selectingTimeForEnd.value = false

        // Init time from modelValue for datetime types
        if (props.type === 'datetime' || props.type === 'datetimerange') {
            if (props.type === 'datetimerange') {
                initTimeFromValue(false)
                initTimeFromValue(true)
            } else {
                initTimeFromValue(false)
            }
        }
    }
})

// ========== Computed ==========

const isDatetimeType = computed(() => props.type === 'datetime' || props.type === 'datetimerange')
const isRangeType = computed(() => props.type === 'daterange' || props.type === 'datetimerange')

// ========== Time scroll helpers ==========

function scrollToActive(isEnd = false) {
    if (isEnd) {
        scrollToValue(endHourRef, endHour.value)
        scrollToValue(endMinuteRef, endMinute.value)
        scrollToValue(endSecondRef, endSecond.value)
    } else {
        scrollToValue(startHourRef, startHour.value)
        scrollToValue(startMinuteRef, startMinute.value)
        scrollToValue(startSecondRef, startSecond.value)
    }
}

function scrollToValue(elRef: typeof startHourRef, value: number) {
    const el = elRef.value
    if (!el) return
    el.scrollTop = value * CELL_HEIGHT
}

function selectTime(type: 'hour' | 'minute' | 'second', value: number, isEnd = false) {
    const target = isEnd ? 'end' : 'start'
    if (type === 'hour') { if (isEnd) endHour.value = value; else startHour.value = value }
    else if (type === 'minute') { if (isEnd) endMinute.value = value; else startMinute.value = value }
    else { if (isEnd) endSecond.value = value; else startSecond.value = value }
    nextTick(() => {
        const refMap: Record<string, Record<string, typeof startHourRef>> = {
            start: { hour: startHourRef, minute: startMinuteRef, second: startSecondRef },
            end: { hour: endHourRef, minute: endMinuteRef, second: endSecondRef },
        }
        const el = refMap[target][type].value
        if (el) el.scrollTop = value * CELL_HEIGHT
    })
}

function onScroll(e: Event, type: 'hour' | 'minute' | 'second', isEnd = false) {
    const el = e.target as HTMLElement
    const idx = Math.round(el.scrollTop / CELL_HEIGHT)
    const max = type === 'hour' ? 23 : 59
    const clamped = Math.min(Math.max(idx, 0), max)
    if (type === 'hour') { if (isEnd && endHour.value !== clamped) endHour.value = clamped; else if (!isEnd && startHour.value !== clamped) startHour.value = clamped }
    else if (type === 'minute') { if (isEnd && endMinute.value !== clamped) endMinute.value = clamped; else if (!isEnd && startMinute.value !== clamped) startMinute.value = clamped }
    else { if (isEnd && endSecond.value !== clamped) endSecond.value = clamped; else if (!isEnd && startSecond.value !== clamped) startSecond.value = clamped }
}

let scrollTimers: Record<string, ReturnType<typeof setTimeout>> = {}
function onScrollEnd(type: 'hour' | 'minute' | 'second', isEnd = false) {
    const key = `${type}-${isEnd ? 'end' : 'start'}`
    clearTimeout(scrollTimers[key])
    scrollTimers[key] = setTimeout(() => {
        const refMap: Record<string, Record<string, typeof startHourRef>> = {
            start: { hour: startHourRef, minute: startMinuteRef, second: startSecondRef },
            end: { hour: endHourRef, minute: endMinuteRef, second: endSecondRef },
        }
        const valMap: Record<string, Record<string, typeof startHour>> = {
            start: { hour: startHour, minute: startMinute, second: startSecond },
            end: { hour: endHour, minute: endMinute, second: endSecond },
        }
        const target = isEnd ? 'end' : 'start'
        const el = refMap[target][type].value
        if (el) el.scrollTop = valMap[target][type].value * CELL_HEIGHT
    }, 80)
}

const hasValue = computed(() => {
    if (isRangeType.value) {
        return Array.isArray(props.modelValue) && !!props.modelValue[0]
    }
    return !!props.modelValue && !Array.isArray(props.modelValue)
})

function formatDateDefault(dateStr: string): string {
    const d = parseDate(dateStr)
    if (!d) return dateStr
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDatetime(dateStr: string): string {
    const d = parseDate(dateStr)
    if (!d) return dateStr
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function formatMonth(dateStr: string): string {
    const d = parseDate(dateStr)
    if (!d) return dateStr
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月`
}

function formatYear(dateStr: string): string {
    const d = parseDate(dateStr)
    if (!d) return dateStr
    return `${d.getFullYear()}年`
}

const fmtFn = computed(() => {
    if (props.format) {
        return (s: string) => {
            const d = parseDate(s)
            if (!d) return s
            return props.format!
                .replace('YYYY', String(d.getFullYear()))
                .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
                .replace('DD', String(d.getDate()).padStart(2, '0'))
                .replace('HH', String(d.getHours()).padStart(2, '0'))
                .replace('mm', String(d.getMinutes()).padStart(2, '0'))
                .replace('ss', String(d.getSeconds()).padStart(2, '0'))
        }
    }
    if (props.type === 'datetime' || props.type === 'datetimerange') return formatDatetime
    if (props.type === 'month') return formatMonth
    if (props.type === 'year') return formatYear
    return formatDateDefault
})

const displayValue = computed(() => {
    if (!hasValue.value || Array.isArray(props.modelValue)) return ''
    return fmtFn.value(props.modelValue as string)
})

const rangeStartDisplay = computed(() => {
    if (!Array.isArray(props.modelValue) || !props.modelValue[0]) return ''
    if (props.format) return fmtFn.value(props.modelValue[0])
    if (props.type === 'datetimerange') return formatDatetime(props.modelValue[0])
    return props.modelValue[0]
})

const rangeEndDisplay = computed(() => {
    if (!Array.isArray(props.modelValue) || !props.modelValue[1]) return ''
    if (props.format) return fmtFn.value(props.modelValue[1])
    if (props.type === 'datetimerange') return formatDatetime(props.modelValue[1])
    return props.modelValue[1]
})

// Range hover values (for visual range selection) — only date part
const rangeHoverStart = computed(() => {
    const s = rangeStart.value
    return s ? s.slice(0, 10) : undefined
})
const rangeHoverEnd = computed(() => {
  if (selectingRange.value && hoveringDate.value && rangeStart.value) {
    const start = rangeStart.value.slice(0, 10)
    const hover = hoveringDate.value.slice(0, 10)
    return hover < start ? start : hover
  }
  const e = rangeEnd.value
  return e ? e.slice(0, 10) : undefined
})

// Year page
const yearPageStart = computed(() => yearPage.value * 10)
const yearPageEnd = computed(() => yearPage.value * 10 + 9)
const yearPageYears = computed(() => {
    const arr: number[] = []
    for (let i = yearPageStart.value; i <= yearPageEnd.value; i++) arr.push(i)
    return arr
})

const selectedYear = computed(() => {
    if (!hasValue.value || Array.isArray(props.modelValue)) return -1
    const d = parseDate(props.modelValue as string)
    return d ? d.getFullYear() : -1
})

// ========== Helpers ==========

function parseDate(s: string): Date | null {
    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d
}

function toDateString(y: number, m: number, d: number): string {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function isCurrentMonth(idx: number): boolean {
    return viewYear.value === now.getFullYear() && idx === now.getMonth()
}

function isSelectedMonth(idx: number): boolean {
    if (props.type === 'month' && hasValue.value && !Array.isArray(props.modelValue)) {
        const d = parseDate(props.modelValue as string)
        return d ? d.getFullYear() === viewYear.value && d.getMonth() === idx : false
    }
    return false
}

function isDisabledMonth(idx: number): boolean {
    if (!props.disabledDate) return false
    const date = toDateString(viewYear.value, idx, 1)
    return props.disabledDate(date)
}

function isDisabledYear(y: number): boolean {
    if (!props.disabledDate) return false
    const date = `${y}-01-01`
    return props.disabledDate(date)
}

// ========== Navigation ==========

function prevMonth(panel: number) {
    if (panel === 0) {
        if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
        else viewMonth.value--
    } else {
        if (viewMonth2.value === 0) { viewMonth2.value = 11; viewYear2.value-- }
        else viewMonth2.value--
    }
    syncRangePanels()
}

function nextMonth(panel: number) {
    if (panel === 0) {
        if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
        else viewMonth.value++
    } else {
        if (viewMonth2.value === 11) { viewMonth2.value = 0; viewYear2.value++ }
        else viewMonth2.value++
    }
    syncRangePanels()
}

function syncRangePanels() {
    if (!isRangeType.value) return
    viewYear2.value = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value
    viewMonth2.value = viewMonth.value === 11 ? 0 : viewMonth.value + 1
}

// ========== Selection ==========

function toggleOpen() {
    if (props.disabled) return
    open.value = !open.value
}

function handleClear() {
    emit('update:modelValue', undefined)
    emit('change', undefined)
    rangeStart.value = null
    rangeEnd.value = null
    selectingRange.value = false
}

function onSelectDay(date: string) {
    if (isRangeType.value) {
        if (!selectingRange.value) {
            rangeStart.value = date
            rangeEnd.value = null
            selectingRange.value = true
        } else {
            if (date < rangeStart.value!) {
                rangeEnd.value = rangeStart.value
                rangeStart.value = date
            } else {
                rangeEnd.value = date
            }
            selectingRange.value = false

            if (isDatetimeType.value) {
                switchingTimeForEnd()
            } else {
                const val: [string, string] = [rangeStart.value!, rangeEnd.value!]
                emit('update:modelValue', val)
                emit('change', val)
                open.value = false
            }
        }
    } else {
        if (isDatetimeType.value) {
            rangeStart.value = date
            // Don't close — let user confirm time
        } else {
            emit('update:modelValue', date)
            emit('change', date)
            open.value = false
        }
    }
}

function onHoverDay(date: string) {
    if (isRangeType.value && selectingRange.value) {
        hoveringDate.value = date
    }
}

/** datetimerange: after range selected, don't reinitialize time — preserve user selections */
function switchingTimeForEnd() {
    selectingTimeForEnd.value = false
}

/** datetime: confirm time and emit final value */
function onTimeConfirm() {
    const sh = String(startHour.value).padStart(2, '0')
    const sm = String(startMinute.value).padStart(2, '0')
    const ss = String(startSecond.value).padStart(2, '0')

    if (props.type === 'datetimerange') {
        // Always emit with both start and end time — slice(0,10) ensures date-only
        const startVal = `${rangeStart.value!.slice(0, 10)} ${sh}:${sm}:${ss}`
        const eh = String(endHour.value).padStart(2, '0')
        const em = String(endMinute.value).padStart(2, '0')
        const es = String(endSecond.value).padStart(2, '0')
        const endVal = `${rangeEnd.value!.slice(0, 10)} ${eh}:${em}:${es}`
        const val: [string, string] = [startVal, endVal]
        emit('update:modelValue', val)
        emit('change', val)
        open.value = false
        return
    }

    // datetime (single): use rangeStart date or extract date from existing modelValue
    let datePart = rangeStart.value?.slice(0, 10)
    if (!datePart && !Array.isArray(props.modelValue) && props.modelValue) {
        datePart = props.modelValue.slice(0, 10)
    }
    if (!datePart) return
    const val = `${datePart} ${sh}:${sm}:${ss}`
    emit('update:modelValue', val)
    emit('change', val)
    open.value = false
}

/** Initialize hour/minute/second from existing modelValue or default to current time */
function initTimeFromValue(isEnd = false) {
    if (isEnd && isRangeType.value && Array.isArray(props.modelValue)) {
        const src = props.modelValue[1]
        if (src) {
            const d = parseDate(src)
            if (d) { endHour.value = d.getHours(); endMinute.value = d.getMinutes(); endSecond.value = d.getSeconds(); nextTick(() => scrollToActive(true)); return }
        }
    } else if (!isEnd && isRangeType.value && Array.isArray(props.modelValue)) {
        const src = props.modelValue[0]
        if (src) {
            const d = parseDate(src)
            if (d) { startHour.value = d.getHours(); startMinute.value = d.getMinutes(); startSecond.value = d.getSeconds(); nextTick(() => scrollToActive(false)); return }
        }
    } else if (!isRangeType.value && !Array.isArray(props.modelValue) && props.modelValue) {
        const d = parseDate(props.modelValue)
        if (d) { startHour.value = d.getHours(); startMinute.value = d.getMinutes(); startSecond.value = d.getSeconds(); nextTick(() => scrollToActive(false)); return }
    }
    // Default to current time
    const n = new Date()
    if (isEnd) { endHour.value = n.getHours(); endMinute.value = n.getMinutes(); endSecond.value = n.getSeconds(); nextTick(() => scrollToActive(true)) }
    else { startHour.value = n.getHours(); startMinute.value = n.getMinutes(); startSecond.value = n.getSeconds(); nextTick(() => scrollToActive(false)) }
}

function onSelectMonth(idx: number) {
    if (isDisabledMonth(idx)) return
    if (props.type === 'month') {
        const date = toDateString(viewYear.value, idx, 1)
        emit('update:modelValue', date)
        emit('change', date)
        open.value = false
    } else {
        viewMonth.value = idx
        panelView.value = 'date'
    }
}

function onSelectYear(y: number) {
    if (isDisabledYear(y)) return
    if (props.type === 'year') {
        const date = `${y}-01-01`
        emit('update:modelValue', date)
        emit('change', date)
        open.value = false
    } else {
        viewYear.value = y
        panelView.value = 'month'
    }
}

function applyShortcut(s: Shortcut) {
    emit('update:modelValue', s.value)
    emit('change', s.value)
    if (Array.isArray(s.value)) {
        rangeStart.value = s.value[0]
        rangeEnd.value = s.value[1]
        selectingRange.value = false
    }
    open.value = false
}

// ========== Click outside ==========

function onClickOutside(e: Event) {
    if (pickerRef.value && !pickerRef.value.contains(e.target as HTMLElement)) {
        open.value = false
        selectingRange.value = false
        hoveringDate.value = null
        // Reset temp selection for datetime so stale rangeStart doesn't persist
        if (props.type === 'datetime') rangeStart.value = null
    }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>


<style scoped>
.n-date-picker {
    position: relative;
    display: inline-block;
    width: 100%;
}

.n-date-picker--date,
.n-date-picker--datetime,
.n-date-picker--month,
.n-date-picker--year {
    max-width: 280px;
}

.n-date-picker--daterange,
.n-date-picker--datetimerange {
    max-width: 560px;
}

.n-date-picker--datetime .n-date-picker__trigger,
.n-date-picker--datetimerange .n-date-picker__trigger {
    min-width: 200px;
}

/* Trigger common */
.n-date-picker__trigger {
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

.n-date-picker--sm .n-date-picker__trigger {
    height: 28px;
    font-size: 12px;
    padding: 0 8px;
}

.n-date-picker--md .n-date-picker__trigger {
    height: 36px;
    font-size: 14px;
    padding: 0 12px;
}

.n-date-picker--lg .n-date-picker__trigger {
    height: 44px;
    font-size: 16px;
    padding: 0 16px;
}

.n-date-picker__trigger:hover {
    border-color: var(--n-color-primary);
}

.n-date-picker--open .n-date-picker__trigger {
    border-color: var(--n-color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.n-date-picker--disabled .n-date-picker__trigger {
    opacity: 0.5;
    cursor: not-allowed;
}

.n-date-picker__icon {
    color: var(--n-color-text-disabled);
    flex-shrink: 0;
}

.n-date-picker__value {
    flex: 1;
    overflow: hidden;
    color: var(--n-color-text);
}

.n-date-picker__placeholder {
    color: var(--n-color-text-disabled);
    flex: 1;
}

.n-date-picker__clear {
    color: var(--n-color-text-disabled);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
}

.n-date-picker__clear:hover {
    color: var(--n-color-text-secondary);
}

/* Range trigger */
.n-date-picker__trigger--range {
    gap: 4px;
}

.n-date-picker__range-cell {
    flex: 1;
    text-align: center;
    font-size: inherit;
    color: var(--n-color-text-disabled);
    overflow: hidden;
    white-space: nowrap;
    transition: color 0.2s;
}

.n-date-picker__range-cell--active {
    color: var(--n-color-text);
}

.n-date-picker__range-sep {
    color: var(--n-color-text-disabled);
    flex-shrink: 0;
    font-size: 12px;
}

/* Panel */
.n-date-picker__panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: var(--n-color-bg);
    border: 1px solid var(--n-color-border);
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    padding: 12px;
    z-index: 1050;
    display: flex;
    flex-direction: column;
}

.n-date-picker__panel--range {
    left: 0;
}

.n-date-picker__main-row {
    display: flex;
}

.n-date-picker__shortcuts {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-right: 12px;
    margin-right: 12px;
    border-right: 1px solid var(--n-color-border);
}

.n-date-picker__shortcut {
    background: none;
    border: none;
    padding: 6px 12px;
    font-size: 13px;
    color: var(--n-color-text-secondary);
    cursor: pointer;
    border-radius: 4px;
    white-space: nowrap;
    transition: all 0.15s;
    text-align: left;
}

.n-date-picker__shortcut:hover {
    color: var(--n-color-primary);
    background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
}

.n-date-picker__body {
    display: flex;
    gap: 16px;
}

/* Header */
.n-date-picker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.n-date-picker__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--n-color-text);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: background 0.15s;
}

.n-date-picker__title:hover {
    background: var(--n-color-fill-hover);
}

.n-date-picker__nav {
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

.n-date-picker__nav:hover {
    background: var(--n-color-fill-hover);
    color: var(--n-color-primary);
}

/* Month grid */
.n-date-picker__month-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 4px 0;
}

.n-date-picker__month-cell,
.n-date-picker__year-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    color: var(--n-color-text-secondary);
    transition: all 0.15s;
}

.n-date-picker__month-cell:hover,
.n-date-picker__year-cell:hover {
    background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
    color: var(--n-color-primary);
}

.n-date-picker__month-cell--current,
.n-date-picker__year-cell--current {
    color: var(--n-color-primary);
    font-weight: 600;
}

.n-date-picker__month-cell--selected,
.n-date-picker__year-cell--selected {
    background: var(--n-color-primary);
    color: #fff;
}

.n-date-picker__month-cell--selected:hover,
.n-date-picker__year-cell--selected:hover {
    background: var(--n-color-primary);
    color: #fff;
}

.n-date-picker__month-cell--disabled,
.n-date-picker__year-cell--disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.n-date-picker__month-cell--disabled:hover,
.n-date-picker__year-cell--disabled:hover {
    background: transparent;
    color: var(--n-color-text-secondary);
}

/* Year grid */
.n-date-picker__year-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 4px 0;
}

/* ===== Inline datetime section (scroll wheel) ===== */
.n-date-picker__datetime-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid var(--n-color-border);
}

.n-date-picker__datetime-section--range {
    gap: 10px;
    flex-direction: row;
    flex-wrap: wrap;
}

.n-date-picker__datetime-section--range .n-date-picker__time-block {
    min-width: 0;
}

.n-date-picker__time-columns {
    display: flex;
    gap: 0;
    height: 196px; /* 7 visible cells × 28px */
    position: relative;
    border: 1px solid var(--n-color-border);
    border-radius: 6px;
    overflow: hidden;
}

.n-date-picker__time-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
}

.n-date-picker__time-column + .n-date-picker__time-column {
    border-left: 1px solid var(--n-color-border);
}

.n-date-picker__time-column-title {
    text-align: center;
    font-size: 12px;
    color: var(--n-color-text-disabled);
    padding: 4px 0;
    background: var(--n-color-fill-hover, rgba(0,0,0,0.02));
    border-bottom: 1px solid var(--n-color-border);
    flex-shrink: 0;
}

.n-date-picker__time-scroll-area {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.n-date-picker__time-scroll {
    height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

.n-date-picker__time-scroll::-webkit-scrollbar {
    width: 0;
    display: none;
}

.n-date-picker__time-pad {
    height: 84px; /* 3 cells padding top/bottom to center active cell */
}

.n-date-picker__time-cell {
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

.n-date-picker__time-cell:hover {
    color: var(--n-color-primary);
    font-weight: 600;
}

.n-date-picker__time-cell--active {
    color: var(--n-color-primary);
    font-weight: 700;
    font-size: 14px;
}

/* Center highlight bar — inside scroll-area, positioned relative to scroll viewport */
.n-date-picker__time-highlight {
    position: absolute;
    top: 84px; /* 3 cells padding */
    left: 0;
    right: 0;
    height: 28px;
    background: var(--n-color-primary-light, rgba(59, 130, 246, 0.08));
    border-top: 1px solid var(--n-color-primary-light, rgba(59, 130, 246, 0.15));
    border-bottom: 1px solid var(--n-color-primary-light, rgba(59, 130, 246, 0.15));
    pointer-events: none;
    z-index: 0;
}

/* Top/bottom fade masks — per column, positioned relative to scroll-area */
.n-date-picker__time-scroll-area::before,
.n-date-picker__time-scroll-area::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 80px;
    pointer-events: none;
    z-index: 4;
}
.n-date-picker__time-scroll-area::before {
    top: 0;
    background: linear-gradient(to bottom, var(--n-color-bg), transparent);
}
.n-date-picker__time-scroll-area::after {
    bottom: 0;
    background: linear-gradient(to top, var(--n-color-bg), transparent);
}

/* ===== Range datetime: two time blocks side by side ===== */
.n-date-picker__time-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    opacity: 0.55;
    transition: opacity 0.2s;
}

.n-date-picker__time-block--active {
    opacity: 1;
}

.n-date-picker__time-block-label {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--n-color-primary);
    padding: 2px 0;
}

.n-date-picker__time-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 6px;
}

.n-date-picker__time-footer--range {
    justify-content: center;
}

.n-date-picker__time-btn {
    padding: 4px 14px;
    border: 1px solid var(--n-color-border);
    border-radius: 4px;
    background: var(--n-color-bg);
    color: var(--n-color-text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
}

.n-date-picker__time-btn:hover {
    border-color: var(--n-color-primary);
    color: var(--n-color-primary);
}

.n-date-picker__time-btn--primary {
    background: var(--n-color-primary);
    border-color: var(--n-color-primary);
    color: #fff;
}

.n-date-picker__time-btn--primary:hover {
    opacity: 0.85;
    color: #fff;
}

/* Transition */
.n-date-picker__fade-enter-active,
.n-date-picker__fade-leave-active {
    transition: all 0.15s ease;
}

.n-date-picker__fade-enter-from,
.n-date-picker__fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
