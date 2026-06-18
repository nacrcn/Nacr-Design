<template>
  <div class="doc-page">
    <h1>DatePicker 日期选择器</h1>
    <p class="doc-page__desc">用于选择或输入日期，支持日期、日期时间、日期范围、月份、年份等多种类型。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="默认为日期选择类型，通过 v-model 绑定日期字符串（YYYY-MM-DD 格式）："
      :code="basicCode"
    >
      <div style="max-width:280px;">
        <NDatePicker v-model="val1" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val1 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 日期时间选择 -->
    <DemoBlock
      title="日期时间选择"
      description="设置 type='datetime'，日期和时间在同一面板中选择，v-model 绑定精确到秒（YYYY-MM-DD HH:mm:ss 格式）："
      :code="datetimeCode"
    >
      <div style="max-width:280px;">
        <NDatePicker v-model="valDt" type="datetime" placeholder="请选择日期时间" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ valDt || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 日期范围选择 -->
    <DemoBlock
      title="日期范围选择"
      description="设置 type='daterange'，v-model 绑定 [开始日期, 结束日期] 数组："
      :code="rangeCode"
    >
      <div style="max-width:380px;">
        <NDatePicker v-model="val2" type="daterange" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">
          {{ Array.isArray(val2) ? `${val2[0] || '?'} ~ ${val2[1] || '?'}` : '未选择' }}
        </p>
      </div>
    </DemoBlock>

    <!-- 日期时间范围选择 -->
    <DemoBlock
      title="日期时间范围选择"
      description="设置 type='datetimerange'，范围选择完成后可分别设置开始和结束时间，日期和时间在同一面板中："
      :code="datetimerangeCode"
    >
      <div style="max-width:380px;">
        <NDatePicker v-model="valDtr" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">
          {{ Array.isArray(valDtr) ? `${valDtr[0] || '?'} ~ ${valDtr[1] || '?'}` : '未选择' }}
        </p>
      </div>
    </DemoBlock>

    <!-- 月份选择 -->
    <DemoBlock
      title="月份选择"
      description="设置 type='month'，选择月份，v-model 绑定为该月首日字符串："
      :code="monthCode"
    >
      <div style="max-width:280px;">
        <NDatePicker v-model="val3" type="month" placeholder="请选择月份" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val3 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 年份选择 -->
    <DemoBlock
      title="年份选择"
      description="设置 type='year'，选择年份，v-model 绑定为该年首日字符串："
      :code="yearCode"
    >
      <div style="max-width:280px;">
        <NDatePicker v-model="val4" type="year" placeholder="请选择年份" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val4 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 快捷选项 -->
    <DemoBlock
      title="快捷选项"
      description="通过 shortcuts 设置预设的快捷日期选项，常用于日期范围选择："
      :code="shortcutCode"
    >
      <div style="max-width:380px;">
        <NDatePicker v-model="val5" type="daterange" :shortcuts="shortcuts" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">
          {{ Array.isArray(val5) ? `${val5[0] || '?'} ~ ${val5[1] || '?'}` : '未选择' }}
        </p>
      </div>
    </DemoBlock>

    <!-- 格式化 -->
    <DemoBlock
      title="格式化显示"
      description="通过 format 自定义显示格式，支持 YYYY、MM、DD、HH、mm、ss 占位符："
      :code="formatCode"
    >
      <div style="max-width:280px; display:flex; flex-direction:column; gap:12px;">
        <NDatePicker v-model="val6" format="YYYY年MM月DD日" />
        <NDatePicker v-model="val7" type="month" format="YYYY年MM月" />
        <NDatePicker v-model="valFmt" type="datetime" format="YYYY/MM/DD HH:mm" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex; flex-direction:column; gap:12px; max-width:280px;">
        <NDatePicker v-model="val8" size="sm" placeholder="小尺寸" />
        <NDatePicker v-model="val9" size="md" placeholder="中等尺寸" />
        <NDatePicker v-model="val10" size="lg" placeholder="大尺寸" />
      </div>
    </DemoBlock>

    <!-- 可清空与禁用 -->
    <DemoBlock
      title="可清空与禁用"
      description="clearable 属性使选择器显示清除按钮，disabled 属性禁用选择器："
      :code="clearCode"
    >
      <div style="max-width:280px; display:flex; flex-direction:column; gap:12px;">
        <NDatePicker v-model="val11" clearable placeholder="选择后可清除" />
        <NDatePicker v-model="val12" disabled placeholder="禁用状态" />
      </div>
    </DemoBlock>

    <!-- 禁用日期 -->
    <DemoBlock
      title="禁用日期"
      description="通过 disabledDate 函数禁用特定日期，返回 true 表示禁用："
      :code="disabledDateCode"
    >
      <div style="max-width:280px;">
        <NDatePicker v-model="val13" :disabled-date="disableFuture" placeholder="不能选择未来日期" />
      </div>
    </DemoBlock>

    <!-- ========== API ========== -->
    <h2 style="margin-top:48px;">API</h2>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Shortcuts" :columns="shortcutColumns" :data="shortcutData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref('')
const valDt = ref('')
const val2 = ref<[string, string]>(['', ''])
const valDtr = ref<[string, string]>(['', ''])
const val3 = ref('')
const val4 = ref('')
const val5 = ref<[string, string]>(['', ''])
const val6 = ref('')
const val7 = ref('')
const valFmt = ref('')
const val8 = ref('')
const val9 = ref('')
const val10 = ref('')
const val11 = ref('2026-01-15')
const val12 = ref('2026-06-01')
const val13 = ref('')

function disableFuture(d: string) {
  return d > new Date().toISOString().slice(0, 10)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const shortcuts = [
  { label: '最近7天', value: [daysAgo(7), today()] as [string, string] },
  { label: '最近30天', value: [daysAgo(30), today()] as [string, string] },
  { label: '最近90天', value: [daysAgo(90), today()] as [string, string] },
  { label: '本周', value: [daysAgo(new Date().getDay()), today()] as [string, string] },
  { label: '本月', value: [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`, today()] as [string, string] },
]

// ========== Code ==========
const basicCode = `<template>
  <NDatePicker v-model="value" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const datetimeCode = `<template>
  <NDatePicker v-model="value" type="datetime" placeholder="请选择日期时间" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const rangeCode = `<template>
  <NDatePicker v-model="value" type="daterange" />
</template>

<script setup lang="ts">
const value = ref<[string, string]>(['', ''])
<\/script>`

const datetimerangeCode = `<template>
  <NDatePicker
    v-model="value"
    type="datetimerange"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

<script setup lang="ts">
const value = ref<[string, string]>(['', ''])
<\/script>`

const monthCode = `<template>
  <NDatePicker v-model="value" type="month" placeholder="请选择月份" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const yearCode = `<template>
  <NDatePicker v-model="value" type="year" placeholder="请选择年份" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const shortcutCode = `<template>
  <NDatePicker v-model="value" type="daterange" :shortcuts="shortcuts" />
</template>

<script setup lang="ts">
const value = ref<[string, string]>(['', ''])

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
function today(): string {
  return new Date().toISOString().slice(0, 10)
}

const shortcuts = [
  { label: '最近7天', value: [daysAgo(7), today()] as [string, string] },
  { label: '最近30天', value: [daysAgo(30), today()] as [string, string] },
  { label: '最近90天', value: [daysAgo(90), today()] as [string, string] },
]
<\/script>`

const formatCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NDatePicker v-model="v1" format="YYYY年MM月DD日" />
    <NDatePicker v-model="v2" type="month" format="YYYY年MM月" />
    <NDatePicker v-model="v3" type="datetime" format="YYYY/MM/DD HH:mm" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NDatePicker v-model="v1" size="sm" placeholder="小尺寸" />
    <NDatePicker v-model="v2" size="md" placeholder="中等尺寸" />
    <NDatePicker v-model="v3" size="lg" placeholder="大尺寸" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const clearCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NDatePicker v-model="v1" clearable placeholder="选择后可清除" />
    <NDatePicker v-model="v2" disabled placeholder="禁用状态" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('2026-01-15')
const v2 = ref('2026-06-01')
<\/script>`

const disabledDateCode = `<template>
  <NDatePicker v-model="value" :disabled-date="disableFuture" placeholder="不能选择未来日期" />
</template>

<script setup lang="ts">
const value = ref('')
function disableFuture(d: string) {
  return d > new Date().toISOString().slice(0, 10)
}
<\/script>`

// ========== API ==========
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string | [string, string]', default: '—', desc: '绑定值，daterange/datetimerange 类型为二元数组' },
  { name: 'type', type: "'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year'", default: "'date'", desc: '选择器类型' },
  { name: 'placeholder', type: 'string', default: "'请选择日期'", desc: '未选择时的占位文本' },
  { name: 'startPlaceholder', type: 'string', default: "'开始日期'", desc: '日期范围选择的开始占位文本' },
  { name: 'endPlaceholder', type: 'string', default: "'结束日期'", desc: '日期范围选择的结束占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '选择器尺寸' },
  { name: 'format', type: 'string', default: '—', desc: '显示格式，支持 YYYY、MM、DD、HH、mm、ss 占位符' },
  { name: 'disabledDate', type: '(date: string) => boolean', default: '—', desc: '禁用日期函数，返回 true 禁用' },
  { name: 'shortcuts', type: 'Shortcut[]', default: '—', desc: '快捷选项数组' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string | [string, string] | undefined) => void', desc: '值变化时触发' },
  { name: 'change', type: '(value: string | [string, string] | undefined) => void', desc: '确认选择时触发' },
]

const shortcutColumns = [
  { key: 'key', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const shortcutData = [
  { key: 'label', type: 'string', desc: '快捷选项显示文本' },
  { key: 'value', type: 'string | [string, string]', desc: '快捷选项值，daterange 时为二元数组' },
]
</script>
