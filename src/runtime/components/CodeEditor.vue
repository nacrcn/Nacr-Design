<template>
  <div
    :class="[
      'n-code-editor',
      `n-code-editor--${size}`,
      `n-code-editor--${variant}`,
      {
        'n-code-editor--disabled': disabled,
        'n-code-editor--readonly': readonly,
        'n-code-editor--focused': focused,
        'n-code-editor--dragover': isDragOver,
      },
    ]"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- Header bar: language badge + tools -->
    <div v-if="showHeader" class="n-code-editor__header">
      <span class="n-code-editor__lang-badge">{{ languageLabel }}</span>
      <div class="n-code-editor__header-actions">
        <button v-if="!readonly && !disabled" class="n-code-editor__header-btn" title="格式化" @click="formatCode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button class="n-code-editor__header-btn" title="复制代码" @click="copyCode">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
        <button v-if="collapsible" class="n-code-editor__header-btn" :title="collapsed ? '展开' : '折叠'" @click="collapsed = !collapsed">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="collapsed" points="6 9 12 15 18 9" />
            <polyline v-else points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor body -->
    <div v-show="!collapsed" class="n-code-editor__body">
      <!-- Line numbers -->
      <div v-if="showLineNumbers" ref="lineNumbersRef" class="n-code-editor__lines" @mousedown.prevent>
        <div v-for="n in lineCount" :key="n" class="n-code-editor__line-num" :class="{ 'n-code-editor__line-num--active': n === activeLine }">
          {{ n }}
        </div>
      </div>

      <!-- Code area: highlight layer + textarea overlay -->
      <div class="n-code-editor__code-wrap">
        <pre class="n-code-editor__highlight" aria-hidden="true" v-html="highlightedCode"></pre>
        <textarea
          ref="textareaRef"
          class="n-code-editor__textarea"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly || disabled"
          :autofocus="autofocus"
          :spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          @scroll="syncScroll"
          @click="updateActiveLine"
          @keyup="updateActiveLine"
        ></textarea>
      </div>
    </div>

    <!-- Footer: cursor info / word count -->
    <div v-if="showFooter" class="n-code-editor__footer">
      <span class="n-code-editor__cursor-info">行 {{ cursorLine }}, 列 {{ cursorCol }}</span>
      <span v-if="showCount" class="n-code-editor__count" :class="{ 'n-code-editor__count--exceed': !!maxlength && currentLength > maxlength }">
        {{ currentLength }}{{ maxlength ? ` / ${maxlength}` : '' }} 字符
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { codeToHtml } from 'shiki'

interface Props {
  modelValue?: string
  language?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'bordered' | 'filled'
  showLineNumbers?: boolean
  showHeader?: boolean
  showFooter?: boolean
  showCount?: boolean
  collapsible?: boolean
  height?: string | number
  maxlength?: number
  autofocus?: boolean
  tabSize?: number
  insertSpaces?: boolean
  theme?: 'dark' | 'light'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  placeholder: '请输入代码...',
  disabled: false,
  readonly: false,
  size: 'md',
  variant: 'default',
  showLineNumbers: true,
  showHeader: true,
  showFooter: false,
  showCount: false,
  collapsible: false,
  height: 300,
  autofocus: false,
  tabSize: 2,
  insertSpaces: true,
  theme: 'dark',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const lineNumbersRef = ref<HTMLElement>()
const focused = ref(false)
const copied = ref(false)
const collapsed = ref(false)
const isDragOver = ref(false)
const activeLine = ref(1)
const cursorLine = ref(1)
const cursorCol = ref(1)
const highlightedCode = ref('')

// Computed
const lineCount = computed(() => {
  const text = props.modelValue || ''
  return text.split('\n').length
})

const currentLength = computed(() => (props.modelValue || '').length)

const languageLabel = computed(() => {
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    python: 'Python',
    java: 'Java',
    vue: 'Vue',
    jsx: 'JSX',
    tsx: 'TSX',
    sql: 'SQL',
    bash: 'Bash',
    shell: 'Shell',
    markdown: 'Markdown',
    xml: 'XML',
    yaml: 'YAML',
    rust: 'Rust',
    go: 'Go',
    cpp: 'C++',
    c: 'C',
  }
  return labels[props.language] || props.language.toUpperCase()
})

// Syntax highlighting
const shikiTheme = computed(() =>
  props.theme === 'light' ? 'github-light-default' : 'github-dark-default'
)

async function highlightCode() {
  if (!props.modelValue) {
    highlightedCode.value = '\n'
    return
  }
  try {
    const html = await codeToHtml(props.modelValue, {
      lang: props.language as any,
      theme: shikiTheme.value,
    })
    // Extract <pre> inner content — strip outer <pre> and <code> tags
    // Remove style/class attrs from <pre> and <code> to prevent layout shifts
    let content = html
      .replace(/<pre[^>]*>/, '')
      .replace(/<\/pre>/, '')
      .replace(/<code[^>]*>/, '')
      .replace(/<\/code>/, '')
    highlightedCode.value = content
  } catch {
    highlightedCode.value = escapeHtml(props.modelValue)
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
}

// Debounce highlighting
let highlightTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => props.modelValue,
  () => {
    if (highlightTimer) clearTimeout(highlightTimer)
    highlightTimer = setTimeout(highlightCode, 150)
  },
  { immediate: true }
)

watch(() => props.language, highlightCode)
watch(() => props.theme, highlightCode)

// Input handling
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

// Keyboard handling: Tab, auto-close brackets
function handleKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return

  const ta = textareaRef.value
  if (!ta) return

  // Tab key
  if (e.key === 'Tab') {
    e.preventDefault()
    const indent = props.insertSpaces ? ' '.repeat(props.tabSize) : '\t'
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const val = ta.value

    if (e.shiftKey) {
      // Outdent
      const lineStart = val.lastIndexOf('\n', start - 1) + 1
      const lineText = val.slice(lineStart, end)
      const outdented = lineText.replace(
        new RegExp(`^(\t| {1,${props.tabSize}})`, 'gm'),
        ''
      )
      const diff = lineText.length - outdented.length
      if (diff > 0) {
        ta.value = val.slice(0, lineStart) + outdented + val.slice(end)
        ta.selectionStart = Math.max(lineStart, start - diff)
        ta.selectionEnd = end - diff
        emit('update:modelValue', ta.value)
        emit('change', ta.value)
      }
    } else {
      // Indent
      ta.value = val.slice(0, start) + indent + val.slice(end)
      ta.selectionStart = ta.selectionEnd = start + indent.length
      emit('update:modelValue', ta.value)
      emit('change', ta.value)
    }
    return
  }

  // Auto-close brackets & quotes
  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"': '"',
    "'": "'",
    '`': '`',
  }

  if (pairs[e.key]) {
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const val = ta.value
    const selected = val.slice(start, end)

    if (selected.length > 0) {
      // Wrap selection
      e.preventDefault()
      ta.value = val.slice(0, start) + e.key + selected + pairs[e.key] + val.slice(end)
      ta.selectionStart = start + 1
      ta.selectionEnd = end + 1
      emit('update:modelValue', ta.value)
      emit('change', ta.value)
      return
    }

    // Skip closing char if next char matches
    if (e.key in { ')': 1, ']': 1, '}': 1 } && val[end] === e.key) {
      e.preventDefault()
      ta.selectionStart = ta.selectionEnd = end + 1
      return
    }

    // Auto-close
    if (e.key in pairs && start === end) {
      e.preventDefault()
      const closing = pairs[e.key]
      ta.value = val.slice(0, start) + e.key + closing + val.slice(end)
      ta.selectionStart = ta.selectionEnd = start + 1
      emit('update:modelValue', ta.value)
      emit('change', ta.value)
      return
    }
  }

  // Enter: auto-indent
  if (e.key === 'Enter') {
    const start = ta.selectionStart
    const val = ta.value
    const lineStart = val.lastIndexOf('\n', start - 1) + 1
    const currentLine = val.slice(lineStart, start)
    const indentMatch = currentLine.match(/^(\s*)/)
    const indent = indentMatch ? indentMatch[1] : ''

    // Extra indent after { or :
    const lastChar = val.slice(0, start).trimEnd().slice(-1)
    let extraIndent = ''
    if (lastChar === '{' || lastChar === ':') {
      extraIndent = props.insertSpaces ? ' '.repeat(props.tabSize) : '\t'
    }

    if (indent || extraIndent) {
      e.preventDefault()
      const insertStr = '\n' + indent + extraIndent
      ta.value = val.slice(0, start) + insertStr + val.slice(start)
      ta.selectionStart = ta.selectionEnd = start + insertStr.length
      emit('update:modelValue', ta.value)
      emit('change', ta.value)
    }
  }
}

// Scroll sync
function syncScroll() {
  const ta = textareaRef.value
  const lines = lineNumbersRef.value
  const pre = ta?.parentElement?.querySelector('.n-code-editor__highlight') as HTMLElement
  if (ta) {
    if (lines) lines.scrollTop = ta.scrollTop
    if (pre) {
      pre.scrollTop = ta.scrollTop
      pre.scrollLeft = ta.scrollLeft
    }
  }
}

// Cursor info
function updateActiveLine() {
  const ta = textareaRef.value
  if (!ta) return
  const pos = ta.selectionStart
  const text = ta.value.slice(0, pos)
  const lines = text.split('\n')
  cursorLine.value = lines.length
  cursorCol.value = lines[lines.length - 1].length + 1
  activeLine.value = lines.length
}

// Copy
async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.modelValue || '')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.modelValue || ''
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// Format (basic: trim trailing whitespace, normalize line endings)
function formatCode() {
  let code = props.modelValue || ''
  code = code.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '')
  emit('update:modelValue', code)
  emit('change', code)
}

// Drag & drop file
function onDragOver() {
  if (!props.disabled && !props.readonly) isDragOver.value = true
}
function onDragLeave() {
  isDragOver.value = false
}
function onDrop(e: DragEvent) {
  isDragOver.value = false
  if (props.disabled || props.readonly) return
  const file = e.dataTransfer?.files?.[0]
  if (file && file.size < 100_000) {
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      emit('update:modelValue', content)
      emit('change', content)
    }
    reader.readAsText(file)
  }
}

// Expose methods
function focus() { textareaRef.value?.focus() }
function blur() { textareaRef.value?.blur() }
function getEditor() { return textareaRef.value }

defineExpose({ focus, blur, getEditor })

onMounted(() => {
  if (props.autofocus) {
    nextTick(() => textareaRef.value?.focus())
  }
})
</script>

<style scoped>
.n-code-editor {
  display: flex;
  flex-direction: column;
  border-radius: var(--n-radius-lg, 8px);
  overflow: hidden;
  background: #0d1117;
  border: 1px solid #30363d;
  transition: border-color var(--n-transition-normal, 0.2s ease), box-shadow var(--n-transition-normal, 0.2s ease);
}

.n-code-editor--bordered {
  border: 2px solid #30363d;
}

.n-code-editor--filled {
  background: #161b22;
  border-color: #21262d;
}

.n-code-editor--focused {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.n-code-editor--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.n-code-editor--readonly .n-code-editor__textarea {
  caret-color: transparent;
}

/* Sizes */
.n-code-editor--sm .n-code-editor__textarea,
.n-code-editor--sm .n-code-editor__highlight {
  font-size: 12px;
  line-height: 1.55;
}
.n-code-editor--sm .n-code-editor__line-num {
  font-size: 11px;
  line-height: 1.55;
  min-width: 32px;
}

.n-code-editor--md .n-code-editor__textarea,
.n-code-editor--md .n-code-editor__highlight {
  font-size: 13px;
  line-height: 1.6;
}
.n-code-editor--md .n-code-editor__line-num {
  font-size: 12px;
  line-height: 1.6;
  min-width: 38px;
}

.n-code-editor--lg .n-code-editor__textarea,
.n-code-editor--lg .n-code-editor__highlight {
  font-size: 14px;
  line-height: 1.65;
}
.n-code-editor--lg .n-code-editor__line-num {
  font-size: 13px;
  line-height: 1.65;
  min-width: 42px;
}

/* ===== Header ===== */
.n-code-editor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
  user-select: none;
}

.n-code-editor__lang-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #8b949e;
  background: rgba(110, 118, 129, 0.15);
  border-radius: 4px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.n-code-editor__header-actions {
  display: flex;
  gap: 4px;
}

.n-code-editor__header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #8b949e;
  cursor: pointer;
  transition: all 0.15s ease;
}

.n-code-editor__header-btn:hover {
  background: rgba(110, 118, 129, 0.15);
  color: #c9d1d9;
}

.n-code-editor__header-btn:active {
  background: rgba(110, 118, 129, 0.25);
}

/* ===== Body ===== */
.n-code-editor__body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ===== Line numbers ===== */
.n-code-editor__lines {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  background: #0d1117;
  border-right: 1px solid #21262d;
  overflow: hidden;
  flex-shrink: 0;
  user-select: none;
}

.n-code-editor__line-num {
  padding: 0 8px 0 12px;
  text-align: right;
  color: #484f58;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
  transition: color 0.1s ease;
}

.n-code-editor__line-num--active {
  color: #c9d1d9;
}

/* ===== Code wrap ===== */
.n-code-editor__code-wrap {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.n-code-editor__highlight,
.n-code-editor__textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 12px 16px;
  margin: 0;
  border: none;
  outline: none;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: normal;
  word-spacing: normal;
  white-space: pre;
  word-wrap: normal;
  overflow: auto;
  tab-size: 2;
  -moz-tab-size: 2;
  font-variant-ligatures: none;
  font-feature-settings: normal;
}

.n-code-editor__highlight {
  pointer-events: none;
  z-index: 0;
  color: #c9d1d9;
  background: transparent;
  scrollbar-gutter: stable;
}

.n-code-editor__textarea {
  z-index: 1;
  color: transparent;
  caret-color: #58a6ff;
  background: transparent;
  resize: none;
  -webkit-text-fill-color: transparent;
  scrollbar-gutter: stable;
}

.n-code-editor__textarea::placeholder {
  color: #484f58;
  -webkit-text-fill-color: #484f58;
}

.n-code-editor__textarea::selection {
  background: rgba(56, 139, 253, 0.25);
  -webkit-text-fill-color: transparent;
}

/* ===== Footer ===== */
.n-code-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background: #161b22;
  border-top: 1px solid #21262d;
  font-size: 11px;
  color: #484f58;
  user-select: none;
}

.n-code-editor__cursor-info {
  font-family: 'SFMono-Regular', 'Consolas', monospace;
}

.n-code-editor__count {
  font-family: 'SFMono-Regular', 'Consolas', monospace;
}

.n-code-editor__count--exceed {
  color: #f85149;
}

/* ===== Drag overlay ===== */
.n-code-editor--dragover::after {
  content: '释放以插入文件内容';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(56, 139, 253, 0.08);
  border: 2px dashed #388bfd;
  border-radius: var(--n-radius-lg, 8px);
  color: #58a6ff;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
}
</style>
