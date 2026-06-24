<template>
  <div class="doc-page">
    <h1>Dropdown 下拉菜单</h1>
    <p class="doc-page__desc">向下弹出的列表，用于承载更多的操作或选项。支持悬停/点击触发、图标、分割线、禁用项、危险操作、多方向弹出等。</p>

    <!-- ────── 综合演示 ────── -->
    <DemoBlock
      title="综合演示"
      description="一个完整的用户操作下拉菜单，展示图标、分割线、禁用项、危险操作等多种特性组合使用。"
      :code="combinedCode"
    >
      <NDropdown :items="combinedItems" @select="onSelect">
        <template #trigger>
          <NButton>
            <template #icon><NIcon name="shequ" /></template>
            用户中心
          </NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 items 定义菜单项，默认悬停触发。" :code="basicCode">
      <NDropdown :items="basicItems" @select="onSelect">
        <template #trigger>
          <NButton>下拉菜单</NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <!-- ────── 触发方式 ────── -->
    <DemoBlock title="触发方式" description="支持 hover（悬停）和 click（点击）两种触发方式。" :code="triggerCode">
      <NSpace>
        <NDropdown :items="basicItems" trigger="hover" @select="onSelect">
          <template #trigger>
            <NButton>悬停触发</NButton>
          </template>
        </NDropdown>
        <NDropdown :items="basicItems" trigger="click" @select="onSelect">
          <template #trigger>
            <NButton variant="outline">点击触发</NButton>
          </template>
        </NDropdown>
      </NSpace>
    </DemoBlock>

    <!-- ────── 带图标菜单 ────── -->
    <DemoBlock title="带图标菜单" description="菜单项通过 icon 字段指定图标名称，图标使用 NIcon 组件渲染。" :code="iconCode">
      <NDropdown :items="iconItems" @select="onSelect">
        <template #trigger>
          <NButton variant="outline">
            <template #icon><NIcon name="gengduo" /></template>
            更多操作
          </NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <!-- ────── 分割线与禁用项 ────── -->
    <DemoBlock title="分割线与禁用项" description="通过 divider: true 添加分割线，通过 disabled: true 禁用菜单项。" :code="dividerCode">
      <NDropdown :items="dividerItems" @select="onSelect">
        <template #trigger>
          <NButton variant="outline">
            <template #icon><NIcon name="shezhi" /></template>
            设置
          </NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <!-- ────── 危险操作 ────── -->
    <DemoBlock title="危险操作" description="菜单项设置 danger: true 标记为危险操作，显示为红色。" :code="dangerCode">
      <NDropdown :items="dangerItems" @select="onSelect">
        <template #trigger>
          <NButton variant="danger">危险操作</NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <!-- ────── 弹出位置 ────── -->
    <DemoBlock title="弹出位置" description="通过 placement 设置弹出方向，支持上、下方向及左、中、右对齐。" :code="placementCode">
      <NSpace wrap>
        <NDropdown :items="basicItems" placement="top-start" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">上左</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="top" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">上中</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="top-end" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">上右</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="bottom-start" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">下左</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="bottom" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">下中</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="bottom-end" @select="onSelect">
          <template #trigger><NButton size="sm" variant="outline">下右</NButton></template>
        </NDropdown>
      </NSpace>
    </DemoBlock>

    <!-- ────── 自定义触发元素 ────── -->
    <DemoBlock title="自定义触发元素" description="通过 #trigger 插槽自定义触发元素，可以是文字、图标等任意内容。" :code="customTriggerCode">
      <NSpace>
        <NDropdown :items="basicItems" trigger="click" @select="onSelect">
          <template #trigger>
            <NButton circle variant="outline">
              <template #icon><NIcon name="gengduo" /></template>
            </NButton>
          </template>
        </NDropdown>
        <NDropdown :items="basicItems" trigger="click" @select="onSelect">
          <template #trigger>
            <span style="color: var(--n-color-primary); cursor: pointer; font-size: 14px;">
              点击展开 <NIcon name="xiaoshi" size="12" />
            </span>
          </template>
        </NDropdown>
      </NSpace>
    </DemoBlock>

    <!-- ────── 事件回调 ────── -->
    <DemoBlock title="事件回调" description="选择菜单项时触发 select 事件，返回 key 和完整菜单项数据。" :code="eventCode">
      <NDropdown :items="eventItems" @select="onEventSelect">
        <template #trigger>
          <NButton variant="outline">选择操作</NButton>
        </template>
      </NDropdown>
      <p v-if="lastSelect" style="margin-top:8px;font-size:13px;color:var(--n-color-text-secondary);">
        当前选中：key = {{ lastSelect.key }}，label = {{ lastSelect.label }}
      </p>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="DropdownItem" :columns="propColumns" :data="itemData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

function onSelect(key: any, item: any) {
  console.log('select', key, item)
}

/* ── 菜单数据 ── */
const basicItems = [
  { label: '新建文件', key: 'new' },
  { label: '打开文件', key: 'open' },
  { label: '保存', key: 'save' },
]

const combinedItems = [
  { label: '个人中心', key: 'profile', icon: 'shequ' },
  { label: '我的订单', key: 'orders', icon: 'dingdan' },
  { label: '消息通知', key: 'messages', icon: 'xiaoxi' },
  { divider: true },
  { label: '账号设置', key: 'settings', icon: 'shezhi' },
  { label: '帮助中心', key: 'help', icon: 'bangzhu' },
  { divider: true },
  { label: '退出登录', key: 'logout', danger: true },
]

const iconItems = [
  { label: '新建', key: 'new', icon: 'chuangzuo' },
  { label: '编辑', key: 'edit', icon: 'bianji' },
  { label: '复制', key: 'copy', icon: 'fuzhi' },
  { label: '下载', key: 'download', icon: 'xiazai' },
  { divider: true },
  { label: '删除', key: 'delete', danger: true, icon: 'shanchu' },
]

const dividerItems = [
  { label: '个人资料', key: 'profile' },
  { label: '账号安全', key: 'security' },
  { divider: true },
  { label: '隐私设置', key: 'privacy' },
  { label: '通知设置', key: 'notifications' },
  { divider: true },
  { label: '已禁用项', key: 'disabled', disabled: true },
  { label: '退出', key: 'logout', danger: true },
]

const dangerItems = [
  { label: '编辑', key: 'edit' },
  { label: '复制', key: 'copy' },
  { divider: true },
  { label: '删除项目', key: 'delete', danger: true },
  { label: '清空数据', key: 'clear', danger: true },
]

const eventItems = [
  { label: '操作 A', key: 'a' },
  { label: '操作 B', key: 'b' },
  { label: '操作 C', key: 'c' },
]

const lastSelect = ref<{ key: any; label: string } | null>(null)
function onEventSelect(key: any, item: any) {
  lastSelect.value = { key, label: item.label }
}

/* ── 示例代码 ── */
const combinedCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton>
      <template #icon><NIcon name="yonghu" /></template>
      用户中心
    </NButton>
  </template>
</NDropdown>

const items = [
  { label: '个人中心', key: 'profile', icon: 'yonghu' },
  { label: '我的订单', key: 'orders', icon: 'dingdan' },
  { label: '消息通知', key: 'messages', icon: 'xiaoxi' },
  { divider: true },
  { label: '账号设置', key: 'settings', icon: 'shezhi' },
  { label: '帮助中心', key: 'help', icon: 'bangzhu' },
  { divider: true },
  { label: '退出登录', key: 'logout', danger: true },
]`

const basicCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton>下拉菜单</NButton>
  </template>
</NDropdown>

const items = [
  { label: '新建文件', key: 'new' },
  { label: '打开文件', key: 'open' },
  { label: '保存', key: 'save' },
]`

const triggerCode = `<!-- 悬停触发（默认） -->
<NDropdown :items="items" trigger="hover" @select="onSelect">
  <template #trigger>
    <NButton>悬停触发</NButton>
  </template>
</NDropdown>

<!-- 点击触发 -->
<NDropdown :items="items" trigger="click" @select="onSelect">
  <template #trigger>
    <NButton variant="outline">点击触发</NButton>
  </template>
</NDropdown>`

const iconCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton variant="outline">
      <template #icon><NIcon name="gengduo" /></template>
      更多操作
    </NButton>
  </template>
</NDropdown>

const items = [
  { label: '新建', key: 'new', icon: 'chuangzuo' },
  { label: '编辑', key: 'edit', icon: 'bianji' },
  { label: '复制', key: 'copy', icon: 'fuzhi' },
  { label: '下载', key: 'download', icon: 'xiazai' },
  { divider: true },
  { label: '删除', key: 'delete', danger: true, icon: 'shanchu' },
]`

const dividerCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton variant="outline">
      <template #icon><NIcon name="shezhi" /></template>
      设置
    </NButton>
  </template>
</NDropdown>

const items = [
  { label: '个人资料', key: 'profile' },
  { label: '账号安全', key: 'security' },
  { divider: true },
  { label: '隐私设置', key: 'privacy' },
  { label: '通知设置', key: 'notifications' },
  { divider: true },
  { label: '已禁用项', key: 'disabled', disabled: true },
  { label: '退出', key: 'logout', danger: true },
]`

const dangerCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton variant="danger">危险操作</NButton>
  </template>
</NDropdown>

const items = [
  { label: '编辑', key: 'edit' },
  { label: '复制', key: 'copy' },
  { divider: true },
  { label: '删除项目', key: 'delete', danger: true },
  { label: '清空数据', key: 'clear', danger: true },
]`

const placementCode = `<NDropdown :items="items" placement="top-start">
  <template #trigger><NButton size="sm" variant="outline">上左</NButton></template>
</NDropdown>
<NDropdown :items="items" placement="top">
  <template #trigger><NButton size="sm" variant="outline">上中</NButton></template>
</NDropdown>
<NDropdown :items="items" placement="top-end">
  <template #trigger><NButton size="sm" variant="outline">上右</NButton></template>
</NDropdown>
<NDropdown :items="items" placement="bottom-start">
  <template #trigger><NButton size="sm" variant="outline">下左</NButton></template>
</NDropdown>
<NDropdown :items="items" placement="bottom">
  <template #trigger><NButton size="sm" variant="outline">下中</NButton></template>
</NDropdown>
<NDropdown :items="items" placement="bottom-end">
  <template #trigger><NButton size="sm" variant="outline">下右</NButton></template>
</NDropdown>`

const customTriggerCode = `<!-- 圆形图标按钮触发 -->
<NDropdown :items="items" trigger="click" @select="onSelect">
  <template #trigger>
    <NButton circle variant="outline">
      <template #icon><NIcon name="gengduo" /></template>
    </NButton>
  </template>
</NDropdown>

<!-- 文字链接触发 -->
<NDropdown :items="items" trigger="click" @select="onSelect">
  <template #trigger>
    <span style="color: var(--n-color-primary); cursor: pointer;">
      点击展开 <NIcon name="xiaoshi" size="12" />
    </span>
  </template>
</NDropdown>`

const eventCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton variant="outline">选择操作</NButton>
  </template>
</NDropdown>

function onSelect(key, item) {
  console.log('选中：', key, item.label)
}`

/* ── API 表格 ── */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'items', type: 'DropdownItem[]', default: '—', desc: '菜单项数据（必填）' },
  { name: 'trigger', type: "'hover' | 'click'", default: "'hover'", desc: '触发方式' },
  { name: 'placement', type: "'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end'", default: "'bottom-start'", desc: '弹出位置' },
]

const itemData = [
  { name: 'label', type: 'string', default: '—', desc: '菜单项文本（必填）' },
  { name: 'key', type: 'string | number', default: '—', desc: '菜单项唯一标识，用于 select 事件回调' },
  { name: 'icon', type: 'string', default: '—', desc: '图标名称（NIcon name）' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'danger', type: 'boolean', default: 'false', desc: '是否为危险操作样式（红色）' },
  { name: 'divider', type: 'boolean', default: 'false', desc: '是否为分割线（设置后 label 无效）' },
]

const eventData = [
  { name: 'select', type: '(key: string | number | undefined, item: DropdownItem) => void', desc: '点击菜单项时触发' },
]

const slotData = [
  { name: 'trigger', desc: '触发元素插槽' },
]
</script>
