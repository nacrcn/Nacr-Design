<template>
  <div class="doc-page">
    <h1>Tabs 标签页</h1>
    <p class="doc-page__desc">选项卡切换组件，用于在不同的内容面板之间进行切换。</p>

    <DemoBlock title="基础用法" description="通过 tabs 定义选项卡，v-model 绑定当前激活项的 key。" :code="basicCode">
      <NTabs v-model="basicActive" :tabs="basicTabs" />
      <div style="padding:8px 0;color:var(--n-color-text-secondary);font-size:var(--n-font-size-sm);">当前面板：{{ basicActive }}</div>
    </DemoBlock>

    <DemoBlock title="卡片类型" description="设置 type='card' 使用卡片样式标签页。" :code="cardCode">
      <NTabs v-model="cardActive" type="card" :tabs="cardTabs" />
    </DemoBlock>

    <DemoBlock title="分段控制器" description="设置 type='segment' 使用分段控制器样式，适合少数选项快速切换。" :code="segmentCode">
      <NTabs v-model="segmentActive" type="segment" :tabs="segmentTabs" />
    </DemoBlock>

    <DemoBlock title="带图标" description="通过 icon 字段为标签页添加内置图标。" :code="iconCode">
      <NTabs v-model="iconActive" :tabs="iconTabs" />
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="设置 size 使用不同大小的标签页。" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NTabs v-model="sizeActive" size="sm" :tabs="sizeTabs" />
        <NTabs v-model="sizeActive" size="md" :tabs="sizeTabs" />
        <NTabs v-model="sizeActive" size="lg" :tabs="sizeTabs" />
      </div>
    </DemoBlock>

    <DemoBlock title="可关闭 & 可新增" description="设置 closable 显示关闭按钮，设置 addable 显示新增按钮。" :code="closableCode">
      <NTabs v-model="closableActive" type="card" closable addable :tabs="closableTabs" @close="onClose" @add="onAdd" />
      <div style="padding:8px 0;color:var(--n-color-text-secondary);font-size:var(--n-font-size-sm);">
        close 事件：{{ closeMsg }}<br />add 事件：{{ addMsg }}
      </div>
    </DemoBlock>

    <DemoBlock title="禁用标签" description="通过 disabled 字段禁用某个标签页。" :code="disabledCode">
      <NTabs v-model="disabledActive" :tabs="disabledTabs" />
    </DemoBlock>

    <DemoBlock title="左侧位置" description="设置 position='left' 使标签页在左侧展示。" :code="leftCode">
      <NTabs v-model="leftActive" position="left" :tabs="leftTabs" />
    </DemoBlock>

    <DemoBlock title="右侧位置" description="设置 position='right' 使标签页在右侧展示。" :code="rightCode">
      <NTabs v-model="rightActive" position="right" :tabs="rightTabs" />
    </DemoBlock>

    <DemoBlock title="滚动导航" description="当标签页数量超出容器宽度时，自动出现左右滚动按钮。" :code="scrollCode">
      <div style="max-width:420px;">
        <NTabs v-model="scrollActive" :tabs="scrollTabs" />
      </div>
    </DemoBlock>

    <DemoBlock title="事件回调" description="监听 change 与 close 事件。" :code="eventCode">
      <NTabs v-model="eventActive" type="card" closable :tabs="eventTabs" @change="onChange" @close="onEventClose" />
      <div style="padding:8px 0;color:var(--n-color-text-secondary);font-size:var(--n-font-size-sm);">
        change 事件：{{ eventChangeMsg }}<br />close 事件：{{ eventCloseMsg }}
      </div>
    </DemoBlock>

    <DemoBlock title="面板内容" description="通过 default 插槽配合 NTabsPanel 组件，为每个标签页渲染对应的面板内容。NTabsPanel 的 active 属性跟随当前激活的 key。" :code="panelCode">
      <NTabs v-model="panelActive" :tabs="panelTabs">
        <NTabsPanel :active="panelActive === 'info'">
          <p style="margin:0;color:var(--n-color-text-secondary);">这里是「个人信息」面板的内容区域。</p>
        </NTabsPanel>
        <NTabsPanel :active="panelActive === 'security'">
          <p style="margin:0;color:var(--n-color-text-secondary);">这里是「安全设置」面板的内容区域。</p>
        </NTabsPanel>
        <NTabsPanel :active="panelActive === 'notify'">
          <p style="margin:0;color:var(--n-color-text-secondary);">这里是「通知偏好」面板的内容区域。</p>
        </NTabsPanel>
      </NTabs>
    </DemoBlock>

    <DemoBlock title="懒加载与强制渲染" description="默认情况下，未激活的 NTabsPanel 不会渲染 DOM（懒加载）。设置 forceRender 可强制渲染，保留面板状态（如表单输入内容不会丢失）。" :code="forceCode">
      <NTabs v-model="forceActive" :tabs="forceTabs">
        <NTabsPanel :active="forceActive === 'edit'" force-render>
          <NInput v-model="forceInputVal" placeholder="输入内容后切换标签页再回来，内容不会丢失" />
        </NTabsPanel>
        <NTabsPanel :active="forceActive === 'preview'">
          <p style="margin:0;color:var(--n-color-text-secondary);">预览面板：{{ forceInputVal || '（暂无内容）' }}</p>
        </NTabsPanel>
      </NTabs>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="TabItem" :columns="itemColumns" :data="itemData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="TabsPanel Props" :columns="propColumns" :data="panelPropData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ===== 基础用法 =====
const basicActive = ref('tab1')
const basicTabs = [
  { key: 'tab1', label: '用户管理' },
  { key: 'tab2', label: '角色管理' },
  { key: 'tab3', label: '系统设置' },
]

const basicCode = `<template>
  <NTabs v-model="active" :tabs="[
    { key: 'tab1', label: '用户管理' },
    { key: 'tab2', label: '角色管理' },
    { key: 'tab3', label: '系统设置' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('tab1')
<\/script>`

// ===== 卡片类型 =====
const cardActive = ref('card1')
const cardTabs = [
  { key: 'card1', label: '概览' },
  { key: 'card2', label: '配置' },
  { key: 'card3', label: '日志' },
]

const cardCode = `<template>
  <NTabs v-model="active" type="card" :tabs="[
    { key: 'card1', label: '概览' },
    { key: 'card2', label: '配置' },
    { key: 'card3', label: '日志' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('card1')
<\/script>`

// ===== 分段控制器 =====
const segmentActive = ref('day')
const segmentTabs = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
]

const segmentCode = `<template>
  <NTabs v-model="active" type="segment" :tabs="[
    { key: 'day', label: '日' },
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
    { key: 'year', label: '年' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('day')
<\/script>`

// ===== 带图标 =====
const iconActive = ref('home')
const iconTabs = [
  { key: 'home', label: '首页', icon: 'shouye' },
  { key: 'search', label: '搜索', icon: 'sousuo' },
  { key: 'settings', label: '设置', icon: 'shezhi' },
  { key: 'profile', label: '我的', icon: 'wode' },
]

const iconCode = `<template>
  <NTabs v-model="active" :tabs="[
    { key: 'home', label: '首页', icon: 'shouye' },
    { key: 'search', label: '搜索', icon: 'sousuo' },
    { key: 'settings', label: '设置', icon: 'shezhi' },
    { key: 'profile', label: '我的', icon: 'wode' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('home')
<\/script>`

// ===== 不同尺寸 =====
const sizeActive = ref('s1')
const sizeTabs = [
  { key: 's1', label: '选项一' },
  { key: 's2', label: '选项二' },
  { key: 's3', label: '选项三' },
]

const sizeCode = `<template>
  <NTabs v-model="active" size="sm" :tabs="tabs" />
  <NTabs v-model="active" size="md" :tabs="tabs" />
  <NTabs v-model="active" size="lg" :tabs="tabs" />
</template>

<script setup lang="ts">
const active = ref('s1')
const tabs = [
  { key: 's1', label: '选项一' },
  { key: 's2', label: '选项二' },
  { key: 's3', label: '选项三' },
]
<\/script>`

// ===== 可关闭 & 可新增 =====
const closableActive = ref('c1')
const closableTabs = ref([
  { key: 'c1', label: '标签一' },
  { key: 'c2', label: '标签二' },
  { key: 'c3', label: '标签三' },
])
const closeMsg = ref('')
const addMsg = ref('')

function onClose(key: string) {
  closeMsg.value = `已关闭 ${key}`
  closableTabs.value = closableTabs.value.filter(t => t.key !== key)
  if (closableActive.value === key && closableTabs.value.length > 0) {
    closableActive.value = closableTabs.value[0]?.key ?? ''
  }
}
function onAdd() {
  const newKey = `c${closableTabs.value.length + 1}`
  closableTabs.value.push({ key: newKey, label: `新标签 ${newKey}` })
  closableActive.value = newKey
  addMsg.value = `已新增 ${newKey}`
}

const closableCode = `<template>
  <NTabs
    v-model="active"
    type="card"
    closable
    addable
    :tabs="tabs"
    @close="onClose"
    @add="onAdd"
  />
</template>

<script setup lang="ts">
const active = ref('c1')
const tabs = ref([
  { key: 'c1', label: '标签一' },
  { key: 'c2', label: '标签二' },
  { key: 'c3', label: '标签三' },
])

function onClose(key: string) {
  tabs.value = tabs.value.filter(t => t.key !== key)
  if (active.value === key && tabs.value.length > 0) {
    active.value = tabs.value[0].key
  }
}

function onAdd() {
  const newKey = 'tab' + (tabs.value.length + 1)
  tabs.value.push({ key: newKey, label: '新标签' })
  active.value = newKey
}
<\/script>`

// ===== 禁用标签 =====
const disabledActive = ref('d1')
const disabledTabs = [
  { key: 'd1', label: '可用标签' },
  { key: 'd2', label: '禁用标签', disabled: true },
  { key: 'd3', label: '可用标签' },
]

const disabledCode = `<template>
  <NTabs v-model="active" :tabs="[
    { key: 'd1', label: '可用标签' },
    { key: 'd2', label: '禁用标签', disabled: true },
    { key: 'd3', label: '可用标签' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('d1')
<\/script>`

// ===== 左侧位置 =====
const leftActive = ref('l1')
const leftTabs = [
  { key: 'l1', label: '个人信息' },
  { key: 'l2', label: '安全设置' },
  { key: 'l3', label: '通知偏好' },
  { key: 'l4', label: '账户管理' },
]

const leftCode = `<template>
  <NTabs v-model="active" position="left" :tabs="[
    { key: 'l1', label: '个人信息' },
    { key: 'l2', label: '安全设置' },
    { key: 'l3', label: '通知偏好' },
    { key: 'l4', label: '账户管理' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('l1')
<\/script>`

// ===== 右侧位置 =====
const rightActive = ref('r1')
const rightTabs = [
  { key: 'r1', label: '项目概览' },
  { key: 'r2', label: '成员管理' },
  { key: 'r3', label: '权限配置' },
]

const rightCode = `<template>
  <NTabs v-model="active" position="right" :tabs="[
    { key: 'r1', label: '项目概览' },
    { key: 'r2', label: '成员管理' },
    { key: 'r3', label: '权限配置' },
  ]" />
</template>

<script setup lang="ts">
const active = ref('r1')
<\/script>`

// ===== 滚动导航 =====
const scrollActive = ref('t1')
const scrollTabs = Array.from({ length: 20 }, (_, i) => ({
  key: `t${i + 1}`,
  label: `标签 ${i + 1}`,
}))

const scrollCode = `<template>
  <div style="max-width:420px;">
    <NTabs v-model="active" :tabs="tabs" />
  </div>
</template>

<script setup lang="ts">
const active = ref('t1')
const tabs = Array.from({ length: 20 }, (_, i) => ({
  key: 't' + (i + 1),
  label: '标签 ' + (i + 1),
}))
<\/script>`

// ===== 事件回调 =====
const eventActive = ref('e1')
const eventTabs = [
  { key: 'e1', label: '选项一' },
  { key: 'e2', label: '选项二' },
  { key: 'e3', label: '选项三' },
]
const eventChangeMsg = ref('')
const eventCloseMsg = ref('')

function onChange(key: string) {
  eventChangeMsg.value = `切换到 ${key}`
}
function onEventClose(key: string) {
  eventCloseMsg.value = `关闭 ${key}`
}

const eventCode = `<template>
  <NTabs
    v-model="active"
    type="card"
    closable
    :tabs="tabs"
    @change="onChange"
    @close="onClose"
  />
</template>

<script setup lang="ts">
const active = ref('e1')
const tabs = [
  { key: 'e1', label: '选项一' },
  { key: 'e2', label: '选项二' },
  { key: 'e3', label: '选项三' },
]

function onChange(key: string) {
  console.log('切换到', key)
}
function onClose(key: string) {
  console.log('关闭', key)
}
<\/script>`

// ===== 面板内容 =====
const panelActive = ref('info')
const panelTabs = [
  { key: 'info', label: '个人信息' },
  { key: 'security', label: '安全设置' },
  { key: 'notify', label: '通知偏好' },
]

const panelCode = `<template>
  <NTabs v-model="active" :tabs="tabs">
    <NTabsPanel :active="active === 'info'">
      <p>个人信息面板内容</p>
    </NTabsPanel>
    <NTabsPanel :active="active === 'security'">
      <p>安全设置面板内容</p>
    </NTabsPanel>
    <NTabsPanel :active="active === 'notify'">
      <p>通知偏好面板内容</p>
    </NTabsPanel>
  </NTabs>
</template>

<script setup lang="ts">
const active = ref('info')
const tabs = [
  { key: 'info', label: '个人信息' },
  { key: 'security', label: '安全设置' },
  { key: 'notify', label: '通知偏好' },
]
<\/script>`

// ===== 懒加载与强制渲染 =====
const forceActive = ref('edit')
const forceTabs = [
  { key: 'edit', label: '编辑' },
  { key: 'preview', label: '预览' },
]
const forceInputVal = ref('')

const forceCode = `<template>
  <NTabs v-model="active" :tabs="tabs">
    <NTabsPanel :active="active === 'edit'" force-render>
      <NInput v-model="inputVal" placeholder="输入内容后切换标签页再回来，内容不会丢失" />
    </NTabsPanel>
    <NTabsPanel :active="active === 'preview'">
      <p>预览：{{ inputVal || '（暂无内容）' }}</p>
    </NTabsPanel>
  </NTabs>
</template>

<script setup lang="ts">
const active = ref('edit')
const inputVal = ref('')
const tabs = [
  { key: 'edit', label: '编辑' },
  { key: 'preview', label: '预览' },
]
<\/script>`
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string', default: '—', desc: '当前激活的 key（必填，支持 v-model）' },
  { name: 'tabs', type: 'TabItem[]', default: '—', desc: '选项卡数据（必填）' },
  { name: 'type', type: "'line' | 'card' | 'segment'", default: "'line'", desc: '标签页类型' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'position', type: "'top' | 'left' | 'right' | 'bottom'", default: "'top'", desc: '标签位置' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
  { name: 'addable', type: 'boolean', default: 'false', desc: '是否可新增' },
  { name: 'animated', type: 'boolean', default: 'true', desc: '是否启用切换动画' },
]

const itemColumns = [
  { key: 'name', title: '字段', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const itemData = [
  { name: 'key', type: 'string', default: '—', desc: '唯一标识（必填）' },
  { name: 'label', type: 'string', default: '—', desc: '标签文字（必填）' },
  { name: 'icon', type: 'string', default: '—', desc: '内置图标名称（iconfont font_class）' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'closable', type: 'boolean', default: 'undefined', desc: '是否可关闭（为 undefined 时跟随父级 closable）' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(key: string) => void', desc: '激活项变化时触发（v-model）' },
  { name: 'change', type: '(key: string) => void', desc: '切换标签页时触发' },
  { name: 'close', type: '(key: string) => void', desc: '关闭标签时触发' },
  { name: 'add', type: '() => void', desc: '点击新增按钮时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '面板内容区域，配合 NTabsPanel 组件使用' },
]

const panelPropData = [
  { name: 'active', type: 'boolean', default: '—', desc: '是否为当前激活面板，通常写为 :active="currentKey === tabKey"' },
  { name: 'forceRender', type: 'boolean', default: 'false', desc: '强制渲染面板 DOM（即使未激活），用于保留表单等状态' },
]
</script>
