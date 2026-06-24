<template>
  <li :class="['n-org-chart-node', { 'n-org-chart-node--leaf': isLeaf }]">
    <div class="n-org-chart-node__card" :class="[nodeClass, { 'n-org-chart-node__card--selected': isSelected }]" @click="$emit('node-click', data)">
      <div class="n-org-chart-node__content">
        <slot name="node" :data="data" :expanded="isExpanded" :selected="isSelected">
          <slot name="label" :data="data">
            <span class="n-org-chart-node__label">{{ data[labelKey] }}</span>
          </slot>
        </slot>
      </div>
      <div v-if="collapsible && !isLeaf" class="n-org-chart-node__toggle" @click.stop="$emit('toggle', data)">
        <slot name="expand-icon" :expanded="isExpanded">
          <svg class="n-org-chart-node__toggle-icon" :class="{ 'n-org-chart-node__toggle-icon--expanded': isExpanded }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </slot>
      </div>
    </div>

    <ul v-if="hasChildren && isExpanded" class="n-org-chart-node__children">
      <li v-for="(child, index) in children" :key="child[nodeKey] ?? index" class="n-org-chart-node__child">
        <NOrgChartNode
          :data="child"
          :label-key="labelKey"
          :children-key="childrenKey"
          :expanded-keys="expandedKeys"
          :selected-key="selectedKey"
          :direction="direction"
          :collapsible="collapsible"
          :node-key="nodeKey"
          :node-class="nodeClass"
          @toggle="$emit('toggle', $event)"
          @node-click="$emit('node-click', $event)"
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
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type OrgNode = Record<string, any>

interface Props {
  data: OrgNode
  labelKey: string
  childrenKey: string
  expandedKeys: (string | number)[]
  selectedKey?: string | number | null
  direction: 'vertical' | 'horizontal'
  collapsible: boolean
  nodeKey: string
  nodeClass?: string | object | Array<string | object>
}

const props = defineProps<Props>()

defineEmits<{
  toggle: [node: OrgNode]
  'node-click': [node: OrgNode]
}>()

const children = computed(() => {
  const c = props.data[props.childrenKey]
  return Array.isArray(c) ? c : []
})

const hasChildren = computed(() => children.value.length > 0)
const isLeaf = computed(() => !hasChildren.value)
const nodeKeyValue = computed(() => props.data[props.nodeKey])
const isExpanded = computed(() => props.expandedKeys.includes(nodeKeyValue.value))
const isSelected = computed(() => props.selectedKey != null && props.selectedKey === nodeKeyValue.value)
</script>

<style scoped>
.n-org-chart-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ===== Card ===== */
.n-org-chart-node__card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px;
  background: var(--n-color-bg, #ffffff);
  border: 1px solid var(--n-color-border, #e5e7eb);
  border-radius: var(--n-radius-md, 8px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  z-index: 1;
}

.n-org-chart-node__card:hover {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.n-org-chart-node__card--selected {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* ===== Toggle ===== */
.n-org-chart-node__toggle {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--n-color-bg, #ffffff);
  border: 1px solid var(--n-color-border, #d1d5db);
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s ease;
  color: var(--n-color-text-secondary, #6b7280);
}

.n-org-chart-node__toggle:hover {
  border-color: var(--n-color-primary, #3b82f6);
  color: var(--n-color-primary, #3b82f6);
}

.n-org-chart-node__toggle-icon {
  transition: transform 0.25s ease;
  display: block;
}

.n-org-chart-node__toggle-icon--expanded {
  transform: rotate(180deg);
}

/* ===== Content ===== */
.n-org-chart-node__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.n-org-chart-node__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--n-color-text, #1f2937);
  white-space: nowrap;
}

/* ===== Children ===== */
.n-org-chart-node__children {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 26px 0 0 0;
  position: relative;
}

/* Vertical line from parent down to horizontal connector */
.n-org-chart-node:not(.n-org-chart-node--leaf) > .n-org-chart-node__children::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 26px;
  background: var(--n-color-border, #d1d5db);
  transform: translateX(-50%);
}

/* ===== Child item ===== */
.n-org-chart-node__child {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0 16px;
  position: relative;
}

/* Vertical line from horizontal connector down to each child card */
.n-org-chart-node__child::before {
  content: '';
  position: absolute;
  top: -26px;
  left: 50%;
  width: 2px;
  height: 26px;
  background: var(--n-color-border, #d1d5db);
  transform: translateX(-50%);
}

/* Horizontal connector between siblings */
.n-org-chart-node__child::after {
  content: '';
  position: absolute;
  top: -26px;
  height: 2px;
  background: var(--n-color-border, #d1d5db);
}

/* First child: horizontal line extends from center to right only */
.n-org-chart-node__child:first-child::after {
  left: 50%;
  right: 0;
}

/* Last child: horizontal line extends from left to center only */
.n-org-chart-node__child:last-child::after {
  left: 0;
  right: 50%;
}

/* Middle children: horizontal line goes full width */
.n-org-chart-node__child:not(:first-child):not(:last-child)::after {
  left: 0;
  right: 0;
}

/* Only child: no horizontal line needed */
.n-org-chart-node__child:only-child::after {
  display: none;
}
</style>
