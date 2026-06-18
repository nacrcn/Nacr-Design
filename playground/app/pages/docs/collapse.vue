<template>
  <div class="doc-page">
    <h1>Collapse 折叠面板</h1>
    <p class="doc-page__desc">可以折叠/展开的内容区域，常用于分组复杂信息。</p>

    <DemoBlock title="基础用法" description="通过 items 传入面板数据。" :code="basicCode">
      <NCollapse :items="basicItems" />
    </DemoBlock>

    <DemoBlock title="手风琴模式" description="设置 accordion 后同一时刻只能展开一个面板。" :code="accordionCode">
      <NCollapse :items="basicItems" accordion />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicItems = [
  { title: '面板标题1', content: '这是面板1的内容。可以放置任意文本或说明信息。' },
  { title: '面板标题2', content: '这是面板2的内容。折叠面板可以同时展开多个。' },
  { title: '面板标题3', content: '这是面板3的内容。手风琴模式下只能展开一个。' },
]

const basicCode = `<NCollapse :items="items" />
// items: [{ title: '标题', content: '内容' }]`

const accordionCode = `<NCollapse :items="items" accordion />`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'items', type: 'CollapseItem[]', default: '—', desc: '面板数据，必填' },
  { name: 'accordion', type: 'boolean', default: 'false', desc: '是否为手风琴模式' },
]
</script>
