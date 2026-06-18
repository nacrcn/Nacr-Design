<template>
  <div class="doc-page">
    <h1>Grid 栅格</h1>
    <p class="doc-page__desc">24 栏栅格布局系统，通过 NGrid 与 NGridItem 组合使用。</p>

    <DemoBlock title="基础用法" description="使用 cols 指定总列数，span 指定每项占几列。" :code="basicCode">
      <NGrid :cols="4" :gap="12">
        <NGridItem v-for="i in 4" :key="i" :span="1">
          <div class="grid-demo-cell">{{ i }}</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <DemoBlock title="不同跨度" description="通过 span 属性控制每项占用的列数。" :code="spanCode">
      <NGrid :cols="12" :gap="12">
        <NGridItem :span="8">
          <div class="grid-demo-cell">8/12</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4/12</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4/12</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4/12</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4/12</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <DemoBlock title="带偏移" description="使用 offset 设置偏移列数。" :code="offsetCode">
      <NGrid :cols="6" :gap="12">
        <NGridItem :span="2" :offset="2">
          <div class="grid-demo-cell">offset 2</div>
        </NGridItem>
        <NGridItem :span="2">
          <div class="grid-demo-cell">span 2</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <ApiTable title="NGrid Props" :columns="propColumns" :data="gridPropData" />
    <ApiTable title="NGridItem Props" :columns="propColumns" :data="itemPropData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<NGrid :cols="4" :gap="12">
  <NGridItem v-for="i in 4" :key="i" :span="1">
    <div>{{ i }}</div>
  </NGridItem>
</NGrid>`

const spanCode = `<NGrid :cols="12" :gap="12">
  <NGridItem :span="8">8/12</NGridItem>
  <NGridItem :span="4">4/12</NGridItem>
</NGrid>`

const offsetCode = `<NGrid :cols="6" :gap="12">
  <NGridItem :span="2" :offset="2">offset 2</NGridItem>
  <NGridItem :span="2">span 2</NGridItem>
</NGrid>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const gridPropData = [
  { name: 'cols', type: 'number', default: '24', desc: '栅格列数' },
  { name: 'gap', type: 'number', default: '0', desc: '间距(px)' },
  { name: 'gutter', type: 'boolean', default: 'false', desc: '是否显示内边距' },
]

const itemPropData = [
  { name: 'span', type: 'number', default: '1', desc: '占用列数' },
  { name: 'offset', type: 'number', default: '0', desc: '偏移列数' },
]
</script>

<style scoped>
.grid-demo-cell {
  padding: 12px 0;
  text-align: center;
  background: var(--n-color-primary-light);
  color: var(--n-color-primary);
  border-radius: var(--n-radius-md);
  font-size: var(--n-font-size-sm);
}
</style>
