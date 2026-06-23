<template>
  <div class="doc-page">
    <h1>Table 表格</h1>
    <p class="doc-page__desc">用于展示多条结构类似的数据，支持排序、选择、展开、固定表头、固定列、分页、文字省略等功能。</p>

    <!-- ========== 综合演示 ========== -->
    <DemoBlock title="综合演示" description="集成固定列、固定表头、排序、选择、自定义渲染、文字省略、工具栏、分页等功能。" :code="fullCode">
      <NTable
        ref="fullTableRef"
        :columns="fullColumns"
        :data="fullPagedData"
        :scroll="{ x: 1200, y: 400 }"
        :row-selection="{ type: 'checkbox', selectedRowKeys: fullSelectedKeys, onChange: onFullSelectChange }"
        :pagination="{ current: fullPage, pageSize: 8, total: fullData.length }"
        :show-total="true"
        :show-page-size="true"
        bordered
        @page-change="onFullPageChange"
        @page-size-change="onFullPageSizeChange"
      >
        <template #toolbar>
          <span style="font-size:15px;font-weight:600;">员工管理</span>
          <div style="display:flex;gap:8px;">
            <NButton size="sm" variant="ghost" @click="fullTableRef?.clearSelection?.()">清空选择</NButton>
            <NButton size="sm" type="primary">新增员工</NButton>
          </div>
        </template>
        <template #nameCell="{ record }">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:30px;height:30px;border-radius:50%;background:var(--n-color-primary-light);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--n-color-primary);">{{ record.name.charAt(0) }}</div>
            <div>
              <div style="font-weight:500;">{{ record.name }}</div>
              <div style="font-size:11px;color:var(--n-color-text-disabled);">{{ record.email }}</div>
            </div>
          </div>
        </template>
        <template #deptCell="{ record }">
          <span :style="{ display:'inline-block', padding:'2px 10px', borderRadius:'12px', fontSize:'12px', background: deptColor(record.dept).bg, color: deptColor(record.dept).text }">{{ record.dept }}</span>
        </template>
        <template #statusCell="{ record }">
          <span :style="{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'13px', color: record.status==='在职'?'var(--n-color-success)':'var(--n-color-text-disabled)' }">
            <span :style="{ width:'6px', height:'6px', borderRadius:'50%', background: record.status==='在职'?'var(--n-color-success)':'var(--n-color-text-disabled)' }" />
            {{ record.status }}
          </span>
        </template>
        <template #actionCell>
          <NButton size="sm" variant="ghost">编辑</NButton>
          <NButton size="sm" variant="danger" style="margin-left:4px;">删除</NButton>
        </template>
      </NTable>
      <div style="margin-top:10px;font-size:13px;color:var(--n-color-text-secondary);">已选中 {{ fullSelectedKeys.length }} 项</div>
    </DemoBlock>

    <!-- ========== 基础用法 ========== -->
    <DemoBlock title="基础用法" description="通过 columns 和 data 定义列与数据。" :code="basicCode">
      <NTable :columns="basicColumns" :data="basicData" bordered />
    </DemoBlock>


    <!-- ========== 斑马纹 ========== -->
    <DemoBlock title="斑马纹" description="stripe 显示斑马纹。" :code="stripeCode">
      <NTable :columns="basicColumns" :data="basicData" stripe bordered />
    </DemoBlock>

    <!-- ========== 排序 ========== -->
    <DemoBlock title="可排序" description="设置列的 sortable 属性启用排序。" :code="sortableCode">
      <NTable :columns="sortableColumns" :data="sortableData" bordered />
    </DemoBlock>

    <!-- ========== 选择 ========== -->
    <DemoBlock title="行选择" description="rowSelection 配置 checkbox 多选或 radio 单选。" :code="selectionCode">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="margin:0 0 6px;font-size:13px;color:var(--n-color-text-secondary);">多选 — 已选中 {{ selectedKeys.length }} 项</p>
          <NTable :columns="basicColumns" :data="basicData" :row-selection="{ type: 'checkbox', selectedRowKeys: selectedKeys, onChange: onSelectionChange }" bordered />
        </div>
        <div>
          <p style="margin:0 0 6px;font-size:13px;color:var(--n-color-text-secondary);">单选 — 已选中 {{ radioKey || '无' }}</p>
          <NTable :columns="basicColumns" :data="basicData" :row-selection="{ type: 'radio', selectedRowKeys: radioKey ? [radioKey] : [], onChange: onRadioChange }" bordered />
        </div>
      </div>
    </DemoBlock>

    <!-- ========== 展开 ========== -->
    <DemoBlock title="可展开行" description="通过 #expand-row 插槽自定义展开内容。" :code="expandCode">
      <NTable :columns="basicColumns" :data="basicData" bordered>
        <template #expand-row="{ record }">
          <div style="padding:10px 0;line-height:1.8;">
            <p style="margin:0;"><strong>姓名：</strong>{{ record.name }}</p>
            <p style="margin:0;"><strong>年龄：</strong>{{ record.age }}</p>
            <p style="margin:0;"><strong>地址：</strong>{{ record.address }}</p>
          </div>
        </template>
      </NTable>
    </DemoBlock>

    <!-- ========== 固定表头 ========== -->
    <DemoBlock title="固定表头" description="通过 scroll.y 设置纵向滚动高度，固定表头。" :code="scrollCode">
      <NTable :columns="basicColumns" :data="scrollData" :scroll="{ y: 240 }" bordered />
    </DemoBlock>

    <!-- ========== 固定列 ========== -->
    <DemoBlock title="固定列" description="设置列的 fixed 为 'left' 或 'right'，配合 scroll.x 实现横向滚动。" :code="fixedCode">
      <NTable :columns="fixedColumns" :data="fixedData" :scroll="{ x: 1000 }" bordered />
    </DemoBlock>

    <!-- ========== 加载 ========== -->
    <DemoBlock title="加载状态" description="loading 控制加载状态。" :code="loadingCode">
      <NButton size="sm" @click="isLoading = !isLoading" style="margin-bottom:12px;">{{ isLoading ? '取消加载' : '开始加载' }}</NButton>
      <NTable :columns="basicColumns" :data="basicData" :loading="isLoading" loading-text="数据加载中..." bordered />
    </DemoBlock>

    <!-- ========== 文字省略 ========== -->
    <DemoBlock title="文字省略" description="设置列的 ellipsis 属性，需配合 width。" :code="ellipsisCode">
      <NTable :columns="ellipsisColumns" :data="ellipsisData" bordered />
    </DemoBlock>

    <!-- ========== 方法调用 ========== -->
    <DemoBlock title="方法调用" description="通过 ref 调用表格方法。" :code="methodCode">
      <NTable ref="methodTableRef" :columns="basicColumns" :data="basicData" :row-selection="{ type: 'checkbox', selectedRowKeys: methodKeys, onChange: (k: any) => methodKeys = k }" bordered>
        <template #expand-row="{ record }">
          <p style="margin:0;padding:6px 0;">详情：{{ record.name }}，{{ record.age }}岁</p>
        </template>
      </NTable>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
        <NButton size="sm" @click="handleGetMethod">获取选中项</NButton>
        <NButton size="sm" @click="methodTableRef?.selectAll?.(true)">全选</NButton>
        <NButton size="sm" @click="methodTableRef?.clearSelection?.()">清除选择</NButton>
        <NButton size="sm" @click="methodTableRef?.expandAll?.(true)">展开全部</NButton>
        <NButton size="sm" @click="methodTableRef?.expandAll?.(false)">折叠全部</NButton>
      </div>
    </DemoBlock>

    <!-- ========== API ========== -->
    <ApiTable title="Table Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Column 配置" :columns="propColumns" :data="columnData" />
    <ApiTable title="rowSelection" :columns="propColumns" :data="selectionData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumnsApi" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
definePageMeta({ layout: 'doc' })

// ======================== 综合演示 ========================
const fullTableRef = ref<any>(null)
const fullSelectedKeys = ref<(string | number)[]>([])
const fullPage = ref(1)
const fullPageSize = ref(8)

function onFullSelectChange(keys: (string | number)[]) { fullSelectedKeys.value = keys }
function onFullPageChange(p: number) { fullPage.value = p }
function onFullPageSizeChange(size: number) { fullPageSize.value = size; fullPage.value = 1 }

const fullColumns = [
  { title: '姓名', dataIndex: 'name', width: 200, fixed: 'left' as const, slotName: 'nameCell' },
  { title: '部门', dataIndex: 'dept', width: 120, slotName: 'deptCell' },
  { title: '职位', dataIndex: 'title', width: 140, ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100, align: 'center' as const, slotName: 'statusCell' },
  { title: '薪资', dataIndex: 'salary', width: 120, align: 'right' as const, sortable: true },
  { title: '入职日期', dataIndex: 'joinDate', width: 120, align: 'center' as const },
  { title: '电话', dataIndex: 'phone', width: 140 },
  { title: '操作', dataIndex: 'action', width: 130, fixed: 'right' as const, align: 'center' as const, slotName: 'actionCell' },
]

const deptList = ['技术部', '产品部', '设计部', '运营部', '市场部']
const titleList = ['前端工程师', '后端工程师', '产品经理', 'UI设计师', '运营专员', '数据分析师']
const nameList = ['张伟', '李娜', '王芳', '刘洋', '陈磊', '杨帆', '赵倩', '黄涛', '周敏', '吴强', '徐静', '孙鹏']

const fullData = Array.from({ length: 46 }, (_, i) => ({
  key: String(i + 1),
  name: nameList[i % 12],
  email: `emp${i + 1}@company.com`,
  dept: deptList[i % 5],
  title: titleList[i % 6],
  status: i % 7 === 0 ? '离职' : '在职',
  salary: 8000 + (((i * 137) % 22) * 1000),
  joinDate: `2022-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  phone: `1${[3, 5, 7, 8, 9][i % 5]}${String(10000000 + i * 137).slice(1)}`,
}))

const fullPagedData = computed(() => {
  const start = (fullPage.value - 1) * fullPageSize.value
  return fullData.slice(start, start + fullPageSize.value)
})

function deptColor(dept: string) {
  const m: Record<string, { bg: string; text: string }> = {
    '技术部': { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    '产品部': { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
    '设计部': { bg: 'rgba(236,72,153,0.1)', text: '#ec4899' },
    '运营部': { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
    '市场部': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  }
  return m[dept] || { bg: 'rgba(0,0,0,0.04)', text: '#666' }
}

const fullCode = `<template>
  <NTable
    ref="tableRef"
    :columns="columns"
    :data="pagedData"
    :scroll="{ x: 1200, y: 400 }"
    :row-selection="{ type: 'checkbox', selectedRowKeys, onChange: (k) => selectedRowKeys = k }"
    :pagination="{ current: page, pageSize: 8, total: data.length }"
    :show-total="true"
    :show-page-size="true"
    bordered
    @page-change="(p) => page = p"
  >
    <template #toolbar>
      <span style="font-weight:600;">员工管理</span>
      <NButton size="sm" type="primary">新增员工</NButton>
    </template>
    <template #nameCell="{ record }">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:30px;height:30px;border-radius:50%;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#3b82f6;">{{ record.name.charAt(0) }}</div>
        <div>
          <div style="font-weight:500;">{{ record.name }}</div>
          <div style="font-size:11px;color:#999;">{{ record.email }}</div>
        </div>
      </div>
    </template>
    <template #deptCell="{ record }">
      <span :style="{ padding:'2px 10px', borderRadius:'12px', fontSize:'12px', background: deptBg(record.dept), color: deptColor(record.dept) }">{{ record.dept }}</span>
    </template>
    <template #statusCell="{ record }">
      <span :style="{ color: record.status === '在职' ? '#10b981' : '#999' }">{{ record.status }}</span>
    </template>
    <template #actionCell>
      <NButton size="xs" variant="ghost">编辑</NButton>
      <NButton size="xs" variant="danger">删除</NButton>
    </template>
  </NTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const selectedRowKeys = ref<(string|number)[]>([])
const page = ref(1)
const columns = [
  { title: '姓名', dataIndex: 'name', width: 200, fixed: 'left', slotName: 'nameCell' },
  { title: '部门', dataIndex: 'dept', width: 120, slotName: 'deptCell' },
  { title: '职位', dataIndex: 'title', width: 140, ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100, align: 'center', slotName: 'statusCell' },
  { title: '薪资', dataIndex: 'salary', width: 120, align: 'right', sortable: true },
  { title: '入职日期', dataIndex: 'joinDate', width: 120, align: 'center' },
  { title: '电话', dataIndex: 'phone', width: 140 },
  { title: '操作', dataIndex: 'action', width: 130, fixed: 'right', align: 'center', slotName: 'actionCell' },
]
const data = Array.from({ length: 46 }, (_, i) => ({
  key: String(i+1), name: ['张伟','李娜','王芳','刘洋','陈磊','杨帆','赵倩','黄涛','周敏','吴强','徐静','孙鹏'][i%12],
  email: \`emp\${i+1}@company.com\`, dept: ['技术部','产品部','设计部','运营部','市场部'][i%5],
  title: ['前端工程师','后端工程师','产品经理','UI设计师','运营专员','数据分析师'][i%6],
  status: i%7===0?'离职':'在职', salary: 8000+((i*137)%22)*1000,
  joinDate: \`2022-\${String((i%12)+1).padStart(2,'0')}-\${String((i%28)+1).padStart(2,'0')}\`,
  phone: \`1\${[3,5,7,8,9][i%5]}\${String(10000000+i*137).slice(1)}\`,
}))
const pagedData = computed(() => data.slice((page.value-1)*8, page.value*8))
<\/script>`

// ======================== 基础 ========================
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
const basicCode = `<template>
  <NTable :columns="columns" :data="data" bordered />
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

const stripeCode = `<template>
  <NTable :columns="columns" :data="data" stripe bordered />
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
<\/script>`

// ======================== 选择 ========================
const selectedKeys = ref<(string | number)[]>([])
function onSelectionChange(keys: (string | number)[]) { selectedKeys.value = keys }

const radioKey = ref<string | number>('')
function onRadioChange(keys: (string | number)[]) { radioKey.value = keys[0] || '' }

const selectionCode = `<template>
  <!-- 多选 -->
  <NTable
    :columns="columns" :data="data" bordered
    :row-selection="{ type: 'checkbox', selectedRowKeys, onChange: (k) => selectedRowKeys = k }"
  />
  <!-- 单选 -->
  <NTable
    :columns="columns" :data="data" bordered
    :row-selection="{ type: 'radio', selectedRowKeys, onChange: (k) => selectedRowKeys = k }"
  />
</template>`

// ======================== 展开 ========================
const expandCode = `<template>
  <NTable :columns="columns" :data="data" bordered>
    <template #expand-row="{ record }">
      <div style="padding:10px 0;line-height:1.8;">
        <p><strong>姓名：</strong>{{ record.name }}</p>
        <p><strong>年龄：</strong>{{ record.age }}</p>
        <p><strong>地址：</strong>{{ record.address }}</p>
      </div>
    </template>
  </NTable>
</template>`

// ======================== 固定表头 ========================
const scrollData = Array.from({ length: 20 }, (_, i) => ({
  key: String(i + 1), name: `用户${i + 1}`, age: 20 + (i % 20), address: `城市${i + 1}号街道${i + 1}号`,
}))
const scrollCode = `<template>
  <NTable :columns="columns" :data="data" :scroll="{ y: 240 }" bordered />
</template>`

// ======================== 固定列 ========================
const fixedColumns = [
  { title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' as const },
  { title: '年龄', dataIndex: 'age', width: 80, align: 'center' as const },
  { title: '部门', dataIndex: 'dept', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '手机', dataIndex: 'phone', width: 140 },
  { title: '城市', dataIndex: 'city', width: 120 },
  { title: '入职日期', dataIndex: 'joinDate', width: 120 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right' as const, align: 'center' as const },
]
const fixedData = Array.from({ length: 8 }, (_, i) => ({
  key: String(i + 1), name: `员工${i + 1}`, age: 25 + (i % 15),
  dept: ['技术部', '产品部', '设计部', '运营部'][i % 4], email: `user${i+1}@example.com`,
  phone: `138${String(10000000 + i).slice(1)}`, city: ['北京','上海','广州','深圳','杭州'][i%5],
  joinDate: `2023-${String((i%12)+1).padStart(2,'0')}-${String((i%28)+1).padStart(2,'0')}`,
}))
const fixedCode = `<template>
  <NTable :columns="columns" :data="data" :scroll="{ x: 1000 }" bordered />
</template>

<script setup lang="ts">
const columns = [
  { title: '姓名', dataIndex: 'name', width: 120, fixed: 'left' },
  { title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
  { title: '部门', dataIndex: 'dept', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '手机', dataIndex: 'phone', width: 140 },
  { title: '操作', dataIndex: 'action', width: 140, fixed: 'right', align: 'center' },
]
<\/script>`

// ======================== 加载 ========================
const isLoading = ref(false)
const loadingCode = `<template>
  <NButton @click="loading = !loading">切换加载</NButton>
  <NTable :columns="columns" :data="data" :loading="loading" loading-text="加载中..." bordered />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
<\/script>`

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

// ======================== 方法 ========================
const methodTableRef = ref<any>(null)
const methodKeys = ref<(string | number)[]>([])
function handleGetMethod() {
  const rows = methodTableRef.value?.getSelectedRows?.()
  if (rows?.length) alert(`选中 ${rows.length} 项：${rows.map((r: any) => r.name).join(', ')}`)
  else alert('未选中任何项')
}
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tableRef = ref(null)
const selectedRowKeys = ref<(string|number)[]>([])
<\/script>`

// ======================== API ========================
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
  { name: 'scroll', type: '{ x?: number | string; y?: number | string }', default: '-', desc: '滚动配置，x 横向滚动宽，y 固定表头高度' },
  { name: 'showTotal', type: 'boolean', default: 'true', desc: '显示总数' },
  { name: 'showPageSize', type: 'boolean', default: 'false', desc: '显示每页条数切换' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '空数据提示文字' },
  { name: 'rowClassName', type: 'string | ((record, index) => string)', default: '-', desc: '行自定义类名' },
  { name: 'rowStyle', type: 'object | ((record, index) => object)', default: '-', desc: '行自定义样式' },
]
const columnData = [
  { name: 'title', type: 'string', default: '-', desc: '列标题' },
  { name: 'dataIndex', type: 'string', default: '-', desc: '数据字段名' },
  { name: 'width', type: 'number | string', default: '-', desc: '列宽度' },
  { name: 'minWidth', type: 'number | string', default: '-', desc: '最小宽度' },
  { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", desc: '对齐方式' },
  { name: 'fixed', type: "'left' | 'right'", default: '-', desc: '固定列' },
  { name: 'sortable', type: 'boolean | { sortDirections }', default: '-', desc: '排序' },
  { name: 'ellipsis', type: 'boolean', default: 'false', desc: '文字省略' },
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
  { name: '[slotName]', type: '{ record, column, rowIndex }', desc: '列自定义内容' },
  { name: '[titleSlotName]', type: '{ column }', desc: '列标题自定义内容' },
]
const methodColumnsApi = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]
const methodData = [
  { name: 'selectAll', type: '(checked: boolean)', desc: '全选/取消全选' },
  { name: 'select', type: '(rowKey, checked)', desc: '选中/取消指定行' },
  { name: 'expandAll', type: '(expanded: boolean)', desc: '全部展开/收起' },
  { name: 'expand', type: '(rowKey, expanded)', desc: '展开/收起指定行' },
  { name: 'getSelectedRowKeys', type: '() => (string|number)[]', desc: '获取选中行 key' },
  { name: 'getSelectedRows', type: '() => any[]', desc: '获取选中行数据' },
  { name: 'clearSelection', type: '() => void', desc: '清除所有选中' },
]
</script>