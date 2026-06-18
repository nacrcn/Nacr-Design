<template>
  <div class="doc-page">
    <h1>Slider 滑动输入条</h1>
    <p class="doc-page__desc">用于在给定范围内选择一个值或范围，支持标记、提示气泡、双滑块和竖直方向。</p>

    <!-- 基础用法 -->
    <DemoBlock title="基础用法" description="通过 v-model 绑定数值：" :code="basicCode">
      <div style="max-width:400px;">
        <NSlider v-model="val1" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">值：{{ val1 }}</p>
      </div>
    </DemoBlock>

    <!-- 设置范围与步长 -->
    <DemoBlock title="设置范围与步长" description="通过 min、max 设置范围，step 设置步长：" :code="stepCode">
      <div style="max-width:400px;">
        <NSlider v-model="val2" :min="0" :max="50" :step="5" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">值：{{ val2 }}</p>
      </div>
    </DemoBlock>

    <!-- 带提示 -->
    <DemoBlock title="带提示" description="设置 show-tooltip 拖动时显示数值提示：" :code="tooltipCode">
      <div style="max-width:400px;">
        <NSlider v-model="val3" :show-tooltip="true" />
      </div>
    </DemoBlock>

    <!-- 自定义提示格式 -->
    <DemoBlock title="自定义提示格式" description="通过 format-tooltip 格式化提示文字：" :code="formatCode">
      <div style="max-width:400px;">
        <NSlider v-model="val4" :show-tooltip="true" :format-tooltip="(v: number) => v + '%'" />
      </div>
    </DemoBlock>

    <!-- 带标记 -->
    <DemoBlock title="带标记" description="通过 marks 在轨道下方显示刻度标记：" :code="marksCode">
      <div style="max-width:400px;">
        <NSlider v-model="val5" :marks="{ 0: '0°C', 25: '25°C', 50: '50°C', 75: '75°C', 100: '100°C' }" />
      </div>
    </DemoBlock>

    <!-- 双滑块 -->
    <DemoBlock title="双滑块范围选择" description="设置 range 开启双滑块模式，v-model 绑定 [start, end]：" :code="rangeCode">
      <div style="max-width:400px;">
        <NSlider v-model="val6" :range="true" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">范围：{{ val6[0] }} - {{ val6[1] }}</p>
      </div>
    </DemoBlock>

    <!-- 竖直方向 -->
    <DemoBlock title="竖直方向" description="设置 vertical 使滑块竖直显示：" :code="verticalCode">
      <div style="height:200px;display:flex;align-items:center;">
        <NSlider v-model="val7" :vertical="true" :show-tooltip="true" />
      </div>
    </DemoBlock>

    <!-- 带输入框 -->
    <DemoBlock title="带输入框" description="设置 input 在滑块旁显示数字输入框：" :code="inputCode">
      <div style="max-width:400px;">
        <NSlider v-model="val8" :input="true" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock title="不同尺寸" description="设置 size 为 sm / md / lg：" :code="sizeCode">
      <div style="max-width:400px;display:flex;flex-direction:column;gap:16px;">
        <NSlider v-model="val9" size="sm" />
        <NSlider v-model="val9" size="md" />
        <NSlider v-model="val9" size="lg" />
      </div>
    </DemoBlock>

    <!-- 禁用状态 -->
    <DemoBlock title="禁用状态" description="设置 disabled 禁用滑块：" :code="disabledCode">
      <div style="max-width:400px;">
        <NSlider v-model="val10" :disabled="true" />
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref(50)
const val2 = ref(20)
const val3 = ref(30)
const val4 = ref(40)
const val5 = ref(37)
const val6 = ref<[number, number]>([20, 80])
const val7 = ref(50)
const val8 = ref(50)
const val9 = ref(50)
const val10 = ref(50)

// ========== code ==========
const basicCode = `<template>
  <NSlider v-model="val" />
</template>

<script setup lang="ts">
const val = ref(50)
<\/script>`

const stepCode = `<template>
  <NSlider v-model="val" :min="0" :max="50" :step="5" />
</template>

<script setup lang="ts">
const val = ref(20)
<\/script>`

const tooltipCode = `<template>
  <NSlider v-model="val" :show-tooltip="true" />
</template>

<script setup lang="ts">
const val = ref(30)
<\/script>`

const formatCode = `<template>
  <NSlider v-model="val" :show-tooltip="true" :format-tooltip="(v: number) => v + '%'" />
</template>

<script setup lang="ts">
const val = ref(40)
<\/script>`

const marksCode = `<template>
  <NSlider v-model="val" :marks="{ 0: '0°C', 25: '25°C', 50: '50°C', 75: '75°C', 100: '100°C' }" />
</template>

<script setup lang="ts">
const val = ref(37)
<\/script>`

const rangeCode = `<template>
  <NSlider v-model="val" :range="true" />
  <p>范围：{{ val[0] }} - {{ val[1] }}</p>
</template>

<script setup lang="ts">
const val = ref<[number, number]>([20, 80])
<\/script>`

const verticalCode = `<template>
  <div style="height:200px;display:flex;align-items:center;">
    <NSlider v-model="val" :vertical="true" :show-tooltip="true" />
  </div>
</template>

<script setup lang="ts">
const val = ref(50)
<\/script>`

const inputCode = `<template>
  <NSlider v-model="val" :input="true" />
</template>

<script setup lang="ts">
const val = ref(50)
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NSlider v-model="val" size="sm" />
    <NSlider v-model="val" size="md" />
    <NSlider v-model="val" size="lg" />
  </div>
</template>

<script setup lang="ts">
const val = ref(50)
<\/script>`

const disabledCode = `<template>
  <NSlider v-model="val" :disabled="true" />
</template>

<script setup lang="ts">
const val = ref(50)
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

const propData = [
  { name: 'modelValue', type: 'number | [number, number]', default: '-', desc: '当前值（v-model），range 模式为 [start, end]' },
  { name: 'min', type: 'number', default: '0', desc: '最小值' },
  { name: 'max', type: 'number', default: '100', desc: '最大值' },
  { name: 'step', type: 'number', default: '1', desc: '步长' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'showTooltip', type: 'boolean', default: 'false', desc: '是否显示拖拽提示' },
  { name: 'marks', type: 'Record<number, string>', default: '-', desc: '刻度标记' },
  { name: 'range', type: 'boolean', default: 'false', desc: '是否双滑块范围选择' },
  { name: 'vertical', type: 'boolean', default: 'false', desc: '是否竖直方向' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'formatTooltip', type: '(val: number) => string | number', default: '-', desc: '格式化提示文字' },
  { name: 'input', type: 'boolean', default: 'false', desc: '是否显示数值输入框（仅单滑块）' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: number | [number, number]) => void', desc: '值变化时触发' },
  { name: 'change', type: '(val: number | [number, number]) => void', desc: '拖拽结束时触发' },
]
</script>
