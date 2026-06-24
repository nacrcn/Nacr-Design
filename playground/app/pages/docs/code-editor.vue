<template>
  <div class="doc-page">
    <h1>CodeEditor 代码编辑器</h1>
    <p class="doc-page__desc">提供代码编辑能力，支持多语言语法高亮（基于 Shiki）、行号显示、Tab 缩进、自动补全括号、文件拖拽等功能。</p>

    <DemoBlock title="基础用法" description="通过 v-model 双向绑定代码内容，language 指定语言。" :code="basicCode">
      <NCodeEditor v-model="basicVal" language="javascript" />
    </DemoBlock>

    <DemoBlock title="多语言支持" description="支持 JavaScript、TypeScript、HTML、CSS、JSON、Python、Vue 等多种语言高亮。" :code="langCode">
      <NSpace style="margin-bottom:12px">
        <NButton v-for="l in languages" :key="l.value" :variant="currentLang === l.value ? 'primary' : 'secondary'" size="sm" @click="switchLang(l.value)">{{ l.label }}</NButton>
      </NSpace>
      <NCodeEditor :key="currentLang" v-model="langVal" :language="currentLang" />
    </DemoBlock>

    <DemoBlock title="只读模式" description="设置 readonly 属性使编辑器只读，用户可查看和复制代码但不能编辑。" :code="readonlyCode">
      <NCodeEditor v-model="readonlyVal" language="html" readonly />
    </DemoBlock>

    <DemoBlock title="隐藏头部和行号" description="设置 show-header 为 false 隐藏顶部栏，show-line-numbers 为 false 隐藏行号。" :code="minimalCode">
      <NCodeEditor v-model="minimalVal" language="css" :show-header="false" :show-line-numbers="false" />
    </DemoBlock>

    <DemoBlock title="可折叠 & 底部信息" description="collapsible 允许折叠编辑器，show-footer 显示光标位置和字符数。" :code="footerCode">
      <NCodeEditor v-model="footerVal" language="python" collapsible show-footer show-count />
    </DemoBlock>

    <DemoBlock title="变体样式" description="default / bordered / filled 三种风格。" :code="variantCode">
      <NSpace style="margin-bottom:12px">
        <NButton v-for="v in (['default','bordered','filled'] as const)" :key="v" :variant="currentVariant === v ? 'primary' : 'secondary'" size="sm" @click="currentVariant = v">{{ {default:'默认',bordered:'边框',filled:'填充'}[v] }}</NButton>
      </NSpace>
      <NCodeEditor v-model="variantVal" language="typescript" :variant="currentVariant" />
    </DemoBlock>

    <DemoBlock title="自动补全括号 & 智能缩进" description="输入左括号自动补全右括号，回车自动缩进，支持 Tab / Shift+Tab 缩进/反缩进。" :code="autoCode">
      <NCodeEditor v-model="autoVal" language="javascript" />
    </DemoBlock>

    <DemoBlock title="文件拖拽" description="将文本文件直接拖入编辑器即可载入文件内容（限制 100KB 以内）。" :code="dropCode">
      <NCodeEditor v-model="dropVal" language="json" />
    </DemoBlock>

    <!-- API -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Python', value: 'python' },
  { label: 'Vue', value: 'vue' },
]
const _t = '<tem' + 'plate>'
const _te = '</tem' + 'plate>'

const codeSamples: Record<string, string> = {
  javascript: `// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log('Fibonacci:', result);`,
  typescript: `// TypeScript 示例
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
  html: `<!-- HTML 示例 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>NacrDesign</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>欢迎使用代码编辑器组件</p>
</body>
</html>`,
  css: `/* CSS 示例 */
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}`,
  json: `{
  "name": "nacr-design",
  "version": "0.1.8",
  "description": "Nuxt 3/4 UI Component Library",
  "dependencies": {
    "echarts": "^6.1.0",
    "marked": "^18.0.5"
  }
}`,
  python: `# Python 示例
from dataclasses import dataclass
from typing import List

@dataclass
class Student:
    name: str
    age: int
    grades: List[float]

    @property
    def average(self) -> float:
        return sum(self.grades) / len(self.grades)

students = [
    Student("Alice", 20, [90.0, 85.5, 92.0]),
    Student("Bob", 22, [78.0, 88.0, 95.0]),
]`,
  vue: `<!-- Vue SFC 示例 -->
` + _t + `
  <button class="btn" @click="count++">
    点击了 {{ count }} 次
  </button>
` + _te + `

` + '<scr' + 'ipt setup lang="ts">' + `
import { ref } from 'vue'
const count = ref(0)
` + '</scr' + 'ipt>' + `

` + '<sty' + 'le scoped>' + `
.btn {
  padding: 8px 16px;
  border-radius: 6px;
}
` + '</st' + 'yle>',
}

/* 基础用法 */
const basicVal = ref(codeSamples.javascript)
const _s = '<scr' + 'ipt setup lang="ts">'
const _se = '</scr' + 'ipt>'
const basicCode = _t + `
  <NCodeEditor v-model="code" language="javascript" />
` + _te + `

` + _s + `
import { ref } from 'vue'
const code = ref('console.log("Hello, World!")')
` + _se

/* 多语言 */
const currentLang = ref('javascript')
const langVal = ref(codeSamples.javascript)
function switchLang(lang: string) {
  currentLang.value = lang
  langVal.value = codeSamples[lang] || ''
}

const langCode = `${_t}
  <NCodeEditor v-model="code" language="typescript" />
${_te}`

/* 只读 */
const readonlyVal = ref(codeSamples.html)
const readonlyCode = `${_t}
  <NCodeEditor v-model="code" language="html" readonly />
${_te}`

/* 极简 */
const minimalVal = ref(codeSamples.css)
const minimalCode = `${_t}
  <NCodeEditor
    v-model="code"
    language="css"
    :show-header="false"
    :show-line-numbers="false"
  />
${_te}`

/* 折叠 & 底部栏 */
const footerVal = ref(codeSamples.python)
const footerCode = `${_t}
  <NCodeEditor
    v-model="code"
    language="python"
    collapsible
    show-footer
    show-count
  />
${_te}`

/* 变体 */
const currentVariant = ref<'default' | 'bordered' | 'filled'>('default')
const variantVal = ref(codeSamples.typescript)
const variantCode = `${_t}
  <NCodeEditor v-model="code" language="typescript" variant="bordered" />
${_te}`

/* 自动补全 */
const autoVal = ref(`// 输入 { 或 ( 试试自动补全
function add(a, b) {

}

const obj = {

}`)
const autoCode = `${_t}
  <NCodeEditor v-model="code" language="javascript" />
${_te}`

/* 拖拽 */
const dropVal = ref(codeSamples.json)
const dropCode = `${_t}
  <NCodeEditor v-model="code" language="json" />
${_te}`

/* API 表格 */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string', default: "''", desc: '代码内容，支持 v-model' },
  { name: 'language', type: 'string', default: "'javascript'", desc: '编程语言，用于语法高亮（js/ts/html/css/json/python/vue 等）' },
  { name: 'placeholder', type: 'string', default: "'请输入代码...'", desc: '占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '编辑器尺寸' },
  { name: 'variant', type: "'default' | 'bordered' | 'filled'", default: "'default'", desc: '外观变体' },
  { name: 'showLineNumbers', type: 'boolean', default: 'true', desc: '是否显示行号' },
  { name: 'showHeader', type: 'boolean', default: 'true', desc: '是否显示头部栏（语言标签 / 操作按钮）' },
  { name: 'showFooter', type: 'boolean', default: 'false', desc: '是否显示底部信息栏' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字符计数' },
  { name: 'collapsible', type: 'boolean', default: 'false', desc: '是否可折叠' },
  { name: 'height', type: 'string | number', default: '300', desc: '编辑区域高度，数字为 px' },
  { name: 'maxlength', type: 'number', default: '-', desc: '最大字符数' },
  { name: 'autofocus', type: 'boolean', default: 'false', desc: '是否自动聚焦' },
  { name: 'tabSize', type: 'number', default: '2', desc: 'Tab 缩进空格数' },
  { name: 'insertSpaces', type: 'boolean', default: 'true', desc: 'Tab 插入空格而非 \\t' },
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", desc: '编辑器主题' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '回调参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: string)', desc: '代码内容变化时触发' },
  { name: 'change', type: '(val: string)', desc: '代码内容变化时触发' },
  { name: 'focus', type: '(e: FocusEvent)', desc: '编辑器获得焦点时触发' },
  { name: 'blur', type: '(e: FocusEvent)', desc: '编辑器失去焦点时触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'focus', type: '()', desc: '聚焦编辑器' },
  { name: 'blur', type: '()', desc: '失焦编辑器' },
  { name: 'getEditor', type: '() => HTMLTextAreaElement', desc: '获取原生 textarea 元素' },
]
</script>
