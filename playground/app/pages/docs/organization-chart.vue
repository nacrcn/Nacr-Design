<template>
  <div class="doc-page">
    <h1>OrganizationChart 组织架构图</h1>
    <p class="doc-page__desc">用于可视化展示层级组织数据，支持节点展开/折叠、自定义渲染、选中状态等。</p>

    <DemoBlock title="基础用法" description="通过 data 传入树形结构数据，默认展开全部节点。" :code="basicCode">
      <NOrganizationChart :data="basicData" />
    </DemoBlock>

    <DemoBlock title="自定义节点" description="通过 node 插槽自定义节点渲染内容。" :code="customCode">
      <NOrganizationChart :data="customData">
        <template #node="{ data: node }">
          <div style="text-align:center;">
            <div style="font-size:14px;font-weight:600;color:#1f2937;">{{ node.name }}</div>
            <div style="font-size:12px;color:#6b7280;">{{ node.title }}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px;">{{ node.dept }}</div>
          </div>
        </template>
      </NOrganizationChart>
    </DemoBlock>

    <DemoBlock title="可折叠" description="设置 collapsible 后节点下方出现展开/折叠按钮。" :code="collapsibleCode">
      <NOrganizationChart :data="basicData" collapsible />
    </DemoBlock>

    <DemoBlock title="选中节点" description="通过 v-model:selectedKey 绑定选中节点的 key。" :code="selectedCode">
      <NOrganizationChart :data="basicData" v-model:selectedKey="selectedKey" />
      <div style="margin-top:8px;font-size:13px;color:var(--n-color-text-secondary);">
        当前选中：{{ selectedKey ?? '未选中' }}
      </div>
    </DemoBlock>

    <DemoBlock title="默认展开指定节点" description="通过 default-expand-all=false + default-expanded-keys 控制初始展开。" :code="partialCode">
      <NOrganizationChart :data="basicData" :default-expand-all="false" :default-expanded-keys="['1']" />
    </DemoBlock>

    <DemoBlock title="方法调用" description="通过 ref 调用 expandAll / collapseAll 方法。" :code="methodCode">
      <NSpace style="margin-bottom:12px">
        <NButton size="sm" @click="chartRef?.expandAll()">展开全部</NButton>
        <NButton size="sm" @click="chartRef?.collapseAll()">折叠全部</NButton>
      </NSpace>
      <NOrganizationChart ref="chartRef" :data="basicData" collapsible :default-expand-all="false" :default-expanded-keys="['1']" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const _t = '<tem' + 'plate>'
const _te = '</tem' + 'plate>'

// ===== 基础用法 =====
const basicData = {
  key: '1',
  label: 'CEO',
  children: [
    {
      key: '2',
      label: 'CTO',
      children: [
        { key: '5', label: '前端团队' },
        { key: '6', label: '后端团队' },
      ],
    },
    {
      key: '3',
      label: 'CFO',
      children: [
        { key: '7', label: '财务部' },
      ],
    },
    {
      key: '4',
      label: 'COO',
      children: [
        { key: '8', label: '运营部' },
        { key: '9', label: '市场部' },
      ],
    },
  ],
}

const basicCode = `${_t}
  <NOrganizationChart :data="data" />
${_te}

` + '<scr' + 'ipt setup lang="ts">' + `
const data = {
  key: '1', label: 'CEO',
  children: [
    { key: '2', label: 'CTO', children: [{ key: '5', label: '前端团队' }, { key: '6', label: '后端团队' }] },
    { key: '3', label: 'CFO', children: [{ key: '7', label: '财务部' }] },
    { key: '4', label: 'COO', children: [{ key: '8', label: '运营部' }, { key: '9', label: '市场部' }] },
  ],
}
` + '</scr' + 'ipt>'

// ===== 自定义节点 =====
const customData = {
  key: '1',
  name: '张三',
  title: '首席执行官',
  dept: '总经办',
  children: [
    {
      key: '2', name: '李四', title: '技术总监', dept: '技术部',
      children: [
        { key: '5', name: '王五', title: '前端负责人', dept: '前端组' },
        { key: '6', name: '赵六', title: '后端负责人', dept: '后端组' },
      ],
    },
    {
      key: '3', name: '钱七', title: '财务总监', dept: '财务部',
      children: [
        { key: '7', name: '孙八', title: '会计', dept: '财务一组' },
      ],
    },
  ],
}

const customCode = `${_t}
  <NOrganizationChart :data="data">
    <template #node="{ data: node }">
      <div style="text-align:center;">
        <div style="font-weight:600;">{{ node.name }}</div>
        <div style="font-size:12px;color:#6b7280;">{{ node.title }}</div>
        <div style="font-size:11px;color:#9ca3af;">{{ node.dept }}</div>
      </div>
    </template>
  </NOrganizationChart>
${_te}`

// ===== 可折叠 =====
const collapsibleCode = `${_t}
  <NOrganizationChart :data="data" collapsible />
${_te}`

// ===== 选中 =====
const selectedKey = ref<string | number | null>(null)
const selectedCode = `${_t}
  <NOrganizationChart :data="data" v-model:selectedKey="selectedKey" />
  <div>当前选中：{{ selectedKey ?? '未选中' }}</div>
${_te}

` + '<scr' + 'ipt setup lang="ts">' + `
const selectedKey = ref(null)
` + '</scr' + 'ipt>'

// ===== 部分展开 =====
const partialCode = `${_t}
  <NOrganizationChart
    :data="data"
    :default-expand-all="false"
    :default-expanded-keys="['1']"
  />
${_te}`

// ===== 方法 =====
const chartRef = ref()
const methodCode = `${_t}
  <NSpace style="margin-bottom:12px">
    <NButton size="sm" @click="chartRef?.expandAll()">展开全部</NButton>
    <NButton size="sm" @click="chartRef?.collapseAll()">折叠全部</NButton>
  </NSpace>
  <NOrganizationChart
    ref="chartRef"
    :data="data"
    collapsible
    :default-expand-all="false"
    :default-expanded-keys="['1']"
  />
${_te}

` + '<scr' + 'ipt setup lang="ts">' + `
const chartRef = ref()
` + '</scr' + 'ipt>'

// ===== API =====
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'data', type: 'object', default: '-', desc: '组织架构树形数据，每节点至少包含 key 和 label 字段' },
  { name: 'labelKey', type: 'string', default: "'label'", desc: '节点显示文本对应的字段名' },
  { name: 'childrenKey', type: 'string', default: "'children'", desc: '子节点列表对应的字段名' },
  { name: 'nodeKey', type: 'string', default: "'key'", desc: '节点唯一标识字段名' },
  { name: 'defaultExpandAll', type: 'boolean', default: 'true', desc: '是否默认展开全部节点' },
  { name: 'defaultExpandedKeys', type: '(string | number)[]', default: '[]', desc: '默认展开的节点 key 列表（defaultExpandAll=false 时生效）' },
  { name: 'collapsible', type: 'boolean', default: 'true', desc: '是否允许折叠/展开子节点' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: '布局方向' },
  { name: 'selectedKey', type: 'string | number | null', default: 'null', desc: '选中节点的 key，支持 v-model' },
  { name: 'nodeClass', type: 'string | object | array', default: '-', desc: '节点卡片的自定义 class' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '回调参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'node-click', type: '(node: object)', desc: '点击节点时触发' },
  { name: 'update:selectedKey', type: '(key: string | number | null)', desc: '选中节点变化时触发' },
  { name: 'expand', type: '(keys: (string | number)[])', desc: '展开节点后触发，参数为当前所有展开 key' },
  { name: 'collapse', type: '(node: object)', desc: '折叠节点后触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'expandAll', type: '()', desc: '展开所有节点' },
  { name: 'collapseAll', type: '()', desc: '折叠所有节点' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'node', type: '{ data, expanded, selected }', desc: '自定义整个节点内容' },
  { name: 'label', type: '{ data }', desc: '自定义节点文本' },
  { name: 'expand-icon', type: '{ expanded }', desc: '自定义展开/折叠图标' },
]
</script>
