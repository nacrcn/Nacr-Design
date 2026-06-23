<template>
  <!-- 全屏水印 -->
  <teleport v-if="fullscreen && mounted" to="body">
    <div class="n-watermark n-watermark--fullscreen" :style="overlayStyle" />
  </teleport>

  <!-- 容器水印 -->
  <div v-else class="n-watermark" ref="containerRef">
    <slot />
    <div class="n-watermark__overlay" :style="overlayStyle" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

export interface WatermarkProps {
  content?: string
  /** 密度预设，影响水印间距与大小。默认 default */
  density?: 'sparse' | 'default' | 'dense'
  gapX?: number
  gapY?: number
  rotate?: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold' | 'lighter'
  color?: string
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
  image?: string
  imageWidth?: number
  imageHeight?: number
  opacity?: number
  fullscreen?: boolean
  movable?: boolean
}

const props = withDefaults(defineProps<WatermarkProps>(), {
  content: 'Nacr Design',
  density: 'default',
  gapX: 100,
  gapY: 100,
  rotate: -22,
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  color: 'rgba(0,0,0,0.08)',
  width: 120,
  height: 64,
  offsetX: 0,
  offsetY: 0,
  image: '',
  imageWidth: 0,
  imageHeight: 0,
  opacity: 1,
  fullscreen: false,
  movable: false,
})

const emit = defineEmits<{
  'density-change': [density: 'sparse' | 'default' | 'dense']
}>()

/* ─── 密度预设 ─── */
const densityPresets = {
  sparse:  { gapX: 200, gapY: 200, width: 180, height: 96, fontSize: 16 },
  default: { gapX: 100, gapY: 100, width: 120, height: 64, fontSize: 14 },
  dense:   { gapX: 60,  gapY: 60,  width: 80,  height: 44, fontSize: 12 },
}

const resolvedGap = computed(() => {
  const preset = densityPresets[props.density] || densityPresets.default
  return {
    gapX: props.gapX ?? preset.gapX,
    gapY: props.gapY ?? preset.gapY,
    width: props.width ?? preset.width,
    height: props.height ?? preset.height,
    fontSize: props.fontSize ?? preset.fontSize,
  }
})

watch(() => props.density, (v) => {
  emit('density-change', v)
})

const mounted = ref(false)
const bgUrl = ref('')
const moveOffset = ref(0)
const containerRef = ref<HTMLElement | null>(null)
let moveTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  mounted.value = true
  generateWatermark()
  if (props.movable) startMove()
})

onBeforeUnmount(() => {
  stopMove()
})

watch(
  () => [
    props.content, props.density,
    props.gapX, props.gapY, props.rotate,
    props.fontSize, props.fontFamily, props.fontWeight, props.color,
    props.width, props.height, props.offsetX, props.offsetY,
    props.image, props.imageWidth, props.imageHeight,
  ],
  () => generateWatermark(),
)

function generateWatermark() {
  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const r = resolvedGap.value
  const cw = (r.gapX + r.width) * dpr
  const ch = (r.gapY + r.height) * dpr
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!

  ctx.scale(dpr, dpr)

  if (props.image) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const iw = props.imageWidth || img.width
      const ih = props.imageHeight || img.height
      ctx.translate((r.gapX + r.width) / 2, (r.gapY + r.height) / 2)
      ctx.rotate((props.rotate * Math.PI) / 180)
      ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih)
      bgUrl.value = canvas.toDataURL()
    }
    img.src = props.image
  } else {
    ctx.translate((r.gapX + r.width) / 2, (r.gapY + r.height) / 2)
    ctx.rotate((props.rotate * Math.PI) / 180)
    ctx.font = `${props.fontWeight} ${r.fontSize}px ${props.fontFamily}`
    ctx.fillStyle = props.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    /* 支持多行文字（换行符 \n） */
    const lines = props.content.split('\n')
    const lineHeight = r.fontSize * 1.3
    const startY = -((lines.length - 1) * lineHeight) / 2
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, startY + i * lineHeight)
    })
    bgUrl.value = canvas.toDataURL()
  }
}

/* ─── 水印移动动画 ─── */
function startMove() {
  stopMove()
  const r = resolvedGap.value
  moveTimer = setInterval(() => {
    moveOffset.value = (moveOffset.value + 1) % (r.gapX + r.width)
  }, 40)
}

function stopMove() {
  if (moveTimer) { clearInterval(moveTimer); moveTimer = null }
}

watch(() => props.movable, (v) => {
  if (v) startMove()
  else stopMove()
})

watch(() => props.density, () => {
  if (props.movable) {
    stopMove()
    nextTick(() => startMove())
  }
})

/* ─── 样式计算 ─── */
const overlayStyle = computed(() => {
  if (!bgUrl.value) return {}
  const base: Record<string, string> = {
    pointerEvents: 'none',
    zIndex: '9',
    opacity: String(props.opacity),
    backgroundImage: `url(${bgUrl.value})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: `${props.offsetX + moveOffset.value}px ${props.offsetY}px`,
  }

  if (props.fullscreen) {
    /* 全屏模式：绝对定位覆盖整个文档，随滚动始终可见 */
    base.position = 'absolute'
    base.top = '0'
    base.left = '0'
    base.width = `${document.documentElement.scrollWidth}px`
    base.height = `${document.documentElement.scrollHeight}px`
  } else {
    /* 容器模式：绝对定位覆盖整个容器（含滚动溢出区域） */
    base.position = 'absolute'
    base.top = '0'
    base.left = '0'
    base.width = '100%'
    base.height = '100%'
  }

  return base
})

/* ─── 全屏模式：监听文档尺寸变化，更新水印覆盖区域 ─── */
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (props.fullscreen) {
    setupFullscreenObserver()
  }
})

watch(() => props.fullscreen, (v) => {
  if (v && mounted.value) {
    setupFullscreenObserver()
  } else {
    teardownFullscreenObserver()
  }
})

onBeforeUnmount(() => {
  teardownFullscreenObserver()
})

function setupFullscreenObserver() {
  teardownFullscreenObserver()
  resizeObserver = new ResizeObserver(() => {
    /* 触发 overlayStyle 重算 — 通过强制更新 moveOffset 来触发 computed 重算 */
    moveOffset.value = moveOffset.value
  })
  resizeObserver.observe(document.documentElement)
}

function teardownFullscreenObserver() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}
</script>

<style scoped>
.n-watermark {
  position: relative;
  overflow: hidden;
}
.n-watermark--fullscreen {
  overflow: hidden;
}
</style>
