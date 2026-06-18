<template>
  <div
    :class="['n-md-editor', { 'n-md-editor--disabled': disabled, 'n-md-editor--focused': focused, 'n-md-editor--dragover': isDragOver }]"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- Toolbar -->
    <div v-if="!hideToolbar" class="n-md-editor__toolbar">
      <div class="n-md-editor__toolbar-group">
        <button v-for="tool in toolbarLeft" :key="tool.key" class="n-md-editor__tool-btn" :title="tool.title"
          :disabled="disabled || tool.loading" @click="tool.action">
          <svg v-if="tool.icon && !tool.loading" v-html="tool.icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <span v-if="tool.loading" class="n-md-editor__tool-spinner" />
        </button>
      </div>
      <div class="n-md-editor__toolbar-group">
        <button v-for="mode in viewModes" :key="mode.key" :class="['n-md-editor__tool-btn', { 'n-md-editor__tool-btn--active': viewMode === mode.key }]"
          :title="mode.title" :disabled="disabled" @click="viewMode = mode.key">
          <svg v-html="mode.icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </button>
      </div>
    </div>

    <!-- Hidden file input for image upload -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      multiple
      style="display: none"
      @change="onFileSelected"
    />

    <!-- Body -->
    <div class="n-md-editor__body">
      <!-- Editor pane -->
      <div v-show="viewMode !== 'preview'" class="n-md-editor__editor">
        <textarea
          ref="textareaRef"
          :class="['n-md-editor__textarea']"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          @paste="onPaste"
        />
        <div v-if="maxlength && showCount" class="n-md-editor__count" :class="{ 'n-md-editor__count--exceed': currentLength > maxlength }">
          {{ currentLength }}/{{ maxlength }}
        </div>
        <!-- Drag overlay -->
        <div v-if="isDragOver" class="n-md-editor__drop-overlay">
          <div class="n-md-editor__drop-hint">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>释放以插入图片</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div v-if="viewMode === 'split'" class="n-md-editor__divider" />

      <!-- Preview pane -->
      <div v-if="viewMode !== 'edit'" class="n-md-editor__preview">
        <div class="n-md-editor__preview-content" v-html="renderedHtml" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

function renderMarkdown(md: string): string {
  if (!md) return ''
  return marked.parse(md) as string
}

type ViewMode = 'edit' | 'preview' | 'split'

export type UploadFn = (file: File) => Promise<string>

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  hideToolbar?: boolean
  viewModeProp?: ViewMode
  height?: string | number
  maxlength?: number
  showCount?: boolean
  autofocus?: boolean
  /** Allowed file types for upload, defaults to image/* */
  accept?: string
  /** Custom upload function — receives File, returns URL string */
  uploadFn?: UploadFn
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入 Markdown 内容...',
  disabled: false,
  readonly: false,
  hideToolbar: false,
  viewModeProp: 'split',
  height: 400,
  showCount: false,
  autofocus: false,
  accept: 'image/*',
  uploadFn: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [val: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
  change: [val: string]
  'upload-success': [{ file: File; url: string }]
  'upload-error': [{ file: File; error: Error }]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()
const focused = ref(false)
const viewMode = ref<ViewMode>(props.viewModeProp)
const currentLength = computed(() => props.modelValue.length)
const isDragOver = ref(false)
const isUploading = ref(false)

const renderedHtml = computed(() => renderMarkdown(props.modelValue))

const computedHeight = computed(() => {
  const h = props.height
  return typeof h === 'number' ? `${h}px` : h
})

// SVG icon strings
const icons = {
  bold: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>',
  italic: '<line x1="19" y1="8" x2="10" y2="8"/><line x1="14" y1="16" x2="5" y2="16"/><line x1="15" y1="4" x2="9" y2="20"/>',
  strikethrough: '<path d="M16 4H9a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h6"/><line x1="4" y1="12" x2="20" y2="12"/><path d="M15 12a3 3 0 1 1 0 6H8"/>',
  h1: '<path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/>',
  h2: '<path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12l4-2v8"/>',
  ul: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  ol: '<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
  hr: '<line x1="2" y1="12" x2="22" y2="12"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  columns: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/>',
}

const toolbarLeft = computed(() => [
  { key: 'bold', title: '粗体 (Ctrl+B)', icon: icons.bold, action: () => wrapSelection('**', '**'), loading: false },
  { key: 'italic', title: '斜体 (Ctrl+I)', icon: icons.italic, action: () => wrapSelection('*', '*'), loading: false },
  { key: 'strikethrough', title: '删除线', icon: icons.strikethrough, action: () => wrapSelection('~~', '~~'), loading: false },
  { key: 'h1', title: '一级标题', icon: icons.h1, action: () => prependLine('# '), loading: false },
  { key: 'h2', title: '二级标题', icon: icons.h2, action: () => prependLine('## '), loading: false },
  { key: 'ul', title: '无序列表', icon: icons.ul, action: () => prependLine('- '), loading: false },
  { key: 'ol', title: '有序列表', icon: icons.ol, action: () => prependLine('1. '), loading: false },
  { key: 'quote', title: '引用', icon: icons.quote, action: () => prependLine('> '), loading: false },
  { key: 'code', title: '行内代码', icon: icons.code, action: () => wrapSelection('`', '`'), loading: false },
  { key: 'link', title: '链接', icon: icons.link, action: () => insertLink(), loading: false },
  { key: 'image', title: '插入图片', icon: icons.image, action: () => triggerFileInput(), loading: false },
  { key: 'upload', title: '上传图片', icon: icons.upload, action: () => triggerFileInput(), loading: isUploading.value },
  { key: 'table', title: '表格', icon: icons.table, action: () => insertTable(), loading: false },
  { key: 'hr', title: '分隔线', icon: icons.hr, action: () => prependLine('\n---\n'), loading: false },
])

const viewModes = computed(() => [
  { key: 'edit' as ViewMode, title: '编辑模式', icon: icons.edit },
  { key: 'split' as ViewMode, title: '分屏模式', icon: icons.columns },
  { key: 'preview' as ViewMode, title: '预览模式', icon: icons.eye },
])

// ===== Input handling =====

function handleInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', val)
  emit('change', val)
}

function handleFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertAtCursor('  ')
  }
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault()
    wrapSelection('**', '**')
  }
  if (e.ctrlKey && e.key === 'i') {
    e.preventDefault()
    wrapSelection('*', '*')
  }
}

// ===== Selection helpers =====

function getSelection(): { start: number; end: number; selected: string } {
  const el = textareaRef.value
  if (!el) return { start: 0, end: 0, selected: '' }
  return {
    start: el.selectionStart,
    end: el.selectionEnd,
    selected: el.value.substring(el.selectionStart, el.selectionEnd),
  }
}

function replaceSelection(before: string, after: string, defaultText: string) {
  const el = textareaRef.value
  if (!el || props.disabled || props.readonly) return
  const { start, end, selected } = getSelection()
  const text = selected || defaultText
  const newVal = props.modelValue.substring(0, start) + before + text + after + props.modelValue.substring(end)
  emit('update:modelValue', newVal)
  emit('change', newVal)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + before.length, start + before.length + text.length)
  })
}

function wrapSelection(before: string, after: string) {
  const defaultTexts: Record<string, string> = { '**': '粗体文本', '*': '斜体文本', '~~': '删除线文本', '`': '代码' }
  replaceSelection(before, after, defaultTexts[before] || '文本')
}

function prependLine(prefix: string) {
  const el = textareaRef.value
  if (!el || props.disabled || props.readonly) return
  const { start } = getSelection()
  const val = props.modelValue
  const lineStart = val.lastIndexOf('\n', start - 1) + 1
  const newVal = val.substring(0, lineStart) + prefix + val.substring(lineStart)
  emit('update:modelValue', newVal)
  emit('change', newVal)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + prefix.length, start + prefix.length)
  })
}

function insertAtCursor(text: string) {
  const el = textareaRef.value
  if (!el || props.disabled || props.readonly) return
  const { start, end } = getSelection()
  const newVal = props.modelValue.substring(0, start) + text + props.modelValue.substring(end)
  emit('update:modelValue', newVal)
  emit('change', newVal)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + text.length, start + text.length)
  })
}

function insertLink() {
  const el = textareaRef.value
  if (!el || props.disabled || props.readonly) return
  const { selected } = getSelection()
  if (selected) {
    replaceSelection('[', '](url)', '')
  } else {
    replaceSelection('[', '](url)', '链接文本')
  }
}

function insertTable() {
  const table = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n'
  insertAtCursor(table)
}

// ===== Image upload =====

function triggerFileInput() {
  if (props.disabled || props.readonly) return
  fileInputRef.value?.click()
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (files) {
    handleFiles(Array.from(files))
  }
  input.value = ''
}

function onPaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  const imageFiles: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) imageFiles.push(file)
    }
  }

  if (imageFiles.length > 0) {
    e.preventDefault()
    handleFiles(imageFiles)
  }
}

function onDragOver() {
  if (props.disabled || props.readonly) return
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  if (props.disabled || props.readonly) return

  const files: File[] = []
  if (e.dataTransfer?.files) {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const f = e.dataTransfer.files[i]
      if (f.type.startsWith('image/')) {
        files.push(f)
      }
    }
  }
  if (files.length > 0) {
    handleFiles(files)
  }
}

async function handleFiles(files: File[]) {
  for (const file of files) {
    await uploadAndInsert(file)
  }
}

async function uploadAndInsert(file: File) {
  const placeholder = `![上传中...${file.name}]()`
  const el = textareaRef.value
  if (!el) return

  // Insert placeholder
  const { start } = getSelection()
  const cursorPos = start + placeholder.length
  const newVal = props.modelValue.substring(0, start) + placeholder + props.modelValue.substring(start)
  emit('update:modelValue', newVal)
  emit('change', newVal)
  await nextTick()
  el.setSelectionRange(cursorPos, cursorPos)

  isUploading.value = true
  try {
    let url: string

    if (props.uploadFn) {
      // Use custom upload function
      url = await props.uploadFn(file)
    } else {
      // Default: convert to base64 data URL
      url = await fileToDataUrl(file)
    }

    // Replace placeholder with actual image markdown
    const currentVal = props.modelValue
    const updatedVal = currentVal.replace(placeholder, `![${file.name}](${url})`)
    emit('update:modelValue', updatedVal)
    emit('change', updatedVal)
    emit('upload-success', { file, url })
  } catch (err) {
    // Replace placeholder with error text
    const currentVal = props.modelValue
    const updatedVal = currentVal.replace(placeholder, `<!-- 上传失败: ${file.name} -->`)
    emit('update:modelValue', updatedVal)
    emit('change', updatedVal)
    emit('upload-error', { file, error: err instanceof Error ? err : new Error(String(err)) })
  } finally {
    isUploading.value = false
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// ===== Watchers & Lifecycle =====

watch(() => props.viewModeProp, (val) => {
  viewMode.value = val
})

onMounted(() => {
  if (props.autofocus && textareaRef.value) {
    textareaRef.value.focus()
  }
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  textareaRef,
  getViewMode: () => viewMode.value,
  setViewMode: (mode: ViewMode) => { viewMode.value = mode },
  triggerUpload: triggerFileInput,
})
</script>

<style scoped>
.n-md-editor {
  --n-md-border: var(--n-color-border, #e0e0e6);
  --n-md-border-hover: var(--n-color-border-hover, #c2c2cc);
  --n-md-border-focus: var(--n-color-primary, #1677ff);
  --n-md-bg: var(--n-color-bg, #fff);
  --n-md-text: var(--n-color-text, #333);
  --n-md-text-secondary: var(--n-color-text-secondary, #888);
  --n-md-text-disabled: var(--n-color-text-disabled, #bbb);
  --n-md-toolbar-bg: var(--n-color-fill-light, #fafafa);
  --n-md-radius: var(--n-radius, 8px);
  --n-md-font-size: 14px;

  display: flex;
  flex-direction: column;
  border: 1px solid var(--n-md-border);
  border-radius: var(--n-md-radius);
  overflow: hidden;
  background: var(--n-md-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.n-md-editor--focused {
  border-color: var(--n-md-border-focus);
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.12);
}

.n-md-editor--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.n-md-editor--dragover {
  border-color: var(--n-md-border-focus);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.15);
}

/* ====== Toolbar ====== */
.n-md-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: var(--n-md-toolbar-bg);
  border-bottom: 1px solid var(--n-md-border);
  gap: 4px;
  flex-shrink: 0;
}

.n-md-editor__toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.n-md-editor__tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--n-md-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.n-md-editor__tool-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
  color: var(--n-md-text);
}

.n-md-editor__tool-btn:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
}

.n-md-editor__tool-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.n-md-editor__tool-btn--active {
  color: var(--n-md-border-focus);
  background: rgba(22, 119, 255, 0.08);
}

/* Upload spinner */
.n-md-editor__tool-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--n-md-border);
  border-top-color: var(--n-md-border-focus);
  border-radius: 50%;
  animation: n-md-spin 0.6s linear infinite;
}

@keyframes n-md-spin {
  to { transform: rotate(360deg); }
}

/* ====== Body ====== */
.n-md-editor__body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  height: v-bind(computedHeight);
}

/* ====== Editor pane ====== */
.n-md-editor__editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.n-md-editor__textarea {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--n-md-text);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  line-height: 1.7;
  box-sizing: border-box;
}

.n-md-editor__textarea::placeholder {
  color: var(--n-md-text-disabled);
}

.n-md-editor__textarea:disabled {
  cursor: not-allowed;
}

/* Count */
.n-md-editor__count {
  position: absolute;
  bottom: 6px;
  right: 12px;
  font-size: 12px;
  color: var(--n-md-text-disabled);
  pointer-events: none;
}

.n-md-editor__count--exceed {
  color: var(--n-color-danger, #ef4444);
}

/* ====== Drop overlay ====== */
.n-md-editor__drop-overlay {
  position: absolute;
  inset: 0;
  background: rgba(22, 119, 255, 0.06);
  border: 2px dashed var(--n-md-border-focus);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.n-md-editor__drop-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--n-md-border-focus);
  font-size: 14px;
  font-weight: 500;
}

/* ====== Divider ====== */
.n-md-editor__divider {
  width: 1px;
  background: var(--n-md-border);
  flex-shrink: 0;
}

/* ====== Preview pane ====== */
.n-md-editor__preview {
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
  min-width: 0;
  background: var(--n-md-bg);
}

.n-md-editor__preview-content {
  color: var(--n-md-text);
  font-size: var(--n-md-font-size);
  line-height: 1.7;
  word-wrap: break-word;
}

/* Preview typography */
.n-md-editor__preview-content :deep(h1) {
  font-size: 1.8em;
  font-weight: 700;
  margin: 0.6em 0 0.4em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--n-md-border);
}

.n-md-editor__preview-content :deep(h2) {
  font-size: 1.4em;
  font-weight: 600;
  margin: 1em 0 0.4em;
  padding-bottom: 0.2em;
  border-bottom: 1px solid var(--n-md-border);
}

.n-md-editor__preview-content :deep(h3) {
  font-size: 1.2em;
  font-weight: 600;
  margin: 0.8em 0 0.3em;
}

.n-md-editor__preview-content :deep(h4),
.n-md-editor__preview-content :deep(h5),
.n-md-editor__preview-content :deep(h6) {
  font-size: 1em;
  font-weight: 600;
  margin: 0.6em 0 0.3em;
}

.n-md-editor__preview-content :deep(p) {
  margin: 0.6em 0;
}

.n-md-editor__preview-content :deep(a) {
  color: var(--n-md-border-focus);
  text-decoration: none;
}

.n-md-editor__preview-content :deep(a:hover) {
  text-decoration: underline;
}

.n-md-editor__preview-content :deep(strong) {
  font-weight: 600;
}

.n-md-editor__preview-content :deep(em) {
  font-style: italic;
}

.n-md-editor__preview-content :deep(del) {
  text-decoration: line-through;
  color: var(--n-md-text-secondary);
}

.n-md-editor__preview-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.9em;
  color: #d63384;
}

.n-md-editor__preview-content :deep(pre) {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.n-md-editor__preview-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: 13px;
  line-height: 1.6;
}

.n-md-editor__preview-content :deep(blockquote) {
  border-left: 4px solid var(--n-md-border-focus);
  padding: 8px 16px;
  margin: 1em 0;
  color: var(--n-md-text-secondary);
  background: rgba(22, 119, 255, 0.04);
  border-radius: 0 8px 8px 0;
}

.n-md-editor__preview-content :deep(ul),
.n-md-editor__preview-content :deep(ol) {
  padding-left: 2em;
  margin: 0.5em 0;
}

.n-md-editor__preview-content :deep(li) {
  margin: 0.25em 0;
}

.n-md-editor__preview-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.n-md-editor__preview-content :deep(th),
.n-md-editor__preview-content :deep(td) {
  border: 1px solid var(--n-md-border);
  padding: 8px 12px;
  text-align: left;
}

.n-md-editor__preview-content :deep(th) {
  background: var(--n-md-toolbar-bg);
  font-weight: 600;
}

.n-md-editor__preview-content :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}

.n-md-editor__preview-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--n-md-border);
  margin: 1.5em 0;
}

/* GFM task list */
.n-md-editor__preview-content :deep(input[type="checkbox"]) {
  margin-right: 6px;
}
</style>
