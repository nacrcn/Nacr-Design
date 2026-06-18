<template>
  <div class="doc-page">
    <h1>Affix 固钉</h1>
    <p class="doc-page__desc">将页面元素固定在可视区域，常用于导航栏、工具栏或侧边栏的吸顶/吸底效果。</p>

    <!-- ────── 顶部固钉 ────── -->
    <DemoBlock title="顶部固钉" description="设置 offsetTop 使元素在滚动到指定位置后固定在顶部。" :code="topCode">
      <div class="affix-area">
        <NAffix :offset-top="60">
          <NButton variant="primary">固定在顶部 60px</NButton>
        </NAffix>
        <p class="affix-hint">↑ 向上滚动页面查看固钉效果</p>
      </div>
    </DemoBlock>

    <!-- ────── 底部固钉 ────── -->
    <DemoBlock title="底部固钉" description="设置 offsetBottom 使元素固定在底部。" :code="bottomCode">
      <div class="affix-area">
        <NAffix :offset-bottom="40">
          <NButton variant="secondary">固定在底部 40px</NButton>
        </NAffix>
        <p class="affix-hint">↓ 向下滚动页面查看固钉效果</p>
      </div>
    </DemoBlock>

    <!-- ────── 固定状态回调 ────── -->
    <DemoBlock title="固定状态回调" description="监听 change 事件，在固定状态变化时执行逻辑。" :code="changeCode">
      <div class="affix-area">
        <NAffix :offset-top="60" @change="onAffixChange">
          <NButton :variant="affixFixed ? 'primary' : 'secondary'">
            {{ affixFixed ? '已固定 ✓' : '未固定' }}
          </NButton>
        </NAffix>
        <p class="affix-hint">当前状态：{{ affixFixed ? '固定' : '未固定' }}</p>
      </div>
    </DemoBlock>

    <!-- ────── 滚动事件 ────── -->
    <DemoBlock title="滚动事件" description="监听 scroll 事件获取实时滚动信息。" :code="scrollCode">
      <div class="affix-area">
        <NAffix :offset-top="60" @scroll="onAffixScroll">
          <NButton variant="secondary">滚动查看信息</NButton>
        </NAffix>
        <p class="affix-hint">scrollTop: {{ scrollInfo.scrollTop }}，affixTop: {{ scrollInfo.affixTop }}</p>
      </div>
    </DemoBlock>

    <!-- ────── 容器内固钉 ────── -->
    <DemoBlock title="容器内固钉" description="通过 target 属性指定固钉的滚动容器，固钉仅在容器范围内生效。" :code="targetCode">
      <div ref="containerRef" class="affix-container">
        <div class="affix-container__inner">
          <NAffix :target="() => containerRef" :offset-top="0">
            <div class="affix-container__bar">容器顶部固钉</div>
          </NAffix>
          <div v-for="i in 20" :key="i" class="affix-container__item">
            第 {{ i }} 行内容
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 禁用固钉 ────── -->
    <DemoBlock title="禁用固钉" description="通过 disabled 属性临时禁用固钉功能。" :code="disabledCode">
      <div class="affix-area">
        <NSpace vertical :size="12">
          <NSwitch v-model="affixEnabled" />
          <NAffix :offset-top="60" :disabled="!affixEnabled">
            <NButton variant="secondary">{{ affixEnabled ? '固钉已启用' : '固钉已禁用' }}</NButton>
          </NAffix>
        </NSpace>
        <p class="affix-hint">切换开关 {{ affixEnabled ? '启用' : '禁用' }}固钉</p>
      </div>
    </DemoBlock>

    <!-- ────── 自定义层级 ────── -->
    <DemoBlock title="自定义层级" description="通过 z-index 控制固钉的堆叠层级。" :code="zIndexCode">
      <div class="affix-area">
        <NAffix :offset-top="60" :z-index="999">
          <NButton variant="secondary">z-index: 999</NButton>
        </NAffix>
        <p class="affix-hint">默认 z-index 为 100，此处设为 999</p>
      </div>
    </DemoBlock>

    <!-- ────── 多元素固钉 ────── -->
    <DemoBlock title="多元素固钉" description="同时固定多个元素，使用不同的 offsetTop 值实现分层效果。" :code="multiCode">
      <div class="affix-area">
        <NAffix :offset-top="60">
          <div class="affix-bar affix-bar--1">第一层 — offsetTop: 60</div>
        </NAffix>
        <NAffix :offset-top="100">
          <div class="affix-bar affix-bar--2">第二层 — offsetTop: 100</div>
        </NAffix>
        <p class="affix-hint">滚动页面查看分层固钉效果</p>
      </div>
    </DemoBlock>

    <!-- 底部留白，确保页面足够长能滚动 -->
    <div class="affix-spacer" />

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const affixFixed = ref(false)
const affixEnabled = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const scrollInfo = reactive({ scrollTop: 0, affixTop: 0 })

function onAffixChange(fixed: boolean) {
  affixFixed.value = fixed
}

function onAffixScroll(info: { fixed: boolean; scrollTop: number; affixTop: number }) {
  scrollInfo.scrollTop = info.scrollTop
  scrollInfo.affixTop = info.affixTop
}

const topCode = `<NAffix :offset-top="60">
  <NButton>固定在顶部 60px</NButton>
</NAffix>`

const bottomCode = `<NAffix :offset-bottom="40">
  <NButton>固定在底部 40px</NButton>
</NAffix>`

const changeCode = `<NAffix :offset-top="60" @change="onAffixChange">
  <NButton :variant="affixFixed ? 'primary' : 'secondary'">
    {{ affixFixed ? '已固定 ✓' : '未固定' }}
  </NButton>
</NAffix>`

const scrollCode = `<NAffix :offset-top="60" @scroll="onAffixScroll">
  <NButton>滚动查看信息</NButton>
</NAffix>`

const targetCode = `<div ref="containerRef" style="height:300px;overflow:auto;">
  <NAffix :target="() => containerRef" :offset-top="0">
    <div>容器顶部固钉</div>
  </NAffix>
  <!-- 长内容... -->
</div>`

const disabledCode = `<NSwitch v-model="affixEnabled" />
<NAffix :offset-top="60" :disabled="!affixEnabled">
  <NButton>{{ affixEnabled ? '固钉已启用' : '固钉已禁用' }}</NButton>
</NAffix>`

const zIndexCode = `<NAffix :offset-top="60" :z-index="999">
  <NButton>z-index: 999</NButton>
</NAffix>`

const multiCode = `<NAffix :offset-top="60">
  <div>第一层 — offsetTop: 60</div>
</NAffix>
<NAffix :offset-top="100">
  <div>第二层 — offsetTop: 100</div>
</NAffix>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'offsetTop', type: 'number', default: '0', desc: '距离顶部偏移(px)，触发固定的位置' },
  { name: 'offsetBottom', type: 'number', default: '—', desc: '距离底部偏移(px)，设置后按底部计算' },
  { name: 'target', type: '() => HTMLElement | null', default: '—', desc: '固钉的滚动容器，默认为视口' },
  { name: 'zIndex', type: 'number', default: '100', desc: '固钉元素的 z-index 层级' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用固钉功能' },
]

const eventData = [
  { name: 'change', type: '(fixed: boolean) => void', desc: '固定状态变化时触发' },
  { name: 'scroll', type: '(info: { fixed, scrollTop, affixTop }) => void', desc: '滚动时触发，返回实时滚动信息' },
]
</script>

<style scoped>
.affix-area {
  min-height: 120px;
  padding: 16px 0;
}

.affix-hint {
  margin-top: 16px;
  color: var(--n-color-text-tertiary);
  font-size: 13px;
}

.affix-container {
  height: 320px;
  overflow: auto;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  background: var(--n-color-bg);
}

.affix-container__inner {
  position: relative;
  padding: 0;
}

.affix-container__bar {
  padding: 10px 16px;
  background: var(--n-color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.affix-container__item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--n-color-border);
  color: var(--n-color-text-secondary);
  font-size: 13px;
}

.affix-bar {
  display: inline-block;
  padding: 8px 20px;
  border-radius: var(--n-radius-md);
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.affix-bar--1 {
  background: var(--n-color-primary);
}

.affix-bar--2 {
  background: var(--n-color-success, #10b981);
  margin-top: 8px;
}

.affix-spacer {
  height: 600px;
}
</style>
