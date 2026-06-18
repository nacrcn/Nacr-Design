<template>
  <div class="doc-page">
    <h1>Dropdown 下拉菜单</h1>
    <p class="doc-page__desc">向下弹出的列表，用于承载更多的操作或选项。</p>

    <DemoBlock title="基础用法" description="通过 items 定义菜单项，支持悬停和点击触发。" :code="basicCode">
      <NDropdown :items="basicItems" @select="onSelect">
        <template #trigger>
          <NButton>下拉菜单</NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <DemoBlock title="触发方式" description="支持 hover 和 click 两种触发方式。" :code="triggerCode">
      <NSpace>
        <NDropdown :items="basicItems" trigger="hover" @select="onSelect">
          <template #trigger>
            <NButton>悬停触发</NButton>
          </template>
        </NDropdown>
        <NDropdown :items="basicItems" trigger="click" @select="onSelect">
          <template #trigger>
            <NButton>点击触发</NButton>
          </template>
        </NDropdown>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="带图标和分割线" description="菜单项可设置 icon、danger、disabled、divider。" :code="iconCode">
      <NDropdown :items="iconItems" @select="onSelect">
        <template #trigger>
          <NButton>更多操作</NButton>
        </template>
      </NDropdown>
    </DemoBlock>

    <DemoBlock title="弹出位置" description="通过 placement 设置弹出方向。" :code="placementCode">
      <NSpace>
        <NDropdown :items="basicItems" placement="bottom-start" @select="onSelect">
          <template #trigger><NButton size="sm">下左</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="bottom" @select="onSelect">
          <template #trigger><NButton size="sm">下中</NButton></template>
        </NDropdown>
        <NDropdown :items="basicItems" placement="bottom-end" @select="onSelect">
          <template #trigger><NButton size="sm">下右</NButton></template>
        </NDropdown>
      </NSpace>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

function onSelect(key: any, item: any) {
  console.log('select', key, item)
}

const basicItems = [
  { label: '新建', key: 'new' },
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete', danger: true },
]

const iconItems = [
  { label: '新建', key: 'new', icon: 'plus' },
  { label: '编辑', key: 'edit', icon: 'edit' },
  { label: '复制', key: 'copy', icon: 'copy' },
  { divider: true },
  { label: '删除', key: 'delete', danger: true, icon: 'trash' },
  { label: '禁用项', key: 'disabled', disabled: true },
]

const basicCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton>下拉菜单</NButton>
  </template>
</NDropdown>`

const triggerCode = `<NDropdown :items="items" trigger="hover">...</NDropdown>
<NDropdown :items="items" trigger="click">...</NDropdown>`

const iconCode = `<NDropdown :items="items" @select="onSelect">
  <template #trigger>
    <NButton>更多操作</NButton>
  </template>
</NDropdown>`

const placementCode = `<NDropdown :items="items" placement="bottom-start">...</NDropdown>`

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

const eventData = [
  { name: 'select', type: '(key: string | number | undefined, item: DropdownItem) => void', desc: '点击菜单项时触发' },
]

const slotData = [
  { name: 'trigger', desc: '触发元素' },
]
</script>
