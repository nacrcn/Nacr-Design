<template>
  <div class="doc-page">
    <h1>useMessage</h1>
    <p class="doc-page__desc">轻量消息提示组合式函数，支持 info、success、warning、error 四种类型。</p>

    <DemoBlock
      title="基础用法"
      description="调用 message 实例上的方法显示消息："
      :code="basicCode"
    >
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <NButton @click="message.info('这是一条信息提示')">Info</NButton>
        <NButton @click="message.success('操作成功!')">Success</NButton>
        <NButton variant="secondary" @click="message.warning('请注意!')">Warning</NButton>
        <NButton variant="danger" @click="message.error('操作失败!')">Error</NButton>
      </div>
    </DemoBlock>

    <DemoBlock
      title="自定义时长"
      description="第二个参数指定消息显示时长（毫秒）："
      :code="durationCode"
    >
      <NButton @click="message.success('5秒后消失', 5000)">5 秒后消失</NButton>
    </DemoBlock>

    <ApiTable title="返回值" :columns="returnColumns" :data="returnData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const message = useMessage()

const basicCode = `const message = useMessage()

message.info('这是一条信息提示')
message.success('操作成功!')
message.warning('请注意!')
message.error('操作失败!')`

const durationCode = `message.success('5秒后消失', 5000)`

const returnColumns = [
  { key: 'name', title: '方法', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const returnData = [
  { name: 'info', type: '(text: string, duration?: number) => void', desc: '信息提示' },
  { name: 'success', type: '(text: string, duration?: number) => void', desc: '成功提示' },
  { name: 'warning', type: '(text: string, duration?: number) => void', desc: '警告提示' },
  { name: 'error', type: '(text: string, duration?: number) => void', desc: '错误提示' },
]
</script>
