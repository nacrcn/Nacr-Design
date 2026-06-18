<template>
  <div class="doc-page">
    <h1>InputTag 标签输入框</h1>
    <p class="doc-page__desc">用于输入标签，按回车添加，支持最大数量、自定义样式、分隔符等。</p>

    <DemoBlock
      title="基础用法"
      description="按回车添加标签，按退格键删除最后一个标签："
      :code="basicCode"
    >
      <div style="max-width:400px;">
        <NInputTag v-model="tags1" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">标签：{{ tags1.join(', ') || '无' }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="max-width:400px;display:flex;flex-direction:column;gap:12px;">
        <NInputTag v-model="tags2" size="sm" placeholder="Small" />
        <NInputTag v-model="tags3" size="md" placeholder="Medium" />
        <NInputTag v-model="tags4" size="lg" placeholder="Large" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="最大标签数"
      description="设置 max 限制标签数量，超出后折叠显示："
      :code="maxCode"
    >
      <div style="max-width:400px;">
        <NInputTag v-model="tags5" :max="5" placeholder="最多5个标签" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">已添加 {{ tags5.length }} 个（最多 5 个）</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义标签样式"
      description="使用 tag-style 自定义标签外观："
      :code="styleCode"
    >
      <div style="max-width:400px;display:flex;flex-direction:column;gap:12px;">
        <NInputTag
          v-model="tags6"
          :tag-style="{ background: '#f0fdf4', color: '#16a34a', borderRadius: '12px' }"
          placeholder="绿色圆角标签"
        />
        <NInputTag
          v-model="tags7"
          :tag-style="{ background: '#fef2f2', color: '#dc2626' }"
          placeholder="红色标签"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      title="分隔符"
      description="设置 separator 支持批量输入，例如用逗号分隔："
      :code="separatorCode"
    >
      <div style="max-width:400px;">
        <NInputTag v-model="tags8" separator="," placeholder="输入逗号分隔的多个标签" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">标签：{{ tags8.join(', ') || '无' }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="允许重复"
      description="设置 unique 为 false 允许添加重复标签："
      :code="duplicateCode"
    >
      <div style="max-width:400px;">
        <NInputTag v-model="tags9" :unique="false" placeholder="可添加重复标签" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="禁用与只读"
      description="设置 disabled 禁用或 readonly 只读："
      :code="stateCode"
    >
      <div style="max-width:400px;display:flex;flex-direction:column;gap:12px;">
        <NInputTag v-model="tags10" disabled />
        <NInputTag v-model="tags10" readonly />
      </div>
    </DemoBlock>

    <DemoBlock
      title="事件回调"
      description="监听 add 和 remove 事件："
      :code="eventCode"
    >
      <div style="max-width:400px;">
        <NInputTag v-model="tags11" @add="onAdd" @remove="onRemove" placeholder="添加或删除标签" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">日志：{{ eventLog }}</p>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const tags1 = ref(['Vue', 'Nuxt'])
const tags2 = ref(['Small'])
const tags3 = ref(['Medium'])
const tags4 = ref(['Large'])
const tags5 = ref(['JavaScript', 'TypeScript', 'Vue'])
const tags6 = ref(['Node.js', 'Express'])
const tags7 = ref(['Bug', 'Fix'])
const tags8 = ref(['HTML', 'CSS'])
const tags9 = ref(['Tag'])
const tags10 = ref(['只读标签', '不可编辑'])
const tags11 = ref([])

const eventLog = ref('')

function onAdd(val: string) {
  eventLog.value = `添加了 "${val}"` + (eventLog.value ? `；${eventLog.value}` : '')
}

function onRemove(val: string) {
  eventLog.value = `删除了 "${val}"` + (eventLog.value ? `；${eventLog.value}` : '')
}

const basicCode = `<template>
  <NInputTag v-model="tags" />
</template>

<script setup lang="ts">
const tags = ref<string[]>(['Vue', 'Nuxt'])
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInputTag v-model="tags" size="sm" placeholder="Small" />
    <NInputTag v-model="tags" size="md" placeholder="Medium" />
    <NInputTag v-model="tags" size="lg" placeholder="Large" />
  </div>
</template>

<script setup lang="ts">
const tags = ref<string[]>([])
<\/script>`

const maxCode = `<template>
  <NInputTag v-model="tags" :max="5" placeholder="最多5个标签" />
</template>

<script setup lang="ts">
const tags = ref<string[]>([])
<\/script>`

const styleCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInputTag
      v-model="tags1"
      :tag-style="{ background: '#f0fdf4', color: '#16a34a', borderRadius: '12px' }"
      placeholder="绿色圆角标签"
    />
    <NInputTag
      v-model="tags2"
      :tag-style="{ background: '#fef2f2', color: '#dc2626' }"
      placeholder="红色标签"
    />
  </div>
</template>

<script setup lang="ts">
const tags1 = ref<string[]>([])
const tags2 = ref<string[]>([])
<\/script>`

const separatorCode = `<template>
  <NInputTag v-model="tags" separator="," placeholder="输入逗号分隔的多个标签" />
</template>

<script setup lang="ts">
const tags = ref<string[]>([])
<\/script>`

const duplicateCode = `<template>
  <NInputTag v-model="tags" :unique="false" placeholder="可添加重复标签" />
</template>

<script setup lang="ts">
const tags = ref<string[]>([])
<\/script>`

const stateCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInputTag v-model="tags" disabled />
    <NInputTag v-model="tags" readonly />
  </div>
</template>

<script setup lang="ts">
const tags = ref<string[]>(['只读标签', '不可编辑'])
<\/script>`

const eventCode = `<template>
  <NInputTag
    v-model="tags"
    @add="onAdd"
    @remove="onRemove"
    placeholder="添加或删除标签"
  />
</template>

<script setup lang="ts">
const tags = ref<string[]>([])

function onAdd(val: string) {
  console.log('添加标签:', val)
}

function onRemove(val: string) {
  console.log('删除标签:', val)
}
<\/script>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string[]', default: '[]', desc: '标签数组（v-model）' },
  { name: 'placeholder', type: 'string', default: "'请输入后按回车'", desc: '占位文本' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'max', type: 'number', default: '—', desc: '最大标签数量' },
  { name: 'unique', type: 'boolean', default: 'true', desc: '是否不允许重复标签' },
  { name: 'separator', type: 'string | RegExp', default: '—', desc: '分隔符，支持批量输入' },
  { name: 'tagClass', type: 'string', default: '—', desc: '标签自定义 class' },
  { name: 'tagStyle', type: 'Record<string, string>', default: '—', desc: '标签自定义 style' },
  { name: 'error', type: 'string', default: "''", desc: '错误状态' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string[]) => void', desc: '标签变化时触发' },
  { name: 'change', type: '(value: string[]) => void', desc: '标签变化时触发' },
  { name: 'add', type: '(value: string) => void', desc: '添加标签时触发' },
  { name: 'remove', type: '(value: string) => void', desc: '删除标签时触发' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: '失去焦点时触发' },
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
