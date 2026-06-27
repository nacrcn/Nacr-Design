<template>
  <div class="doc-page">
    <h1>Icon 图标</h1>
    <p class="doc-page__desc">基于 iconfont.cn 的图标组件，内置 {{ names.length }} 个图标，支持 Symbol 模式、Font Class 模式和自定义 SVG。</p>

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
      title="Font Class 模式"
      description="通过 fontClass 属性使用 iconfont Font Class 模式："
      :code="fontClassCode"
    >
      <div style="display:flex; gap:16px; align-items:center;">
        <NIcon fontClass="icon-sousuo" :size="24" color="#3b82f6" />
        <NIcon fontClass="icon-dianzan" :size="24" color="#10b981" />
        <NIcon fontClass="icon-shouye" :size="24" color="#f59e0b" />
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

    <div class="icon-category">
      <h3>搜索 / 发现</h3>
      <div class="icon-search">
        <input v-model="searchQuery" placeholder="搜索图标名称..." class="icon-search__input" />
      </div>
    </div>

    <template v-for="cat in filteredCategories" :key="cat.label">
      <h3 class="icon-cat-title">{{ cat.label }}（{{ cat.icons.length }}）</h3>
      <div class="icon-grid">
        <div
          v-for="name in cat.icons"
          :key="name"
          :class="['icon-grid__item', { 'icon-grid__item--copied': copiedName === name }]"
          @click="copyName(name)"
        >
          <NIcon :name="name" :size="28" />
          <span class="icon-grid__label">{{ copiedName === name ? '✓ 已复制' : name }}</span>
        </div>
      </div>
    </template>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const names = useIconNames()
const searchQuery = ref('')

const categories = [
  { label: '社交 / 互动', icons: ['aixin', 'aixin1', 'dianzan', 'dianzan1', 'dianzan2', 'guanzhu', 'buganxingqu', 'shoucang', 'shoucang1', 'shoucang2', 'pengyouquan', 'weibo', 'weixin', 'fenxiang', 'pinglun', 'pinglun1', 'huati', 'huati1', 'huatifuhao', 'saoyisao'] },
  { label: '媒体 / 娱乐', icons: ['dianying', 'dianying1', 'dianyingpiao', 'dianyingpiao1', 'ertongpiao', 'bofangjilu', 'xiangkan', 'yixiangkan', 'tupian', 'xiangji', 'xiangji1', 'xiaojuchang', 'yanchu', 'xiaoshi', 'yingchengka', 'yingyuan', 'lanqiu', 'youxishoubing'] },
  { label: '生活 / 服务', icons: ['hongbao', 'lihe', 'lipinka', 'maiyizengyi', 'youhuiquan', 'qianbao', 'yinhangka', 'yinhangyouhui', 'wuyefei', 'huodong', 'duihuan', 'remen', 'mingxinghuodong', 'gongyi', 'fankui', 'wenjuan', 'wenda', 'yuding', 'qupiao'] },
  { label: '用户 / 身份', icons: ['wode', 'wode1', 'wodeguanzhu', 'huiyuan', 'huiyuan1', 'qinghuiyuan', 'mima', 'anquan', 'zhiwen', 'nan', 'nv', 'shouji', 'shouji1', 'dianhua', 'dianhua1'] },
  { label: '状态 / 反馈', icons: ['chenggong', 'chenggong1', 'shibai', 'shibai1', 'tanhao', 'tanhao1', 'tishi', 'shandian', 'shandian1', 'xitongfanmang', 'gonggao', 'caidan', 'riqian', 'rili'] },
  { label: '操作 / 工具', icons: ['bianji', 'chuangzuo', 'chuangzuo1', 'fuzhi', 'dingwei', 'dingwei1', 'dingwei2', 'gengduo', 'gengduo2', 'jianshao', 'jianshao1', 'zengjia', 'zengjia1', 'shanchu', 'shanchu1', 'shaixuan', 'shuaxin', 'sousuo', 'shangchuan', 'xiazai', 'dakai', 'shezhi'] },
  { label: '通用 / 界面', icons: ['shouye', 'shouye1', 'faxian', 'faxian1', 'shijian', 'shijian1', 'shuju', 'shuju1', 'yanjing', 'yanjing1', 'diantong_guan', 'diantong_kai', 'WIFI', 'wuwifi', 'ditu', 'TOP', 'Dyanjing', 'shequ', 'shequ1', 'taolunqu'] },
  { label: '创意 / 装饰', icons: ['sahua', 'pintu', 'lifangjingti', 'jiangbei', 'huangguan', 'dajuan', 'ceshi', 'jiju'] },
  { label: '英文 / 技术', icons: ['chengxuwenti_bug', 'a-3D', 'Shield', 'a-QuestionMarkCircle', 'a-ScreenFull', 'a-ScreenNormal', 'a-TrendDown', 'a-TrendUp', 'Headphone', 'cube-outline', 'link', 'pie-chart-02', 'link-broken-01', 'quanqiu_xinjiapo'] },
]

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories
  return categories
    .map(cat => ({
      ...cat,
      icons: cat.icons.filter(name => name.toLowerCase().includes(q)),
    }))
    .filter(cat => cat.icons.length > 0)
})

const basicCode = `<NIcon name="sousuo" :size="24" color="#3b82f6" />
<NIcon name="dianzan" :size="24" color="#10b981" />
<NIcon name="shanchu" :size="24" color="#ef4444" />`

const fontClassCode = `<!-- Font Class 模式：使用 iconfont 的 class 名 -->
<NIcon fontClass="icon-sousuo" :size="24" color="#3b82f6" />
<NIcon fontClass="icon-dianzan" :size="24" color="#10b981" />`

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
  { name: 'name', type: 'string', default: '-', desc: '图标名称，对应 iconfont 中的 font_class（Symbol 模式）' },
  { name: 'fontClass', type: 'string', default: '-', desc: 'Font Class 名称，如 "icon-search"（Font Class 模式）' },
  { name: 'size', type: 'number | string', default: "'1em'", desc: '图标大小，数字为 px，字符串如 "24px"、"1.5em"' },
  { name: 'rotate', type: 'number', default: '0', desc: '旋转角度' },
  { name: 'spin', type: 'boolean', default: 'false', desc: '是否旋转动画' },
  { name: 'color', type: 'string', default: 'inherit', desc: '图标颜色' },
]

const copiedName = ref('')

function copyName(name: string) {
  navigator.clipboard.writeText(name)
  copiedName.value = name
  setTimeout(() => { if (copiedName.value === name) copiedName.value = '' }, 1500)
}
</script>

<style scoped>
.icon-search {
  margin-bottom: 24px;
}

.icon-search__input {
  width: 100%;
  max-width: 400px;
  padding: 8px 14px;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-md, 6px);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.icon-search__input:focus {
  border-color: var(--n-color-primary, #3b82f6);
}

.icon-cat-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--n-color-text);
  margin: 24px 0 12px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
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

.icon-grid__item--copied {
  border-color: #10b981;
  background: #ecfdf5;
  color: #10b981;
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

.icon-grid__item--copied .icon-grid__label {
  color: #10b981;
  font-weight: 500;
}
</style>
