<template>
  <div class="doc-page">
    <h1>PageHeader 页头</h1>
    <p class="doc-page__desc">页头位于页容器顶部，用于展示页面标题、面包屑导航以及操作区。</p>

    <DemoBlock title="基础用法" description="设置 title 和 subtitle 显示页头信息。" :code="basicCode">
      <NPageHeader title="页面标题" subtitle="这是副标题" />
    </DemoBlock>

    <DemoBlock title="带返回按钮" description="设置 backArrow 显示返回按钮，点击触发 back 事件。" :code="backCode">
      <NPageHeader title="页面标题" back-arrow @back="handleBack" />
    </DemoBlock>

    <DemoBlock title="带图标" description="设置 icon 属性展示图标。" :code="iconCode">
      <NPageHeader title="用户管理" subtitle="管理系统用户" icon="user" back-arrow @back="handleBack" />
    </DemoBlock>

    <DemoBlock title="带面包屑" description="设置 breadcrumb 显示面包屑导航。" :code="breadcrumbCode">
      <NPageHeader title="页面标题" :breadcrumb="breadcrumbItems" />
    </DemoBlock>

    <DemoBlock title="自定义额外区域" description="通过 extra 插槽添加操作按钮。" :code="extraCode">
      <NPageHeader title="页面标题" subtitle="描述信息">
        <template #extra>
          <NSpace>
            <NButton size="sm">取消</NButton>
            <NButton type="primary" size="sm">保存</NButton>
          </NSpace>
        </template>
      </NPageHeader>
    </DemoBlock>

    <DemoBlock title="带内容区与底部" description="通过 default 和 footer 插槽添加更多内容。" :code="contentCode">
      <NPageHeader title="页面标题" subtitle="子标题">
        <template #default>
          <p style="color:var(--n-color-text-secondary);font-size:var(--n-font-size-sm);margin:0;">这里是页面的主体内容区域描述。</p>
        </template>
        <template #footer>
          <NTabs v-model="footerTab" :tabs="footerTabItems" />
        </template>
      </NPageHeader>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

function handleBack() {
  console.log('back')
}

const breadcrumbItems = [
  { label: '首页', href: '/' },
  { label: '组件', href: '/docs/button' },
  { label: '页头' },
]

const footerTab = ref('tab1')
const footerTabItems = [
  { key: 'tab1', label: '详情' },
  { key: 'tab2', label: '规则' },
]

const basicCode = `<NPageHeader title="页面标题" subtitle="这是副标题" />`
const backCode = `<NPageHeader title="页面标题" back-arrow @back="handleBack" />`
const iconCode = `<NPageHeader title="用户管理" icon="user" back-arrow @back="handleBack" />`
const breadcrumbCode = `<NPageHeader title="页面标题" :breadcrumb="[
  { label: '首页' }, { label: '组件' },
]" />`
const extraCode = `<NPageHeader title="页面标题">
  <template #extra>
    <NButton size="sm">取消</NButton>
    <NButton type="primary" size="sm">保存</NButton>
  </template>
</NPageHeader>`
const contentCode = `<NPageHeader title="页面标题">
  <template #default>内容区域</template>
  <template #footer>底部区域</template>
</NPageHeader>`

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
  { name: 'title', type: 'string', default: '—', desc: '页面标题（必填）' },
  { name: 'subtitle', type: 'string', default: '—', desc: '副标题' },
  { name: 'icon', type: 'string', default: '—', desc: '标题前的图标名' },
  { name: 'backArrow', type: 'boolean', default: 'false', desc: '是否显示返回按钮' },
  { name: 'breadcrumb', type: 'BreadcrumbItem[]', default: '—', desc: '面包屑数据' },
]

const eventData = [
  { name: 'back', type: '() => void', desc: '点击返回按钮时触发' },
]

const slotData = [
  { name: 'icon', desc: '自定义图标区域' },
  { name: 'breadcrumb', desc: '自定义面包屑区域' },
  { name: 'extra', desc: '操作区内容' },
  { name: 'default', desc: '主内容区' },
  { name: 'footer', desc: '底部区域' },
]
</script>
