<template>
  <div class="doc-page">
    <h1>Drawer 抽屉</h1>
    <p class="doc-page__desc">从屏幕边缘滑出的面板，常用于详情展示或表单填写。</p>

    <DemoBlock title="右侧抽屉" description="默认从右侧滑出。" :code="rightCode">
      <NButton @click="showRight = true">打开右侧抽屉</NButton>
      <NDrawer v-model="showRight" title="右侧抽屉">
        <p style="color:var(--n-color-text-secondary)">这是抽屉的内容区域。</p>
        <template #footer>
          <NSpace>
            <NButton size="sm" variant="secondary" @click="showRight = false">取消</NButton>
            <NButton size="sm" @click="showRight = false">确定</NButton>
          </NSpace>
        </template>
      </NDrawer>
    </DemoBlock>

    <DemoBlock title="不同方向" description="通过 placement 设置弹出方向。" :code="dirCode">
      <NSpace>
        <NButton @click="showLeft = true">左侧</NButton>
        <NButton @click="showTop = true">顶部</NButton>
        <NButton @click="showBottom = true">底部</NButton>
      </NSpace>
      <NDrawer v-model="showLeft" title="左侧抽屉" placement="left" :width="260" />
      <NDrawer v-model="showTop" title="顶部抽屉" placement="top" height="200" />
      <NDrawer v-model="showBottom" title="底部抽屉" placement="bottom" height="200" />
    </DemoBlock>

    <DemoBlock title="禁止遮罩关闭" description="设置 mask-closable 为 false 后点击遮罩层不会关闭。" :code="maskCode">
      <NButton @click="showNoMask = true">禁止遮罩关闭</NButton>
      <NDrawer v-model="showNoMask" title="禁止遮罩关闭" :mask-closable="false">
        <p style="color:var(--n-color-text-secondary)">点击遮罩层不会关闭此抽屉。</p>
      </NDrawer>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const showRight = ref(false)
const showLeft = ref(false)
const showTop = ref(false)
const showBottom = ref(false)
const showNoMask = ref(false)

const rightCode = `<NDrawer v-model="show" title="右侧抽屉">
  <p>内容区域</p>
  <template #footer>
    <NButton size="sm" @click="show = false">确定</NButton>
  </template>
</NDrawer>`

const dirCode = `<NDrawer v-model="show" placement="left" />
<NDrawer v-model="show" placement="top" height="200" />
<NDrawer v-model="show" placement="bottom" height="200" />`

const maskCode = `<NDrawer v-model="show" :mask-closable="false" />`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'boolean', default: '—', desc: '是否显示（必填）' },
  { name: 'title', type: 'string', default: '—', desc: '标题' },
  { name: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", desc: '弹出方向' },
  { name: 'width', type: 'number | string', default: '360', desc: '宽度（左右方向生效）' },
  { name: 'height', type: 'number | string', default: '—', desc: '高度（上下方向生效）' },
  { name: 'maskClosable', type: 'boolean', default: 'true', desc: '点击遮罩层是否关闭' },
]

const eventData = [
  { name: 'update:modelValue', type: '(val: boolean) => void', desc: '显隐状态变化' },
  { name: 'close', type: '() => void', desc: '关闭时触发' },
]

const slotData = [
  { name: 'default', desc: '抽屉主体内容' },
  { name: 'footer', desc: '底部区域' },
]
</script>
