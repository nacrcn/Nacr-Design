<template>
  <div class="doc-page">
    <h1>Radio 单选框</h1>
    <p class="doc-page__desc">用于在多个选项中进行单选，支持圆形和方形样式、不同尺寸以及按钮组模式。</p>

    <!-- 基础用法 -->
    <DemoBlock title="基础用法" description="通过 v-model 绑定选中值，配合 NRadioGroup 使用：" :code="basicCode">
      <NRadioGroup v-model="val1">
        <NRadio value="a">选项A</NRadio>
        <NRadio value="b">选项B</NRadio>
        <NRadio value="c">选项C</NRadio>
      </NRadioGroup>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val1 || '未选择' }}</p>
    </DemoBlock>

    <!-- 方形样式 -->
    <DemoBlock title="方形样式" description="设置 variant 为 rect 使用方块标记：" :code="variantCode">
      <NRadioGroup v-model="val2" variant="rect">
        <NRadio value="apple">苹果</NRadio>
        <NRadio value="banana">香蕉</NRadio>
        <NRadio value="orange">橙子</NRadio>
      </NRadioGroup>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock title="不同尺寸" description="设置 size 为 sm / md / lg：" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NRadioGroup v-model="val3" size="sm">
          <NRadio value="s">小号</NRadio>
          <NRadio value="m">中号</NRadio>
        </NRadioGroup>
        <NRadioGroup v-model="val3" size="md">
          <NRadio value="s">小号</NRadio>
          <NRadio value="m">中号</NRadio>
        </NRadioGroup>
        <NRadioGroup v-model="val3" size="lg">
          <NRadio value="s">小号</NRadio>
          <NRadio value="m">中号</NRadio>
        </NRadioGroup>
      </div>
    </DemoBlock>

    <!-- 按钮样式 -->
    <DemoBlock title="按钮样式" description="设置 NRadioGroup variant 为 button 使用按钮组模式：" :code="buttonCode">
      <NRadioGroup v-model="val4" variant="button">
        <NRadio value="day">日</NRadio>
        <NRadio value="week">周</NRadio>
        <NRadio value="month">月</NRadio>
        <NRadio value="year">年</NRadio>
      </NRadioGroup>
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">选中：{{ val4 }}</p>
    </DemoBlock>

    <!-- 按钮样式尺寸 -->
    <DemoBlock title="按钮样式不同尺寸" description="按钮组模式同样支持 sm / md / lg：" :code="buttonSizeCode">
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NRadioGroup v-model="val5" variant="button" size="sm">
          <NRadio value="a">北京</NRadio>
          <NRadio value="b">上海</NRadio>
          <NRadio value="c">广州</NRadio>
        </NRadioGroup>
        <NRadioGroup v-model="val5" variant="button" size="md">
          <NRadio value="a">北京</NRadio>
          <NRadio value="b">上海</NRadio>
          <NRadio value="c">广州</NRadio>
        </NRadioGroup>
        <NRadioGroup v-model="val5" variant="button" size="lg">
          <NRadio value="a">北京</NRadio>
          <NRadio value="b">上海</NRadio>
          <NRadio value="c">广州</NRadio>
        </NRadioGroup>
      </div>
    </DemoBlock>

    <!-- 禁用状态 -->
    <DemoBlock title="禁用状态" description="设置 disabled 禁用单个选项或整组：" :code="disabledCode">
      <NRadioGroup v-model="val6">
        <NRadio value="yes">是</NRadio>
        <NRadio value="no" disabled>否（禁用）</NRadio>
      </NRadioGroup>
      <div style="margin-top:12px;">
        <NRadioGroup v-model="val7" disabled>
          <NRadio value="x">X</NRadio>
          <NRadio value="y">Y</NRadio>
        </NRadioGroup>
      </div>
    </DemoBlock>

    <!-- 独立使用 -->
    <DemoBlock title="独立使用" description="NRadio 也可以不搭配 NRadioGroup 单独使用：" :code="standaloneCode">
      <NRadio v-model="val8" value="agree">同意协议</NRadio>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">{{ val8 === 'agree' ? '已同意' : '未同意' }}</p>
    </DemoBlock>

    <ApiTable title="Radio Props" :columns="propColumns" :data="radioProps" />
    <ApiTable title="Radio Events" :columns="eventColumns" :data="radioEvents" />
    <ApiTable title="RadioGroup Props" :columns="propColumns" :data="groupProps" />
    <ApiTable title="RadioGroup Events" :columns="eventColumns" :data="groupEvents" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref('a')
const val2 = ref('apple')
const val3 = ref('s')
const val4 = ref('day')
const val5 = ref('a')
const val6 = ref('yes')
const val7 = ref('x')
const val8 = ref('')

// ========== code ==========
const basicCode = `<template>
  <NRadioGroup v-model="val">
    <NRadio value="a">选项A</NRadio>
    <NRadio value="b">选项B</NRadio>
    <NRadio value="c">选项C</NRadio>
  </NRadioGroup>
</template>

<script setup lang="ts">
const val = ref('a')
<\/script>`

const variantCode = `<template>
  <NRadioGroup v-model="val" variant="rect">
    <NRadio value="apple">苹果</NRadio>
    <NRadio value="banana">香蕉</NRadio>
    <NRadio value="orange">橙子</NRadio>
  </NRadioGroup>
</template>

<script setup lang="ts">
const val = ref('apple')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NRadioGroup v-model="val" size="sm">
      <NRadio value="s">小号</NRadio>
      <NRadio value="m">中号</NRadio>
    </NRadioGroup>
    <NRadioGroup v-model="val" size="md">
      <NRadio value="s">小号</NRadio>
      <NRadio value="m">中号</NRadio>
    </NRadioGroup>
    <NRadioGroup v-model="val" size="lg">
      <NRadio value="s">小号</NRadio>
      <NRadio value="m">中号</NRadio>
    </NRadioGroup>
  </div>
</template>

<script setup lang="ts">
const val = ref('s')
<\/script>`

const buttonCode = `<template>
  <NRadioGroup v-model="val" variant="button">
    <NRadio value="day">日</NRadio>
    <NRadio value="week">周</NRadio>
    <NRadio value="month">月</NRadio>
    <NRadio value="year">年</NRadio>
  </NRadioGroup>
</template>

<script setup lang="ts">
const val = ref('day')
<\/script>`

const buttonSizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NRadioGroup v-model="val" variant="button" size="sm">
      <NRadio value="a">北京</NRadio>
      <NRadio value="b">上海</NRadio>
      <NRadio value="c">广州</NRadio>
    </NRadioGroup>
    <NRadioGroup v-model="val" variant="button" size="md">
      <NRadio value="a">北京</NRadio>
      <NRadio value="b">上海</NRadio>
      <NRadio value="c">广州</NRadio>
    </NRadioGroup>
    <NRadioGroup v-model="val" variant="button" size="lg">
      <NRadio value="a">北京</NRadio>
      <NRadio value="b">上海</NRadio>
      <NRadio value="c">广州</NRadio>
    </NRadioGroup>
  </div>
</template>

<script setup lang="ts">
const val = ref('a')
<\/script>`

const disabledCode = `<template>
  <NRadioGroup v-model="val">
    <NRadio value="yes">是</NRadio>
    <NRadio value="no" disabled>否（禁用）</NRadio>
  </NRadioGroup>
  <NRadioGroup v-model="val2" disabled>
    <NRadio value="x">X</NRadio>
    <NRadio value="y">Y</NRadio>
  </NRadioGroup>
</template>

<script setup lang="ts">
const val = ref('yes')
const val2 = ref('x')
<\/script>`

const standaloneCode = `<template>
  <NRadio v-model="val" value="agree">同意协议</NRadio>
</template>

<script setup lang="ts">
const val = ref('')
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

const radioProps = [
  { name: 'modelValue', type: 'any', default: 'undefined', desc: '选中值（v-model），独立使用时绑定' },
  { name: 'value', type: 'any', default: '-', desc: '该选项的值，必填' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸，独立使用时生效' },
  { name: 'variant', type: "'circle' | 'rect'", default: "'circle'", desc: '样式变体，独立使用时生效' },
]

const radioEvents = [
  { name: 'update:modelValue', type: '(val: any) => void', desc: '选中值变化时触发' },
  { name: 'change', type: '(val: any, e: Event) => void', desc: '选中值变化时触发' },
]

const groupProps = [
  { name: 'modelValue', type: 'any', default: '-', desc: '选中值（v-model），必填' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用整组' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'variant', type: "'circle' | 'rect' | 'button'", default: "'circle'", desc: '样式变体，button 为按钮组模式' },
]

const groupEvents = [
  { name: 'update:modelValue', type: '(val: any) => void', desc: '选中值变化时触发' },
  { name: 'change', type: '(val: any) => void', desc: '选中值变化时触发' },
]
</script>
