<template>
  <div class="doc-page">
    <h1>Calendar 日历</h1>
    <p class="doc-page__desc">日历组件，支持日期选择、范围选择、事件标记、自定义内容等多种用法。</p>

    <DemoBlock title="基础用法" description="通过 v-model 绑定选中日期，支持月份和年份切换。" :code="basicCode">
      <NCalendar v-model="selectedDate" />
      <p style="margin-top:12px;font-size:13px;color:var(--n-color-text-secondary);">选中日期：{{ formatDate(selectedDate) }}</p>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="提供 sm / md / lg 三种尺寸。" :code="sizeCode">
      <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:start;">
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">sm</p>
          <NCalendar size="sm" v-model="sizeDate" />
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">md（默认）</p>
          <NCalendar size="md" v-model="sizeDate" />
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">lg</p>
          <NCalendar size="lg" v-model="sizeDate" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="周起始日" description="通过 week-start 设置每周的第一天，0=周日（默认），1=周一，6=周六。" :code="weekStartCode">
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">周日开始</p>
          <NCalendar :week-start="0" v-model="weekDate" />
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">周一开始</p>
          <NCalendar :week-start="1" v-model="weekDate" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="禁用日期" description="通过 disabled-date 函数禁用特定日期，禁用的日期不可选中且样式变灰。" :code="disabledCode">
      <NCalendar v-model="disabledDate" :disabled-date="isWeekend" />
      <p style="margin-top:8px;font-size:13px;color:var(--n-color-text-tertiary);">周末（周六、周日）不可选</p>
    </DemoBlock>

    <DemoBlock title="事件标记" description="通过 events 属性在日期下方显示彩色圆点标记，每个事件可设置不同颜色。" :code="eventCode">
      <NCalendar v-model="eventDate" :events="demoEvents" />
      <p style="margin-top:8px;font-size:13px;color:var(--n-color-text-tertiary);">带有彩色圆点的日期表示有事件</p>
    </DemoBlock>

    <DemoBlock title="范围选择" description="设置 mode 为 range 开启日期范围选择，点击两次分别选择起始和结束日期。" :code="rangeCode">
      <NCalendar v-model="rangeDate" mode="range" v-model:range-start="rangeStart" v-model:range-end="rangeEnd" />
      <p style="margin-top:8px;font-size:13px;color:var(--n-color-text-secondary);">
        范围：{{ rangeStart ? formatDate(rangeStart) : '未选择' }} ~ {{ rangeEnd ? formatDate(rangeEnd) : '未选择' }}
      </p>
    </DemoBlock>

    <DemoBlock title="自定义日期内容" description="使用 #cell 插槽自定义日期单元格内容，如显示日程信息。" :code="cellCode">
      <NCalendar v-model="cellDate" :events="cellEvents">
        <template #cell="{ date, current }">
          <template v-if="current">
            <span v-for="evt in getCellEvents(date)" :key="evt.content" class="cell-event" :style="{ color: evt.color }">
              {{ evt.content }}
            </span>
          </template>
        </template>
      </NCalendar>
    </DemoBlock>

    <DemoBlock title="年份快速选择" description="点击标题栏的年月文字可以打开年份选择面板，快速跳转到指定年份。" :code="yearPickerCode">
      <NCalendar v-model="yearDate" />
      <p style="margin-top:8px;font-size:13px;color:var(--n-color-text-tertiary);">点击标题「2026年6月」可打开年份面板</p>
    </DemoBlock>

    <DemoBlock title="在卡片中使用" description="搭配 Card 组件将日历嵌入卡片，实现更丰富的布局效果。" :code="combineCode">
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <NCard title="日程安排" style="width:320px;">
          <NCalendar size="sm" v-model="combineDate" :events="combineEvents" />
          <template #footer>
            <NTag v-for="evt in todayEvents" :key="evt.content" :type="evt.tagType" size="sm" style="margin-right:6px;">
              {{ evt.content }}
            </NTag>
            <span v-if="!todayEvents.length" style="font-size:13px;color:var(--n-color-text-tertiary);">今日无日程</span>
          </template>
        </NCard>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const selectedDate = ref(new Date())
const sizeDate = ref(new Date())
const weekDate = ref(new Date())
const disabledDate = ref(new Date())
const eventDate = ref(new Date())
const rangeDate = ref(new Date())
const rangeStart = ref<Date | undefined>(undefined)
const rangeEnd = ref<Date | undefined>(undefined)
const cellDate = ref(new Date())
const yearDate = ref(new Date())
const combineDate = ref(new Date())

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

// 事件标记数据
const now = new Date()
const y = now.getFullYear()
const m = now.getMonth()
function d(day: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const demoEvents = ref([
  { date: d(3), color: '#1677ff', content: '会议' },
  { date: d(8), color: '#52c41a', content: '发布' },
  { date: d(12), color: '#f5222d', content: '截止' },
  { date: d(15), color: '#fa8c16', content: '评审' },
  { date: d(20), color: '#722ed1', content: '团建' },
  { date: d(25), color: '#1677ff', content: '复盘' },
  { date: d(28), color: '#52c41a', content: '上线' },
])

const cellEvents = ref([
  { date: d(5), color: '#1677ff', content: '晨会' },
  { date: d(10), color: '#f5222d', content: '截止' },
  { date: d(18), color: '#52c41a', content: '发布' },
  { date: d(22), color: '#fa8c16', content: '评审' },
])

const combineEvents = ref([
  { date: d(5), color: '#1677ff', content: '需求评审' },
  { date: d(12), color: '#f5222d', content: '版本截止' },
  { date: d(18), color: '#52c41a', content: '正式发布' },
  { date: d(25), color: '#fa8c16', content: '回顾会议' },
])

function getCellEvents(date: Date) {
  const key = formatDate(date)
  return cellEvents.value.filter(e => e.date === key)
}

const todayEvents = computed(() => {
  const key = formatDate(combineDate.value)
  return combineEvents.value
    .filter(e => e.date === key)
    .map(e => {
      let tagType: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary'
      if (e.color === '#f5222d') tagType = 'danger'
      else if (e.color === '#52c41a') tagType = 'success'
      else if (e.color === '#fa8c16') tagType = 'warning'
      return { ...e, tagType }
    })
})

// 代码字符串
const basicCode = `<NCalendar v-model="selectedDate" />`

const sizeCode = `<NCalendar size="sm" v-model="date" />
<NCalendar size="md" v-model="date" />
<NCalendar size="lg" v-model="date" />`

const weekStartCode = `<!-- 周日开始 -->
<NCalendar :week-start="0" v-model="date" />

<!-- 周一开始 -->
<NCalendar :week-start="1" v-model="date" />`

const disabledCode = `<NCalendar v-model="date" :disabled-date="isWeekend" />

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}`

const eventCode = `<NCalendar v-model="date" :events="events" />

const events = [
  { date: '2026-06-03', color: '#1677ff', content: '会议' },
  { date: '2026-06-08', color: '#52c41a', content: '发布' },
  { date: '2026-06-12', color: '#f5222d', content: '截止' },
]`

const rangeCode = `<NCalendar
  v-model="date"
  mode="range"
  v-model:range-start="start"
  v-model:range-end="end"
/>`

const cellCode = `<NCalendar v-model="date" :events="events">
  <template #cell="{ date, current }">
    <span v-for="evt in getEvents(date)" :style="{ color: evt.color }">
      {{ evt.content }}
    </span>
  </template>
</NCalendar>`

const yearPickerCode = `<NCalendar v-model="date" />
<!-- 点击标题年月文字打开年份选择 -->`

const combineCode = `<NCard title="日程安排">
  <NCalendar size="sm" v-model="date" :events="events" />
  <template #footer>
    <NTag type="primary" size="sm">今日日程</NTag>
  </template>
</NCard>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'Date', default: 'new Date()', desc: '当前选中日期' },
  { name: 'mode', type: "'date' | 'range'", default: "'date'", desc: '选择模式，date 为单日期，range 为范围选择' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '日历尺寸' },
  { name: 'weekStart', type: '0 | 1 | 6', default: '0', desc: '每周起始日，0=周日，1=周一，6=周六' },
  { name: 'disabledDate', type: '(date: Date) => boolean', default: '—', desc: '禁用日期判断函数，返回 true 则该日期不可选' },
  { name: 'events', type: 'CalendarEvent[]', default: '[]', desc: '事件标记列表，每项包含 date（YYYY-MM-DD）、color、content' },
  { name: 'rangeStart', type: 'Date', default: '—', desc: '范围选择起始日期（range 模式）' },
  { name: 'rangeEnd', type: 'Date', default: '—', desc: '范围选择结束日期（range 模式）' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: Date)', desc: '日期变化时触发' },
  { name: 'change', type: '(val: Date)', desc: '点击选中日期时触发' },
  { name: 'update:rangeStart', type: '(val: Date)', desc: '范围起始日期变化时触发' },
  { name: 'update:rangeEnd', type: '(val: Date)', desc: '范围结束日期变化时触发' },
  { name: 'rangeChange', type: '(start: Date | null, end: Date | null)', desc: '范围选择变化时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'cell', desc: '自定义日期单元格内容，参数 { date: Date, current: boolean }' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'prevMonth', type: '—', desc: '切换到上个月' },
  { name: 'nextMonth', type: '—', desc: '切换到下个月' },
  { name: 'prevYear', type: '—', desc: '切换到上一年' },
  { name: 'nextYear', type: '—', desc: '切换到下一年' },
]
</script>

<style scoped>
.cell-event {
  display: block;
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
