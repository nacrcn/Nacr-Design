import { onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import type { Ref } from 'vue'
import type { EChartsOption } from '../components/Chart.vue'

/**
 * useChart — 轻量封装 echarts 实例创建与控制
 */
export function useChart(elRef: Ref<HTMLElement | undefined>, option?: EChartsOption) {
  let chart: echarts.ECharts | null = null

  function init(theme?: string | object, opts?: echarts.EChartsInitOpts) {
    if (!elRef.value) return
    if (chart) chart.dispose()
    chart = echarts.init(elRef.value, theme, opts)
    if (option) chart.setOption(option)
    return chart
  }

  function setOption(opt: EChartsOption, notMerge = true) {
    chart?.setOption(opt, notMerge)
  }

  function resize(opts?: { width?: number | 'auto'; height?: number | 'auto'; silent?: boolean }) {
    chart?.resize(opts)
  }

  function dispose() {
    chart?.dispose()
    chart = null
  }

  function getInstance() {
    return chart
  }

  onMounted(() => init())
  onBeforeUnmount(() => dispose())

  return { init, setOption, resize, dispose, getInstance }
}
