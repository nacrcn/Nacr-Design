<template>
  <div class="doc-page">
    <h1>Upload 上传</h1>
    <p class="doc-page__desc">用于文件上传，支持按钮触发、拖拽上传、图片卡片等多种交互形式。另有 ImageUpload 专门用于单图片上传场景。</p>

    <!-- ========== 综合示例 ========== -->
    <DemoBlock title="综合示例" description="完整演示：配置上传接口、文件列表、成功/失败回调、删除确认弹窗等。" :code="fullCode">
      <NUpload
        v-model="fullUids"
        action="https://api.example.com/upload"
        :headers="{ Authorization: 'Bearer demo-token' }"
        multiple
        show-size-changer
        show-total
        show-quick-jumper
        @success="onFullSuccess"
        @error="onFullError"
        @remove="onFullRemove"
      />
      <div class="full-status" v-if="fullMsg" style="margin-top:8px;font-size:13px;color:var(--n-color-primary)">{{ fullMsg }}</div>
      <NModal v-model="fullShowModal" title="删除确认" preset="danger" @confirm="onFullConfirmDelete" @cancel="onFullCancelDelete">
        <p>确定要删除「<b>{{ fullDeleteFile?.name }}</b>」吗？</p>
      </NModal>
    </DemoBlock>

    <!-- ========== 基础用法 ========== -->
    <DemoBlock title="基础用法" description="最简单的文件上传，点击按钮选择文件即可。不设置 action 时使用模拟上传。" :code="basicCode">
      <NUpload @change="handleChange" @success="handleSuccess" @error="handleError" />
    </DemoBlock>

    <!-- ========== 配置上传接口 ========== -->
    <DemoBlock title="配置上传接口" description="设置 action 指定服务端地址，组件使用 XMLHttpRequest 发送文件。支持 headers（请求头）、data（额外参数）、name（字段名）、withCredentials（携带 cookie）等配置。" :code="apiCode">
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

    <!-- ========== 自定义上传逻辑 ========== -->
    <DemoBlock title="自定义上传逻辑" description="通过 custom-request 接管上传流程，适合对接 OSS、S3、COS 等云存储。回调参数含 file、onProgress、onSuccess、onError。" :code="customRequestCode">
      <NUpload :custom-request="customRequestFn" multiple tip="自定义上传到云存储" @success="handleSuccess" />
    </DemoBlock>

    <!-- ========== 拖拽上传 ========== -->
    <DemoBlock title="拖拽上传" description="设置 drag 启用拖拽区域，搭配 tip 显示提示信息。" :code="dragCode">
      <NUpload drag tip="支持 jpg、png 格式，单文件不超过 5MB" />
    </DemoBlock>

    <!-- ========== 拖拽区自定义内容 ========== -->
    <DemoBlock title="拖拽区自定义内容" description="使用 #drag 插槽自定义拖拽区展示内容。" :code="dragSlotCode">
      <NUpload drag>
        <template #drag>
          <NIcon name="folder" :size="40" color="var(--n-color-primary)" />
          <p style="font-size:16px;color:var(--n-color-text);margin:8px 0 0;">将文件拖到此处</p>
          <p style="font-size:12px;color:var(--n-color-text-disabled);">支持批量上传</p>
        </template>
      </NUpload>
    </DemoBlock>

    <!-- ========== 手动上传 ========== -->
    <DemoBlock title="手动上传" description="设置 auto-upload=false，选择文件后不自动上传，需通过 ref 调用 startUpload 手动触发。适合表单场景：先选文件，填完表单再统一提交。" :code="manualCode">
      <NUpload ref="manualUploadRef" :auto-upload="false" multiple @change="handleChange" tip="选择文件后点击下方按钮上传" />
      <div style="margin-top:12px;display:flex;gap:8px;">
        <NButton variant="primary" @click="ManualStartUpload">开始上传</NButton>
        <NButton variant="secondary" @click="ManualClearFiles">清空列表</NButton>
      </div>
    </DemoBlock>

    <!-- ========== 上传前校验 ========== -->
    <DemoBlock title="上传前校验" description="通过 before-upload 钩子在上传前校验，返回 false 取消上传。支持异步校验。" :code="beforeUploadCode">
      <NUpload :before-upload="beforeUpload" accept="image/*" tip="仅支持上传小于 2MB 的图片文件" />
    </DemoBlock>

    <!-- ========== 多选与数量限制 ========== -->
    <DemoBlock title="多选与数量限制" description="设置 multiple 允许多选，limit 限制数量，超出触发 exceed 事件。" :code="multipleCode">
      <NUpload multiple :limit="3" @exceed="handleExceed" tip="最多上传 3 个文件" />
    </DemoBlock>

    <!-- ========== 图片列表模式 ========== -->
    <DemoBlock title="图片列表模式" description="设置 list-type=picture，显示图片缩略图列表，点击可预览大图。" :code="pictureCode">
      <NUpload list-type="picture" multiple accept="image/*" tip="仅支持图片文件" />
    </DemoBlock>

    <!-- ========== 照片墙模式 ========== -->
    <DemoBlock title="照片墙模式" description="设置 list-type=picture-card，以卡片网格展示图片，hover 可预览/删除。" :code="pictureCardCode">
      <NUpload list-type="picture-card" multiple accept="image/*" :limit="6" tip="最多上传 6 张图片" />
    </DemoBlock>

    <!-- ========== 文件大小与类型限制 ========== -->
    <DemoBlock title="文件大小与类型限制" description="max-size 限制大小（字节），accept 限制类型，超出触发 error 事件。" :code="maxSizeCode">
      <NUpload :max-size="2 * 1024 * 1024" accept=".pdf,.doc,.docx" tip="仅支持 PDF/Word，单文件不超过 2MB" @error="handleError" />
    </DemoBlock>

    <!-- ========== 禁用与自定义触发 ========== -->
    <DemoBlock title="禁用状态" description="设置 disabled 禁用上传。" :code="disabledCode">
      <NUpload disabled />
    </DemoBlock>

    <DemoBlock title="自定义触发按钮" description="使用默认插槽自定义触发区域。" :code="slotCode">
      <NUpload>
        <NButton variant="primary">自定义上传按钮</NButton>
      </NUpload>
    </DemoBlock>

    <!-- ========== ImageUpload ========== -->
    <h2 style="margin-top:48px;">ImageUpload 单图片上传</h2>
    <p class="doc-page__desc">专门用于单图片上传场景，v-model 绑定图片 URL，内置预览/删除功能，支持自定义上传逻辑。</p>

    <DemoBlock title="基础用法" description="通过 v-model 绑定图片 URL，选择图片后自动展示预览，可点击预览大图、删除重新上传。" :code="imgBasicCode">
      <NImageUpload v-model="imgUrl1" />
      <div style="margin-top:8px;font-size:13px;color:var(--n-color-text-secondary);">图片 URL：{{ imgUrl1 || '未上传' }}</div>
    </DemoBlock>

    <DemoBlock title="配置上传接口" description="设置 action 后，选择图片会通过 XMLHttpRequest 上传到服务端，v-model 绑定服务端返回的图片 URL。" :code="imgApiCode">
      <NImageUpload
        v-model="imgUrl2"
        action="https://api.example.com/upload"
        :headers="{ Authorization: 'Bearer your-token' }"
        @success="onImgSuccess"
        @error="onImgError"
      />
    </DemoBlock>

    <DemoBlock title="自定义尺寸" description="通过 width 和 height 设置预览框尺寸，tip 设置提示文字。" :code="imgSizeCode">
      <div style="display:flex;gap:16px;align-items:flex-end;">
        <NImageUpload v-model="imgUrl3" :width="80" :height="80" tip="头像" />
        <NImageUpload v-model="imgUrl4" :width="160" :height="120" tip="封面图" />
      </div>
    </DemoBlock>

    <DemoBlock title="上传前校验" description="通过 before-upload 校验文件类型和大小，max-size 限制大小。" :code="imgBeforeCode">
      <NImageUpload
        v-model="imgUrl5"
        :max-size="2 * 1024 * 1024"
        :before-upload="imgBeforeUpload"
        tip="不超过 2MB"
        @error="onImgError"
      />
    </DemoBlock>

    <DemoBlock title="自定义上传" description="通过 custom-request 接管上传，适合对接云存储。" :code="imgCustomCode">
      <NImageUpload
        v-model="imgUrl6"
        :custom-request="imgCustomRequest"
        @success="onImgSuccess"
      />
    </DemoBlock>

    <DemoBlock title="禁用状态" description="设置 disabled 禁用上传和删除。" :code="imgDisabledCode">
      <NImageUpload v-model="imgUrl7" disabled />
    </DemoBlock>

    <!-- ========== Upload API ========== -->
    <ApiTable title="Upload Props" :columns="propColumns" :data="uploadPropData" />
    <ApiTable title="Upload Events" :columns="eventColumns" :data="uploadEventData" />
    <ApiTable title="Upload Slots" :columns="slotColumns" :data="uploadSlotData" />
    <ApiTable title="Upload Methods" :columns="methodColumns" :data="uploadMethodData" />
    <ApiTable title="UploadFile 数据结构" :columns="typeColumns" :data="uploadFileTypeData" />

    <!-- ========== ImageUpload API ========== -->
    <ApiTable title="ImageUpload Props" :columns="propColumns" :data="imgPropData" />
    <ApiTable title="ImageUpload Events" :columns="eventColumns" :data="imgEventData" />
    <ApiTable title="ImageUpload Slots" :columns="slotColumns" :data="imgSlotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

import { ref } from 'vue'

// ========== 综合示例 ==========
const fullUids = ref<(string | number)[]>([])
const fullMsg = ref('')
const fullShowModal = ref(false)
const fullDeleteFile = ref<any>(null)
function onFullSuccess(file: any, response: any) {
  fullMsg.value = `上传成功：${file.name}`
  setTimeout(() => { fullMsg.value = '' }, 2000)
}
function onFullError(file: any, error: Error) {
  fullMsg.value = `上传失败：${file?.name}`
}
function onFullRemove(file: any) {
  fullDeleteFile.value = file
  fullShowModal.value = true
}
function onFullConfirmDelete() {
  fullMsg.value = `已删除：${fullDeleteFile.value?.name}`
  setTimeout(() => { fullMsg.value = '' }, 2000)
  fullDeleteFile.value = null
}
function onFullCancelDelete() {
  fullDeleteFile.value = null
}

const fullCode = `<template>
  <NUpload
    action="https://api.example.com/upload"
    :headers="{ Authorization: 'Bearer demo-token' }"
    multiple
    @success="onSuccess"
    @error="onError"
    @remove="onRemove"
  />
  <NModal v-model="showModal" title="删除确认" preset="danger"
    @confirm="onConfirmDelete" @cancel="onCancelDelete">
    <p>确定要删除「<b>{{ deleteFile?.name }}</b>」吗？</p>
  </NModal>
</template>

<script setup lang="ts">
const showModal = ref(false)
const deleteFile = ref<any>(null)

function onSuccess(file, response) {
  console.log('上传成功', file.name, response)
}
function onError(file, error) {
  console.log('上传失败', file?.name, error.message)
}
function onRemove(file) {
  deleteFile.value = file
  showModal.value = true
}
function onConfirmDelete() {
  console.log('已删除', deleteFile.value?.name)
  deleteFile.value = null
}
function onCancelDelete() {
  deleteFile.value = null
}
<\/script>`

// ========== 基础用法 ==========
function handleChange(fileList: any) { console.log('文件列表变化', fileList) }
function handleSuccess(file: any, response: any) { console.log('上传成功', file.name, response) }
function handleError(file: any, error: Error) { console.log('上传失败', file?.name, error.message) }
function handleExceed(files: File[]) { console.log('超出限制', files.length) }
function handleProgress(file: any, percent: number) { console.log('上传进度', file.name, percent + '%') }

const basicCode = `<template>
  <NUpload @change="onChange" @success="onSuccess" @error="onError" />
</template>

<script setup lang="ts">
// 不设置 action 时，组件会模拟上传进度（仅供演示）
// 实际使用时请设置 action 或 customRequest

function onChange(fileList) {
  console.log('文件列表变化', fileList)
}
function onSuccess(file, response) {
  console.log('上传成功', file.name, response)
}
function onError(file, error) {
  console.log('上传失败', file?.name, error.message)
}
<\/script>`

const apiCode = `<template>
  <NUpload
    action="https://api.example.com/upload"
    method="POST"
    name="file"
    :headers="{ Authorization: 'Bearer your-token-here' }"
    :data="{ userId: 123, type: 'avatar' }"
    :with-credentials="true"
    @success="onSuccess"
    @error="onError"
    @progress="onProgress"
    tip="文件将上传至 api.example.com"
  />
</template>

<script setup lang="ts">
// action   — 服务端上传接口地址
// method   — HTTP 请求方法，默认 POST
// name     — 上传文件的字段名，默认 "file"
// headers  — 自定义请求头（常用于 Token 认证）
// data     — 上传时附带的额外参数
// withCredentials — 是否携带 cookie

function onSuccess(file, response) {
  // response 为服务端返回数据
  console.log('上传成功', file.name, response)
}
function onError(file, error) {
  console.log('上传失败', file?.name, error.message)
}
function onProgress(file, percent) {
  console.log('上传进度', file.name, percent + '%')
}
<\/script>`

const customRequestCode = `<template>
  <NUpload :custom-request="customRequest" multiple @success="onSuccess" />
</template>

<script setup lang="ts">
// customRequest 接管整个上传流程，适合对接 OSS/S3/COS
// 回调参数：{ file, onProgress, onSuccess, onError }

function customRequest({ file, onProgress, onSuccess, onError }) {
  const raw = file.raw

  // 示例：用 fetch 上传到自有后端
  // const formData = new FormData()
  // formData.append('file', raw)
  // fetch('/api/upload', { method: 'POST', body: formData })
  //   .then(res => res.json())
  //   .then(data => onSuccess(data))
  //   .catch(err => onError(err))

  // 模拟上传（演示用）
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      clearInterval(timer)
      onSuccess({ url: \`https://cdn.example.com/\${raw.name}\` })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}

function onSuccess(file, response) {
  console.log('上传成功', file.name, response)
}
<\/script>`

const dragCode = `<template>
  <NUpload drag tip="支持 jpg、png 格式，单文件不超过 5MB" />
</template>`

const dragSlotCode = `<template>
  <NUpload drag>
    <template #drag>
      <NIcon name="folder" :size="40" color="var(--n-color-primary)" />
      <p>将文件拖到此处</p>
      <p style="font-size:12px;color:var(--n-color-text-disabled);">支持批量上传</p>
    </template>
  </NUpload>
</template>`

const manualCode = `<template>
  <NUpload ref="uploadRef" :auto-upload="false" multiple tip="选择文件后点击下方按钮上传" />
  <NButton variant="primary" @click="startUpload">开始上传</NButton>
  <NButton variant="secondary" @click="clearFiles">清空列表</NButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const uploadRef = ref()

function startUpload() { uploadRef.value?.startUpload() }
function clearFiles() { uploadRef.value?.clearFiles() }
<\/script>`

const beforeUploadCode = `<template>
  <NUpload :before-upload="beforeUpload" accept="image/*" tip="仅支持小于 2MB 的图片" />
</template>

<script setup lang="ts">
// beforeUpload 返回 false 取消上传，返回 true 继续上传
function beforeUpload(file) {
  if (!file.type.startsWith('image/')) {
    alert('只能上传图片！')
    return false
  }
  if (file.size / 1024 / 1024 > 2) {
    alert('图片不能超过 2MB！')
    return false
  }
  return true
}
<\/script>`

const multipleCode = `<template>
  <NUpload multiple :limit="3" @exceed="onExceed" tip="最多上传 3 个文件" />
</template>

<script setup lang="ts">
function onExceed(files) {
  console.log('超出数量限制', files.length)
}
<\/script>`

const pictureCode = `<template>
  <NUpload list-type="picture" multiple accept="image/*" tip="仅支持图片" />
</template>`

const pictureCardCode = `<template>
  <NUpload list-type="picture-card" multiple accept="image/*" :limit="6" tip="最多 6 张" />
</template>`

const maxSizeCode = `<template>
  <NUpload :max-size="2 * 1024 * 1024" accept=".pdf,.doc,.docx" tip="PDF/Word，不超过 2MB" @error="onError" />
</template>

<script setup lang="ts">
function onError(file, error) {
  console.log('上传失败', file?.name, error.message)
}
<\/script>`

const disabledCode = `<template>
  <NUpload disabled />
</template>`

const slotCode = `<template>
  <NUpload>
    <NButton variant="primary">自定义上传按钮</NButton>
  </NUpload>
</template>`

// ========== ImageUpload 示例 ==========
const imgUrl1 = ref('')
const imgUrl2 = ref('')
const imgUrl3 = ref('')
const imgUrl4 = ref('')
const imgUrl5 = ref('')
const imgUrl6 = ref('')
const imgUrl7 = ref('https://picsum.photos/seed/avatar/200/200')

function onImgSuccess(response: any) { console.log('图片上传成功', response) }
function onImgError(error: Error) { console.log('图片上传失败', error.message) }

function imgBeforeUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    alert('只能上传图片！')
    return false
  }
  return true
}

function imgCustomRequest({ file, onProgress, onSuccess, onError }: any) {
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      clearInterval(timer)
      onSuccess({ url: `https://cdn.example.com/${file.name}` })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}

const imgBasicCode = `<template>
  <NImageUpload v-model="imageUrl" />
  <div>图片 URL：{{ imageUrl || '未上传' }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const imageUrl = ref('')
<\/script>`

const imgApiCode = `<template>
  <NImageUpload
    v-model="imageUrl"
    action="https://api.example.com/upload"
    :headers="{ Authorization: 'Bearer your-token' }"
    @success="onSuccess"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const imageUrl = ref('')

function onSuccess(response) {
  console.log('上传成功', response)
}
function onError(error) {
  console.log('上传失败', error.message)
}
<\/script>`

const imgSizeCode = `<template>
  <NImageUpload v-model="avatar" :width="80" :height="80" tip="头像" />
  <NImageUpload v-model="cover" :width="160" :height="120" tip="封面图" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const avatar = ref('')
const cover = ref('')
<\/script>`

const imgBeforeCode = `<template>
  <NImageUpload
    v-model="imageUrl"
    :max-size="2 * 1024 * 1024"
    :before-upload="beforeUpload"
    tip="不超过 2MB"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const imageUrl = ref('')

function beforeUpload(file) {
  if (!file.type.startsWith('image/')) {
    alert('只能上传图片！')
    return false
  }
  return true
}
function onError(error) {
  console.log('上传失败', error.message)
}
<\/script>`

const imgCustomCode = `<template>
  <NImageUpload
    v-model="imageUrl"
    :custom-request="customRequest"
    @success="onSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const imageUrl = ref('')

function customRequest({ file, onProgress, onSuccess }) {
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      clearInterval(timer)
      onSuccess({ url: \`https://cdn.example.com/\${file.name}\` })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}
function onSuccess(response) { console.log('上传成功', response) }
<\/script>`

const imgDisabledCode = `<template>
  <!-- 已有图片时禁用状态会展示预览但无法删除/重新上传 -->
  <NImageUpload v-model="imageUrl" disabled />
</template>

<script setup lang="ts">
const imageUrl = ref('https://example.com/avatar.jpg')
<\/script>`

// ========== Upload 自定义上传函数 ==========
function customRequestFn({ file, onProgress, onSuccess }: any) {
  const raw = file.raw as File
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 20
    if (p >= 100) {
      clearInterval(timer)
      onSuccess({ id: `file-${Date.now()}`, url: `https://cdn.example.com/${raw.name}`, name: raw.name })
    }
    onProgress(Math.min(100, Math.round(p)))
  }, 200)
}

// ========== Upload 上传前校验 ==========
function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) { alert('只能上传图片文件！'); return false }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) { alert('图片大小不能超过 2MB！'); return false }
  return true
}

// ========== 手动上传 ==========
const manualUploadRef = ref<any>(null)
function ManualStartUpload() { manualUploadRef.value?.startUpload() }
function ManualClearFiles() { manualUploadRef.value?.clearFiles() }

// ========== API Tables ==========
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]
const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]
const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]
const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]
const typeColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

// Upload Props
const uploadPropData = [
  { name: 'modelValue', type: '(string | number)[]', default: '[]', desc: '已上传文件的 uid 列表（v-model）' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '是否允许多选文件' },
  { name: 'accept', type: 'string', default: '—', desc: '接受的文件类型（MIME），picture 模式默认 image/*' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'drag', type: 'boolean', default: 'false', desc: '是否启用拖拽上传区域' },
  { name: 'limit', type: 'number', default: '—', desc: '最大上传数量' },
  { name: 'autoUpload', type: 'boolean', default: 'true', desc: '是否选取后自动上传' },
  { name: 'action', type: 'string', default: '—', desc: '服务端上传地址（设置后使用 XMLHttpRequest）' },
  { name: 'method', type: 'string', default: "'POST'", desc: 'HTTP 请求方法' },
  { name: 'headers', type: 'Record<string, string>', default: '{}', desc: '自定义请求头' },
  { name: 'data', type: 'Record<string, any>', default: '{}', desc: '上传附带额外参数' },
  { name: 'name', type: 'string', default: "'file'", desc: '上传文件的字段名' },
  { name: 'withCredentials', type: 'boolean', default: 'false', desc: '是否携带 cookie' },
  { name: 'listType', type: "'text' | 'picture' | 'picture-card'", default: "'text'", desc: '文件列表展示类型' },
  { name: 'maxSize', type: 'number', default: '—', desc: '文件大小上限（字节），超出触发 error 事件' },
  { name: 'tip', type: 'string', default: '—', desc: '提示文本' },
  { name: 'buttonText', type: 'string', default: "'上传文件'", desc: '按钮文字' },
  { name: 'dragText', type: 'string', default: "'点击或拖拽文件到此区域上传'", desc: '拖拽区域文字' },
  { name: 'beforeUpload', type: '(file: File, fileList: UploadFile[]) => boolean | Promise<boolean>', default: '—', desc: '上传前钩子，返回 false 取消上传' },
  { name: 'customRequest', type: '(options) => void', default: '—', desc: '自定义上传实现，适合对接云存储' },
]

// Upload Events
const uploadEventData = [
  { name: 'update:modelValue', type: '(uids: (string|number)[])', desc: '文件 uid 列表变化时触发' },
  { name: 'update:fileList', type: '(fileList: UploadFile[])', desc: '文件列表变化时触发' },
  { name: 'change', type: '(fileList: UploadFile[])', desc: '文件列表变化时触发' },
  { name: 'success', type: '(file: UploadFile, response: any)', desc: '文件上传成功' },
  { name: 'error', type: '(file: UploadFile, error: Error)', desc: '文件上传失败' },
  { name: 'progress', type: '(file: UploadFile, percent: number)', desc: '上传进度变化' },
  { name: 'exceed', type: '(files: File[])', desc: '超出数量限制' },
  { name: 'preview', type: '(file: UploadFile)', desc: '点击文件预览' },
  { name: 'remove', type: '(file: UploadFile)', desc: '文件被删除' },
]

// Upload Slots
const uploadSlotData = [
  { name: 'default', desc: '自定义触发区域（非拖拽、非 picture-card 模式）' },
  { name: 'drag', desc: '自定义拖拽区域内容' },
]

// Upload Methods
const uploadMethodData = [
  { name: 'clearFiles', type: '() => void', desc: '清空文件列表' },
  { name: 'startUpload', type: '() => void', desc: '手动开始上传所有待上传文件' },
]

// UploadFile
const uploadFileTypeData = [
  { name: 'uid', type: 'string', desc: '文件唯一标识' },
  { name: 'name', type: 'string', desc: '文件名' },
  { name: 'size', type: 'number', desc: '文件大小（字节）' },
  { name: 'status', type: "'pending' | 'uploading' | 'done' | 'error'", desc: '文件状态' },
  { name: 'progress', type: 'number', desc: '上传进度（0-100）' },
  { name: 'raw', type: 'File', desc: '原始文件对象' },
  { name: 'url', type: 'string', desc: '文件 URL' },
  { name: 'thumbUrl', type: 'string', desc: '缩略图 URL' },
  { name: 'response', type: 'any', desc: '服务端响应数据' },
]

// ImageUpload Props
const imgPropData = [
  { name: 'modelValue', type: 'string', default: "''", desc: '图片 URL（v-model）' },
  { name: 'action', type: 'string', default: '—', desc: '服务端上传地址' },
  { name: 'method', type: 'string', default: "'POST'", desc: 'HTTP 请求方法' },
  { name: 'headers', type: 'Record<string, string>', default: '{}', desc: '自定义请求头' },
  { name: 'data', type: 'Record<string, any>', default: '{}', desc: '上传附带额外参数' },
  { name: 'name', type: 'string', default: "'file'", desc: '上传文件字段名' },
  { name: 'withCredentials', type: 'boolean', default: 'false', desc: '是否携带 cookie' },
  { name: 'customRequest', type: '(options) => void', default: '—', desc: '自定义上传实现' },
  { name: 'beforeUpload', type: '(file: File) => boolean | Promise<boolean>', default: '—', desc: '上传前钩子' },
  { name: 'maxSize', type: 'number', default: '—', desc: '文件大小上限（字节）' },
  { name: 'accept', type: 'string', default: "'image/*'", desc: '接受的文件类型' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'width', type: 'number | string', default: '104', desc: '预览框宽度' },
  { name: 'height', type: 'number | string', default: '104', desc: '预览框高度' },
  { name: 'tip', type: 'string', default: "'上传图片'", desc: '提示文字' },
]

// ImageUpload Events
const imgEventData = [
  { name: 'update:modelValue', type: '(url: string)', desc: '图片 URL 变化时触发' },
  { name: 'change', type: '(url: string)', desc: '图片 URL 变化时触发' },
  { name: 'success', type: '(response: any)', desc: '上传成功时触发' },
  { name: 'error', type: '(error: Error)', desc: '上传失败或校验不通过时触发' },
  { name: 'progress', type: '(percent: number)', desc: '上传进度变化时触发' },
  { name: 'remove', type: '()', desc: '图片被删除时触发' },
]

// ImageUpload Slots
const imgSlotData = [
  { name: 'default', desc: '自定义上传触发区域内容（未上传时）' },
]
</script>

<style scoped>
.full-status {
  transition: opacity 0.3s;
}
</style>
