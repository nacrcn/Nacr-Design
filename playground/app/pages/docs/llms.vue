<template>
  <div class="doc-page">
    <h1>llms.txt</h1>
    <p class="doc-page__desc">
      <code>llms.txt</code> 是一种面向大语言模型（LLM）的文档规范文件，以 Markdown 格式提供组件库的完整 API 参考，使 AI 编码助手能够准确理解和使用 NacrDesign 组件。
    </p>

    <DemoBlock title="什么是 llms.txt" description="llms.txt 是社区提议的一种标准，放置在网站根路径下，供 AI 工具自动检索项目文档。" :code="whatCode">
      <div class="info-card">
        <h3 style="margin:0 0 12px;font-size:16px;">核心价值</h3>
        <ul style="margin:0;padding-left:20px;line-height:2;">
          <li>AI 助手无需手动配置即可获取组件 API</li>
          <li>结构化 Markdown 格式，LLM 解析率高</li>
          <li>包含所有组件的 Props、Events、Slots、Methods</li>
          <li>与文档站同步更新，始终保持最新</li>
        </ul>
      </div>
    </DemoBlock>

    <DemoBlock title="访问地址" description="部署后可通过以下地址访问：" :code="urlCode">
      <div class="info-card">
        <NSpace vertical>
          <div>
            <span style="color:var(--n-color-text-secondary);">在线地址：</span>
            <a :href="siteUrl + '/llms.txt'" target="_blank" class="doc-link">{{ siteUrl }}/llms.txt</a>
          </div>
          <div>
            <span style="color:var(--n-color-text-secondary);">本地开发：</span>
            <code style="padding:2px 8px;background:var(--n-color-fill);border-radius:4px;font-size:13px;">http://localhost:3001/llms.txt</code>
          </div>
        </NSpace>
      </div>
    </DemoBlock>

    <DemoBlock title="如何在 AI 工具中使用" description="主流 AI 编码工具都支持 llms.txt 规范，以下是几种常用方式：" :code="usageCode">
      <div class="usage-grid">
        <div class="usage-item">
          <h4>Cursor / Claude Code</h4>
          <p>在项目根目录创建 <code>.cursorrules</code> 或 <code>CLAUDE.md</code>，添加：</p>
          <pre class="code-block">当用户提到 NacrDesign 组件时，请先查阅 https://design.nacr.cn/llms.txt 获取最新 API 文档。</pre>
        </div>
        <div class="usage-item">
          <h4>CodeBuddy</h4>
          <p>在工作区内直接引用 <code>llms.txt</code> 文件，AI 会自动读取组件 API。</p>
        </div>
        <div class="usage-item">
          <h4>ChatGPT / 通用 AI</h4>
          <p>在对话中粘贴 <code>llms.txt</code> 内容或提供 URL，让 AI 加载为上下文。</p>
        </div>
        <div class="usage-item">
          <h4>VS Code Copilot</h4>
          <p>在 <code>.github/copilot-instructions.md</code> 中引用 <code>llms.txt</code> URL。</p>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="文件内容结构" description="llms.txt 包含以下章节：" :code="structureCode">
      <div class="structure-list">
        <div v-for="item in sections" :key="item.title" class="structure-item">
          <span class="structure-item__icon">{{ item.icon }}</span>
          <div>
            <strong>{{ item.title }}</strong>
            <p style="margin:2px 0 0;color:var(--n-color-text-secondary);font-size:13px;">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="托管配置" description="llms.txt 已通过 Nuxt 的 public 目录自动托管到站点根路径，无需额外配置。" :code="hostCode">
      <div class="info-card">
        <h3 style="margin:0 0 8px;font-size:15px;">实现方式</h3>
        <p style="margin:0;color:var(--n-color-text-secondary);font-size:13px;line-height:1.8;">
          文件放置在 <code>playground/public/llms.txt</code>，Nuxt 会自动将其作为静态资源托管到 <code>/llms.txt</code> 路径。
          部署后 AI 工具即可通过 <code>https://design.nacr.cn/llms.txt</code> 检索到完整的组件 API 文档。
        </p>
      </div>
    </DemoBlock>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://design.nacr.cn'

const sections = [
  { icon: '📦', title: '安装与引入', desc: 'nacr-design 模块安装、自动导入说明' },
  { icon: '📋', title: '组件 API', desc: '85+ 组件的 Props、Events、Slots、Methods' },
  { icon: '🎨', title: 'CSS Variables', desc: '全局设计令牌和 CSS 自定义属性' },
]

const whatCode = `# llms.txt 规范
# https://llmstxt.org/

> NacrDesign 面向 AI 的完整 API 参考文档`

const urlCode = `# 在线访问
https://design.nacr.cn/llms.txt

# 本地开发
http://localhost:3001/llms.txt`

const usageCode = `# .cursorrules / CLAUDE.md
当用户提到 NacrDesign 组件时，
请先查阅 https://design.nacr.cn/llms.txt 获取最新 API 文档。`

const structureCode = `# llms.txt 内容结构
- 安装与引入
- 组件 API（Props / Events / Slots / Methods）
- CSS Variables（设计令牌）`

const hostCode = `# playground/public/llms.txt
# Nuxt 自动托管 public 目录下的文件到根路径
# 访问 https://design.nacr.cn/llms.txt 即可获取`
</script>

<style scoped>
.info-card {
  padding: 20px 24px;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg, 8px);
}

.doc-link {
  color: var(--n-color-primary, #3b82f6);
  text-decoration: none;
}

.doc-link:hover {
  text-decoration: underline;
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.usage-item {
  padding: 16px 20px;
  background: var(--n-color-fill-quaternary, #f9fafb);
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-md, 6px);
}

.usage-item h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--n-color-text);
}

.usage-item p {
  margin: 0;
  font-size: 13px;
  color: var(--n-color-text-secondary);
  line-height: 1.6;
}

.code-block {
  margin: 8px 0 0;
  padding: 10px 14px;
  background: var(--n-color-bg-elevated, #1f2937);
  color: #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
}

.structure-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.structure-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: var(--n-color-fill-quaternary, #f9fafb);
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-md, 6px);
}

.structure-item__icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}
</style>
