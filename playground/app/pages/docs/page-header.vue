<template>
  <div class="doc-page">
    <h1>PageHeader 页头</h1>
    <p class="doc-page__desc">页头位于页容器顶部，用于展示页面标题、面包屑导航以及操作区。Title 标题组件适用于卡片标题等轻量标题场景。</p>

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

    <h2 style="margin-top:32px;">Title 标题</h2>
    <p class="doc-page__desc">轻量标题组件，适用于卡片标题、区块标题等场景。支持图标、副标题、右侧额外区域。</p>

    <DemoBlock title="基础用法" description="设置 text 属性显示标题文字，level 控制层级大小。" :code="titleBasicCode">
      <NTitle text="大标题" level="h1" />
      <NTitle text="次标题" level="h2" />
      <NTitle text="小标题" level="h3" />
      <NTitle text="四级标题" level="h4" />
    </DemoBlock>

    <DemoBlock title="带副标题" description="设置 sub 属性在标题右侧显示补充说明。" :code="titleSubCode">
      <NTitle text="项目进度" sub="2026 年度" />
      <NTitle text="用户管理" sub="共 128 人" level="h4" />
    </DemoBlock>

    <DemoBlock title="带图标" description="设置 icon 属性在标题前显示图标。" :code="titleIconCode">
      <NTitle text="通知中心" icon="bell" />
      <NTitle text="数据统计" icon="chart" level="h4" />
    </DemoBlock>

    <DemoBlock title="额外区域" description="通过 extra 插槽在标题右侧添加操作按钮等内容。" :code="titleExtraCode">
      <NTitle text="团队成员">
        <template #extra>
          <NButton type="primary" size="sm">添加成员</NButton>
        </template>
      </NTitle>
    </DemoBlock>

    <DemoBlock title="卡片标题场景" description="Title 组件最常见的场景：作为 Card 或区块的标题头部。" :code="titleCardCode">
      <NCard title="">
        <template #header>
          <NTitle text="订单详情" sub="202606270001" icon="file-text">
            <template #extra>
              <NTag type="primary" size="sm">进行中</NTag>
            </template>
          </NTitle>
        </template>
        <p style="margin:0;color:var(--n-color-text-secondary);">订单内容区域…</p>
      </NCard>
    </DemoBlock>

    <DemoBlock title="下划线与斜体" description="设置 underline 显示下划线，italic 显示斜体。" :code="titleStyleCode">
      <NTitle text="重点强调" underline />
      <NTitle text="备注说明" italic :bold="false" />
    </DemoBlock>

    <DemoBlock title="尺寸" description="设置 size 控制标题大小，sm/md/lg 对应 13px/14px/16px。" :code="titleSizeCode">
      <NTitle text="小尺寸" size="sm" />
      <NTitle text="中尺寸" size="md" />
      <NTitle text="大尺寸" size="lg" />
    </DemoBlock>

    <ApiTable title="PageHeader Props" :columns="propColumns" :data="phPropData" />
    <ApiTable title="PageHeader Events" :columns="eventColumns" :data="phEventData" />
    <ApiTable title="PageHeader Slots" :columns="slotColumns" :data="phSlotData" />

    <ApiTable title="Title Props" :columns="propColumns" :data="titlePropData" />
    <ApiTable title="Title Slots" :columns="slotColumns" :data="titleSlotData" />
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

// ====== Title 示例代码 ======
const titleBasicCode = `<NTitle text="大标题" level="h1" />
<NTitle text="次标题" level="h2" />
<NTitle text="小标题" level="h3" />
<NTitle text="四级标题" level="h4" />`

const titleSubCode = `<NTitle text="项目进度" sub="2026 年度" />
<NTitle text="用户管理" sub="共 128 人" level="h4" />`

const titleIconCode = `<NTitle text="通知中心" icon="bell" />
<NTitle text="数据统计" icon="chart" level="h4" />`

const titleExtraCode = `<NTitle text="团队成员">
  <template #extra>
    <NButton type="primary" size="sm">添加成员</NButton>
  </template>
</NTitle>`

const titleCardCode = `<NCard>
  <template #header>
    <NTitle text="订单详情" sub="202606270001" icon="file-text">
      <template #extra>
        <NTag type="primary" size="sm">进行中</NTag>
      </template>
    </NTitle>
  </template>
  订单内容区域…
</NCard>`

const titleStyleCode = `<NTitle text="重点强调" underline />
<NTitle text="备注说明" italic :bold="false" />`

const titleSizeCode = `<NTitle text="小尺寸" size="sm" />
<NTitle text="中尺寸" size="md" />
<NTitle text="大尺寸" size="lg" />`

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

// ====== PageHeader API ======
const phPropData = [
  { name: 'title', type: 'string', default: '—', desc: '页面标题（必填）' },
  { name: 'subtitle', type: 'string', default: '—', desc: '副标题' },
  { name: 'icon', type: 'string', default: '—', desc: '标题前的图标名' },
  { name: 'backArrow', type: 'boolean', default: 'false', desc: '是否显示返回按钮' },
  { name: 'breadcrumb', type: 'BreadcrumbItem[]', default: '—', desc: '面包屑数据' },
]

const phEventData = [
  { name: 'back', type: '() => void', desc: '点击返回按钮时触发' },
]

const phSlotData = [
  { name: 'icon', desc: '自定义图标区域' },
  { name: 'breadcrumb', desc: '自定义面包屑区域' },
  { name: 'extra', desc: '操作区内容' },
  { name: 'default', desc: '主内容区' },
  { name: 'footer', desc: '底部区域' },
]

// ====== Title API ======
const titlePropData = [
  { name: 'text', type: 'string', default: '—', desc: '标题文字' },
  { name: 'level', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", default: "'h3'", desc: '标题层级，控制文字大小' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '标题尺寸，sm=13px / md=14px / lg=16px' },
  { name: 'sub', type: 'string', default: '—', desc: '副标题文字，显示在标题右侧' },
  { name: 'icon', type: 'string', default: '—', desc: '标题前的图标名' },
  { name: 'bold', type: 'boolean', default: 'true', desc: '是否加粗' },
  { name: 'underline', type: 'boolean', default: 'false', desc: '是否显示下划线' },
  { name: 'italic', type: 'boolean', default: 'false', desc: '是否斜体' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用状态（灰色文字）' },
]

const titleSlotData = [
  { name: 'default', desc: '标题文字内容（替代 text 属性）' },
  { name: 'icon', desc: '自定义图标区域' },
  { name: 'sub', desc: '自定义副标题区域' },
  { name: 'extra', desc: '右侧额外区域（如操作按钮、标签等）' },
]
</script>
