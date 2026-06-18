<template>
  <div class="doc-page">
    <h1>Notification 通知提醒框</h1>
    <p class="doc-page__desc">
      全局通知组件，通过 useNotification 组合式函数调用。支持 4 种语义类型、自定义时长和仅内容模式。
    </p>

    <!-- ────── 不同类型 ────── -->
    <DemoBlock title="不同类型" description="通知有 4 种语义类型：info、success、warning、error。" :code="typeCode">
      <NSpace>
        <NButton @click="notify.info({ title: '信息通知', content: '这是一条普通的提示信息。' })">Info</NButton>
        <NButton @click="notify.success({ title: '成功通知', content: '数据已成功保存到服务器。' })">Success</NButton>
        <NButton variant="secondary" @click="notify.warning({ title: '警告通知', content: '请注意，余额即将不足。' })">Warning</NButton>
        <NButton variant="danger" @click="notify.error({ title: '错误通知', content: '网络请求失败，请检查后重试。' })">Error</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── 仅内容 ────── -->
    <DemoBlock title="仅内容" description="省略 title 只显示内容文本，通知框更简洁紧凑。" :code="noTitleCode">
      <NSpace>
        <NButton @click="notify.success({ content: '操作成功完成！' })">成功（仅内容）</NButton>
        <NButton @click="notify.info({ content: '系统将于 5 分钟后维护。' })">信息（仅内容）</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── 自定义时长 ────── -->
    <DemoBlock title="自定义时长" description="通过 duration 设置自动关闭时间（毫秒），设为 0 则不自动关闭。" :code="durationCode">
      <NSpace>
        <NButton @click="notify.info({ title: '快速关闭', content: '2 秒后自动关闭', duration: 2000 })">2 秒</NButton>
        <NButton @click="notify.warning({ title: '持久通知', content: '不会自动关闭，需手动点击关闭', duration: 0 })">不自动关闭</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── 字符串简写 ────── -->
    <DemoBlock title="字符串简写" description="传入字符串可直接作为 content，无需对象形式。" :code="shorthandCode">
      <NSpace>
        <NButton @click="notify.info('这是一条简写的信息通知')">Info 简写</NButton>
        <NButton @click="notify.success('操作成功！')">Success 简写</NButton>
      </NSpace>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="useNotification() 返回值" :columns="methodColumns" :data="methodData" />
    <ApiTable title="NotificationOption" :columns="optionColumns" :data="optionData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const { notify } = useNotification()

const typeCode = `const { notify } = useNotification()

notify.info({ title: '信息通知', content: '这是一条提示信息。' })
notify.success({ title: '成功通知', content: '操作成功完成。' })
notify.warning({ title: '警告通知', content: '请注意风险。' })
notify.error({ title: '错误通知', content: '操作失败。' })`

const noTitleCode = `notify.success({ content: '操作成功完成！' })
notify.info({ content: '系统将于 5 分钟后维护。' })`

const durationCode = `notify.info({ title: '快速关闭', content: '2 秒后自动关闭', duration: 2000 })
notify.warning({ title: '持久通知', content: '不会自动关闭', duration: 0 })`

const shorthandCode = `notify.info('这是一条简写的信息通知')
notify.success('操作成功！')`

const methodColumns = [
  { key: 'name', title: '方法', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'notify', type: '(opts: NotificationOption | string) => void', desc: '通用通知（默认 info）' },
  { name: 'notify.info', type: '(opts: NotificationOption | string) => void', desc: '信息通知' },
  { name: 'notify.success', type: '(opts: NotificationOption | string) => void', desc: '成功通知' },
  { name: 'notify.warning', type: '(opts: NotificationOption | string) => void', desc: '警告通知' },
  { name: 'notify.error', type: '(opts: NotificationOption | string) => void', desc: '错误通知' },
]

const optionColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const optionData = [
  { name: 'title', type: 'string', default: '—', desc: '通知标题' },
  { name: 'content', type: 'string', default: '—', desc: '通知内容（必填）' },
  { name: 'duration', type: 'number', default: '4500', desc: '自动关闭时间(ms)，0 为不关闭' },
]
</script>
