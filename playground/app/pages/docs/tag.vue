<template>
  <div class="doc-page">
    <h1>Tag 标签</h1>
    <p class="doc-page__desc">用于标记和分类，支持多种颜色类型、样式和交互。</p>

    <DemoBlock title="基础用法" description="通过 type 设置标签颜色类型。" :code="basicCode">
      <NSpace>
        <NTag>默认</NTag>
        <NTag type="primary">主要</NTag>
        <NTag type="success">成功</NTag>
        <NTag type="warning">警告</NTag>
        <NTag type="danger">危险</NTag>
        <NTag type="info">信息</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="设置 size 使用不同大小的标签。" :code="sizeCode">
      <NSpace align="center">
        <NTag size="sm" type="primary">小标签</NTag>
        <NTag size="md" type="primary">默认标签</NTag>
        <NTag size="lg" type="primary">大标签</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="主题效果" description="设置 effect 切换标签主题风格：light / dark / outlined / plain。" :code="effectCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NSpace>
          <NTag effect="light">默认</NTag>
          <NTag effect="light" type="primary">主要</NTag>
          <NTag effect="light" type="success">成功</NTag>
          <NTag effect="light" type="warning">警告</NTag>
          <NTag effect="light" type="danger">危险</NTag>
        </NSpace>
        <NSpace>
          <NTag effect="dark">默认</NTag>
          <NTag effect="dark" type="primary">主要</NTag>
          <NTag effect="dark" type="success">成功</NTag>
          <NTag effect="dark" type="warning">警告</NTag>
          <NTag effect="dark" type="danger">危险</NTag>
        </NSpace>
        <NSpace>
          <NTag effect="outlined">默认</NTag>
          <NTag effect="outlined" type="primary">主要</NTag>
          <NTag effect="outlined" type="success">成功</NTag>
          <NTag effect="outlined" type="warning">警告</NTag>
          <NTag effect="outlined" type="danger">危险</NTag>
        </NSpace>
        <NSpace>
          <NTag effect="plain">默认</NTag>
          <NTag effect="plain" type="primary">主要</NTag>
          <NTag effect="plain" type="success">成功</NTag>
          <NTag effect="plain" type="warning">警告</NTag>
          <NTag effect="plain" type="danger">危险</NTag>
        </NSpace>
      </div>
    </DemoBlock>

    <DemoBlock title="圆角标签" description="设置 round 显示为圆角胶囊标签。" :code="roundCode">
      <NSpace>
        <NTag round>默认</NTag>
        <NTag type="primary" round>主要</NTag>
        <NTag type="success" round>成功</NTag>
        <NTag type="warning" round>警告</NTag>
        <NTag type="danger" round>危险</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="可关闭标签" description="设置 closable 显示关闭按钮，监听 close 事件。" :code="closableCode">
      <NSpace>
        <NTag v-for="tag in dynamicTags" :key="tag.label" :type="tag.type" closable @close="removeTag(tag.label)">
          {{ tag.label }}
        </NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="带图标" description="通过 icon 字段为标签添加内置图标。" :code="iconCode">
      <NSpace>
        <NTag icon="shouye" type="primary">首页</NTag>
        <NTag icon="chenggong" type="success">已完成</NTag>
        <NTag icon="tanhao" type="warning">注意</NTag>
        <NTag icon="shibai" type="danger">失败</NTag>
        <NTag icon="shezhi" type="info">设置</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="可选中标签" description="设置 checkable 使标签可选中，支持 v-model:checked 或 v-model 双向绑定。" :code="checkableCode">
      <NSpace>
        <NTag checkable v-model:checked="check1" type="primary">Vue</NTag>
        <NTag checkable v-model:checked="check2" type="success">React</NTag>
        <NTag checkable v-model:checked="check3" type="warning">Angular</NTag>
        <NTag checkable v-model:checked="check4" type="danger">Svelte</NTag>
      </NSpace>
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        选中：{{ selectedFrameworks.join('、') }}
      </div>
    </DemoBlock>

    <DemoBlock title="自定义颜色" description="设置 color 和 textColor 自定义标签颜色。" :code="colorCode">
      <NSpace>
        <NTag color="#722ed1" textColor="#fff" effect="dark">紫色</NTag>
        <NTag color="#13c2c2" textColor="#fff" effect="dark">青色</NTag>
        <NTag color="#eb2f96" textColor="#fff" effect="dark">品红</NTag>
        <NTag color="#52c41a" textColor="#fff" effect="dark">绿色</NTag>
        <NTag color="#fa8c16" textColor="#fff" effect="dark">橙色</NTag>
      </NSpace>
      <NSpace style="margin-top:8px;">
        <NTag color="#722ed1" effect="outlined">紫色描边</NTag>
        <NTag color="#13c2c2" effect="outlined">青色描边</NTag>
        <NTag color="#eb2f96" effect="outlined">品红描边</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="带边框" description="设置 bordered 为浅色或深色标签添加边框。" :code="borderedCode">
      <NSpace>
        <NTag type="primary" bordered>浅色带边框</NTag>
        <NTag type="success" bordered>浅色带边框</NTag>
        <NTag type="primary" effect="dark" bordered>深色带边框</NTag>
        <NTag type="success" effect="dark" bordered>深色带边框</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="禁用状态" description="设置 disabled 禁用标签交互。" :code="disabledCode">
      <NSpace>
        <NTag type="primary" disabled>禁用标签</NTag>
        <NTag type="success" closable disabled>禁用可关闭</NTag>
        <NTag type="warning" checkable disabled>禁用可选</NTag>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="动态编辑" description="通过输入框和关闭按钮实现动态增删标签。" :code="dynamicCode">
      <NSpace wrap>
        <NTag v-for="tag in editTags" :key="tag" closable type="primary" @close="removeEditTag(tag)">{{ tag }}</NTag>
        <input
          v-if="inputVisible"
          ref="inputRef"
          v-model="inputValue"
          class="tag-input"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <button v-else class="tag-add-btn" @click="showInput">+ 添加标签</button>
      </NSpace>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ===== 基础用法 =====
const basicCode = `<template>
  <NSpace>
    <NTag>默认</NTag>
    <NTag type="primary">主要</NTag>
    <NTag type="success">成功</NTag>
    <NTag type="warning">警告</NTag>
    <NTag type="danger">危险</NTag>
    <NTag type="info">信息</NTag>
  </NSpace>
</template>`

// ===== 不同尺寸 =====
const sizeCode = `<template>
  <NSpace align="center">
    <NTag size="sm" type="primary">小标签</NTag>
    <NTag size="md" type="primary">默认标签</NTag>
    <NTag size="lg" type="primary">大标签</NTag>
  </NSpace>
</template>`

// ===== 主题效果 =====
const effectCode = `<template>
  <!-- Light（默认） -->
  <NTag effect="light" type="primary">主要</NTag>
  <!-- Dark -->
  <NTag effect="dark" type="primary">主要</NTag>
  <!-- Outlined -->
  <NTag effect="outlined" type="primary">主要</NTag>
  <!-- Plain -->
  <NTag effect="plain" type="primary">主要</NTag>
</template>`

// ===== 圆角标签 =====
const roundCode = `<template>
  <NSpace>
    <NTag round>默认</NTag>
    <NTag type="primary" round>主要</NTag>
    <NTag type="success" round>成功</NTag>
  </NSpace>
</template>`

// ===== 可关闭 =====
const dynamicTags = ref([
  { label: '标签一', type: 'default' as const },
  { label: '标签二', type: 'primary' as const },
  { label: '标签三', type: 'success' as const },
])
function removeTag(label: string) {
  dynamicTags.value = dynamicTags.value.filter(t => t.label !== label)
}

const closableCode = `<template>
  <NSpace>
    <NTag
      v-for="tag in tags"
      :key="tag.label"
      :type="tag.type"
      closable
      @close="removeTag(tag.label)"
    >{{ tag.label }}</NTag>
  </NSpace>
</template>

<script setup lang="ts">
const tags = ref([
  { label: '标签一', type: 'default' },
  { label: '标签二', type: 'primary' },
  { label: '标签三', type: 'success' },
])
function removeTag(label: string) {
  tags.value = tags.value.filter(t => t.label !== label)
}
<\/script>`

// ===== 带图标 =====
const iconCode = `<template>
  <NSpace>
    <NTag icon="shouye" type="primary">首页</NTag>
    <NTag icon="chenggong" type="success">已完成</NTag>
    <NTag icon="tanhao" type="warning">注意</NTag>
    <NTag icon="shibai" type="danger">失败</NTag>
    <NTag icon="shezhi" type="info">设置</NTag>
  </NSpace>
</template>`

// ===== 可选中 =====
const check1 = ref(true)
const check2 = ref(false)
const check3 = ref(false)
const check4 = ref(false)

const selectedFrameworks = computed(() => {
  const list: string[] = []
  if (check1.value) list.push('Vue')
  if (check2.value) list.push('React')
  if (check3.value) list.push('Angular')
  if (check4.value) list.push('Svelte')
  return list
})

const checkableCode = `<template>
  <NSpace>
    <NTag checkable v-model:checked="check1" type="primary">Vue</NTag>
    <NTag checkable v-model:checked="check2" type="success">React</NTag>
    <NTag checkable v-model:checked="check3" type="warning">Angular</NTag>
    <NTag checkable v-model:checked="check4" type="danger">Svelte</NTag>
  </NSpace>
</template>

<script setup lang="ts">
const check1 = ref(true)
const check2 = ref(false)
const check3 = ref(false)
const check4 = ref(false)
<\/script>`

// ===== 自定义颜色 =====
const colorCode = `<template>
  <NSpace>
    <NTag color="#722ed1" textColor="#fff" effect="dark">紫色</NTag>
    <NTag color="#13c2c2" textColor="#fff" effect="dark">青色</NTag>
    <NTag color="#eb2f96" textColor="#fff" effect="dark">品红</NTag>
  </NSpace>
  <NSpace>
    <NTag color="#722ed1" effect="outlined">紫色描边</NTag>
    <NTag color="#13c2c2" effect="outlined">青色描边</NTag>
  </NSpace>
</template>`

// ===== 带边框 =====
const borderedCode = `<template>
  <NSpace>
    <NTag type="primary" bordered>浅色带边框</NTag>
    <NTag type="primary" effect="dark" bordered>深色带边框</NTag>
  </NSpace>
</template>`

// ===== 禁用状态 =====
const disabledCode = `<template>
  <NSpace>
    <NTag type="primary" disabled>禁用标签</NTag>
    <NTag type="success" closable disabled>禁用可关闭</NTag>
    <NTag type="warning" checkable disabled>禁用可选</NTag>
  </NSpace>
</template>`

// ===== 动态编辑 =====
const editTags = ref(['前端', 'Vue', 'TypeScript'])
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function removeEditTag(tag: string) {
  editTags.value = editTags.value.filter(t => t !== tag)
}
function showInput() {
  inputVisible.value = true
  nextTick(() => inputRef.value?.focus())
}
function handleInputConfirm() {
  if (inputValue.value && !editTags.value.includes(inputValue.value)) {
    editTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const dynamicCode = `<template>
  <NSpace wrap>
    <NTag
      v-for="tag in tags"
      :key="tag"
      closable
      type="primary"
      @close="removeTag(tag)"
    >{{ tag }}</NTag>
    <input
      v-if="inputVisible"
      v-model="inputValue"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <button v-else @click="showInput">+ 添加标签</button>
  </NSpace>
</template>

<script setup lang="ts">
const tags = ref(['前端', 'Vue', 'TypeScript'])
const inputVisible = ref(false)
const inputValue = ref('')

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}
function showInput() {
  inputVisible.value = true
  nextTick(() => inputRef.value?.focus())
}
function handleInputConfirm() {
  if (inputValue.value && !tags.value.includes(inputValue.value)) {
    tags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
<\/script>`

// ===== API Tables =====
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'type', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", desc: '标签类型' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'effect', type: "'light' | 'dark' | 'outlined' | 'plain'", default: "'light'", desc: '主题效果' },
  { name: 'round', type: 'boolean', default: 'false', desc: '是否为圆角胶囊标签' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
  { name: 'icon', type: 'string', default: '—', desc: '内置图标名称' },
  { name: 'color', type: 'string', default: '—', desc: '自定义背景色（优先级高于 type）' },
  { name: 'textColor', type: 'string', default: '—', desc: '自定义文字颜色' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'checkable', type: 'boolean', default: 'false', desc: '是否可选中' },
  { name: 'checked', type: 'boolean', default: 'undefined', desc: '选中状态（支持 v-model:checked）' },
  { name: 'modelValue', type: 'boolean', default: 'undefined', desc: '选中状态（支持 v-model）' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'close', type: '() => void', desc: '点击关闭按钮时触发' },
  { name: 'click', type: '(e: MouseEvent) => void', desc: '点击标签时触发' },
  { name: 'change', type: '(checked: boolean) => void', desc: '选中状态变化时触发（checkable 时）' },
  { name: 'update:checked', type: '(checked: boolean) => void', desc: '选中状态变化（v-model:checked）' },
  { name: 'update:modelValue', type: '(checked: boolean) => void', desc: '选中状态变化（v-model）' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '标签内容' },
]
</script>

<style scoped>
.tag-input {
  width: 100px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-sm);
  font-size: var(--n-font-size-sm);
  outline: none;
  transition: border-color 0.2s;
}
.tag-input:focus {
  border-color: var(--n-color-primary);
}
.tag-add-btn {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border: 1px dashed var(--n-color-border);
  border-radius: var(--n-radius-sm);
  background: none;
  color: var(--n-color-text-secondary);
  font-size: var(--n-font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}
.tag-add-btn:hover {
  border-color: var(--n-color-primary);
  color: var(--n-color-primary);
}
</style>
