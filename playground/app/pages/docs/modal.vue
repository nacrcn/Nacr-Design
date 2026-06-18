<template>
  <div class="doc-page">
    <h1>Modal 对话框</h1>
    <p class="doc-page__desc">
      模态对话框，用于重要信息确认或表单填写。支持预设确认/危险模式、自定义页头页脚以及丰富的交互配置。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 v-model 控制显示/隐藏，使用 footer 插槽自定义底部按钮。" :code="basicCode">
      <NButton @click="showBasic = true">打开对话框</NButton>
      <NModal v-model="showBasic" title="基础对话框">
        <p>这是对话框的内容部分，你可以在此放置任何需要展示的信息或表单。</p>
        <template #footer>
          <NButton size="sm" variant="secondary" @click="showBasic = false">取消</NButton>
          <NButton size="sm" @click="showBasic = false">确定</NButton>
        </template>
      </NModal>
    </DemoBlock>

    <!-- ────── 预设确认 ────── -->
    <DemoBlock title="确认模式" description="设置 preset 为 confirm 可自动生成「取消/确定」按钮。" :code="confirmCode">
      <NButton @click="showConfirm = true">确认对话框</NButton>
      <NModal v-model="showConfirm" title="确认操作" preset="confirm" @confirm="onConfirm" @cancel="onCancel">
        <p>你确定要执行此操作吗？此操作不可撤销。</p>
      </NModal>
      <p v-if="confirmAction" style="margin-top:8px;color:var(--n-color-text-secondary);">最近操作：{{ confirmAction }}</p>
    </DemoBlock>

    <!-- ────── 危险确认 ────── -->
    <DemoBlock title="危险确认模式" description="设置 preset 为 danger，自动显示危险图标和红色确认按钮。" :code="dangerCode">
      <NButton variant="danger" @click="showDanger = true">删除确认</NButton>
      <NModal v-model="showDanger" title="删除确认" preset="danger" @confirm="onDangerConfirm" @cancel="onDangerCancel">
        <p>确定要删除该项目吗？删除后将无法恢复！</p>
      </NModal>
      <p v-if="dangerAction" style="margin-top:8px;color:var(--n-color-text-secondary);">最近操作：{{ dangerAction }}</p>
    </DemoBlock>

    <!-- ────── 自定义宽度 ────── -->
    <DemoBlock title="自定义宽度" description="通过 width 属性设置对话框宽度，支持数字(px)和字符串。" :code="widthCode">
      <NSpace>
        <NButton @click="showNarrow = true">窄对话框 (400px)</NButton>
        <NButton @click="showWide = true">宽对话框 (720px)</NButton>
      </NSpace>
      <NModal v-model="showNarrow" title="窄对话框" :width="400">
        <p>这是一个 400px 宽的对话框。</p>
      </NModal>
      <NModal v-model="showWide" title="宽对话框" :width="720">
        <p>这是一个 720px 宽的对话框，适合展示更多内容或双列表单。</p>
      </NModal>
    </DemoBlock>

    <!-- ────── 禁止遮罩关闭 ────── -->
    <DemoBlock title="禁止遮罩关闭" description="设置 :mask-closable=false 后点击遮罩层不会关闭对话框。" :code="maskCode">
      <NButton @click="showNoMask = true">禁止遮罩关闭</NButton>
      <NModal v-model="showNoMask" title="提示" :mask-closable="false">
        <p>点击遮罩层不会关闭此对话框，只能通过按钮或右上角关闭。</p>
        <template #footer>
          <NButton size="sm" @click="showNoMask = false">我知道了</NButton>
        </template>
      </NModal>
    </DemoBlock>

    <!-- ────── 无关闭按钮 ────── -->
    <DemoBlock title="无关闭按钮" description="设置 :closable=false 隐藏右上角关闭按钮。" :code="noClosableCode">
      <NButton @click="showNoClose = true">无关闭按钮</NButton>
      <NModal v-model="showNoClose" title="无关闭按钮" :closable="false">
        <p>右上角没有关闭按钮，需通过底部按钮关闭。</p>
        <template #footer>
          <NButton size="sm" @click="showNoClose = false">关闭</NButton>
        </template>
      </NModal>
    </DemoBlock>

    <!-- ────── 自定义页头 ────── -->
    <DemoBlock title="自定义页头" description="通过 header 插槽自定义标题区域内容。" :code="headerCode">
      <NButton @click="showCustomHeader = true">自定义页头</NButton>
      <NModal v-model="showCustomHeader">
        <template #header>
          <div style="display:flex;align-items:center;gap:8px;">
            <NIcon name="shandian" size="20" color="var(--n-color-warning)" />
            <span style="font-weight:600;font-size:var(--n-font-size-lg);">自定义标题</span>
          </div>
        </template>
        <p>这是一个自定义了页头的对话框，你可以放置图标、标签等各种元素。</p>
        <template #footer>
          <NButton size="sm" @click="showCustomHeader = false">关闭</NButton>
        </template>
      </NModal>
    </DemoBlock>

    <!-- ────── 居中内容 ────── -->
    <DemoBlock title="简洁内容" description="配合居中文字，适合简单的提示确认场景。" :code="simpleCode">
      <NButton @click="showSimple = true">简洁对话框</NButton>
      <NModal v-model="showSimple" preset="confirm" title="简洁确认">
        <div style="text-align:center;padding:8px 0;">确定要继续吗？</div>
      </NModal>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const showBasic = ref(false)
const showConfirm = ref(false)
const showDanger = ref(false)
const showNarrow = ref(false)
const showWide = ref(false)
const showNoMask = ref(false)
const showNoClose = ref(false)
const showCustomHeader = ref(false)
const showSimple = ref(false)

const confirmAction = ref('')
const dangerAction = ref('')

function onConfirm() { confirmAction.value = '确认' }
function onCancel() { confirmAction.value = '取消' }
function onDangerConfirm() { dangerAction.value = '确认删除' }
function onDangerCancel() { dangerAction.value = '取消' }

/* ── 代码片段 ── */
const basicCode = `<NModal v-model="show" title="基础对话框">
  <p>对话框内容</p>
  <template #footer>
    <NButton size="sm" variant="secondary" @click="show = false">取消</NButton>
    <NButton size="sm" @click="show = false">确定</NButton>
  </template>
</NModal>`

const confirmCode = `<NModal v-model="show" title="确认操作" preset="confirm"
  @confirm="onConfirm" @cancel="onCancel">
  <p>确定要执行此操作吗？</p>
</NModal>`

const dangerCode = `<NModal v-model="show" title="删除确认" preset="danger"
  @confirm="onConfirm" @cancel="onCancel">
  <p>确定要删除该项目吗？删除后将无法恢复！</p>
</NModal>`

const widthCode = `<NModal v-model="show" title="窄对话框" :width="400" />
<NModal v-model="show" title="宽对话框" :width="720" />`

const maskCode = `<NModal v-model="show" title="提示" :mask-closable="false">
  <p>点击遮罩层不会关闭此对话框。</p>
  <template #footer>
    <NButton size="sm" @click="show = false">我知道了</NButton>
  </template>
</NModal>`

const noClosableCode = `<NModal v-model="show" title="无关闭按钮" :closable="false">
  <p>只能通过底部按钮关闭。</p>
  <template #footer>
    <NButton size="sm" @click="show = false">关闭</NButton>
  </template>
</NModal>`

const headerCode = `<NModal v-model="show">
  <template #header>
    <div style="display:flex;align-items:center;gap:8px;">
      <NIcon name="shandian" size="20" color="var(--n-color-warning)" />
      <span>自定义标题</span>
    </div>
  </template>
  <p>自定义页头的对话框。</p>
</NModal>`

const simpleCode = `<NModal v-model="show" preset="confirm" title="简洁确认">
  <div style="text-align:center;">确定要继续吗？</div>
</NModal>`

/* ── 表格定义 ── */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'boolean', default: '—', desc: '是否显示（必填，支持 v-model）' },
  { name: 'title', type: 'string', default: '—', desc: '标题' },
  { name: 'width', type: 'number | string', default: '520', desc: '宽度(px)，也可传字符串如 "60%"' },
  { name: 'closable', type: 'boolean', default: 'true', desc: '是否显示右上角关闭按钮' },
  { name: 'maskClosable', type: 'boolean', default: 'true', desc: '点击遮罩层是否关闭' },
  { name: 'card', type: 'boolean', default: 'true', desc: '是否显示卡片边框' },
  { name: 'center', type: 'boolean', default: 'true', desc: '是否垂直居中显示' },
  { name: 'preset', type: "'default' | 'confirm' | 'danger'", default: "'default'", desc: '预设模式：confirm 自动生成取消/确定按钮，danger 自动显示危险图标和红色按钮' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: boolean) => void', desc: '显隐状态变化' },
  { name: 'close', type: '() => void', desc: '关闭时触发' },
  { name: 'confirm', type: '() => void', desc: '点击确定按钮时触发（需 preset 为 confirm/danger）' },
  { name: 'cancel', type: '() => void', desc: '点击取消按钮时触发（需 preset 为 confirm/danger）' },
  { name: 'afterEnter', type: '() => void', desc: '打开动画结束后触发' },
]

const slotData = [
  { name: 'default', desc: '对话框主体内容' },
  { name: 'header', desc: '自定义标题区域' },
  { name: 'footer', desc: '底部按钮区域（使用 preset 时不需手动设置）' },
]
</script>
