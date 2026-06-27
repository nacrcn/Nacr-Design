<template>
  <div :class="uploadClasses">
    <!-- Picture-card mode -->
    <div v-if="listType === 'picture-card'" class="n-upload__picture-list">
      <div v-for="(file, i) in fileList" :key="file.uid" class="n-upload__picture-card">
        <img v-if="file.thumbUrl || file.url" :src="file.thumbUrl || file.url" class="n-upload__picture-card-img" />
        <div v-else class="n-upload__picture-card-placeholder">
          <NIcon name="file" :size="24" color="var(--n-color-text-disabled)" />
        </div>
        <div v-if="file.status === 'uploading'" class="n-upload__picture-card-progress">
          <div class="n-upload__picture-card-progress-bar" :style="{ width: file.progress + '%' }" />
        </div>
        <div class="n-upload__picture-card-actions">
          <span v-if="file.status === 'done' && (file.thumbUrl || file.url)" class="n-upload__picture-card-action" @click="handlePreview(file)">
            <NIcon name="eye" :size="16" />
          </span>
          <span v-if="file.status === 'error'" class="n-upload__picture-card-action" @click="retryFile(i)">
            <NIcon name="refresh" :size="16" />
          </span>
          <span class="n-upload__picture-card-action" @click="removeFile(i)">
            <NIcon name="close" :size="16" />
          </span>
        </div>
        <div v-if="file.status === 'error'" class="n-upload__picture-card-error">
          <NIcon name="warning" :size="16" color="var(--n-color-danger)" />
        </div>
      </div>
      <div v-if="!limit || fileList.length < limit" class="n-upload__picture-card n-upload__picture-card--add" @click="triggerInput">
        <NIcon name="plus" :size="28" color="var(--n-color-text-disabled)" />
        <span class="n-upload__picture-card-add-text">上传</span>
      </div>
    </div>

    <!-- Drag zone (non picture-card) -->
    <div v-else-if="drag" class="n-upload__drag" @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="handleDrop" @click="triggerInput">
      <div :class="['n-upload__drag-inner', { 'n-upload__drag-inner--active': dragging }]">
        <slot name="drag">
          <NIcon name="shangchuan" :size="36" color="var(--n-color-text-disabled)" />
          <p>{{ dragText }}</p>
          <p v-if="tip" class="n-upload__drag-tip">{{ tip }}</p>
        </slot>
      </div>
    </div>

    <!-- Button trigger (default) -->
    <div v-else class="n-upload__trigger" @click="triggerInput">
      <slot>
        <NButton :disabled="disabled">
          <NIcon name="shangchuan" :size="16" style="margin-right:4px" />{{ buttonText }}
        </NButton>
      </slot>
      <span v-if="tip" class="n-upload__tip">{{ tip }}</span>
    </div>

    <input ref="inputRef" type="file" :multiple="multiple" :accept="computedAccept" class="n-upload__input" @change="handleFileChange" />

    <!-- File list (non picture-card) -->
    <div v-if="fileList.length && listType !== 'picture-card'" :class="['n-upload__list', `n-upload__list--${listType}`]">
      <div v-for="(file, i) in fileList" :key="file.uid" :class="['n-upload__file', `n-upload__file--${file.status}`]">
        <!-- Picture list item -->
        <template v-if="listType === 'picture'">
          <div class="n-upload__file-thumb">
            <img v-if="file.thumbUrl || file.url" :src="file.thumbUrl || file.url" class="n-upload__file-thumb-img" @click="handlePreview(file)" />
            <NIcon v-else name="file" :size="20" color="var(--n-color-text-disabled)" />
          </div>
        </template>
        <!-- Text item icon -->
        <template v-else>
          <NIcon name="file" :size="16" color="var(--n-color-text-disabled)" style="flex-shrink:0" />
        </template>

        <span class="n-upload__file-name" @click="handlePreview(file)">{{ file.name }}</span>
        <span class="n-upload__file-size">{{ formatSize(file.size) }}</span>

        <span v-if="file.status === 'done'" class="n-upload__file-status n-upload__file-status--done">
          <NIcon name="check" :size="14" color="var(--n-color-success)" />
        </span>
        <span v-else-if="file.status === 'error'" class="n-upload__file-status n-upload__file-status--error" @click="retryFile(i)">
          <NIcon name="refresh" :size="14" color="var(--n-color-danger)" />
        </span>
        <span class="n-upload__file-remove" @click="removeFile(i)">
          <NIcon name="close" :size="14" />
        </span>

        <div v-if="file.status === 'uploading'" class="n-upload__progress">
          <div class="n-upload__progress-bar" :style="{ width: file.progress + '%' }" />
        </div>
      </div>
    </div>

    <!-- Manual upload button -->
    <div v-if="!autoUpload && fileList.some(f => f.status === 'pending')" class="n-upload__manual">
      <NButton type="primary" size="sm" @click="startUpload">开始上传</NButton>
    </div>

    <!-- Image preview overlay -->
    <Teleport to="body">
      <Transition name="n-fade">
        <div v-if="previewVisible" class="n-upload__preview-overlay" @click.self="previewVisible = false">
          <div class="n-upload__preview-content">
            <img :src="previewUrl" class="n-upload__preview-img" />
            <span class="n-upload__preview-close" @click="previewVisible = false">
              <NIcon name="close" :size="20" color="#fff" />
            </span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

export interface UploadFile {
  uid: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  raw: File
  url?: string
  thumbUrl?: string
  response?: any
  [key: string]: any
}

const props = withDefaults(defineProps<{
  modelValue?: (string | number)[]
  multiple?: boolean
  accept?: string
  disabled?: boolean
  drag?: boolean
  limit?: number
  autoUpload?: boolean
  action?: string
  method?: string
  headers?: Record<string, string>
  data?: Record<string, any>
  listType?: 'text' | 'picture' | 'picture-card'
  maxSize?: number
  tip?: string
  buttonText?: string
  dragText?: string
  draggable?: boolean
  withCredentials?: boolean
  name?: string
  beforeUpload?: (file: File, fileList: UploadFile[]) => boolean | Promise<boolean>
  customRequest?: (options: { file: UploadFile; action: string; method: string; headers: Record<string, string>; data: Record<string, any>; onProgress: (percent: number) => void; onSuccess: (response: any) => void; onError: (error: Error) => void }) => void
}>(), {
  multiple: false,
  disabled: false,
  drag: false,
  autoUpload: true,
  method: 'POST',
  listType: 'text',
  buttonText: '上传文件',
  dragText: '点击或拖拽文件到此区域上传',
  draggable: true,
  name: 'file',
})

const emit = defineEmits<{
  'update:modelValue': [v: (string | number)[]]
  'update:fileList': [v: UploadFile[]]
  change: [fileList: UploadFile[]]
  success: [file: UploadFile, response: any]
  error: [file: UploadFile, error: Error]
  progress: [file: UploadFile, percent: number]
  exceed: [files: File[]]
  preview: [file: UploadFile]
  remove: [file: UploadFile]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const fileList = reactive<UploadFile[]>([])
const previewVisible = ref(false)
const previewUrl = ref('')

const uploadClasses = computed(() => [
  'n-upload',
  `n-upload--${props.listType}`,
  {
    'n-upload--disabled': props.disabled,
    'n-upload--drag': props.drag,
  },
])

const computedAccept = computed(() => {
  if (props.accept) return props.accept
  if (props.listType === 'picture-card' || props.listType === 'picture') return 'image/*'
  return ''
})

let uidCounter = 0
function genUid() {
  return `upload-${Date.now()}-${++uidCounter}`
}

function triggerInput() {
  if (props.disabled) return
  inputRef.value?.click()
}

function handleFileChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  addFiles(files)
  ;(e.target as HTMLInputElement).value = ''
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  if (props.disabled) return
  const files = Array.from(e.dataTransfer?.files || [])
  addFiles(files)
}

async function addFiles(files: File[]) {
  if (props.limit && fileList.length + files.length > props.limit) {
    emit('exceed', files)
    return
  }

  const newFiles: UploadFile[] = []
  for (const f of files) {
    // Size validation
    if (props.maxSize && f.size > props.maxSize) {
      const err = new Error(`文件 ${f.name} 超出大小限制 ${formatSize(props.maxSize)}`)
      emit('error', { uid: genUid(), name: f.name, size: f.size, status: 'error', progress: 0, raw: f } as UploadFile, err)
      continue
    }

    // beforeUpload hook
    if (props.beforeUpload) {
      try {
        const pass = await props.beforeUpload(f, [...fileList])
        if (pass === false) continue
      } catch {
        continue
      }
    }

    const entry: UploadFile = {
      uid: genUid(),
      name: f.name,
      size: f.size,
      status: 'pending',
      progress: 0,
      raw: f,
    }

    // Generate thumbnail for images
    if (f.type.startsWith('image/')) {
      entry.thumbUrl = URL.createObjectURL(f)
      entry.url = entry.thumbUrl
    }

    fileList.push(entry)
    newFiles.push(entry)

    if (props.autoUpload) {
      uploadFile(entry)
    }
  }

  if (newFiles.length) {
    emitChange()
  }
}

function uploadFile(file: UploadFile) {
  if (props.customRequest) {
    file.status = 'uploading'
    file.progress = 0
    props.customRequest({
      file,
      action: props.action || '',
      method: props.method,
      headers: props.headers || {},
      data: props.data || {},
      onProgress(percent: number) {
        file.progress = percent
        emit('progress', file, percent)
      },
      onSuccess(response: any) {
        file.status = 'done'
        file.progress = 100
        file.response = response
        emit('success', file, response)
        emitChange()
      },
      onError(error: Error) {
        file.status = 'error'
        file.progress = 0
        emit('error', file, error)
        emitChange()
      },
    })
  } else if (props.action) {
    xhrUpload(file)
  } else {
    simulateUpload(file)
  }
}

function xhrUpload(file: UploadFile) {
  file.status = 'uploading'
  file.progress = 0

  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append(props.name, file.raw)
  if (props.data) {
    Object.keys(props.data).forEach(key => {
      formData.append(key, props.data![key])
    })
  }

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100)
      file.progress = percent
      emit('progress', file, percent)
    }
  })

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText)
        file.status = 'done'
        file.progress = 100
        file.response = response
        emit('success', file, response)
      } catch {
        file.status = 'done'
        file.progress = 100
        file.response = xhr.responseText
        emit('success', file, xhr.responseText)
      }
    } else {
      file.status = 'error'
      emit('error', file, new Error(`HTTP ${xhr.status}`))
    }
    emitChange()
  })

  xhr.addEventListener('error', () => {
    file.status = 'error'
    emit('error', file, new Error('Network error'))
    emitChange()
  })

  xhr.open(props.method, props.action || '', true)

  if (props.withCredentials) {
    xhr.withCredentials = true
  }

  if (props.headers) {
    Object.keys(props.headers).forEach(key => {
      xhr.setRequestHeader(key, props.headers![key])
    })
  }

  xhr.send(formData)
}

function simulateUpload(file: UploadFile) {
  file.status = 'uploading'
  file.progress = 0
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 25
    if (p >= 100) {
      p = 100
      file.status = Math.random() > 0.9 ? 'error' : 'done'
      clearInterval(timer)
      if (file.status === 'done') {
        emit('success', file, { url: `https://example.com/${file.name}` })
      } else {
        emit('error', file, new Error('模拟上传失败'))
      }
      emitChange()
    }
    file.progress = Math.min(100, Math.round(p))
    emit('progress', file, file.progress)
  }, 200)
}

function retryFile(index: number) {
  const file = fileList[index]
  if (file) {
    file.status = 'pending'
    file.progress = 0
    uploadFile(file)
  }
}

function removeFile(index: number) {
  const removed = fileList.splice(index, 1)[0]
  if (removed?.thumbUrl) {
    URL.revokeObjectURL(removed.thumbUrl)
  }
  emit('remove', removed)
  emitChange()
}

function startUpload() {
  fileList.filter(f => f.status === 'pending').forEach(f => uploadFile(f))
}

function handlePreview(file: UploadFile) {
  emit('preview', file)
  if (file.url || file.thumbUrl) {
    previewUrl.value = file.url || file.thumbUrl!
    previewVisible.value = true
  }
}

function emitChange() {
  const values = fileList.filter(f => f.status === 'done').map(f => f.uid)
  emit('update:modelValue', values)
  emit('update:fileList', [...fileList])
  emit('change', [...fileList])
}

function clearFiles() {
  fileList.forEach(f => {
    if (f.thumbUrl) URL.revokeObjectURL(f.thumbUrl)
  })
  fileList.splice(0, fileList.length)
  emitChange()
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}

defineExpose({ clearFiles, startUpload, fileList })
</script>

<style scoped>
.n-upload {}
.n-upload--disabled { opacity: .5; pointer-events: none; }
.n-upload__input { display: none; }

/* Trigger */
.n-upload__trigger { display: inline-flex; flex-direction: column; gap: 4px; }
.n-upload__tip { font-size: 12px; color: var(--n-color-text-disabled, #999); line-height: 1.5; }

/* Drag */
.n-upload__drag {
  border: 2px dashed var(--n-color-border-hover, #d9d9d9); border-radius: 8px; padding: 32px 24px; cursor: pointer;
  transition: border-color .2s;
}
.n-upload__drag:hover { border-color: var(--n-color-primary, #1677ff); }
.n-upload__drag-inner { text-align: center; color: var(--n-color-text-disabled, #999); }
.n-upload__drag-inner p { margin: 8px 0 0; font-size: 14px; }
.n-upload__drag-inner--active { border-color: var(--n-color-primary, #1677ff); background: rgba(22,119,255,.04); }
.n-upload__drag-tip { font-size: 12px; margin-top: 4px !important; color: var(--n-color-text-disabled, #bbb); }

/* File list */
.n-upload__list { margin-top: 8px; }
.n-upload__file {
  display: flex; align-items: center; gap: 8px; padding: 7px 0; font-size: 13px; color: var(--n-color-text-secondary, #666);
  border-bottom: 1px solid var(--n-color-fill-hover, #f0f0f0); position: relative; transition: background .15s;
}
.n-upload__file:hover { background: var(--n-color-fill-hover, #fafafa); }
.n-upload__file--done .n-upload__file-name { color: var(--n-color-text, #333); }
.n-upload__file--error .n-upload__file-name { color: var(--n-color-danger, #ff4d4f); }

.n-upload__file-thumb {
  width: 36px; height: 36px; border-radius: 4px; overflow: hidden; flex-shrink: 0;
  background: var(--n-color-fill, #f5f5f5); display: flex; align-items: center; justify-content: center;
}
.n-upload__file-thumb-img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; }
.n-upload__file-name { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: default; }
.n-upload__file-size { flex-shrink: 0; color: var(--n-color-text-disabled, #999); font-size: 12px; }
.n-upload__file-status { flex-shrink: 0; cursor: pointer; display: flex; align-items: center; }
.n-upload__file-remove { flex-shrink: 0; cursor: pointer; color: var(--n-color-text-disabled, #999); display: flex; align-items: center; }
.n-upload__file-remove:hover { color: var(--n-color-danger, #ff4d4f); }

/* Progress bar */
.n-upload__progress {
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--n-color-border, #e8e8e8);
}
.n-upload__progress-bar { height: 100%; background: var(--n-color-primary, #1677ff); transition: width .2s; }

/* Picture Card */
.n-upload__picture-list {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.n-upload__picture-card {
  width: 104px; height: 104px; border-radius: 8px; border: 1px solid var(--n-color-border, #e8e8e8);
  position: relative; overflow: hidden; background: var(--n-color-fill, #f5f5f5);
  display: flex; align-items: center; justify-content: center; transition: border-color .2s;
}
.n-upload__picture-card:hover { border-color: var(--n-color-primary, #1677ff); }
.n-upload__picture-card-img { width: 100%; height: 100%; object-fit: cover; }
.n-upload__picture-card-placeholder { display: flex; align-items: center; justify-content: center; }
.n-upload__picture-card--add {
  border-style: dashed; cursor: pointer; flex-direction: column; gap: 4px;
}
.n-upload__picture-card--add:hover { border-color: var(--n-color-primary, #1677ff); }
.n-upload__picture-card-add-text { font-size: 12px; color: var(--n-color-text-disabled, #999); }

.n-upload__picture-card-actions {
  position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center;
  gap: 8px; opacity: 0; transition: opacity .2s;
}
.n-upload__picture-card:hover .n-upload__picture-card-actions { opacity: 1; }
.n-upload__picture-card-action {
  cursor: pointer; color: #fff; display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%; transition: background .15s;
}
.n-upload__picture-card-action:hover { background: rgba(255,255,255,.2); }

.n-upload__picture-card-progress {
  position: absolute; bottom: 8px; left: 8px; right: 8px; height: 3px;
  background: rgba(255,255,255,.3); border-radius: 2px; overflow: hidden;
}
.n-upload__picture-card-progress-bar {
  height: 100%; background: var(--n-color-primary, #1677ff); transition: width .2s; border-radius: 2px;
}

.n-upload__picture-card-error {
  position: absolute; top: 4px; right: 4px;
}

/* Manual upload */
.n-upload__manual { margin-top: 12px; }

/* Preview overlay */
.n-upload__preview-overlay {
  position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
}
.n-upload__preview-content { position: relative; max-width: 90vw; max-height: 90vh; }
.n-upload__preview-img { max-width: 90vw; max-height: 85vh; border-radius: 8px; object-fit: contain; }
.n-upload__preview-close {
  position: absolute; top: -36px; right: 0; cursor: pointer; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center; border-radius: 50%;
  background: rgba(255,255,255,.15); transition: background .15s;
}
.n-upload__preview-close:hover { background: rgba(255,255,255,.3); }

/* Transition */
.n-fade-enter-active, .n-fade-leave-active { transition: opacity .2s ease; }
.n-fade-enter-from, .n-fade-leave-to { opacity: 0; }
</style>
