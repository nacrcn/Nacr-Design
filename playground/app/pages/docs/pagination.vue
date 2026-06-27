<template>
  <div class="doc-page">
    <h1>Pagination 分页</h1>
    <p class="doc-page__desc">当数据量过多时，使用分页可以分解数据，便于用户查看。</p>

    <DemoBlock title="基础用法" description="通过 v-model 绑定当前页码，total 设置数据总量。" :code="basicCode">
      <NPagination v-model="page1" :total="100" />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前页：{{ page1 }}</div>
    </DemoBlock>

    <DemoBlock title="显示总数" description="设置 show-total 显示数据总量，设置为 'range' 可显示当前范围。" :code="totalCode">
      <NPagination v-model="page2" :total="200" show-total style="margin-bottom:12px;" />
      <NPagination v-model="page2" :total="200" show-total="range" />
    </DemoBlock>

    <DemoBlock title="修改每页条数" description="设置 show-size-changer 切换每页条数，通过 v-model:pageSize 双向绑定每页条数。" :code="sizeCode">
      <NPagination v-model="page3" v-model:page-size="pageSize3" :total="500" show-size-changer show-total />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前页：{{ page3 }}，每页条数：{{ pageSize3 }}</div>
    </DemoBlock>

    <DemoBlock title="快速跳转" description="设置 show-quick-jumper 可以快速跳转到某一页。" :code="jumperCode">
      <NPagination v-model="page4" :total="500" show-quick-jumper />
    </DemoBlock>

    <DemoBlock title="完整功能" description="同时使用 show-total、show-size-changer、show-quick-jumper 显示完整功能，v-model:pageSize 双向绑定每页条数。" :code="fullCode">
      <NPagination
        v-model="page5"
        v-model:page-size="pageSize5"
        :total="1000"
        show-total="range"
        show-size-changer
        show-quick-jumper
      />
    </DemoBlock>

    <DemoBlock title="迷你模式" description="设置 simple 使用迷你分页，适合弹窗等空间有限场景。" :code="simpleCode">
      <NPagination v-model="page6" :total="100" simple />
    </DemoBlock>

    <DemoBlock title="不同尺寸" description="设置 size 使用不同尺寸的分页组件。" :code="sizesCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NPagination v-model="page7" :total="100" size="sm" />
        <NPagination v-model="page7" :total="100" size="md" />
        <NPagination v-model="page7" :total="100" size="lg" />
      </div>
    </DemoBlock>

    <DemoBlock title="自定义页码数量" description="设置 pager-count 控制显示的页码按钮数量，默认为 7。" :code="pagerCountCode">
      <NPagination v-model="page8" :total="200" :pager-count="5" style="margin-bottom:12px;" />
      <NPagination v-model="page8" :total="200" :pager-count="9" />
    </DemoBlock>

    <DemoBlock title="自定义前后文本" description="设置 prev-text / next-text 自定义前后按钮文字。" :code="textCode">
      <NPagination v-model="page9" :total="100" prev-text="上一页" next-text="下一页" />
    </DemoBlock>

    <DemoBlock title="禁用状态" description="设置 disabled 禁用分页组件。" :code="disabledCode">
      <NPagination v-model="page10" :total="100" disabled />
    </DemoBlock>

    <DemoBlock title="仅一页时隐藏" description="设置 hide-on-single-page，当只有一页时自动隐藏分页。" :code="hideCode">
      <NSwitch v-model="hideWhenSingle" style="margin-bottom:12px;" />
      <NPagination v-model="page11" :total="5" :hide-on-single-page="hideWhenSingle" :page-size="5" />
    </DemoBlock>

    <DemoBlock title="事件回调" description="监听 change 和 page-size-change 事件，通过 v-model:pageSize 双向绑定每页条数。" :code="eventCode">
      <NPagination
        v-model="page12"
        v-model:page-size="pageSize12"
        :total="500"
        show-size-changer
        show-total
        @change="onChange"
        @page-size-change="onSizeChange"
      />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        change 事件：{{ changeMsg }}<br />
        pageSizeChange 事件：{{ sizeChangeMsg }}
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const page1 = ref(1)
const page2 = ref(1)
const page3 = ref(1)
const pageSize3 = ref(10)
const page4 = ref(1)
const page5 = ref(1)
const pageSize5 = ref(10)
const page6 = ref(1)
const page7 = ref(1)
const page8 = ref(1)
const page9 = ref(1)
const page10 = ref(1)
const page11 = ref(1)
const page12 = ref(1)
const pageSize12 = ref(10)
const hideWhenSingle = ref(true)
const changeMsg = ref('—')
const sizeChangeMsg = ref('—')

function onChange(page: number) {
  changeMsg.value = `页码变为 ${page}`
}

function onSizeChange(size: number) {
  sizeChangeMsg.value = `每页条数变为 ${size}`
}

/* ---------- Demo Code ---------- */

const basicCode = `<template>
  <NPagination v-model="page" :total="100" />
  <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前页：{{ page }}</div>
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const totalCode = `<template>
  <NPagination v-model="page" :total="200" show-total style="margin-bottom:12px;" />
  <NPagination v-model="page" :total="200" show-total="range" />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const sizeCode = `<template>
  <NPagination v-model="page" v-model:page-size="pageSize" :total="500" show-size-changer show-total />
  <div>当前页：{{ page }}，每页条数：{{ pageSize }}</div>
</template>

<script setup lang="ts">
const page = ref(1)
const pageSize = ref(10)
<\/script>`

const jumperCode = `<template>
  <NPagination v-model="page" :total="500" show-quick-jumper />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const fullCode = `<template>
  <NPagination
    v-model="page"
    v-model:page-size="pageSize"
    :total="1000"
    show-total="range"
    show-size-changer
    show-quick-jumper
  />
</template>

<script setup lang="ts">
const page = ref(1)
const pageSize = ref(10)
<\/script>`

const simpleCode = `<template>
  <NPagination v-model="page" :total="100" simple />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const sizesCode = `<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <NPagination v-model="page" :total="100" size="sm" />
    <NPagination v-model="page" :total="100" size="md" />
    <NPagination v-model="page" :total="100" size="lg" />
  </div>
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const pagerCountCode = `<template>
  <NPagination v-model="page" :total="200" :pager-count="5" style="margin-bottom:12px;" />
  <NPagination v-model="page" :total="200" :pager-count="9" />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const textCode = `<template>
  <NPagination v-model="page" :total="100" prev-text="上一页" next-text="下一页" />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const disabledCode = `<template>
  <NPagination v-model="page" :total="100" disabled />
</template>

<script setup lang="ts">
const page = ref(1)
<\/script>`

const hideCode = `<template>
  <NSwitch v-model="hide" style="margin-bottom:12px;" />
  <NPagination v-model="page" :total="5" :hide-on-single-page="hide" :page-size="5" />
</template>

<script setup lang="ts">
const page = ref(1)
const hide = ref(true)
<\/script>`

const eventCode = `<template>
  <NPagination
    v-model="page"
    v-model:page-size="pageSize"
    :total="500"
    show-size-changer
    show-total
    @change="onChange"
    @page-size-change="onSizeChange"
  />
  <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
    change 事件：{{ changeMsg }}<br />
    pageSizeChange 事件：{{ sizeChangeMsg }}
  </div>
</template>

<script setup lang="ts">
const page = ref(1)
const pageSize = ref(10)
const changeMsg = ref('—')
const sizeChangeMsg = ref('—')

function onChange(page: number) {
  changeMsg.value = \`页码变为 \${page}\`
}

function onSizeChange(size: number) {
  sizeChangeMsg.value = \`每页条数变为 \${size}\`
}
<\/script>`

/* ---------- API Tables ---------- */

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
  { name: 'modelValue', type: 'number', default: '—', desc: '当前页码（必填，支持 v-model）' },
  { name: 'total', type: 'number', default: '—', desc: '数据总量（必填）' },
  { name: 'pageSize', type: 'number', default: '10', desc: '每页条数，支持 v-model:pageSize 双向绑定' },
  { name: 'pageSizes', type: 'number[]', default: '[10, 20, 50, 100]', desc: '每页条数选项' },
  { name: 'pagerCount', type: 'number', default: '7', desc: '页码按钮的数量（≥5 且为奇数）' },
  { name: 'showSizeChanger', type: 'boolean', default: 'false', desc: '是否展示每页条数切换器' },
  { name: 'showQuickJumper', type: 'boolean', default: 'false', desc: '是否显示快速跳转' },
  { name: 'showTotal', type: "boolean | 'range'", default: 'false', desc: '是否显示总数；设为 "range" 显示当前范围' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '分页尺寸' },
  { name: 'simple', type: 'boolean', default: 'false', desc: '是否使用简洁模式' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'hideOnSinglePage', type: 'boolean', default: 'false', desc: '只有一页时是否隐藏' },
  { name: 'prevText', type: 'string', default: "''", desc: '替代上一页箭头的文字' },
  { name: 'nextText', type: 'string', default: "''", desc: '替代下一页箭头的文字' },
]

const eventData = [
  { name: 'update:modelValue', type: '(page: number) => void', desc: '页码变化时触发' },
  { name: 'update:pageSize', type: '(size: number) => void', desc: '每页条数变化时触发' },
  { name: 'change', type: '(page: number) => void', desc: '页码改变回调' },
  { name: 'pageSizeChange', type: '(size: number) => void', desc: '每页条数变化时触发' },
]

const slotData = [
  { name: 'prev', desc: '自定义上一页按钮内容' },
  { name: 'next', desc: '自定义下一页按钮内容' },
]
</script>
