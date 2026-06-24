<template>
  <div class="home">
    <section class="home__hero">
      <div class="home__hero-bg">
        <div class="home__orb home__orb--1" />
        <div class="home__orb home__orb--2" />
        <div class="home__orb home__orb--3" />
        <div class="home__gp" />
      </div>
      <div class="home__hero-inner">
        <div class="home__badge"><span class="home__bd" /> v{{ version }} 已发布</div>
        <h1 class="home__title">Nacr Design</h1>
        <p class="home__sub">基于 Nuxt 3/4 的企业级 Vue 组件库</p>
        <p class="home__desc">80+ 高质量组件 · ECharts 图表 · TypeScript · 自动导入 · 主题定制</p>
        <div class="home__acts">
          <NuxtLink to="/docs/start" class="home__btn home__btn--p">快速开始 →</NuxtLink>
          <NuxtLink to="/docs/button" class="home__btn home__btn--o">浏览组件</NuxtLink>
          <a href="https://gitee.com/wuaxcn/nacr-design" target="_blank" rel="noopener"
            class="home__btn home__btn--g">Gitee</a>
          <a href="https://github.com/nacrcn/Nacr-Design" target="_blank" rel="noopener"
            class="home__btn home__btn--g">GitHub</a>
        </div>
        <div class="home__stats">
          <div class="home__st"><span class="home__sn">80+</span><span class="home__sl">组件</span></div>
          <div class="home__sd" />
          <div class="home__st"><span class="home__sn">10+</span><span class="home__sl">组合式函数</span></div>
          <div class="home__sd" />
          <div class="home__st"><span class="home__sn">TS</span><span class="home__sl">类型完整</span></div>
        </div>
      </div>
    </section>

    <section class="home__sc">
      <div class="home__sh">
        <h2>组件一览</h2>
        <p>丰富的组件，覆盖各类业务场景</p>
      </div>
      <div class="home__sc-card">
        <div class="home__sg">
          <div class="home__sgt">通用</div>
          <div class="home__sr">
            <NButton type="primary" size="sm">主要按钮</NButton>
            <NButton variant="outline" size="sm">描边</NButton>
            <NButton variant="link" size="sm">链接</NButton>
            <NButton type="danger" size="sm">危险</NButton>
            <NButton variant="ghost" size="sm">幽灵</NButton>
            <NButton size="sm" loading>加载</NButton>
            <NButton circle variant="outline" size="sm"><template #icon>
                <NIcon name="sousuo" />
              </template>
            </NButton>
          </div>
        </div>
        <div class="home__sg">
          <div class="home__sgt">数据录入</div>
          <div class="home__sr" style="flex-wrap:wrap">
            <NInput v-model="inputVal" placeholder="请输入..." size="sm" clearable style="width:180px" />
            <NInputNumber v-model="numVal" size="sm" style="width:140px" />
            <NSelect v-model="selectVal" :options="selectOpts" size="sm" placeholder="选择" style="width:130px" />
            <NSwitch v-model="switchVal" size="sm" />
            <NCheckbox v-model="checkVal" size="sm">同意</NCheckbox>
            <NRate v-model="rateVal" size="sm" />
          </div>
        </div>
        <div class="home__sg">
          <div class="home__sgt">数据展示</div>
          <div class="home__sr" style="flex-wrap:wrap;gap:12px">
            <div style="display:flex;gap:6px;align-items:center">
              <NTag type="primary" size="sm">主要</NTag>
              <NTag type="success" size="sm">成功</NTag>
              <NTag type="warning" size="sm">警告</NTag>
              <NTag type="danger" size="sm">危险</NTag>
            </div>
            <NBadge :count="5">
              <div class="home__bx" />
            </NBadge>
            <NAvatar alt="N" size="sm" />
            <NAvatar alt="Li" size="sm" :color="'#f56a00'" />
            <NAvatar alt="W" size="sm" :color="'#7265e6'" />
            <NProgress :percent="72" :height="6" style="width:120px" />
          </div>
          <div class="home__sr" style="margin-top:12px;gap:18px">
            <NStatistic label="用户" :value="12893" type="primary" size="sm" trend="up" trend-text="12%" />
            <NStatistic label="营收" :value="89240" prefix="¥" size="sm" trend="up" trend-text="8%" type="success" />
          </div>
        </div>
        <div class="home__sg">
          <div class="home__sgt">导航</div>
          <div class="home__sr">
            <NSteps :items="stepItems" :current="2" size="sm" />
          </div>
          <div class="home__sr" style="margin-top:10px">
            <NTabs v-model="tabVal" :tabs="tabItems" size="sm" />
          </div>
        </div>
        <div class="home__sg">
          <div class="home__sgt">反馈</div>
          <div class="home__sr" style="flex-wrap:wrap;gap:10px">
            <NAlert type="success" size="sm" :closable="false">操作成功</NAlert>
            <NAlert type="warning" size="sm" :closable="false">请注意</NAlert>
            <NAlert type="error" size="sm" :closable="false">操作失败</NAlert>
            <NSpin :size="24" />
          </div>
          <div class="home__sr" style="margin-top:10px;gap:10px">
            <NProgress type="circle" :percent="75" :size="44" :stroke-width="5" />
            <NProgress type="dashboard" :percent="60" :size="44" :stroke-width="5" />
          </div>
        </div>
        <div class="home__sg">
          <div class="home__sgt">更多组件</div>
          <div class="home__stw">
            <NuxtLink v-for="c in more" :key="c.n" :to="c.p" class="home__stg">{{ c.n }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="home__ft">
      <div class="home__sh">
        <h2>核心能力</h2>
        <p>为现代 Web 应用量身打造</p>
      </div>
      <div class="home__g3">
        <div class="home__fi" v-for="f in feats" :key="f.t">
          <div class="home__fic" :style="{ background: f.bg }">
            <div v-html="f.ic" />
          </div>
          <h3>{{ f.t }}</h3>
          <p>{{ f.d }}</p>
        </div>
      </div>
    </section>

    <section class="home__ct">
      <div class="home__sh">
        <h2>组件分类</h2>
        <p>按场景划分，快速定位所需组件</p>
      </div>
      <div class="home__g3">
        <div class="home__ci" v-for="c in cats" :key="c.t">
          <div class="home__cih"><span class="home__cie">{{ c.e }}</span>
            <h3>{{ c.t }}</h3>
            <NTag size="sm" type="primary" effect="light" round>{{ c.items.length }}</NTag>
          </div>
          <div class="home__cii">
            <NuxtLink v-for="i in c.items" :key="i.name" :to="i.path" class="home__cil">{{ i.name }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="home__cd">
      <div class="home__sh">
        <h2>极简上手</h2>
        <p>两步集成，开箱即用</p>
      </div>
      <div class="home__cdg">
        <div class="home__cdb">
          <div class="home__cdl">1. 安装</div>
          <pre><code>npm install nacr-design</code></pre>
        </div>
        <div class="home__cdb">
          <div class="home__cdl">2. 注册模块</div>
          <pre><code>// nuxt.config.ts
          export default defineNuxtConfig({
          modules: ['nacr-design']
          })</code></pre>
        </div>
      </div>
      <div class="home__cdb home__cdb--f" style="margin-top:16px">
        <div class="home__cdl">3. 组件和 Composables 自动导入，直接使用</div>
        <pre><code>&lt;template&gt;
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
        &lt;/script&gt;</code></pre>
      </div>
    </section>

    <section class="home__cta">
      <h2>开始构建你的下一个项目</h2>
      <p>开源免费，MIT 许可 · 欢迎在 Gitee / GitHub 上点亮 Star ⭐</p>
      <div class="home__acts">
        <NuxtLink to="/docs/start" class="home__btn home__btn--p">立即开始 →</NuxtLink><a
          href="https://gitee.com/wuaxcn/nacr-design" target="_blank" rel="noopener"
          class="home__btn home__btn--o">Gitee</a><a href="https://github.com/nacrcn/Nacr-Design" target="_blank"
          rel="noopener" class="home__btn home__btn--o">GitHub</a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ layout: 'doc' })

useSeoMeta({
  title: 'Nacr Design - 基于 Nuxt 3/4 的企业级 Vue 3 组件库',
  description: 'Nacr Design 提供 80+ 高质量组件、ECharts 图表、TypeScript 完整支持、主题定制，一行配置集成 Nuxt 项目，开箱即用。',
})

const { data: vd } = await useFetch<{ version: string }>('/api/npm-version')
const version = computed(() => vd.value?.version || '0.1.0')
const inputVal = ref(''), numVal = ref(5), switchVal = ref(true), checkVal = ref(true), rateVal = ref(3), selectVal = ref(''), tabVal = ref('a')
const selectOpts = [{ label: '选项一', value: '1' }, { label: '选项二', value: '2' }, { label: '选项三', value: '3' }]
const stepItems = [{ title: '创建' }, { title: '配置' }, { title: '完成' }]
const tabItems = [{ label: '概览', name: 'a', key: 'a' }, { label: '设置', name: 'b', key: 'b' }, { label: '日志', name: 'c', key: 'c' }]

const more = [
  { n: 'Modal 对话框', p: '/docs/modal' }, { n: 'Drawer 抽屉', p: '/docs/drawer' }, { n: 'Tooltip 文字提示', p: '/docs/tooltip' },
  { n: 'Tour 漫游引导', p: '/docs/tour' }, { n: 'Skeleton 骨架屏', p: '/docs/skeleton' }, { n: 'Table 表格', p: '/docs/table' },
  { n: 'Form 表单', p: '/docs/form' }, { n: 'DatePicker 日期', p: '/docs/date-picker' }, { n: 'Upload 上传', p: '/docs/upload' },
  { n: 'Menu 菜单', p: '/docs/menu' }, { n: 'Layout 布局', p: '/docs/layout' }, { n: 'Watermark 水印', p: '/docs/watermark' },
  { n: 'Chart 图表', p: '/docs/chart' }, { n: 'ColorPicker 颜色', p: '/docs/color-picker' }, { n: 'OrgChart 组织架构', p: '/docs/organization-chart' },
  { n: 'CodeEditor', p: '/docs/code-editor' },
]

const feats = [
  { t: 'Nuxt 原生', d: '一行配置集成，组件和 Composables 全自动导入，完整 SSR 支持。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>', bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  { t: 'TypeScript 优先', d: '完整类型推导，Props 自动补全，开发体验一流。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', bg: 'linear-gradient(135deg,#3178c6,#235a97)' },
  { t: 'ECharts 图表', d: '内置 NChart 组件与 useChart 组合式函数，按需加载零配置。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', bg: 'linear-gradient(135deg,#10b981,#059669)' },
  { t: '主题定制', d: 'CSS 变量架构，覆盖变量即定制主题色、圆角、间距。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { t: '组合式函数', d: 'useToggle / useLoading / useMessage / useNotification / useChart 等。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', bg: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  { t: 'Markdown 支持', d: '内置 Markdown 编辑器与渲染组件，适用于文档站、博客场景。', ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', bg: 'linear-gradient(135deg,#ef4444,#dc2626)' },
]

const cats = [
  { e: '🎨', t: '通用', items: [{ name: 'Button 按钮', path: '/docs/button' }, { name: 'Icon 图标', path: '/docs/icon' }, { name: 'Divider 分割线', path: '/docs/divider' }] },
  { e: '✏️', t: '数据录入', items: [{ name: 'Input', path: '/docs/input' }, { name: 'Select', path: '/docs/select' }, { name: 'Checkbox', path: '/docs/checkbox' }, { name: 'Switch', path: '/docs/switch' }, { name: 'Upload', path: '/docs/upload' }, { name: 'Form', path: '/docs/form' }, { name: 'Slider', path: '/docs/slider' }, { name: 'Rate', path: '/docs/rate' }, { name: 'DatePicker', path: '/docs/date-picker' }, { name: 'ColorPicker', path: '/docs/color-picker' }] },
  { e: '📊', t: '数据展示', items: [{ name: 'Table', path: '/docs/table' }, { name: 'Tag', path: '/docs/tag' }, { name: 'Badge', path: '/docs/badge' }, { name: 'Card', path: '/docs/card' }, { name: 'Statistic', path: '/docs/statistic' }, { name: 'Chart', path: '/docs/chart' }, { name: 'Avatar', path: '/docs/avatar' }, { name: 'Descriptions', path: '/docs/descriptions' }, { name: 'Timeline', path: '/docs/timeline' }] },
  { e: '🧭', t: '导航', items: [{ name: 'Menu', path: '/docs/menu' }, { name: 'Breadcrumb', path: '/docs/breadcrumb' }, { name: 'Steps', path: '/docs/steps' }, { name: 'Dropdown', path: '/docs/dropdown' }, { name: 'Pagination', path: '/docs/pagination' }, { name: 'Tabs', path: '/docs/tabs' }] },
  { e: '💬', t: '反馈', items: [{ name: 'Alert', path: '/docs/alert' }, { name: 'Modal', path: '/docs/modal' }, { name: 'Drawer', path: '/docs/drawer' }, { name: 'Notification', path: '/docs/notification' }, { name: 'Progress', path: '/docs/progress' }, { name: 'Result', path: '/docs/result' }, { name: 'Spin', path: '/docs/spin' }, { name: 'Skeleton', path: '/docs/skeleton' }, { name: 'Tour', path: '/docs/tour' }, { name: 'Tooltip', path: '/docs/tooltip' }] },
  { e: '📐', t: '布局', items: [{ name: 'Layout', path: '/docs/layout' }, { name: 'Grid', path: '/docs/grid' }, { name: 'Space', path: '/docs/space' }, { name: 'Split', path: '/docs/split' }, { name: 'Watermark', path: '/docs/watermark' }, { name: 'Affix', path: '/docs/affix' }] },
]
</script>

<style scoped>
.home {
  margin: 0 -48px
}

/* Hero */
.home__hero {
  position: relative;
  padding: 100px 24px 80px;
  text-align: center;
  overflow: hidden
}

.home__hero-bg {
  position: absolute;
  inset: 0;
  /* background: linear-gradient(165deg, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%); */
  z-index: 0
}

.home__gp {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, .3) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: .5
}

.home__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: .4;
  animation: fl 8s ease-in-out infinite
}

.home__orb--1 {
  width: 420px;
  height: 420px;
  background: rgba(255, 255, 255, .5);
  top: -120px;
  left: 10%
}

.home__orb--2 {
  width: 320px;
  height: 320px;
  background: rgba(147, 197, 253, .6);
  top: -60px;
  right: 15%;
  animation-delay: -3s
}

.home__orb--3 {
  width: 240px;
  height: 240px;
  background: rgba(96, 165, 250, .5);
  bottom: -40px;
  left: 40%;
  animation-delay: -5s
}

@keyframes fl {

  0%,
  100% {
    transform: translateY(0) scale(1)
  }

  50% {
    transform: translateY(-24px) scale(1.05)
  }
}

.home__hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto
}

.home__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, .35);
  color: #1e293b;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, .4);
  backdrop-filter: blur(12px)
}

.home__bd {
  width: 6px;
  height: 6px;
  background: #1d4ed8;
  border-radius: 50%;
  animation: pl 2s ease-in-out infinite
}

@keyframes pl {

  0%,
  100% {
    opacity: 1
  }

  50% {
    opacity: .4
  }
}

.home__title {
  font-size: 60px;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #1e3a5f, #1e40af, #1d4ed8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px
}

.home__sub {
  font-size: 22px;
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 8px
}

.home__desc {
  font-size: 15px;
  color: #334155;
  margin-bottom: 36px
}

.home__acts {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap
}

.home__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  transition: all .25s;
  text-decoration: none
}

.home__btn--p {
  background: #1d4ed8;
  color: #fff;
  box-shadow: 0 4px 14px rgba(29, 78, 216, .4)
}

.home__btn--p:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(29, 78, 216, .5);
  color: #fff
}

.home__btn--o {
  border: 1px solid rgba(30, 58, 93, .25);
  color: #1e3a5f;
  background: rgba(255, 255, 255, .5);
  backdrop-filter: blur(8px)
}

.home__btn--o:hover {
  border-color: #3b82f6;
  color: #1d4ed8;
  background: rgba(255, 255, 255, .7)
}

.home__btn--g {
  border: 1px solid rgba(30, 58, 93, .15);
  color: #334155;
  background: rgba(255, 255, 255, .25);
  backdrop-filter: blur(8px)
}

.home__btn--g:hover {
  border-color: #3b82f6;
  color: #1d4ed8;
  background: rgba(255, 255, 255, .5)
}

.home__stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(30, 58, 93, .12)
}

.home__st {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px
}

.home__sn {
  font-size: 24px;
  font-weight: 800;
  color: #1e3a5f
}

.home__sl {
  font-size: 12px;
  color: #475569
}

.home__sd {
  width: 1px;
  height: 32px;
  background: rgba(30, 58, 93, .15)
}

/* Shared */
.home__sh {
  text-align: center;
  margin-bottom: 44px
}

.home__sh h2 {
  font-size: 30px;
  font-weight: 700;
  color: var(--n-color-text, #1e293b);
  margin-bottom: 8px
}

.home__sh p {
  font-size: 15px;
  color: var(--n-color-text-secondary, #64748b)
}

.home__g3 {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px
}

/* Showcase */
.home__sc {
  padding: 80px 24px
}

.home__sc-card {
  max-width: 1120px;
  margin: 0 auto;
  background: var(--n-color-bg, #fff);
  border: 1px solid var(--n-color-border, #e2e8f0);
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .04), 0 8px 24px rgba(0, 0, 0, .03)
}

.home__sg {
  padding: 20px 0;
  border-bottom: 1px solid var(--n-color-border, #e2e8f0)
}

.home__sg:last-child {
  border-bottom: none;
  padding-bottom: 0
}

.home__sg:first-child {
  padding-top: 0
}

.home__sgt {
  font-size: 12px;
  font-weight: 600;
  color: var(--n-color-text-tertiary, #9ca3af);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 12px
}

.home__sr {
  display: flex;
  align-items: center;
  gap: 8px
}

.home__bx {
  width: 40px;
  height: 40px;
  background: var(--n-color-fill, #f1f5f9);
  border-radius: 6px
}

.home__stw {
  display: flex;
  flex-wrap: wrap;
  gap: 6px
}

.home__stg {
  padding: 4px 12px;
  background: var(--n-color-fill, #f1f5f9);
  border-radius: 6px;
  font-size: 12px;
  color: var(--n-color-text-secondary, #475569);
  text-decoration: none;
  transition: all .2s
}

.home__stg:hover {
  background: var(--n-color-primary-light, #dbeafe);
  color: var(--n-color-primary, #3b82f6)
}

/* Features */
.home__ft {
  background: var(--n-color-fill, #f8fafc);
  padding: 80px 24px
}

.home__fi {
  padding: 28px;
  background: var(--n-color-bg, #fff);
  border: 1px solid var(--n-color-border, #e2e8f0);
  border-radius: 12px;
  transition: all .3s
}

.home__fi:hover {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 8px 24px rgba(59, 130, 246, .08);
  transform: translateY(-4px)
}

.home__fic {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 14px
}

.home__fi h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--n-color-text, #1e293b)
}

.home__fi p {
  font-size: 13px;
  color: var(--n-color-text-secondary, #64748b);
  line-height: 1.7
}

/* Categories */
.home__ct {
  padding: 80px 24px
}

.home__ci {
  padding: 22px;
  border: 1px solid var(--n-color-border, #e2e8f0);
  border-radius: 12px;
  transition: border-color .2s
}

.home__ci:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd)
}

.home__cih {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px
}

.home__cih h3 {
  font-size: 15px;
  font-weight: 600;
  flex: 1
}

.home__cie {
  font-size: 18px
}

.home__cii {
  display: flex;
  flex-wrap: wrap;
  gap: 6px
}

.home__cil {
  padding: 3px 10px;
  background: var(--n-color-fill, #f1f5f9);
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  text-decoration: none;
  transition: all .2s
}

.home__cil:hover {
  background: var(--n-color-primary-light, #dbeafe);
  color: var(--n-color-primary-hover, #2563eb)
}

/* Code */
.home__cd {
  background: var(--n-color-fill, #f8fafc);
  padding: 80px 24px
}

.home__cdg {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px
}

.home__cdb {
  background: #1e293b;
  border-radius: 12px;
  padding: 22px;
  overflow-x: auto
}

.home__cdb--f {
  max-width: 1120px;
  margin: 0 auto;
  grid-column: span 2
}

.home__cdl {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 10px
}

.home__cdb pre {
  margin: 0
}

.home__cdb code {
  font-family: 'Consolas', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #e2e8f0;
  white-space: pre
}

/* CTA */
.home__cta {
  text-align: center;
  padding: 80px 24px;
  background: linear-gradient(180deg, var(--n-color-bg, #fff) 0%, var(--n-color-primary-light, #eff6ff) 100%)
}

.home__cta h2 {
  font-size: 30px;
  font-weight: 700;
  color: var(--n-color-text, #1e293b);
  margin-bottom: 8px
}

.home__cta p {
  font-size: 15px;
  color: var(--n-color-text-secondary, #64748b);
  margin-bottom: 28px
}

/* Responsive */
@media(max-width:900px) {
  .home {
    margin: 0 -16px
  }

  .home__g3,
  .home__cdg {
    grid-template-columns: repeat(2, 1fr)
  }

  .home__cdb--f {
    grid-column: span 2
  }

  .home__title {
    font-size: 40px
  }

  .home__stats {
    gap: 16px
  }
}

@media(max-width:640px) {

  .home__g3,
  .home__cdg {
    grid-template-columns: 1fr
  }

  .home__cdb--f {
    grid-column: span 1
  }

  .home__stats {
    flex-wrap: wrap;
    gap: 12px
  }
}
</style>
