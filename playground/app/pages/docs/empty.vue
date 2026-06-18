<template>
  <div class="doc-page">
    <h1>Empty 空状态</h1>
    <p class="doc-page__desc">空状态占位提示，用于无数据场景，支持多种内置类型、自定义图片、尺寸和底部操作。</p>

    <DemoBlock title="基础用法" description="通过 description 设置描述文字。" :code="basicCode">
      <NEmpty description="暂无数据" />
    </DemoBlock>

    <DemoBlock title="内置类型" description="通过 type 设置不同的空状态场景，提供 default / simple / search / error / network / cart / inbox 七种类型。" :code="typeCode">
      <NSpace wrap>
        <div v-for="t in types" :key="t" style="text-align:center;min-width:140px;">
          <NEmpty :type="t as any" :description="typeLabels[t]" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:8px;">{{ t }}</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="通过 size 设置尺寸，支持 sm / md / lg。" :code="sizeCode">
      <NSpace align="end">
        <div style="text-align:center;">
          <NEmpty description="小尺寸" size="sm" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">sm</p>
        </div>
        <div style="text-align:center;">
          <NEmpty description="中等尺寸" size="md" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">md</p>
        </div>
        <div style="text-align:center;">
          <NEmpty description="大尺寸" size="lg" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">lg</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义图片" description="通过 image 设置自定义图片地址，替换内置图标。" :code="imageCode">
      <NEmpty
        description="自定义图片空状态"
        image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect x='8' y='8' width='48' height='48' rx='8' fill='%23f0f0f0' stroke='%23d9d9d9' stroke-width='2'/%3E%3Cpath d='M20 44l8-16 6 10 6-8 8 14' fill='none' stroke='%23b0b0b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23b0b0b0'/%3E%3C/svg%3E"
      />
    </DemoBlock>

    <DemoBlock title="自定义底部操作" description="使用默认插槽添加操作按钮。" :code="slotCode">
      <NEmpty type="search" description="未找到匹配结果">
        <NButton size="sm" variant="primary">清除筛选</NButton>
      </NEmpty>
    </DemoBlock>

    <DemoBlock title="网络异常" description="使用 network 类型展示网络异常提示，搭配底部操作按钮提供重试能力。" :code="networkCode">
      <NEmpty type="network" description="网络连接异常，请检查网络设置">
        <NButton size="sm" variant="secondary">重新加载</NButton>
      </NEmpty>
    </DemoBlock>

    <DemoBlock title="购物车为空" description="使用 cart 类型展示购物车空状态。" :code="cartCode">
      <NEmpty type="cart" description="购物车还是空的，快去挑选商品吧">
        <NButton size="sm" variant="primary">去购物</NButton>
      </NEmpty>
    </DemoBlock>

    <DemoBlock title="在卡片中使用" description="将 Empty 组件嵌入卡片等容器中，填充无数据区域。" :code="cardCode">
      <div style="border:1px solid var(--n-color-border);border-radius:8px;padding:0;">
        <div style="padding:12px 16px;border-bottom:1px solid var(--n-color-border);font-weight:600;font-size:14px;">我的收藏</div>
        <NEmpty type="inbox" description="还没有收藏任何内容" size="sm" />
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const types = ['default', 'simple', 'search', 'error', 'network', 'cart', 'inbox'] as const
const typeLabels: Record<string, string> = {
  default: '暂无数据',
  simple: '内容为空',
  search: '未找到结果',
  error: '加载失败',
  network: '网络异常',
  cart: '购物车为空',
  inbox: '收件箱为空',
}

const basicCode = `<NEmpty description="暂无数据" />`

const typeCode = `<NEmpty type="default" description="暂无数据" />
<NEmpty type="simple" description="内容为空" />
<NEmpty type="search" description="未找到结果" />
<NEmpty type="error" description="加载失败" />
<NEmpty type="network" description="网络异常" />
<NEmpty type="cart" description="购物车为空" />
<NEmpty type="inbox" description="收件箱为空" />`

const sizeCode = `<NEmpty description="小尺寸" size="sm" />
<NEmpty description="中等尺寸" size="md" />
<NEmpty description="大尺寸" size="lg" />`

const imageCode = `<NEmpty
  description="自定义图片空状态"
  image="https://example.com/empty.svg"
/>`

const slotCode = `<NEmpty type="search" description="未找到匹配结果">
  <NButton size="sm" variant="primary">清除筛选</NButton>
</NEmpty>`

const networkCode = `<NEmpty type="network" description="网络连接异常，请检查网络设置">
  <NButton size="sm" variant="secondary">重新加载</NButton>
</NEmpty>`

const cartCode = `<NEmpty type="cart" description="购物车还是空的，快去挑选商品吧">
  <NButton size="sm" variant="primary">去购物</NButton>
</NEmpty>`

const cardCode = `<div class="card">
  <div class="card-header">我的收藏</div>
  <NEmpty type="inbox" description="还没有收藏任何内容" size="sm" />
</div>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'description', type: 'string', default: '—', desc: '描述文字' },
  { name: 'type', type: "'default' | 'simple' | 'search' | 'error' | 'network' | 'cart' | 'inbox'", default: "'default'", desc: '空状态类型' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'image', type: 'string', default: '—', desc: '自定义图片地址，设置后替换内置图标' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '自定义底部内容（通常为操作按钮）' },
]
</script>
