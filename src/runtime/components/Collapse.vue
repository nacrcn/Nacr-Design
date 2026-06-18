<template>
    <div class="n-collapse">
        <div v-for="(item, idx) in items" :key="idx" class="n-collapse__item">
            <div :class="['n-collapse__header', { 'n-collapse__header--active': isActive(idx) }]" @click="toggle(idx)">
                <svg class="n-collapse__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
                {{ item.title }}
            </div>
            <transition name="n-collapse__fade">
                <div v-show="isActive(idx)" class="n-collapse__body">
                    <div class="n-collapse__content">{{ item.content }}</div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface CollapseItem {
    title: string
    content: string
}

const props = withDefaults(defineProps<{
    items: CollapseItem[]
    accordion?: boolean
}>(), {
    accordion: false,
})

const activeKeys = ref<number[]>([])

function isActive(idx: number) { return activeKeys.value.includes(idx) }

function toggle(idx: number) {
    if (props.accordion) {
        activeKeys.value = isActive(idx) ? [] : [idx]
    } else {
        if (isActive(idx)) activeKeys.value = activeKeys.value.filter(i => i !== idx)
        else activeKeys.value.push(idx)
    }
}
</script>

<style scoped>
.n-collapse {
    border: 1px solid var(--n-color-border);
    border-radius: var(--n-radius-lg);
    overflow: hidden;
}

.n-collapse__item {
    border-bottom: 1px solid var(--n-color-border);
}

.n-collapse__item:last-child {
    border-bottom: none;
}

.n-collapse__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    font-size: var(--n-font-size-md);
    font-weight: 500;
    color: var(--n-color-text);
    transition: background 0.15s;
}

.n-collapse__header:hover {
    background: var(--n-color-fill-hover);
}

.n-collapse__arrow {
    transition: transform 0.2s;
    flex-shrink: 0;
}

.n-collapse__header--active .n-collapse__arrow {
    transform: rotate(180deg);
}

.n-collapse__content {
    padding: 12px 16px 16px 38px;
    color: var(--n-color-text-secondary);
    font-size: var(--n-font-size-sm);
    line-height: 1.6;
}

.n-collapse__fade-enter-active,
.n-collapse__fade-leave-active {
    transition: all 0.2s ease;
    overflow: hidden;
}

.n-collapse__fade-enter-from,
.n-collapse__fade-leave-to {
    opacity: 0;
    max-height: 0;
}

.n-collapse__fade-enter-to,
.n-collapse__fade-leave-from {
    max-height: 500px;
}
</style>
