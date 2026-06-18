<template>
  <div class="doc-page">
    <h1>Divider 分割线</h1>
    <p class="doc-page__desc">区隔内容的分割线，支持水平与垂直方向，可在中间插入文字。</p>

    <DemoBlock title="水平分割线" description="默认为水平方向，可用于分割不同区块。" :code="horizontalCode">
      <div>
        <p>第一段内容</p>
        <NDivider />
        <p>第二段内容</p>
      </div>
    </DemoBlock>

    <DemoBlock title="带文字的分割线" description="在分割线中间插入文字，通过默认插槽传入。" :code="textCode">
      <NDivider>分隔文字</NDivider>
    </DemoBlock>

    <DemoBlock title="虚线分割" description="设置 dashed 属性显示虚线样式。" :code="dashedCode">
      <NDivider dashed>虚线分割</NDivider>
    </DemoBlock>

    <DemoBlock title="垂直分割" description="设置 direction 为 vertical 可用于行内分割。" :code="verticalCode">
      <div style="display:flex;align-items:center;">
        <span>文本</span>
        <NDivider direction="vertical" />
        <span>链接</span>
        <NDivider direction="vertical" />
        <span>更多</span>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const horizontalCode = `<NDivider />`
const textCode = `<NDivider>分隔文字</NDivider>`
const dashedCode = `<NDivider dashed>虚线分割</NDivider>`
const verticalCode = `<NDivider direction="vertical" />`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '分割线方向' },
  { name: 'dashed', type: 'boolean', default: 'false', desc: '是否为虚线' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '分割线中间文字（仅水平方向有效）' },
]
</script>
