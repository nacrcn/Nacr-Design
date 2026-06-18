<template>
    <!-- iconfont Symbol 模式：通过 name 引用 SVG symbol -->
    <svg v-if="name" :class="['n-icon', { 'n-icon--spin': spin }]" :style="iconStyle" aria-hidden="true"
        @click="$emit('click', $event)">
        <use :xlink:href="symbolId" />
    </svg>
    <!-- iconfont Font Class 模式：通过 class 引用 -->
    <i v-else-if="fontClass" :class="['n-icon', 'iconfont', fontClass, { 'n-icon--spin': spin }]" :style="fontStyle"
        @click="$emit('click', $event)" />
    <!-- 默认 Slot 模式：自定义 SVG 内容 -->
    <svg v-else :class="['n-icon', { 'n-icon--spin': spin }]" :style="iconStyle" :width="svgSize" :height="svgSize"
        viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true" @click="$emit('click', $event)">
        <slot />
    </svg>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

interface Props {
    /** iconfont 名称，用于 Symbol 模式，如 "search" → #icon-search */
    name?: string
    /** iconfont Font Class，如 "icon-search"、icon-clock */
    fontClass?: string
    /** 图标大小，数字为 px，字符串如 '1em'、'24px' */
    size?: number | string
    /** 旋转角度 */
    rotate?: number
    /** 是否旋转动画 */
    spin?: boolean
    /** 图标颜色 */
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    fontClass: undefined,
    size: undefined,
    rotate: 0,
    spin: false,
    color: undefined,
})

defineEmits<{
    click: [event: MouseEvent]
}>()

const symbolId = computed(() => `#icon-${props.name}`)

const svgSize = computed(() => {
    if (props.size === undefined) return '1em'
    return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const iconStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {
        width: svgSize.value,
        height: svgSize.value,
    }
    if (props.rotate) {
        style.transform = `rotate(${props.rotate}deg)`
    }
    if (props.color) {
        style.color = props.color
    }
    return style
})

const fontStyle = computed<CSSProperties>(() => {
    const style: CSSProperties = {
        fontSize: props.size === undefined ? 'inherit' : (typeof props.size === 'number' ? `${props.size}px` : props.size),
    }
    if (props.rotate) {
        style.transform = `rotate(${props.rotate}deg)`
    }
    if (props.color) {
        style.color = props.color
    }
    return style
})
</script>

<style scoped>
.n-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: inherit;
    line-height: 1;
    transition: transform 0.3s ease, color 0.2s ease;
    flex-shrink: 0;
    vertical-align: middle;
    fill: currentColor;
}

.n-icon--spin {
    animation: n-icon-spin 1s linear infinite;
}

@keyframes n-icon-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>

<style>
/* 全局样式：确保 SVG use 引用继承颜色（需穿透 <use> 的 shadow DOM） */
.n-icon use {
    fill: currentColor;
}
</style>
