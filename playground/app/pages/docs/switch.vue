<template>
  <div class="doc-page">
    <h1>Switch 开关</h1>
    <p class="doc-page__desc">用于两个互斥选项，用来打开或关闭选项的选择，支持自定义颜色、加载状态和异步切换。</p>

    <!-- 基础用法 -->
    <DemoBlock title="基础用法" description="通过 v-model 绑定布尔值：" :code="basicCode">
      <NSwitch v-model="val1" />
      <span style="margin-left:12px;font-size:14px;color:#6b7280;">{{ val1 ? '开启' : '关闭' }}</span>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock title="不同尺寸" description="设置 size 为 sm / md / lg：" :code="sizeCode">
      <div style="display:flex;gap:16px;align-items:center;">
        <NSwitch v-model="v1" size="sm" />
        <NSwitch v-model="v2" size="md" />
        <NSwitch v-model="v3" size="lg" />
      </div>
    </DemoBlock>

    <!-- 带文字 -->
    <DemoBlock title="带文字" description="通过 checked-text 和 unchecked-text 显示开关文字：" :code="textCode">
      <NSwitch v-model="v4" checked-text="开" unchecked-text="关" />
    </DemoBlock>

    <!-- 自定义颜色 -->
    <DemoBlock title="自定义颜色" description="通过 checked-color 和 unchecked-color 自定义开关颜色：" :code="colorCode">
      <div style="display:flex;gap:16px;align-items:center;">
        <NSwitch v-model="v5" checked-color="#10b981" />
        <NSwitch v-model="v6" checked-color="#f59e0b" unchecked-color="#6b7280" />
      </div>
    </DemoBlock>

    <!-- 加载状态 -->
    <DemoBlock title="加载状态" description="设置 loading 显示加载动画，加载期间不可切换：" :code="loadingCode">
      <NSwitch v-model="v7" loading />
    </DemoBlock>

    <!-- 异步切换 -->
    <DemoBlock title="异步切换" description="设置 beforeChange 函数，返回 false 可阻止切换：" :code="beforeChangeCode">
      <NSwitch v-model="v8" :before-change="handleBeforeChange" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">切换前会延迟 1 秒并弹窗确认</p>
    </DemoBlock>

    <!-- 禁用状态 -->
    <DemoBlock title="禁用状态" description="设置 disabled 禁用开关：" :code="disabledCode">
      <div style="display:flex;gap:16px;align-items:center;">
        <NSwitch :model-value="true" disabled />
        <NSwitch :model-value="false" disabled />
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref(true)
const v1 = ref(true)
const v2 = ref(true)
const v3 = ref(true)
const v4 = ref(true)
const v5 = ref(true)
const v6 = ref(false)
const v7 = ref(true)
const v8 = ref(false)

async function handleBeforeChange(_val: boolean) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

// ========== code ==========
const basicCode = `<template>
  <NSwitch v-model="val" />
</template>

<script setup lang="ts">
const val = ref(true)
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;gap:16px;align-items:center;">
    <NSwitch v-model="v1" size="sm" />
    <NSwitch v-model="v2" size="md" />
    <NSwitch v-model="v3" size="lg" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(true)
const v2 = ref(true)
const v3 = ref(true)
<\/script>`

const textCode = `<template>
  <NSwitch v-model="val" checked-text="开" unchecked-text="关" />
</template>

<script setup lang="ts">
const val = ref(true)
<\/script>`

const colorCode = `<template>
  <div style="display:flex;gap:16px;align-items:center;">
    <NSwitch v-model="v1" checked-color="#10b981" />
    <NSwitch v-model="v2" checked-color="#f59e0b" unchecked-color="#6b7280" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(true)
const v2 = ref(false)
<\/script>`

const loadingCode = `<template>
  <NSwitch v-model="val" loading />
</template>

<script setup lang="ts">
const val = ref(true)
<\/script>`

const beforeChangeCode = `<template>
  <NSwitch v-model="val" :before-change="handleBeforeChange" />
</template>

<script setup lang="ts">
const val = ref(false)

async function handleBeforeChange(val: boolean) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 1000)
  })
}
<\/script>`

const disabledCode = `<template>
  <div style="display:flex;gap:16px;align-items:center;">
    <NSwitch :model-value="true" disabled />
    <NSwitch :model-value="false" disabled />
  </div>
</template>`

// ========== API ==========
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
  { name: 'modelValue', type: 'boolean', default: '-', desc: '开关状态（v-model），必填' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'checkedText', type: 'string', default: '-', desc: '开启时显示的文字' },
  { name: 'uncheckedText', type: 'string', default: '-', desc: '关闭时显示的文字' },
  { name: 'checkedColor', type: 'string', default: '-', desc: '开启时背景色' },
  { name: 'uncheckedColor', type: 'string', default: '-', desc: '关闭时背景色' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否加载中' },
  { name: 'beforeChange', type: '(val: boolean) => boolean | Promise<boolean>', default: '-', desc: '切换前回调，返回 false 阻止切换' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: boolean) => void', desc: '开关状态变化时触发' },
  { name: 'change', type: '(val: boolean) => void', desc: '开关状态变化时触发' },
]
</script>
