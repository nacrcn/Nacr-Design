<template>
    <div class="n-tree-node" :style="{ paddingLeft: level * 20 + 12 + 'px' }">
        <span v-if="node[childrenField]?.length" class="n-tree-node__toggle" @click.stop="expanded = !expanded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                :style="{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }">
                <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </span>
        <span v-else class="n-tree-node__toggle-placeholder" />
        <span v-if="multiple" class="n-tree-node__checkbox" :class="{
            'n-tree-node__checkbox--checked': isChecked,
            'n-tree-node__checkbox--indeterminate': isIndeterminate,
        }" @click.stop="emit('check', node[keyField])" />
        <span
            :class="['n-tree-node__label', { 'n-tree-node__label--selected': !multiple && node[keyField] === selectedValue, 'n-tree-node__label--disabled': node.disabled }]"
            @click.stop="handleSelect">{{ node[labelField] }}</span>
    </div>
    <template v-if="expanded && node[childrenField]?.length">
        <TreeNodeInner v-for="child in node[childrenField]" :key="child[keyField]" :node="child" :level="level + 1"
            :selected-value="selectedValue" :checked-keys="checkedKeys" :multiple="multiple" :label-field="labelField"
            :key-field="keyField" :children-field="childrenField" :default-expand-all="defaultExpandAll"
            @select="emit('select', $event)" @check="emit('check', $event)" />
    </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    node: any
    level: number
    selectedValue: any
    checkedKeys: any[]
    multiple?: boolean
    labelField: string
    keyField: string
    childrenField: string
    defaultExpandAll?: boolean
}>()

const emit = defineEmits<{
    select: [val: any]
    check: [val: any]
}>()

const expanded = ref(!!props.defaultExpandAll)

const isChecked = computed(() => props.checkedKeys?.includes(props.node[props.keyField]))
const isIndeterminate = computed(() => {
    if (!props.node[props.childrenField]?.length) return false
    const childKeys = getAllChildKeys(props.node[props.childrenField])
    const checked = childKeys.filter((k: any) => props.checkedKeys?.includes(k))
    return checked.length > 0 && checked.length < childKeys.length
})

function getAllChildKeys(nodes: any[]): any[] {
    const keys: any[] = []
    for (const n of nodes) {
        keys.push(n[props.keyField])
        if (n[props.childrenField]) keys.push(...getAllChildKeys(n[props.childrenField]))
    }
    return keys
}

function handleSelect() {
    if (props.node.disabled) return
    if (props.node[props.childrenField]?.length) {
        expanded.value = !expanded.value
        return
    }
    if (!props.multiple) {
        emit('select', props.node[props.keyField])
    }
}
</script>

<style scoped>
.n-tree-node {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    color: var(--n-color-text-secondary);
    transition: background 0.15s;
}

.n-tree-node:hover {
    background: var(--n-color-fill-hover);
}

.n-tree-node__toggle {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--n-color-text-secondary);
    font-size: 12px;
    flex-shrink: 0;
}

.n-tree-node__toggle-placeholder {
    width: 18px;
    flex-shrink: 0;
}

.n-tree-node__label {
    flex: 1;
    user-select: none;
}

.n-tree-node__label--selected {
    color: var(--n-color-primary);
    font-weight: 500;
}

.n-tree-node__label--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Checkbox */
.n-tree-node__checkbox {
    width: 14px;
    height: 14px;
    border: 1.5px solid var(--n-color-border-hover);
    border-radius: 3px;
    flex-shrink: 0;
    position: relative;
    transition: all 0.15s;
    cursor: pointer;
}

.n-tree-node__checkbox--checked {
    background: var(--n-color-primary);
    border-color: var(--n-color-primary);
}

.n-tree-node__checkbox--checked::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 0px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 1.5px 1.5px 0;
    transform: rotate(45deg);
}

.n-tree-node__checkbox--indeterminate {
    border-color: var(--n-color-primary);
}

.n-tree-node__checkbox--indeterminate::after {
    content: '';
    position: absolute;
    left: 2px;
    top: 4px;
    width: 7px;
    height: 2px;
    background: var(--n-color-primary);
    border-radius: 1px;
}
</style>
