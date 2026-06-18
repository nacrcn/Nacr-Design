<template>
  <div class="doc-page">
    <h1>Form 表单</h1>
    <p class="doc-page__desc">用于收集、校验和提交数据，支持水平、垂直、行内布局，支持自定义校验、动态表单项、联动等。</p>

    <DemoBlock title="综合示例" description="包含多种控件与校验规则的完整表单。" :code="fullCode">
      <NForm ref="fullFormRef" :model="fullData" :rules="fullRules" colon label-width="80">
        <NFormItem field="name" label="姓名" required><NInput v-model="fullData.name" placeholder="请输入姓名" /></NFormItem>
        <NFormItem field="email" label="邮箱" required><NInput v-model="fullData.email" placeholder="请输入邮箱" /></NFormItem>
        <NFormItem field="city" label="城市" required><NSelect v-model="fullData.city" :options="cityOptions" placeholder="请选择" /></NFormItem>
        <NFormItem field="gender" label="性别"><NRadioGroup v-model="fullData.gender"><NRadio value="male">男</NRadio><NRadio value="female">女</NRadio></NRadioGroup></NFormItem>
        <NFormItem field="notify" label="通知"><NSwitch v-model="fullData.notify" /></NFormItem>
        <NFormItem field="remark" label="备注"><NTextarea v-model="fullData.remark" :rows="3" placeholder="请输入备注" /></NFormItem>
        <NFormItem>
          <NButton type="primary" @click="handleFullSubmit">提交</NButton>
          <NButton variant="secondary" style="margin-left:12px" @click="handleFullReset">重置</NButton>
        </NFormItem>
      </NForm>
      <div v-if="fullResult" style="margin-top:12px;padding:12px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#166534">{{ fullResult }}</div>
    </DemoBlock>

    <DemoBlock title="垂直布局" description="layout='vertical'，标签在控件上方。" :code="verticalCode">
      <NForm :model="verticalData" :rules="verticalRules" layout="vertical">
        <NFormItem field="name" label="姓名" required><NInput v-model="verticalData.name" placeholder="请输入姓名" /></NFormItem>
        <NFormItem field="email" label="邮箱" required><NInput v-model="verticalData.email" placeholder="请输入邮箱" /></NFormItem>
        <NFormItem field="bio" label="简介"><NTextarea v-model="verticalData.bio" :rows="3" placeholder="介绍一下自己" /></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="行内表单" description="layout='inline'，适用于搜索栏。" :code="inlineCode">
      <NForm :model="inlineData" layout="inline">
        <NFormItem field="name" label="姓名"><NInput v-model="inlineData.name" placeholder="姓名" /></NFormItem>
        <NFormItem field="status" label="状态"><NSelect v-model="inlineData.status" :options="statusOptions" placeholder="状态" style="min-width:120px" /></NFormItem>
        <NFormItem><NButton type="primary">查询</NButton></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="表单尺寸" description="size 设置整体尺寸（xs / sm / md / lg）。" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:24px">
        <div v-for="s in (['xs','sm','md','lg'] as const)" :key="s">
          <div style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px">size = "{{ s }}"</div>
          <NForm :model="sizeData" :size="s" layout="inline">
            <NFormItem field="name" label="姓名"><NInput v-model="sizeData.name" placeholder="姓名" /></NFormItem>
            <NFormItem field="city" label="城市"><NSelect v-model="sizeData.city" :options="cityOptions" placeholder="选择" style="min-width:120px" /></NFormItem>
            <NFormItem><NButton type="primary">提交</NButton></NFormItem>
          </NForm>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="禁用表单" description="disabled 禁用整个表单。" :code="disabledCode">
      <NForm :model="disabledData" disabled colon label-width="80">
        <NFormItem field="name" label="姓名"><NInput v-model="disabledData.name" /></NFormItem>
        <NFormItem field="city" label="城市"><NSelect v-model="disabledData.city" :options="cityOptions" /></NFormItem>
        <NFormItem field="notify" label="通知"><NSwitch v-model="disabledData.notify" /></NFormItem>
        <NFormItem><NButton type="primary">提交</NButton></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="标签对齐与宽度" description="label-width 统一设置标签宽度，label-align 控制文本对齐。" :code="labelCode">
      <NForm :model="labelData" label-width="100" colon>
        <NFormItem field="name" label="用户名"><NInput v-model="labelData.name" placeholder="请输入" /></NFormItem>
        <NFormItem field="email" label="电子邮件"><NInput v-model="labelData.email" placeholder="请输入" /></NFormItem>
        <NFormItem field="phone" label="手机号码"><NInput v-model="labelData.phone" placeholder="请输入" /></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="自定义校验" description="validator 函数实现自定义校验逻辑。" :code="customCode">
      <NForm ref="customFormRef" :model="customData" :rules="customRules" layout="vertical">
        <NFormItem field="password" label="密码" required><NInput v-model="customData.password" placeholder="请输入密码" type="password" /></NFormItem>
        <NFormItem field="confirmPassword" label="确认密码" required><NInput v-model="customData.confirmPassword" placeholder="再次输入密码" type="password" /></NFormItem>
        <NFormItem field="phone" label="手机号"><NInput v-model="customData.phone" placeholder="请输入手机号" /></NFormItem>
        <NFormItem>
          <NButton type="primary" @click="handleCustomSubmit">验证</NButton>
          <NButton variant="secondary" style="margin-left:12px" @click="customFormRef?.resetFields()">重置</NButton>
        </NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="动态增减表单项" description="动态管理表单项，支持增加和删除。" :code="dynamicCode">
      <NForm ref="dynamicFormRef" :model="dynamicData" label-position="top">
        <div v-for="(item, i) in dynamicData.users" :key="i" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding:12px;border:1px solid var(--n-color-border);border-radius:8px">
          <div style="flex:1"><NFormItem :field="`users.${i}.name`" label="姓名" required><NInput v-model="item.name" placeholder="姓名" /></NFormItem></div>
          <div style="flex:1"><NFormItem :field="`users.${i}.email`" label="邮箱"><NInput v-model="item.email" placeholder="邮箱" /></NFormItem></div>
          <NButton variant="ghost" type="danger" style="margin-top:28px" @click="dynamicData.users.splice(i,1)" :disabled="dynamicData.users.length<=1">✕</NButton>
        </div>
        <NButton variant="ghost" @click="dynamicData.users.push({name:'',email:''})" style="width:100%;margin-bottom:16px">+ 添加用户</NButton>
        <NFormItem><NButton type="primary" @click="handleDynamicSubmit">提交</NButton></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="表单联动" description="根据字段值动态显示/隐藏表单项。" :code="linkageCode">
      <NForm :model="linkageData" colon label-width="80">
        <NFormItem field="contactType" label="联系方式"><NSelect v-model="linkageData.contactType" :options="contactTypeOptions" placeholder="选择方式" /></NFormItem>
        <NFormItem v-if="linkageData.contactType==='email'" field="email" label="邮箱"><NInput v-model="linkageData.email" placeholder="邮箱地址" /></NFormItem>
        <NFormItem v-if="linkageData.contactType==='phone'" field="phone" label="手机号"><NInput v-model="linkageData.phone" placeholder="手机号码" /></NFormItem>
        <NFormItem v-if="linkageData.contactType==='address'" field="address" label="地址"><NTextarea v-model="linkageData.address" :rows="2" placeholder="详细地址" /></NFormItem>
        <NFormItem field="subscribe" label="订阅通知"><NSwitch v-model="linkageData.subscribe" /></NFormItem>
        <NFormItem v-if="linkageData.subscribe" field="frequency" label="推送频率"><NSelect v-model="linkageData.frequency" :options="frequencyOptions" placeholder="选择频率" /></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="校验触发时机" description="validate-trigger 控制全局触发时机，也可在规则中单独设置 trigger。" :code="triggerCode">
      <NForm ref="triggerFormRef" :model="triggerData" :rules="triggerRules" layout="vertical" validate-trigger="blur">
        <NFormItem field="name" label="用户名（失焦校验）" required><NInput v-model="triggerData.name" placeholder="输入后点击外面" /></NFormItem>
        <NFormItem field="code" label="验证码（输入即校验）" required><NInput v-model="triggerData.code" placeholder="输入即校验" /></NFormItem>
        <NFormItem>
          <NButton type="primary" @click="triggerFormRef?.validate()">手动校验</NButton>
          <NButton variant="secondary" style="margin-left:12px" @click="triggerFormRef?.clearValidate()">清除校验</NButton>
        </NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="帮助提示与额外内容" description="help 和 extra 属性显示提示或说明。" :code="helpCode">
      <NForm :model="helpData" colon label-width="80">
        <NFormItem field="username" label="用户名" help="4-20 个字符"><NInput v-model="helpData.username" placeholder="用户名" /></NFormItem>
        <NFormItem field="password" label="密码" extra="需包含大小写字母和数字"><NInput v-model="helpData.password" placeholder="密码" type="password" /></NFormItem>
      </NForm>
    </DemoBlock>

    <DemoBlock title="隐藏校验反馈" description="show-feedback 隐藏校验错误信息。" :code="noFeedbackCode">
      <NForm ref="noFeedbackRef" :model="noFeedbackData" :rules="noFeedbackRules" colon label-width="80" :show-feedback="false">
        <NFormItem field="name" label="姓名" required><NInput v-model="noFeedbackData.name" placeholder="请输入" /></NFormItem>
        <NFormItem field="email" label="邮箱" required><NInput v-model="noFeedbackData.email" placeholder="请输入" /></NFormItem>
        <NFormItem>
          <NButton type="primary" @click="noFeedbackRef?.validate()">校验</NButton>
          <NButton variant="secondary" style="margin-left:12px" @click="noFeedbackRef?.resetFields()">重置</NButton>
        </NFormItem>
      </NForm>
    </DemoBlock>

    <ApiTable title="Form Props" :columns="propColumns" :data="formProps" />
    <ApiTable title="FormItem Props" :columns="propColumns" :data="formItemProps" />
    <ApiTable title="FormRule 类型" :columns="ruleColumns" :data="ruleData" />
    <ApiTable title="Form Events" :columns="eventColumns" :data="formEvents" />
    <ApiTable title="Form Methods" :columns="methodColumns" :data="formMethods" />
    <ApiTable title="FormItem Slots" :columns="slotColumns" :data="formItemSlots" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })
import type { FormRule } from '../../../../src/runtime/components/Form.vue'

const cityOptions = [
  { label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' }, { label: '深圳', value: 'shenzhen' }, { label: '杭州', value: 'hangzhou' },
]
const statusOptions = [{ label: '已上线', value: 'online' }, { label: '已下线', value: 'offline' }]
const contactTypeOptions = [{ label: '邮箱', value: 'email' }, { label: '手机', value: 'phone' }, { label: '地址', value: 'address' }]
const frequencyOptions = [{ label: '每天', value: 'daily' }, { label: '每周', value: 'weekly' }, { label: '每月', value: 'monthly' }]

/* 综合示例 */
const fullFormRef = ref()
const fullData = reactive({ name: '', email: '', city: undefined as any, gender: 'male', notify: true, remark: '' })
const fullRules: Record<string, FormRule | FormRule[]> = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  city: [{ required: true, message: '请选择城市' }],
}
const fullResult = ref('')
async function handleFullSubmit() { try { if (!(await fullFormRef.value?.validate())) fullResult.value = '提交成功！数据：' + JSON.stringify({ ...fullData }) } catch {} }
function handleFullReset() { fullFormRef.value?.resetFields(); fullResult.value = '' }

const fullCode = `<template>
  <NForm ref="formRef" :model="formData" :rules="rules" colon label-width="80">
    <NFormItem field="name" label="姓名" required>
      <NInput v-model="formData.name" placeholder="请输入姓名" />
    </NFormItem>
    <NFormItem field="email" label="邮箱" required>
      <NInput v-model="formData.email" placeholder="请输入邮箱" />
    </NFormItem>
    <NFormItem field="city" label="城市" required>
      <NSelect v-model="formData.city" :options="cityOptions" placeholder="请选择" />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="handleSubmit">提交</NButton>
      <NButton variant="secondary" style="margin-left:12px" @click="formRef?.resetFields()">重置</NButton>
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const formRef = ref()
const formData = reactive({ name: '', email: '', city: undefined })
const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  city: [{ required: true, message: '请选择城市' }],
}
async function handleSubmit() { if (!(await formRef.value?.validate())) alert('提交成功') }
<\\/script>`

/* 垂直布局 */
const verticalData = reactive({ name: '', email: '', bio: '' })
const verticalRules: Record<string, FormRule | FormRule[]> = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }],
}
const verticalCode = `<template>
  <NForm :model="formData" :rules="rules" layout="vertical">
    <NFormItem field="name" label="姓名" required><NInput v-model="formData.name" /></NFormItem>
    <NFormItem field="email" label="邮箱" required><NInput v-model="formData.email" /></NFormItem>
    <NFormItem field="bio" label="简介"><NTextarea v-model="formData.bio" :rows="3" /></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ name: '', email: '', bio: '' })
const rules = { name: [{ required: true, message: '请输入姓名' }] }
<\\/script>`

/* 行内表单 */
const inlineData = reactive({ name: '', status: undefined as any })
const inlineCode = `<template>
  <NForm :model="formData" layout="inline">
    <NFormItem field="name" label="姓名"><NInput v-model="formData.name" placeholder="姓名" /></NFormItem>
    <NFormItem field="status" label="状态"><NSelect v-model="formData.status" :options="statusOptions" style="min-width:120px" /></NFormItem>
    <NFormItem><NButton type="primary">查询</NButton></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ name: '', status: undefined })
const statusOptions = [{ label: '已上线', value: 'online' }, { label: '已下线', value: 'offline' }]
<\\/script>`

/* 表单尺寸 */
const sizeData = reactive({ name: '', city: undefined as any })
const sizeCode = `<template>
  <NForm :model="formData" size="sm" layout="inline">
    <NFormItem field="name" label="姓名"><NInput v-model="formData.name" placeholder="姓名" /></NFormItem>
    <NFormItem field="city" label="城市"><NSelect v-model="formData.city" :options="options" style="min-width:120px" /></NFormItem>
    <NFormItem><NButton type="primary">提交</NButton></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ name: '', city: undefined })
const options = [{ label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' }]
<\\/script>`

/* 禁用表单 */
const disabledData = reactive({ name: '张三', city: 'beijing' as any, notify: true })
const disabledCode = `<template>
  <NForm :model="formData" disabled colon label-width="80">
    <NFormItem field="name" label="姓名"><NInput v-model="formData.name" /></NFormItem>
    <NFormItem field="city" label="城市"><NSelect v-model="formData.city" :options="options" /></NFormItem>
    <NFormItem field="notify" label="通知"><NSwitch v-model="formData.notify" /></NFormItem>
    <NFormItem><NButton type="primary">提交</NButton></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ name: '张三', city: 'beijing', notify: true })
const options = [{ label: '北京', value: 'beijing' }, { label: '上海', value: 'shanghai' }]
<\\/script>`

/* 标签对齐与宽度 */
const labelData = reactive({ name: '', email: '', phone: '' })
const labelCode = `<template>
  <NForm :model="formData" label-width="100" colon>
    <NFormItem field="name" label="用户名"><NInput v-model="formData.name" /></NFormItem>
    <NFormItem field="email" label="电子邮件"><NInput v-model="formData.email" /></NFormItem>
    <NFormItem field="phone" label="手机号码"><NInput v-model="formData.phone" /></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ name: '', email: '', phone: '' })
<\\/script>`

/* 自定义校验 */
const customFormRef = ref()
const customData = reactive({ password: '', confirmPassword: '', phone: '' })
const customRules: Record<string, FormRule | FormRule[]> = {
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    { validator: (v: any, cb: (e?: string) => void) => { v !== customData.password ? cb('两次密码不一致') : cb() } },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
}
async function handleCustomSubmit() { try { if (!(await customFormRef.value?.validate())) alert('验证通过！') } catch {} }

const customCode = `<template>
  <NForm ref="formRef" :model="formData" :rules="rules" layout="vertical">
    <NFormItem field="password" label="密码" required>
      <NInput v-model="formData.password" type="password" placeholder="请输入密码" />
    </NFormItem>
    <NFormItem field="confirmPassword" label="确认密码" required>
      <NInput v-model="formData.confirmPassword" type="password" placeholder="再次输入密码" />
    </NFormItem>
    <NFormItem field="phone" label="手机号">
      <NInput v-model="formData.phone" placeholder="请输入手机号" />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="handleSubmit">验证</NButton>
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const formRef = ref()
const formData = reactive({ password: '', confirmPassword: '', phone: '' })
const rules = {
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    { validator: (v, cb) => { v !== formData.password ? cb('两次密码不一致') : cb() } },
  ],
  phone: [{ pattern: /^1[3-9]\\d{9}$/, message: '手机号格式不正确' }],
}
async function handleSubmit() { if (!(await formRef.value?.validate())) alert('验证通过！') }
<\\/script>`

/* 动态增减表单项 */
const dynamicFormRef = ref()
const dynamicData = reactive({ users: [{ name: '', email: '' }] })
async function handleDynamicSubmit() { try { if (!(await dynamicFormRef.value?.validate())) alert('提交成功！') } catch {} }

const dynamicCode = `<template>
  <NForm ref="formRef" :model="formData" label-position="top">
    <div v-for="(item, i) in formData.users" :key="i" style="display:flex;gap:12px;margin-bottom:12px">
      <NFormItem :field="'users.'+i+'.name'" label="姓名" required style="flex:1">
        <NInput v-model="item.name" placeholder="姓名" />
      </NFormItem>
      <NFormItem :field="'users.'+i+'.email'" label="邮箱" style="flex:1">
        <NInput v-model="item.email" placeholder="邮箱" />
      </NFormItem>
      <NButton variant="ghost" type="danger" style="margin-top:28px"
        @click="formData.users.splice(i,1)" :disabled="formData.users.length<=1">✕</NButton>
    </div>
    <NButton variant="ghost" @click="formData.users.push({name:'',email:''})" style="width:100%">+ 添加</NButton>
    <NFormItem><NButton type="primary" @click="handleSubmit">提交</NButton></NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const formRef = ref()
const formData = reactive({ users: [{ name: '', email: '' }] })
async function handleSubmit() { if (!(await formRef.value?.validate())) alert('提交成功') }
<\\/script>`

/* 表单联动 */
const linkageData = reactive({ contactType: undefined as any, email: '', phone: '', address: '', subscribe: false, frequency: undefined as any })

const linkageCode = `<template>
  <NForm :model="formData" colon label-width="80">
    <NFormItem field="contactType" label="联系方式">
      <NSelect v-model="formData.contactType" :options="typeOptions" placeholder="选择方式" />
    </NFormItem>
    <NFormItem v-if="formData.contactType==='email'" field="email" label="邮箱">
      <NInput v-model="formData.email" placeholder="邮箱地址" />
    </NFormItem>
    <NFormItem v-if="formData.contactType==='phone'" field="phone" label="手机号">
      <NInput v-model="formData.phone" placeholder="手机号码" />
    </NFormItem>
    <NFormItem v-if="formData.contactType==='address'" field="address" label="地址">
      <NTextarea v-model="formData.address" :rows="2" />
    </NFormItem>
    <NFormItem field="subscribe" label="订阅通知"><NSwitch v-model="formData.subscribe" /></NFormItem>
    <NFormItem v-if="formData.subscribe" field="frequency" label="推送频率">
      <NSelect v-model="formData.frequency" :options="freqOptions" placeholder="选择" />
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ contactType: undefined, email: '', phone: '', address: '', subscribe: false, frequency: undefined })
const typeOptions = [{ label: '邮箱', value: 'email' }, { label: '手机', value: 'phone' }, { label: '地址', value: 'address' }]
const freqOptions = [{ label: '每天', value: 'daily' }, { label: '每周', value: 'weekly' }]
<\\/script>`

/* 校验触发时机 */
const triggerFormRef = ref()
const triggerData = reactive({ name: '', code: '' })
const triggerRules: Record<string, FormRule | FormRule[]> = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'change' }],
}

const triggerCode = `<template>
  <NForm ref="formRef" :model="formData" :rules="rules" layout="vertical" validate-trigger="blur">
    <NFormItem field="name" label="用户名（失焦校验）" required>
      <NInput v-model="formData.name" placeholder="输入后点击外面" />
    </NFormItem>
    <NFormItem field="code" label="验证码（输入即校验）" required>
      <NInput v-model="formData.code" placeholder="输入即校验" />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="formRef?.validate()">手动校验</NButton>
      <NButton variant="secondary" style="margin-left:12px" @click="formRef?.clearValidate()">清除</NButton>
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const formRef = ref()
const formData = reactive({ name: '', code: '' })
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'change' }],
}
<\\/script>`

/* 帮助提示 */
const helpData = reactive({ username: '', password: '' })

const helpCode = `<template>
  <NForm :model="formData" colon label-width="80">
    <NFormItem field="username" label="用户名" help="4-20 个字符">
      <NInput v-model="formData.username" placeholder="用户名" />
    </NFormItem>
    <NFormItem field="password" label="密码" extra="需包含大小写字母和数字">
      <NInput v-model="formData.password" type="password" placeholder="密码" />
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
const formData = reactive({ username: '', password: '' })
<\\/script>`

/* 隐藏校验反馈 */
const noFeedbackRef = ref()
const noFeedbackData = reactive({ name: '', email: '' })
const noFeedbackRules: Record<string, FormRule | FormRule[]> = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
}

const noFeedbackCode = `<template>
  <NForm ref="formRef" :model="formData" :rules="rules" colon label-width="80" :show-feedback="false">
    <NFormItem field="name" label="姓名" required>
      <NInput v-model="formData.name" placeholder="请输入" />
    </NFormItem>
    <NFormItem field="email" label="邮箱" required>
      <NInput v-model="formData.email" placeholder="请输入" />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="formRef?.validate()">校验</NButton>
      <NButton variant="secondary" style="margin-left:12px" @click="formRef?.resetFields()">重置</NButton>
    </NFormItem>
  </NForm>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const formRef = ref()
const formData = reactive({ name: '', email: '' })
const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
}
<\\/script>`

/* API Tables */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const formProps = [
  { name: 'model', type: 'object', default: '-', desc: '表单数据对象（必填）' },
  { name: 'rules', type: 'Record<string, FormRule | FormRule[]>', default: '{}', desc: '校验规则' },
  { name: 'layout', type: "'horizontal' | 'vertical' | 'inline'", default: "'horizontal'", desc: '表单布局' },
  { name: 'labelPosition', type: "'left' | 'right' | 'top'", default: "'right'", desc: '标签位置' },
  { name: 'labelWidth', type: 'string | number', default: '-', desc: '统一设置标签宽度' },
  { name: 'labelAlign', type: "'left' | 'right'", default: '-', desc: '标签文本对齐方式' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", desc: '控件尺寸' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用全部控件' },
  { name: 'colon', type: 'boolean', default: 'false', desc: '标签后是否显示冒号' },
  { name: 'showFeedback', type: 'boolean', default: 'true', desc: '是否显示校验反馈信息' },
  { name: 'validateTrigger', type: "'change' | 'blur'", default: "'change'", desc: '全局校验触发时机' },
]

const formItemProps = [
  { name: 'field', type: 'string', default: '-', desc: '字段名（对应 model 属性路径），支持 a.b.c' },
  { name: 'label', type: 'string', default: '-', desc: '标签文本' },
  { name: 'labelWidth', type: 'string | number', default: '-', desc: '单独设置标签宽度，优先于 Form' },
  { name: 'labelAlign', type: "'left' | 'right'", default: '-', desc: '单独设置标签对齐，优先于 Form' },
  { name: 'rules', type: 'FormRule | FormRule[]', default: '-', desc: '校验规则，优先于 Form 的 rules' },
  { name: 'required', type: 'boolean', default: 'false', desc: '是否必填（视觉标记）' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'help', type: 'string', default: '-', desc: '帮助提示文本' },
  { name: 'extra', type: 'string', default: '-', desc: '额外内容文本' },
  { name: 'validateTrigger', type: "'change' | 'blur'", default: '-', desc: '校验触发时机' },
  { name: 'validateStatus', type: "'success' | 'warning' | 'error' | 'validating'", default: '-', desc: '校验状态' },
  { name: 'showFeedback', type: 'boolean', default: '-', desc: '是否显示校验反馈，优先于 Form' },
  { name: 'hideLabel', type: 'boolean', default: 'false', desc: '是否隐藏标签' },
  { name: 'hideAsterisk', type: 'boolean', default: 'false', desc: '是否隐藏必填星号' },
]

const ruleColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const ruleData = [
  { name: 'type', type: "'string' | 'number' | 'boolean' | 'url' | 'email' | 'array'", desc: '校验类型' },
  { name: 'required', type: 'boolean', desc: '是否必填' },
  { name: 'message', type: 'string', desc: '校验失败提示信息' },
  { name: 'min', type: 'number', desc: '最小长度/最小值' },
  { name: 'max', type: 'number', desc: '最大长度/最大值' },
  { name: 'len', type: 'number', desc: '精确长度' },
  { name: 'pattern', type: 'RegExp', desc: '正则校验' },
  { name: 'validator', type: '(value: any, callback: (error?: string) => void) => void', desc: '自定义校验函数' },
  { name: 'trigger', type: "'change' | 'blur' | ('change' | 'blur')[]", desc: '校验触发时机' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const formEvents = [
  { name: 'submit', type: '(e: Event)', desc: '表单提交' },
  { name: 'submit-success', type: '(values: object)', desc: '校验成功后触发' },
  { name: 'submit-fail', type: '(errors: Record<string, string[]>)', desc: '校验失败后触发' },
  { name: 'validate', type: '(field: string, value: any, errors: string[] | undefined)', desc: '任意字段校验结束后触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const formMethods = [
  { name: 'validate', type: '(callback?) => Promise<errors | undefined>', desc: '校验整个表单' },
  { name: 'validateField', type: '(field: string | string[], callback?) => Promise<errors>', desc: '校验指定字段' },
  { name: 'resetFields', type: '(field?: string | string[])', desc: '重置字段值并清除校验' },
  { name: 'clearValidate', type: '(field?: string | string[])', desc: '清除校验状态' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const formItemSlots = [
  { name: 'default', desc: '表单控件内容' },
  { name: 'label', desc: '自定义标签' },
  { name: 'error', desc: '自定义错误信息，参数 { errors }' },
  { name: 'help', desc: '自定义帮助提示' },
  { name: 'extra', desc: '自定义额外内容' },
]
</script>: '