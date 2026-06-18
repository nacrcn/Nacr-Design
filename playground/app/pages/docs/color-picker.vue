<template>
  <div class="doc-page">
    <h1>ColorPicker 颜色选择器</h1>
    <p class="doc-page__desc">用于选择颜色，支持预设色板、自由取色和渐变色三种模式，可切换 HEX / RGB / HSL 格式与透明度。</p>

    <DemoBlock title="基础用法" description="默认 type='color'，通过 v-model 绑定颜色值（hex 字符串）："
      :code="basicCode">
      <div style="max-width:260px;">
        <NColorPicker v-model="val1" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val1 }}</p>
        <div :style="{ width:48, height:24, borderRadius:4, background:val1, marginTop:8, border:'1px solid #e5e7eb' }" />
      </div>
    </DemoBlock>

    <DemoBlock title="预设色板" description="设置 type='preset'，仅显示预设色块供快速选择：" :code="presetCode">
      <div style="max-width:360px;">
        <NColorPicker v-model="val2" type="preset" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val2 }}</p>
      </div>
    </DemoBlock>

    <DemoBlock title="渐变选择" description="设置 type='gradient'，选择起始色、结束色和方向，v-model 绑定为 CSS 渐变字符串：" :code="gradientCode">
      <div style="max-width:360px;">
        <NColorPicker v-model="val3" type="gradient" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;word-break:break-all;">当前值：{{ val3 }}</p>
      </div>
    </DemoBlock>

    <DemoBlock title="格式切换" description="设置 format='rgb' 或 format='hsl'，输出值将使用对应格式；面板内也可切换查看：" :code="formatCode">
      <div style="display:flex;flex-direction:column;gap:12px;max-width:260px;">
        <NColorPicker v-model="val4" format="hex" />
        <NColorPicker v-model="val5" format="rgb" />
        <NColorPicker v-model="val6" format="hsl" />
        <p style="font-size:13px;color:#6b7280;">HEX: {{ val4 }}</p>
        <p style="font-size:13px;color:#6b7280;">RGB: {{ val5 }}</p>
        <p style="font-size:13px;color:#6b7280;">HSL: {{ val6 }}</p>
      </div>
    </DemoBlock>

    <DemoBlock title="透明度" description="设置 show-alpha 后可调整透明度，HEX 输出为 8 位格式，RGB/HSL 输出为 rgba/hsla 格式：" :code="alphaCode">
      <div style="display:flex;flex-direction:column;gap:12px;max-width:260px;">
        <NColorPicker v-model="val7" show-alpha format="hex" />
        <NColorPicker v-model="val8" show-alpha format="rgb" />
        <p style="font-size:13px;color:#6b7280;">HEX8: {{ val7 }}</p>
        <p style="font-size:13px;color:#6b7280;">RGBA: {{ val8 }}</p>
      </div>
    </DemoBlock>

    <DemoBlock title="自定义预设" description="通过 presets 属性传入自定义颜色数组：" :code="customPresetCode">
      <div style="max-width:260px;">
        <NColorPicker v-model="val81" type="preset" :presets="customPresets" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val81 }}</p>
      </div>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="设置 size 属性使用三种预设尺寸：" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:12px;max-width:260px;">
        <NColorPicker v-model="val9" size="sm" />
        <NColorPicker v-model="val10" size="md" />
        <NColorPicker v-model="val11" size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock title="可清空与禁用" description="clearable 属性使选择器显示清除按钮，disabled 属性禁用选择器：" :code="clearCode">
      <div style="display:flex;flex-direction:column;gap:12px;max-width:260px;">
        <NColorPicker v-model="val12" clearable />
        <NColorPicker v-model="val13" disabled />
      </div>
    </DemoBlock>

    <!-- API -->
    <h2 style="margin-top:48px;">API</h2>
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// demos
const val1 = ref('#3b82f6')
const val2 = ref('#ef4444')
const val3 = ref('linear-gradient(to right, #3b82f6, #10b981)')
const val4 = ref('#f59e0b')
const val5 = ref('rgb(139, 92, 246)')
const val6 = ref('hsl(217, 91%, 60%)')
const val7 = ref('#3b82f680')
const val8 = ref('rgba(59, 130, 246, 0.5)')
const val81 = ref('#22c55e')
const val9 = ref('#ef4444')
const val10 = ref('#3b82f6')
const val11 = ref('#8b5cf6')
const val12 = ref('#f59e0b')
const val13 = ref('#10b981')

const customPresets = ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed', '#4f46e5', '#2563eb', '#0284c7']

// codes
const basicCode = `<template>
  <NColorPicker v-model="color" />
  <p>当前值：{{ color }}</p>
  <div :style="{ width: 48, height: 24, borderRadius: 4, background: color, border: '1px solid #e5e7eb' }" />
</template>

<script setup lang="ts">
const color = ref('#3b82f6')
<\/script>`

const presetCode = `<template>
  <NColorPicker v-model="color" type="preset" />
</template>

<script setup lang="ts">
const color = ref('#ef4444')
<\/script>`

const gradientCode = `<template>
  <NColorPicker v-model="color" type="gradient" />
</template>

<script setup lang="ts">
const color = ref('linear-gradient(to right, #3b82f6, #10b981)')
<\/script>`

const formatCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NColorPicker v-model="v1" format="hex" />
    <NColorPicker v-model="v2" format="rgb" />
    <NColorPicker v-model="v3" format="hsl" />
    <p>HEX: {{ v1 }}</p>
    <p>RGB: {{ v2 }}</p>
    <p>HSL: {{ v3 }}</p>
  </div>
</template>

<script setup lang="ts">
const v1 = ref('#f59e0b')
const v2 = ref('rgb(139, 92, 246)')
const v3 = ref('hsl(217, 91%, 60%)')
<\/script>`

const alphaCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NColorPicker v-model="v1" show-alpha format="hex" />
    <NColorPicker v-model="v2" show-alpha format="rgb" />
    <p>HEX8: {{ v1 }}</p>
    <p>RGBA: {{ v2 }}</p>
  </div>
</template>

<script setup lang="ts">
const v1 = ref('#3b82f680')
const v2 = ref('rgba(59, 130, 246, 0.5)')
<\/script>`

const customPresetCode = `<template>
  <NColorPicker v-model="color" type="preset" :presets="customPresets" />
</template>

<script setup lang="ts">
const color = ref('#22c55e')
const customPresets = ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed', '#4f46e5', '#2563eb', '#0284c7']
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NColorPicker v-model="v1" size="sm" />
    <NColorPicker v-model="v2" size="md" />
    <NColorPicker v-model="v3" size="lg" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('#ef4444')
const v2 = ref('#3b82f6')
const v3 = ref('#8b5cf6')
<\/script>`

const clearCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NColorPicker v-model="v1" clearable />
    <NColorPicker v-model="v2" disabled />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('#f59e0b')
const v2 = ref('#10b981')
<\/script>`

// API tables
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string', default: "'#3b82f6'", desc: '绑定值，gradient 类型为 CSS 渐变字符串' },
  { name: 'type', type: "'preset' | 'color' | 'gradient'", default: "'color'", desc: '选择器类型' },
  { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", desc: '输出格式' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '选择器尺寸' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  { name: 'showAlpha', type: 'boolean', default: 'false', desc: '是否显示透明度滑块' },
  { name: 'presets', type: 'string[]', default: '—', desc: '自定义预设色数组，不传则使用默认 24 色' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string | undefined) => void', desc: '值变化时触发' },
  { name: 'change', type: '(value: string | undefined) => void', desc: '确认选择时触发' },
]
</script>
