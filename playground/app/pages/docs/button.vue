<template>
  <div class="doc-page">
    <h1>Button 按钮</h1>
    <p class="doc-page__desc">常用的操作按钮，支持多种变体、尺寸和状态。</p>

    <DemoBlock
      title="按钮变体"
      description="通过 variant 属性设置按钮风格："
      :code="variantCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton>主要按钮</NButton>
        <NButton variant="secondary">次要按钮</NButton>
        <NButton variant="danger">危险按钮</NButton>
        <NButton variant="ghost">幽灵按钮</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="按钮尺寸"
      description="通过 size 属性设置按钮大小："
      :code="sizeCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton size="sm">小按钮</NButton>
        <NButton size="md">中按钮</NButton>
        <NButton size="lg">大按钮</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="加载状态"
      description="设置 loading 属性显示加载指示器，按钮将自动禁用："
      :code="loadingCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton :loading="isLoading" @click="handleLoad">点击加载</NButton>
        <NButton loading>始终加载</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用状态"
      description="设置 disabled 属性禁用按钮："
      :code="disabledCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton disabled>禁用按钮</NButton>
        <NButton variant="secondary" disabled>禁用次要</NButton>
        <NButton variant="ghost" disabled>禁用幽灵</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="块级按钮"
      description="设置 block 属性使按钮撑满父容器宽度："
      :code="blockCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:8px;">
        <NButton block>主要按钮</NButton>
        <NButton block variant="secondary">次要按钮</NButton>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const isLoading = ref(false)
function handleLoad() {
  isLoading.value = true
  setTimeout(() => { isLoading.value = false }, 2000)
}

const variantCode = `<NButton>主要按钮</NButton>
<NButton variant="secondary">次要按钮</NButton>
<NButton variant="danger">危险按钮</NButton>
<NButton variant="ghost">幽灵按钮</NButton>`

const sizeCode = `<NButton size="sm">小按钮</NButton>
<NButton size="md">中按钮</NButton>
<NButton size="lg">大按钮</NButton>`

const loadingCode = `<NButton :loading="isLoading" @click="handleLoad">点击加载</NButton>
<NButton loading>始终加载</NButton>`

const disabledCode = `<NButton disabled>禁用按钮</NButton>
<NButton variant="secondary" disabled>禁用次要</NButton>
<NButton variant="ghost" disabled>禁用幽灵</NButton>`

const blockCode = `<NButton block>主要按钮</NButton>
<NButton block variant="secondary">次要按钮</NButton>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost'", default: "'primary'", desc: '按钮变体风格' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '按钮尺寸' },
  { name: 'block', type: 'boolean', default: 'false', desc: '是否为块级按钮' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否加载中' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'click', type: '(event: MouseEvent) => void', desc: '按钮点击事件（禁用和加载状态不会触发）' },
]
</script>
