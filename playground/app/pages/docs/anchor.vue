<template>
  <div class="doc-page">
    <h1>Anchor 锚点</h1>
    <p class="doc-page__desc">用于跳转到页面指定位置，常用于文档页面的目录导航。</p>

    <DemoBlock title="基础用法" description="通过 items 定义锚点列表，点击可平滑滚动到对应位置。" :code="basicCode">
      <NAnchor :items="anchorItems" :offset-top="80" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const anchorItems = [
  { href: '#h1-anchor', title: '锚点1' },
  { href: '#h2-anchor', title: '锚点2', children: [
    { href: '#h2-1-anchor', title: '子锚点1' },
    { href: '#h2-2-anchor', title: '子锚点2' },
  ]},
  { href: '#h3-anchor', title: '锚点3' },
]

const basicCode = `<NAnchor :items="items" :offset-top="80" />
// items: [{ href: '#section1', title: '章节1', children?: [...] }]`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'items', type: 'AnchorItem[]', default: '—', desc: '锚点数据，必填' },
  { name: 'offsetTop', type: 'number', default: '0', desc: '滚动偏移量(px)' },
]
</script>
