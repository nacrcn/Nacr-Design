<template>
  <div class="doc-page">
    <h1>Upload 上传</h1>
    <p class="doc-page__desc">用于文件上传，支持按钮触发、拖拽上传、图片卡片等多种交互形式。</p>

    <DemoBlock title="基础用法" description="最简单的文件上传，点击按钮选择文件。" :code="basicCode">
      <NUpload @change="handleChange" @success="handleSuccess" @error="handleError" />
    </DemoBlock>

    <DemoBlock title="拖拽上传" description="设置 drag 属性，将上传区域变为拖拽区域。" :code="dragCode">
      <NUpload drag tip="支持 jpg、png 格式，单文件不超过 5MB" />
    </DemoBlock>

    <DemoBlock title="拖拽上传" description="设置 drag 属性，将上传区域变为拖拽区域，可搭配 tip 显示提示信息。" :code="dragCode">
      <NUpload drag tip="支持 jpg、png 格式，单文件不超过 5MB" />
    </DemoBlock>

    <DemoBlock title="配置上传 API" description="设置 action 指定服务端接口地址，组件会使用 XMLHttpRequest 发送文件。支持 headers 设置请求头、data 附带额外参数、method 设置请求方法、name 设置文件字段名、withCredentials 携带 cookie。" :code="apiCode">
      <NUpload
        action="https://api.example.com/upload"
        method="POST"
        name="file"
        :headers="{ Authorization: 'Bearer your-token-here' }"
        :data="{ userId: 123, type: 'avatar' }"
        :with-credentials="true"
        @success="handleSuccess"
        @error="handleError"
        @progress="handleProgress"
        tip="文件将上传至 api.example.com"
      />
    </DemoBlock>

    <DemoBlock title="自定义上传逻辑" description="通过 custom-request 完全接管上传流程，适合对接 OSS、S3、微信云存储等第三方服务。回调函数接收 file（UploadFile 对象）、action、method、headers、data、onProgress、onSuccess、onError 参数。" :code="customRequestCode">
      <NUpload :custom-request="customRequest" multiple tip="自定义上传到云存储" @success="handleSuccess" />
    </DemoBlock>

    <DemoBlock title="手动上传" description="设置 auto-upload 为 false，用户选择文件后不会自动上传，需要通过 ref 调用 startUpload 方法手动触发。适合表单场景：先选择文件，填完表单后统一提交。" :code="manualCode">
      <NUpload ref="manualUploadRef" :auto-upload="false" multiple @change="handleChange" tip="选择文件后点击下方按钮上传" />
      <div style="margin-top:12px;display:flex;gap:8px;">
        <NButton type="primary" @click="ManualStartUpload">开始上传</NButton>
        <NButton @click="ManualClearFiles">清空列表</NButton>
      </div>
    </DemoBlock>

    <DemoBlock title="上传前校验" description="通过 before-upload 钩子在上传前进行校验，返回 false 或 Promise reject 取消上传。支持异步校验（如检查文件内容、请求接口验证等）。" :code="beforeUploadCode">
      <NUpload :before-upload="beforeUpload" accept="image/*" tip="仅支持上传小于 2MB 的图片文件" />
    </DemoBlock>

    <DemoBlock title="多选与数量限制" description="设置 multiple 允许多选，limit 限制上传数量，超出触发 exceed 事件。" :code="multipleCode">
      <NUpload multiple :limit="3" @exceed="handleExceed" tip="最多上传 3 个文件" />
    </DemoBlock>

    <DemoBlock title="图片列表模式" description="设置 list-type 为 picture，显示图片缩略图列表，点击缩略图可预览。" :code="pictureCode">
      <NUpload list-type="picture" multiple accept="image/*" tip="仅支持图片文件" />
    </DemoBlock>

    <DemoBlock title="照片墙模式" description="设置 list-type 为 picture-card，以卡片形式展示图片，支持预览和删除。" :code="pictureCardCode">
      <NUpload list-type="picture-card" multiple accept="image/*" :limit="6" tip="最多上传 6 张图片" @preview="handlePreview" />
    </DemoBlock>

    <DemoBlock title="文件大小与类型限制" description="设置 max-size 限制文件大小（单位字节），超出触发 error 事件。accept 限制可选择的文件类型。" :code="maxSizeCode">
      <NUpload :max-size="2 * 1024 * 1024" accept=".pdf,.doc,.docx" tip="仅支持 PDF/Word，单文件不超过 2MB" @error="handleError" />
    </DemoBlock>

    <DemoBlock title="禁用状态" description="设置 disabled 禁用上传。" :code="disabledCode">
      <NUpload disabled />
    </DemoBlock>

    <DemoBlock title="自定义触发" description="使用默认插槽自定义上传触发区域。" :code="slotCode">
      <NUpload>
        <NButton type="primary">自定义上传按钮</NButton>
      </NUpload>
    </DemoBlock>

    <DemoBlock title="拖拽区自定义内容" description="使用 drag 插槽自定义拖拽区的展示内容。" :code="dragSlotCode">
      <NUpload drag>
        <template #drag>
          <NIcon name="folder" :size="40" color="var(--n-color-primary)" />
          <p style="font-size:16px;color:var(--n-color-text);margin:8px 0 0;">将文件拖到此处</p>
          <p style="font-size:12px;color:var(--n-color-text-disabled);">支持批量上传，严禁上传敏感数据</p>
        </template>
      </NUpload>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
    <ApiTable title="UploadFile" :columns="typeColumns" :data="typeData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

import { ref } from 'vue'

const propColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: '(string | number)[]', default: '[]', desc: '已上传文件的 uid 列表（v-model）' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '是否允许多选文件' },
  { name: 'accept', type: 'string', default: '—', desc: '接受的文件类型（MIME），picture/picture-card 模式默认 image/*' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用上传' },
  { name: 'drag', type: 'boolean', default: 'false', desc: '是否启用拖拽上传区域' },
  { name: 'limit', type: 'number', default: '—', desc: '最大上传数量限制' },
  { name: 'autoUpload', type: 'boolean', default: 'true', desc: '是否在选取文件后自动上传' },
  { name: 'action', type: 'string', default: '—', desc: '上传地址，设置后使用 XMLHttpRequest 发送请求' },
  { name: 'method', type: 'string', default: '"POST"', desc: '上传请求的 HTTP 方法' },
  { name: 'headers', type: 'Record<string, string>', default: '{}', desc: '上传请求的自定义请求头' },
  { name: 'data', type: 'Record<string, any>', default: '{}', desc: '上传请求附带的额外参数' },
  { name: 'name', type: 'string', default: '"file"', desc: '上传文件的字段名' },
  { name: 'withCredentials', type: 'boolean', default: 'false', desc: '请求是否携带 cookie' },
  { name: 'listType', type: "'text' | 'picture' | 'picture-card'", default: "'text'", desc: '文件列表展示类型' },
  { name: 'maxSize', type: 'number', default: '—', desc: '文件大小上限（字节），超出触发 error 事件' },
  { name: 'tip', type: 'string', default: '—', desc: '提示文本' },
  { name: 'buttonText', type: 'string', default: '"上传文件"', desc: '按钮文字' },
  { name: 'dragText', type: 'string', default: '"点击或拖拽文件到此区域上传"', desc: '拖拽区域文字' },
  { name: 'beforeUpload', type: '(file: File, fileList: UploadFile[]) => boolean | Promise<boolean>', default: '—', desc: '上传前钩子，返回 false 取消上传' },
  { name: 'customRequest', type: '(options: { file: UploadFile; action: string; method: string; headers: Record<string, string>; data: Record<string, any>; onProgress: (percent: number) => void; onSuccess: (response: any) => void; onError: (error: Error) => void }) => void', default: '—', desc: '自定义上传实现，接管整个上传流程，适合对接 OSS/S3/COS 等云存储' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'change', type: '(fileList: UploadFile[])', desc: '文件列表变化时触发' },
  { name: 'success', type: '(file: UploadFile, response: any)', desc: '文件上传成功时触发' },
  { name: 'error', type: '(file: UploadFile, error: Error)', desc: '文件上传失败时触发' },
  { name: 'progress', type: '(file: UploadFile, percent: number)', desc: '文件上传进度变化时触发' },
  { name: 'exceed', type: '(files: File[])', desc: '文件超出数量限制时触发' },
  { name: 'preview', type: '(file: UploadFile)', desc: '点击文件预览时触发' },
  { name: 'remove', type: '(file: UploadFile)', desc: '文件被删除时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '自定义上传触发区域（仅非拖拽、非 picture-card 模式）' },
  { name: 'drag', desc: '自定义拖拽区域内容' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'clearFiles', type: '() => void', desc: '清空文件列表' },
  { name: 'startUpload', type: '() => void', desc: '手动开始上传所有待上传文件' },
]

const typeColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const typeData = [
  { name: 'uid', type: 'string', desc: '文件唯一标识' },
  { name: 'name', type: 'string', desc: '文件名' },
  { name: 'size', type: 'number', desc: '文件大小（字节）' },
  { name: 'status', type: "'pending' | 'uploading' | 'done' | 'error'", desc: '文件状态' },
  { name: 'progress', type: 'number', desc: '上传进度（0-100）' },
  { name: 'raw', type: 'File', desc: '原始文件对象' },
  { name: 'url', type: 'string', desc: '文件 URL' },
  { name: 'thumbUrl', type: 'string', desc: '缩略图 URL' },
  { name: 'response', type: 'any', desc: '上传成功后服务端返回的响应数据' },
]

function handleChange(fileList: any) {
  console.log('文件列表变化', fileList)
}

function handleSuccess(file: any, response: any) {
  console.log('上传成功', file.name, response)
}

function handleError(file: any, error: Error) {
  console.log('上传失败', file?.name, error.message)
}

function handleExceed(files: File[]) {
  console.log('超出限制', files.length)
}

function handlePreview(file: any) {
  console.log('预览文件', file.name)
}

function handleProgress(file: any, percent: number) {
  console.log('上传进度', file.name, percent + '%')
}

/**
 * 上传前校验：限制图片类型 + 大小
 */
function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    alert('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    alert('图片大小不能超过 2MB！')
    return false
  }
  return true
}

/**
 * 自定义上传：演示对接云存储（OSS/S3 等）的完整流程
 * 这里用 setTimeout 模拟网络请求
 */
function customRequest({ file, onProgress, onSuccess }: any) {
  // 实际项目中通常是：
  // 1. 先请求后端签名/预签名 URL
  // 2. 用 fetch/xhr 上传到云存储
  // 3. 上传成功后通知后端

  const raw = file.raw as File
  console.log('自定义上传开始:', raw.name, raw.size, 'bytes')

  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      p = 100
      clearInterval(timer)
      // 模拟成功，返回服务端响应
      onSuccess({
        id: `file-${Date.now()}`,
        url: `https://cdn.example.com/${raw.name}`,
        name: raw.name,
      })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}

// 手动上传相关
const manualUploadRef = ref<any>(null)

function ManualStartUpload() {
  manualUploadRef.value?.startUpload()
}

function ManualClearFiles() {
  manualUploadRef.value?.clearFiles()
}

const basicCode = `<template>
  <NUpload
    @change="handleChange"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup lang="ts">
function handleChange(fileList) {
  console.log('文件列表变化', fileList)
}

function handleSuccess(file, response) {
  console.log('上传成功', file.name, response)
}

function handleError(file, error) {
  console.log('上传失败', file?.name, error.message)
}
<\/script>`

const dragCode = `<template>
  <NUpload
    drag
    tip="支持 jpg、png 格式，单文件不超过 5MB"
  />
</template>`

const apiCode = `<template>
  <NUpload
    action="https://api.example.com/upload"
    method="POST"
    name="file"
    :headers="{
      Authorization: 'Bearer your-token-here',
      'X-Custom-Header': 'custom-value',
    }"
    :data="{
      userId: 123,
      type: 'avatar',
    }"
    :with-credentials="true"
    @success="handleSuccess"
    @error="handleError"
    @progress="handleProgress"
    tip="文件将上传至 api.example.com"
  />
</template>

<script setup lang="ts">
/**
 * action   — 服务端上传接口地址
 * method   — HTTP 请求方法，默认 POST
 * name     — 上传文件的字段名，默认 "file"
 * headers  — 自定义请求头，常用于携带 Token 认证
 * data     — 上传时附带的额外参数
 * withCredentials — 是否携带 cookie
 */
function handleSuccess(file, response) {
  // response 为服务端返回数据
  console.log('上传成功', file.name, response)
  // 例如 response = { code: 0, data: { url: 'https://cdn.example.com/xxx.jpg' } }
  // 可在此处将 response.data.url 存入业务数据
}

function handleError(file, error) {
  console.log('上传失败', file?.name, error.message)
}

function handleProgress(file, percent) {
  console.log('上传进度', file.name, percent + '%')
}
<\/script>`

const customRequestCode = `<template>
  <NUpload
    :custom-request="customRequest"
    multiple
    tip="自定义上传到云存储"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
/**
 * customRequest 完全接管上传流程，
 * 适合对接 OSS、S3、COS、微信云存储等第三方服务。
 *
 * 回调参数说明：
 *   file       — UploadFile 对象（含 raw: File, uid, name 等）
 *   action     — props.action 的值
 *   method     — HTTP 方法
 *   headers    — 请求头
 *   data       — 额外参数
 *   onProgress — 调用此函数更新进度 (percent: number)
 *   onSuccess  — 上传成功时调用 (response: any)
 *   onError    — 上传失败时调用 (error: Error)
 */
function customRequest({ file, onProgress, onSuccess, onError }) {
  const raw = file.raw

  // === 示例 1：上传到自有后端 ===
  // const formData = new FormData()
  // formData.append('file', raw)
  // fetch('/api/upload', { method: 'POST', body: formData })
  //   .then(res => res.json())
  //   .then(data => onSuccess(data))
  //   .catch(err => onError(err))

  // === 示例 2：上传到 OSS（先获取签名） ===
  // async function uploadToOSS() {
  //   // 1. 获取后端签名
  //   const sign = await fetch('/api/oss-signature').then(r => r.json())
  //   // 2. 直传 OSS
  //   const formData = new FormData()
  //   formData.append('key', sign.key)
  //   formData.append('policy', sign.policy)
  //   formData.append('signature', sign.signature)
  //   formData.append('file', raw)
  //   const res = await fetch(sign.host, { method: 'POST', body: formData })
  //   onSuccess({ url: \`\${sign.host}/\${sign.key}\` })
  // }
  // uploadToOSS().catch(err => onError(err))

  // === 示例 3：使用 XMLHttpRequest 带进度 ===
  // const xhr = new XMLHttpRequest()
  // const formData = new FormData()
  // formData.append('file', raw)
  // xhr.upload.addEventListener('progress', (e) => {
  //   if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
  // })
  // xhr.addEventListener('load', () => {
  //   if (xhr.status < 300) onSuccess(JSON.parse(xhr.responseText))
  //   else onError(new Error('Upload failed'))
  // })
  // xhr.addEventListener('error', () => onError(new Error('Network error')))
  // xhr.open('POST', '/api/upload')
  // xhr.send(formData)

  // === 下方为模拟上传（演示用） ===
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      p = 100
      clearInterval(timer)
      onSuccess({
        id: \`file-\${Date.now()}\`,
        url: \`https://cdn.example.com/\${raw.name}\`,
        name: raw.name,
      })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}

function handleSuccess(file, response) {
  console.log('上传成功', file.name, '→', response.url)
}
<\/script>`

const manualCode = `<template>
  <NUpload
    ref="uploadRef"
    :auto-upload="false"
    multiple
    @change="handleChange"
    tip="选择文件后点击下方按钮上传"
  />
  <div style="margin-top: 12px; display: flex; gap: 8px;">
    <NButton type="primary" @click="startUpload">开始上传</NButton>
    <NButton @click="clearFiles">清空列表</NButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const uploadRef = ref()

// 手动触发所有待上传文件开始上传
function startUpload() {
  uploadRef.value?.startUpload()
}

// 清空文件列表
function clearFiles() {
  uploadRef.value?.clearFiles()
}

function handleChange(fileList) {
  console.log('文件列表变化', fileList)
}
<\/script>`

const beforeUploadCode = `<template>
  <NUpload
    :before-upload="beforeUpload"
    accept="image/*"
    tip="仅支持上传小于 2MB 的图片文件"
  />
</template>

<script setup lang="ts">
/**
 * before-upload 钩子
 * - 返回 true 或不返回 → 继续上传
 * - 返回 false → 取消上传
 * - 返回 Promise → resolve(true) 继续，resolve(false) / reject 取消
 *
 * 参数：
 *   file     — 原始 File 对象
 *   fileList — 当前 UploadFile 列表
 */
function beforeUpload(file, fileList) {
  // 1. 类型校验
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    alert('只能上传图片文件！')
    return false
  }

  // 2. 大小校验
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    alert('图片大小不能超过 2MB！')
    return false
  }

  // 3. 异步校验示例（如检查文件名是否重复）
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const exists = fileList.some(f => f.name === file.name)
  //     if (exists) {
  //       alert('文件名已存在！')
  //       resolve(false)
  //     } else {
  //       resolve(true)
  //     }
  //   }, 100)
  // })

  return true
}
<\/script>`

const multipleCode = `<template>
  <NUpload
    multiple
    :limit="3"
    @exceed="handleExceed"
    tip="最多上传 3 个文件"
  />
</template>

<script setup lang="ts">
function handleExceed(files) {
  console.log('超出上传数量限制', files.length)
}
<\/script>`

const pictureCode = `<template>
  <NUpload
    list-type="picture"
    multiple
    accept="image/*"
    tip="仅支持图片文件"
  />
</template>`

const pictureCardCode = `<template>
  <NUpload
    list-type="picture-card"
    multiple
    accept="image/*"
    :limit="6"
    tip="最多上传 6 张图片"
    @preview="handlePreview"
  />
</template>

<script setup lang="ts">
function handlePreview(file) {
  console.log('预览文件', file.name)
  // 可在此处打开图片预览弹窗
}
<\/script>`

const maxSizeCode = `<template>
  <NUpload
    :max-size="2 * 1024 * 1024"
    accept=".pdf,.doc,.docx"
    tip="仅支持 PDF/Word，单文件不超过 2MB"
    @error="handleError"
  />
</template>

<script setup lang="ts">
function handleError(file, error) {
  // 超出大小限制时也会触发 error 事件
  console.log('上传失败', file?.name, error.message)
}
<\/script>`

const disabledCode = `<template>
  <NUpload disabled />
</template>`

const slotCode = `<template>
  <NUpload>
    <NButton type="primary">自定义上传按钮</NButton>
  </NUpload>
</template>`

const dragSlotCode = `<template>
  <NUpload drag>
    <template #drag>
      <NIcon name="folder" :size="40" color="var(--n-color-primary)" />
      <p style="font-size:16px;color:var(--n-color-text);margin:8px 0 0;">
        将文件拖到此处
      </p>
      <p style="font-size:12px;color:var(--n-color-text-disabled);">
        支持批量上传，严禁上传敏感数据
      </p>
    </template>
  </NUpload>
</template>`
</script>
