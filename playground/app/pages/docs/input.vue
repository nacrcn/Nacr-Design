<template>
  <div class="doc-page">
    <h1>Input 输入框</h1>
    <p class="doc-page__desc">基础表单输入组件，支持多种变体、尺寸、前后缀、清除、密码切换、字数统计等功能。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 双向绑定数据："
      :code="basicCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val1" placeholder="请输入内容" />
        <p style="font-size:13px; color:#6b7280;">当前值：{{ val1 }}</p>
      </div>
    </DemoBlock>

    <!-- 输入框变体 -->
    <DemoBlock
      title="输入框变体"
      description="提供 outline、filled、borderless 三种样式变体："
      :code="variantCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val2" variant="outline" placeholder="Outline 变体" label="Outline" />
        <NInput v-model="val3" variant="filled" placeholder="Filled 变体" label="Filled" />
        <NInput v-model="val4" variant="borderless" placeholder="Borderless 变体" label="Borderless" />
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val5" size="sm" placeholder="Small 尺寸" />
        <NInput v-model="val6" size="md" placeholder="Medium 尺寸" />
        <NInput v-model="val7" size="lg" placeholder="Large 尺寸" />
      </div>
    </DemoBlock>

    <!-- 带标签 -->
    <DemoBlock
      title="带标签与必填"
      description="设置 label 显示标签，required 显示必填标记："
      :code="labelCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val8" label="用户名" placeholder="请输入用户名" required />
        <NInput v-model="val9" label="邮箱" type="email" placeholder="请输入邮箱" />
      </div>
    </DemoBlock>

    <!-- 错误状态 -->
    <DemoBlock
      title="错误状态"
      description="设置 error 属性显示错误提示："
      :code="errorCode"
    >
      <div style="max-width:360px;">
        <NInput v-model="val10" label="邮箱" type="email" placeholder="请输入邮箱" error="邮箱格式不正确" />
      </div>
    </DemoBlock>

    <!-- 前后缀 -->
    <DemoBlock
      title="前后缀"
      description="使用 prefixText/suffixText 属性或 #prefix / #suffix 插槽添加前后缀："
      :code="prefixCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val11" placeholder="搜索...">
          <template #prefix>🔍</template>
          <template #suffix>
            <NButton size="sm" @click="handleSearch">搜索</NButton>
          </template>
        </NInput>
        <NInput v-model="val12" placeholder="金额" prefix-text="¥" />
        <NInput v-model="val13" placeholder="网址" suffix-text=".com" />
      </div>
    </DemoBlock>

    <!-- 可清除 -->
    <DemoBlock
      title="可清除"
      description="设置 clearable 属性，输入框有值时显示清除按钮："
      :code="clearableCode"
    >
      <div style="max-width:360px;">
        <NInput v-model="val14" placeholder="输入内容后可清除" clearable />
      </div>
    </DemoBlock>

    <!-- 密码输入 -->
    <DemoBlock
      title="密码输入"
      description="设置 type 为 password，右侧显示密码切换按钮："
      :code="passwordCode"
    >
      <div style="max-width:360px;">
        <NInput v-model="val15" type="password" placeholder="请输入密码" />
      </div>
    </DemoBlock>

    <!-- 字数统计 -->
    <DemoBlock
      title="字数统计"
      description="设置 maxlength 和 showCount 显示字数统计："
      :code="countCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val16" placeholder="最多20个字符" :maxlength="20" show-count />
        <NInput v-model="val17" placeholder="最多50个字符" :maxlength="50" show-count />
      </div>
    </DemoBlock>

    <!-- 只读与禁用 -->
    <DemoBlock
      title="只读与禁用"
      description="readonly 只读不可编辑，disabled 禁用且样式变灰："
      :code="stateCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput model-value="只读内容" readonly />
        <NInput model-value="禁用内容" disabled />
        <NInput model-value="禁用且带标签" label="标签" disabled />
      </div>
    </DemoBlock>

    <!-- 不同类型 -->
    <DemoBlock
      title="不同类型"
      description="通过 type 属性设置 input 原生类型："
      :code="typeCode"
    >
      <div style="max-width:360px; display:flex; flex-direction:column; gap:12px;">
        <NInput v-model="val18" type="text" placeholder="文本输入" label="Text" />
        <NInput v-model="val19" type="number" placeholder="数字输入" label="Number" />
        <NInput v-model="val20" type="email" placeholder="邮箱输入" label="Email" />
        <NInput v-model="val21" type="tel" placeholder="电话输入" label="Tel" />
        <NInput v-model="val22" type="url" placeholder="网址输入" label="URL" />
      </div>
    </DemoBlock>

    <!-- 在表单中使用 -->
    <DemoBlock
      title="在表单中使用"
      description="结合 Card 组件构建完整表单："
      :code="formCode"
    >
      <NCard title="用户注册" style="max-width:400px;" segmented>
        <div style="display:flex; flex-direction:column; gap:16px;">
          <NInput v-model="formName" label="用户名" placeholder="请输入用户名" required clearable />
          <NInput v-model="formEmail" label="邮箱" type="email" placeholder="请输入邮箱" :error="formEmailError" />
          <NInput v-model="formPwd" label="密码" type="password" placeholder="请输入密码" :maxlength="20" show-count />
          <NInput v-model="formPhone" label="手机号" type="tel" placeholder="请输入手机号" prefix-text="+86" />
          <div style="display:flex; gap:8px; margin-top:4px;">
            <NButton type="primary" @click="handleSubmit">注册</NButton>
            <NButton @click="handleReset">重置</NButton>
          </div>
        </div>
      </NCard>
    </DemoBlock>

    <!-- API 表格 -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
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

// ========== 错误 ==========
const val10 = ref('abc')

// ========== 前后缀 ==========
const val11 = ref('')
const val12 = ref('')
const val13 = ref('')

const message = useMessage()
function handleSearch() {
  message.info(`搜索: ${val11.value}`)
}

// ========== 清除 ==========
const val14 = ref('可清除的内容')

// ========== 密码 ==========
const val15 = ref('')

// ========== 字数统计 ==========
const val16 = ref('')
const val17 = ref('')

// ========== 状态 ==========
// (使用 model-value 静态值)

// ========== 不同类型 ==========
const val18 = ref('')
const val19 = ref('')
const val20 = ref('')
const val21 = ref('')
const val22 = ref('')

// ========== 表单 ==========
const formName = ref('')
const formEmail = ref('')
const formPwd = ref('')
const formPhone = ref('')

const formEmailError = computed(() => {
  if (!formEmail.value) return ''
  return formEmail.value.includes('@') ? '' : '邮箱格式不正确'
})

function handleSubmit() {
  if (!formName.value) { message.warning('请输入用户名'); return }
  if (formEmailError.value) { message.warning('请输入正确的邮箱'); return }
  if (!formPwd.value) { message.warning('请输入密码'); return }
  message.success('注册成功！')
}

function handleReset() {
  formName.value = ''
  formEmail.value = ''
  formPwd.value = ''
  formPhone.value = ''
}

// ========== Code ==========
const basicCode = `<template>
  <NInput v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const variantCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="v1" variant="outline" placeholder="Outline 变体" label="Outline" />
    <NInput v-model="v2" variant="filled" placeholder="Filled 变体" label="Filled" />
    <NInput v-model="v3" variant="borderless" placeholder="Borderless 变体" label="Borderless" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="v1" size="sm" placeholder="Small" />
    <NInput v-model="v2" size="md" placeholder="Medium" />
    <NInput v-model="v3" size="lg" placeholder="Large" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const labelCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="username" label="用户名" placeholder="请输入用户名" required />
    <NInput v-model="email" label="邮箱" type="email" placeholder="请输入邮箱" />
  </div>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
<\/script>`

const errorCode = `<template>
  <NInput v-model="email" label="邮箱" type="email" error="邮箱格式不正确" />
</template>

<script setup lang="ts">
const email = ref('abc')
<\/script>`

const prefixCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="search" placeholder="搜索...">
      <template #prefix>🔍</template>
      <template #suffix>
        <NButton size="sm" @click="handleSearch">搜索</NButton>
      </template>
    </NInput>
    <NInput v-model="amount" placeholder="金额" prefix-text="¥" />
    <NInput v-model="url" placeholder="网址" suffix-text=".com" />
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const amount = ref('')
const url = ref('')

function handleSearch() {
  console.log('搜索:', search.value)
}
<\/script>`

const clearableCode = `<template>
  <NInput v-model="value" placeholder="输入内容后可清除" clearable />
</template>

<script setup lang="ts">
const value = ref('')
<\/script>`

const passwordCode = `<template>
  <NInput v-model="pwd" type="password" placeholder="请输入密码" />
</template>

<script setup lang="ts">
const pwd = ref('')
<\/script>`

const countCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="v1" placeholder="最多20个字符" :maxlength="20" show-count />
    <NInput v-model="v2" placeholder="最多50个字符" :maxlength="50" show-count />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const stateCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput model-value="只读内容" readonly />
    <NInput model-value="禁用内容" disabled />
  </div>
</template>`

const typeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NInput v-model="v1" type="text" placeholder="文本输入" label="Text" />
    <NInput v-model="v2" type="number" placeholder="数字输入" label="Number" />
    <NInput v-model="v3" type="email" placeholder="邮箱输入" label="Email" />
    <NInput v-model="v4" type="tel" placeholder="电话输入" label="Tel" />
    <NInput v-model="v5" type="url" placeholder="网址输入" label="URL" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const v4 = ref('')
const v5 = ref('')
<\/script>`

const formCode = `<template>
  <NCard title="用户注册" segmented>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <NInput v-model="name" label="用户名" placeholder="请输入用户名" required clearable />
      <NInput v-model="email" label="邮箱" type="email" placeholder="请输入邮箱" :error="emailError" />
      <NInput v-model="pwd" label="密码" type="password" placeholder="请输入密码" :maxlength="20" show-count />
      <NInput v-model="phone" label="手机号" type="tel" placeholder="请输入手机号" prefix-text="+86" />
      <div style="display:flex;gap:8px;">
        <NButton type="primary" @click="handleSubmit">注册</NButton>
        <NButton @click="handleReset">重置</NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
const name = ref('')
const email = ref('')
const pwd = ref('')
const phone = ref('')

const emailError = computed(() => {
  if (!email.value) return ''
  return email.value.includes('@') ? '' : '邮箱格式不正确'
})

function handleSubmit() {
  if (!name.value) return
  if (emailError.value) return
  if (!pwd.value) return
  console.log('注册成功')
}

function handleReset() {
  name.value = ''
  email.value = ''
  pwd.value = ''
  phone.value = ''
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
  { name: 'modelValue', type: 'string | number', default: "''", desc: '输入值（v-model）' },
  { name: 'type', type: 'string', default: "'text'", desc: '输入框原生类型，如 text / number / email / tel / url / password 等' },
  { name: 'variant', type: "'outline' | 'filled' | 'borderless'", default: "'outline'", desc: '输入框变体样式' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '输入框尺寸' },
  { name: 'placeholder', type: 'string', default: "''", desc: '占位文本' },
  { name: 'label', type: 'string', default: "''", desc: '标签文本' },
  { name: 'error', type: 'string', default: "''", desc: '错误提示文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清除' },
  { name: 'maxlength', type: 'number', default: '—', desc: '最大输入长度' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字数统计（需配合 maxlength）' },
  { name: 'prefixText', type: 'string', default: "''", desc: '前缀文本' },
  { name: 'suffixText', type: 'string', default: "''", desc: '后缀文本' },
  { name: 'required', type: 'boolean', default: 'false', desc: '是否显示必填标记' },
  { name: 'autofocus', type: 'boolean', default: 'false', desc: '是否自动聚焦' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string) => void', desc: '输入值变化时触发' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: '失去焦点时触发' },
  { name: 'change', type: '(event: Event) => void', desc: '值改变且失焦时触发' },
  { name: 'clear', type: '() => void', desc: '点击清除按钮时触发' },
  { name: 'keydown', type: '(event: KeyboardEvent) => void', desc: '按键按下时触发' },
  { name: 'keyup', type: '(event: KeyboardEvent) => void', desc: '按键释放时触发' },
  { name: 'keypress', type: '(event: KeyboardEvent) => void', desc: '按键输入时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'prefix', desc: '输入框前缀（优先于 prefixText）' },
  { name: 'suffix', desc: '输入框后缀（优先于 suffixText）' },
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
