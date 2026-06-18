<template>
  <div class="doc-page">
    <h1>Checkbox 复选框</h1>
    <p class="doc-page__desc">用于在多个选项中进行多选。</p>
    <DemoBlock title="基础用法" description="使用 v-model 双向绑定：" :code="`<NCheckbox v-model='checked'>选项</NCheckbox>`">
      <NCheckbox v-model="checked">我已阅读并同意</NCheckbox>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ checked }}</p>
    </DemoBlock>
    <DemoBlock title="复选框组" description="使用 NCheckboxGroup 进行多选：" :code="groupCode">
      <NCheckboxGroup v-model="hobbies">
        <NCheckbox value="reading">阅读</NCheckbox>
        <NCheckbox value="sports">运动</NCheckbox>
        <NCheckbox value="music">音乐</NCheckbox>
        <NCheckbox value="coding">编程</NCheckbox>
      </NCheckboxGroup>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">已选：{{ hobbies.join(', ') }}</p>
    </DemoBlock>
    <DemoBlock title="禁用与不确定状态" description="设置 disabled 或 indeterminate：" :code="`<NCheckbox disabled>禁用</NCheckbox><NCheckbox indeterminate>半选</NCheckbox>`">
      <div style="display:flex;gap:16px;">
        <NCheckbox :model-value="true" disabled>选中禁用</NCheckbox>
        <NCheckbox disabled>未选禁用</NCheckbox>
        <NCheckbox :model-value="true" indeterminate>半选</NCheckbox>
      </div>
    </DemoBlock>
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'doc' })
const checked = ref(true)
const hobbies = ref(['reading', 'coding'])
const groupCode = `<NCheckboxGroup v-model="hobbies">
  <NCheckbox value="reading">阅读</NCheckbox>
  <NCheckbox value="sports">运动</NCheckbox>
</NCheckboxGroup>`
const propColumns = [{ key: 'name', title: '参数', code: true }, { key: 'type', title: '类型', code: true }, { key: 'default', title: '默认值', code: true }, { key: 'desc', title: '说明' }]
const propData = [
  { name: 'modelValue', type: 'boolean', default: '-', desc: '绑定值' },
  { name: 'value', type: 'any', default: '-', desc: '选中值（用于 Group）' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'indeterminate', type: 'boolean', default: 'false', desc: '不确定状态' },
]
</script>
