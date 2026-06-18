<template>
    <div class="n-overflow-list" ref="listRef">
        <slot />
        <span v-if="overflowCount > 0" class="n-overflow-list__rest">+{{ overflowCount }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount} from 'vue'
const listRef = ref<HTMLElement | null>(null)
const overflowCount = ref(0)

function compute() {
    if (!listRef.value) return
    const children = Array.from(listRef.value.children).filter(el => !el.classList.contains('n-overflow-list__rest'))
    const containerW = listRef.value.clientWidth
    let total = 0
    let visible = 0
    for (const child of children) {
        total += (child as HTMLElement).offsetWidth
        if (total > containerW) break
        visible++
    }
    overflowCount.value = Math.max(0, children.length - visible)
}

const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null

onMounted(() => {
    compute()
    if (ro && listRef.value) ro.observe(listRef.value)
})
onBeforeUnmount(() => { if (ro) ro.disconnect() })
</script>

<style scoped>
.n-overflow-list {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    align-items: center;
    gap: 4px;
}

.n-overflow-list__rest {
    flex-shrink: 0;
    padding: 2px 8px;
    background: var(--n-color-fill);
    border-radius: var(--n-radius-sm);
    font-size: var(--n-font-size-sm);
    color: var(--n-color-text-secondary);
}
</style>
