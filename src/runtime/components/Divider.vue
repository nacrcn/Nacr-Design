<template>
  <div :class="['n-divider', `n-divider--${direction}`, { 'n-divider--with-text': $slots.default, 'n-divider--dashed': dashed }]">
    <span v-if="$slots.default && direction === 'horizontal'" class="n-divider__text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  dashed?: boolean
}>(), {
  direction: 'horizontal',
  dashed: false,
})
</script>

<style scoped>
.n-divider--horizontal {
  display: flex;
  align-items: center;
  margin: 16px 0;
  border-top: 1px solid var(--n-color-border);
}
.n-divider--horizontal.n-divider--dashed { border-top-style: dashed; }
.n-divider--horizontal.n-divider--with-text { border-top: none; }
.n-divider--horizontal.n-divider--with-text::before,
.n-divider--horizontal.n-divider--with-text::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--n-color-border);
}
.n-divider--horizontal.n-divider--dashed.n-divider--with-text::before,
.n-divider--horizontal.n-divider--dashed.n-divider--with-text::after {
  border-top-style: dashed;
}
.n-divider__text {
  padding: 0 16px;
  font-size: var(--n-font-size-md);
  color: var(--n-color-text);
  white-space: nowrap;
}
.n-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 0.9em;
  margin: 0 8px;
  vertical-align: middle;
  border-left: 1px solid var(--n-color-border);
}
.n-divider--vertical.n-divider--dashed { border-left-style: dashed; }
</style>
