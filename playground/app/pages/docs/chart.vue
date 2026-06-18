<template>
  <div class="doc-page">
    <h1>Chart 图表</h1>
    <p class="doc-page__desc">基于 ECharts 封装的可视化图表组件，支持折线图、柱状图、饼图、雷达图、散点图等常见图表类型，内置自适应容器与加载状态。</p>

    <DemoBlock title="基础折线图" description="通过 option 传入 ECharts 配置项，自动初始化并渲染图表。" :code="lineCode">
      <NChart :option="lineOption" height="320px" />
    </DemoBlock>

    <DemoBlock title="渐变柱状图" description="柱状图搭配渐变色和圆角，展示更现代的视觉风格。" :code="barCode">
      <NChart :option="barOption" height="320px" />
    </DemoBlock>

    <DemoBlock title="环形饼图" description="使用饼图展示占比数据，支持南丁格尔图（玫瑰图）模式。" :code="pieCode">
      <NChart :option="pieOption" height="380px" />
    </DemoBlock>

    <DemoBlock title="雷达图" description="雷达图常用于多维数据对比，如能力评估、指标分析等场景。" :code="radarCode">
      <NChart :option="radarOption" height="360px" />
    </DemoBlock>

    <DemoBlock title="散点图" description="用散点图展示数据的分布情况与相关性。" :code="scatterCode">
      <NChart :option="scatterOption" height="360px" />
    </DemoBlock>

    <DemoBlock title="仪表盘" description="仪表盘适合展示进度、完成率等单一指标的达标情况。" :code="gaugeCode">
      <NChart :option="gaugeOption" height="320px" />
    </DemoBlock>

    <DemoBlock title="加载状态" description="设置 loading 属性显示加载动画，动态数据加载完成后关闭。" :code="loadingCode">
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <NButton size="sm" @click="toggleLoading">{{ loadingChart ? '加载完成' : '模拟加载' }}</NButton>
      </div>
      <NChart :option="loadingOption" :loading="loadingChart" height="320px" />
    </DemoBlock>

    <DemoBlock title="多系列折线 + 柱状混合图" description="在同一图表中组合折线与柱状系列，对比趋势与量级。" :code="mixedCode">
      <NChart :option="mixedOption" height="380px" />
    </DemoBlock>

    <DemoBlock title="数据看板" description="多个图表组合形成完整的数据看板视图，模拟真实业务场景。" :code="dashboardCode">
      <div class="chart-dashboard">
        <div class="chart-dashboard__row">
          <div class="chart-dashboard__card">
            <NChart :option="dashLineOption" height="260px" />
          </div>
          <div class="chart-dashboard__card">
            <NChart :option="dashPieOption" height="260px" />
          </div>
        </div>
        <div class="chart-dashboard__full">
          <NChart :option="dashBarOption" height="300px" />
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="响应式" description="默认开启 autoresize，图表随容器尺寸自动调整。拖动浏览器窗口查看效果。" :code="responsiveCode">
      <NChart :option="lineOption" height="280px" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Methods (via ref)" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

/* ============ 基础折线图 ============ */
const lineOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisTick: { show: false },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#6b7280' },
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59,130,246,0.25)' },
            { offset: 1, color: 'rgba(59,130,246,0.02)' },
          ],
        },
      },
      lineStyle: { width: 3, color: '#3b82f6' },
      itemStyle: { color: '#3b82f6', borderWidth: 2, borderColor: '#fff' },
    },
  ],
})

const lineCode = `<template>
  <NChart :option="option" height="320px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [{
    name: '访问量', type: 'line', smooth: true,
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    areaStyle: { opacity: 0.15 },
    lineStyle: { width: 3 }, itemStyle: { color: '#3b82f6' },
  }],
})
<\/script>`

/* ============ 渐变柱状图 ============ */
const barOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 50, right: 20, top: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisTick: { show: false },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#6b7280' },
  },
  series: [
    {
      type: 'bar',
      barWidth: '45%',
      data: [320, 302, 301, 334, 390, 330, 320, 280],
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#60a5fa' },
            { offset: 1, color: '#3b82f6' },
          ],
        },
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#93c5fd' },
              { offset: 1, color: '#2563eb' },
            ],
          },
        },
      },
    },
  ],
})

const barCode = `<template>
  <NChart :option="option" height="320px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'category',
    data: ['1月','2月','3月','4月','5月','6月','7月','8月'],
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar', barWidth: '45%',
    data: [320, 302, 301, 334, 390, 330, 320, 280],
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#3b82f6' }],
      },
    },
  }],
})
<\/script>`

/* ============ 环形饼图 ============ */
const pieOption = ref({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 10, itemWidth: 12, itemHeight: 12, textStyle: { color: '#6b7280' } },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      roseType: 'area',
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
      label: { show: true, formatter: '{b}\n{d}%', color: '#374151', fontSize: 12 },
      labelLine: { length: 16, length2: 12 },
      data: [
        { value: 1048, name: '搜索引擎', itemStyle: { color: '#3b82f6' } },
        { value: 735, name: '直接访问', itemStyle: { color: '#10b981' } },
        { value: 580, name: '邮件营销', itemStyle: { color: '#f59e0b' } },
        { value: 484, name: '联盟广告', itemStyle: { color: '#ef4444' } },
        { value: 300, name: '视频广告', itemStyle: { color: '#8b5cf6' } },
      ],
    },
  ],
})

const pieCode = `<template>
  <NChart :option="option" height="380px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 10 },
  series: [{
    name: '访问来源', type: 'pie',
    radius: ['35%', '65%'], roseType: 'area',
    itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' },
    ],
  }],
})
<\/script>`

/* ============ 雷达图 ============ */
const radarOption = ref({
  tooltip: {},
  legend: { bottom: 0, data: ['产品 A', '产品 B'], textStyle: { color: '#6b7280' } },
  radar: {
    indicator: [
      { name: '销售', max: 100 },
      { name: '管理', max: 100 },
      { name: '技术', max: 100 },
      { name: '客服', max: 100 },
      { name: '研发', max: 100 },
      { name: '市场', max: 100 },
    ],
    shape: 'circle',
    splitNumber: 4,
    axisName: { color: '#6b7280', fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.05)'] } },
    splitLine: { lineStyle: { color: '#e5e7eb' } },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [90, 70, 85, 60, 80, 72],
          name: '产品 A',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#3b82f6' },
          areaStyle: { color: 'rgba(59,130,246,0.15)' },
          itemStyle: { color: '#3b82f6' },
        },
        {
          value: [65, 85, 60, 90, 55, 88],
          name: '产品 B',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#10b981' },
          areaStyle: { color: 'rgba(16,185,129,0.15)' },
          itemStyle: { color: '#10b981' },
        },
      ],
    },
  ],
})

const radarCode = `<template>
  <NChart :option="option" height="360px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: {},
  legend: { bottom: 0, data: ['产品 A', '产品 B'] },
  radar: {
    indicator: [
      { name: '销售', max: 100 }, { name: '管理', max: 100 },
      { name: '技术', max: 100 }, { name: '客服', max: 100 },
      { name: '研发', max: 100 }, { name: '市场', max: 100 },
    ],
    shape: 'circle',
  },
  series: [{
    type: 'radar',
    data: [
      { value: [90, 70, 85, 60, 80, 72], name: '产品 A' },
      { value: [65, 85, 60, 90, 55, 88], name: '产品 B' },
    ],
  }],
})
<\/script>`

/* ============ 散点图 ============ */
function genScatter(n: number, cx: number, cy: number) {
  return Array.from({ length: n }, () => [
    +(cx + (Math.random() - 0.5) * 60).toFixed(1),
    +(cy + (Math.random() - 0.5) * 60).toFixed(1),
  ])
}
const scatterOption = ref({
  tooltip: {
    formatter: (p: any) => `${p.seriesName}<br/>X: ${p.data[0]}<br/>Y: ${p.data[1]}`,
  },
  grid: { left: 50, right: 20, top: 30, bottom: 40 },
  xAxis: {
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
  },
  series: [
    {
      name: '群体 A',
      type: 'scatter',
      symbolSize: 10,
      data: genScatter(40, 40, 60),
      itemStyle: { color: 'rgba(59,130,246,0.7)', borderColor: '#3b82f6', borderWidth: 1 },
    },
    {
      name: '群体 B',
      type: 'scatter',
      symbolSize: 10,
      data: genScatter(40, 70, 35),
      itemStyle: { color: 'rgba(16,185,129,0.7)', borderColor: '#10b981', borderWidth: 1 },
    },
  ],
})

const scatterCode = `<template>
  <NChart :option="option" height="360px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: {},
  xAxis: { splitLine: { show: true } },
  yAxis: {},
  series: [
    { name: '群体 A', type: 'scatter', symbolSize: 10, data: [...] },
    { name: '群体 B', type: 'scatter', symbolSize: 10, data: [...] },
  ],
})
<\/script>`

/* ============ 仪表盘 ============ */
const gaugeOption = ref({
  series: [
    {
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      progress: { show: true, width: 16, itemStyle: { color: '#3b82f6' } },
      axisLine: { lineStyle: { width: 16, color: [[1, '#e5e7eb']] } },
      axisTick: { show: false },
      splitLine: { length: 8, lineStyle: { width: 2, color: '#999' } },
      axisLabel: { distance: 22, color: '#6b7280', fontSize: 12 },
      pointer: { length: '55%', width: 6, itemStyle: { color: '#3b82f6' } },
      anchor: { show: true, size: 14, showAbove: true, itemStyle: { borderWidth: 6, borderColor: '#3b82f6', color: '#fff' } },
      title: { show: false },
      detail: { valueAnimation: true, fontSize: 28, fontWeight: 700, color: '#111827', offsetCenter: [0, '70%'], formatter: '{value}%' },
      data: [{ value: 72 }],
    },
  ],
})

const gaugeCode = `<template>
  <NChart :option="option" height="320px" />
</template>

<script setup lang="ts">
const option = ref({
  series: [{
    type: 'gauge',
    progress: { show: true, width: 16 },
    axisLine: { lineStyle: { width: 16 } },
    pointer: { itemStyle: { color: '#3b82f6' } },
    detail: { formatter: '{value}%' },
    data: [{ value: 72 }],
  }],
})
<\/script>`

/* ============ 加载状态 ============ */
const loadingChart = ref(false)
const loadingOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' },
  series: [{ name: '收入', type: 'line', smooth: true, data: [150, 230, 224, 218, 335, 410], lineStyle: { color: '#3b82f6' }, itemStyle: { color: '#3b82f6' } }],
})

function toggleLoading() {
  loadingChart.value = !loadingChart.value
}

const loadingCode = `<template>
  <NChart :option="option" :loading="loading" height="320px" />
  <NButton @click="loading = !loading">切换加载状态</NButton>
</template>

<script setup lang="ts">
const loading = ref(true)
const option = ref({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月'] },
  yAxis: { type: 'value' },
  series: [{ name: '收入', type: 'line', data: [150,230,224,218,335,410] }],
})
<\/script>`

/* ============ 多系列折线 + 柱状混合图 ============ */
const mixedOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999' } } },
  legend: { data: ['销售额', '增长率'], bottom: 0, textStyle: { color: '#6b7280' } },
  grid: { left: 60, right: 60, top: 40, bottom: 50 },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisTick: { show: false },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: [
    {
      type: 'value',
      name: '销售额(万)',
      nameTextStyle: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#6b7280' },
    },
    {
      type: 'value',
      name: '增长率(%)',
      nameTextStyle: { color: '#6b7280' },
      splitLine: { show: false },
      axisLabel: { color: '#6b7280' },
    },
  ],
  series: [
    {
      name: '销售额',
      type: 'bar',
      barWidth: '40%',
      data: [52, 68, 71, 84, 96, 113, 125, 118, 103, 92, 78, 65],
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#3b82f6' }],
        },
      },
    },
    {
      name: '增长率',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [8, 12, 15, 22, 28, 35, 32, 26, 18, 14, 10, 7],
      lineStyle: { width: 3, color: '#f59e0b' },
      itemStyle: { color: '#f59e0b', borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(245,158,11,0.2)' }, { offset: 1, color: 'rgba(245,158,11,0)' }],
        },
      },
    },
  ],
})

const mixedCode = `<template>
  <NChart :option="option" height="380px" />
</template>

<script setup lang="ts">
const option = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
  legend: { data: ['销售额', '增长率'] },
  xAxis: {
    type: 'category',
    data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  },
  yAxis: [
    { type: 'value', name: '销售额(万)' },
    { type: 'value', name: '增长率(%)' },
  ],
  series: [
    { name: '销售额', type: 'bar', data: [52,68,71,84,96,113,125,118,103,92,78,65] },
    { name: '增长率', type: 'line', yAxisIndex: 1, smooth: true,
      data: [8,12,15,22,28,35,32,26,18,14,10,7] },
  ],
})
<\/script>`

/* ============ 数据看板 ============ */
const dashLineOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: 45, right: 12, top: 24, bottom: 28 },
  xAxis: {
    type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { color: '#9ca3af', fontSize: 11 },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6' } }, axisLabel: { show: false } },
  series: [
    {
      type: 'line', smooth: true, symbol: 'none',
      data: [120, 180, 150, 220, 200, 280, 250],
      lineStyle: { width: 2.5, color: '#3b82f6' },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }],
        },
      },
    },
  ],
})

const dashPieOption = ref({
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie', radius: ['45%', '72%'], center: ['50%', '46%'],
      label: { show: true, position: 'center', formatter: '总计\n1,248', fontSize: 16, fontWeight: 700, color: '#111827', lineHeight: 22 },
      itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
      data: [
        { value: 580, name: '已完成', itemStyle: { color: '#3b82f6' } },
        { value: 368, name: '进行中', itemStyle: { color: '#f59e0b' } },
        { value: 300, name: '未开始', itemStyle: { color: '#e5e7eb' } },
      ],
    },
  ],
})

const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const dashBarOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { bottom: 0, textStyle: { color: '#6b7280', fontSize: 12 } },
  grid: { left: 50, right: 20, top: 20, bottom: 45 },
  xAxis: {
    type: 'category', data: months,
    axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { color: '#9ca3af' },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f3f4f6' } }, axisLabel: { color: '#9ca3af' } },
  series: [
    {
      name: '线上渠道', type: 'bar', stack: 'total', barWidth: '45%',
      data: [320, 302, 301, 334, 390, 330, 320, 280, 310, 350, 380, 400],
      itemStyle: { color: '#3b82f6' },
    },
    {
      name: '线下渠道', type: 'bar', stack: 'total',
      data: [120, 132, 101, 134, 90, 130, 110, 120, 140, 130, 120, 110],
      itemStyle: { color: '#93c5fd' },
    },
  ],
})

const dashboardCode = `<template>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <NChart :option="lineOption" height="260px" />
    <NChart :option="pieOption" height="260px" />
  </div>
  <NChart :option="barOption" height="300px" />
</template>

<script setup lang="ts">
// 多图表组合展示数据看板
const lineOption = ref({ ... })
const pieOption = ref({ ... })
const barOption = ref({ ... })
<\/script>`

/* ============ 响应式 ============ */
const responsiveCode = `<template>
  <NChart :option="option" height="280px" />
</template>

<script setup lang="ts">
// autoresize 默认为 true，图表随容器自动调整尺寸
const option = ref({ ... })
<\/script>`

/* ============ API 表格 ============ */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'option', type: 'EChartsOption', default: '-', desc: 'ECharts 配置项' },
  { name: 'width', type: 'string | number', default: "'100%'", desc: '图表宽度' },
  { name: 'height', type: 'string | number', default: '400', desc: '图表高度，数字为 px' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否显示加载状态' },
  { name: 'loadingText', type: 'string', default: "'加载中...'", desc: '加载状态文字' },
  { name: 'theme', type: 'string | object', default: '-', desc: 'ECharts 主题' },
  { name: 'autoresize', type: 'boolean', default: 'true', desc: '是否自动响应容器尺寸变化' },
  { name: 'manualUpdate', type: 'boolean', default: 'false', desc: '手动控制 setOption 更新' },
  { name: 'renderer', type: "'canvas' | 'svg'", default: "'canvas'", desc: '渲染模式' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'params', title: '回调参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'chart-init', params: 'chart: ECharts', desc: '图表实例初始化完成' },
  { name: 'chart-click', params: 'params', desc: '点击图表元素' },
  { name: 'chart-dblclick', params: 'params', desc: '双击图表元素' },
  { name: 'chart-mouseover', params: 'params', desc: '鼠标移入图表元素' },
  { name: 'chart-mouseout', params: 'params', desc: '鼠标移出图表元素' },
  { name: 'chart-legendselectchanged', params: 'params', desc: '图例选中状态变化' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'params', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'setOption', params: 'option, notMerge?, lazyUpdate?', desc: '手动设置 ECharts 配置' },
  { name: 'resize', params: 'opts?', desc: '手动触发尺寸调整' },
  { name: 'getInstance', params: '-', desc: '获取 ECharts 实例' },
]
</script>

<style scoped>
.chart-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-dashboard__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-dashboard__card {
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  padding: 8px;
  background: #fdfdfe;
}

.chart-dashboard__full {
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  padding: 8px;
  background: #fdfdfe;
}

@media (max-width: 768px) {
  .chart-dashboard__row {
    grid-template-columns: 1fr;
  }
}
</style>
