<template>
  <div class="doc-page">
    <h1>VerificationCode 验证码输入框</h1>
    <p class="doc-page__desc">用于输入验证码，逐字符输入，支持粘贴、密码模式、多种变体和状态。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 双向绑定验证码值，length 设置位数："
      :code="basicCode"
    >
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NVerificationCode v-model="code1" :length="6" @finish="onFinish" />
        <p style="font-size:13px;color:#6b7280;">验证码：{{ code1 || '（空）' }}</p>
      </div>
    </DemoBlock>

    <!-- 不同位数 -->
    <DemoBlock
      title="不同位数"
      description="通过 length 属性设置验证码位数："
      :code="lengthCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">4 位验证码</p>
          <NVerificationCode v-model="code2" :length="4" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">6 位验证码</p>
          <NVerificationCode v-model="code3" :length="6" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">8 位验证码</p>
          <NVerificationCode v-model="code4" :length="8" size="sm" :gap="6" />
        </div>
      </div>
    </DemoBlock>

    <!-- 输入框变体 -->
    <DemoBlock
      title="输入框变体"
      description="提供 box、underline、circle 三种样式变体："
      :code="variantCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Box（默认）</p>
          <NVerificationCode v-model="code5" :length="4" variant="box" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Underline</p>
          <NVerificationCode v-model="code6" :length="4" variant="underline" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Circle</p>
          <NVerificationCode v-model="code7" :length="4" variant="circle" />
        </div>
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NVerificationCode v-model="code8" :length="4" size="sm" />
        <NVerificationCode v-model="code9" :length="4" size="md" />
        <NVerificationCode v-model="code10" :length="4" size="lg" />
      </div>
    </DemoBlock>

    <!-- 密码模式 -->
    <DemoBlock
      title="密码模式"
      description="设置 type 为 password 以圆点替代字符显示："
      :code="passwordCode"
    >
      <NVerificationCode v-model="code11" :length="6" type="password" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">验证码：{{ code11 || '（空）' }}</p>
    </DemoBlock>

    <!-- 数字模式 -->
    <DemoBlock
      title="数字模式"
      description="设置 type 为 number 限制只能输入数字，移动端弹出数字键盘："
      :code="numberCode"
    >
      <NVerificationCode v-model="code12" :length="6" type="number" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">验证码：{{ code12 || '（空）' }}</p>
    </DemoBlock>

    <!-- 分隔符 -->
    <DemoBlock
      title="分隔符"
      description="设置 divider 属性在指定位置添加额外间距，如每 3 位分隔："
      :code="dividerCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">每 3 位分隔</p>
          <NVerificationCode v-model="code13" :length="6" :divider="3" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">指定位置分隔</p>
          <NVerificationCode v-model="code14" :length="8" size="sm" :divider="[4]" :gap="6" />
        </div>
      </div>
    </DemoBlock>

    <!-- 自定义间距 -->
    <DemoBlock
      title="自定义间距"
      description="通过 gap 属性设置输入框之间的间距："
      :code="gapCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NVerificationCode v-model="code15" :length="4" :gap="4" />
        <NVerificationCode v-model="code16" :length="4" :gap="12" />
        <NVerificationCode v-model="code17" :length="4" :gap="20" />
      </div>
    </DemoBlock>

    <!-- 状态 -->
    <DemoBlock
      title="状态"
      description="通过 status 设置成功、错误、警告状态："
      :code="statusCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">成功</p>
          <NVerificationCode model-value="1234" :length="4" status="success" readonly />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">错误</p>
          <NVerificationCode model-value="5678" :length="4" status="error" readonly />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">警告</p>
          <NVerificationCode model-value="9012" :length="4" status="warning" readonly />
        </div>
      </div>
    </DemoBlock>

    <!-- 禁用与只读 -->
    <DemoBlock
      title="禁用与只读"
      description="disabled 禁用输入，readonly 只读展示："
      :code="stateCode"
    >
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NVerificationCode model-value="123456" :length="6" disabled />
        <NVerificationCode model-value="654321" :length="6" readonly />
      </div>
    </DemoBlock>

    <!-- 组合使用 -->
    <DemoBlock
      title="组合使用"
      description="在卡片中结合其他组件构建验证场景："
      :code="combineCode"
    >
      <NCard title="短信验证" style="max-width:360px;" segmented>
        <div style="display:flex;flex-direction:column;gap:16px;align-items:center;">
          <p style="font-size:14px;color:var(--n-color-text-secondary);text-align:center;">
            验证码已发送至 138****8888，请输入 6 位数字验证码
          </p>
          <NVerificationCode v-model="formCode" :length="6" type="number" :divider="3" />
          <div style="display:flex;gap:8px;width:100%;">
            <NButton style="flex:1" :disabled="countdown > 0" @click="handleSendCode">
              {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
            </NButton>
            <NButton type="primary" style="flex:1" @click="handleVerify">验证</NButton>
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

const message = useMessage()

// ========== 基础用法 ==========
const code1 = ref('')
function onFinish(v: string) {
  message.success(`验证码输入完成: ${v}`)
}

// ========== 不同位数 ==========
const code2 = ref('')
const code3 = ref('')
const code4 = ref('')

// ========== 变体 ==========
const code5 = ref('')
const code6 = ref('')
const code7 = ref('')

// ========== 尺寸 ==========
const code8 = ref('')
const code9 = ref('')
const code10 = ref('')

// ========== 密码模式 ==========
const code11 = ref('')

// ========== 数字模式 ==========
const code12 = ref('')

// ========== 分隔符 ==========
const code13 = ref('')
const code14 = ref('')

// ========== 间距 ==========
const code15 = ref('')
const code16 = ref('')
const code17 = ref('')

// ========== 组合使用 ==========
const formCode = ref('')
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function handleSendCode() {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
  message.info('验证码已发送')
}

function handleVerify() {
  if (!formCode.value || formCode.value.length < 6) {
    message.warning('请输入完整的 6 位验证码')
    return
  }
  message.success('验证成功！')
}

// ========== Code ==========
const basicCode = `<template>
  <NVerificationCode v-model="code" :length="6" @finish="onFinish" />
</template>

<script setup lang="ts">
const code = ref('')

function onFinish(val: string) {
  console.log('验证码输入完成:', val)
}
<\/script>`

const lengthCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">4 位验证码</p>
      <NVerificationCode v-model="v1" :length="4" />
    </div>
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">6 位验证码</p>
      <NVerificationCode v-model="v2" :length="6" />
    </div>
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">8 位验证码</p>
      <NVerificationCode v-model="v3" :length="8" size="sm" :gap="6" />
    </div>
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const variantCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Box（默认）</p>
      <NVerificationCode v-model="v1" :length="4" variant="box" />
    </div>
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Underline</p>
      <NVerificationCode v-model="v2" :length="4" variant="underline" />
    </div>
    <div>
      <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">Circle</p>
      <NVerificationCode v-model="v3" :length="4" variant="circle" />
    </div>
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NVerificationCode v-model="v1" :length="4" size="sm" />
    <NVerificationCode v-model="v2" :length="4" size="md" />
    <NVerificationCode v-model="v3" :length="4" size="lg" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const passwordCode = `<template>
  <NVerificationCode v-model="code" :length="6" type="password" />
</template>

<script setup lang="ts">
const code = ref('')
<\/script>`

const numberCode = `<template>
  <NVerificationCode v-model="code" :length="6" type="number" />
</template>

<script setup lang="ts">
const code = ref('')
<\/script>`

const dividerCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- 每 3 位分隔 -->
    <NVerificationCode v-model="v1" :length="6" :divider="3" />

    <!-- 指定位置分隔 -->
    <NVerificationCode v-model="v2" :length="8" size="sm" :divider="[4]" :gap="6" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
<\/script>`

const gapCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NVerificationCode v-model="v1" :length="4" :gap="4" />
    <NVerificationCode v-model="v2" :length="4" :gap="12" />
    <NVerificationCode v-model="v3" :length="4" :gap="20" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
<\/script>`

const statusCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NVerificationCode model-value="1234" :length="4" status="success" readonly />
    <NVerificationCode model-value="5678" :length="4" status="error" readonly />
    <NVerificationCode model-value="9012" :length="4" status="warning" readonly />
  </div>
</template>`

const stateCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NVerificationCode model-value="123456" :length="6" disabled />
    <NVerificationCode model-value="654321" :length="6" readonly />
  </div>
</template>`

const combineCode = `<template>
  <NCard title="短信验证" segmented>
    <div style="display:flex;flex-direction:column;gap:16px;align-items:center;">
      <p>验证码已发送至 138****8888</p>
      <NVerificationCode v-model="code" :length="6" type="number" :divider="3" />
      <div style="display:flex;gap:8px;width:100%;">
        <NButton :disabled="countdown > 0" @click="sendCode">
          {{ countdown > 0 ? \`\${countdown}s 后重发\` : '获取验证码' }}
        </NButton>
        <NButton type="primary" @click="verify">验证</NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
const code = ref('')
const countdown = ref(0)

function sendCode() {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

function verify() {
  if (!code.value || code.value.length < 6) return
  console.log('验证成功')
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
  { name: 'modelValue', type: 'string', default: "''", desc: '验证码值（v-model）' },
  { name: 'length', type: 'number', default: '6', desc: '验证码位数' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '输入框尺寸' },
  { name: 'variant', type: "'box' | 'underline' | 'circle'", default: "'box'", desc: '输入框变体样式' },
  { name: 'type', type: "'text' | 'number' | 'password'", default: "'text'", desc: '输入类型：number 限制数字且弹出数字键盘，password 以圆点显示' },
  { name: 'gap', type: 'number | string', default: '8', desc: '输入框之间的间距（px 或 string）' },
  { name: 'divider', type: 'number | number[]', default: '—', desc: '分隔符位置，number 表示每隔 N 位分隔，number[] 指定在第几位后分隔' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'error', type: 'boolean', default: 'false', desc: '是否显示错误样式' },
  { name: 'status', type: "'default' | 'error' | 'success' | 'warning'", default: "'default'", desc: '状态类型，会影响边框颜色' },
  { name: 'plain', type: 'boolean', default: 'false', desc: '是否使用透明背景' },
  { name: 'mask', type: 'boolean | string', default: 'false', desc: '是否遮罩显示，可自定义遮罩字符' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string) => void', desc: '验证码值变化时触发' },
  { name: 'change', type: '(value: string) => void', desc: '验证码值变化时触发' },
  { name: 'finish', type: '(value: string) => void', desc: '验证码输入完成时触发' },
  { name: 'focus', type: '() => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '() => void', desc: '失去焦点时触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'focus', type: '() => void', desc: '使输入框获得焦点' },
  { name: 'blur', type: '() => void', desc: '使输入框失去焦点' },
  { name: 'clear', type: '() => void', desc: '清空验证码' },
]
</script>
