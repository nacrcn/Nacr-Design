<template>
    <div :class="carouselClass" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @keydown.left="prev"
        @keydown.right="next">
        <div :class="['n-carousel__track', { 'n-carousel__track--vertical': direction === 'vertical' }]"
            :style="trackStyle">
            <slot />
        </div>

        <!-- 左箭头 -->
        <button v-if="showArrow && direction === 'horizontal'" class="n-carousel__arrow n-carousel__arrow--left"
            @click="prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        </button>
        <!-- 右箭头 -->
        <button v-if="showArrow && direction === 'horizontal'" class="n-carousel__arrow n-carousel__arrow--right"
            @click="next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </button>
        <!-- 上箭头 -->
        <button v-if="showArrow && direction === 'vertical'" class="n-carousel__arrow n-carousel__arrow--top"
            @click="prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
        <!-- 下箭头 -->
        <button v-if="showArrow && direction === 'vertical'" class="n-carousel__arrow n-carousel__arrow--bottom"
            @click="next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>

        <!-- 指示点 -->
        <div v-if="showDots"
            :class="['n-carousel__dots', `n-carousel__dots--${dotPosition}`, `n-carousel__dots--${dotType}`]">
            <template v-if="dotType === 'dot'">
                <span v-for="i in total" :key="i"
                    :class="['n-carousel__dot', { 'n-carousel__dot--active': current === i - 1 }]"
                    @click="goTo(i - 1)" />
            </template>
            <template v-else-if="dotType === 'line'">
                <span v-for="i in total" :key="i"
                    :class="['n-carousel__line', { 'n-carousel__line--active': current === i - 1 }]"
                    @click="goTo(i - 1)" />
            </template>
            <template v-else-if="dotType === 'number'">
                <span class="n-carousel__number">{{ current + 1 }} / {{ total }}</span>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
type Direction = 'horizontal' | 'vertical'
type DotType = 'dot' | 'line' | 'number'
type DotPosition = 'bottom' | 'top' | 'left' | 'right'
type ArrowTrigger = 'always' | 'hover'

const props = withDefaults(defineProps<{
    autoplay?: boolean
    interval?: number
    loop?: boolean
    direction?: Direction
    dotType?: DotType
    dotPosition?: DotPosition
    showDots?: boolean
    showArrow?: boolean
    arrowTrigger?: ArrowTrigger
    pauseOnHover?: boolean
    duration?: number
    height?: number | string
}>(), {
    autoplay: true,
    interval: 3000,
    loop: true,
    direction: 'horizontal',
    dotType: 'dot',
    dotPosition: 'bottom',
    showDots: true,
    showArrow: true,
    arrowTrigger: 'always',
    pauseOnHover: true,
    duration: 400,
})

const emit = defineEmits<{
    change: [current: number, prev: number]
}>()

const current = ref(0)
const total = ref(0)
const isPaused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const carouselClass = computed(() => [
    'n-carousel',
    `n-carousel--${props.direction}`,
    {
        'n-carousel--hover-arrow': props.arrowTrigger === 'hover',
        'n-carousel--paused': isPaused.value,
    },
])

const trackStyle = computed(() => {
    const transition = `transform ${props.duration}ms ease`
    if (props.direction === 'vertical') {
        return { transform: `translateY(-${current.value * 100}%)`, transition }
    }
    return { transform: `translateX(-${current.value * 100}%)`, transition }
})

function next() {
    if (total.value === 0) return
    const prev = current.value
    if (current.value < total.value - 1) {
        current.value++
    } else if (props.loop) {
        current.value = 0
    }
    if (current.value !== prev) emit('change', current.value, prev)
}

function prev() {
    if (total.value === 0) return
    const prevIdx = current.value
    if (current.value > 0) {
        current.value--
    } else if (props.loop) {
        current.value = total.value - 1
    }
    if (current.value !== prevIdx) emit('change', current.value, prevIdx)
}

function goTo(i: number) {
    if (i < 0 || i >= total.value || i === current.value) return
    const prev = current.value
    current.value = i
    emit('change', current.value, prev)
}

function startTimer() {
    stopTimer()
    if (props.autoplay && total.value > 1) {
        timer = setInterval(next, props.interval)
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

function onMouseEnter() {
    if (props.pauseOnHover) {
        isPaused.value = true
        stopTimer()
    }
}

function onMouseLeave() {
    if (props.pauseOnHover) {
        isPaused.value = false
        startTimer()
    }
}

function updateTotal() {
    const track = document.querySelector('.n-carousel__track')
    if (track) {
        total.value = track.children.length
    }
}

onMounted(() => {
    updateTotal()
    startTimer()
})

onBeforeUnmount(() => {
    stopTimer()
})

// 暴露方法
defineExpose({ prev, next, goTo, current, total })
</script>

<style scoped>
.n-carousel {
    position: relative;
    overflow: hidden;
    border-radius: var(--n-radius-lg, 12px);
    width: 100%;
}

/* Track */
.n-carousel__track {
    display: flex;
    transition: transform 0.4s ease;
}

.n-carousel__track--vertical {
    flex-direction: column;
    height: 100%;
}

.n-carousel__track>* {
    flex: 0 0 100%;
    min-width: 0;
    min-height: 0;
}

/* Arrows */
.n-carousel__arrow {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    cursor: pointer;
    transition: background 0.2s, opacity 0.3s;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.n-carousel__arrow:hover {
    background: rgba(0, 0, 0, 0.5);
}

.n-carousel__arrow svg {
    width: 18px;
    height: 18px;
}

.n-carousel__arrow--left {
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
}

.n-carousel__arrow--right {
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
}

.n-carousel__arrow--top {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
}

.n-carousel__arrow--bottom {
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
}

/* Hover arrows: 默认隐藏，hover 时显示 */
.n-carousel--hover-arrow .n-carousel__arrow {
    opacity: 0;
}

.n-carousel--hover-arrow:hover .n-carousel__arrow {
    opacity: 1;
}

/* Dots */
.n-carousel__dots {
    position: absolute;
    display: flex;
    gap: 6px;
    z-index: 2;
}

/* 位置 */
.n-carousel__dots--bottom {
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
}

.n-carousel__dots--top {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
}

.n-carousel__dots--left {
    left: 12px;
    top: 50%;
    flex-direction: column;
    transform: translateY(-50%);
}

.n-carousel__dots--right {
    right: 12px;
    top: 50%;
    flex-direction: column;
    transform: translateY(-50%);
}

/* Dot type */
.n-carousel__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s;
}

.n-carousel__dot--active {
    background: #fff;
    width: 22px;
    border-radius: 4px;
}

/* Line type */
.n-carousel__line {
    width: 16px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: all 0.3s;
}

.n-carousel__line--active {
    background: #fff;
    width: 28px;
}

/* Number type */
.n-carousel__number {
    font-size: 13px;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    padding: 2px 10px;
    border-radius: 10px;
    backdrop-filter: blur(4px);
}
</style>
