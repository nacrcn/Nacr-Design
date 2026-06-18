<template>
  <div class="doc-page">
    <h1>Steps 步骤条</h1>
    <p class="doc-page__desc">引导用户按照流程完成任务的分步导航条，支持水平和垂直方向、自定义图标、点状样式等。</p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 items 定义步骤，current 设置当前步骤（从 0 开始）。" :code="basicCode">
      <NSteps :items="basicItems" :current="current1" />
      <NSpace style="margin-top:16px;">
        <NButton size="sm" :disabled="current1 <= 0" @click="current1--">上一步</NButton>
        <NButton size="sm" :disabled="current1 >= basicItems.length - 1" @click="current1++">下一步</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── 不同状态 ────── -->
    <DemoBlock title="不同状态" description="可对每个步骤单独设置 status：wait / process / finish / error。" :code="statusCode">
      <NSteps :items="statusItems" :current="1" />
    </DemoBlock>

    <!-- ────── 错误状态 ────── -->
    <DemoBlock title="错误状态" description="设置 status 为 error 标记当前步骤出错。" :code="errorCode">
      <NSteps :items="errorItems" :current="1" status="error" />
    </DemoBlock>

    <!-- ────── 垂直方向 ────── -->
    <DemoBlock title="垂直方向" description="设置 direction 为 vertical 垂直排列。" :code="verticalCode">
      <div style="max-width:400px;">
        <NSteps :items="basicItems" :current="current2" direction="vertical" />
        <NSpace style="margin-top:16px;">
          <NButton size="sm" :disabled="current2 <= 0" @click="current2--">上一步</NButton>
          <NButton size="sm" :disabled="current2 >= basicItems.length - 1" @click="current2++">下一步</NButton>
        </NSpace>
      </div>
    </DemoBlock>

    <!-- ────── 点状样式 ────── -->
    <DemoBlock title="点状样式" description="设置 dot 为 true 使用点状步骤条，适合简单场景。" :code="dotCode">
      <NSteps :items="dotItems" :current="current3" dot />
      <NSpace style="margin-top:16px;">
        <NButton size="sm" :disabled="current3 <= 0" @click="current3--">上一步</NButton>
        <NButton size="sm" :disabled="current3 >= dotItems.length - 1" @click="current3++">下一步</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── 迷你尺寸 ────── -->
    <DemoBlock title="迷你尺寸" description="设置 size 为 sm 缩小步骤条。" :code="smallCode">
      <NSteps :items="basicItems" :current="1" size="sm" />
    </DemoBlock>

    <!-- ────── 可点击切换 ────── -->
    <DemoBlock title="可点击切换" description="设置 clickable 允许点击步骤切换当前步骤，支持 v-model:current。" :code="clickableCode">
      <NSteps :items="clickItems" v-model:current="current4" clickable />
      <p style="margin-top:12px;color:var(--n-color-text-tertiary);font-size:13px;">
        当前步骤：{{ current4 }} — {{ clickItems[current4].title }}
      </p>
    </DemoBlock>

    <!-- ────── 带描述的步骤 ────── -->
    <DemoBlock title="带描述的步骤" description="每个步骤可设置 description 补充说明。" :code="descCode">
      <NSteps :items="descItems" :current="1" />
    </DemoBlock>

    <ApiTable title="Steps Props" :columns="propColumns" :data="propData" />
    <ApiTable title="StepItem 属性" :columns="propColumns" :data="itemData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const current1 = ref(1)
const current2 = ref(1)
const current3 = ref(1)
const current4 = ref(0)

const basicItems = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证您的邮箱地址' },
  { title: '完成注册', description: '开始使用' },
]

const statusItems = [
  { title: '已完成', status: 'finish' as const, description: '已完成的步骤' },
  { title: '进行中', status: 'process' as const, description: '当前正在处理' },
  { title: '待处理', status: 'wait' as const, description: '等待执行' },
  { title: '出错', status: 'error' as const, description: '此步骤发生错误' },
]

const errorItems = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证失败，请重新验证' },
  { title: '完成注册', description: '开始使用' },
]

const dotItems = [
  { title: '订单提交', description: '填写订单信息' },
  { title: '付款', description: '选择付款方式' },
  { title: '发货', description: '等待卖家发货' },
  { title: '确认收货', description: '确认商品无误' },
]

const clickItems = [
  { title: '第一步', description: '基础配置' },
  { title: '第二步', description: '详细设置' },
  { title: '第三步', description: '确认提交' },
]

const descItems = [
  { title: '填写信息', description: '请确保信息真实有效，提交后将不可修改' },
  { title: '身份验证', description: '系统将在 24 小时内完成审核' },
  { title: '审核通过', description: '审核通过后即可使用全部功能' },
]

/* ────── 完整示例代码 ────── */

const basicCode = `<template>
  <NSteps :items="items" :current="current" />
  <NSpace style="margin-top:16px;">
    <NButton size="sm" :disabled="current <= 0" @click="current--">上一步</NButton>
    <NButton size="sm" :disabled="current >= items.length - 1" @click="current++">下一步</NButton>
  </NSpace>
</template>

<script setup lang="ts">
const current = ref(1)

const items = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证您的邮箱地址' },
  { title: '完成注册', description: '开始使用' },
]
<\/script>`

const statusCode = `<template>
  <NSteps :items="items" :current="1" />
</template>

<script setup lang="ts">
const items = [
  { title: '已完成', status: 'finish', description: '已完成的步骤' },
  { title: '进行中', status: 'process', description: '当前正在处理' },
  { title: '待处理', status: 'wait', description: '等待执行' },
  { title: '出错', status: 'error', description: '此步骤发生错误' },
]
<\/script>`

const errorCode = `<template>
  <NSteps :items="items" :current="1" status="error" />
</template>

<script setup lang="ts">
const items = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证失败，请重新验证' },
  { title: '完成注册', description: '开始使用' },
]
<\/script>`

const verticalCode = `<template>
  <NSteps :items="items" :current="current" direction="vertical" />
</template>

<script setup lang="ts">
const current = ref(1)

const items = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证您的邮箱地址' },
  { title: '完成注册', description: '开始使用' },
]
<\/script>`

const dotCode = `<template>
  <NSteps :items="items" :current="current" dot />
  <NSpace style="margin-top:16px;">
    <NButton size="sm" :disabled="current <= 0" @click="current--">上一步</NButton>
    <NButton size="sm" :disabled="current >= items.length - 1" @click="current++">下一步</NButton>
  </NSpace>
</template>

<script setup lang="ts">
const current = ref(1)

const items = [
  { title: '订单提交', description: '填写订单信息' },
  { title: '付款', description: '选择付款方式' },
  { title: '发货', description: '等待卖家发货' },
  { title: '确认收货', description: '确认商品无误' },
]
<\/script>`

const smallCode = `<template>
  <NSteps :items="items" :current="1" size="sm" />
</template>

<script setup lang="ts">
const items = [
  { title: '创建账号', description: '填写基本信息' },
  { title: '邮箱验证', description: '验证您的邮箱地址' },
  { title: '完成注册', description: '开始使用' },
]
<\/script>`

const clickableCode = `<template>
  <NSteps :items="items" v-model:current="current" clickable />
</template>

<script setup lang="ts">
const current = ref(0)

const items = [
  { title: '第一步', description: '基础配置' },
  { title: '第二步', description: '详细设置' },
  { title: '第三步', description: '确认提交' },
]
<\/script>`

const descCode = `<template>
  <NSteps :items="items" :current="1" />
</template>

<script setup lang="ts">
const items = [
  { title: '填写信息', description: '请确保信息真实有效，提交后将不可修改' },
  { title: '身份验证', description: '系统将在 24 小时内完成审核' },
  { title: '审核通过', description: '审核通过后即可使用全部功能' },
]
<\/script>`

/* ────── API 表格 ────── */

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
  { name: 'items', type: 'StepItem[]', default: '—', desc: '步骤数据（必填）' },
  { name: 'current', type: 'number', default: '0', desc: '当前步骤索引' },
  { name: 'status', type: "'process' | 'error' | 'finish'", default: "'process'", desc: '当前步骤的状态' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '显示方向' },
  { name: 'size', type: "'md' | 'sm'", default: "'md'", desc: '尺寸' },
  { name: 'dot', type: 'boolean', default: 'false', desc: '是否使用点状样式' },
  { name: 'clickable', type: 'boolean', default: 'false', desc: '是否允许点击步骤切换' },
]

const itemData = [
  { name: 'title', type: 'string', default: '—', desc: '步骤标题' },
  { name: 'description', type: 'string', default: '—', desc: '步骤描述' },
  { name: 'status', type: "'wait' | 'process' | 'finish' | 'error'", default: '—', desc: '单独设置该步骤状态，优先级高于 current' },
  { name: 'icon', type: 'Component', default: '—', desc: '自定义图标组件' },
  { name: 'clickable', type: 'boolean', default: '—', desc: '单独控制该步骤是否可点击，优先级高于组件 clickable' },
]

const eventData = [
  { name: 'update:current', type: '(current: number) => void', desc: '当前步骤改变时触发，用于 v-model:current' },
  { name: 'change', type: '(current: number) => void', desc: '点击可点击步骤时触发' },
]
</script>
