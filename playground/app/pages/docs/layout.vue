<template>
  <div class="doc-page">
    <h1>Layout 布局</h1>
    <p class="doc-page__desc">页面布局组件，支持顶部导航、侧边栏、内容区和底部栏组合。</p>

    <DemoBlock title="基础布局" description="典型的上中下布局结构。" :code="basicCode">
      <div style="border:1px solid var(--n-color-border);border-radius:var(--n-radius-lg);overflow:hidden;">
        <NLayout direction="vertical">
          <NLayoutHeader>
            <div class="layout-demo-header">Header</div>
          </NLayoutHeader>
          <NLayoutContent>
            <div class="layout-demo-content">Content</div>
          </NLayoutContent>
          <NLayoutFooter>
            <div class="layout-demo-footer">Footer</div>
          </NLayoutFooter>
        </NLayout>
      </div>
    </DemoBlock>

    <DemoBlock title="侧边栏布局" description="带可折叠侧边栏的布局。" :code="siderCode">
      <div style="border:1px solid var(--n-color-border);border-radius:var(--n-radius-lg);overflow:hidden;height:240px;">
        <NLayout direction="horizontal">
          <NLayoutSider :collapsed="siderCollapsed" collapsible :width="180" :collapsed-width="60" @update:collapsed="siderCollapsed = $event">
            <div class="layout-demo-sider">{{ siderCollapsed ? 'S' : 'Sider' }}</div>
          </NLayoutSider>
          <NLayout direction="vertical" style="flex:1">
            <NLayoutHeader>
              <div class="layout-demo-header">Header</div>
            </NLayoutHeader>
            <NLayoutContent>
              <div class="layout-demo-content">Content</div>
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </div>
    </DemoBlock>

    <ApiTable title="NLayout Props" :columns="propColumns" :data="layoutPropData" />
    <ApiTable title="NLayoutSider Props" :columns="propColumns" :data="siderPropData" />
    <ApiTable title="NLayoutSider Events" :columns="eventColumns" :data="siderEventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const siderCollapsed = ref(false)

const basicCode = `<NLayout direction="vertical">
  <NLayoutHeader>Header</NLayoutHeader>
  <NLayoutContent>Content</NLayoutContent>
  <NLayoutFooter>Footer</NLayoutFooter>
</NLayout>`

const siderCode = `<NLayout direction="horizontal">
  <NLayoutSider v-model:collapsed="collapsed" collapsible :width="180" :collapsed-width="60">
    Sider
  </NLayoutSider>
  <NLayout direction="vertical" style="flex:1">
    <NLayoutHeader>Header</NLayoutHeader>
    <NLayoutContent>Content</NLayoutContent>
  </NLayout>
</NLayout>`

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

const layoutPropData = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'vertical'", desc: '布局方向' },
  { name: 'tag', type: 'string', default: "'div'", desc: '渲染标签' },
  { name: 'gap', type: 'number', default: '0', desc: '间距(px)' },
  { name: 'wrap', type: 'boolean', default: 'true', desc: '是否换行' },
]

const siderPropData = [
  { name: 'width', type: 'number', default: '240', desc: '侧边栏宽度(px)' },
  { name: 'collapsedWidth', type: 'number', default: '64', desc: '折叠后宽度(px)' },
  { name: 'collapsed', type: 'boolean', default: 'false', desc: '是否折叠' },
  { name: 'collapsible', type: 'boolean', default: 'false', desc: '是否可折叠' },
]

const siderEventData = [
  { name: 'update:collapsed', type: '(val: boolean) => void', desc: '折叠状态变化时触发' },
]
</script>

<style scoped>
.layout-demo-header { padding: 12px 24px; background: var(--n-color-fill); font-weight: 600; font-size: var(--n-font-size-sm); }
.layout-demo-content { padding: 32px 24px; color: var(--n-color-text-secondary); font-size: var(--n-font-size-sm); }
.layout-demo-footer { padding: 12px 24px; background: var(--n-color-fill); font-size: var(--n-font-size-xs); color: var(--n-color-text-disabled); }
.layout-demo-sider { padding: 24px 16px; background: var(--n-color-fill-hover); color: var(--n-color-text-secondary); font-size: var(--n-font-size-sm); height: 100%; display: flex; align-items: center; justify-content: center; }
</style>
