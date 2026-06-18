<template>
  <div class="doc-page">
    <h1>Space 间距</h1>
    <p class="doc-page__desc">设置组件之间的间距，支持水平与垂直方向。</p>

    <DemoBlock title="水平间距" description="默认为水平方向排列子元素。" :code="horizontalCode">
      <NSpace>
        <NButton>按钮1</NButton>
        <NButton>按钮2</NButton>
        <NButton>按钮3</NButton>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="垂直间距" description="设置 direction 为 vertical。" :code="verticalCode">
      <NSpace direction="vertical">
        <NButton>按钮1</NButton>
        <NButton>按钮2</NButton>
        <NButton>按钮3</NButton>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义间距" description="通过 size 设置间距大小。" :code="sizeCode">
      <NSpace :size="24">
        <NButton>24px</NButton>
        <NButton>间距</NButton>
        <NButton>示例</NButton>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自动换行" description="设置 wrap 为 true 允许子元素换行。" :code="wrapCode">
      <NSpace wrap>
        <NButton v-for="i in 10" :key="i">按钮{{ i }}</NButton>
      </NSpace>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const horizontalCode = `<NSpace>
  <NButton>按钮1</NButton>
  <NButton>按钮2</NButton>
</NSpace>`

const verticalCode = `<NSpace direction="vertical">
  <NButton>按钮1</NButton>
  <NButton>按钮2</NButton>
</NSpace>`

const sizeCode = `<NSpace :size="24">
  <NButton>24px</NButton>
  <NButton>间距</NButton>
</NSpace>`

const wrapCode = `<NSpace wrap>
  <NButton v-for="i in 10" :key="i">按钮{{ i }}</NButton>
</NSpace>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '排列方向' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'baseline'", default: "'center'", desc: '对齐方式' },
  { name: 'size', type: 'number | string', default: '8', desc: '间距大小(px)' },
  { name: 'wrap', type: 'boolean', default: 'false', desc: '是否自动换行' },
]
</script>
