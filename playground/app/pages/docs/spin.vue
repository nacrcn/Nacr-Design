<template>
  <div class="doc-page">
    <h1>Spin 加载中</h1>
    <p class="doc-page__desc">
      用于页面和区块的加载中状态，支持三种动画类型（点状、环形、菊花）、自定义颜色与尺寸、延迟显示、全屏加载等。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="默认三点弹跳动画，spinning 控制是否加载中。" :code="basicCode">
      <NSpace :size="24">
        <NSpin />
        <NSpin type="ring" />
        <NSpin type="spinner" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 三种类型 ────── -->
    <DemoBlock title="三种类型" description="通过 type 切换动画风格：dot（三点弹跳）、ring（环形旋转）、spinner（菊花旋转）。" :code="typeCode">
      <NSpace :size="40" align="center">
        <div class="spin-type-item">
          <NSpin type="dot" />
          <span class="spin-type-label">Dot</span>
        </div>
        <div class="spin-type-item">
          <NSpin type="ring" />
          <span class="spin-type-label">Ring</span>
        </div>
        <div class="spin-type-item">
          <NSpin type="spinner" />
          <span class="spin-type-label">Spinner</span>
        </div>
      </NSpace>
    </DemoBlock>

    <!-- ────── 不同尺寸 ────── -->
    <DemoBlock title="不同尺寸" description="提供 sm / md / lg 三种预设尺寸，也支持数字自定义。" :code="sizeCode">
      <NSpace :size="32" align="center" style="margin-bottom:12px">
        <NSpin size="sm" />
        <NSpin size="md" />
        <NSpin size="lg" />
      </NSpace>
      <NSpace :size="32" align="center">
        <NSpin type="ring" size="sm" />
        <NSpin type="ring" size="md" />
        <NSpin type="ring" size="lg" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 自定义颜色 ────── -->
    <DemoBlock title="自定义颜色" description="通过 color 自定义加载动画颜色。" :code="colorCode">
      <NSpace :size="32" align="center">
        <NSpin color="#8b5cf6" />
        <NSpin type="ring" color="#f97316" />
        <NSpin type="spinner" color="#06b6d4" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 加载提示文字 ────── -->
    <DemoBlock title="加载提示文字" description="通过 tip 在加载动画下方显示文字说明。" :code="tipCode">
      <NSpace :size="40" align="center">
        <NSpin tip="加载中..." />
        <NSpin type="ring" tip="请稍候" />
      </NSpace>
    </DemoBlock>

    <!-- ────── 容器加载 ────── -->
    <DemoBlock title="容器加载" description="将内容放在 Spin 内部，spinning 控制是否显示加载遮罩。" :code="containerCode">
      <div class="demo-col">
        <NSpin :spinning="isLoading" :tip="isLoading ? '加载中...' : ''">
          <div class="spin-container-demo">
            <p>这里是一段示例内容，当加载状态开启时会被模糊遮罩覆盖。</p>
            <p>关闭加载后可以正常交互，包括选中文字等操作。</p>
          </div>
        </NSpin>
        <NSpace :size="8">
          <NButton size="sm" variant="secondary" @click="toggleLoading">{{ isLoading ? '关闭加载' : '开启加载' }}</NButton>
        </NSpace>
      </div>
    </DemoBlock>

    <!-- ────── 延迟显示 ────── -->
    <DemoBlock title="延迟显示" description="设置 delay(ms) 避免加载状态闪烁，仅当 spinning 持续超过延迟时间后才显示。" :code="delayCode">
      <div class="demo-col">
        <NSpin :spinning="delayLoading" :delay="500" tip="加载中...">
          <div class="spin-container-demo">
            <p>快速切换不会触发加载动画（delay=500ms），只有在 500ms 后仍处于加载状态才会显示。</p>
          </div>
        </NSpin>
        <NSpace :size="8">
          <NButton size="sm" variant="secondary" @click="startDelayLoading">触发延迟加载（800ms 后关闭）</NButton>
        </NSpace>
      </div>
    </DemoBlock>

    <!-- ────── 全屏加载 ────── -->
    <DemoBlock title="全屏加载" description="设置 fullscreen 以全屏遮罩方式展示加载状态。" :code="fullscreenCode">
      <NButton @click="showFullscreen">显示全屏加载（2秒后关闭）</NButton>
      <NSpin fullscreen :spinning="fullscreenSpin" tip="加载中..." />
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const isLoading = ref(true)
function toggleLoading() { isLoading.value = !isLoading.value }

const delayLoading = ref(false)
function startDelayLoading() {
  delayLoading.value = true
  setTimeout(() => { delayLoading.value = false }, 800)
}

const fullscreenSpin = ref(false)
function showFullscreen() {
  fullscreenSpin.value = true
  setTimeout(() => { fullscreenSpin.value = false }, 2000)
}

const basicCode = `<NSpin />
<NSpin type="ring" />
<NSpin type="spinner" />`

const typeCode = `<NSpin type="dot" />
<NSpin type="ring" />
<NSpin type="spinner" />`

const sizeCode = `<NSpin size="sm" />
<NSpin size="md" />
<NSpin size="lg" />`

const colorCode = `<NSpin color="#8b5cf6" />
<NSpin type="ring" color="#f97316" />
<NSpin type="spinner" color="#06b6d4" />`

const tipCode = `<NSpin tip="加载中..." />
<NSpin type="ring" tip="请稍候" />`

const containerCode = `<NSpin :spinning="isLoading" tip="加载中...">
  <div>内容区域</div>
</NSpin>
<NButton @click="isLoading = !isLoading">切换加载</NButton>`

const delayCode = `<NSpin :spinning="loading" :delay="500" tip="加载中...">
  <div>内容区域</div>
</NSpin>`

const fullscreenCode = `<NSpin fullscreen :spinning="loading" />`

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
  { name: 'spinning', type: 'boolean', default: 'true', desc: '是否处于加载中状态' },
  { name: 'type', type: "'dot' | 'ring' | 'spinner'", default: "'dot'", desc: '动画类型' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", desc: '尺寸，数字为像素值' },
  { name: 'color', type: 'string', default: '—', desc: '自定义颜色，优先级高于主题色' },
  { name: 'tip', type: 'string', default: '—', desc: '加载提示文字' },
  { name: 'delay', type: 'number', default: '0', desc: '延迟显示时间(ms)，避免闪烁' },
  { name: 'fullscreen', type: 'boolean', default: 'false', desc: '是否全屏显示' },
]

const slotData = [
  { name: 'default', desc: '需要加载遮罩的内容区域' },
]
</script>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.spin-container-demo {
  padding: 24px;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  color: var(--n-color-text-secondary);
  line-height: 1.8;
}
.spin-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.spin-type-label {
  font-size: var(--n-font-size-sm);
  color: var(--n-color-text-secondary);
}
</style>
