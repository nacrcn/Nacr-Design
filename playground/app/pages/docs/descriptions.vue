<template>
  <div class="doc-page">
    <h1>Descriptions 描述列表</h1>
    <p class="doc-page__desc">以键值对形式展示信息，常用于详情页。</p>

    <DemoBlock title="基础用法" description="通过 NDescriptions 和 NDescriptionsItem 组合使用。" :code="basicCode">
      <NDescriptions title="用户信息" :column="2">
        <NDescriptionsItem label="用户名">张三</NDescriptionsItem>
        <NDescriptionsItem label="手机号">138****8888</NDescriptionsItem>
        <NDescriptionsItem label="邮箱">zhangsan@example.com</NDescriptionsItem>
        <NDescriptionsItem label="地址">北京市朝阳区</NDescriptionsItem>
        <NDescriptionsItem label="备注" :span="2">这是一段较长的备注信息，可以跨列显示。</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <DemoBlock title="不同列数" description="通过 column 设置每行显示的列数。" :code="colCode">
      <NDescriptions title="三列展示" :column="3">
        <NDescriptionsItem label="字段1">值1</NDescriptionsItem>
        <NDescriptionsItem label="字段2">值2</NDescriptionsItem>
        <NDescriptionsItem label="字段3">值3</NDescriptionsItem>
        <NDescriptionsItem label="字段4">值4</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <ApiTable title="NDescriptions Props" :columns="propColumns" :data="descPropData" />
    <ApiTable title="NDescriptionsItem Props" :columns="propColumns" :data="itemPropData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<NDescriptions title="用户信息" :column="2">
  <NDescriptionsItem label="用户名">张三</NDescriptionsItem>
  <NDescriptionsItem label="手机号">138****8888</NDescriptionsItem>
  <NDescriptionsItem label="备注" :span="2">跨列内容</NDescriptionsItem>
</NDescriptions>`

const colCode = `<NDescriptions title="三列展示" :column="3">
  <NDescriptionsItem label="字段1">值1</NDescriptionsItem>
  <NDescriptionsItem label="字段2">值2</NDescriptionsItem>
</NDescriptions>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const descPropData = [
  { name: 'title', type: 'string', default: '—', desc: '标题' },
  { name: 'column', type: 'number', default: '2', desc: '每行显示的列数' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框' },
]

const itemPropData = [
  { name: 'label', type: 'string', default: '—', desc: '字段标签（必填）' },
  { name: 'span', type: 'number', default: '1', desc: '占用列数' },
]
</script>
