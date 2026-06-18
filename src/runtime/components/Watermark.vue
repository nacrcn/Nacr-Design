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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  content?: string
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
}>(), {
  content: 'Nacr Design',
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

const mounted = ref(false)
const bgUrl = ref('')
const moveOffset = ref(0)
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
    props.content, props.gapX, props.gapY, props.rotate,
    props.fontSize, props.fontFamily, props.fontWeight, props.color,
    props.width, props.height, props.offsetX, props.offsetY,
    props.image, props.imageWidth, props.imageHeight,
  ],
  () => generateWatermark(),
)

function generateWatermark() {
  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const cw = (props.gapX + props.width) * dpr
  const ch = (props.gapY + props.height) * dpr
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
      ctx.translate((props.gapX + props.width) / 2, (props.gapY + props.height) / 2)
      ctx.rotate((props.rotate * Math.PI) / 180)
      ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih)
      bgUrl.value = canvas.toDataURL()
    }
    img.src = props.image
  } else {
    ctx.translate((props.gapX + props.width) / 2, (props.gapY + props.height) / 2)
    ctx.rotate((props.rotate * Math.PI) / 180)
    ctx.font = `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`
    ctx.fillStyle = props.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // 支持多行文字（换行符 \n）
    const lines = props.content.split('\n')
    const lineHeight = props.fontSize * 1.3
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
  moveTimer = setInterval(() => {
    moveOffset.value = (moveOffset.value + 1) % (props.gapX + props.width)
  }, 40)
}

function stopMove() {
  if (moveTimer) { clearInterval(moveTimer); moveTimer = null }
}

watch(() => props.movable, (v) => {
  if (v) startMove()
  else stopMove()
})

/* ─── 样式计算 ─── */
const overlayStyle = computed(() => {
  if (!bgUrl.value) return {}
  return {
    position: 'absolute' as const,
    inset: '0',
    pointerEvents: 'none' as const,
    zIndex: 9,
    opacity: props.opacity,
    backgroundImage: `url(${bgUrl.value})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: `${props.offsetX + moveOffset.value}px ${props.offsetY}px`,
  }
})
</script>

<style scoped>
.n-watermark { position: relative; }
.n-watermark--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}
</style>
