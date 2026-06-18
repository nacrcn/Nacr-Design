<template>
  <div
    ref="chartRef"
    :class="['n-chart', { 'n-chart--loading': loading }]"
    :style="chartStyle"
  >
    <div v-if="loading" class="n-chart__loading">
      <span class="n-chart__loading-icon" />
      <span class="n-chart__loading-text">{{ loadingText }}</span>
    </div>
    <div v-if="!option && !loading" class="n-chart__empty">
      <slot name="empty">
        <span class="n-chart__empty-text">暂无数据</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  CustomChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  AriaComponent,
  BrushComponent,
  TimelineComponent,
  CalendarComponent,
  ParallelComponent,
  GeoComponent,
} from 'echarts/components'

echarts.use([
  CanvasRenderer,
  BarChart, LineChart, PieChart, ScatterChart, RadarChart, MapChart,
  TreeChart, TreemapChart, SunburstChart, GraphChart, GaugeChart,
  FunnelChart, ParallelChart, SankeyChart, BoxplotChart, CandlestickChart,
  EffectScatterChart, LinesChart, HeatmapChart, PictorialBarChart,
  ThemeRiverChart, CustomChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  DatasetComponent, TransformComponent, ToolboxComponent, DataZoomComponent,
  VisualMapComponent, GraphicComponent, MarkLineComponent, MarkPointComponent,
  MarkAreaComponent, AriaComponent, BrushComponent, TimelineComponent,
  CalendarComponent, ParallelComponent, GeoComponent,
])

export type EChartsOption = echarts.EChartsCoreOption

interface Props {
  option?: EChartsOption
  width?: string | number
  height?: string | number
  loading?: boolean
  loadingText?: string
  theme?: string | object
  autoresize?: boolean
  manualUpdate?: boolean
  renderer?: 'canvas' | 'svg'
}

const props = withDefaults(defineProps<Props>(), {
  option: undefined,
  width: '100%',
  height: 400,
  loading: false,
  loadingText: '加载中...',
  theme: undefined,
  autoresize: true,
  manualUpdate: false,
  renderer: 'canvas',
})

const emit = defineEmits<{
  'chart-init': [chart: echarts.ECharts]
  'chart-click': [params: any]
  'chart-dblclick': [params: any]
  'chart-mouseover': [params: any]
  'chart-mouseout': [params: any]
  'chart-legendselectchanged': [params: any]
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const chartStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  const initTheme = props.theme || undefined
  const initOpts: echarts.EChartsInitOpts = { renderer: props.renderer }
  chartInstance = echarts.init(chartRef.value, initTheme, initOpts)
  emit('chart-init', chartInstance)

  chartInstance.on('click', (params: any) => emit('chart-click', params))
  chartInstance.on('dblclick', (params: any) => emit('chart-dblclick', params))
  chartInstance.on('mouseover', (params: any) => emit('chart-mouseover', params))
  chartInstance.on('mouseout', (params: any) => emit('chart-mouseout', params))
  chartInstance.on('legendselectchanged', (params: any) => emit('chart-legendselectchanged', params))

  if (props.option) {
    chartInstance.setOption(props.option, true)
    if (props.loading) {
      chartInstance.showLoading('default', {
        text: props.loadingText,
        color: '#3b82f6',
        textColor: '#6b7280',
        maskColor: 'rgba(255,255,255,0.8)',
      })
    }
  }
}

function setOption(option: EChartsOption, notMerge?: boolean, lazyUpdate?: boolean) {
  if (!chartInstance) return
  chartInstance.setOption(option, notMerge ?? true, lazyUpdate)
}

function resize(opts?: { width?: number | 'auto'; height?: number | 'auto'; silent?: boolean }) {
  chartInstance?.resize(opts)
}

function getInstance(): echarts.ECharts | null {
  return chartInstance
}

watch(() => props.option, (val) => {
  if (!chartInstance || props.manualUpdate) return
  if (!val) return
  chartInstance.setOption(val, true)
  chartInstance.hideLoading()
  if (props.loading) {
    chartInstance.showLoading('default', {
      text: props.loadingText,
      color: '#3b82f6',
      textColor: '#6b7280',
      maskColor: 'rgba(255,255,255,0.8)',
    })
  }
}, { deep: true })

watch(() => props.loading, (val) => {
  if (!chartInstance) return
  if (val) {
    chartInstance.showLoading('default', {
      text: props.loadingText,
      color: '#3b82f6',
      textColor: '#6b7280',
      maskColor: 'rgba(255,255,255,0.8)',
    })
  } else {
    chartInstance.hideLoading()
  }
})

onMounted(() => {
  initChart()
  if (props.autoresize && chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({ setOption, resize, getInstance })
</script>

<style scoped>
.n-chart {
  position: relative;
  min-height: 200px;
}

.n-chart__loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.n-chart__loading-icon {
  width: 24px;
  height: 24px;
  border: 2px solid var(--n-color-border);
  border-top-color: var(--n-color-primary);
  border-radius: 50%;
  animation: n-chart-spin 0.8s linear infinite;
}

@keyframes n-chart-spin {
  to { transform: rotate(360deg); }
}

.n-chart__loading-text {
  font-size: var(--n-font-size-sm);
  color: var(--n-color-text-secondary);
}

.n-chart__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.n-chart__empty-text {
  font-size: var(--n-font-size-md);
  color: var(--n-color-text-disabled);
}
</style>
