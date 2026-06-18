<template>
  <div class="doc-page">
    <h1>Textarea 文本域</h1>
    <p class="doc-page__desc">用于多行文本输入，支持多种变体、自适应高度、字数统计、清除等功能。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 双向绑定数据："
      :code="basicCode"
    >
      <div style="max-width:480px;">
        <NTextarea v-model="val1" placeholder="请输入内容" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">当前值：{{ val1 || '（空）' }}</p>
      </div>
    </DemoBlock>

    <!-- 文本域变体 -->
    <DemoBlock
      title="文本域变体"
      description="提供 outline、filled、borderless 三种样式变体："
      :code="variantCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea v-model="val2" variant="outline" placeholder="Outline 变体" label="Outline" :rows="2" />
        <NTextarea v-model="val3" variant="filled" placeholder="Filled 变体" label="Filled" :rows="2" />
        <NTextarea v-model="val4" variant="borderless" placeholder="Borderless 变体" label="Borderless" :rows="2" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea v-model="val5" size="sm" placeholder="Small 尺寸" :rows="2" />
        <NTextarea v-model="val6" size="md" placeholder="Medium 尺寸" :rows="2" />
        <NTextarea v-model="val7" size="lg" placeholder="Large 尺寸" :rows="2" />
      </div>
    </DemoBlock>

    <!-- 带标签与必填 -->
    <DemoBlock
      title="带标签与必填"
      description="设置 label 显示标签，required 显示必填标记："
      :code="labelCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea v-model="val8" label="个人简介" placeholder="请输入个人简介" required :rows="3" />
        <NTextarea v-model="val9" label="备注信息" placeholder="请输入备注" :rows="2" />
      </div>
    </DemoBlock>

    <!-- 自适应高度 -->
    <DemoBlock
      title="自适应高度"
      description="设置 autoSize 为 true 或对象 { minRows, maxRows } 自动调整高度："
      :code="autoSizeCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">自动适应（无限制）</p>
          <NTextarea v-model="val10" placeholder="输入内容自动增高" :auto-size="true" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:4px;">限制 2~6 行</p>
          <NTextarea v-model="val11" placeholder="最少2行，最多6行" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </div>
      </div>
    </DemoBlock>

    <!-- 字数统计 -->
    <DemoBlock
      title="字数统计"
      description="设置 maxlength 和 showCount 显示字数统计："
      :code="countCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea v-model="val12" placeholder="最多100个字符" :maxlength="100" show-count :rows="3" />
        <NTextarea v-model="val13" placeholder="最多200个字符" :maxlength="200" show-count :rows="3" />
      </div>
    </DemoBlock>

    <!-- 可清除 -->
    <DemoBlock
      title="可清除"
      description="设置 clearable 属性，输入框有值时右上角显示清除按钮："
      :code="clearableCode"
    >
      <div style="max-width:480px;">
        <NTextarea v-model="val14" placeholder="输入内容后可清除" clearable :rows="3" />
      </div>
    </DemoBlock>

    <!-- 错误状态 -->
    <DemoBlock
      title="错误状态"
      description="设置 error 属性显示错误提示："
      :code="errorCode"
    >
      <div style="max-width:480px;">
        <NTextarea v-model="val15" label="反馈内容" placeholder="请输入反馈内容" error="反馈内容不能为空" :rows="3" />
      </div>
    </DemoBlock>

    <!-- 状态与提示 -->
    <DemoBlock
      title="状态与提示"
      description="通过 status 设定状态，statusText 显示状态提示文本："
      :code="statusCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea v-model="val16" status="error" status-text="内容不符合要求" placeholder="错误状态" :rows="2" />
        <NTextarea v-model="val17" status="warning" status-text="请注意字数限制" placeholder="警告状态" :rows="2" />
      </div>
    </DemoBlock>

    <!-- 可调整大小 -->
    <DemoBlock
      title="可调整大小"
      description="设置 resizable 允许用户拖拽调整文本域大小："
      :code="resizableCode"
    >
      <div style="max-width:480px;">
        <NTextarea v-model="val18" placeholder="可拖拽右下角调整大小" resizable :rows="3" />
      </div>
    </DemoBlock>

    <!-- 只读与禁用 -->
    <DemoBlock
      title="只读与禁用"
      description="readonly 只读不可编辑，disabled 禁用且样式变灰："
      :code="stateCode"
    >
      <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
        <NTextarea model-value="这是只读内容，无法编辑。" readonly :rows="2" />
        <NTextarea model-value="这是禁用内容，不可交互。" disabled :rows="2" />
      </div>
    </DemoBlock>

    <!-- 在表单中使用 -->
    <DemoBlock
      title="在表单中使用"
      description="结合 Card 组件构建完整表单："
      :code="formCode"
    >
      <NCard title="意见反馈" style="max-width:480px;" segmented>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <NInput v-model="formName" label="姓名" placeholder="请输入姓名" required clearable />
          <NInput v-model="formEmail" label="邮箱" type="email" placeholder="请输入邮箱" />
          <NTextarea
            v-model="formContent"
            label="反馈内容"
            placeholder="请详细描述您的反馈"
            required
            :maxlength="500"
            show-count
            :auto-size="{ minRows: 3, maxRows: 8 }"
          />
          <NTextarea
            v-model="formSuggestion"
            label="改进建议"
            placeholder="可选，告诉我们您期望的改进方向"
            :rows="2"
            clearable
          />
          <div style="display:flex;gap:8px;margin-top:4px;">
            <NButton type="primary" @click="handleFormSubmit">提交</NButton>
            <NButton @click="handleFormReset">重置</NButton>
          </div>
        </div>
      </NCard>
    </DemoBlock>

    <!-- API -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== 基础用法 ==========
const val1 = ref('')

// ========== 变体 ==========
const val2 = ref('')
const val3 = ref('')
const val4 = ref('')

// ========== 尺寸 ==========
const val5 = ref('')
const val6 = ref('')
const val7 = ref('')

// ========== 标签 ==========
const val8 = ref('')
const val9 = ref('')

// ========== 自适应高度 ==========
const val10 = ref('')
const val11 = ref('')

// ========== 字数统计 ==========
const val12 = ref('')
const val13 = ref('')

// ========== 清除 ==========
const val14 = ref('可以清除的文本内容')

// ========== 错误 ==========
const val15 = ref('')

// ========== 状态 ==========
const val16 = ref('')
const val17 = ref('')

// ========== 可调整大小 ==========
const val18 = ref('')

// ========== 表单 ==========
const formName = ref('')
const formEmail = ref('')
const formContent = ref('')
const formSuggestion = ref('')

const message = useMessage()

function handleFormSubmit() {
  if (!formName.value) { message.warning('请输入姓名'); return }
  if (!formContent.value) { message.warning('请输入反馈内容'); return }
  message.success('提交成功！')
}

function handleFormReset() {
  formName.value = ''
  formEmail.value = ''
  formContent.value = ''
  formSuggestion.value = ''
}

// ========== Code ==========
const basicCode = `<template>
  <NTextarea v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const variantCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea v-model="v1" variant="outline" placeholder="Outline" label="Outline" :rows="2" />
    <NTextarea v-model="v2" variant="filled" placeholder="Filled" label="Filled" :rows="2" />
    <NTextarea v-model="v3" variant="borderless" placeholder="Borderless" label="Borderless" :rows="2" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea v-model="v1" size="sm" placeholder="Small" :rows="2" />
    <NTextarea v-model="v2" size="md" placeholder="Medium" :rows="2" />
    <NTextarea v-model="v3" size="lg" placeholder="Large" :rows="2" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const labelCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea v-model="v1" label="个人简介" placeholder="请输入个人简介" required :rows="3" />
    <NTextarea v-model="v2" label="备注信息" placeholder="请输入备注" :rows="2" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const autoSizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- 自动适应（无限制） -->
    <NTextarea v-model="v1" placeholder="输入内容自动增高" :auto-size="true" />

    <!-- 限制最小最大行数 -->
    <NTextarea v-model="v2" placeholder="最少2行，最多6行" :auto-size="{ minRows: 2, maxRows: 6 }" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const countCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea v-model="v1" placeholder="最多100个字符" :maxlength="100" show-count :rows="3" />
    <NTextarea v-model="v2" placeholder="最多200个字符" :maxlength="200" show-count :rows="3" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const clearableCode = `<template>
  <NTextarea v-model="value" placeholder="输入内容后可清除" clearable :rows="3" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const errorCode = `<template>
  <NTextarea v-model="value" label="反馈内容" error="反馈内容不能为空" :rows="3" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const statusCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea v-model="v1" status="error" status-text="内容不符合要求" placeholder="错误状态" :rows="2" />
    <NTextarea v-model="v2" status="warning" status-text="请注意字数限制" placeholder="警告状态" :rows="2" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const resizableCode = `<template>
  <NTextarea v-model="value" placeholder="可拖拽右下角调整大小" resizable :rows="3" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const stateCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTextarea model-value="只读内容" readonly :rows="2" />
    <NTextarea model-value="禁用内容" disabled :rows="2" />
  </div>
</template>`

const formCode = `<template>
  <NCard title="意见反馈" segmented>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <NInput v-model="name" label="姓名" placeholder="请输入姓名" required clearable />
      <NInput v-model="email" label="邮箱" type="email" placeholder="请输入邮箱" />
      <NTextarea
        v-model="content"
        label="反馈内容"
        placeholder="请详细描述您的反馈"
        required
        :maxlength="500"
        show-count
        :auto-size="{ minRows: 3, maxRows: 8 }"
      />
      <NTextarea
        v-model="suggestion"
        label="改进建议"
        placeholder="可选，告诉我们您期望的改进方向"
        :rows="2"
        clearable
      />
      <div style="display:flex;gap:8px;">
        <NButton type="primary" @click="handleSubmit">提交</NButton>
        <NButton @click="handleReset">重置</NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
const name = ref('')
const email = ref('')
const content = ref('')
const suggestion = ref('')

function handleSubmit() {
  if (!name.value) return
  if (!content.value) return
  console.log('提交成功')
}

function handleReset() {
  name.value = ''
  email.value = ''
  content.value = ''
  suggestion.value = ''
}
<\/script>`

// ========== API ==========
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string', default: "''", desc: '输入值（v-model）' },
  { name: 'variant', type: "'outline' | 'filled' | 'borderless'", default: "'outline'", desc: '文本域变体样式' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '文本域尺寸' },
  { name: 'placeholder', type: 'string', default: "''", desc: '占位文本' },
  { name: 'label', type: 'string', default: "''", desc: '标签文本' },
  { name: 'error', type: 'string', default: "''", desc: '错误提示文本' },
  { name: 'status', type: "'default' | 'error' | 'warning'", default: "'default'", desc: '状态类型' },
  { name: 'statusText', type: 'string', default: "''", desc: '状态提示文本（优先于 error 显示）' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清除' },
  { name: 'maxlength', type: 'number', default: '—', desc: '最大输入长度' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字数统计（需配合 maxlength）' },
  { name: 'rows', type: 'number', default: '4', desc: '默认行数' },
  { name: 'autoSize', type: 'boolean | { minRows?: number; maxRows?: number }', default: 'false', desc: '自适应高度，可设置最小最大行数' },
  { name: 'resizable', type: 'boolean', default: 'false', desc: '是否允许用户拖拽调整大小' },
  { name: 'required', type: 'boolean', default: 'false', desc: '是否显示必填标记' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string) => void', desc: '输入值变化时触发' },
  { name: 'input', type: '(value: string, event: Event) => void', desc: '输入时触发' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: '失去焦点时触发' },
  { name: 'clear', type: '() => void', desc: '点击清除按钮时触发' },
  { name: 'keydown', type: '(event: KeyboardEvent) => void', desc: '按键按下时触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'focus', type: '() => void', desc: '使文本域获得焦点' },
  { name: 'blur', type: '() => void', desc: '使文本域失去焦点' },
  { name: 'resize', type: '() => void', desc: '手动触发自适应高度计算' },
]
</script>
