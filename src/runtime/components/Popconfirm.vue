<!--
  Popconfirm 气泡确认框组件
  用于在用户点击触发元素后，弹出一个气泡确认框，要求用户确认操作。
  支持四个方向（上、下、左、右）的弹出位置，以及危险操作的确认样式。
  点击气泡外部区域可自动关闭气泡。
-->
<template>
  <!-- 根容器，用于包裹触发元素并作为定位基准 -->
  <div class="n-popconfirm" ref="popRef">
    <!-- 触发区域，点击后切换气泡的显示/隐藏状态 -->
    <div class="n-popconfirm__trigger">
      <slot />
    </div>
    <!-- 使用 teleport 将气泡面板传送到 body 根节点，避免被父级 overflow:hidden 裁切 -->
    <teleport to="body">
      <!-- 气泡确认面板，始终渲染，通过 visibility 控制显隐 -->
      <div
        ref="panelRef"
        class="n-popconfirm__panel"
        :class="{ 'n-popconfirm__panel--visible': visible }"
        :style="panelStyle"
      >
        <!-- 箭头指示器，指向触发元素，通过 arrowStyle 动态定位和设置三角形方向 -->
        <div class="n-popconfirm__arrow" :style="arrowStyle" />
        <!-- 确认内容区域：图标 + 文字提示 -->
        <div class="n-popconfirm__content">
          <!-- 警告图标，使用 NIcon 组件，图标名为 "tanhao"（叹号） -->
          <span class="n-popconfirm__icon">
            <NIcon name="tanhao" :size="16" />
          </span>
          <!-- 确认提示文字，由 content 属性控制 -->
          <span>{{ content }}</span>
        </div>
        <!-- 操作按钮区域：取消 + 确定 -->
        <div class="n-popconfirm__actions" @click.stop>
          <!-- 取消按钮，始终为次要样式，点击后关闭气泡并触发 cancel 事件 -->
          <NButton size="sm" variant="secondary" @click="cancel">取消</NButton>
          <!-- 确定按钮，根据 danger 属性切换为危险（红色）或主要（蓝色）样式，点击后关闭气泡并触发 confirm 事件 -->
          <NButton size="sm" :variant="danger ? 'danger' : 'primary'" @click="confirm">确定</NButton>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * 组件属性定义
 * @property content - 确认提示的文字内容，默认为"确定执行此操作？"
 * @property placement - 气泡弹出的方向，支持 top / bottom / left / right，默认为 top
 * @property danger - 是否为危险操作，为 true 时确定按钮显示为红色危险样式
 */
const props = withDefaults(defineProps<{
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  danger?: boolean
}>(), {
  content: '确定执行此操作？',
  placement: 'top',
  danger: false,
})

/** 组件事件定义：confirm 确认事件、cancel 取消事件 */
const emit = defineEmits<{ confirm: []; cancel: [] }>()

/** 触发元素的 DOM 引用，用于获取触发元素的位置信息 */
const popRef = ref<HTMLElement | null>(null)

/** 气泡面板的 DOM 引用，用于获取面板尺寸以计算定位 */
const panelRef = ref<HTMLElement | null>(null)

/** 控制气泡面板的显示/隐藏状态 */
const visible = ref(false)

/** 气泡面板的行内样式，包含 position / top / left / zIndex 等定位信息 */
const panelStyle = ref<Record<string, string>>({
  position: 'fixed',
  top: '-9999px',
  left: '-9999px',
  zIndex: '1060',
})

/** 箭头的行内样式，包含位置及用 CSS border 绘制的三角形方向 */
const arrowStyle = ref<Record<string, string>>({})

/** 切换气泡的显示/隐藏状态 */
function toggle() {
  
  visible.value = !visible.value
  if (visible.value) {
    nextTick(updatePos)
  } else {
    panelStyle.value = { position: 'fixed', top: '-9999px', left: '-9999px', zIndex: '1060' }
  }
}

/**
 * 根据触发元素和面板的尺寸及位置，计算气泡面板和箭头的绝对定位坐标
 */
function updatePos() {
  if (!popRef.value || !panelRef.value) return

  const trigger = popRef.value.getBoundingClientRect()
  const panel = panelRef.value.getBoundingClientRect()

  const gap = 10
  const arrowSize = 6

  let top = 0, left = 0
  let arrowTop = '', arrowLeft = ''

  switch (props.placement) {
    case 'top':
      top = trigger.top - panel.height - gap
      left = trigger.left + (trigger.width - panel.width) / 2
      arrowTop = `${panel.height}px`
      arrowLeft = `${panel.width / 2 - arrowSize}px`
      break
    case 'bottom':
      top = trigger.bottom + gap
      left = trigger.left + (trigger.width - panel.width) / 2
      arrowTop = `${-arrowSize * 2}px`
      arrowLeft = `${panel.width / 2 - arrowSize}px`
      break
    case 'left':
      top = trigger.top + (trigger.height - panel.height) / 2
      left = trigger.left - panel.width - gap
      arrowTop = `${panel.height / 2 - arrowSize}px`
      arrowLeft = `${panel.width}px`
      break
    case 'right':
      top = trigger.top + (trigger.height - panel.height) / 2
      left = trigger.right + gap
      arrowTop = `${panel.height / 2 - arrowSize}px`
      arrowLeft = `${-arrowSize * 2}px`
      break
  }

  panelStyle.value = { position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: '1060', visibility: 'visible' }

  const arrowBase = {
    position: 'absolute',
    width: '0',
    height: '0',
  }

  switch (props.placement) {
    case 'top':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderTop: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'bottom':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderLeft: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'left':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderLeft: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
    case 'right':
      arrowStyle.value = { ...arrowBase, top: arrowTop, left: arrowLeft, borderTop: `${arrowSize}px solid transparent`, borderBottom: `${arrowSize}px solid transparent`, borderRight: `${arrowSize}px solid var(--n-color-bg-elevated)` }
      break
  }
}

/** 点击确定按钮：关闭气泡并触发 confirm 事件 */
function confirm() {
  visible.value = false
  panelStyle.value = { position: 'fixed', top: '-9999px', left: '-9999px', zIndex: '1060' }
  emit('confirm')
}

/** 点击取消按钮：关闭气泡并触发 cancel 事件 */
function cancel() {
  visible.value = false
  panelStyle.value = { position: 'fixed', top: '-9999px', left: '-9999px', zIndex: '1060' }
  emit('cancel')
}

/**
 * 全局点击事件处理器
 * - 点击触发元素：切换显示/隐藏
 * - 点击面板内：忽略（由按钮事件处理）
 * - 点击外部：关闭气泡
 */
function onDocClick(e: MouseEvent) {
  const target = e.target as Node
  // 点击在触发元素内，切换
  if (popRef.value?.contains(target)) {
    toggle()
    return
  }
  // 点击在气泡面板内，忽略
  if (panelRef.value?.contains(target)) return
  // 点击在外部，关闭
  visible.value = false
  panelStyle.value = { position: 'fixed', top: '-9999px', left: '-9999px', zIndex: '1060' }
}

/** 组件挂载时注册全局点击监听 */
onMounted(() => {
  document.addEventListener('click', onDocClick)
})

/** 组件卸载前清理：移除全局点击事件监听，防止内存泄漏 */
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<style scoped>
/* 根容器：行内块级元素，以适应触发元素的尺寸 */
.n-popconfirm {
  display: inline-block;
}

/* 触发区域：行内弹性布局，带指针光标 */
.n-popconfirm__trigger {
  display: inline-flex;
  cursor: pointer;
}

/* 气泡确认面板：使用设计令牌设置背景色、圆角、阴影和内边距 */
.n-popconfirm__panel {
  background: var(--n-color-bg-elevated);
  border-radius: var(--n-radius-lg);
  box-shadow: var(--n-shadow-lg);
  padding: 14px 18px;
  min-width: 200px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
}

/* 面板可见状态 */
.n-popconfirm__panel--visible {
  visibility: visible;
  opacity: 1;
}

/* 箭头：添加投影滤镜使其与面板阴影协调 */
.n-popconfirm__arrow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

/* 内容区域：弹性布局，图标与文字顶部对齐，间距 8px */
.n-popconfirm__content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--n-font-size-md);
  color: var(--n-color-text);
  line-height: 1.6;
  margin-bottom: 12px;
}

/* 警告图标：禁止收缩，使用警告色，微调顶部对齐 */
.n-popconfirm__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--n-color-warning);
  margin-top: 2px;
}

/* 操作按钮区域：右对齐，按钮间距 8px */
.n-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
