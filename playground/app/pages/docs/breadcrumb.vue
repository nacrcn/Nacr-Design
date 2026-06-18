<template>
  <div class="doc-page">
    <h1>Breadcrumb 面包屑</h1>
    <p class="doc-page__desc">显示当前页面在系统层级结构中的位置，并可向上导航。</p>

    <DemoBlock title="基础用法" description="通过 items 定义面包屑路径。" :code="basicCode">
      <NBreadcrumb :items="basicItems" />
    </DemoBlock>

    <DemoBlock title="带图标的面包屑" description="每一项可以设置 icon 属性展示图标。" :code="iconCode">
      <NBreadcrumb :items="iconItems" />
    </DemoBlock>

    <DemoBlock title="自定义分隔符" description="通过 separator 插槽自定义分隔符。" :code="separatorCode">
      <NBreadcrumb :items="basicItems">
        <template #separator>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
        </template>
      </NBreadcrumb>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicItems = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/docs/button' },
  { label: '面包屑' },
]

const iconItems = [
  { label: '首页', icon: 'home', href: '/' },
  { label: '组件', icon: 'layers', href: '/docs/button' },
  { label: '面包屑', icon: 'navigation' },
]

const basicCode = `<NBreadcrumb :items="[
  { label: '首页', href: '/' },
  { label: '组件', href: '/docs/button' },
  { label: '面包屑' },
]" />`

const iconCode = `<NBreadcrumb :items="[
  { label: '首页', icon: 'home' },
  { label: '组件', icon: 'layers' },
  { label: '面包屑', icon: 'navigation' },
]" />`

const separatorCode = `<NBreadcrumb :items="items">
  <template #separator>
    <svg ...>...</svg>
  </template>
</NBreadcrumb>`

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
  { name: 'items', type: 'BreadcrumbItem[]', default: '—', desc: '面包屑数据（必填）' },
]

const eventData = [
  { name: 'select', type: '(index: number) => void', desc: '点击面包屑项时触发' },
]

const slotData = [
  { name: 'separator', desc: '自定义分隔符' },
]
</script>
