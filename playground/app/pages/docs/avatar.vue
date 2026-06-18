<template>
  <div class="doc-page">
    <h1>Avatar 头像</h1>
    <p class="doc-page__desc">用于展示用户头像信息，支持图片、文字、图标，以及头像组等多种形态。</p>

    <DemoBlock title="基础用法" description="通过 src 设置图片地址，通过 alt 设置首字母缩写，或通过默认插槽传入自定义内容：" :code="basicCode">
      <NSpace :gap="12" align="center">
        <NAvatar :src="img1" alt="张三" />
        <NAvatar :src="img2" alt="李四" />
        <NAvatar alt="王五" color="#f56a00" />
        <NAvatar alt="赵六" color="#7265e6" />
        <NAvatar><span style="font-size:18px">N</span></NAvatar>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="提供 xs / sm / md / lg / xl 五种预设尺寸，也支持传入数字自定义大小：" :code="sizeCode">
      <NSpace :gap="16" align="end">
        <NAvatar :src="img1" size="xs" alt="XS" />
        <NAvatar :src="img1" size="sm" alt="SM" />
        <NAvatar :src="img1" size="md" alt="MD" />
        <NAvatar :src="img1" size="lg" alt="LG" />
        <NAvatar :src="img1" size="xl" alt="XL" />
        <NAvatar :src="img1" :size="80" alt="80" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="形状" description="通过 shape 设置头像形状：circle（圆形）、square（方形）、rounded（圆角方形）：" :code="shapeCode">
      <NSpace :gap="16" align="center">
        <NAvatar :src="img1" shape="circle" size="lg" alt="圆" />
        <NAvatar :src="img1" shape="square" size="lg" alt="方" />
        <NAvatar :src="img1" shape="rounded" size="lg" alt="圆角" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义背景色" description="通过 color 属性设置头像背景色，适用于文字头像：" :code="colorCode">
      <NSpace :gap="12" align="center">
        <NAvatar alt="A" color="#1677ff" />
        <NAvatar alt="B" color="#52c41a" />
        <NAvatar alt="C" color="#ff4d4f" />
        <NAvatar alt="D" color="#722ed1" />
        <NAvatar alt="E" color="#fa8c16" />
        <NAvatar alt="F" color="#13c2c2" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="边框头像" description="设置 bordered 属性在头像周围添加白色边框，常用于头像组中区分重叠的头像：" :code="borderedCode">
      <NSpace :gap="16" align="center">
        <NAvatar :src="img1" bordered size="lg" alt="边框" />
        <NAvatar :src="img2" bordered size="lg" alt="边框" />
        <NAvatar alt="N" color="#1677ff" bordered size="lg" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="图片填充模式" description="通过 fit 属性设置图片填充方式，等同于 CSS object-fit 属性：" :code="fitCode">
      <NSpace :gap="16" align="center">
        <div class="fit-item">
          <NAvatar :src="img1" fit="cover" shape="square" :size="80" alt="cover" />
          <span class="fit-label">cover</span>
        </div>
        <div class="fit-item">
          <NAvatar :src="img1" fit="contain" shape="square" :size="80" alt="contain" />
          <span class="fit-label">contain</span>
        </div>
        <div class="fit-item">
          <NAvatar :src="img1" fit="fill" shape="square" :size="80" alt="fill" />
          <span class="fit-label">fill</span>
        </div>
        <div class="fit-item">
          <NAvatar :src="img1" fit="none" shape="square" :size="80" alt="none" />
          <span class="fit-label">none</span>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="在线状态指示器" description="通过 show-indicator 显示在线状态点，indicator-status 设置状态：online / offline / busy / away，indicator-position 设置位置：" :code="indicatorCode">
      <NSpace :gap="24" align="center">
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="online" alt="在线" />
          <span class="indicator-label">在线</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="offline" alt="离线" />
          <span class="indicator-label">离线</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="busy" alt="忙碌" />
          <span class="indicator-label">忙碌</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="away" alt="离开" />
          <span class="indicator-label">离开</span>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="指示器位置" description="通过 indicator-position 设置指示器位置：top-right / top-left / bottom-right / bottom-left：" :code="indicatorPosCode">
      <NSpace :gap="24" align="center">
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="online" indicator-position="top-right" alt="右上" />
          <span class="indicator-label">右上</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="online" indicator-position="top-left" alt="左上" />
          <span class="indicator-label">左上</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="online" indicator-position="bottom-left" alt="左下" />
          <span class="indicator-label">左下</span>
        </div>
        <div class="indicator-item">
          <NAvatar :src="img1" size="lg" show-indicator indicator-status="online" indicator-position="bottom-right" alt="右下" />
          <span class="indicator-label">右下</span>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="头像组" description="使用 NAvatarGroup 组合多个头像，支持设置最大显示数量和方向：" :code="groupCode">
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">默认头像组</p>
          <NAvatarGroup size="md" bordered>
            <NAvatar :src="img1" alt="张三" />
            <NAvatar :src="img2" alt="李四" />
            <NAvatar alt="王五" color="#f56a00" />
            <NAvatar alt="赵六" color="#7265e6" />
            <NAvatar alt="孙七" color="#1677ff" />
          </NAvatarGroup>
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">不同尺寸</p>
          <NAvatarGroup size="lg" bordered>
            <NAvatar :src="img1" alt="A" />
            <NAvatar :src="img2" alt="B" />
            <NAvatar alt="C" color="#f56a00" />
          </NAvatarGroup>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="结合徽标" description="搭配 NBadge 组件展示未读消息数等信息：" :code="badgeCode">
      <NSpace :gap="32" align="center">
        <NBadge :count="5">
          <NAvatar :src="img1" size="lg" alt="消息" />
        </NBadge>
        <NBadge :count="99">
          <NAvatar :src="img2" size="lg" alt="通知" />
        </NBadge>
        <NBadge dot>
          <NAvatar alt="N" size="lg" color="#1677ff" />
        </NBadge>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="组合用法" description="在卡片等容器中使用头像，构建用户信息展示：" :code="combineCode">
      <NCard variant="shadow" style="max-width:380px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <NAvatar :src="img1" :size="48" show-indicator indicator-status="online" alt="张三" />
          <div>
            <div style="font-size:16px;font-weight:600;color:var(--n-color-text);">张三</div>
            <div style="font-size:13px;color:var(--n-color-text-tertiary);">前端工程师 · 在线</div>
          </div>
        </div>
        <p style="font-size:14px;color:var(--n-color-text-secondary);line-height:1.6;margin:0 0 12px;">
          热爱开源，专注于 Vue 生态和组件库开发。
        </p>
        <template #actions>
          <NButton size="sm" type="primary">关注</NButton>
          <NButton size="sm">私信</NButton>
        </template>
      </NCard>
    </DemoBlock>

    <ApiTable title="Avatar Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Avatar Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Avatar Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="AvatarGroup Props" :columns="groupPropColumns" :data="groupPropData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const img1 = 'https://pan.nacr.cn/f/Wnh3/u=2448393511%2C2158991775&fm=253&fmt=auto&app=138&f=JPEG.webp'
const img2 = 'https://pan.nacr.cn/f/nvi3/u=1077322696%2C3006269171&fm=253&fmt=auto&app=120&f=JPEG.webp'

const basicCode = `<NAvatar src="图片地址" alt="张三" />
<NAvatar alt="王五" color="#f56a00" />
<NAvatar><span>N</span></NAvatar>`

const sizeCode = `<NAvatar :src="img" size="xs" />
<NAvatar :src="img" size="sm" />
<NAvatar :src="img" size="md" />
<NAvatar :src="img" size="lg" />
<NAvatar :src="img" size="xl" />
<NAvatar :src="img" :size="80" />`

const shapeCode = `<NAvatar :src="img" shape="circle" />
<NAvatar :src="img" shape="square" />
<NAvatar :src="img" shape="rounded" />`

const colorCode = `<NAvatar alt="A" color="#1677ff" />
<NAvatar alt="B" color="#52c41a" />
<NAvatar alt="C" color="#ff4d4f" />`

const borderedCode = `<NAvatar :src="img" bordered size="lg" />
<NAvatar alt="N" color="#1677ff" bordered size="lg" />`

const fitCode = `<NAvatar :src="img" fit="cover" shape="square" :size="80" />
<NAvatar :src="img" fit="contain" shape="square" :size="80" />
<NAvatar :src="img" fit="fill" shape="square" :size="80" />
<NAvatar :src="img" fit="none" shape="square" :size="80" />`

const indicatorCode = `<NAvatar :src="img" show-indicator indicator-status="online" />
<NAvatar :src="img" show-indicator indicator-status="offline" />
<NAvatar :src="img" show-indicator indicator-status="busy" />
<NAvatar :src="img" show-indicator indicator-status="away" />`

const indicatorPosCode = `<NAvatar :src="img" show-indicator indicator-position="top-right" />
<NAvatar :src="img" show-indicator indicator-position="top-left" />
<NAvatar :src="img" show-indicator indicator-position="bottom-left" />
<NAvatar :src="img" show-indicator indicator-position="bottom-right" />`

const groupCode = `<NAvatarGroup size="md" bordered>
  <NAvatar :src="img1" alt="张三" />
  <NAvatar :src="img2" alt="李四" />
  <NAvatar alt="王五" color="#f56a00" />
  <NAvatar alt="赵六" color="#7265e6" />
</NAvatarGroup>`

const badgeCode = `<NBadge :count="5">
  <NAvatar :src="img" size="lg" />
</NBadge>
<NBadge dot>
  <NAvatar :src="img" size="lg" />
</NBadge>`

const combineCode = `<NCard variant="shadow">
  <div style="display:flex;align-items:center;gap:12px;">
    <NAvatar :src="img" :size="48" show-indicator indicator-status="online" />
    <div>
      <div>张三</div>
      <div>前端工程师 · 在线</div>
    </div>
  </div>
  <p>热爱开源，专注于 Vue 生态和组件库开发。</p>
  <template #actions>
    <NButton size="sm" type="primary">关注</NButton>
    <NButton size="sm">私信</NButton>
  </template>
</NCard>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'src', type: 'string', default: '—', desc: '图片地址' },
  { name: 'alt', type: 'string', default: '—', desc: '图片替代文本，也用于生成首字母缩写（支持双字名如"张三"→"张三"两字首字母）' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", desc: '尺寸' },
  { name: 'shape', type: "'circle' | 'square' | 'rounded'", default: "'circle'", desc: '形状' },
  { name: 'round', type: 'boolean', default: 'true', desc: '是否为圆形（兼容旧版本，推荐使用 shape）' },
  { name: 'fit', type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'", default: "'cover'", desc: '图片填充模式，等同于 CSS object-fit' },
  { name: 'color', type: 'string', default: '—', desc: '自定义背景色' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框' },
  { name: 'fallback', type: 'string', default: '—', desc: '图片加载失败时的备用地址' },
  { name: 'show-indicator', type: 'boolean', default: 'false', desc: '是否显示在线状态指示器' },
  { name: 'indicator-status', type: "'online' | 'offline' | 'busy' | 'away'", default: "'online'", desc: '指示器状态' },
  { name: 'indicator-position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'bottom-right'", desc: '指示器位置' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'params', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'load', params: '(e: Event)', desc: '图片加载成功时触发' },
  { name: 'error', params: '(e: Event)', desc: '图片加载失败时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '自定义头像内容（图片加载失败或无 src 时显示）' },
]

const groupPropColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const groupPropData = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", desc: '统一设置组内头像尺寸' },
  { name: 'shape', type: "'circle' | 'square' | 'rounded'", default: "'circle'", desc: '统一设置组内头像形状' },
  { name: 'color', type: 'string', default: '—', desc: '统一设置组内文本头像背景色' },
  { name: 'bordered', type: 'boolean', default: 'true', desc: '是否显示边框（头像组默认开启）' },
  { name: 'max', type: 'number', default: 'Infinity', desc: '最大显示头像数量' },
  { name: 'direction', type: "'left' | 'right'", default: "'left'", desc: '头像排列方向' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
]
</script>

<style scoped>
.fit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.fit-label {
  font-size: 12px;
  color: var(--n-color-text-tertiary, #9ca3af);
}

.indicator-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.indicator-label {
  font-size: 12px;
  color: var(--n-color-text-secondary, #6b7280);
}
</style>
