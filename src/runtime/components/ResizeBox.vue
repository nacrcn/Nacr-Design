<template>
    <div ref="containerRef" class="n-resize-box">
        <div class="n-resize-box__content">
            <slot />
        </div>
        <div class="n-resize-box__handle" @mousedown="onMouseDown" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const containerRef = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)

function onMouseDown(e: MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const el = containerRef.value!
    const startW = el.offsetWidth
    const startH = el.offsetHeight

    function onMove(ev: MouseEvent) {
        width.value = startW + (ev.clientX - startX)
        height.value = startH + (ev.clientY - startY)
        el.style.width = `${width.value}px`
        el.style.height = `${height.value}px`
    }
    function onUp() {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.n-resize-box {
    position: relative;
    display: inline-block;
    overflow: hidden;
}

.n-resize-box__content {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.n-resize-box__handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
}

.n-resize-box__handle::after {
    content: '';
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--n-color-text-disabled);
    border-bottom: 2px solid var(--n-color-text-disabled);
}
</style>
