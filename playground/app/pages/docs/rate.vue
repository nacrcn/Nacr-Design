<template>
  <div class="doc-page">
    <h1>Rate 评分</h1>
    <p class="doc-page__desc">用于评分交互，支持半星、自定义图标、颜色、提示文字等多种配置。</p>

    <!-- 基础用法 -->
    <DemoBlock title="基础用法" description="通过 v-model 绑定评分值：" :code="basicCode">
      <NRate v-model="val1" />
      <span style="margin-left:8px;font-size:14px;color:#6b7280;">{{ val1 }} 星</span>
    </DemoBlock>

    <!-- 半星 -->
    <DemoBlock title="半星" description="设置 allow-half 允许选择半星：" :code="halfCode">
      <NRate v-model="val2" :allow-half="true" />
      <span style="margin-left:8px;font-size:14px;color:#6b7280;">{{ val2 }} 星</span>
    </DemoBlock>

    <!-- 自定义数量 -->
    <DemoBlock title="自定义数量" description="通过 count 设置星星总数：" :code="countCode">
      <NRate v-model="val3" :count="10" />
      <span style="margin-left:8px;font-size:14px;color:#6b7280;">{{ val3 }} 星</span>
    </DemoBlock>

    <!-- 自定义颜色 -->
    <DemoBlock title="自定义颜色" description="通过 color 设置选中颜色：" :code="colorCode">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <NRate v-model="val4" color="#ef4444" />
        <NRate v-model="val4" color="#10b981" />
        <NRate v-model="val4" color="#8b5cf6" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock title="不同尺寸" description="设置 size 为 sm / md / lg：" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <NRate v-model="val5" size="sm" />
        <NRate v-model="val5" size="md" />
        <NRate v-model="val5" size="lg" />
      </div>
    </DemoBlock>

    <!-- 显示文字 -->
    <DemoBlock title="显示文字" description="设置 show-text 在评分旁边显示文字描述：" :code="textCode">
      <NRate v-model="val6" :show-text="true" :texts="{ 1: '极差', 2: '失望', 3: '一般', 4: '满意', 5: '惊喜' }" />
    </DemoBlock>

    <!-- 自定义图标 -->
    <DemoBlock title="自定义图标" description="通过 icon 属性或 icon 插槽自定义图标：" :code="iconCode">
      <NRate v-model="val7" icon="♥" color="#ef4444" />
    </DemoBlock>

    <!-- 提示信息 -->
    <DemoBlock title="提示信息" description="通过 tooltips 鼠标悬停时显示提示文字：" :code="tooltipsCode">
      <NRate v-model="val8" :tooltips="['1分-很差', '2分-一般', '3分-还好', '4分-很好', '5分-极好']" />
    </DemoBlock>

    <!-- 可清除 -->
    <DemoBlock title="可清除" description="设置 clearable 再次点击同一评分可清除，或点击 ✕ 按钮清除：" :code="clearableCode">
      <NRate v-model="val9" :clearable="true" />
      <span style="margin-left:8px;font-size:14px;color:#6b7280;">{{ val9 }} 星</span>
    </DemoBlock>

    <!-- 禁用状态 -->
    <DemoBlock title="禁用状态" description="设置 disabled 禁用评分：" :code="disabledCode">
      <NRate v-model="val10" :disabled="true" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref(3)
const val2 = ref(3.5)
const val3 = ref(7)
const val4 = ref(3)
const val5 = ref(4)
const val6 = ref(3)
const val7 = ref(4)
const val8 = ref(0)
const val9 = ref(3)
const val10 = ref(3)

// ========== code ==========
const basicCode = `<template>
  <NRate v-model="val" />
  <span>{{ val }} 星</span>
</template>

<script setup lang="ts">
const val = ref(3)
<\/script>`

const halfCode = `<template>
  <NRate v-model="val" :allow-half="true" />
  <span>{{ val }} 星</span>
</template>

<script setup lang="ts">
const val = ref(3.5)
<\/script>`

const countCode = `<template>
  <NRate v-model="val" :count="10" />
  <span>{{ val }} 星</span>
</template>

<script setup lang="ts">
const val = ref(7)
<\/script>`

const colorCode = `<template>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <NRate v-model="val" color="#ef4444" />
    <NRate v-model="val" color="#10b981" />
    <NRate v-model="val" color="#8b5cf6" />
  </div>
</template>

<script setup lang="ts">
const val = ref(3)
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <NRate v-model="val" size="sm" />
    <NRate v-model="val" size="md" />
    <NRate v-model="val" size="lg" />
  </div>
</template>

<script setup lang="ts">
const val = ref(4)
<\/script>`

const textCode = `<template>
  <NRate
    v-model="val"
    :show-text="true"
    :texts="{ 1: '极差', 2: '失望', 3: '一般', 4: '满意', 5: '惊喜' }"
  />
</template>

<script setup lang="ts">
const val = ref(3)
<\/script>`

const iconCode = `<template>
  <NRate v-model="val" icon="♥" color="#ef4444" />
</template>

<script setup lang="ts">
const val = ref(4)
<\/script>`

const tooltipsCode = `<template>
  <NRate v-model="val" :tooltips="['1分-很差', '2分-一般', '3分-还好', '4分-很好', '5分-极好']" />
</template>

<script setup lang="ts">
const val = ref(0)
<\/script>`

const clearableCode = `<template>
  <NRate v-model="val" :clearable="true" />
  <span>{{ val }} 星</span>
</template>

<script setup lang="ts">
const val = ref(3)
<\/script>`

const disabledCode = `<template>
  <NRate v-model="val" :disabled="true" />
</template>

<script setup lang="ts">
const val = ref(3)
<\/script>`

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

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'number', default: '-', desc: '当前评分值（v-model），必填' },
  { name: 'count', type: 'number', default: '5', desc: '星星总数' },
  { name: 'allowHalf', type: 'boolean', default: 'false', desc: '是否允许半星' },
  { name: 'showText', type: 'boolean', default: 'false', desc: '是否显示文字描述' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'color', type: 'string', default: '-', desc: '选中颜色（CSS 颜色值）' },
  { name: 'icon', type: 'string', default: "'★'", desc: '自定义图标字符' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清除（再次点击同一评分清零）' },
  { name: 'tooltips', type: 'string[]', default: '-', desc: '鼠标悬停提示文字数组' },
  { name: 'texts', type: 'Record<number, string>', default: '-', desc: '评分文字描述映射' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: number) => void', desc: '评分变化时触发' },
  { name: 'change', type: '(val: number) => void', desc: '评分变化时触发' },
]

const slotData = [
  { name: 'icon', desc: '自定义图标，参数 { index, active }' },
]
</script>
