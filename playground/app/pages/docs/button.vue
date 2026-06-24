<template>
  <div class="doc-page">
    <h1>Button 按钮</h1>
    <p class="doc-page__desc">常用的操作按钮，支持多种变体、尺寸、形状和图标。</p>

    <DemoBlock
      title="按钮变体"
      description="通过 variant 属性设置按钮风格："
      :code="variantCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton>主要按钮</NButton>
        <NButton variant="secondary">次要按钮</NButton>
        <NButton variant="outline">描边按钮</NButton>
        <NButton variant="danger">危险按钮</NButton>
        <NButton variant="ghost">幽灵按钮</NButton>
        <NButton variant="link">链接按钮</NButton>
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
      title="描边按钮颜色"
      description="outline 变体同样支持 danger 颜色："
      :code="outlineColorCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton variant="outline">默认描边</NButton>
        <NButton variant="outline" style="--n-color-primary: var(--n-color-danger); --n-color-primary-hover: var(--n-color-danger-hover); --n-color-primary-light: var(--n-color-danger-light); border-color: var(--n-color-danger); color: var(--n-color-danger);">危险描边</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="圆角按钮"
      description="设置 round 属性使按钮变为胶囊形状："
      :code="roundCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton round>主要按钮</NButton>
        <NButton variant="secondary" round>次要按钮</NButton>
        <NButton variant="outline" round>描边按钮</NButton>
        <NButton variant="danger" round>危险按钮</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="图标按钮"
      description="通过 #icon 和 #suffix-icon 插槽添加前后置图标，或使用 circle 创建圆形图标按钮："
      :code="iconCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton><template #icon><NIcon name="sousuo" /></template>搜索</NButton>
        <NButton variant="outline"><template #suffix-icon><NIcon name="gengduo" /></template>更多</NButton>
        <NButton variant="outline"><template #icon><NIcon name="xiazai" /></template><template #suffix-icon><NIcon name="fenxiang" /></template>下载分享</NButton>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:12px;">
        <NButton circle><template #icon><NIcon name="sousuo" /></template></NButton>
        <NButton variant="outline" circle><template #icon><NIcon name="bianji" /></template></NButton>
        <NButton variant="secondary" circle><template #icon><NIcon name="shanchu" /></template></NButton>
        <NButton variant="danger" circle><template #icon><NIcon name="jianshao" /></template></NButton>
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
        <NButton variant="outline" loading>描边加载</NButton>
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
        <NButton variant="outline" disabled>禁用描边</NButton>
        <NButton variant="ghost" disabled>禁用幽灵</NButton>
        <NButton variant="link" disabled>禁用链接</NButton>
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
        <NButton block variant="outline">描边按钮</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="激活状态"
      description="设置 active 属性标记按钮为激活状态，常用于工具栏切换："
      :code="activeCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <NButton variant="outline" :active="activeBtn === 'left'" @click="activeBtn = 'left'">左对齐</NButton>
        <NButton variant="outline" :active="activeBtn === 'center'" @click="activeBtn = 'center'">居中</NButton>
        <NButton variant="outline" :active="activeBtn === 'right'" @click="activeBtn = 'right'">右对齐</NButton>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const isLoading = ref(false)
function handleLoad() {
  isLoading.value = true
  setTimeout(() => { isLoading.value = false }, 2000)
}

const activeBtn = ref('left')

const variantCode = `<NButton>主要按钮</NButton>
<NButton variant="secondary">次要按钮</NButton>
<NButton variant="outline">描边按钮</NButton>
<NButton variant="danger">危险按钮</NButton>
<NButton variant="ghost">幽灵按钮</NButton>
<NButton variant="link">链接按钮</NButton>`

const sizeCode = `<NButton size="sm">小按钮</NButton>
<NButton size="md">中按钮</NButton>
<NButton size="lg">大按钮</NButton>`

const outlineColorCode = `<NButton variant="outline">默认描边</NButton>
<NButton variant="outline" style="border-color: var(--n-color-danger); color: var(--n-color-danger);">危险描边</NButton>`

const roundCode = `<NButton round>主要按钮</NButton>
<NButton variant="secondary" round>次要按钮</NButton>
<NButton variant="outline" round>描边按钮</NButton>
<NButton variant="danger" round>危险按钮</NButton>`

const iconCode = `<!-- 带文字的图标按钮 -->
<NButton>
  <template #icon><NIcon name="sousuo" /></template>
  搜索
</NButton>
<NButton variant="outline">
  更多
  <template #suffix-icon><NIcon name="gengduo" /></template>
</NButton>

<!-- 圆形图标按钮 -->
<NButton circle>
  <template #icon><NIcon name="sousuo" /></template>
</NButton>
<NButton variant="outline" circle>
  <template #icon><NIcon name="bianji" /></template>
</NButton>`

const loadingCode = `<NButton :loading="isLoading" @click="handleLoad">点击加载</NButton>
<NButton loading>始终加载</NButton>
<NButton variant="outline" loading>描边加载</NButton>`

const disabledCode = `<NButton disabled>禁用按钮</NButton>
<NButton variant="secondary" disabled>禁用次要</NButton>
<NButton variant="outline" disabled>禁用描边</NButton>
<NButton variant="ghost" disabled>禁用幽灵</NButton>
<NButton variant="link" disabled>禁用链接</NButton>`

const blockCode = `<NButton block>主要按钮</NButton>
<NButton block variant="secondary">次要按钮</NButton>
<NButton block variant="outline">描边按钮</NButton>`

const activeCode = `<NButton variant="outline" :active="activeBtn === 'left'" @click="activeBtn = 'left'">左对齐</NButton>
<NButton variant="outline" :active="activeBtn === 'center'" @click="activeBtn = 'center'">居中</NButton>
<NButton variant="outline" :active="activeBtn === 'right'" @click="activeBtn = 'right'">右对齐</NButton>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link'", default: "'primary'", desc: '按钮变体风格' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '按钮尺寸' },
  { name: 'block', type: 'boolean', default: 'false', desc: '是否为块级按钮' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否加载中' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'round', type: 'boolean', default: 'false', desc: '是否圆角胶囊按钮' },
  { name: 'circle', type: 'boolean', default: 'false', desc: '是否圆形图标按钮' },
  { name: 'active', type: 'boolean', default: 'false', desc: '是否激活状态（用于切换按钮）' },
  { name: 'htmlType', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: '原生 button type 属性' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'click', type: '(event: MouseEvent) => void', desc: '按钮点击事件（禁用和加载状态不会触发）' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '按钮内容' },
  { name: 'icon', desc: '前置图标插槽' },
  { name: 'suffix-icon', desc: '后置图标插槽' },
]
</script>
