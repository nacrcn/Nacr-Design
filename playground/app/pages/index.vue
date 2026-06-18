<template>
  <div class="home">
    <!-- Hero -->
    <section class="home__hero">
      <div class="home__hero-bg">
        <div class="home__orb home__orb--1" />
        <div class="home__orb home__orb--2" />
      </div>
      <div class="home__hero-inner">
        <div class="home__badge"><span class="home__badge-dot" /> v{{ version }} 已发布</div>
        <h1 class="home__title">Nacr Design</h1>
        <p class="home__subtitle">基于 Nuxt 3/4 的企业级 Vue 组件库</p>
        <p class="home__desc">80+ 高质量组件 · ECharts 图表 · TypeScript · 自动导入 · 主题定制</p>
        <div class="home__actions">
          <NuxtLink to="/docs/start" class="home__btn home__btn--primary">快速开始 →</NuxtLink>
          <NuxtLink to="/docs/button" class="home__btn home__btn--outline">浏览组件</NuxtLink>
        </div>
      </div>
    </section>

    <!-- 组件展示 -->
    <section class="home__showcase">
      <div class="home__section-header"><h2>组件一览</h2><p>丰富的组件，覆盖各类业务场景</p></div>
      <div class="home__grid3">
        <NCard variant="shadow" hoverable>
          <template #header>Button 按钮</template>
          <div class="home__row"><NButton variant="primary" size="sm">主要</NButton><NButton variant="secondary" size="sm">次要</NButton><NButton variant="danger" size="sm">危险</NButton><NButton variant="ghost" size="sm">幽灵</NButton></div>
          <div class="home__row" style="margin-top:8px"><NButton variant="primary" size="sm" loading>加载中</NButton><NButton variant="primary" size="sm" disabled>禁用</NButton></div>
        </NCard>
        <NCard variant="shadow" hoverable>
          <template #header>Tag 标签</template>
          <div class="home__row" style="flex-wrap:wrap;gap:6px"><NTag type="primary" size="sm">主要</NTag><NTag type="success" size="sm">成功</NTag><NTag type="warning" size="sm">警告</NTag><NTag type="danger" size="sm">危险</NTag></div>
          <div class="home__row" style="margin-top:8px;gap:6px"><NTag type="primary" effect="dark" size="sm" round>实心</NTag><NTag type="success" effect="outlined" size="sm" round>描边</NTag><NTag type="warning" effect="plain" size="sm" round>朴素</NTag></div>
        </NCard>
        <NCard variant="shadow" hoverable>
          <template #header>Input 输入框</template>
          <NInput v-model="inputVal" placeholder="请输入内容..." size="sm" clearable style="margin-bottom:8px" />
          <NInput model-value="" size="sm" error="请输入有效邮箱" label="邮箱" required />
        </NCard>
        <NCard variant="shadow" hoverable>
          <template #header>Switch & Progress</template>
          <div class="home__row" style="gap:14px;margin-bottom:12px"><NSwitch v-model="switchVal" size="sm" /><NSwitch size="sm" checked-text="开" unchecked-text="关" :model-value="true" /></div>
          <NProgress :percent="72" :height="6" />
          <div style="margin-top:10px;display:flex;gap:12px"><NProgress type="circle" :percent="75" :size="44" :stroke-width="5" /><NProgress type="dashboard" :percent="60" :size="44" :stroke-width="5" /></div>
        </NCard>
        <NCard variant="shadow" hoverable>
          <template #header>Badge & Avatar</template>
          <div class="home__row" style="gap:18px;margin-bottom:12px"><NBadge :count="5"><div class="home__box" /></NBadge><NBadge :count="99" type="primary"><div class="home__box" /></NBadge><NBadge dot><div class="home__box" /></NBadge></div>
          <div class="home__row" style="gap:6px"><NAvatar alt="N" size="sm" show-indicator indicator-status="online" /><NAvatar alt="Li" size="sm" :color="'#f56a00'" /><NAvatar alt="W" size="sm" :color="'#7265e6'" /><NAvatar alt="Z" size="sm" :color="'#ffbf00'" shape="square" /></div>
        </NCard>
        <NCard variant="shadow" hoverable>
          <template #header>Statistic 统计</template>
          <div class="home__stat-row"><NStatistic label="活跃用户" :value="12893" type="primary" size="sm" trend="up" trend-text="12.5%" /><NStatistic label="今日营收" :value="89240" prefix="¥" size="sm" trend="up" trend-text="8.2%" type="success" /></div>
          <div class="home__stat-row" style="margin-top:10px"><NStatistic label="退货率" :value="2.3" suffix="%" :precision="1" size="sm" trend="down" trend-text="0.5%" type="success" /><NStatistic label="待处理" :value="17" size="sm" type="warning" /></div>
        </NCard>
      </div>
    </section>

    <!-- 核心能力 -->
    <section class="home__features">
      <div class="home__section-header"><h2>核心能力</h2><p>为现代 Web 应用量身打造</p></div>
      <div class="home__grid3">
        <div class="home__feature" v-for="f in features" :key="f.title">
          <div class="home__feature-icon" :style="{ background: f.bg }"><div v-html="f.icon" /></div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 组件分类 -->
    <section class="home__categories">
      <div class="home__section-header"><h2>组件分类</h2><p>按场景划分，快速定位所需组件</p></div>
      <div class="home__grid3">
        <div class="home__cat" v-for="cat in categories" :key="cat.title">
          <div class="home__cat-header"><span class="home__cat-emoji">{{ cat.emoji }}</span><h3>{{ cat.title }}</h3><NTag size="sm" type="primary" effect="light" round>{{ cat.items.length }}</NTag></div>
          <div class="home__cat-items">
            <NuxtLink v-for="item in cat.items" :key="item.name" :to="item.path" class="home__cat-item">{{ item.name }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 代码示例 -->
    <section class="home__code">
      <div class="home__section-header"><h2>极简上手</h2><p>两步集成，开箱即用</p></div>
      <div class="home__code-grid">
        <div class="home__code-block"><div class="home__code-label">1. 安装</div><pre><code>npm install nacr-design</code></pre></div>
        <div class="home__code-block"><div class="home__code-label">2. 注册模块</div><pre><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nacr-design']
})</code></pre></div>
      </div>
      <div class="home__code-block home__code-block--full" style="margin-top:16px"><div class="home__code-label">3. 组件和 Composables 自动导入，直接使用</div><pre><code>&lt;template&gt;
  &lt;NButton variant="primary" @click="submit"&gt;提交&lt;/NButton&gt;
  &lt;NChart :option="chartOption" height="300" /&gt;
&lt;/template&gt;

&lt;script setup&gt;
const { withLoading } = useLoading()
const { success } = useMessage()

async function submit() {
  await withLoading(() => fetch('/api/submit'))
  success('提交成功！')
}
&lt;/script&gt;</code></pre></div>
    </section>

    <!-- CTA -->
    <section class="home__cta">
      <h2>开始构建你的下一个项目</h2>
      <p>开源免费，MIT 许可</p>
      <div class="home__actions">
        <NuxtLink to="/docs/start" class="home__btn home__btn--primary">立即开始 →</NuxtLink>
        <a href="https://github.com/nacr/nacr-design" target="_blank" class="home__btn home__btn--outline">GitHub</a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ layout: 'doc' })

const version = '0.1.0'
const inputVal = ref('')
const switchVal = ref(true)

const features = [
  { title: 'Nuxt 原生', desc: '一行配置集成，组件和 Composables 全自动导入，完整 SSR 支持。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>', bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  { title: 'TypeScript 优先', desc: '完整类型推导，Props 自动补全，开发体验一流。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', bg: 'linear-gradient(135deg,#3178c6,#235a97)' },
  { title: 'ECharts 图表', desc: '内置 NChart 组件与 useChart 组合式函数，按需加载零配置。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', bg: 'linear-gradient(135deg,#10b981,#059669)' },
  { title: '主题定制', desc: 'CSS 变量架构，覆盖变量即定制主题色、圆角、间距。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', bg: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  { title: '组合式函数', desc: 'useToggle / useLoading / useMessage / useNotification / useChart 等。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { title: 'Markdown 支持', desc: '内置 Markdown 编辑器与渲染组件，适用于文档站、博客场景。', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', bg: 'linear-gradient(135deg,#ec4899,#be185d)' },
]

const categories = [
  { emoji: '🎨', title: '基础', items: [{ name: 'Button', path: '/docs/button' }, { name: 'Icon', path: '/docs/icon' }, { name: 'Divider', path: '/docs/divider' }, { name: 'Space', path: '/docs/space' }, { name: 'Grid', path: '/docs/grid' }] },
  { emoji: '✏️', title: '数据录入', items: [{ name: 'Input', path: '/docs/input' }, { name: 'Select', path: '/docs/select' }, { name: 'Checkbox', path: '/docs/checkbox' }, { name: 'Switch', path: '/docs/switch' }, { name: 'Upload', path: '/docs/upload' }, { name: 'Form', path: '/docs/form' }] },
  { emoji: '📊', title: '数据展示', items: [{ name: 'Table', path: '/docs/table' }, { name: 'Tag', path: '/docs/tag' }, { name: 'Badge', path: '/docs/badge' }, { name: 'Card', path: '/docs/card' }, { name: 'Statistic', path: '/docs/statistic' }, { name: 'Chart', path: '/docs/chart' }] },
  { emoji: '🧭', title: '导航', items: [{ name: 'Menu', path: '/docs/menu' }, { name: 'Breadcrumb', path: '/docs/breadcrumb' }, { name: 'Steps', path: '/docs/steps' }, { name: 'Dropdown', path: '/docs/dropdown' }, { name: 'Pagination', path: '/docs/pagination' }] },
  { emoji: '💬', title: '反馈', items: [{ name: 'Alert', path: '/docs/alert' }, { name: 'Modal', path: '/docs/modal' }, { name: 'Drawer', path: '/docs/drawer' }, { name: 'Notification', path: '/docs/notification' }, { name: 'Progress', path: '/docs/progress' }, { name: 'Result', path: '/docs/result' }] },
  { emoji: '📐', title: '布局', items: [{ name: 'Layout', path: '/docs/layout' }, { name: 'Space', path: '/docs/space' }, { name: 'Split', path: '/docs/split' }, { name: 'Watermark', path: '/docs/watermark' }] },
]
</script>

<style scoped>
.home { margin: 0 -48px; }

/* Hero */
.home__hero { position: relative; padding: 100px 24px 80px; text-align: center; overflow: hidden; }
.home__hero-bg { position: absolute; inset: 0; background: linear-gradient(180deg,#0f172a,#1e293b); z-index: 0; }
.home__orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; animation: float 8s ease-in-out infinite; }
.home__orb--1 { width: 400px; height: 400px; background: #3b82f6; top: -120px; left: 10%; }
.home__orb--2 { width: 300px; height: 300px; background: #8b5cf6; top: -60px; right: 15%; animation-delay: -3s; }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

.home__hero-inner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; }
.home__badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(59,130,246,0.15); color: #60a5fa; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px; border: 1px solid rgba(59,130,246,0.25); }
.home__badge-dot { width: 6px; height: 6px; background: #3b82f6; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
.home__title { font-size: 60px; font-weight: 800; letter-spacing: -2px; background: linear-gradient(135deg,#60a5fa,#a78bfa,#34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px; }
.home__subtitle { font-size: 22px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.home__desc { font-size: 15px; color: #94a3b8; margin-bottom: 36px; }

.home__actions { display: flex; gap: 14px; justify-content: center; }
.home__btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; transition: all .25s; text-decoration: none; }
.home__btn--primary { background: linear-gradient(135deg,#3b82f6,#6366f1); color: #fff; box-shadow: 0 4px 14px rgba(59,130,246,0.4); }
.home__btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59,130,246,0.5); color: #fff; }
.home__btn--outline { border: 1px solid rgba(148,163,184,0.3); color: #e2e8f0; background: rgba(255,255,255,0.05); }
.home__btn--outline:hover { border-color: #60a5fa; color: #60a5fa; }

/* Sections */
.home__section-header { text-align: center; margin-bottom: 44px; }
.home__section-header h2 { font-size: 30px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.home__section-header p { font-size: 15px; color: #64748b; }

.home__grid3 { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }

/* Showcase */
.home__showcase { padding: 80px 24px; }
.home__row { display: flex; align-items: center; gap: 8px; }
.home__box { width: 40px; height: 40px; background: #e2e8f0; border-radius: 6px; }
.home__stat-row { display: flex; gap: 24px; }

/* Features */
.home__features { background: #f8fafc; padding: 80px 24px; }
.home__feature { padding: 28px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; transition: all .3s; }
.home__feature:hover { border-color: #3b82f6; box-shadow: 0 8px 24px rgba(59,130,246,0.08); transform: translateY(-4px); }
.home__feature-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin-bottom: 14px; }
.home__feature h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: #1e293b; }
.home__feature p { font-size: 13px; color: #64748b; line-height: 1.7; }

/* Categories */
.home__categories { padding: 80px 24px; }
.home__cat { padding: 22px; border: 1px solid #e2e8f0; border-radius: 12px; transition: border-color .2s; }
.home__cat:hover { border-color: #93c5fd; }
.home__cat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.home__cat-header h3 { font-size: 15px; font-weight: 600; flex: 1; }
.home__cat-emoji { font-size: 18px; }
.home__cat-items { display: flex; flex-wrap: wrap; gap: 6px; }
.home__cat-item { padding: 3px 10px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #475569; text-decoration: none; transition: all .2s; }
.home__cat-item:hover { background: #dbeafe; color: #2563eb; }

/* Code */
.home__code { background: #f8fafc; padding: 80px 24px; }
.home__code-grid { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
.home__code-block { background: #1e293b; border-radius: 12px; padding: 22px; overflow-x: auto; }
.home__code-block--full { max-width: 1120px; margin: 0 auto; grid-column: span 2; }
.home__code-label { font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 10px; }
.home__code-block pre { margin: 0; }
.home__code-block code { font-family: 'Consolas','Fira Code',monospace; font-size: 13px; line-height: 1.8; color: #e2e8f0; white-space: pre; }

/* CTA */
.home__cta { text-align: center; padding: 80px 24px; }
.home__cta h2 { font-size: 30px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.home__cta p { font-size: 15px; color: #64748b; margin-bottom: 28px; }

/* Responsive */
@media (max-width: 900px) {
  .home { margin: 0 -16px; }
  .home__grid3, .home__code-grid { grid-template-columns: repeat(2,1fr); }
  .home__code-block--full { grid-column: span 2; }
  .home__title { font-size: 40px; }
}
@media (max-width: 640px) {
  .home__grid3, .home__code-grid { grid-template-columns: 1fr; }
  .home__code-block--full { grid-column: span 1; }
}
</style>
