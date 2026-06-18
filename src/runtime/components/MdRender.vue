<template>
  <div :class="['n-md-render', `n-md-render--${size}`]">
    <div class="n-md-render__content" v-html="renderedHtml" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export type MdRenderSize = 'sm' | 'md' | 'lg'

interface Props {
  content?: string
  size?: MdRenderSize
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  size: 'md',
})

const renderedHtml = computed(() => {
  if (!props.content) return ''
  return marked.parse(props.content) as string
})
</script>

<style scoped>
.n-md-render {
  color: var(--n-color-text, #333);
  line-height: 1.7;
  word-wrap: break-word;
}

.n-md-render--sm { font-size: 13px; }
.n-md-render--md { font-size: 14px; }
.n-md-render--lg { font-size: 16px; }

.n-md-render__content :deep(h1) {
  font-size: 1.8em; font-weight: 700; margin: 0.6em 0 0.4em;
  padding-bottom: 0.3em; border-bottom: 1px solid var(--n-color-border, #e0e0e6);
}
.n-md-render__content :deep(h2) {
  font-size: 1.4em; font-weight: 600; margin: 1em 0 0.4em;
  padding-bottom: 0.2em; border-bottom: 1px solid var(--n-color-border, #e0e0e6);
}
.n-md-render__content :deep(h3) { font-size: 1.2em; font-weight: 600; margin: 0.8em 0 0.3em; }
.n-md-render__content :deep(h4),
.n-md-render__content :deep(h5),
.n-md-render__content :deep(h6) { font-size: 1em; font-weight: 600; margin: 0.6em 0 0.3em; }
.n-md-render__content :deep(p) { margin: 0.6em 0; }
.n-md-render__content :deep(a) { color: var(--n-color-primary, #1677ff); text-decoration: none; }
.n-md-render__content :deep(a:hover) { text-decoration: underline; }
.n-md-render__content :deep(strong) { font-weight: 600; }
.n-md-render__content :deep(em) { font-style: italic; }
.n-md-render__content :deep(del) { text-decoration: line-through; color: var(--n-color-text-secondary, #888); }
.n-md-render__content :deep(code) {
  background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.9em; color: #d63384;
}
.n-md-render__content :deep(pre) {
  background: #1e1e2e; color: #cdd6f4; padding: 16px;
  border-radius: 8px; overflow-x: auto; margin: 1em 0;
}
.n-md-render__content :deep(pre code) {
  background: transparent; padding: 0; color: inherit; font-size: 13px; line-height: 1.6;
}
.n-md-render__content :deep(blockquote) {
  border-left: 4px solid var(--n-color-primary, #1677ff); padding: 8px 16px;
  margin: 1em 0; color: var(--n-color-text-secondary, #888);
  background: rgba(22,119,255,0.04); border-radius: 0 8px 8px 0;
}
.n-md-render__content :deep(ul),
.n-md-render__content :deep(ol) { padding-left: 2em; margin: 0.5em 0; }
.n-md-render__content :deep(li) { margin: 0.25em 0; }
.n-md-render__content :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
.n-md-render__content :deep(th),
.n-md-render__content :deep(td) { border: 1px solid var(--n-color-border, #e0e0e6); padding: 8px 12px; text-align: left; }
.n-md-render__content :deep(th) { background: var(--n-color-fill-light, #fafafa); font-weight: 600; }
.n-md-render__content :deep(img) { max-width: 100%; border-radius: 6px; }
.n-md-render__content :deep(hr) { border: none; border-top: 1px solid var(--n-color-border, #e0e0e6); margin: 1.5em 0; }

/* GFM task list */
.n-md-render__content :deep(input[type="checkbox"]) {
  margin-right: 6px;
}
</style>
