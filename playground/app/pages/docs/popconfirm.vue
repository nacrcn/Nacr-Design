<template>
  <div class="doc-page">
    <h1>Popconfirm 气泡确认框</h1>
    <p class="doc-page__desc">
      点击元素弹出气泡确认框，替代 confirm() 弹窗，常用于二次确认操作。支持 4 个弹出方向和危险模式。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="点击触发确认气泡，点击确定或取消执行对应操作。" :code="basicCode">
      <NPopconfirm content="确定删除这项内容吗？" @confirm="handleConfirm" @cancel="handleCancel">
        <NButton variant="danger">删除</NButton>
      </NPopconfirm>
      <p v-if="action" style="margin-top:8px;color:var(--n-color-text-secondary);">最近操作：{{ action }}</p>
    </DemoBlock>

    <!-- ────── 不同方向 ────── -->
    <DemoBlock title="不同方向" description="通过 placement 设置弹出方向：top / bottom / left / right。" :code="posCode">
      <NSpace>
        <NPopconfirm content="顶部确认" placement="top"><NButton size="sm">Top</NButton></NPopconfirm>
        <NPopconfirm content="底部确认" placement="bottom"><NButton size="sm">Bottom</NButton></NPopconfirm>
        <NPopconfirm content="左侧确认" placement="left"><NButton size="sm">Left</NButton></NPopconfirm>
        <NPopconfirm content="右侧确认" placement="right"><NButton size="sm">Right</NButton></NPopconfirm>
      </NSpace>
    </DemoBlock>

    <!-- ────── 危险确认 ────── -->
    <DemoBlock title="危险确认" description="设置 danger 属性使确定按钮显示为红色危险样式，适用于删除等操作。" :code="dangerCode">
      <NPopconfirm content="此操作不可逆，确定要继续吗？" danger @confirm="handleDangerConfirm" @cancel="handleDangerCancel">
        <NButton variant="danger">危险操作</NButton>
      </NPopconfirm>
      <p v-if="dangerAction" style="margin-top:8px;color:var(--n-color-text-secondary);">最近操作：{{ dangerAction }}</p>
    </DemoBlock>

    <!-- ────── 点击外部关闭 ────── -->
    <DemoBlock title="点击外部关闭" description="展开气泡后，点击气泡或触发元素以外的区域自动关闭。" :code="outsideCode">
      <NPopconfirm content="点击任意空白处试试">
        <NButton variant="secondary">点击展开</NButton>
      </NPopconfirm>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const action = ref('')
const dangerAction = ref('')

function handleConfirm() { action.value = '确认' }
function handleCancel() { action.value = '取消' }
function handleDangerConfirm() { dangerAction.value = '危险确认' }
function handleDangerCancel() { dangerAction.value = '取消' }

const basicCode = `<NPopconfirm content="确定删除吗？" @confirm="onConfirm" @cancel="onCancel">
  <NButton variant="danger">删除</NButton>
</NPopconfirm>`

const posCode = `<NPopconfirm content="确认" placement="top"><NButton>Top</NButton></NPopconfirm>
<NPopconfirm content="确认" placement="bottom"><NButton>Bottom</NButton></NPopconfirm>
<NPopconfirm content="确认" placement="left"><NButton>Left</NButton></NPopconfirm>
<NPopconfirm content="确认" placement="right"><NButton>Right</NButton></NPopconfirm>`

const dangerCode = `<NPopconfirm content="此操作不可逆，确定继续吗？" danger @confirm="onConfirm" @cancel="onCancel">
  <NButton variant="danger">危险操作</NButton>
</NPopconfirm>`

const outsideCode = `<NPopconfirm content="点击任意空白处试试">
  <NButton variant="secondary">点击展开</NButton>
</NPopconfirm>`

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
  { name: 'content', type: 'string', default: "'确定执行此操作？'", desc: '确认框内容文案' },
  { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", desc: '气泡弹出方向' },
  { name: 'danger', type: 'boolean', default: 'false', desc: '是否为危险模式（确定按钮变红）' },
]

const eventData = [
  { name: 'confirm', type: '() => void', desc: '点击确定时触发' },
  { name: 'cancel', type: '() => void', desc: '点击取消时触发' },
]

const slotData = [
  { name: 'default', desc: '触发元素' },
]
</script>
