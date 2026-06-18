<template>
  <div class="n-grid-item" :style="itemStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed} from 'vue'
const props = withDefaults(defineProps<{
  span?: number
  offset?: number
}>(), {
  span: 1,
  offset: 0,
})

const itemStyle = computed(() => ({
  gridColumn: `span ${props.span}`,
  gridColumnStart: props.offset ? `${props.offset + 1}` : undefined,
}))
</script>
