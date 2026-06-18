<template>
  <div class="doc-page">
    <h1>Badge 徽标</h1>
    <p class="doc-page__desc">展示数字或状态圆点，常用于图标或文字右上角。</p>

    <DemoBlock title="基础用法" description="通过 count 设置徽标数字。" :code="basicCode">
      <NSpace :size="24">
        <NBadge :count="5">
          <NButton>消息</NButton>
        </NBadge>
        <NBadge :count="99">
          <NButton>通知</NButton>
        </NBadge>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="最大值" description="超过 max 值后显示 max+。" :code="maxCode">
      <NSpace :size="24">
        <NBadge :count="100" :max="99">
          <NButton>消息</NButton>
        </NBadge>
        <NBadge :count="1000" :max="999">
          <NButton>通知</NButton>
        </NBadge>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="圆点" description="设置 dot 仅显示小圆点。" :code="dotCode">
      <NSpace :size="24">
        <NBadge dot>
          <NButton>新消息</NButton>
        </NBadge>
        <NBadge dot type="success">
          <NButton>已连接</NButton>
        </NBadge>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="颜色类型" description="通过 type 改变徽标颜色。" :code="typeCode">
      <NSpace :size="24">
        <NBadge :count="3" type="primary"><NButton>Primary</NButton></NBadge>
        <NBadge :count="3" type="success"><NButton>Success</NButton></NBadge>
        <NBadge :count="3" type="warning"><NButton>Warning</NButton></NBadge>
        <NBadge :count="3" type="danger"><NButton>Danger</NButton></NBadge>
        <NBadge :count="3" type="info"><NButton>Info</NButton></NBadge>
      </NSpace>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<NBadge :count="5">
  <NButton>消息</NButton>
</NBadge>`

const maxCode = `<NBadge :count="100" :max="99">
  <NButton>消息</NButton>
</NBadge>`

const dotCode = `<NBadge dot>
  <NButton>新消息</NButton>
</NBadge>`

const typeCode = `<NBadge :count="3" type="success">
  <NButton>Success</NButton>
</NBadge>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'count', type: 'number', default: '0', desc: '徽标数值' },
  { name: 'max', type: 'number', default: '99', desc: '最大值，超过显示 max+' },
  { name: 'dot', type: 'boolean', default: 'false', desc: '是否仅显示圆点' },
  { name: 'type', type: "'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'danger'", desc: '颜色类型' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '徽标所附加的目标元素' },
]
</script>
