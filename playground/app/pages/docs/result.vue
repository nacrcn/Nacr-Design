<template>
  <div class="doc-page">
    <h1>Result 结果页</h1>
    <p class="doc-page__desc">用于反馈操作结果，支持多种状态类型。</p>

    <DemoBlock title="成功" description="操作成功的结果展示。" :code="successCode">
      <NResult status="success" title="操作成功" description="您的提交已成功处理，请稍后查看结果。">
        <NButton>返回首页</NButton>
      </NResult>
    </DemoBlock>

    <DemoBlock title="错误" description="操作失败的结果展示。" :code="errorCode">
      <NResult status="error" title="提交失败" description="请检查网络连接后重试。">
        <NButton variant="secondary">重试</NButton>
      </NResult>
    </DemoBlock>

    <DemoBlock title="HTTP 状态码" description="内置 403、404、500 状态页面。" :code="httpCode">
      <NResult status="404" title="404" description="抱歉，您访问的页面不存在。">
        <NButton>返回首页</NButton>
      </NResult>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const successCode = `<NResult status="success" title="操作成功" description="您的提交已成功处理。">
  <NButton>返回首页</NButton>
</NResult>`

const errorCode = `<NResult status="error" title="提交失败" description="请检查网络连接后重试。">
  <NButton variant="secondary">重试</NButton>
</NResult>`

const httpCode = `<NResult status="404" title="404" description="抱歉，您访问的页面不存在。">
  <NButton>返回首页</NButton>
</NResult>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'status', type: "'info' | 'success' | 'warning' | 'error' | '404' | '403' | '500'", default: "'info'", desc: '结果状态' },
  { name: 'title', type: 'string', default: '—', desc: '标题' },
  { name: 'description', type: 'string', default: '—', desc: '描述' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '操作按钮区域' },
]
</script>
