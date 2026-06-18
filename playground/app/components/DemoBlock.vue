<template>
  <div class="demo-block">
    <div class="demo-block__title" v-if="title">{{ title }}</div>
    <div class="demo-block__description" v-if="description">{{ description }}</div>
    <div class="demo-block__preview">
      <slot />
    </div>
    <div class="demo-block__code" v-if="code" v-show="showCode">
      <div class="demo-block__code-header">
        <span class="demo-block__code-lang">Vue</span>
        <div class="demo-block__code-actions">
          <button class="demo-block__code-btn" @click="copyCode" :title="copied ? '已复制' : '复制代码'">
            <svg v-if="!copied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
      </div>
      <div class="demo-block__code-body" v-html="highlightedCode"></div>
    </div>
    <div class="demo-block__actions" v-if="code">
      <button class="demo-block__toggle" @click="showCode = !showCode">
        <svg v-if="!showCode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        {{ showCode ? '收起代码' : '查看代码' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'

const props = defineProps<{
  title?: string
  description?: string
  code?: string
}>()

const showCode = ref(false)
const copied = ref(false)

const highlightedCode = ref('')

watchEffect(async () => {
  if (props.code && showCode.value && !highlightedCode.value) {
    try {
      highlightedCode.value = await codeToHtml(props.code, {
        lang: 'vue',
        theme: 'github-dark-default',
      })
    } catch {
      highlightedCode.value = `<pre style="margin:0;padding:16px;color:#e1e4e8;background:#0d1117;font-size:13px;line-height:1.6;overflow-x:auto;border-radius:0 0 8px 8px;"><code>${escapeHtml(props.code)}</code></pre>`
    }
  }
})

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function copyCode() {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.code
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
</script>

<style scoped>
.demo-block {
  margin: 24px 0;
  border: 1px solid var(--nd-color-border);
  border-radius: var(--nd-radius);
  overflow: visible;
}

.demo-block__title {
  padding: 16px 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--nd-color-text);
}

.demo-block__description {
  padding: 8px 20px 0;
  font-size: 14px;
  color: var(--nd-color-text-secondary);
  line-height: 1.6;
}

.demo-block__preview {
  padding: 44px 40px;
  border-bottom: 1px solid var(--nd-color-border);
  position: relative;
  background-image: radial-gradient(circle, var(--nd-color-border) 1px, #ffffff 1px);
  background-size: 10px 10px;

}

.demo-block__code {
  background: #0d1117;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
  border-radius: 13px;
  width: calc(100% - 20px);
  margin: 10px;
}

.demo-block__code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}

.demo-block__code-lang {
  font-size: 12px;
  color: #8b949e;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-block__code-actions {
  display: flex;
  gap: 8px;
}

.demo-block__code-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: #8b949e;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-block__code-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #c9d1d9;
}

.demo-block__code-btn:active {
  background: rgba(255, 255, 255, 0.08);
}

.demo-block__code-body {
  overflow-x: auto;
}

.demo-block__code-body :deep(pre) {
  margin: 0 !important;
  padding: 16px !important;
  background: transparent !important;
  border-radius: 0 !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}

.demo-block__code-body :deep(code) {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}

.demo-block__actions {
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--nd-color-border);
}

.demo-block__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: none;
  color: var(--nd-color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--nd-transition);
  width: 100%;
  justify-content: center;
}

.demo-block__toggle:hover {
  color: var(--nd-color-primary);
}
</style>
