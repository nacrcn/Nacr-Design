<template>
    <div class="doc-page">
        <h1>FileList 文件列表</h1>
        <p class="doc-page__desc">用于展示文件列表，自动识别文件后缀展示对应图标，支持列表模式、小卡片模式和大卡片模式。图片类型文件在卡片和大卡片模式下可直接展示缩略图预览。</p>

        <!-- ========== 综合示例 ========== -->
        <DemoBlock title="综合示例" description="包含模式切换、文件选择、Modal 删除确认弹窗、点击下载等完整交互。" :code="fullCode">
            <NFileList :files="fullFiles" v-model:mode="fullMode" v-model="fullSelected" header="项目文件" selectable
                show-mode-toggle show-date @file-click="onFullFileClick" @remove="onFullRemove" />
            <div class="full-status">
                <span>当前模式：<b>{{ fullMode }}</b></span>
                <span>已选中 <b>{{ fullSelected.length }}</b> 项：<span v-if="fullSelected.length">{{ fullSelected.join(', ')
                        }}</span></span>
                <span v-if="fullMsg" style="color:var(--n-color-primary)">{{ fullMsg }}</span>
            </div>
            <NModal v-model="fullShowModal" title="删除确认" preset="danger" @confirm="onFullConfirmDelete"
                @cancel="onFullCancelDelete">
                <p>确定要删除「<b>{{ fullDeleteFile?.name }}</b>」吗？删除后将无法恢复！</p>
            </NModal>
        </DemoBlock>

        <!-- ========== 基础用法 ========== -->
        <DemoBlock title="基础用法" description="通过 files 属性传入文件列表，自动识别文件后缀展示对应图标。" :code="basicCode">
            <NFileList :files="basicFiles" />
        </DemoBlock>

        <!-- ========== 小卡片模式 ========== -->
        <DemoBlock title="小卡片模式" description="设置 mode 为 grid 切换为小卡片网格布局，紧凑展示图标与文件名。" :code="gridCode">
            <NFileList :files="basicFiles" mode="grid" />
        </DemoBlock>

        <!-- ========== 大卡片模式 ========== -->
        <DemoBlock title="大卡片模式" description="设置 mode 为 card 切换为大卡片模式。图片类型文件（jpg/png/gif/svg等）会直接展示缩略图预览，其他类型展示大图标。"
            :code="cardCode">
            <NFileList :files="cardFiles" mode="card" />
        </DemoBlock>

        <!-- ========== 模式切换 ========== -->
        <DemoBlock title="模式切换" description="设置 showModeToggle 显示列表/小卡片/大卡片模式切换按钮，mode 支持 v-model 双向绑定。"
            :code="toggleCode">
            <NFileList :files="cardFiles" v-model:mode="currentMode" show-mode-toggle />
            <div style="margin-top:8px;font-size:13px;color:var(--n-color-text-secondary);">当前模式：{{ currentMode }}</div>
        </DemoBlock>

        <!-- ========== 可选择 ========== -->
        <DemoBlock title="可选择" description="设置 selectable 启用文件选择，通过 v-model 绑定已选中项的 uid 列表，支持列表和卡片模式。"
            :code="selectableCode">
            <NFileList :files="basicFiles" selectable v-model="selectedKeys" />
            <div style="margin-top:10px;font-size:13px;color:var(--n-color-text-secondary);">已选中 {{ selectedKeys.length
                }} 项：{{ selectedKeys.join(', ') }}</div>
        </DemoBlock>

        <!-- ========== 带标题与日期 ========== -->
        <DemoBlock title="带标题与日期" description="通过 header 属性设置列表头部标题，设置 show-date 显示文件日期信息。" :code="headerDateCode">
            <NFileList :files="dateFiles" header="项目文档" show-date />
        </DemoBlock>

    <!-- ========== 删除确认 ========== -->
    <DemoBlock title="删除确认" description="监听 remove 事件，使用 NModal 对话框确认后再执行删除操作。" :code="removeCode">
      <NFileList :files="removeFiles" header="可删除文件" @remove="onRemoveConfirm" />
      <NModal v-model="removeShowModal" title="删除确认" preset="danger" @confirm="onRemoveConfirmDelete" @cancel="onRemoveCancelDelete">
        <p>确定要删除「<b>{{ removeDeleteFile?.name }}</b>」吗？此操作不可恢复。</p>
      </NModal>
    </DemoBlock>

        <!-- ========== 自定义图标映射 ========== -->
        <DemoBlock title="自定义图标映射" description="通过 icons 属性自定义文件后缀与图标的映射关系。" :code="customIconsCode">
            <NFileList :files="customFiles" :icons="customIconMap" />
        </DemoBlock>

        <!-- ========== 自定义插槽 ========== -->
        <DemoBlock title="自定义插槽" description="通过 #file-icon、#file-name、#file-actions 插槽自定义文件项的展示内容。" :code="slotCode">
            <NFileList :files="basicFiles">
                <template #file-icon="{ ext }">
                    <span style="font-size:18px">{{ ext === 'pdf' ? '📕' : ext === 'xlsx' ? '📊' : ext === 'docx' ? '📝'
                        : ext === 'pptx' ? '📽️' : '📄' }}</span>
                </template>
                <template #file-name="{ file }">
                    <span style="font-weight:600;color:var(--n-color-primary)">{{ file.name }}</span>
                </template>
            </NFileList>
        </DemoBlock>

        <!-- ========== API ========== -->
        <ApiTable title="FileList Props" :columns="propColumns" :data="propData" />
        <ApiTable title="FileList Events" :columns="eventColumns" :data="eventData" />
        <ApiTable title="FileList Slots" :columns="slotColumns" :data="slotData" />
        <ApiTable title="FileItem 数据结构" :columns="propColumns" :data="fileItemData" />
        <ApiTable title="FileListItem Slots" :columns="slotColumns" :data="itemSlotData" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ layout: 'doc' })

// ========== 综合示例 ==========
const fullMode = ref<'list' | 'grid' | 'card'>('grid')
const fullSelected = ref<(string | number)[]>([])
const fullMsg = ref('')
const fullFiles = ref([
    { uid: 1, name: '产品截图.png', size: 2457600, date: '2026-06-20', url: 'https://picsum.photos/seed/nacr1/400/300' },
    { uid: 2, name: '团队合照.jpg', size: 156800, date: '2026-06-19', url: 'https://picsum.photos/seed/nacr2/400/300' },
    { uid: 3, name: '年度报告.pdf', size: 892000, date: '2026-06-18' },
    { uid: 4, name: '数据统计.xlsx', size: 40960, date: '2026-06-17' },
    { uid: 5, name: '需求文档.docx', size: 245000, date: '2026-06-16' },
    { uid: 6, name: '演示文稿.pptx', size: 5242880, date: '2026-06-15' },
    { uid: 7, name: '项目源码.zip', size: 15728640, date: '2026-06-14' },
    { uid: 8, name: '数据库备份.sql', size: 3145728, date: '2026-06-13' },
    { uid: 9, name: '架构图.svg', size: 98304, date: '2026-06-12', url: 'https://picsum.photos/seed/nacr5/400/300' },
])
function onFullFileClick(file: any) {
    fullMsg.value = `点击了：${file.name}`
    setTimeout(() => { fullMsg.value = '' }, 2000)
}
function onFullRemove(file: any, index: number) {
    fullDeleteFile.value = file
    fullDeleteIndex.value = index
    fullShowModal.value = true
}
const fullShowModal = ref(false)
const fullDeleteFile = ref<any>(null)
const fullDeleteIndex = ref(-1)
function onFullConfirmDelete() {
    if (fullDeleteFile.value && fullDeleteIndex.value >= 0) {
        fullFiles.value = fullFiles.value.filter((_, i) => i !== fullDeleteIndex.value)
        fullSelected.value = fullSelected.value.filter(k => k !== fullDeleteFile.value.uid)
        fullMsg.value = `已删除：${fullDeleteFile.value.name}`
        setTimeout(() => { fullMsg.value = '' }, 2000)
    }
    fullDeleteFile.value = null
    fullDeleteIndex.value = -1
}
function onFullCancelDelete() {
    fullDeleteFile.value = null
    fullDeleteIndex.value = -1
}
const fullCode = `<template>
  <NFileList
    :files="files"
    v-model:mode="mode"
    v-model="selected"
    header="项目文件"
    selectable
    show-mode-toggle
    show-date
    @file-click="onFileClick"
    @remove="onRemove"
  />
  <NModal v-model="showModal" title="删除确认" preset="danger"
    @confirm="onConfirmDelete" @cancel="onCancelDelete">
    <p>确定要删除「<b>{{ deleteFile?.name }}</b>」吗？删除后将无法恢复！</p>
  </NModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mode = ref<'list' | 'grid' | 'card'>('list')
const selected = ref<(string | number)[]>([])
const files = ref([
  { uid: 1, name: '产品截图.png', size: 2457600, date: '2026-06-20', url: 'https://example.com/img.png' },
  { uid: 2, name: '年度报告.pdf', size: 892000, date: '2026-06-18' },
  { uid: 3, name: '数据统计.xlsx', size: 40960, date: '2026-06-17' },
  { uid: 4, name: '项目源码.zip', size: 15728640, date: '2026-06-14' },
])

const showModal = ref(false)
const deleteFile = ref<any>(null)
const deleteIndex = ref(-1)

function onFileClick(file: any) {
  alert('点击了：' + file.name)
}

function onRemove(file: any, index: number) {
  deleteFile.value = file
  deleteIndex.value = index
  showModal.value = true
}

function onConfirmDelete() {
  if (deleteFile.value && deleteIndex.value >= 0) {
    files.value = files.value.filter((_, i) => i !== deleteIndex.value)
    selected.value = selected.value.filter(k => k !== deleteFile.value.uid)
  }
  deleteFile.value = null
  deleteIndex.value = -1
}

function onCancelDelete() {
  deleteFile.value = null
  deleteIndex.value = -1
}
<\/script>`

// ========== 基础用法 ==========
const basicFiles = [
    { uid: 1, name: '年度报告.pdf', size: 2457600 },
    { uid: 2, name: '数据统计.xlsx', size: 156800 },
    { uid: 3, name: '需求文档.docx', size: 892000 },
    { uid: 4, name: '演示文稿.pptx', size: 5242880 },
    { uid: 5, name: '配置文件.json', size: 4096 },
    { uid: 6, name: '背景图片.png', size: 1048576 },
    { uid: 7, name: '项目源码.zip', size: 15728640 },
    { uid: 8, name: '数据库备份.sql', size: 3145728 },
]
const basicCode = `<template>
  <NFileList :files="files" />
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: '年度报告.pdf', size: 2457600 },
  { uid: 2, name: '数据统计.xlsx', size: 156800 },
  { uid: 3, name: '需求文档.docx', size: 892000 },
  { uid: 4, name: '演示文稿.pptx', size: 5242880 },
  { uid: 5, name: '配置文件.json', size: 4096 },
  { uid: 6, name: '背景图片.png', size: 1048576 },
]
<\/script>`

// ========== 小卡片模式 ==========
const gridCode = `<template>
  <NFileList :files="files" mode="grid" />
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: '年度报告.pdf', size: 2457600 },
  { uid: 2, name: '数据统计.xlsx', size: 156800 },
  { uid: 3, name: '需求文档.docx', size: 892000 },
  { uid: 4, name: '配置文件.json', size: 4096 },
]
<\/script>`

// ========== 大卡片模式 ==========
const cardFiles = [
    { uid: 1, name: '产品截图.png', size: 2457600, url: 'https://picsum.photos/seed/nacr1/400/300' },
    { uid: 2, name: '团队合照.jpg', size: 156800, url: 'https://picsum.photos/seed/nacr2/400/300' },
    { uid: 3, name: '年度报告.pdf', size: 892000 },
    { uid: 4, name: '架构图.svg', size: 5242880, url: 'https://picsum.photos/seed/nacr3/400/300' },
    { uid: 5, name: '数据统计.xlsx', size: 4096 },
    { uid: 6, name: '用户头像.png', size: 1048576, url: 'https://picsum.photos/seed/nacr4/400/300' },
]
const cardCode = `<template>
  <NFileList :files="files" mode="card" />
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: '产品截图.png', size: 2457600, url: '/uploads/screenshot.png' },
  { uid: 2, name: '团队合照.jpg', size: 156800, url: '/uploads/team.jpg' },
  { uid: 3, name: '年度报告.pdf', size: 892000 },
  { uid: 4, name: '数据统计.xlsx', size: 4096 },
]
<\/script>`

// ========== 模式切换 ==========
const currentMode = ref<'list' | 'grid' | 'card'>('list')
const toggleCode = `<template>
  <NFileList :files="files" v-model:mode="mode" show-mode-toggle />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const mode = ref<'list' | 'grid' | 'card'>('list')
const files = [
  { uid: 1, name: '产品截图.png', size: 2457600, url: '/uploads/img.png' },
  { uid: 2, name: '年度报告.pdf', size: 892000 },
]
<\/script>`

// ========== 可选择 ==========
const selectedKeys = ref<(string | number)[]>([])
const selectableCode = `<template>
  <NFileList :files="files" selectable v-model="selectedKeys" />
  <p>已选中 {{ selectedKeys.length }} 项</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedKeys = ref<(string | number)[]>([])
const files = [
  { uid: 1, name: '年度报告.pdf', size: 2457600 },
  { uid: 2, name: '数据统计.xlsx', size: 156800 },
  { uid: 3, name: '需求文档.docx', size: 892000 },
]
<\/script>`

// ========== 带标题与日期 ==========
const dateFiles = [
    { uid: 1, name: '会议纪要.docx', size: 45000, date: '2026-06-20' },
    { uid: 2, name: '设计方案.pdf', size: 890000, date: '2026-06-18' },
    { uid: 3, name: '源代码.zip', size: 5242880, date: '2026-06-15' },
    { uid: 4, name: '数据库备份.sql', size: 3145728, date: '2026-06-13' },
]
const headerDateCode = `<template>
  <NFileList :files="files" header="项目文档" show-date />
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: '会议纪要.docx', size: 45000, date: '2026-06-20' },
  { uid: 2, name: '设计方案.pdf', size: 890000, date: '2026-06-18' },
  { uid: 3, name: '源代码.zip', size: 5242880, date: '2026-06-15' },
]
<\/script>`

// ========== 删除确认 ==========
const removeFiles = ref([
  { uid: 1, name: '旧版报告.pdf', size: 3200000 },
  { uid: 2, name: '废弃数据.xlsx', size: 12800 },
  { uid: 3, name: '临时文件.zip', size: 10485760 },
])
const removeShowModal = ref(false)
const removeDeleteFile = ref<any>(null)
const removeDeleteIndex = ref(-1)
function onRemoveConfirm(file: any, index: number) {
  removeDeleteFile.value = file
  removeDeleteIndex.value = index
  removeShowModal.value = true
}
function onRemoveConfirmDelete() {
  if (removeDeleteFile.value && removeDeleteIndex.value >= 0) {
    removeFiles.value = removeFiles.value.filter((_, i) => i !== removeDeleteIndex.value)
  }
  removeDeleteFile.value = null
  removeDeleteIndex.value = -1
}
function onRemoveCancelDelete() {
  removeDeleteFile.value = null
  removeDeleteIndex.value = -1
}
const removeCode = `<template>
  <NFileList :files="files" header="可删除文件" @remove="onRemove" />
  <NModal v-model="showModal" title="删除确认" preset="danger"
    @confirm="onConfirmDelete" @cancel="onCancelDelete">
    <p>确定要删除「<b>{{ deleteFile?.name }}</b>」吗？此操作不可恢复。</p>
  </NModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const files = ref([
  { uid: 1, name: '旧版报告.pdf', size: 3200000 },
  { uid: 2, name: '废弃数据.xlsx', size: 12800 },
  { uid: 3, name: '临时文件.zip', size: 10485760 },
])

const showModal = ref(false)
const deleteFile = ref<any>(null)
const deleteIndex = ref(-1)

function onRemove(file: any, index: number) {
  deleteFile.value = file
  deleteIndex.value = index
  showModal.value = true
}

function onConfirmDelete() {
  if (deleteFile.value && deleteIndex.value >= 0) {
    files.value = files.value.filter((_, i) => i !== deleteIndex.value)
  }
  deleteFile.value = null
  deleteIndex.value = -1
}

function onCancelDelete() {
  deleteFile.value = null
  deleteIndex.value = -1
}
<\/script>`

// ========== 自定义图标映射 ==========
const customFiles = [
    { uid: 1, name: 'README.md', size: 8192 },
    { uid: 2, name: 'server.yml', size: 2048 },
    { uid: 3, name: 'app.py', size: 15360 },
]
const customIconMap = { md: 'md', yml: 'yml', py: 'py' }
const customIconsCode = `<template>
  <NFileList :files="files" :icons="{ md: 'md', yml: 'yml', py: 'py' }" />
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: 'README.md', size: 8192 },
  { uid: 2, name: 'server.yml', size: 2048 },
  { uid: 3, name: 'app.py', size: 15360 },
]
<\/script>`

// ========== 自定义插槽 ==========
const slotCode = `<template>
  <NFileList :files="files">
    <template #file-icon="{ ext }">
      <span style="font-size:18px">
        {{ ext === 'pdf' ? '📕' : ext === 'xlsx' ? '📊' : ext === 'docx' ? '📝' : '📄' }}
      </span>
    </template>
    <template #file-name="{ file }">
      <span style="font-weight:600;color:var(--n-color-primary)">
        {{ file.name }}
      </span>
    </template>
  </NFileList>
</template>

<script setup lang="ts">
const files = [
  { uid: 1, name: '年度报告.pdf', size: 2457600 },
  { uid: 2, name: '数据统计.xlsx', size: 156800 },
  { uid: 3, name: '需求文档.docx', size: 892000 },
]
<\/script>`

// ===== API Tables =====
const propColumns = [
    { key: 'name', title: '参数', code: true },
    { key: 'type', title: '类型', code: true },
    { key: 'default', title: '默认值', code: true },
    { key: 'desc', title: '说明' },
]
const propData = [
    { name: 'files', type: 'FileItem[]', default: '[]', desc: '文件列表数据' },
    { name: 'mode', type: "'list' | 'grid' | 'card'", default: "'list'", desc: '展示模式：列表 / 小卡片 / 大卡片' },
    { name: 'header', type: 'string', default: '-', desc: '列表头部标题' },
    { name: 'selectable', type: 'boolean', default: 'false', desc: '是否可选择文件' },
    { name: 'modelValue', type: '(string | number)[]', default: '[]', desc: '已选中文件的 uid 列表，支持 v-model' },
    { name: 'showSize', type: 'boolean', default: 'true', desc: '是否显示文件大小' },
    { name: 'showDate', type: 'boolean', default: 'false', desc: '是否显示文件日期' },
    { name: 'showActions', type: 'boolean', default: 'true', desc: '是否显示操作按钮' },
    { name: 'showModeToggle', type: 'boolean', default: 'false', desc: '是否显示列表/小卡片/大卡片模式切换' },
    { name: 'icons', type: 'Record<string, string>', default: '{}', desc: '自定义文件后缀到图标名的映射' },
    { name: 'colorfulIcons', type: 'string[]', default: '[]', desc: '额外要使用彩色 SVG 的扩展名列表（内置已有 37 种）' },
    { name: 'emptyText', type: 'string', default: "'暂无文件'", desc: '空状态提示文字' },
]

const eventColumns = [
    { key: 'name', title: '事件名', code: true },
    { key: 'type', title: '参数', code: true },
    { key: 'desc', title: '说明' },
]
const eventData = [
    { name: 'update:mode', type: "(mode: 'list' | 'grid' | 'card')", desc: '模式切换时触发' },
    { name: 'update:modelValue', type: '(keys: (string|number)[])', desc: '选择变化时触发' },
    { name: 'file-click', type: '(file: FileItem)', desc: '点击文件时触发（可用于下载/预览）' },
    { name: 'select', type: '(file: FileItem, selected: boolean)', desc: '选择/取消选择时触发' },
    { name: 'remove', type: '(file: FileItem, index: number)', desc: '点击删除按钮时触发（需自行实现删除逻辑）' },
]

const slotColumns = [
    { key: 'name', title: '插槽名', code: true },
    { key: 'type', title: '参数', code: true },
    { key: 'desc', title: '说明' },
]
const slotData = [
    { name: 'header', type: '-', desc: '列表头部自定义内容' },
    { name: 'file-icon', type: '{ file, ext, iconName }', desc: '文件图标自定义' },
    { name: 'file-name', type: '{ file }', desc: '文件名自定义' },
    { name: 'file-actions', type: '{ file }', desc: '操作按钮区域自定义' },
]

const fileItemData = [
    { name: 'uid', type: 'string | number', default: '-', desc: '文件唯一标识（用于选择）' },
    { name: 'name', type: 'string', default: '-', desc: '文件名（含扩展名，用于自动推断图标）' },
    { name: 'size', type: 'number', default: '-', desc: '文件大小（字节，自动格式化为 KB/MB）' },
    { name: 'date', type: 'string', default: '-', desc: '文件日期字符串' },
    { name: 'url', type: 'string', default: '-', desc: '文件下载/预览地址（卡片模式下图片直接展示预览缩略图）' },
    { name: 'type', type: 'string', default: '-', desc: '自定义文件 MIME 类型（可覆盖自动推断，如 image/png）' },
]

const itemSlotData = [
    { name: 'icon', type: '{ file, ext, iconName }', desc: '文件图标（FileListItem 内部）' },
    { name: 'name', type: '{ file }', desc: '文件名（FileListItem 内部）' },
    { name: 'actions', type: '{ file }', desc: '操作区域（FileListItem 内部）' },
]
</script>

<style scoped>
.full-status {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
    font-size: 13px;
    color: var(--n-color-text-secondary);
}
</style>
