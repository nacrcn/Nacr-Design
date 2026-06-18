<template>
  <div class="doc-page">
    <h1>Skeleton 骨架屏</h1>
    <p class="doc-page__desc">
      在内容加载前展示页面的大致结构，降低用户的等待焦虑。支持文本段落、圆形头像、按钮/图片等多种骨架形态以及带头像的段落组合。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="默认显示 3 行文本段落骨架，自带渐变动画。" :code="basicCode">
      <NSkeleton />
    </DemoBlock>

    <!-- ────── 自定义行数与宽度 ────── -->
    <DemoBlock title="自定义行数与宽度" description="通过 rows 设置行数，width 设置各行宽度（支持数组逐一指定）。" :code="rowsCode">
      <NSkeleton :rows="5" :width="['100%', '90%', '80%', '60%', '40%']" />
    </DemoBlock>

    <!-- ────── 圆形骨架 ────── -->
    <DemoBlock title="圆形骨架" description="设置 shape='circle' 显示圆形骨架，通过 size 控制尺寸。" :code="circleCode">
      <NSpace :size="20" align="end">
        <NSkeleton shape="circle" size="sm" />
        <NSkeleton shape="circle" size="md" />
        <NSkeleton shape="circle" size="lg" />
        <NSkeleton shape="circle" :size="80" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 矩形骨架 ────── -->
    <DemoBlock title="矩形骨架" description="设置 shape='rect' 显示矩形骨架，适用于按钮、图片等占位。" :code="rectCode">
      <NSpace :size="12" align="end">
        <NSkeleton shape="rect" :width="80" :height="32" round />
        <NSkeleton shape="rect" :width="120" :height="80" />
        <NSkeleton shape="rect" :width="160" :height="100" round />
      </NSpace>
    </DemoBlock>

    <!-- ────── 带头像的段落 ────── -->
    <DemoBlock title="带头像的段落" description="设置 show-avatar 在段落左侧展示圆形头像骨架，avatar-size 控制头像大小。" :code="avatarCode">
      <NSkeleton :rows="3" show-avatar :avatar-size="48" />
    </DemoBlock>

    <!-- ────── 圆角行 ────── -->
    <DemoBlock title="圆角行" description="设置 round 使段落行变为胶囊形状。" :code="roundCode">
      <NSkeleton :rows="3" :height="12" round />
    </DemoBlock>

    <!-- ────── 关闭动画 ────── -->
    <DemoBlock title="关闭动画" description="设置 animated 为 false 关闭渐变闪烁动画。" :code="animCode">
      <NSkeleton :rows="3" :animated="false" />
    </DemoBlock>

    <!-- ────── 加载切换 ────── -->
    <DemoBlock title="加载切换" description="通过 loading 控制骨架与真实内容的切换，加载完成后展示 slot 内容。" :code="loadingCode">
      <div class="demo-col">
        <NSkeleton :loading="dataLoading" :rows="3" show-avatar>
          <div class="skeleton-real-content">
            <div class="skeleton-real-avatar"></div>
            <div>
              <p style="font-weight:600;margin:0 0 4px;">张三</p>
              <p style="margin:0;color:var(--n-color-text-secondary);">这是一段已加载的真实内容，用来替代骨架屏占位。点击按钮可来回切换加载状态。</p>
            </div>
          </div>
        </NSkeleton>
        <NButton size="sm" variant="secondary" @click="dataLoading = !dataLoading">{{ dataLoading ? '加载完成' : '重新加载' }}</NButton>
      </div>
    </DemoBlock>

    <!-- ────── 卡片骨架 ────── -->
    <DemoBlock title="卡片骨架" description="组合多种形态模拟卡片占位效果。" :code="cardCode">
      <div class="skeleton-card-demo">
        <NSkeleton shape="rect" :width="'100%'" :height="140" />
        <div style="padding:16px 0 0;">
          <NSkeleton :rows="2" :width="['70%', '50%']" :height="14" />
          <div style="margin-top:12px;">
            <NSkeleton shape="rect" :width="80" :height="28" round />
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const dataLoading = ref(true)

const basicCode = `<NSkeleton />`

const rowsCode = `<NSkeleton :rows="5" :width="['100%', '90%', '80%', '60%', '40%']" />`

const circleCode = `<NSkeleton shape="circle" size="sm" />
<NSkeleton shape="circle" size="md" />
<NSkeleton shape="circle" size="lg" />
<NSkeleton shape="circle" :size="80" />`

const rectCode = `<NSkeleton shape="rect" :width="80" :height="32" round />
<NSkeleton shape="rect" :width="120" :height="80" />
<NSkeleton shape="rect" :width="160" :height="100" round />`

const avatarCode = `<NSkeleton :rows="3" show-avatar :avatar-size="48" />`

const roundCode = `<NSkeleton :rows="3" :height="12" round />`

const animCode = `<NSkeleton :rows="3" :animated="false" />`

const loadingCode = `<NSkeleton :loading="loading" :rows="3" show-avatar>
  <div>真实内容</div>
</NSkeleton>
<NButton @click="loading = !loading">切换</NButton>`

const cardCode = `<NSkeleton shape="rect" :width="'100%'" :height="140" />
<div style="padding:16px 0 0;">
  <NSkeleton :rows="2" :width="['70%', '50%']" :height="14" />
  <NSkeleton shape="rect" :width="80" :height="28" round />
</div>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'loading', type: 'boolean', default: 'true', desc: '是否处于加载状态，为 false 时显示 slot 内容' },
  { name: 'rows', type: 'number', default: '3', desc: '段落骨架行数' },
  { name: 'animated', type: 'boolean', default: 'true', desc: '是否开启动画' },
  { name: 'width', type: 'string | number | Array<string | number>', default: '—', desc: '行宽度，数组可逐行指定' },
  { name: 'height', type: 'number | string', default: '16', desc: '行高度(px)，shape=rect 时也用于指定高度' },
  { name: 'shape', type: "'text' | 'circle' | 'rect'", default: "'text'", desc: '骨架形态：文本段落、圆形、矩形' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", desc: '圆形骨架尺寸（仅 shape=circle 时生效）' },
  { name: 'showAvatar', type: 'boolean', default: 'false', desc: '段落左侧是否显示圆形头像' },
  { name: 'avatarSize', type: 'number', default: '40', desc: '头像大小(px)' },
  { name: 'round', type: 'boolean', default: 'false', desc: '行是否为胶囊圆角' },
]

const slotData = [
  { name: 'default', desc: '加载完成后的真实内容（loading 为 false 时渲染）' },
]
</script>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.skeleton-real-content {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.skeleton-real-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--n-color-primary-light);
  flex-shrink: 0;
}
.skeleton-card-demo {
  max-width: 320px;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  padding: 16px;
}
</style>
