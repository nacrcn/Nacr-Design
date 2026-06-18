<template>
  <div class="doc-page">
    <h1>Statistic 统计数值</h1>
    <p class="doc-page__desc">突出展示某个或某组数字，支持趋势标识、色彩类型、数字动画、加载态等，常用于数据看板和仪表盘。</p>

    <DemoBlock title="基础用法" description="设置 label 和 value 展示统计数值，precision 控制小数位数，separator 控制千分位分隔符。" :code="basicCode">
      <NSpace :gap="48">
        <NStatistic label="活跃用户" :value="93120" />
        <NStatistic label="总订单" :value="280000" />
        <NStatistic label="转化率" :value="12.5" :precision="1" suffix="%" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="提供 sm / md / lg 三种尺寸。" :code="sizeCode">
      <NSpace :gap="48" align="end">
        <NStatistic label="小尺寸" :value="1234" size="sm" />
        <NStatistic label="中尺寸（默认）" :value="1234" size="md" />
        <NStatistic label="大尺寸" :value="1234" size="lg" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="色彩类型" description="通过 type 设置不同颜色语义：default / primary / success / warning / danger。" :code="typeCode">
      <NSpace :gap="48">
        <NStatistic label="默认" :value="1200" type="default" />
        <NStatistic label="主要" :value="1200" type="primary" />
        <NStatistic label="成功" :value="1200" type="success" />
        <NStatistic label="警告" :value="1200" type="warning" />
        <NStatistic label="危险" :value="1200" type="danger" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="前缀和后缀" description="使用 prefix 和 suffix 属性或同名插槽添加前后缀。" :code="prefixCode">
      <NSpace :gap="48">
        <NStatistic label="总收入" :value="56800" prefix="¥" />
        <NStatistic label="增长率" :value="8.3" :precision="1" suffix="%" />
        <NStatistic label="评分" :value="4.8" :precision="1">
          <template #suffix>
            <span style="color:#faad14">★</span>
          </template>
        </NStatistic>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="趋势标识" description="通过 trend 设置上升或下降趋势，trend-text 设置趋势描述文字。" :code="trendCode">
      <NSpace :gap="48">
        <NStatistic label="周销量" :value="93120" trend="up" trend-text="较上周 +12.5%" />
        <NStatistic label="退货率" :value="3.2" :precision="1" suffix="%" trend="down" trend-text="较上月 -2.1%" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="数字动画" description="设置 animation 开启数字滚动动画，animation-duration 控制动画时长（毫秒）。" :code="animationCode">
      <NSpace :gap="24" align="end">
        <NStatistic label="用户总量" :value="animValue" animation :animation-duration="1200" />
        <NButton size="sm" @click="randomValue">随机数值</NButton>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="加载状态" description="设置 loading 属性展示骨架屏加载效果。" :code="loadingCode">
      <NSpace :gap="48">
        <NStatistic label="正常状态" :value="8800" />
        <NStatistic label="加载中" :value="0" loading />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义标签与底部" description="使用 #label 和 #footer 插槽自定义标签和底部内容。" :code="slotCode">
      <NSpace :gap="48">
        <NStatistic :value="2568" prefix="¥">
          <template #label>
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="var(--n-color-primary)" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              本月收入
            </span>
          </template>
          <template #footer>
            <span style="color:var(--n-color-success);font-size:12px;">↑ 12% 较上月</span>
          </template>
        </NStatistic>
        <NStatistic :value="1286" suffix="人">
          <template #label>
            <span style="display:inline-flex;align-items:center;gap:4px;">
              <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="var(--n-color-success)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              新增用户
            </span>
          </template>
          <template #footer>
            <span style="color:var(--n-color-text-tertiary);font-size:12px;">数据更新于 10 分钟前</span>
          </template>
        </NStatistic>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="在卡片中使用" description="搭配 Card 组件构建数据看板，是最常见的业务场景。" :code="combineCode">
      <div class="dashboard-grid">
        <NCard v-for="item in dashboardItems" :key="item.label" hoverable>
          <NStatistic
            :label="item.label"
            :value="item.value"
            :prefix="item.prefix"
            :suffix="item.suffix"
            :precision="item.precision"
            :trend="item.trend"
            :trend-text="item.trendText"
            :type="item.type"
          />
        </NCard>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// 动画演示
const animValue = ref(93120)
function randomValue() {
  animValue.value = Math.floor(Math.random() * 99999) + 1000
}

// 看板数据
const dashboardItems = [
  { label: '总用户', value: 126800, prefix: '', suffix: '', precision: 0, trend: 'up' as const, trendText: '+8.2%', type: 'default' as const },
  { label: '总收入', value: 256800, prefix: '¥', suffix: '', precision: 0, trend: 'up' as const, trendText: '+15.3%', type: 'primary' as const },
  { label: '订单量', value: 9420, prefix: '', suffix: '单', precision: 0, trend: 'up' as const, trendText: '+5.1%', type: 'success' as const },
  { label: '退货率', value: 2.3, prefix: '', suffix: '%', precision: 1, trend: 'down' as const, trendText: '-1.2%', type: 'warning' as const },
]

// 代码字符串
const basicCode = `<NStatistic label="活跃用户" :value="93120" />
<NStatistic label="总订单" :value="280000" />
<NStatistic label="转化率" :value="12.5" :precision="1" suffix="%" />`

const sizeCode = `<NStatistic label="小尺寸" :value="1234" size="sm" />
<NStatistic label="中尺寸（默认）" :value="1234" size="md" />
<NStatistic label="大尺寸" :value="1234" size="lg" />`

const typeCode = `<NStatistic label="默认" :value="1200" type="default" />
<NStatistic label="主要" :value="1200" type="primary" />
<NStatistic label="成功" :value="1200" type="success" />
<NStatistic label="警告" :value="1200" type="warning" />
<NStatistic label="危险" :value="1200" type="danger" />`

const prefixCode = `<NStatistic label="总收入" :value="56800" prefix="¥" />
<NStatistic label="增长率" :value="8.3" :precision="1" suffix="%" />

<!-- 使用插槽 -->
<NStatistic label="评分" :value="4.8" :precision="1">
  <template #suffix>
    <span style="color:#faad14">★</span>
  </template>
</NStatistic>`

const trendCode = `<NStatistic
  label="周销量"
  :value="93120"
  trend="up"
  trend-text="较上周 +12.5%"
/>
<NStatistic
  label="退货率"
  :value="3.2"
  :precision="1"
  suffix="%"
  trend="down"
  trend-text="较上月 -2.1%"
/>`

const animationCode = `<NStatistic
  label="用户总量"
  :value="animValue"
  animation
  :animation-duration="1200"
/>
<NButton size="sm" @click="randomValue">随机数值</NButton>`

const loadingCode = `<NStatistic label="正常状态" :value="8800" />
<NStatistic label="加载中" :value="0" loading />`

const slotCode = `<NStatistic :value="2568" prefix="¥">
  <template #label>
    <span>本月收入</span>
  </template>
  <template #footer>
    <span style="color:var(--n-color-success);">↑ 12% 较上月</span>
  </template>
</NStatistic>`

const combineCode = `<NCard hoverable>
  <NStatistic
    label="总用户"
    :value="126800"
    trend="up"
    trend-text="+8.2%"
  />
</NCard>
<NCard hoverable>
  <NStatistic
    label="总收入"
    :value="256800"
    prefix="¥"
    trend="up"
    trend-text="+15.3%"
    type="primary"
  />
</NCard>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'label', type: 'string', default: '—', desc: '标题文本' },
  { name: 'value', type: 'number', default: '—', desc: '数值（必填）' },
  { name: 'prefix', type: 'string', default: '—', desc: '前缀文本' },
  { name: 'suffix', type: 'string', default: '—', desc: '后缀文本' },
  { name: 'precision', type: 'number', default: '0', desc: '小数精度' },
  { name: 'separator', type: 'boolean', default: 'true', desc: '是否显示千分位分隔符' },
  { name: 'type', type: "'default' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'", desc: '色彩类型' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'trend', type: "'up' | 'down' | 'none'", default: "'none'", desc: '趋势方向' },
  { name: 'trendText', type: 'string', default: '—', desc: '趋势描述文字' },
  { name: 'animation', type: 'boolean', default: 'false', desc: '是否开启数字滚动动画' },
  { name: 'animationDuration', type: 'number', default: '1000', desc: '动画时长（毫秒）' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否显示加载状态' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'label', desc: '自定义标签内容' },
  { name: 'prefix', desc: '自定义前缀内容' },
  { name: 'suffix', desc: '自定义后缀内容' },
  { name: 'footer', desc: '底部额外内容' },
]
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-width: 900px;
}
</style>
