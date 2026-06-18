<template>
  <div class="doc-page">
    <h1>useToggle</h1>
    <p class="doc-page__desc">布尔值切换的组合式函数，提供 toggle、setTrue、setFalse 方法。</p>

    <DemoBlock
      title="基础用法"
      description="返回响应式的 state 和操作方法："
      :code="basicCode"
    >
      <div style="display:flex; gap:8px; align-items:center;">
        <NButton @click="toggle()">Toggle: {{ state ? '开' : '关' }}</NButton>
        <NButton variant="secondary" @click="setTrue()">设为开</NButton>
        <NButton variant="ghost" @click="setFalse()">设为关</NButton>
      </div>
      <div v-if="state" style="margin-top:12px; padding:12px 16px; background:#eff6ff; border-radius:6px; font-size:14px;">
        内容已展开
      </div>
    </DemoBlock>

    <ApiTable title="返回值" :columns="returnColumns" :data="returnData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const { state, toggle, setTrue, setFalse } = useToggle()

const basicCode = `const { state, toggle, setTrue, setFalse } = useToggle()

// 带初始值
const { state } = useToggle(true)`

const returnColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const returnData = [
  { name: 'state', type: 'Readonly<Ref<boolean>>', desc: '响应式的布尔状态' },
  { name: 'toggle', type: '() => void', desc: '切换状态' },
  { name: 'setTrue', type: '() => void', desc: '设置为 true' },
  { name: 'setFalse', type: '() => void', desc: '设置为 false' },
]
</script>
