<template>
  <div class="doc-page">
    <h1>useNotification</h1>
    <p class="doc-page__desc">通知提醒组合式函数，支持 info、success、warning、error 四种类型，自动挂载渲染通知组件。</p>

    <DemoBlock
      title="基础用法"
      description="调用 notify 实例上的方法显示通知："
      :code="basicCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <NButton @click="notify.info({ title: '信息', content: '这是一条信息通知' })">Info</NButton>
        <NButton @click="notify.success({ title: '成功', content: '操作成功完成!' })">Success</NButton>
        <NButton variant="secondary" @click="notify.warning({ title: '警告', content: '请注意风险!' })">Warning</NButton>
        <NButton variant="danger" @click="notify.error({ title: '错误', content: '操作失败!' })">Error</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="简写模式"
      description="直接传入字符串作为内容："
      :code="shorthandCode"
    >
      <NButton @click="notify.success('操作成功!')">简写通知</NButton>
    </DemoBlock>

    <DemoBlock
      title="自定义时长"
      description="通过 duration 设置自动关闭时间（毫秒），设置为 0 不自动关闭："
      :code="durationCode"
    >
      <NButton @click="notify.info({ title: '持久通知', content: '不会自动关闭', duration: 0 })">不自动关闭</NButton>
    </DemoBlock>

    <ApiTable title="返回值" :columns="returnColumns" :data="returnData" />
    <ApiTable title="NotifyOptions" :columns="optionColumns" :data="optionData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const { notify } = useNotification()

const basicCode = `const { notify } = useNotification()

notify.info({ title: '信息', content: '这是一条信息通知' })
notify.success({ title: '成功', content: '操作成功完成!' })
notify.warning({ title: '警告', content: '请注意风险!' })
notify.error({ title: '错误', content: '操作失败!' })`

const shorthandCode = `notify.success('操作成功!')`

const durationCode = `notify.info({ title: '持久通知', content: '不会自动关闭', duration: 0 })`

const returnColumns = [
  { key: 'name', title: '方法', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const returnData = [
  { name: 'notify', type: '(opts: NotifyOptions | string) => void', desc: '默认为 info 类型的通知' },
  { name: 'notify.info', type: '(opts: NotifyOptions | string) => void', desc: '信息通知' },
  { name: 'notify.success', type: '(opts: NotifyOptions | string) => void', desc: '成功通知' },
  { name: 'notify.warning', type: '(opts: NotifyOptions | string) => void', desc: '警告通知' },
  { name: 'notify.error', type: '(opts: NotifyOptions | string) => void', desc: '错误通知' },
]

const optionColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const optionData = [
  { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", desc: '通知类型' },
  { name: 'title', type: 'string', default: '—', desc: '通知标题' },
  { name: 'content', type: 'string', default: '—', desc: '通知内容（必填）' },
  { name: 'duration', type: 'number', default: '4500', desc: '自动关闭时间(ms)，0 为不关闭' },
]
</script>
