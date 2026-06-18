<template>
  <div class="doc-page">
    <h1>快速开始</h1>
    <p class="doc-page__desc">NacrDesign 是一个基于 Nuxt 3/4 的 Vue 3 组件库，通过 Nuxt Module 方式集成，享受自动导入与 SSR 支持。</p>

    <h2>安装</h2>
    <p>使用你喜欢的包管理器安装 NacrDesign：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">bash</span>
        <button class="code-block__copy" @click="copy('install')">
          <svg v-if="!copied['install']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['install'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="installHtml"></div>
    </div>

    <h2>注册模块</h2>
    <p>将 NacrDesign 添加到你的 Nuxt 项目模块列表中：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">ts</span>
        <button class="code-block__copy" @click="copy('config')">
          <svg v-if="!copied['config']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['config'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="configHtml"></div>
    </div>

    <h2>使用组件</h2>
    <p>注册模块后，所有组件和 Composable 均可自动导入，无需手动 import：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">vue</span>
        <button class="code-block__copy" @click="copy('usage')">
          <svg v-if="!copied['usage']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['usage'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="usageHtml"></div>
    </div>

    <h2>模块配置</h2>
    <p>在 <code>nuxt.config.ts</code> 中自定义模块行为：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">ts</span>
        <button class="code-block__copy" @click="copy(optionsCode)">
          <svg v-if="!copied['options']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['options'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="optionsHtml"></div>
    </div>

    <ApiTable title="Module Options" :columns="optionColumns" :data="optionData" />

    <h2>Iconfont 图标</h2>
    <p>如需使用内置图标组件，前往 <a href="https://www.iconfont.cn" target="_blank" rel="noopener">iconfont.cn</a> 创建项目，选择 Symbol 模式获取 JS 链接后配置：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">ts</span>
        <button class="code-block__copy" @click="copy(iconCode)">
          <svg v-if="!copied['icon']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['icon'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="iconHtml"></div>
    </div>

    <h2>Composables</h2>
    <p>以下组合式函数同样自动导入，无需手动 import：</p>
    <div class="code-block">
      <div class="code-block__header">
        <span class="code-block__lang">ts</span>
        <button class="code-block__copy" @click="copy('composable')">
          <svg v-if="!copied['composable']" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ copied['composable'] ? '已复制' : '复制' }}
        </button>
      </div>
      <div class="code-block__body" v-html="composableHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'

definePageMeta({ layout: 'doc' })

useDocSeo({
  title: '快速开始 - Nacr Design',
  description: '一分钟集成 Nacr Design 到 Nuxt 项目，支持 npm/pnpm/yarn 安装，组件和 Composables 自动导入。',
  keywords: ['安装', '快速开始', '配置', '使用指南'],
})

/* ---- 代码片段 ---- */
const installCode = `# npm
npm install nacr-design

# pnpm
pnpm add nacr-design

# yarn
yarn add nacr-design`

const configCode = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nacr-design'],

  nacrDesign: {
    prefix: 'N',       // 组件前缀，默认 'N'
    global: true,       // 是否全局注册，默认 true
  },
})`

const usageCode = `<template>
  <NButton variant="primary">点击我</NButton>
  <NInput v-model="value" label="输入框" />
  <NCard title="卡片">内容</NCard>
</template>

<script setup lang="ts">
// 组件自动导入，无需 import
// Composable 也自动导入
const { state, toggle } = useToggle()
const { loading, withLoading } = useLoading()
const message = useMessage()
<\/script>`

const optionsCode = `// nuxt.config.ts
nacrDesign: {
  prefix: 'N',             // 组件前缀，如 NButton
  global: true,             // 是否全局注册所有组件
  iconfontUrl: '',          // iconfont Symbol 模式 JS 链接
}`

const iconCode = `// nuxt.config.ts
nacrDesign: {
  iconfontUrl: '//at.alicdn.com/t/c/xxxxx.js',
}

// 页面中使用
<template>
  <NIcon name="home" :size="24" />
</template>`

const composableCode = `// 状态切换
const { state, toggle } = useToggle(initialValue?)

// 加载控制
const { loading, withLoading } = useLoading()

// 全局消息
const message = useMessage()
message.success('操作成功')

// 通知提醒
const notification = useNotification()

// 图标名称列表
const icons = useIconNames()

// ECharts 封装
const { setOption, resize } = useChart(elRef, option?)`

/* ---- 语法高亮 ---- */
const installHtml = ref('')
const configHtml = ref('')
const usageHtml = ref('')
const optionsHtml = ref('')
const iconHtml = ref('')
const composableHtml = ref('')

onMounted(async () => {
  const theme = 'github-dark-default'
  const fallback = (code: string) =>
    `<pre style="margin:0;padding:16px;color:#e1e4e8;background:#0d1117;font-size:13px;line-height:1.6;overflow-x:auto;"><code>${escapeHtml(code)}</code></pre>`

  try { installHtml.value = await codeToHtml(installCode, { lang: 'bash', theme }) } catch { installHtml.value = fallback(installCode) }
  try { configHtml.value = await codeToHtml(configCode, { lang: 'typescript', theme }) } catch { configHtml.value = fallback(configCode) }
  try { usageHtml.value = await codeToHtml(usageCode, { lang: 'vue', theme }) } catch { usageHtml.value = fallback(usageCode) }
  try { optionsHtml.value = await codeToHtml(optionsCode, { lang: 'typescript', theme }) } catch { optionsHtml.value = fallback(optionsCode) }
  try { iconHtml.value = await codeToHtml(iconCode, { lang: 'typescript', theme }) } catch { iconHtml.value = fallback(iconCode) }
  try { composableHtml.value = await codeToHtml(composableCode, { lang: 'typescript', theme }) } catch { composableHtml.value = fallback(composableCode) }
})

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* ---- 复制功能 ---- */
const copied = ref<Record<string, boolean>>({})

const codeMap: Record<string, string> = {
  install: installCode,
  config: configCode,
  usage: usageCode,
  options: optionsCode,
  icon: iconCode,
  composable: composableCode,
}

function copy(key: string) {
  const text = codeMap[key]
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copied.value[key] = true
    setTimeout(() => { copied.value[key] = false }, 2000)
  })
}

/* ---- API 表格 ---- */
const optionColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const optionData = [
  { name: 'prefix', type: 'string', default: "'N'", desc: '组件前缀，如 NButton' },
  { name: 'global', type: 'boolean', default: 'true', desc: '是否全局注册所有组件' },
  { name: 'iconfontUrl', type: 'string', default: "''", desc: 'iconfont Symbol 模式的 JS 链接' },
]
</script>

<style scoped>
.doc-page h2 {
  margin-top: 36px;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--nd-color-text);
  scroll-margin-top: 80px;
}

.doc-page h2:first-of-type {
  margin-top: 24px;
}

.doc-page p {
  margin-bottom: 14px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--nd-color-text-secondary);
}

.doc-page code {
  padding: 2px 6px;
  background: var(--nd-color-bg-sunken);
  border-radius: 4px;
  font-size: 13px;
  color: var(--nd-color-primary);
}

.doc-page a {
  color: var(--nd-color-primary);
  text-decoration: none;
}

.doc-page a:hover {
  text-decoration: underline;
}

.code-block {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--nd-color-border);
  background: #0d1117;
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}

.code-block__lang {
  font-size: 12px;
  color: #8b949e;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-block__copy {
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

.code-block__copy:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #c9d1d9;
}

.code-block__body {
  overflow-x: auto;
}

.code-block__body :deep(pre) {
  margin: 0 !important;
  padding: 16px !important;
  background: transparent !important;
  border-radius: 0 !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}

.code-block__body :deep(code) {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
}
</style>
