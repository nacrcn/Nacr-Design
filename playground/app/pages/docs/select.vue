<template>
  <div class="doc-page">
    <h1>Select 选择器</h1>
    <p class="doc-page__desc">下拉选择器，支持单选、多选、搜索、禁用选项、不同尺寸等。</p>

    <DemoBlock title="基础用法" description="最简单的单选模式，通过 v-model 绑定选中值。" :code="basicCode">
      <NSelect v-model="basicVal" :options="cityOptions" placeholder="请选择城市" />
      <p class="doc-page__result">选中值：{{ basicVal ?? '无' }}</p>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="提供 sm / md / lg 三种尺寸，默认为 md。" :code="sizeCode">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <NSelect v-model="sizeVal" :options="cityOptions" size="sm" placeholder="小尺寸" style="width:160px" />
        <NSelect v-model="sizeVal" :options="cityOptions" size="md" placeholder="中尺寸" style="width:160px" />
        <NSelect v-model="sizeVal" :options="cityOptions" size="lg" placeholder="大尺寸" style="width:160px" />
      </div>
    </DemoBlock>

    <DemoBlock title="多选模式" description="设置 multiple 属性启用多选，值为数组。" :code="multipleCode">
      <NSelect v-model="multiVal" :options="cityOptions" multiple placeholder="请选择多个城市" />
      <p class="doc-page__result">选中值：{{ multiVal.length ? multiVal.join(', ') : '无' }}</p>
    </DemoBlock>

    <DemoBlock title="可搜索" description="设置 filterable 属性启用搜索过滤。" :code="filterableCode">
      <NSelect v-model="filterVal" :options="cityOptions" filterable placeholder="输入关键字搜索" />
    </DemoBlock>

    <DemoBlock title="可清空" description="设置 clearable 属性，选中后可一键清空。" :code="clearableCode">
      <NSelect v-model="clearVal" :options="cityOptions" clearable placeholder="选择后可清空" />
    </DemoBlock>

    <DemoBlock title="禁用与禁用选项" description="整体禁用使用 disabled，单条选项禁用在 options 中设置 disabled: true。" :code="disabledCode">
      <NSelect v-model="disabledVal" :options="disabledOptions" placeholder="部分选项禁用" style="margin-bottom:12px" />
      <NSelect v-model="disabledVal2" :options="cityOptions" disabled placeholder="整体禁用" />
    </DemoBlock>

    <DemoBlock title="事件回调" description="选中值变化时触发 change 事件，接收新值为参数。" :code="eventCode">
      <NSelect v-model="eventVal" :options="cityOptions" placeholder="切换触发事件" @change="handleChange" />
      <p class="doc-page__result">change 事件最近返回值：{{ lastChange ?? '暂无' }}</p>
    </DemoBlock>

    <DemoBlock title="多选 + 搜索 + 清空" description="多种特性组合使用。" :code="comboCode">
      <NSelect v-model="comboVal" :options="cityOptions" multiple filterable clearable placeholder="可搜索、可多选、可清空" />
      <p class="doc-page__result">选中值：{{ comboVal.length ? comboVal.join(', ') : '无' }}</p>
    </DemoBlock>

    <DemoBlock title="自定义选项" description="options 支持任意 value 类型，可配合业务数据使用。" :code="customCode">
      <NSelect v-model="customVal" :options="userOptions" filterable placeholder="搜索用户" />
      <p class="doc-page__result">选中用户 ID：{{ customVal ?? '无' }}</p>
    </DemoBlock>

    <DemoBlock title="远程搜索" description="设置 remote 和 remoteMethod 属性启用异步搜索，输入关键字后会自动调用远程方法获取选项。" :code="remoteCode">
      <NSelect
        v-model="remoteVal"
        :options="remoteOptions"
        remote
        :remote-method="fetchRemote"
        placeholder="输入城市名远程搜索"
        style="margin-bottom:12px"
      />
      <NSelect
        v-model="remoteMultiVal"
        :options="remoteOptions"
        remote
        :remote-method="fetchRemote"
        multiple
        filterable
        clearable
        placeholder="多选 + 远程搜索 + 可清空"
      />
      <p class="doc-page__result">单选值：{{ remoteVal ?? '无' }}　多选值：{{ remoteMultiVal.length ? remoteMultiVal.join(', ') : '无' }}</p>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="SelectOption" :columns="typeColumns" :data="typeData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

/* ── 选项数据 ── */
const cityOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
]

const disabledOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh', disabled: true },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz', disabled: true },
  { label: '杭州', value: 'hz' },
]

const userOptions = [
  { label: '张三 - 前端工程师', value: 1001 },
  { label: '李四 - 后端工程师', value: 1002 },
  { label: '王五 - 产品经理', value: 1003 },
  { label: '赵六 - UI 设计师', value: 1004 },
  { label: '孙七 - 测试工程师', value: 1005 },
]

/* ── 各 Demo 绑定值 ── */
const basicVal = ref<string | undefined>(undefined)
const sizeVal = ref<string | undefined>('bj')
const multiVal = ref<string[]>([])
const filterVal = ref<string | undefined>(undefined)
const clearVal = ref<string | undefined>('sh')
const disabledVal = ref<string | undefined>(undefined)
const disabledVal2 = ref<string | undefined>('bj')
const eventVal = ref<string | undefined>(undefined)
const comboVal = ref<string[]>([])
const customVal = ref<number | undefined>(undefined)

/* ── 远程搜索 ── */
const remoteVal = ref<string | undefined>(undefined)
const remoteMultiVal = ref<string[]>([])
const remoteOptions = ref<{ label: string; value: string }[]>([])

const allCities = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
  { label: '重庆', value: 'cq' },
  { label: '苏州', value: 'suz' },
  { label: '厦门', value: 'xm' },
  { label: '长沙', value: 'cs' },
]

async function fetchRemote(query: string): Promise<{ label: string; value: string }[]> {
  await new Promise(r => setTimeout(r, 600))
  if (!query) return allCities.slice(0, 6)
  return allCities.filter(c => c.label.includes(query))
}

const lastChange = ref<string | undefined>(undefined)
function handleChange(val: any) {
  lastChange.value = String(val)
}

/* ── 演示代码 ── */
const basicCode = `<template>
  <NSelect v-model="val" :options="options" placeholder="请选择城市" />
  <p>选中值：{{ val }}</p>
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
]
const val = ref(undefined)
<\/script>`

const sizeCode = `<template>
  <NSelect v-model="val" :options="options" size="sm" placeholder="小尺寸" />
  <NSelect v-model="val" :options="options" size="md" placeholder="中尺寸" />
  <NSelect v-model="val" :options="options" size="lg" placeholder="大尺寸" />
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]
const val = ref('bj')
<\/script>`

const multipleCode = `<template>
  <NSelect v-model="val" :options="options" multiple placeholder="请选择多个城市" />
  <p>选中值：{{ val.join(', ') }}</p>
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
]
const val = ref([])
<\/script>`

const filterableCode = `<template>
  <NSelect v-model="val" :options="options" filterable placeholder="输入关键字搜索" />
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
]
const val = ref(undefined)
<\/script>`

const clearableCode = `<template>
  <NSelect v-model="val" :options="options" clearable placeholder="选择后可清空" />
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]
const val = ref('sh')
<\/script>`

const disabledCode = `<template>
  <!-- 部分选项禁用 -->
  <NSelect v-model="val" :options="options" placeholder="部分选项禁用" />
  <!-- 整体禁用 -->
  <NSelect v-model="val2" :options="options" disabled placeholder="整体禁用" />
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh', disabled: true },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz', disabled: true },
  { label: '杭州', value: 'hz' },
]
const val = ref(undefined)
const val2 = ref('bj')
<\/script>`

const eventCode = `<template>
  <NSelect v-model="val" :options="options" @change="handleChange" />
  <p>change 回调值：{{ lastChange }}</p>
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]
const val = ref(undefined)
const lastChange = ref(undefined)

function handleChange(value) {
  lastChange.value = value
}
<\/script>`

const comboCode = `<template>
  <NSelect
    v-model="val"
    :options="options"
    multiple
    filterable
    clearable
    placeholder="可搜索、可多选、可清空"
  />
  <p>选中值：{{ val.join(', ') }}</p>
</template>

<script setup>
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
]
const val = ref([])
<\/script>`

const customCode = `<template>
  <NSelect v-model="val" :options="users" filterable placeholder="搜索用户" />
  <p>选中用户 ID：{{ val }}</p>
</template>

<script setup>
const users = [
  { label: '张三 - 前端工程师', value: 1001 },
  { label: '李四 - 后端工程师', value: 1002 },
  { label: '王五 - 产品经理', value: 1003 },
  { label: '赵六 - UI 设计师', value: 1004 },
  { label: '孙七 - 测试工程师', value: 1005 },
]
const val = ref(undefined)
<\/script>`

const remoteCode = `<template>
  <!-- 单选远程搜索 -->
  <NSelect
    v-model="val"
    :options="options"
    remote
    :remote-method="fetchRemote"
    placeholder="输入城市名远程搜索"
  />

  <!-- 多选 + 远程搜索 + 可清空 -->
  <NSelect
    v-model="multiVal"
    :options="options"
    remote
    :remote-method="fetchRemote"
    multiple
    filterable
    clearable
    placeholder="多选 + 远程搜索 + 可清空"
  />
</template>

<script setup>
const val = ref(undefined)
const multiVal = ref([])
const options = ref([])

const allCities = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
  { label: '重庆', value: 'cq' },
  { label: '苏州', value: 'suz' },
  { label: '厦门', value: 'xm' },
  { label: '长沙', value: 'cs' },
]

async function fetchRemote(query) {
  // 模拟接口请求延迟
  await new Promise(r => setTimeout(r, 600))
  if (!query) return allCities.slice(0, 6)
  return allCities.filter(c => c.label.includes(query))
}
<\/script>`

/* ── API 表格 ── */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'v-model', type: 'string | number | undefined', default: 'undefined', desc: '选中值（多选时为数组）' },
  { name: 'options', type: 'SelectOption[]', default: '[]', desc: '选项数据' },
  { name: 'placeholder', type: 'string', default: "'请选择'", desc: '占位文本' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '选择器尺寸' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '是否多选' },
  { name: 'filterable', type: 'boolean', default: 'false', desc: '是否可本地搜索过滤' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'remote', type: 'boolean', default: 'false', desc: '是否启用远程搜索' },
  { name: 'remoteMethod', type: '(query: string) => Promise<SelectOption[]>', default: '—', desc: '远程搜索方法，接收搜索关键字，返回 Promise<SelectOption[]>' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否显示加载状态（外部控制时使用）' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'change', type: '(value: string | number | undefined | (string | number)[]) => void', desc: '选中值变化时触发' },
  { name: 'update:modelValue', type: '(value: any) => void', desc: 'v-model 更新事件' },
  { name: 'search', type: '(query: string) => void', desc: '搜索关键字变化时触发' },
]

const typeColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const typeData = [
  { name: 'label', type: 'string', desc: '选项显示文本' },
  { name: 'value', type: 'string | number', desc: '选项值' },
  { name: 'disabled', type: 'boolean', desc: '是否禁用该选项' },
]
</script>

<style scoped>
.doc-page__result {
  margin-top: 8px;
  font-size: 13px;
  color: var(--n-color-text-secondary);
}
</style>
