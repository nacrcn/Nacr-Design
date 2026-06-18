<template>
  <div class="doc-page">
    <h1>Progress 进度条</h1>
    <p class="doc-page__desc">
      展示操作或任务的当前进度，支持线形、环形、仪表盘三种类型，以及状态、条纹动画等丰富配置。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 percent 设置进度百分比，默认为线形进度条。" :code="basicCode">
      <div class="demo-col">
        <NProgress :percent="30" />
        <NProgress :percent="60" />
        <NProgress :percent="100" status="success" />
      </div>
    </DemoBlock>

    <!-- ────── 不同状态 ────── -->
    <DemoBlock title="不同状态" description="通过 status 设置进度条状态：default / success / warning / error。" :code="statusCode">
      <div class="demo-col">
        <NProgress :percent="70" />
        <NProgress :percent="100" status="success" />
        <NProgress :percent="50" status="warning" />
        <NProgress :percent="30" status="error" />
      </div>
    </DemoBlock>

    <!-- ────── 自定义高度 ────── -->
    <DemoBlock title="自定义高度" description="通过 height 设置进度条高度（px），配合 textInside 可将文字显示在进度条内部。" :code="heightCode">
      <div class="demo-col">
        <NProgress :percent="50" :height="4" />
        <NProgress :percent="50" :height="12" />
        <NProgress :percent="65" :height="22" text-inside />
      </div>
    </DemoBlock>

    <!-- ────── 自定义颜色 ────── -->
    <DemoBlock title="自定义颜色" description="通过 color 覆盖默认颜色，优先级高于 status。" :code="colorCode">
      <div class="demo-col">
        <NProgress :percent="40" color="#8b5cf6" />
        <NProgress :percent="70" color="#f97316" />
        <NProgress :percent="90" color="#06b6d4" />
      </div>
    </DemoBlock>

    <!-- ────── 条纹与动画 ────── -->
    <DemoBlock title="条纹与动画" description="设置 stripe 显示条纹背景，设置 animated 开启滚动动画效果。" :code="stripeCode">
      <div class="demo-col">
        <NProgress :percent="50" stripe />
        <NProgress :percent="70" stripe animated />
        <NProgress :percent="80" stripe animated status="success" />
      </div>
    </DemoBlock>

    <!-- ────── 隐藏与格式化文字 ────── -->
    <DemoBlock title="隐藏与格式化文字" description="设置 show-text 为 false 隐藏百分比文字；通过 format 自定义文字内容。" :code="textCode">
      <div class="demo-col">
        <NProgress :percent="45" :show-text="false" />
        <NProgress :percent="80" :format="p => `${p} / 100`" />
        <NProgress :percent="100" status="success" :format="() => '完成 ✓'" />
      </div>
    </DemoBlock>

    <!-- ────── 环形进度条 ────── -->
    <DemoBlock title="环形进度条" description="设置 type 为 circle，可配置 size 和 stroke-width。" :code="circleCode">
      <NSpace :size="32" align="center">
        <NProgress type="circle" :percent="30" />
        <NProgress type="circle" :percent="75" status="warning" />
        <NProgress type="circle" :percent="100" status="success" />
        <NProgress type="circle" :percent="50" status="error" :size="100" :stroke-width="8" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 仪表盘 ────── -->
    <DemoBlock title="仪表盘" description="设置 type 为 dashboard，呈现 270° 扇区仪表盘样式。" :code="dashboardCode">
      <NSpace :size="32" align="center">
        <NProgress type="dashboard" :percent="30" />
        <NProgress type="dashboard" :percent="75" status="warning" />
        <NProgress type="dashboard" :percent="100" status="success" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 动态进度 ────── -->
    <DemoBlock title="动态进度" description="结合响应式变量实现动态进度演示。" :code="dynamicCode">
      <div class="demo-col">
        <NProgress :percent="dynamicPercent" />
        <NSpace :size="8">
          <NButton size="sm" variant="secondary" @click="dynamicPercent = Math.max(0, dynamicPercent - 10)">-10%</NButton>
          <NButton size="sm" @click="dynamicPercent = Math.min(100, dynamicPercent + 10)">+10%</NButton>
          <NButton size="sm" variant="danger" @click="dynamicPercent = 0">重置</NButton>
        </NSpace>
      </div>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const dynamicPercent = ref(40)

const basicCode = `<NProgress :percent="30" />
<NProgress :percent="60" />
<NProgress :percent="100" status="success" />`

const statusCode = `<NProgress :percent="70" />
<NProgress :percent="100" status="success" />
<NProgress :percent="50" status="warning" />
<NProgress :percent="30" status="error" />`

const heightCode = `<NProgress :percent="50" :height="4" />
<NProgress :percent="50" :height="12" />
<NProgress :percent="65" :height="22" text-inside />`

const colorCode = `<NProgress :percent="40" color="#8b5cf6" />
<NProgress :percent="70" color="#f97316" />
<NProgress :percent="90" color="#06b6d4" />`

const stripeCode = `<NProgress :percent="50" stripe />
<NProgress :percent="70" stripe animated />
<NProgress :percent="80" stripe animated status="success" />`

const textCode = `<NProgress :percent="45" :show-text="false" />
<NProgress :percent="80" :format="p => \`\${p} / 100\`" />
<NProgress :percent="100" status="success" :format="() => '完成 ✓'" />`

const circleCode = `<NProgress type="circle" :percent="30" />
<NProgress type="circle" :percent="75" status="warning" />
<NProgress type="circle" :percent="100" status="success" />
<NProgress type="circle" :percent="50" status="error" :size="100" :stroke-width="8" />`

const dashboardCode = `<NProgress type="dashboard" :percent="30" />
<NProgress type="dashboard" :percent="75" status="warning" />
<NProgress type="dashboard" :percent="100" status="success" />`

const dynamicCode = `<NProgress :percent="percent" />
<NButton size="sm" variant="secondary" @click="percent = Math.max(0, percent - 10)">-10%</NButton>
<NButton size="sm" @click="percent = Math.min(100, percent + 10)">+10%</NButton>
<NButton size="sm" variant="danger" @click="percent = 0">重置</NButton>`

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
  { name: 'percent', type: 'number', default: '—', desc: '百分比（必填，范围 0-100）' },
  { name: 'type', type: "'line' | 'circle' | 'dashboard'", default: "'line'", desc: '进度条类型' },
  { name: 'height', type: 'number', default: '8', desc: '线形进度条高度(px)' },
  { name: 'color', type: 'string', default: '—', desc: '自定义颜色，优先级高于 status' },
  { name: 'showText', type: 'boolean', default: 'true', desc: '是否显示百分比文字' },
  { name: 'textInside', type: 'boolean', default: 'false', desc: '线形进度条文字是否内显（需较大 height）' },
  { name: 'status', type: "'default' | 'success' | 'warning' | 'error'", default: "'default'", desc: '状态' },
  { name: 'stripe', type: 'boolean', default: 'false', desc: '是否显示条纹背景' },
  { name: 'animated', type: 'boolean', default: 'false', desc: '条纹是否开启滚动动画（需 stripe 为 true）' },
  { name: 'strokeWidth', type: 'number', default: '6', desc: '环形/仪表盘进度条宽度' },
  { name: 'size', type: 'number', default: '120', desc: '环形/仪表盘尺寸(px)' },
  { name: 'format', type: '(percent: number) => string', default: '—', desc: '自定义文字格式化函数' },
]

const slotData = [
  { name: 'default', desc: '暂无，可通过 format 自定义文字' },
]
</script>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
