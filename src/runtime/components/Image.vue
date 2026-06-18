<template>
  <div :class="imageClass" :style="imageStyle" @click="handleClick">
    <!-- 图片本体：始终渲染且占据空间，用 visibility 控制可见性（不影响浏览器加载） -->
    <img
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      :class="['n-image__img', { 'n-image__img--hidden': status !== 'loaded' }]"
      :style="imgStyle"
      :loading="lazy ? 'lazy' : undefined"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 加载中 -->
    <div v-if="status === 'loading'" class="n-image__placeholder">
      <slot name="placeholder">
        <div class="n-image__loading">
          <svg class="n-image__loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      </slot>
    </div>

    <!-- 加载失败 -->
    <div v-if="status === 'error'" class="n-image__error" @click="handleErrorClick">
      <slot name="error">
        <div class="n-image__error-default">
          <svg class="n-image__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span class="n-image__error-text">加载失败</span>
        </div>
      </slot>
    </div>

    <!-- 预览遮罩 -->
    <div v-if="preview && status === 'loaded'" class="n-image__mask">
      <slot name="previewMask">
        <svg class="n-image__mask-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </slot>
    </div>

    <!-- 预览浮层 -->
    <teleport to="body">
      <transition name="n-image__fade">
        <div v-if="previewVisible" class="n-image__overlay" @click.self="closePreview">
          <div class="n-image__preview-toolbar">
            <button class="n-image__preview-btn" @click="zoomIn" title="放大">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="n-image__preview-btn" @click="zoomOut" title="缩小">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="n-image__preview-btn" @click="rotateLeft" title="左旋转">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>
            <button class="n-image__preview-btn" @click="rotateRight" title="右旋转">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>
            </button>
            <button class="n-image__preview-btn" @click="resetTransform" title="重置">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button class="n-image__preview-btn" @click="closePreview" title="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- 多图预览导航 -->
          <button v-if="previewUrls.length > 1 && currentPreviewIndex > 0" class="n-image__preview-arrow n-image__preview-arrow--left" @click="prevPreview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button v-if="previewUrls.length > 1 && currentPreviewIndex < previewUrls.length - 1" class="n-image__preview-arrow n-image__preview-arrow--right" @click="nextPreview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <img
            :src="previewUrls[currentPreviewIndex] || currentSrc"
            class="n-image__preview-img"
            :style="previewImgStyle"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed ,ref,watch,onUnmounted,onMounted} from 'vue'
type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
type ImageShape = 'square' | 'circle' | 'rounded'
type ImageStatus = 'loading' | 'loaded' | 'error'

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fit?: ImageFit
  shape?: ImageShape
  preview?: boolean
  lazy?: boolean
  fallback?: string
  previewSrc?: string
  objectPosition?: string
  borderRadius?: string
  previewUrls?: string[]
  initialIndex?: number
}>(), {
  fit: 'cover',
  shape: 'square',
  preview: false,
  lazy: true,
  previewUrls: () => [],
  initialIndex: 0,
})

const emit = defineEmits<{
  load: [e: Event]
  error: [e: Event]
  previewOpen: []
  previewClose: []
}>()

const imgRef = ref<HTMLImageElement>()
const status = ref<ImageStatus>('loading')
const currentSrc = ref(props.src)
const previewVisible = ref(false)
const currentPreviewIndex = ref(props.initialIndex)

// 预览变换
const scale = ref(1)
const rotate = ref(0)

const imageClass = computed(() => [
  'n-image',
  `n-image--${props.shape}`,
  {
    'n-image--preview': props.preview,
    'n-image--loading': status.value === 'loading',
    'n-image--error': status.value === 'error',
  },
])

const imageStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  if (props.borderRadius) style.borderRadius = props.borderRadius
  return style
})

const imgStyle = computed(() => {
  const style: Record<string, string> = {
    objectFit: props.fit,
  }
  if (props.width) style.width = '100%'
  if (props.height) style.height = '100%'
  if (props.objectPosition) style.objectPosition = props.objectPosition
  return style
})

const previewImgStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotate.value}deg)`,
  transition: 'transform 0.2s ease',
}))

function handleLoad(e: Event) {
  status.value = 'loaded'
  emit('load', e)
}

function handleError(e: Event) {
  if (props.fallback && currentSrc.value !== props.fallback) {
    currentSrc.value = props.fallback
  } else {
    status.value = 'error'
  }
  emit('error', e)
}

function handleErrorClick() {
  if (props.fallback && currentSrc.value !== props.fallback) {
    currentSrc.value = props.fallback
    status.value = 'loading'
  }
}

function handleClick() {
  if (props.preview && status.value === 'loaded') {
    if (props.previewUrls.length > 0) {
      const idx = props.previewUrls.indexOf(props.previewSrc || props.src)
      currentPreviewIndex.value = idx >= 0 ? idx : props.initialIndex
    } else {
      currentPreviewIndex.value = props.initialIndex
    }
    previewVisible.value = true
    resetTransform()
    emit('previewOpen')
  }
}

function closePreview() {
  previewVisible.value = false
  emit('previewClose')
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.25, 5)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.25, 0.25)
}

function rotateLeft() {
  rotate.value -= 90
}

function rotateRight() {
  rotate.value += 90
}

function resetTransform() {
  scale.value = 1
  rotate.value = 0
}

function prevPreview() {
  if (currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
    resetTransform()
  }
}

function nextPreview() {
  if (currentPreviewIndex.value < props.previewUrls.length - 1) {
    currentPreviewIndex.value++
    resetTransform()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!previewVisible.value) return
  if (e.key === 'Escape') closePreview()
  if (e.key === 'ArrowLeft') prevPreview()
  if (e.key === 'ArrowRight') nextPreview()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 监听 src 变化重置状态
watch(() => props.src, (newSrc: string) => {
  status.value = 'loading'
  currentSrc.value = newSrc
})

// 监听 previewUrls 同步 index
watch(() => props.initialIndex, (idx: number) => {
  currentPreviewIndex.value = idx
})

defineExpose({
  previewVisible,
  currentPreviewIndex,
})
</script>

<style scoped>
.n-image {
  display: inline-block;
  overflow: hidden;
  position: relative;
  line-height: 0;
  vertical-align: middle;
}

.n-image--square { border-radius: 0; }
.n-image--rounded { border-radius: var(--n-radius-md, 8px); }
.n-image--circle { border-radius: 50%; }

.n-image img {
  display: block;
  transition: transform 0.3s;
}

.n-image__img--hidden {
  visibility: hidden;
}

.n-image--preview { cursor: zoom-in; }
.n-image--preview:hover img { transform: scale(1.02); }

/* placeholder - 绝对定位覆盖层 */
.n-image__placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-color-bg-tertiary, #f5f5f5);
}

.n-image__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.n-image__loading-icon {
  width: 36px;
  height: 36px;
  color: var(--n-color-text-quaternary, #c0c0c0);
  animation: n-image-spin 1.2s linear infinite;
}

.n-image__loading::after {
  content: '加载中';
  font-size: 13px;
  color: var(--n-color-text-tertiary, #999);
}

@keyframes n-image-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* error - 绝对定位覆盖层 */
.n-image__error {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-color-bg-tertiary, #f5f5f5);
}

.n-image__error-default {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.n-image__error-icon {
  width: 40px;
  height: 40px;
  color: var(--n-color-text-quaternary, #c0c0c0);
}

.n-image__error-text {
  font-size: 13px;
  color: var(--n-color-text-tertiary, #999);
  line-height: 1;
}

/* mask - 绝对定位覆盖层 */
.n-image__mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.3s;
}

.n-image--preview:hover .n-image__mask { opacity: 1; }

.n-image__mask-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

/* overlay */
.n-image__overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.n-image__preview-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  cursor: default;
  user-select: none;
}

/* toolbar */
.n-image__preview-toolbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  z-index: 10;
}

.n-image__preview-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.n-image__preview-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.n-image__preview-btn svg {
  width: 18px;
  height: 18px;
}

/* arrows */
.n-image__preview-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.n-image__preview-arrow:hover {
  background: rgba(0, 0, 0, 0.7);
}

.n-image__preview-arrow svg {
  width: 22px;
  height: 22px;
}

.n-image__preview-arrow--left { left: 24px; }
.n-image__preview-arrow--right { right: 24px; }

/* transition */
.n-image__fade-enter-active,
.n-image__fade-leave-active {
  transition: opacity 0.3s;
}

.n-image__fade-enter-from,
.n-image__fade-leave-to {
  opacity: 0;
}
</style>
