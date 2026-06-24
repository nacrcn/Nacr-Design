<template>
  <div class="doc-page">
    <h1>Tour 漫游式引导</h1>
    <p class="doc-page__desc">用于分步引导用户了解产品功能的气泡组件。通过高亮目标区域并展示引导提示，帮助用户快速熟悉产品功能。</p>

    <!-- ────── 综合演示 ────── -->
    <DemoBlock
      title="综合演示"
      description="模拟一个简洁的管理后台界面，点击「开始引导」开启完整的漫游式引导流程。"
      :code="combinedCode"
    >
      <div class="tour-demo-app">
        <div class="tour-demo-app__navbar">
          <span class="tour-demo-app__logo">NacrDesign</span>
          <NSpace>
            <NButton ref="navBtnRef" data-tour="nav-btn" size="sm" variant="outline">
              <template #icon><NIcon name="sousuo" /></template>
            </NButton>
            <NButton ref="navNotifyRef" data-tour="nav-notify" size="sm" variant="outline">
              <template #icon><NIcon name="xiaoxi" /></template>
            </NButton>
            <NButton ref="navUserRef" data-tour="nav-user" size="sm" variant="outline">
              <template #icon><NIcon name="yonghu" /></template>
            </NButton>
          </NSpace>
        </div>
        <div class="tour-demo-app__body">
          <div class="tour-demo-app__sidebar" data-tour="sidebar">
            <div class="tour-demo-app__menu-item tour-demo-app__menu-item--active">
              <NIcon name="shouye" size="16" /> 首页
            </div>
            <div class="tour-demo-app__menu-item">
              <NIcon name="dingdan" size="16" /> 订单
            </div>
            <div class="tour-demo-app__menu-item">
              <NIcon name="shezhi" size="16" /> 设置
            </div>
            <div class="tour-demo-app__menu-item">
              <NIcon name="bangzhu" size="16" /> 帮助
            </div>
          </div>
          <div class="tour-demo-app__main">
            <div class="tour-demo-app__card" data-tour="stats">
              <div class="tour-demo-app__stat">
                <div class="tour-demo-app__stat-value">1,280</div>
                <div class="tour-demo-app__stat-label">总订单</div>
              </div>
              <div class="tour-demo-app__stat">
                <div class="tour-demo-app__stat-value">86%</div>
                <div class="tour-demo-app__stat-label">完成率</div>
              </div>
              <div class="tour-demo-app__stat">
                <div class="tour-demo-app__stat-value">¥52.8k</div>
                <div class="tour-demo-app__stat-label">总收入</div>
              </div>
            </div>
            <div class="tour-demo-app__card tour-demo-app__card--action" data-tour="action-area">
              <div class="tour-demo-app__action-placeholder">
                <NIcon name="chuangzuo" size="24" />
                <span>快捷操作区</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 12px;">
        <NButton type="primary" @click="combinedOpen = true">开始引导</NButton>
      </div>
      <NTour v-model:open="combinedOpen" v-model:current="combinedCurrent" :steps="combinedSteps" />
    </DemoBlock>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="最简单的引导，通过 steps 定义引导步骤，使用 v-model:open 控制显隐。" :code="basicCode">
      <NButton data-tour="basic-target" type="primary">引导目标</NButton>
      <div style="margin-top: 12px;">
        <NButton @click="basicOpen = true">开始引导</NButton>
      </div>
      <NTour v-model:open="basicOpen" :steps="basicSteps" />
    </DemoBlock>

    <!-- ────── 弹出位置 ────── -->
    <DemoBlock title="弹出位置" description="通过 placement 属性设置气泡弹出方向，支持 12 个方位。" :code="placementCode">
      <div class="tour-placement-grid">
        <NButton data-tour="placement-target" variant="outline">目标元素</NButton>
      </div>
      <NSpace style="margin-top: 12px; flex-wrap: wrap;">
        <NButton size="sm" @click="startPlacementTour('top')">上</NButton>
        <NButton size="sm" @click="startPlacementTour('top-start')">上左</NButton>
        <NButton size="sm" @click="startPlacementTour('top-end')">上右</NButton>
        <NButton size="sm" @click="startPlacementTour('bottom')">下</NButton>
        <NButton size="sm" @click="startPlacementTour('bottom-start')">下左</NButton>
        <NButton size="sm" @click="startPlacementTour('bottom-end')">下右</NButton>
        <NButton size="sm" @click="startPlacementTour('left')">左</NButton>
        <NButton size="sm" @click="startPlacementTour('right')">右</NButton>
      </NSpace>
      <NTour v-model:open="placementOpen" :steps="placementSteps" />
    </DemoBlock>

    <!-- ────── 无遮罩模式 ────── -->
    <DemoBlock title="无遮罩模式" description="设置 mask 为 false 关闭遮罩，用户可以正常操作页面其他区域。" :code="noMaskCode">
      <NButton data-tour="nomask-target" variant="outline">引导目标</NButton>
      <div style="margin-top: 12px;">
        <NButton @click="noMaskOpen = true">无遮罩引导</NButton>
      </div>
      <NTour v-model:open="noMaskOpen" :steps="noMaskSteps" :mask="false" />
    </DemoBlock>

    <!-- ────── 自定义按钮文字 ────── -->
    <DemoBlock title="自定义按钮文字" description="通过 prevText、nextText、finishText 自定义底部按钮文字。" :code="customTextCode">
      <NButton data-tour="custom-target" variant="outline">引导目标</NButton>
      <div style="margin-top: 12px;">
        <NButton @click="customTextOpen = true">自定义文字</NButton>
      </div>
      <NTour v-model:open="customTextOpen" :steps="customTextSteps" prev-text="返回" next-text="继续" finish-text="知道了" />
    </DemoBlock>

    <!-- ────── 自定义步骤内容 ────── -->
    <DemoBlock title="自定义步骤内容" description="使用 #step-{index} 作用域插槽自定义每一步的描述内容。" :code="slotCode">
      <NButton data-tour="slot-target" variant="outline">引导目标</NButton>
      <div style="margin-top: 12px;">
        <NButton @click="slotOpen = true">自定义内容</NButton>
      </div>
      <NTour v-model:open="slotOpen" :steps="slotSteps">
        <template #step-1="{ step }">
          <div style="padding: 4px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; color: var(--n-color-text);">{{ step.title }}</p>
            <div style="background: var(--n-color-primary-light, #eff6ff); border-radius: 6px; padding: 10px 12px; font-size: 13px; color: var(--n-color-primary, #3b82f6); line-height: 1.6;">
              💡 提示：这是一个自定义插槽内容区域，可以放置任意组件和样式。
            </div>
          </div>
        </template>
      </NTour>
    </DemoBlock>

    <!-- ────── 事件回调 ────── -->
    <DemoBlock title="事件回调" description="监听 change、close、finish 事件，获取引导流程的状态变化。" :code="eventCode">
      <NButton data-tour="event-target" variant="outline">引导目标</NButton>
      <div style="margin-top: 12px;">
        <NButton @click="eventOpen = true">事件引导</NButton>
      </div>
      <p v-if="eventLog" style="margin-top: 8px; font-size: 13px; color: var(--n-color-text-secondary);">{{ eventLog }}</p>
      <NTour v-model:open="eventOpen" :steps="eventSteps" @change="onTourChange" @close="onTourClose" @finish="onTourFinish" />
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="TourStep" :columns="propColumns" :data="stepData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

/* ══════ 综合演示 ══════ */
const combinedOpen = ref(false)
const combinedCurrent = ref(0)
const combinedSteps = [
  { target: '[data-tour="nav-btn"]', title: '全局搜索', description: '点击搜索按钮可以快速查找系统中的订单、客户等信息。', placement: 'bottom' },
  { target: '[data-tour="nav-notify"]', title: '消息通知', description: '这里会显示系统通知和待办提醒，实时掌握重要信息。', placement: 'bottom' },
  { target: '[data-tour="nav-user"]', title: '用户菜单', description: '点击头像可以查看个人设置、切换账号或退出登录。', placement: 'bottom-end' },
  { target: '[data-tour="sidebar"]', title: '导航菜单', description: '左侧菜单提供页面快速导航，当前激活项会高亮显示。', placement: 'right-start' },
  { target: '[data-tour="stats"]', title: '数据概览', description: '顶部卡片展示关键业务指标，帮助你快速了解整体情况。', placement: 'bottom' },
  { target: '[data-tour="action-area"]', title: '快捷操作', description: '常用操作集中在这里，支持新建、导入、导出等快捷功能。', placement: 'bottom' },
]

/* ══════ 基础用法 ══════ */
const basicOpen = ref(false)
const basicSteps = [
  { target: '[data-tour="basic-target"]', title: '欢迎', description: '这是一个简单的引导示例，点击「下一步」继续。' },
  { target: '[data-tour="basic-target"]', title: '功能介绍', description: 'Tour 组件可以帮助你快速引导用户了解产品功能。' },
  { target: '[data-tour="basic-target"]', title: '开始使用', description: '引导完成后，用户可以自行探索产品的其他功能。' },
]

/* ══════ 弹出位置 ══════ */
const placementOpen = ref(false)
const placementSteps = ref([
  { target: '[data-tour="placement-target"]', title: '弹出位置', description: '当前弹出位置：bottom' },
])
function startPlacementTour(p: string) {
  placementSteps.value = [
    { target: '[data-tour="placement-target"]', title: '弹出位置', description: `当前弹出位置：${p}`, placement: p as any },
  ]
  placementOpen.value = true
}

/* ══════ 无遮罩 ══════ */
const noMaskOpen = ref(false)
const noMaskSteps = [
  { target: '[data-tour="nomask-target"]', title: '无遮罩模式', description: '无遮罩模式下，用户仍然可以操作页面其他区域。', placement: 'bottom' },
  { target: '[data-tour="nomask-target"]', title: '自由操作', description: '适合需要在引导过程中让用户交互的场景。', placement: 'bottom' },
]

/* ══════ 自定义按钮文字 ══════ */
const customTextOpen = ref(false)
const customTextSteps = [
  { target: '[data-tour="custom-target"]', title: '第一步', description: '自定义底部按钮文字可以让引导更贴合产品调性。', placement: 'bottom' },
  { target: '[data-tour="custom-target"]', title: '第二步', description: '比如教程类产品可以用"继续"代替"下一步"。', placement: 'bottom' },
]

/* ══════ 自定义步骤内容 ══════ */
const slotOpen = ref(false)
const slotSteps = [
  { target: '[data-tour="slot-target"]', title: '默认内容', description: '这是使用默认 description 渲染的步骤内容。', placement: 'bottom' },
  { target: '[data-tour="slot-target"]', title: '自定义内容', description: '这段内容会被插槽覆盖。', placement: 'bottom' },
]

/* ══════ 事件回调 ══════ */
const eventOpen = ref(false)
const eventLog = ref('')
const eventSteps = [
  { target: '[data-tour="event-target"]', title: '步骤一', description: '引导开始，触发 change 事件。', placement: 'bottom' },
  { target: '[data-tour="event-target"]', title: '步骤二', description: '切换步骤，再次触发 change 事件。', placement: 'bottom' },
]
function onTourChange(current: number) {
  eventLog.value = `change 事件触发，当前步骤：${current}`
}
function onTourClose(current: number) {
  eventLog.value = `close 事件触发，关闭时步骤：${current}`
}
function onTourFinish() {
  eventLog.value = 'finish 事件触发，引导完成！'
}

/* ══════ 示例代码 ══════ */
const combinedCode = `<div class="app-layout">
  <div class="app-navbar">
    <span class="logo">NacrDesign</span>
    <NSpace>
      <NButton data-tour="nav-btn" size="sm" variant="outline">
        <template #icon><NIcon name="sousuo" /></template>
      </NButton>
      <NButton data-tour="nav-notify" size="sm" variant="outline">
        <template #icon><NIcon name="xiaoxi" /></template>
      </NButton>
      <NButton data-tour="nav-user" size="sm" variant="outline">
        <template #icon><NIcon name="yonghu" /></template>
      </NButton>
    </NSpace>
  </div>
  <div class="app-sidebar" data-tour="sidebar">...</div>
  <div class="app-stats" data-tour="stats">...</div>
  <div class="app-action" data-tour="action-area">...</div>
</div>

<NButton type="primary" @click="open = true">开始引导</NButton>

<NTour v-model:open="open" v-model:current="current" :steps="steps" />

const steps = [
  { target: '[data-tour="nav-btn"]', title: '全局搜索', description: '点击搜索按钮可以快速查找系统中的订单、客户等信息。', placement: 'bottom' },
  { target: '[data-tour="nav-notify"]', title: '消息通知', description: '这里会显示系统通知和待办提醒。', placement: 'bottom' },
  { target: '[data-tour="nav-user"]', title: '用户菜单', description: '点击头像可以查看个人设置。', placement: 'bottom-end' },
  { target: '[data-tour="sidebar"]', title: '导航菜单', description: '左侧菜单提供页面快速导航。', placement: 'right-start' },
  { target: '[data-tour="stats"]', title: '数据概览', description: '顶部卡片展示关键业务指标。', placement: 'bottom' },
  { target: '[data-tour="action-area"]', title: '快捷操作', description: '常用操作集中在这里。', placement: 'bottom' },
]`

const basicCode = `<NButton data-tour="basic-target" type="primary">引导目标</NButton>
<NButton @click="open = true">开始引导</NButton>

<NTour v-model:open="open" :steps="steps" />

const steps = [
  { target: '[data-tour="basic-target"]', title: '欢迎', description: '这是一个简单的引导示例。' },
  { target: '[data-tour="basic-target"]', title: '功能介绍', description: 'Tour 组件可以帮助你快速引导用户了解产品功能。' },
  { target: '[data-tour="basic-target"]', title: '开始使用', description: '引导完成后，用户可以自行探索产品的其他功能。' },
]`

const placementCode = `<NButton data-tour="target" variant="outline">目标元素</NButton>

<NTour v-model:open="open" :steps="steps" />

// 设置 placement 改变弹出方向
const steps = [
  { target: '[data-tour="target"]', title: '弹出位置', description: '当前：top', placement: 'top' },
]`

const noMaskCode = `<NButton data-tour="target" variant="outline">引导目标</NButton>
<NButton @click="open = true">无遮罩引导</NButton>

<NTour v-model:open="open" :steps="steps" :mask="false" />

const steps = [
  { target: '[data-tour="target"]', title: '无遮罩模式', description: '无遮罩下用户可以正常操作页面。', placement: 'bottom' },
]`

const customTextCode = `<NButton data-tour="target" variant="outline">引导目标</NButton>
<NButton @click="open = true">自定义文字</NButton>

<NTour
  v-model:open="open"
  :steps="steps"
  prev-text="返回"
  next-text="继续"
  finish-text="知道了"
/>`

const slotCode = `<NButton data-tour="target" variant="outline">引导目标</NButton>

<NTour v-model:open="open" :steps="steps">
  <template #step-1="{ step }">
    <div>
      <p style="font-weight: 600">{{ step.title }}</p>
      <div style="background: var(--n-color-primary-light); border-radius: 6px; padding: 10px;">
        💡 自定义插槽内容
      </div>
    </div>
  </template>
</NTour>`

const eventCode = `<NButton data-tour="target" variant="outline">引导目标</NButton>

<NTour
  v-model:open="open"
  :steps="steps"
  @change="(current) => console.log('步骤变化', current)"
  @close="(current) => console.log('关闭引导', current)"
  @finish="() => console.log('引导完成')"
/>`

/* ══════ API 表格 ══════ */
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

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'steps', type: 'TourStep[]', default: '—', desc: '引导步骤数据（必填）' },
  { name: 'current', type: 'number', default: '0', desc: '当前步骤索引，支持 v-model:current' },
  { name: 'open', type: 'boolean', default: 'false', desc: '是否显示引导，支持 v-model:open' },
  { name: 'placement', type: 'Placement', default: "'bottom'", desc: '气泡默认弹出位置，可被步骤单独覆盖' },
  { name: 'mask', type: 'boolean', default: 'true', desc: '是否显示遮罩' },
  { name: 'showClose', type: 'boolean', default: 'true', desc: '是否显示关闭按钮' },
  { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: '点击遮罩是否关闭引导' },
  { name: 'scrollIntoView', type: 'boolean', default: 'true', desc: '是否自动滚动到目标元素' },
  { name: 'prevText', type: 'string', default: "'上一步'", desc: '上一步按钮文字' },
  { name: 'nextText', type: 'string', default: "'下一步'", desc: '下一步按钮文字' },
  { name: 'finishText', type: 'string', default: "'完成'", desc: '完成按钮文字' },
  { name: 'gap', type: 'number', default: '8', desc: '气泡与目标元素的间距（px）' },
]

const stepData = [
  { name: 'target', type: 'string', default: '—', desc: '目标元素 CSS 选择器（必填）' },
  { name: 'title', type: 'string', default: '—', desc: '步骤标题' },
  { name: 'description', type: 'string', default: '—', desc: '步骤描述内容' },
  { name: 'placement', type: 'Placement', default: '—', desc: '该步骤的弹出位置，优先级高于全局 placement' },
]

const eventData = [
  { name: 'change', type: '(current: number) => void', desc: '当前步骤变化时触发' },
  { name: 'close', type: '(current: number) => void', desc: '关闭引导时触发' },
  { name: 'finish', type: '() => void', desc: '引导完成时触发' },
]

const slotData = [
  { name: 'step-{index}', desc: '自定义第 index 步的内容，作用域参数 { step, current }' },
]

const methodData = [
  { name: 'updatePos', type: '() => void', desc: '手动更新气泡位置' },
]
</script>

<style scoped>
/* ── 综合演示 - 模拟界面 ── */
.tour-demo-app {
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  overflow: hidden;
  background: var(--nd-color-bg, #fff);
  max-width: 560px;
}

.tour-demo-app__navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--nd-color-border, #e5e7eb);
  background: var(--n-color-bg-elevated, #fff);
}

.tour-demo-app__logo {
  font-weight: 700;
  font-size: 15px;
  color: var(--n-color-primary, #3b82f6);
}

.tour-demo-app__body {
  display: flex;
  min-height: 160px;
}

.tour-demo-app__sidebar {
  width: 120px;
  border-right: 1px solid var(--nd-color-border, #e5e7eb);
  padding: 8px 0;
  flex-shrink: 0;
}

.tour-demo-app__menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--n-color-text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s;
}

.tour-demo-app__menu-item:hover {
  background: var(--n-color-fill-hover, #f3f4f6);
  color: var(--n-color-text, #1f2937);
}

.tour-demo-app__menu-item--active {
  color: var(--n-color-primary, #3b82f6);
  background: var(--n-color-primary-light, #eff6ff);
  font-weight: 500;
}

.tour-demo-app__main {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tour-demo-app__card {
  background: var(--n-color-fill-quaternary, #f9fafb);
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-lg, 8px);
  padding: 16px;
  display: flex;
  gap: 24px;
  justify-content: space-around;
}

.tour-demo-app__stat {
  text-align: center;
}

.tour-demo-app__stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--n-color-text, #1f2937);
  line-height: 1.3;
}

.tour-demo-app__stat-label {
  font-size: 12px;
  color: var(--n-color-text-tertiary, #9ca3af);
  margin-top: 2px;
}

.tour-demo-app__card--action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-demo-app__action-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--n-color-text-tertiary, #9ca3af);
  font-size: 13px;
}

/* ── 弹出位置网格 ── */
.tour-placement-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}
</style>
