<template>
  <div :class="['n-image-upload', { 'n-image-upload--disabled': disabled }]">
    <!-- 已上传：显示图片预览 -->
    <div v-if="imageUrl" class="n-image-upload__preview" :style="boxStyle">
      <img :src="imageUrl" class="n-image-upload__img" @click="handlePreview" />
      <div class="n-image-upload__actions">
        <span class="n-image-upload__action" @click="handlePreview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </span>
        <span v-if="!disabled" class="n-image-upload__action" @click="handleRemove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </span>
      </div>
      <div v-if="status === 'uploading'" class="n-image-upload__progress">
        <div class="n-image-upload__progress-bar" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <!-- 未上传：显示上传按钮 -->
    <div v-else class="n-image-upload__trigger" :class="{ 'n-image-upload__trigger--error': errorMsg }" :style="boxStyle" @click="triggerInput">
      <slot>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span v-if="tip" class="n-image-upload__tip">{{ tip }}</span>
      </slot>
      <div v-if="errorMsg" class="n-image-upload__error-msg">{{ errorMsg }}</div>
    </div>

    <input ref="inputRef" type="file" :accept="computedAccept" class="n-image-upload__input" @change="handleFileChange" />

    <!-- 大图预览 -->
    <Teleport to="body">
      <Transition name="n-image-upload-fade">
        <div v-if="previewVisible" class="n-image-upload__overlay" @click.self="previewVisible = false">
          <div class="n-image-upload__overlay-content">
            <img :src="imageUrl" class="n-image-upload__overlay-img" />
            <span class="n-image-upload__overlay-close" @click="previewVisible = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'

const attrs = useAttrs()

const props = withDefaults(defineProps<{
  /** 图片 URL，支持 v-model */
  modelValue?: string
  /** 上传地址，设置后使用 XMLHttpRequest 发送请求 */
  action?: string
  /** HTTP 请求方法 */
  method?: string
  /** 自定义请求头 */
  headers?: Record<string, string>
  /** 上传附带的额外参数 */
  data?: Record<string, any>
  /** 上传文件的字段名 */
  name?: string
  /** 携带 cookie */
  withCredentials?: boolean
  /** 自定义上传实现 */
  customRequest?: Function
  /** 上传前钩子，返回 false 取消上传 */
  beforeUpload?: Function
  /** 文件大小上限（字节） */
  maxSize?: number
  /** 接受的文件类型 */
  accept?: string
  /** 禁用 */
  disabled?: boolean
  /** 预览框宽度 */
  width?: number | string
  /** 预览框高度 */
  height?: number | string
  /** 提示文字 */
  tip?: string
}>(), {
  method: 'POST',
  name: 'file',
  withCredentials: false,
  disabled: false,
  width: 104,
  height: 104,
  tip: '上传图片',
})

const emit = defineEmits<{
  'update:modelValue': [url: string]
  change: [url: string]
  success: [response: any]
  error: [error: Error]
  progress: [percent: number]
  remove: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const previewVisible = ref(false)
const status = ref<'idle' | 'uploading' | 'done' | 'error'>('idle')
const progress = ref(0)
const localUrl = ref('')
const errorMsg = ref('')

const imageUrl = computed(() => props.modelValue || localUrl.value)

const boxStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const computedAccept = computed(() => props.accept || 'image/*')

function triggerInput() {
  if (props.disabled) return
  inputRef.value?.click()
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  ;(e.target as HTMLInputElement).value = ''

  // 类型校验（部分浏览器 file.type 可能为空，此时根据 accept 或扩展名判断）
  if (file.type && !file.type.startsWith('image/')) {
    errorMsg.value = '只能上传图片文件'
    emit('error', new Error(errorMsg.value))
    return
  }
  if (!file.type && computedAccept.value === 'image/*') {
    const ext = file.name.split('.').pop()?.toLowerCase()
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff', 'avif']
    if (!ext || !imageExts.includes(ext)) {
      errorMsg.value = '只能上传图片文件'
      emit('error', new Error(errorMsg.value))
      return
    }
  }

  // 大小校验
  if (props.maxSize && file.size > props.maxSize) {
    errorMsg.value = `图片大小不能超过 ${(props.maxSize / 1024 / 1024).toFixed(1)}MB`
    emit('error', new Error(errorMsg.value))
    return
  }

  // beforeUpload 钩子（attrs fallback）
  const beforeFn = props.beforeUpload || (attrs as any).beforeUpload || (attrs as any)['before-upload'] as typeof props.beforeUpload | undefined
  if (beforeFn) {
    try {
      const pass = await beforeFn(file)
      if (pass === false) return
    } catch {
      return
    }
  }

  // 生成本地预览
  localUrl.value = URL.createObjectURL(file)

  // 获取 customRequest（props 优先，attrs fallback 兼容 Nuxt 自动注册组件时的 prop 丢失）
  const customFn = props.customRequest || (attrs as any).customRequest || (attrs as any)['custom-request'] as typeof props.customRequest | undefined

  // 上传
  if (customFn) {
    doCustomUpload(file, customFn)
  } else if (props.action) {
    doXhrUpload(file)
  } else {
    // 无 customRequest 且无 action 时直接使用本地 URL
    status.value = 'done'
    progress.value = 100
    emit('update:modelValue', localUrl.value)
    emit('change', localUrl.value)
    emit('success', { url: localUrl.value })
  }
}

function doCustomUpload(file: File, fn: Function) {
  status.value = 'uploading'
  progress.value = 0
  fn({
    file,
    onProgress(percent: number) {
      progress.value = percent
      emit('progress', percent)
    },
    onSuccess(response: any) {
      status.value = 'done'
      progress.value = 100
      const url = response?.url || localUrl.value
      emit('update:modelValue', url)
      emit('change', url)
      emit('success', response)
    },
    onError(error: Error) {
      status.value = 'error'
      errorMsg.value = error.message || '上传失败'
      emit('error', error)
    },
  })
}

function doXhrUpload(file: File) {
  status.value = 'uploading'
  progress.value = 0

  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append(props.name, file)
  if (props.data) {
    Object.keys(props.data).forEach(key => {
      formData.append(key, props.data![key])
    })
  }

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100)
      progress.value = percent
      emit('progress', percent)
    }
  })

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText)
        status.value = 'done'
        progress.value = 100
        const url = response?.url || response?.data?.url || localUrl.value
        emit('update:modelValue', url)
        emit('change', url)
        emit('success', response)
      } catch {
        status.value = 'done'
        progress.value = 100
        emit('update:modelValue', localUrl.value)
        emit('change', localUrl.value)
        emit('success', xhr.responseText)
      }
    } else {
      status.value = 'error'
      errorMsg.value = `HTTP ${xhr.status}`
      emit('error', new Error(errorMsg.value))
    }
  })

  xhr.addEventListener('error', () => {
    status.value = 'error'
    errorMsg.value = '网络错误'
    emit('error', new Error(errorMsg.value))
  })

  xhr.open(props.method, props.action!, true)

  if (props.withCredentials) xhr.withCredentials = true
  if (props.headers) {
    Object.keys(props.headers).forEach(key => {
      xhr.setRequestHeader(key, props.headers![key])
    })
  }

  xhr.send(formData)
}

function handlePreview() {
  if (imageUrl.value) {
    previewVisible.value = true
  }
}

function handleRemove() {
  if (localUrl.value) {
    URL.revokeObjectURL(localUrl.value)
    localUrl.value = ''
  }
  status.value = 'idle'
  progress.value = 0
  errorMsg.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  emit('remove')
}
</script>

<style scoped>
.n-image-upload {
  display: inline-block;
}

.n-image-upload--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.n-image-upload__input {
  display: none;
}

/* Trigger button */
.n-image-upload__trigger {
  border: 1px dashed var(--n-color-border, #d9d9d9);
  border-radius: var(--n-radius-lg, 8px);
  background: var(--n-color-fill, #fafafa);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: var(--n-color-text-disabled, #999);
  transition: all 0.2s;
  box-sizing: border-box;
  overflow: hidden;
}

.n-image-upload__trigger:hover {
  border-color: var(--n-color-primary, #3b82f6);
  color: var(--n-color-primary, #3b82f6);
}

.n-image-upload__trigger--error {
  border-color: var(--n-color-danger, #ef4444);
}

.n-image-upload__trigger--error .n-image-upload__tip {
  color: var(--n-color-danger, #ef4444);
}

.n-image-upload__error-msg {
  font-size: 12px;
  color: var(--n-color-danger, #ef4444);
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
  word-break: break-all;
}

.n-image-upload__tip {
  font-size: 12px;
  line-height: 1;
}

/* Preview */
.n-image-upload__preview {
  position: relative;
  border-radius: var(--n-radius-lg, 8px);
  border: 1px solid var(--n-color-border, #e8e8e8);
  overflow: hidden;
  box-sizing: border-box;
}

.n-image-upload__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.n-image-upload__actions {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.n-image-upload__preview:hover .n-image-upload__actions {
  opacity: 1;
}

.n-image-upload__action {
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: background 0.15s;
}

.n-image-upload__action:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Progress */
.n-image-upload__progress {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.n-image-upload__progress-bar {
  height: 100%;
  background: var(--n-color-primary, #3b82f6);
  transition: width 0.2s;
  border-radius: 2px;
}

/* Overlay preview */
.n-image-upload__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}

.n-image-upload__overlay-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.n-image-upload__overlay-img {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 8px;
  object-fit: contain;
}

.n-image-upload__overlay-close {
  position: absolute;
  top: -36px;
  right: 0;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.15s;
}

.n-image-upload__overlay-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Transitions */
.n-image-upload-fade-enter-active,
.n-image-upload-fade-leave-active {
  transition: opacity 0.2s ease;
}

.n-image-upload-fade-enter-from,
.n-image-upload-fade-leave-to {
  opacity: 0;
}
</style>
