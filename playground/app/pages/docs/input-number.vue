<template>
  <div class="doc-page">
    <h1>InputNumber 数字输入框</h1>
    <p class="doc-page__desc">用于输入数字，支持步进、精度、范围限制、按钮位置等。</p>

    <DemoBlock
      title="基础用法"
      description="通过 v-model 双向绑定数值："
      :code="basicCode"
    >
      <NInputNumber v-model="val1" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val1 }}</p>
    </DemoBlock>

    <DemoBlock
      title="步长与范围"
      description="设置 min、max、step 控制数值范围与步长："
      :code="stepCode"
    >
      <NInputNumber v-model="val2" :min="0" :max="100" :step="5" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">0-100，步长 5，当前值：{{ val2 }}</p>
    </DemoBlock>

    <DemoBlock
      title="精度"
      description="设置 precision 控制小数位数："
      :code="precisionCode"
    >
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">精度 0</p>
          <NInputNumber v-model="val3" :precision="0" :step="1" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">精度 2</p>
          <NInputNumber v-model="val4" :precision="2" :step="0.1" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex;gap:12px;align-items:center;">
        <NInputNumber v-model="v1" size="sm" />
        <NInputNumber v-model="v2" size="md" />
        <NInputNumber v-model="v3" size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="按钮位置"
      description="设置 controlsPosition 为 right 将按钮放在右侧纵向排列："
      :code="positionCode"
    >
      <div style="display:flex;gap:12px;align-items:start;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">side（默认）</p>
          <NInputNumber v-model="val5" controls-position="side" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">right</p>
          <NInputNumber v-model="val6" controls-position="right" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="前后缀"
      description="使用 prefixText / suffixText 或对应插槽添加前后缀："
      :code="prefixCode"
    >
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NInputNumber v-model="val7" prefix-text="¥" />
        <NInputNumber v-model="val8" suffix-text="%" />
        <NInputNumber v-model="val9" controls-position="right">
          <template #prefix>🌡</template>
        </NInputNumber>
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用与只读"
      description="设置 disabled 禁用或 readonly 只读："
      :code="stateCode"
    >
      <div style="display:flex;gap:12px;">
        <NInputNumber :model-value="10" disabled />
        <NInputNumber :model-value="20" readonly />
      </div>
    </DemoBlock>

    <DemoBlock
      title="格式化"
      description="使用 formatter 和 parser 自定义显示格式："
      :code="formatCode"
    >
      <NInputNumber
        v-model="val10"
        :formatter="v => `¥ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="v => Number(v.replace(/¥\s?|(,*)/g, ''))"
      />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">实际值：{{ val10 }}</p>
    </DemoBlock>

    <DemoBlock
      title="无按钮"
      description="设置 controls 为 false 隐藏增减按钮："
      :code="noControlsCode"
    >
      <NInputNumber v-model="val11" :controls="false" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const val1 = ref(0)
const val2 = ref(50)
const val3 = ref(5)
const val4 = ref(1.23)
const v1 = ref(0)
const v2 = ref(0)
const v3 = ref(0)
const val5 = ref(10)
const val6 = ref(20)
const val7 = ref(100)
const val8 = ref(85)
const val9 = ref(36)
const val10 = ref(1000)
const val11 = ref(50)

const basicCode = `<template>
  <NInputNumber v-model="value" />
</template>

<script setup lang="ts">
const value = ref(0)
<\/script>`

const stepCode = `<template>
  <NInputNumber v-model="value" :min="0" :max="100" :step="5" />
</template>

<script setup lang="ts">
const value = ref(0)
<\/script>`

const precisionCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInputNumber v-model="v1" :precision="0" :step="1" />
    <NInputNumber v-model="v2" :precision="2" :step="0.1" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(5)
const v2 = ref(1.23)
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;gap:12px;align-items:center;">
    <NInputNumber v-model="v1" size="sm" />
    <NInputNumber v-model="v2" size="md" />
    <NInputNumber v-model="v3" size="lg" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(0)
const v2 = ref(0)
const v3 = ref(0)
<\/script>`

const positionCode = `<template>
  <div style="display:flex;gap:12px;align-items:start;">
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">side（默认）</p>
      <NInputNumber v-model="v1" controls-position="side" />
    </div>
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">right</p>
      <NInputNumber v-model="v2" controls-position="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
const v1 = ref(10)
const v2 = ref(20)
<\/script>`

const prefixCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInputNumber v-model="v1" prefix-text="¥" />
    <NInputNumber v-model="v2" suffix-text="%" />
    <NInputNumber v-model="v3" controls-position="right">
      <template #prefix>🌡</template>
    </NInputNumber>
  </div>
</template>

<script setup lang="ts">
const v1 = ref(100)
const v2 = ref(85)
const v3 = ref(36)
<\/script>`

const stateCode = `<template>
  <div style="display:flex;gap:12px;">
    <NInputNumber :model-value="10" disabled />
    <NInputNumber :model-value="20" readonly />
  </div>
</template>`

const formatCode = `<template>
  <NInputNumber
    v-model="value"
    :formatter="v => \`¥ \${v}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')"
    :parser="v => Number(v.replace(/¥\\s?|(,*)/g, ''))"
  />
</template>

<script setup lang="ts">
const value = ref(1000)
<\/script>`

const noControlsCode = `<template>
  <NInputNumber v-model="value" :controls="false" />
</template>

<script setup lang="ts">
const value = ref(50)
<\/script>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'number', default: '0', desc: '当前值（v-model）' },
  { name: 'min', type: 'number', default: '-Infinity', desc: '最小值' },
  { name: 'max', type: 'number', default: 'Infinity', desc: '最大值' },
  { name: 'step', type: 'number', default: '1', desc: '步长' },
  { name: 'precision', type: 'number', default: '—', desc: '数值精度（小数位数）' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'placeholder', type: 'string', default: "''", desc: '占位文本' },
  { name: 'controls', type: 'boolean', default: 'true', desc: '是否显示增减按钮' },
  { name: 'controlsPosition', type: "'side' | 'right'", default: "'side'", desc: '按钮位置：side 左右排列，right 右侧纵向排列' },
  { name: 'prefixText', type: 'string', default: "''", desc: '前缀文本' },
  { name: 'suffixText', type: 'string', default: "''", desc: '后缀文本' },
  { name: 'error', type: 'string', default: "''", desc: '错误状态' },
  { name: 'formatter', type: '(value: number) => string', default: '—', desc: '格式化显示值' },
  { name: 'parser', type: '(value: string) => number', default: '—', desc: '反向解析显示值为数字' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: number) => void', desc: '值变化时触发' },
  { name: 'change', type: '(value: number) => void', desc: '值变化时触发' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: '失去焦点时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'prefix', desc: '前缀内容（优先于 prefixText）' },
  { name: 'suffix', desc: '后缀内容（优先于 suffixText）' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'focus', type: '() => void', desc: '使输入框获得焦点' },
  { name: 'blur', type: '() => void', desc: '使输入框失去焦点' },
]
</script>
