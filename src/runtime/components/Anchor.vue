<template>
    <div class="n-anchor">
        <div v-for="item in items" :key="item.href"
            :class="['n-anchor__link', { 'n-anchor__link--active': activeHref === item.href }]"
            @click="scrollTo(item.href)">
            {{ item.title }}
            <div v-if="item.children?.length" class="n-anchor__sub">
                <div v-for="child in item.children" :key="child.href"
                    :class="['n-anchor__link', { 'n-anchor__link--active': activeHref === child.href }]"
                    @click.stop="scrollTo(child.href)">
                    {{ child.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
interface AnchorItem {
    href: string
    title: string
    children?: AnchorItem[]
}

const props = withDefaults(defineProps<{
    items: AnchorItem[]
    offsetTop?: number
}>(), {
    offsetTop: 0,
})

const activeHref = ref('')

function scrollTo(href: string) {
    activeHref.value = href
    const el = document.querySelector(href)
    if (el) {
        window.scrollTo({ top: (el as HTMLElement).offsetTop - props.offsetTop, behavior: 'smooth' })
    }
}

function onScroll() {
    for (const item of props.items) {
        const el = document.querySelector(item.href)
        if (el && (el as HTMLElement).getBoundingClientRect().top <= props.offsetTop + 10) {
            activeHref.value = item.href
        }
    }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.n-anchor {
    font-size: var(--n-font-size-md);
}

.n-anchor__link {
    padding: 4px 0 4px 12px;
    color: var(--n-color-text-secondary);
    cursor: pointer;
    border-left: 2px solid var(--n-color-border);
    transition: all var(--n-transition-fast);
    margin-bottom: 4px;
}

.n-anchor__link:hover {
    color: var(--n-color-primary);
}

.n-anchor__link--active {
    color: var(--n-color-primary);
    border-left-color: var(--n-color-primary);
}

.n-anchor__sub {
    margin-left: 12px;
}

.n-anchor__sub .n-anchor__link {
    font-size: var(--n-font-size-sm);
}
</style>
