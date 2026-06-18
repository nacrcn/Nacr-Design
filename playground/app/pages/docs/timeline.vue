<template>
  <div class="doc-page">
    <h1>Timeline 时间线</h1>
    <p class="doc-page__desc">用于展示时间顺序的信息流。</p>

    <DemoBlock title="基础用法" description="通过 items 传入时间线数据，每项可包含 title、content、time 字段。" :code="basicCode">
      <NTimeline :items="basicItems" />
    </DemoBlock>

    <DemoBlock title="不同类型" description="通过 type 字段设置节点颜色类型：default / primary / success / warning / danger。" :code="typeCode">
      <NTimeline :items="typeItems" />
    </DemoBlock>

    <DemoBlock title="带图标节点" description="通过 icon 字段指定内置图标名称，节点圆点将显示为图标。" :code="iconCode">
      <NTimeline :items="iconItems" />
    </DemoBlock>

    <DemoBlock title="交替展现" description="设置 mode='alternate'，时间线左右交替排列，time 显示在对面。" :code="alternateCode">
      <NTimeline mode="alternate" :items="alternateItems" />
    </DemoBlock>

    <DemoBlock title="右侧模式" description="设置 mode='right'，时间线内容显示在右侧，time 显示在更右侧。" :code="rightCode">
      <NTimeline mode="right" :items="rightItems" />
    </DemoBlock>

    <DemoBlock title="幽灵节点" description="设置 pending 显示未完成节点，字符串值可自定义提示文字。" :code="pendingCode">
      <NTimeline :items="pendingItems" pending="加载中..." />
    </DemoBlock>

    <DemoBlock title="倒序排列" description="设置 reverse 将时间线倒序展现。" :code="reverseCode">
      <NTimeline :items="reverseItems" reverse />
    </DemoBlock>

    <DemoBlock title="水平方向" description="设置 direction='horizontal'，时间线水平排列。" :code="horizontalCode">
      <NTimeline direction="horizontal" :items="horizontalItems" />
    </DemoBlock>

    <DemoBlock title="自定义圆点" description="通过 dot 字段传入 HTML 字符串作为自定义圆点。" :code="customDotCode">
      <NTimeline :items="customDotItems" />
    </DemoBlock>

    <DemoBlock title="事件回调" description="点击时间线项目时触发 select 事件。" :code="eventCode">
      <NTimeline :items="eventItems" />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        选中：{{ eventSelected || '未选中' }}
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="TimelineItem" :columns="itemColumns" :data="itemData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ===== 基础用法 =====
const basicItems = [
  { title: '创建项目', content: '项目已成功创建', time: '2024-01-01 10:00' },
  { title: '代码提交', content: '提交了第一个版本', time: '2024-01-02 14:30' },
  { title: '发布上线', content: '正式版本发布', time: '2024-01-05 09:00' },
]

const basicCode = `<template>
  <NTimeline :items="[
    { title: '创建项目', content: '项目已成功创建', time: '2024-01-01 10:00' },
    { title: '代码提交', content: '提交了第一个版本', time: '2024-01-02 14:30' },
    { title: '发布上线', content: '正式版本发布', time: '2024-01-05 09:00' },
  ]" />
</template>`

// ===== 不同类型 =====
const typeItems = [
  { title: '默认节点', content: '默认样式', type: 'default' as const },
  { title: '主要节点', content: '主题色', type: 'primary' as const },
  { title: '成功节点', content: '成功状态', type: 'success' as const },
  { title: '警告节点', content: '警告状态', type: 'warning' as const },
  { title: '危险节点', content: '危险状态', type: 'danger' as const },
]

const typeCode = `<template>
  <NTimeline :items="[
    { title: '默认节点', type: 'default' },
    { title: '主要节点', type: 'primary' },
    { title: '成功节点', type: 'success' },
    { title: '警告节点', type: 'warning' },
    { title: '危险节点', type: 'danger' },
  ]" />
</template>`

// ===== 带图标节点 =====
const iconItems = [
  { title: '项目创建', content: '初始化仓库', icon: 'chuangzuo', time: '2024-01-01' },
  { title: '构建成功', content: 'CI 流水线通过', icon: 'chenggong', type: 'success' as const, time: '2024-01-02' },
  { title: '问题警告', content: '存在潜在风险', icon: 'tanhao', type: 'warning' as const, time: '2024-01-03' },
  { title: '构建失败', content: '紧急修复', icon: 'shibai', type: 'danger' as const, time: '2024-01-04' },
  { title: '正式发布', content: '部署到生产环境', icon: 'shouye', type: 'primary' as const, time: '2024-01-05' },
]

const iconCode = `<template>
  <NTimeline :items="[
    { title: '项目创建', icon: 'chuangzuo', time: '2024-01-01' },
    { title: '构建成功', icon: 'chenggong', type: 'success', time: '2024-01-02' },
    { title: '问题警告', icon: 'tanhao', type: 'warning', time: '2024-01-03' },
    { title: '构建失败', icon: 'shibai', type: 'danger', time: '2024-01-04' },
    { title: '正式发布', icon: 'shouye', type: 'primary', time: '2024-01-05' },
  ]" />
</template>`

// ===== 交替展现 =====
const alternateItems = [
  { title: '需求评审', content: '与产品经理确认需求细则', time: '09:00' },
  { title: 'UI 设计', content: '完成交互与视觉稿', time: '11:30' },
  { title: '前端开发', content: '组件开发与联调', time: '14:00' },
  { title: '测试验收', content: '功能与回归测试', time: '16:00' },
  { title: '发布上线', content: '灰度发布并全量推送', time: '18:30' },
]

const alternateCode = `<template>
  <NTimeline mode="alternate" :items="[
    { title: '需求评审', content: '与产品经理确认需求细则', time: '09:00' },
    { title: 'UI 设计', content: '完成交互与视觉稿', time: '11:30' },
    { title: '前端开发', content: '组件开发与联调', time: '14:00' },
    { title: '测试验收', content: '功能与回归测试', time: '16:00' },
    { title: '发布上线', content: '灰度发布并全量推送', time: '18:30' },
  ]" />
</template>`

// ===== 右侧模式 =====
const rightItems = [
  { title: '提交代码', content: 'feat: 新增用户模块', time: '10:00' },
  { title: '代码审查', content: '已通过 Review', time: '12:00' },
  { title: '合并分支', content: 'merge into main', time: '14:00' },
]

const rightCode = `<template>
  <NTimeline mode="right" :items="[
    { title: '提交代码', content: 'feat: 新增用户模块', time: '10:00' },
    { title: '代码审查', content: '已通过 Review', time: '12:00' },
    { title: '合并分支', content: 'merge into main', time: '14:00' },
  ]" />
</template>`

// ===== 幽灵节点 =====
const pendingItems = [
  { title: '步骤一', content: '已完成', time: '2024-01-01' },
  { title: '步骤二', content: '已完成', time: '2024-01-02' },
  { title: '步骤三', content: '进行中', time: '2024-01-03', type: 'primary' as const },
]

const pendingCode = `<template>
  <NTimeline
    :items="[
      { title: '步骤一', content: '已完成', time: '2024-01-01' },
      { title: '步骤二', content: '已完成', time: '2024-01-02' },
      { title: '步骤三', content: '进行中', time: '2024-01-03', type: 'primary' },
    ]"
    pending="加载中..."
  />
</template>`

// ===== 倒序排列 =====
const reverseItems = [
  { title: '第一步', content: '需求分析', time: '2024-01-01' },
  { title: '第二步', content: '方案设计', time: '2024-01-05' },
  { title: '第三步', content: '开发实现', time: '2024-01-10' },
]

const reverseCode = `<template>
  <NTimeline
    :items="[
      { title: '第一步', content: '需求分析', time: '2024-01-01' },
      { title: '第二步', content: '方案设计', time: '2024-01-05' },
      { title: '第三步', content: '开发实现', time: '2024-01-10' },
    ]"
    reverse
  />
</template>`

// ===== 水平方向 =====
const horizontalItems = [
  { title: '需求', content: '需求分析', type: 'success' as const, time: '01-01' },
  { title: '设计', content: '方案设计', type: 'primary' as const, time: '01-05' },
  { title: '开发', content: '编写代码', type: 'warning' as const, time: '01-10' },
  { title: '测试', content: '质量验收', type: 'default' as const, time: '01-15' },
  { title: '上线', content: '部署发布', type: 'danger' as const, time: '01-20' },
]

const horizontalCode = `<template>
  <NTimeline
    direction="horizontal"
    :items="[
      { title: '需求', content: '需求分析', type: 'success', time: '01-01' },
      { title: '设计', content: '方案设计', type: 'primary', time: '01-05' },
      { title: '开发', content: '编写代码', type: 'warning', time: '01-10' },
      { title: '测试', content: '质量验收', type: 'default', time: '01-15' },
      { title: '上线', content: '部署发布', type: 'danger', time: '01-20' },
    ]"
  />
</template>`

// ===== 自定义圆点 =====
const customDotItems = [
  {
    title: '版本发布 v1.0',
    content: '首个正式版本',
    dot: '<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--n-color-success,#52c41a);color:#fff;font-size:12px;font-weight:bold;">1</span>',
    time: '2024-01-01',
  },
  {
    title: '版本发布 v2.0',
    content: '重大功能更新',
    dot: '<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--n-color-primary,#1677ff);color:#fff;font-size:12px;font-weight:bold;">2</span>',
    time: '2024-06-01',
  },
  {
    title: '版本发布 v3.0',
    content: '架构全面升级',
    dot: '<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--n-color-danger,#ff4d4f);color:#fff;font-size:12px;font-weight:bold;">3</span>',
    time: '2024-12-01',
  },
]

const customDotCode = `<template>
  <NTimeline :items="[
    {
      title: '版本发布 v1.0',
      content: '首个正式版本',
      dot: '<span style=\"...background:#52c41a;color:#fff\">1</span>',
      time: '2024-01-01',
    },
    {
      title: '版本发布 v2.0',
      content: '重大功能更新',
      dot: '<span style=\"...background:#1677ff;color:#fff\">2</span>',
      time: '2024-06-01',
    },
    {
      title: '版本发布 v3.0',
      content: '架构全面升级',
      dot: '<span style=\"...background:#ff4d4f;color:#fff\">3</span>',
      time: '2024-12-01',
    },
  ]" />
</template>`

// ===== 事件回调 =====
const eventItems = [
  { title: '点击我', content: '这是第一条', type: 'primary' as const },
  { title: '点击我', content: '这是第二条', type: 'success' as const },
  { title: '点击我', content: '这是第三条', type: 'warning' as const },
]

const eventSelected = ref('')

const eventCode = `<template>
  <NTimeline :items="items" />
</template>

<script setup lang="ts">
const items = [
  { title: '点击我', content: '这是第一条', type: 'primary' },
  { title: '点击我', content: '这是第二条', type: 'success' },
  { title: '点击我', content: '这是第三条', type: 'warning' },
]
<\/script>`

// ===== API Tables =====
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'items', type: 'TimelineItem[]', default: '—', desc: '时间线数据（必填）' },
  { name: 'mode', type: "'left' | 'right' | 'alternate'", default: "'left'", desc: '布局模式，alternate 为左右交替' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: '方向' },
  { name: 'pending', type: 'boolean | string', default: 'false', desc: '是否显示幽灵节点，字符串值作为节点文案' },
  { name: 'pendingTime', type: 'string', default: "''", desc: '幽灵节点的时间标签' },
  { name: 'reverse', type: 'boolean', default: 'false', desc: '是否倒序排列' },
  { name: 'labelPosition', type: "'bottom' | 'same'", default: "'bottom'", desc: '时间标签位置（仅在 mode=left 时生效）' },
]

const itemColumns = [
  { key: 'name', title: '字段', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const itemData = [
  { name: 'title', type: 'string', default: '—', desc: '标题' },
  { name: 'content', type: 'string', default: '—', desc: '描述内容' },
  { name: 'time', type: 'string', default: '—', desc: '时间标签' },
  { name: 'type', type: "'default' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'", desc: '节点颜色类型' },
  { name: 'icon', type: 'string', default: '—', desc: '内置图标名称（iconfont font_class）' },
  { name: 'dot', type: 'string | VNode', default: '—', desc: '自定义圆点（HTML 字符串或 VNode）' },
]
</script>
