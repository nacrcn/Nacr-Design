<template>
  <div class="doc-page">
    <h1>Table 表格</h1>
    <p class="doc-page__desc">用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。</p>

    <DemoBlock title="基础用法" description="通过 columns 和 data 定义列和数据：" :code="basicCode">
      <NTable :columns="basicColumns" :data="basicData" />
    </DemoBlock>

    <DemoBlock title="带边框和斑马纹" description="bordered 显示边框，stripe 显示斑马纹，可组合使用。" :code="borderedCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NTable :columns="basicColumns" :data="basicData" bordered />
        <NTable :columns="basicColumns" :data="basicData" stripe />
        <NTable :columns="basicColumns" :data="basicData" bordered stripe />
      </div>
    </DemoBlock>

    <DemoBlock title="表格尺寸" description="size 支持 xs / sm / md / lg 四种尺寸。" :code="sizeCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NTable :columns="basicColumns" :data="basicData" size="xs" bordered />
        <NTable :columns="basicColumns" :data="basicData" size="sm" bordered />
        <NTable :columns="basicColumns" :data="basicData" size="md" bordered />
        <NTable :columns="basicColumns" :data="basicData" size="lg" bordered />
      </div>
    </DemoBlock>

    <DemoBlock title="可排序" description="设置列的 sortable 属性启用排序，支持升序/降序切换。" :code="sortableCode">
      <NTable :columns="sortableColumns" :data="sortableData" bordered />
    </DemoBlock>

    <DemoBlock title="多选" description="rowSelection 配置 checkbox 多选，onChange 回调获取选中行。" :code="checkboxCode">
      <p style="margin-bottom:8px;font-size:14px;color:#6b7280;">已选中：{{ selectedKeys.length }} 项</p>
      <NTable :columns="basicColumns" :data="basicData" :row-selection="{ type: 'checkbox', selectedRowKeys: selectedKeys, onChange: onSelectionChange }" bordered />
    </DemoBlock>

    <DemoBlock title="单选" description="rowSelection 配置 radio 单选。" :code="radioCode">
      <p style="margin-bottom:8px;font-size:14px;color:#6b7280;">已选中：{{ radioKey || '无' }}</p>
      <NTable :columns="basicColumns" :data="basicData" :row-selection="{ type: 'radio', selectedRowKeys: radioKey ? [radioKey] : [], onChange: onRadioChange }" bordered />
    </DemoBlock>

    <DemoBlock title="可展开行" description="通过 #expand-row 插槽自定义展开内容。" :code="expandCode">
      <NTable :columns="basicColumns" :data="basicData" bordered>
        <template #expand-row="{ record }">
          <div style="padding:8px 0;line-height:1.8;">
            <p><strong>姓名：</strong>{{ record.name }}</p>
            <p><strong>年龄：</strong>{{ record.age }}</p>
            <p><strong>地址：</strong>{{ record.address }}</p>
          </div>
        </template>
      </NTable>
    </DemoBlock>

    <DemoBlock title="自定义列渲染" description="通过 slotName 指定列插槽名，实现标签、按钮等自定义渲染。" :code="slotCode">
      <NTable :columns="customSlotColumns" :data="basicData" bordered>
        <template #nameCell="{ record }">
          <span style="color:var(--n-color-primary);font-weight:500;">{{ record.name }}</span>
        </template>
        <template #statusCell="{ record }">
          <span :style="{ color: record.status === 'active' ? 'var(--n-color-success)' : 'var(--n-color-text-disabled)' }">
            {{ record.status === 'active' ? '在线' : '离线' }}
          </span>
        </template>
        <template #actionCell="{ record }">
          <NButton size="sm" variant="ghost" @click="handleEdit(record)">编辑</NButton>
          <NButton size="sm" variant="danger" style="margin-left:4px;" @click="handleDelete(record)">删除</NButton>
        </template>
      </NTable>
    </DemoBlock>

    <DemoBlock title="文字省略" description="设置列的 ellipsis 属性启用文字省略，需配合 width 使用。" :code="ellipsisCode">
      <NTable :columns="ellipsisColumns" :data="ellipsisData" bordered />
    </DemoBlock>

    <DemoBlock title="固定表头" description="通过 scroll.y 设置纵向滚动高度，固定表头。" :code="scrollCode">
      <NTable :columns="basicColumns" :data="scrollData" :scroll="{ y: 240 }" bordered />
    </DemoBlock>

    <DemoBlock title="分页" description="pagination 配置分页参数，showTotal 显示总数，showPageSize 切换每页条数。" :code="paginationCode">
      <NTable :columns="basicColumns" :data="pageData" :pagination="{ current: page, pageSize: 5, total: 50 }" :show-total="true" :show-page-size="true" bordered @page-change="onPageChange" @page-size-change="onPageSizeChange" />
    </DemoBlock>

    <DemoBlock title="加载状态" description="loading 控制加载状态，loadingText 自定义提示文字。" :code="loadingCode">
      <NButton size="sm" @click="isLoading = !isLoading">{{ isLoading ? '取消加载' : '开始加载' }}</NButton>
      <div style="margin-top:12px;">
        <NTable :columns="basicColumns" :data="basicData" :loading="isLoading" loading-text="数据加载中..." bordered />
      </div>
    </DemoBlock>

    <DemoBlock title="工具栏" description="通过 #toolbar 插槽在表格顶部添加搜索、新增等操作。" :code="toolbarCode">
      <NTable :columns="basicColumns" :data="basicData" bordered>
        <template #toolbar>
          <span style="font-size:16px;font-weight:600;">用户列表</span>
          <div style="display:flex;gap:8px;">
            <NButton size="sm">导出</NButton>
            <NButton size="sm" type="primary">新增</NButton>
          </div>
        </template>
      </NTable>
    </DemoBlock>

    <DemoBlock title="行样式与自定义空状态" description="rowClassName / rowStyle 自定义行样式；#empty 插槽自定义空状态。" :code="rowStyleCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <NTable :columns="basicColumns" :data="basicData" :row-class-name="(r: any) => r.age > 30 ? 'row-warn' : ''" bordered />
        <NTable :columns="basicColumns" :data="[]" bordered>
          <template #empty>
            <div style="padding:24px;text-align:center;">
              <p style="font-size:16px;margin:0 0 8px;">🎉 暂无数据</p>
              <NButton size="sm">添加数据</NButton>
            </div>
          </template>
        </NTable>
      </div>
    </DemoBlock>

    <DemoBlock title="表头分组" description="通过 column.children 配置多级表头。" :code="groupHeaderCode">
      <NTable :columns="groupHeaderColumns" :data="basicData" bordered />
    </DemoBlock>

    <DemoBlock title="方法调用" description="通过 ref 调用 getSelectedRows / clearSelection / expandAll 等方法。" :code="methodCode">
      <NTable ref="methodTableRef" :columns="basicColumns" :data="basicData" :row-selection="{ type: 'checkbox', selectedRowKeys: methodKeys, onChange: (k: any) => methodKeys = k }" bordered>
        <template #expand-row="{ record }">
          <p>展开详情：{{ record.name }}，{{ record.age }}岁</p>
        </template>
      </NTable>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
        <NButton size="sm" @click="methodTableRef?.getSelectedRows?.()">获取选中项</NButton>
        <NButton size="sm" @click="methodTableRef?.selectAll?.(true)">全选</NButton>
        <NButton size="sm" @click="methodTableRef?.clearSelection?.()">清除选择</NButton>
        <NButton size="sm" @click="methodTableRef?.expandAll?.(true)">展开全部</NButton>
        <NButton size="sm" @click="methodTableRef?.expandAll?.(false)">折叠全部</NButton>
      </div>
    </DemoBlock>

    <ApiTable title="Table Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Column 配置" :columns="propColumns" :data="columnData" />
    <ApiTable title="rowSelection" :columns="propColumns" :data="selectionData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
definePageMeta({ layout: 'doc' })

// ======================== 数据 ========================
const basicColumns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', align: 'center' as const },
  { title: '地址', dataIndex: 'address' },
]
const basicData = [
  { key: '1', name: '张三', age: 28, address: '北京市朝阳区建国路88号' },
  { key: '2', name: '李四', age: 32, address: '上海市浦东新区世纪大道1号' },
  { key: '3', name: '王五', age: 25, address: '广州市天河区体育西路103号' },
  { key: '4', name: '赵六', age: 36, address: '深圳市南山区科技园路8号' },
]

// ======================== 代码字符串 ========================
const basicCode = `<template>
  <NTable :columns="columns" :data="data" />
</template>

<script setup lang="ts">
const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', align: 'center' },
  { title: '地址', dataIndex: 'address' },
]
const data = [
  { key: '1', name: '张三', age: 28, address: '北京市朝阳区建国路88号' },
  { key: '2', name: '李四', age: 32, address: '上海市浦东新区世纪大道1号' },
  { key: '3', name: '王五', age: 25, address: '广州市天河区体育西路103号' },
]
<\/script>`

const borderedCode = `<template>
  <NTable :columns="columns" :data="data" bordered />
  <NTable :columns="columns" :data="data" stripe />
  <NTable :columns="columns" :data="data" bordered stripe />
</template>`

const sizeCode = `<template>
  <NTable :columns="columns" :data="data" size="xs" bordered />
  <NTable :columns="columns" :data="data" size="sm" bordered />
  <NTable :columns="columns" :data="data" size="md" bordered />
  <NTable :columns="columns" :data="data" size="lg" bordered />
</template>`

// ======================== 排序 ========================
const sortableColumns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', align: 'center' as const, sortable: true },
  { title: '薪资', dataIndex: 'salary', align: 'right' as const, sortable: true },
  { title: '地址', dataIndex: 'address' },
]
const sortableData = [
  { key: '1', name: '张三', age: 28, salary: 15000, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 32, salary: 22000, address: '上海市浦东新区' },
  { key: '3', name: '王五', age: 25, salary: 12000, address: '广州市天河区' },
  { key: '4', name: '赵六', age: 36, salary: 30000, address: '深圳市南山区' },
  { key: '5', name: '钱七', age: 29, salary: 18000, address: '杭州市西湖区' },
]
const sortableCode = `<template>
  <NTable :columns="columns" :data="data" bordered />
</template>

<script setup lang="ts">
const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', align: 'center', sortable: true },
  { title: '薪资', dataIndex: 'salary', align: 'right', sortable: true },
  { title: '地址', dataIndex: 'address' },
]
const data = [
  { key: '1', name: '张三', age: 28, salary: 15000, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 32, salary: 22000, address: '上海市浦东新区' },
]
<\/script>`

// ======================== 多选 ========================
const selectedKeys = ref<(string | number)[]>([])
function onSelectionChange(keys: (string | number)[]) { selectedKeys.value = keys }
const checkboxCode = `<template>
  <p>已选中：{{ selectedKeys.length }} 项</p>
  <NTable
    :columns="columns"
    :data="data"
    :row-selection="{
      type: 'checkbox',
      selectedRowKeys,
      onChange: (keys) => selectedKeys = keys,
    }"
    bordered
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedKeys = ref<(string | number)[]>([])
<\/script>`

// ======================== 单选 ========================
const radioKey = ref<string | number>('')
function onRadioChange(keys: (string | number)[]) { radioKey.value = keys[0] || '' }
const radioCode = `<template>
  <p>已选中：{{ radioKey || '无' }}</p>
  <NTable
    :columns="columns"
    :data="data"
    :row-selection="{
      type: 'radio',
      selectedRowKeys: radioKey ? [radioKey] : [],
      onChange: (keys) => radioKey = keys[0] || '',
    }"
    bordered
  />
</template>`

// ======================== 展开 ========================
const expandCode = `<template>
  <NTable :columns="columns" :data="data" bordered>
    <template #expand-row="{ record }">
      <div style="padding:8px 0;line-height:1.8;">
        <p><strong>姓名：</strong>{{ record.name }}</p>
        <p><strong>年龄：</strong>{{ record.age }}</p>
        <p><strong>地址：</strong>{{ record.address }}</p>
      </div>
    </template>
  </NTable>
</template>`

// ======================== 自定义列 ========================
const customSlotColumns = [
  { title: '姓名', dataIndex: 'name', slotName: 'nameCell' },
  { title: '年龄', dataIndex: 'age', align: 'center' as const },
  { title: '状态', dataIndex: 'status', slotName: 'statusCell', align: 'center' as const },
  { title: '地址', dataIndex: 'address' },
  { title: '操作', dataIndex: 'action', slotName: 'actionCell', align: 'center' as const },
]
function handleEdit(r: any) { alert('编辑: ' + r.name) }
function handleDelete(r: any) { alert('删除: ' + r.name) }
const slotCode = `<template>
  <NTable :columns="columns" :data="data" bordered>
    <template #nameCell="{ record }">
      <span style="color: var(--n-color-primary); font-weight: 500;">
        {{ record.name }}
      </span>
    </template>
    <template #statusCell="{ record }">
      <span :style="{ color: record.status === 'active' ? 'var(--n-color-success)' : '#999' }">
        {{ record.status === 'active' ? '在线' : '离线' }}
      </span>
    </template>
    <template #actionCell="{ record }">
      <NButton size="sm" variant="ghost" @click="handleEdit(record)">编辑</NButton>
      <NButton size="sm" variant="danger" @click="handleDelete(record)">删除</NButton>
    </template>
  </NTable>
</template>`

// ======================== 省略 ========================
const ellipsisColumns = [
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '描述', dataIndex: 'desc', ellipsis: true },
]
const ellipsisData = [
  { key: '1', name: '张三', desc: '这是一段很长很长的描述文字，用于测试文字省略功能的展示效果，当内容超出容器宽度时会显示省略号' },
  { key: '2', name: '李四', desc: '另一段超长的描述内容，依然是为了验证省略功能是否正常工作，超出部分应该自动隐藏并显示省略号' },
]
const ellipsisCode = `<template>
  <NTable
    :columns="[
      { title: '姓名', dataIndex: 'name', width: 100 },
      { title: '描述', dataIndex: 'desc', ellipsis: true },
    ]"
    :data="data"
    bordered
  />
</template>`

// ======================== 固定表头 ========================
const scrollData = Array.from({ length: 20 }, (_, i) => ({
  key: String(i + 1), name: `用户${i + 1}`, age: 20 + (i % 20), address: `城市${i + 1}号街道${i + 1}号`,
}))
const scrollCode = `<template>
  <!-- 固定表头 -->
  <NTable :columns="columns" :data="data" :scroll="{ y: 240 }" bordered />
  <!-- 横向滚动 -->
  <NTable :columns="columns" :data="data" :scroll="{ x: 1200 }" bordered />
</template>`

// ======================== 分页 ========================
const page = ref(1)
const pageData = computed(() => Array.from({ length: 50 }, (_, i) => ({
  key: String(i + 1), name: `用户${i + 1}`, age: 20 + (i % 15), address: `城市${i + 1}号街道${i + 1}号`,
})))
function onPageChange(p: number) { page.value = p }
function onPageSizeChange() { page.value = 1 }
const paginationCode = `<template>
  <NTable
    :columns="columns"
    :data="data"
    :pagination="{ current: 1, pageSize: 10, total: 50 }"
    :show-total="true"
    :show-page-size="true"
    bordered
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
  />
</template>

<script setup lang="ts">
function onPageChange(page) { console.log('跳转第', page, '页') }
function onPageSizeChange(size) { console.log('每页', size, '条') }
<\/script>`

// ======================== 加载 ========================
const isLoading = ref(false)
const loadingCode = `<template>
  <NButton @click="loading = !loading">切换加载</NButton>
  <NTable :columns="columns" :data="data" :loading="loading" loading-text="数据加载中..." bordered />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
<\/script>`

// ======================== 工具栏 ========================
const toolbarCode = `<template>
  <NTable :columns="columns" :data="data" bordered>
    <template #toolbar>
      <span style="font-size:16px;font-weight:600;">用户列表</span>
      <div style="display:flex;gap:8px;">
        <NButton size="sm">导出</NButton>
        <NButton size="sm" type="primary">新增</NButton>
      </div>
    </template>
  </NTable>
</template>`

// ======================== 行样式 ========================
const rowStyleCode = `<template>
  <!-- rowClassName 函数：年龄 > 30 的行添加警告样式 -->
  <NTable
    :columns="columns"
    :data="data"
    :row-class-name="(record) => record.age > 30 ? 'row-warn' : ''"
    bordered
  />

  <!-- 自定义空状态 -->
  <NTable :columns="columns" :data="[]" bordered>
    <template #empty>
      <div style="padding:24px;text-align:center;">
        <p style="font-size:16px;">🎉 暂无数据</p>
        <NButton size="sm" style="margin-top:8px;">添加数据</NButton>
      </div>
    </template>
  </NTable>
</template>`

// ======================== 表头分组 ========================
const groupHeaderColumns: any[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '联系方式', children: [
    { title: '手机', dataIndex: 'phone', align: 'center' },
    { title: '邮箱', dataIndex: 'email' },
  ]},
  { title: '地址', dataIndex: 'address' },
]
const groupHeaderCode = `<template>
  <NTable :columns="columns" :data="data" bordered />
</template>

<script setup lang="ts">
const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '联系方式', children: [
    { title: '手机', dataIndex: 'phone', align: 'center' },
    { title: '邮箱', dataIndex: 'email' },
  ]},
  { title: '地址', dataIndex: 'address' },
]
<\/script>`

// ======================== 方法 ========================
const methodTableRef = ref<any>(null)
const methodKeys = ref<(string | number)[]>([])
const methodCode = `<template>
  <NTable
    ref="tableRef"
    :columns="columns"
    :data="data"
    :row-selection="{ type: 'checkbox', selectedRowKeys, onChange: (k) => selectedRowKeys = k }"
    bordered
  >
    <template #expand-row="{ record }">
      <p>详情：{{ record.name }}，{{ record.age }}岁</p>
    </template>
  </NTable>

  <div style="margin-top:12px;display:flex;gap:8px;">
    <NButton size="sm" @click="tableRef?.getSelectedRows?.()">获取选中项</NButton>
    <NButton size="sm" @click="tableRef?.selectAll?.(true)">全选</NButton>
    <NButton size="sm" @click="tableRef?.clearSelection?.()">清除选择</NButton>
    <NButton size="sm" @click="tableRef?.expandAll?.(true)">展开全部</NButton>
    <NButton size="sm" @click="tableRef?.expandAll?.(false)">折叠全部</NButton>
  </div>
</template>`

// ======================== API 表格 ========================
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]
const propData = [
  { name: 'columns', type: 'TableColumnData[]', default: '[]', desc: '列配置数据' },
  { name: 'data', type: 'Record<string, any>[]', default: '[]', desc: '数据源' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框' },
  { name: 'stripe', type: 'boolean', default: 'false', desc: '是否显示斑马纹' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", desc: '表格尺寸' },
  { name: 'rowKey', type: 'string | ((record) => string | number)', default: "'key'", desc: '行唯一标识' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '加载状态' },
  { name: 'loadingText', type: 'string', default: "'加载中...'", desc: '加载提示文字' },
  { name: 'rowSelection', type: 'TableSelection', default: '-', desc: '行选择配置' },
  { name: 'pagination', type: 'object | false', default: 'false', desc: '分页配置，false 不显示' },
  { name: 'scroll', type: '{ x?; y? }', default: '-', desc: '滚动配置' },
  { name: 'showTotal', type: 'boolean', default: 'true', desc: '显示总数' },
  { name: 'showPageSize', type: 'boolean', default: 'false', desc: '显示每页条数切换' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[10,20,50,100]', desc: '每页条数选项' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空数据提示文字' },
  { name: 'rowClassName', type: 'string | ((record, index) => string)', default: '-', desc: '行自定义类名' },
  { name: 'rowStyle', type: 'object | ((record, index) => object)', default: '-', desc: '行自定义样式' },
  { name: 'tableLayoutFixed', type: 'boolean', default: 'false', desc: '固定表格布局' },
  { name: 'expandedRowRender', type: '(record) => VNodeChild', default: '-', desc: '展开行渲染函数' },
]

const columnData = [
  { name: 'title', type: 'string', default: '-', desc: '列标题' },
  { name: 'dataIndex', type: 'string', default: '-', desc: '数据字段名' },
  { name: 'width', type: 'number | string', default: '-', desc: '列宽度' },
  { name: 'minWidth', type: 'number | string', default: '-', desc: '最小宽度' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", desc: '对齐方式' },
  { name: 'fixed', type: "'left' | 'right'", default: '-', desc: '固定列' },
  { name: 'sortable', type: 'boolean | { sortDirections }', default: '-', desc: '排序' },
  { name: 'filterable', type: 'boolean', default: 'false', desc: '启用筛选' },
  { name: 'filters', type: '{ label; value }[]', default: '-', desc: '筛选选项' },
  { name: 'ellipsis', type: 'boolean', default: 'false', desc: '省略号' },
  { name: 'slotName', type: 'string', default: '-', desc: '内容插槽名' },
  { name: 'titleSlotName', type: 'string', default: '-', desc: '标题插槽名' },
  { name: 'children', type: 'TableColumnData[]', default: '-', desc: '表头分组子列' },
]

const selectionData = [
  { name: 'type', type: "'checkbox' | 'radio'", default: "'checkbox'", desc: '选择类型' },
  { name: 'selectedRowKeys', type: '(string | number)[]', default: '[]', desc: '已选中 key 列表' },
  { name: 'onChange', type: '(keys, rows) => void', default: '-', desc: '选中变化回调' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]
const eventData = [
  { name: 'select', type: '(keys, rows)', desc: '选中变化' },
  { name: 'select-all', type: '(keys, rows)', desc: '全选变化' },
  { name: 'selection-change', type: '(keys, rows)', desc: '选中变化' },
  { name: 'sorter-change', type: '(dataIndex, direction)', desc: '排序变化' },
  { name: 'page-change', type: '(page)', desc: '页码变化' },
  { name: 'page-size-change', type: '(pageSize)', desc: '每页条数变化' },
  { name: 'expand', type: '(rowKey, expanded)', desc: '展开/收起' },
  { name: 'row-click', type: '(record, event)', desc: '点击行' },
  { name: 'row-dblclick', type: '(record, event)', desc: '双击行' },
  { name: 'cell-click', type: '(record, column, event)', desc: '点击单元格' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]
const slotData = [
  { name: 'toolbar', type: '-', desc: '表格顶部工具栏区域' },
  { name: 'empty', type: '-', desc: '空数据自定义内容' },
  { name: 'expand-row', type: '{ record }', desc: '展开行内容' },
  { name: 'tfoot', type: '-', desc: '表尾内容' },
  { name: 'pagination-left', type: '-', desc: '分页左侧区域' },
  { name: 'pagination-right', type: '-', desc: '分页右侧区域' },
  { name: '[slotName]', type: '{ record, column, rowIndex }', desc: '列自定义内容' },
  { name: '[titleSlotName]', type: '{ column }', desc: '列标题自定义内容' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]
const methodData = [
  { name: 'selectAll', type: '(checked: boolean)', desc: '全选/取消全选' },
  { name: 'select', type: '(rowKey, checked)', desc: '选中/取消指定行' },
  { name: 'expandAll', type: '(expanded: boolean)', desc: '全部展开/收起' },
  { name: 'expand', type: '(rowKey, expanded)', desc: '展开/收起指定行' },
  { name: 'getSelectedRowKeys', type: '() => (string|number)[]', desc: '获取所有选中行的 key' },
  { name: 'getSelectedRows', type: '() => any[]', desc: '获取所有选中行的数据' },
  { name: 'clearSelection', type: '() => void', desc: '清除所有选中' },
]
</script>
