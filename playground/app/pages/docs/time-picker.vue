<template>
  <div class="doc-page">
    <h1>TimePicker 时间选择器</h1>
    <p class="doc-page__desc">用于选择或输入时间，支持小时、时分、时分秒以及时间范围等多种类型，采用滚动选择交互。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="默认为时分秒类型（type='time'），通过 v-model 绑定时间字符串（HH:mm:ss 格式）："
      :code="basicCode"
    >
      <div style="max-width:200px;">
        <NTimePicker v-model="val1" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val1 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 小时选择 -->
    <DemoBlock
      title="小时选择"
      description="设置 type='hour'，仅选择小时，v-model 绑定为 HH 格式："
      :code="hourCode"
    >
      <div style="max-width:200px;">
        <NTimePicker v-model="valHour" type="hour" placeholder="请选择小时" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ valHour || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 时分选择 -->
    <DemoBlock
      title="时分选择"
      description="默认 type='time' 包含时分秒列，可通过 format='HH:mm' 隐藏秒列，v-model 绑定为 HH:mm 格式："
      :code="minuteCode"
    >
      <div style="max-width:200px;">
        <NTimePicker v-model="valMinute" format="HH:mm" placeholder="请选择时分" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ valMinute || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 时间范围选择 -->
    <DemoBlock
      title="时间范围选择"
      description="设置 type='timerange'，可选择开始时间和结束时间，左右两个选择面板独立操作，v-model 绑定为 [开始时间, 结束时间] 数组："
      :code="rangeCode"
    >
      <div style="max-width:360px;">
        <NTimePicker v-model="valRange" type="timerange" start-placeholder="开始时间" end-placeholder="结束时间" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">
          {{ Array.isArray(valRange) ? `${valRange[0] || '?'} ~ ${valRange[1] || '?'}` : '未选择' }}
        </p>
      </div>
    </DemoBlock>

    <!-- 格式化 -->
    <DemoBlock
      title="格式化显示"
      description="通过 format 自定义显示格式，支持 HH、mm、ss 占位符。format 同时控制显示列（不含 ss 则隐藏秒列）："
      :code="formatCode"
    >
      <div style="max-width:200px; display:flex; flex-direction:column; gap:12px;">
        <NTimePicker v-model="valFmt1" format="HH时mm分" placeholder="HH时mm分" />
        <NTimePicker v-model="valFmt2" format="HH:mm" placeholder="HH:mm" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex; flex-direction:column; gap:12px; max-width:200px;">
        <NTimePicker v-model="valSm" size="sm" placeholder="小尺寸" />
        <NTimePicker v-model="valMd" size="md" placeholder="中等尺寸" />
        <NTimePicker v-model="valLg" size="lg" placeholder="大尺寸" />
      </div>
    </DemoBlock>

    <!-- 可清空与禁用 -->
    <DemoBlock
      title="可清空与禁用"
      description="clearable 属性使选择器显示清除按钮，disabled 属性禁用选择器："
      :code="clearCode"
    >
      <div style="max-width:200px; display:flex; flex-direction:column; gap:12px;">
        <NTimePicker v-model="valClear" clearable placeholder="选择后可清除" />
        <NTimePicker v-model="valDisabled" disabled placeholder="禁用状态" />
      </div>
    </DemoBlock>

    <!-- 禁用时间 -->
    <DemoBlock
      title="禁用部分时间"
      description="通过 disabledHours、disabledMinutes、disabledSeconds 函数禁用特定时间选项，函数返回需要禁用的时间数值数组："
      :code="disabledCode"
    >
      <div style="max-width:200px;">
        <NTimePicker v-model="valDisable" :disabled-hours="disabledHoursFn" :disabled-minutes="disabledMinutesFn" placeholder="禁用部分时间" />
      </div>
    </DemoBlock>

    <!-- ========== API ========== -->
    <h2 style="margin-top:48px;">API</h2>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref('')
const valHour = ref('')
const valMinute = ref('')
const valRange = ref<[string, string]>(['', ''])
const valFmt1 = ref('')
const valFmt2 = ref('')
const valSm = ref('')
const valMd = ref('')
const valLg = ref('')
const valClear = ref('10:30:00')
const valDisabled = ref('09:00:00')
const valDisable = ref('')

function disabledHoursFn() {
  return [0, 1, 2, 3, 4, 5, 6] // 禁用凌晨0-6点
}

function disabledMinutesFn(hour: number) {
  if (hour === 7) return [0, 1, 2, 3, 4, 5] // 7点时禁用前5分钟
  return []
}

// ========== Code ==========
const basicCode = `<template>
  <NTimePicker v-model="value" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const hourCode = `<template>
  <NTimePicker v-model="value" type="hour" placeholder="请选择小时" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const minuteCode = `<template>
  <NTimePicker v-model="value" format="HH:mm" placeholder="请选择时分" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const rangeCode = `<template>
  <NTimePicker
    v-model="value"
    type="timerange"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

<script setup lang="ts">
const value = ref<[string, string]>(['', ''])
<\/script>`

const formatCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NTimePicker v-model="v1" format="HH时mm分" placeholder="HH时mm分" />
    <NTimePicker v-model="v2" format="HH:mm" placeholder="HH:mm" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NTimePicker v-model="v1" size="sm" placeholder="小尺寸" />
    <NTimePicker v-model="v2" size="md" placeholder="中等尺寸" />
    <NTimePicker v-model="v3" size="lg" placeholder="大尺寸" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const clearCode = `<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <NTimePicker v-model="v1" clearable placeholder="选择后可清除" />
    <NTimePicker v-model="v2" disabled placeholder="禁用状态" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('10:30:00')
const v2 = ref('09:00:00')
<\/script>`

const disabledCode = `<template>
  <NTimePicker
    v-model="value"
    :disabled-hours="disabledHoursFn"
    :disabled-minutes="disabledMinutesFn"
    placeholder="禁用部分时间"
  />
</template>

<script setup lang="ts">
const value = ref('')

function disabledHoursFn() {
  // 禁用凌晨0-6点
  return [0, 1, 2, 3, 4, 5, 6]
}

function disabledMinutesFn(hour: number) {
  // 7点时禁用前5分钟
  if (hour === 7) return [0, 1, 2, 3, 4, 5]
  return []
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
  { name: 'modelValue', type: 'string | [string, string]', default: "''", desc: '绑定值，timerange 类型为二元数组' },
  { name: 'type', type: "'hour' | 'time' | 'timerange'", default: "'time'", desc: '选择器类型：hour 仅选择小时，time 选择时分秒，timerange 选择时间范围' },
  { name: 'placeholder', type: 'string', default: "'请选择时间'", desc: '未选择时的占位文本' },
  { name: 'startPlaceholder', type: 'string', default: "'开始时间'", desc: '时间范围选择的开始占位文本' },
  { name: 'endPlaceholder', type: 'string', default: "'结束时间'", desc: '时间范围选择的结束占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '选择器尺寸' },
  { name: 'format', type: 'string', default: '—', desc: '显示格式，支持 HH、mm、ss 占位符。不含 ss 则隐藏秒列，不含 mm 则隐藏分列' },
  { name: 'disabledHours', type: '() => number[]', default: '—', desc: '禁用小时函数，返回禁用的小时数值数组' },
  { name: 'disabledMinutes', type: '(hour: number) => number[]', default: '—', desc: '禁用分钟函数，接收当前小时，返回禁用的分钟数值数组' },
  { name: 'disabledSeconds', type: '(hour: number, minute: number) => number[]', default: '—', desc: '禁用秒函数，接收当前小时和分钟，返回禁用的秒数值数组' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string | [string, string] | undefined) => void', desc: '值变化时触发' },
  { name: 'change', type: '(value: string | [string, string] | undefined) => void', desc: '确认选择时触发' },
]
</script>
