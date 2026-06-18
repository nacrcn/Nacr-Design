<template>
  <div class="doc-page">
    <h1>Comment 评论</h1>
    <p class="doc-page__desc">用于展示评论信息，包含头像、作者、时间和内容。</p>

    <DemoBlock title="基础用法" description="典型的评论组件结构。" :code="basicCode">
      <NComment author="张三" avatar="https://i.pravatar.cc/150?img=11" datetime="2 小时前">
        这是一段评论内容，展示评论组件的基本用法。
      </NComment>
    </DemoBlock>

    <DemoBlock title="带操作按钮" description="使用 actions 插槽添加操作按钮。" :code="actionCode">
      <NComment author="李四" avatar="https://i.pravatar.cc/150?img=12" datetime="1 天前">
        这是一条带操作按钮的评论。
        <template #actions>
          <NButton size="sm" variant="ghost">回复</NButton>
          <NButton size="sm" variant="ghost">点赞</NButton>
        </template>
      </NComment>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<NComment author="张三" avatar="..." datetime="2 小时前">
  这是一段评论内容。
</NComment>`

const actionCode = `<NComment author="李四" avatar="..." datetime="1 天前">
  这是一条带操作按钮的评论。
  <template #actions>
    <NButton size="sm" variant="ghost">回复</NButton>
  </template>
</NComment>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'author', type: 'string', default: '—', desc: '作者名' },
  { name: 'avatar', type: 'string', default: '—', desc: '头像图片地址' },
  { name: 'datetime', type: 'string', default: '—', desc: '时间描述' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '评论正文内容' },
  { name: 'avatar', desc: '自定义头像区域' },
  { name: 'actions', desc: '操作按钮区域' },
]
</script>
