<template>
  <div class="doc-page">
    <h1>Icon 图标</h1>
    <p class="doc-page__desc">基于 iconfont.cn 的图标组件，内置常用图标，支持自定义扩展。</p>

    <DemoBlock
      title="基础用法"
      description="通过 name 属性引用内置图标："
      :code="basicCode"
    >
      <div style="display:flex; gap:16px; align-items:center;">
        <NIcon name="sousuo" :size="24" color="#3b82f6" />
        <NIcon name="dianzan" :size="24" color="#10b981" />
        <NIcon name="shanchu" :size="24" color="#ef4444" />
        <NIcon name="chenggong" :size="24" color="#8b5cf6" />
        <NIcon name="shouye" :size="24" color="#f59e0b" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="图标大小"
      description="通过 size 属性设置图标大小，支持数字(px)和字符串："
      :code="sizeCode"
    >
      <div style="display:flex; gap:16px; align-items:center;">
        <NIcon name="sousuo" :size="16" />
        <NIcon name="sousuo" :size="24" />
        <NIcon name="sousuo" :size="32" />
        <NIcon name="sousuo" :size="48" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="旋转与动画"
      description="通过 rotate 设置旋转角度，通过 spin 开启旋转动画："
      :code="rotateCode"
    >
      <div style="display:flex; gap:24px; align-items:center;">
        <NIcon name="sousuo" :size="24" :rotate="90" />
        <NIcon name="sousuo" :size="24" :rotate="180" />
        <NIcon name="shuaxin" :size="24" spin />
        <NIcon name="shuaxin" :size="24" spin color="#3b82f6" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="图标颜色"
      description="通过 color 属性自定义图标颜色："
      :code="colorCode"
    >
      <div style="display:flex; gap:16px; align-items:center;">
        <NIcon name="sousuo" :size="24" color="#3b82f6" />
        <NIcon name="sousuo" :size="24" color="#10b981" />
        <NIcon name="sousuo" :size="24" color="#f59e0b" />
        <NIcon name="sousuo" :size="24" color="#ef4444" />
        <NIcon name="sousuo" :size="24" color="#8b5cf6" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义 SVG"
      description="通过默认插槽传入自定义 SVG 路径内容："
      :code="slotCode"
    >
      <div style="display:flex; gap:16px; align-items:center;">
        <NIcon :size="24" color="#3b82f6">
          <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" />
          <path d="M24 16V24" stroke-width="5" />
          <circle cx="24" cy="32" r="2" fill="currentColor" stroke="none" />
        </NIcon>
      </div>
    </DemoBlock>

    <DemoBlock title="自定义图标" description="用户可通过配置额外加载自己的 iconfont 图标：" :code="customCode">
      <div style="padding:16px; background:#f9fafb; border-radius:8px; font-size:14px; line-height:1.8;">
        <p><strong>1.</strong> 在 <a href="https://www.iconfont.cn" target="_blank">iconfont.cn</a> 创建项目，添加图标</p>
        <p><strong>2.</strong> 选择「Symbol」模式，复制 JS 链接</p>
        <p><strong>3.</strong> 在 nuxt.config.ts 中配置 iconfontUrl</p>
        <p><strong>4.</strong> 使用 <code>&lt;NIcon name="your-icon" /&gt;</code> 引用自定义图标</p>
      </div>
    </DemoBlock>

    <h2>内置图标一览</h2>
    <p class="doc-page__desc">点击图标可复制名称，共 {{ names.length }} 个内置图标。</p>

    <div class="icon-grid">
      <div
        v-for="name in names"
        :key="name"
        class="icon-grid__item"
        :title="`点击复制: ${name}`"
        @click="copyName(name)"
      >
        <NIcon :name="name" :size="28" />
        <span class="icon-grid__label">{{ name }}</span>
      </div>
    </div>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const names = useIconNames()

const basicCode = `<NIcon name="sousuo" :size="24" color="#3b82f6" />
<NIcon name="dianzan" :size="24" color="#10b981" />
<NIcon name="shanchu" :size="24" color="#ef4444" />`

const sizeCode = `<NIcon name="sousuo" :size="16" />
<NIcon name="sousuo" :size="24" />
<NIcon name="sousuo" :size="32" />
<NIcon name="sousuo" :size="48" />`

const rotateCode = `<NIcon name="sousuo" :size="24" :rotate="90" />
<NIcon name="sousuo" :size="24" :rotate="180" />
<NIcon name="shuaxin" :size="24" spin />`

const colorCode = `<NIcon name="sousuo" :size="24" color="#3b82f6" />
<NIcon name="sousuo" :size="24" color="#10b981" />
<NIcon name="sousuo" :size="24" color="#f59e0b" />`

const slotCode = `<NIcon :size="24" color="#3b82f6">
  <path d="M24 44C35..." />
  <path d="M24 16V24" stroke-width="5" />
</NIcon>`

const customCode = `// nuxt.config.ts
nacrDesign: {
  // 内置图标默认可用
  // iconfontUrl 用于额外加载自定义图标
  iconfontUrl: '//at.alicdn.com/t/c/xxxxx.js',
}`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'name', type: 'string', default: '-', desc: '图标名称，对应 iconfont 中的 font_class' },
  { name: 'size', type: 'number | string', default: "'1em'", desc: '图标大小，数字为 px，字符串如 "24px"、"1.5em"' },
  { name: 'rotate', type: 'number', default: '0', desc: '旋转角度' },
  { name: 'spin', type: 'boolean', default: 'false', desc: '是否旋转动画' },
  { name: 'color', type: 'string', default: 'inherit', desc: '图标颜色' },
]

function copyName(name: string) {
  navigator.clipboard.writeText(name)
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.icon-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-grid__item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.icon-grid__label {
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
}

.icon-grid__item:hover .icon-grid__label {
  color: #3b82f6;
}
</style>
