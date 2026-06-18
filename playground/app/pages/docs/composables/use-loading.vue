<template>
  <div class="doc-page">
    <h1>useLoading</h1>
    <p class="doc-page__desc">异步加载状态管理的组合式函数，提供 withLoading 包装器。</p>

    <DemoBlock title="基础用法" description="使用 withLoading 包装异步函数，自动管理 loading 状态：" :code="basicCode">
      <div style="display:flex; gap:8px; align-items:center;">
        <NButton :loading="loading" @click="doSomething">模拟异步操作</NButton>
      </div>
    </DemoBlock>

    <ApiTable title="返回值" :columns="returnColumns" :data="returnData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const { loading, withLoading } = useLoading()

const message = useMessage()

async function doSomething() {
  await withLoading(() => new Promise(resolve => setTimeout(resolve, 2000)))
  message.success('异步操作完成!')
}

const basicCode = `const { loading, withLoading } = useLoading()

async function doSomething() {
  await withLoading(() => new Promise(resolve => setTimeout(resolve, 2000)))
  message.success('异步操作完成!')
}`
const returnColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const returnData = [
  { name: 'loading', type: 'Readonly<Ref<boolean>>', desc: '响应式的加载状态' },
  { name: 'withLoading', type: '<T>(fn: () => Promise<T>) => Promise<T>', desc: '包装异步函数，自动管理 loading' },
]
</script>
