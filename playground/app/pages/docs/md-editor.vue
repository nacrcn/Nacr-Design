<template>
  <div class="doc-page">
    <h1>Markdown 编辑器 & 渲染</h1>
    <p class="doc-page__desc">MdEditor 提供 Markdown 编辑能力（工具栏、分屏预览、快捷键），MdRender 用于纯渲染展示 Markdown 文档内容。底层基于 <a href="https://marked.js.org" target="_blank" rel="noopener">marked</a> 解析，完整支持 GFM 语法。</p>

    <!-- MdEditor 部分 -->
    <h2 id="mdeditor-markdown-编辑器" style="margin-top:40px;font-size:20px;font-weight:600;">MdEditor Markdown 编辑器</h2>

    <DemoBlock title="基础用法" description="通过 v-model 双向绑定 Markdown 内容，默认分屏模式。" :code="basicCode">
      <NMdEditor v-model="basicVal" />
      <div style="margin-top:12px;font-size:13px;color:var(--nd-color-text-secondary);">当前内容长度：{{ basicVal.length }}</div>
    </DemoBlock>

    <DemoBlock title="视图模式" description="view-mode-prop 切换编辑 / 分屏 / 预览三种视图。" :code="viewModeCode">
      <NSpace style="margin-bottom:12px">
        <NButton v-for="m in (['edit','split','preview'] as const)" :key="m" :type="viewModeVal===m?'primary':'default'" size="sm" @click="viewMode=m">{{ {edit:'编辑',split:'分屏',preview:'预览'}[m] }}</NButton>
      </NSpace>
      <NMdEditor v-model="viewModeVal" :view-mode-prop="viewMode" />
    </DemoBlock>

    <DemoBlock title="禁用与只读" description="disabled 禁止交互，readonly 仅可阅读不可编辑。" :code="disabledCode">
      <NSpace style="margin-bottom:12px">
        <NButton :type="disableMode==='disabled'?'primary':'default'" size="sm" @click="disableMode='disabled'">禁用</NButton>
        <NButton :type="disableMode==='readonly'?'primary':'default'" size="sm" @click="disableMode='readonly'">只读</NButton>
        <NButton :type="disableMode==='normal'?'primary':'default'" size="sm" @click="disableMode='normal'">正常</NButton>
      </NSpace>
      <NMdEditor v-model="disabledVal" :disabled="disableMode==='disabled'" :readonly="disableMode==='readonly'" />
    </DemoBlock>

    <DemoBlock title="隐藏工具栏" description="hide-toolbar 隐藏工具栏，适用于简洁场景。" :code="hideToolbarCode">
      <NMdEditor v-model="hideToolbarVal" hide-toolbar />
    </DemoBlock>

    <DemoBlock title="字数统计" description="maxlength + show-count 显示字数统计。" :code="countCode">
      <NMdEditor v-model="countVal" :maxlength="200" show-count />
    </DemoBlock>

    <DemoBlock title="自定义高度" description="height 设置编辑器高度，支持数字(px)或 CSS 字符串。" :code="heightCode">
      <NMdEditor v-model="heightVal" height="260px" />
    </DemoBlock>

    <DemoBlock title="图片上传" description="支持三种方式插入图片：工具栏按钮选择文件、编辑区粘贴图片、拖拽图片到编辑区。默认将图片转为 base64，可通过 upload-fn 自定义上传逻辑。" :code="uploadCode">
      <NMdEditor v-model="uploadVal" :upload-fn="customUploadFn" @upload-success="onUploadSuccess" @upload-error="onUploadError" height="300px" />
      <div v-if="uploadLogs.length" style="margin-top:8px;font-size:12px;color:var(--nd-color-text-secondary);">
        <div v-for="(log, i) in uploadLogs" :key="i">{{ log }}</div>
      </div>
    </DemoBlock>

    <!-- MdRender 部分 -->
    <h2 id="mdrender-markdown-渲染" style="margin-top:48px;font-size:20px;font-weight:600;">MdRender Markdown 渲染</h2>

    <DemoBlock title="基础渲染" description="传入 Markdown 文本，渲染为带样式的 HTML。" :code="renderBasicCode">
      <NMdRender :content="renderContent" />
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="size 控制字号大小。" :code="renderSizeCode">
      <div style="display:flex;flex-direction:column;gap:24px">
        <div v-for="s in (['sm','md','lg'] as const)" :key="s">
          <div style="font-size:13px;color:var(--nd-color-text-secondary);margin-bottom:6px">size = "{{ s }}"</div>
          <NMdRender :content="renderContent" :size="s" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="编辑器 + 渲染联动" description="在编辑器中输入内容，实时用 MdRender 渲染展示。" :code="linkageCode">
      <div style="display:flex;gap:16px;height:400px">
        <div style="flex:1;display:flex;flex-direction:column;min-width:0">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--nd-color-text-secondary)">编辑区</div>
          <NMdEditor v-model="linkageVal" :height="'100%'" hide-toolbar />
        </div>
        <div style="width:1px;background:var(--nd-color-border);flex-shrink:0" />
        <div style="flex:1;overflow-y:auto;min-width:0">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--nd-color-text-secondary)">渲染区</div>
          <NMdRender :content="linkageVal" />
        </div>
      </div>
    </DemoBlock>

    <!-- API -->
    <h2 style="margin-top:48px;font-size:20px;font-weight:600;">API</h2>

    <ApiTable title="MdEditor Props" :columns="propColumns" :data="editorProps" />
    <ApiTable title="MdEditor Events" :columns="eventColumns" :data="editorEvents" />
    <ApiTable title="MdEditor Methods" :columns="methodColumns" :data="editorMethods" />
    <ApiTable title="MdRender Props" :columns="propColumns" :data="renderProps" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

/* ======= 示例数据 ======= */
const sampleMd = `# 标题一

## 标题二

这是一段 **粗体**、*斜体*、~~删除线~~ 和 \`行内代码\` 的示例。

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2

> 引用文本

[链接示例](https://marked.js.org)

| 列1 | 列2 | 列3 |
| --- | --- | --- |
| A | B | C |
| D | E | F |

\`\`\`js
console.log('Hello, Markdown!')
\`\`\`

---

- [x] 已完成任务
- [ ] 未完成任务
`

/* 基础用法 */
const basicVal = ref(sampleMd)

const basicCode = `<template>
  <NMdEditor v-model="content" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('# Hello Markdown\\n\\n这是 **粗体** 和 *斜体*。')
<\/script>`

/* 视图模式 */
const viewMode = ref<'edit' | 'split' | 'preview'>('split')
const viewModeVal = ref(sampleMd)

const viewModeCode = `<template>
  <NMdEditor v-model="content" view-mode-prop="split" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('# 示例')
<\/script>`

/* 禁用 / 只读 */
const disableMode = ref<'disabled' | 'readonly' | 'normal'>('disabled')
const disabledVal = ref(sampleMd)

const disabledCode = `<template>
  <NMdEditor v-model="content" disabled />
  <NMdEditor v-model="content" readonly />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('# 只读内容')
<\/script>`

/* 隐藏工具栏 */
const hideToolbarVal = ref(sampleMd)

const hideToolbarCode = `<template>
  <NMdEditor v-model="content" hide-toolbar />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('# 简洁模式')
<\/script>`

/* 字数统计 */
const countVal = ref('统计字数的示例文本……')

const countCode = `<template>
  <NMdEditor v-model="content" :maxlength="200" show-count />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('')
<\/script>`

/* 自定义高度 */
const heightVal = ref(sampleMd)

const heightCode = `<template>
  <NMdEditor v-model="content" height="260px" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('')
<\/script>`

/* 图片上传 */
const uploadVal = ref('## 图片上传示例\n\n点击工具栏图片按钮选择文件，或直接粘贴 / 拖拽图片到编辑区。')
const uploadLogs = ref<string[]>([])

const customUploadFn = async (file: File): Promise<string> => {
  await new Promise(r => setTimeout(r, 800))
  return URL.createObjectURL(file)
}

const onUploadSuccess = ({ file, url }: { file: File; url: string }) => {
  uploadLogs.value.push(`✅ ${file.name} → ${url.slice(0, 60)}…`)
}

const onUploadError = ({ file, error }: { file: File; error: Error }) => {
  uploadLogs.value.push(`❌ ${file.name} → ${error.message}`)
}

const uploadCode = `<template>
  <NMdEditor
    v-model="content"
    :upload-fn="handleUpload"
    @upload-success="onSuccess"
    @upload-error="onError"
  />
</template>

<script setup lang="ts">
import type { UploadFn } from 'nacr-design'

const content = ref('拖拽或粘贴图片到此处')

// 自定义上传：接收 File，返回图片 URL
const handleUpload: UploadFn = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  return data.url  // 返回图片 URL
}

const onSuccess = ({ file, url }) => console.log('上传成功:', file.name, url)
const onError = ({ file, error }) => console.error('上传失败:', file.name, error)
<\/script>`

/* MdRender 基础 */
const renderContent = ref(sampleMd)

const renderBasicCode = `<template>
  <NMdRender :content="md" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const md = ref('# 渲染示例\\n\\n这是 **粗体**。')
<\/script>`

/* MdRender 尺寸 */
const renderSizeCode = `<template>
  <NMdRender content="..." size="lg" />
</template>`

/* 联动 */
const linkageVal = ref(sampleMd)

const linkageCode = `<template>
  <div style="display:flex;gap:16px;height:400px">
    <div style="flex:1">
      <NMdEditor v-model="content" height="100%" hide-toolbar />
    </div>
    <div style="flex:1;overflow-y:auto">
      <NMdRender :content="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const content = ref('# 实时联动')
<\/script>`

/* ======= API 表格 ======= */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const editorProps = [
  { name: 'modelValue', type: 'string', default: "''", desc: 'Markdown 内容，支持 v-model' },
  { name: 'placeholder', type: 'string', default: "'请输入 Markdown 内容...'", desc: '占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'hideToolbar', type: 'boolean', default: 'false', desc: '是否隐藏工具栏' },
  { name: 'viewModeProp', type: "'edit' | 'split' | 'preview'", default: "'split'", desc: '初始视图模式' },
  { name: 'height', type: 'string | number', default: '400', desc: '编辑器高度，数字为 px' },
  { name: 'maxlength', type: 'number', default: '-', desc: '最大输入长度' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字数统计' },
  { name: 'autofocus', type: 'boolean', default: 'false', desc: '是否自动聚焦' },
  { name: 'accept', type: 'string', default: "'image/*'", desc: '上传文件类型限制' },
  { name: 'uploadFn', type: '(file: File) => Promise<string>', default: '-', desc: '自定义上传函数，接收 File 返回图片 URL；不传则转 base64' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '回调参数', code: true },
  { key: 'desc', title: '说明' },
]

const editorEvents = [
  { name: 'update:modelValue', type: '(val: string)', desc: '内容变化时触发' },
  { name: 'change', type: '(val: string)', desc: '内容变化时触发' },
  { name: 'focus', type: '(e: FocusEvent)', desc: '获得焦点时触发' },
  { name: 'blur', type: '(e: FocusEvent)', desc: '失去焦点时触发' },
  { name: 'upload-success', type: '(payload: { file: File; url: string })', desc: '图片上传成功时触发' },
  { name: 'upload-error', type: '(payload: { file: File; error: Error })', desc: '图片上传失败时触发' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const editorMethods = [
  { name: 'focus', type: '()', desc: '聚焦编辑器' },
  { name: 'blur', type: '()', desc: '失焦编辑器' },
  { name: 'getViewMode', type: '() => ViewMode', desc: '获取当前视图模式' },
  { name: 'setViewMode', type: "(mode: ViewMode)", desc: '设置视图模式' },
  { name: 'triggerUpload', type: '()', desc: '手动触发文件选择弹窗' },
]

const renderProps = [
  { name: 'content', type: 'string', default: "''", desc: '要渲染的 Markdown 文本' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '渲染字号大小' },
]
</script>
