<template>
  <div class="doc-page">
    <h1>Grid 栅格</h1>
    <p class="doc-page__desc">24 栏栅格布局系统，通过 NGrid 与 NGridItem 组合使用，灵活控制列宽、偏移与间距。</p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="使用 cols 指定总列数，span 指定每项占几列。" :code="basicCode">
      <NGrid :cols="4" :gap="12">
        <NGridItem v-for="i in 4" :key="i" :span="1">
          <div class="grid-demo-cell">{{ i }}</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <!-- ────── 不同跨度 ────── -->
    <DemoBlock title="不同跨度" description="通过 span 属性控制每项占用的列数，实现不等宽布局。" :code="spanCode">
      <NGrid :cols="12" :gap="12">
        <NGridItem :span="8">
          <div class="grid-demo-cell">8/12</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4/12</div>
        </NGridItem>
      </NGrid>
      <NGrid :cols="12" :gap="12" style="margin-top:12px">
        <NGridItem :span="6">
          <div class="grid-demo-cell">6/12</div>
        </NGridItem>
        <NGridItem :span="6">
          <div class="grid-demo-cell">6/12</div>
        </NGridItem>
      </NGrid>
      <NGrid :cols="12" :gap="12" style="margin-top:12px">
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

    <!-- ────── 24栏栅格 ────── -->
    <DemoBlock title="24 栏栅格" description="默认 24 列，可精确控制任意比例的列宽布局。" :code="cols24Code">
      <NGrid :cols="24" :gap="8">
        <NGridItem :span="12">
          <div class="grid-demo-cell">12</div>
        </NGridItem>
        <NGridItem :span="12">
          <div class="grid-demo-cell">12</div>
        </NGridItem>
      </NGrid>
      <NGrid :cols="24" :gap="8" style="margin-top:8px">
        <NGridItem :span="6">
          <div class="grid-demo-cell">6</div>
        </NGridItem>
        <NGridItem :span="6">
          <div class="grid-demo-cell">6</div>
        </NGridItem>
        <NGridItem :span="6">
          <div class="grid-demo-cell">6</div>
        </NGridItem>
        <NGridItem :span="6">
          <div class="grid-demo-cell">6</div>
        </NGridItem>
      </NGrid>
      <NGrid :cols="24" :gap="8" style="margin-top:8px">
        <NGridItem :span="4">
          <div class="grid-demo-cell">4</div>
        </NGridItem>
        <NGridItem :span="16">
          <div class="grid-demo-cell">16</div>
        </NGridItem>
        <NGridItem :span="4">
          <div class="grid-demo-cell">4</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <!-- ────── 带偏移 ────── -->
    <DemoBlock title="偏移" description="使用 offset 设置偏移列数，将元素向右推指定列数。" :code="offsetCode">
      <NGrid :cols="6" :gap="12">
        <NGridItem :span="2" :offset="2">
          <div class="grid-demo-cell">offset 2</div>
        </NGridItem>
        <NGridItem :span="2">
          <div class="grid-demo-cell">span 2</div>
        </NGridItem>
      </NGrid>
      <NGrid :cols="8" :gap="12" style="margin-top:12px">
        <NGridItem :span="4" :offset="4">
          <div class="grid-demo-cell">offset 4, span 4</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <!-- ────── 行列间距 ────── -->
    <DemoBlock title="行列间距" description="gap 可以是数字（行列相同）或数组 [rowGap, colGap] 分别控制行列间距。" :code="gapCode">
      <NGrid :cols="3" :gap="[16, 24]">
        <NGridItem v-for="i in 6" :key="i" :span="1">
          <div class="grid-demo-cell">item {{ i }}</div>
        </NGridItem>
      </NGrid>
    </DemoBlock>

    <!-- ────── API ────── -->
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
</NGrid>
<NGrid :cols="12" :gap="12">
  <NGridItem :span="6">6/12</NGridItem>
  <NGridItem :span="6">6/12</NGridItem>
</NGrid>`

const cols24Code = `<NGrid :cols="24" :gap="8">
  <NGridItem :span="12">12</NGridItem>
  <NGridItem :span="12">12</NGridItem>
</NGrid>
<NGrid :cols="24" :gap="8">
  <NGridItem :span="4">4</NGridItem>
  <NGridItem :span="16">16</NGridItem>
  <NGridItem :span="4">4</NGridItem>
</NGrid>`

const offsetCode = `<NGrid :cols="6" :gap="12">
  <NGridItem :span="2" :offset="2">offset 2</NGridItem>
  <NGridItem :span="2">span 2</NGridItem>
</NGrid>`

const gapCode = `<!-- gap 为数组 [rowGap, colGap] -->
<NGrid :cols="3" :gap="[16, 24]">
  <NGridItem :span="1">item 1</NGridItem>
  <NGridItem :span="1">item 2</NGridItem>
  <NGridItem :span="1">item 3</NGridItem>
  <NGridItem :span="1">item 4</NGridItem>
  <NGridItem :span="1">item 5</NGridItem>
  <NGridItem :span="1">item 6</NGridItem>
</NGrid>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const gridPropData = [
  { name: 'cols', type: 'number', default: '24', desc: '栅格列数' },
  { name: 'gap', type: 'number | [number, number]', default: '0', desc: '间距(px)，数字表示行列相同，数组 [rowGap, colGap] 分别控制行列间距' },
  { name: 'gutter', type: 'boolean', default: 'false', desc: '是否显示内边距' },
]

const itemPropData = [
  { name: 'span', type: 'number', default: '1', desc: '占用列数' },
  { name: 'offset', type: 'number', default: '0', desc: '偏移列数（向右偏移）' },
  { name: 'push', type: 'number', default: '0', desc: '向右移动指定列数' },
  { name: 'pull', type: 'number', default: '0', desc: '向左移动指定列数' },
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
