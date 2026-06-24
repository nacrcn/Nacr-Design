<template>
  <div :class="['n-org-chart', `n-org-chart--${direction}`]">
    <div class="n-org-chart__wrapper">
      <ul class="n-org-chart__root">
        <NOrgChartNode
          :data="data"
          :label-key="labelKey"
          :children-key="childrenKey"
          :expanded-keys="expandedKeys"
          :selected-key="selectedKey"
          :direction="direction"
          :collapsible="collapsible"
          :node-key="nodeKey"
          :node-class="nodeClass"
          @toggle="onToggle"
          @node-click="onNodeClick"
        >
          <template #node="nodeData" v-if="$slots.node">
            <slot name="node" v-bind="nodeData" />
          </template>
          <template #label="nodeData" v-if="$slots.label">
            <slot name="label" v-bind="nodeData" />
          </template>
          <template #expand-icon="iconData" v-if="$slots['expand-icon']">
            <slot name="expand-icon" v-bind="iconData" />
          </template>
        </NOrgChartNode>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

type OrgNode = Record<string, any>

interface Props {
  data: OrgNode
  labelKey?: string
  childrenKey?: string
  defaultExpandAll?: boolean
  defaultExpandedKeys?: (string | number)[]
  collapsible?: boolean
  direction?: 'vertical' | 'horizontal'
  nodeKey?: string
  selectedKey?: string | number | null
  nodeClass?: string | object | Array<string | object>
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  childrenKey: 'children',
  defaultExpandAll: true,
  defaultExpandedKeys: () => [],
  collapsible: true,
  direction: 'vertical',
  nodeKey: 'key',
  selectedKey: null,
})

const emit = defineEmits<{
  'update:selectedKey': [key: string | number | null]
  'node-click': [node: OrgNode]
  expand: [keys: (string | number)[]]
  collapse: [node: OrgNode]
}>()

const expandedKeys = ref<(string | number)[]>([])

function collectAllKeys(node: OrgNode, key: string, childKey: string): (string | number)[] {
  const keys: (string | number)[] = []
  const val = node[key]
  if (val != null) keys.push(val)
  const children = node[childKey]
  if (Array.isArray(children)) {
    for (const child of children) {
      keys.push(...collectAllKeys(child, key, childKey))
    }
  }
  return keys
}

watch(
  () => [props.data, props.defaultExpandAll, props.defaultExpandedKeys] as const,
  ([data, expandAll, expanded]) => {
    if (expandAll) {
      expandedKeys.value = collectAllKeys(data, props.nodeKey, props.childrenKey)
    } else {
      expandedKeys.value = [...expanded]
    }
  },
  { immediate: true }
)

function onToggle(node: OrgNode) {
  const key = node[props.nodeKey]
  const idx = expandedKeys.value.indexOf(key)
  if (idx >= 0) {
    expandedKeys.value.splice(idx, 1)
    emit('collapse', node)
  } else {
    expandedKeys.value.push(key)
    emit('expand', [...expandedKeys.value])
  }
}

function onNodeClick(node: OrgNode) {
  emit('node-click', node)
  if (props.selectedKey !== undefined) {
    emit('update:selectedKey', node[props.nodeKey])
  }
}

function expandAll() {
  expandedKeys.value = collectAllKeys(props.data, props.nodeKey, props.childrenKey)
}

function collapseAll() {
  expandedKeys.value = []
}

defineExpose({ expandAll, collapseAll, expandedKeys })
</script>

<style scoped>
.n-org-chart {
  display: flex;
  width: 100%;
  overflow: auto;
  padding: 24px;
}

.n-org-chart--vertical {
  justify-content: center;
}

.n-org-chart--horizontal {
  align-items: flex-start;
}

.n-org-chart__wrapper {
  display: inline-flex;
}

.n-org-chart__root {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
