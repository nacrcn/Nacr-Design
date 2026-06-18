<template>
  <div class="doc-page">
    <h1>TreeSelect 树选择</h1>
    <p class="doc-page__desc">用于从树形结构中选择数据，支持搜索、多选、自定义字段等。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 绑定选中值，data 设置树形数据："
      :code="basicCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect v-model="val1" :data="treeData" placeholder="请选择" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val1 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="max-width:360px;display:flex;flex-direction:column;gap:12px;">
        <NTreeSelect v-model="vs1" :data="treeData" size="sm" placeholder="Small" />
        <NTreeSelect v-model="vs2" :data="treeData" size="md" placeholder="Medium" />
        <NTreeSelect v-model="vs3" :data="treeData" size="lg" placeholder="Large" />
      </div>
    </DemoBlock>

    <!-- 可清除 -->
    <DemoBlock
      title="可清除"
      description="设置 clearable 允许清除已选项："
      :code="clearableCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect v-model="val2" :data="treeData" clearable placeholder="可清除" />
      </div>
    </DemoBlock>

    <!-- 搜索功能 -->
    <DemoBlock
      title="搜索功能"
      description="设置 searchable 开启搜索，输入关键词过滤树节点："
      :code="searchCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect v-model="val3" :data="treeData" searchable placeholder="可搜索" />
      </div>
    </DemoBlock>

    <!-- 多选模式 -->
    <DemoBlock
      title="多选模式"
      description="设置 multiple 开启多选，改为勾选模式，以标签展示已选项："
      :code="multipleCode"
    >
      <div style="max-width:400px;">
        <NTreeSelect v-model="val4" :data="treeData" multiple placeholder="请选择多个" default-expand-all />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val4.length ? val4.join(', ') : '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 默认展开全部 -->
    <DemoBlock
      title="默认展开全部"
      description="设置 default-expand-all 展开所有树节点："
      :code="expandCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect v-model="val5" :data="treeData" default-expand-all placeholder="默认展开" />
      </div>
    </DemoBlock>

    <!-- 自定义字段 -->
    <DemoBlock
      title="自定义字段"
      description="通过 key-field、label-field、children-field 自定义数据字段名："
      :code="fieldCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect
          v-model="val6"
          :data="customData"
          key-field="id"
          label-field="name"
          children-field="subs"
          default-expand-all
          placeholder="自定义字段"
        />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val6 || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 禁用选项 -->
    <DemoBlock
      title="禁用选项"
      description="在 data 中设置 disabled: true 禁用特定节点："
      :code="disabledCode"
    >
      <div style="max-width:360px;">
        <NTreeSelect v-model="val7" :data="disabledData" default-expand-all placeholder="含禁用项" />
      </div>
    </DemoBlock>

    <!-- 无边框与加载 -->
    <DemoBlock
      title="无边框与加载中"
      description="设置 borderless 移除边框，loading 显示加载状态："
      :code="borderlessCode"
    >
      <div style="max-width:360px;display:flex;flex-direction:column;gap:12px;">
        <NTreeSelect v-model="val8" :data="treeData" borderless placeholder="无边框" />
        <NTreeSelect v-model="val9" :data="treeData" loading placeholder="加载中" />
      </div>
    </DemoBlock>

    <!-- 组合使用 -->
    <DemoBlock
      title="组合使用"
      description="在卡片中结合其他组件构建部门选择场景："
      :code="combineCode"
    >
      <NCard title="部门人员配置" style="max-width:420px;" segmented>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <NTreeSelect v-model="dept" :data="deptData" searchable clearable default-expand-all placeholder="选择部门" />
          <NInput v-model="memberName" placeholder="成员姓名" clearable />
          <NInput v-model="memberRole" placeholder="角色" />
          <NButton type="primary" @click="handleAddMember">添加成员</NButton>
        </div>
      </NCard>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const message = useMessage()

// ========== 树形数据 ==========
const treeData = [
    {
        key: 'tech', label: '技术部', children: [
            {
                key: 'fe', label: '前端组', children: [
                    { key: 'vue', label: 'Vue 团队' }, { key: 'react', label: 'React 团队' }
                ]
            },
            {
                key: 'be', label: '后端组', children: [
                    { key: 'java', label: 'Java 团队' }, { key: 'go', label: 'Go 团队' }
                ]
            },
            { key: 'qa', label: '测试组' }
        ]
    },
    {
        key: 'product', label: '产品部', children: [
            { key: 'pm', label: '产品经理组' }, { key: 'ui', label: 'UI 设计组' }
        ]
    },
    { key: 'hr', label: '人事部' },
    { key: 'finance', label: '财务部' },
]

const customData = [
    {
        id: 'c1', name: '分类一', subs: [
            { id: 'c1-1', name: '子类 1-1' }, { id: 'c1-2', name: '子类 1-2' }
        ]
    },
    {
        id: 'c2', name: '分类二', subs: [
            { id: 'c2-1', name: '子类 2-1' }
        ]
    },
]

const disabledData = [
    { key: 'a', label: '选项 A', disabled: true },
    {
        key: 'b', label: '选项 B', children: [
            { key: 'b1', label: 'B-1' }, { key: 'b2', label: 'B-2', disabled: true }
        ]
    },
    { key: 'c', label: '选项 C' },
]

const deptData = [
    {
        key: 'dev', label: '研发中心', children: [
            { key: 'dev-fe', label: '前端开发部' },
            { key: 'dev-be', label: '后端开发部' },
            { key: 'dev-ai', label: 'AI 实验室' }
        ]
    },
    {
        key: 'ops', label: '运营中心', children: [
            { key: 'ops-mk', label: '市场部' },
            { key: 'ops-cs', label: '客服部' }
        ]
    },
]

// ========== 基础 ==========
const val1 = ref(undefined)

// ========== 尺寸 ==========
const vs1 = ref(undefined)
const vs2 = ref(undefined)
const vs3 = ref(undefined)

// ========== 清除 ==========
const val2 = ref('vue')

// ========== 搜索 ==========
const val3 = ref(undefined)

// ========== 多选 ==========
const val4 = ref<any[]>(['qa', 'hr'])

// ========== 展开 ==========
const val5 = ref(undefined)

// ========== 自定义字段 ==========
const val6 = ref(undefined)

// ========== 禁用 ==========
const val7 = ref(undefined)

// ========== 无边框与加载 ==========
const val8 = ref(undefined)
const val9 = ref(undefined)

// ========== 组合 ==========
const dept = ref(undefined)
const memberName = ref('')
const memberRole = ref('')

function handleAddMember() {
    if (!dept.value) { message.warning('请选择部门'); return }
    if (!memberName.value) { message.warning('请输入成员姓名'); return }
    message.success('成员添加成功！')
}

// ========== Code ==========
const basicCode = `<template>
  <NTreeSelect v-model="val" :data="treeData" placeholder="请选择" />
</template>

<script setup lang="ts">
const val = ref(undefined)

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
  ]},
  { key: 'product', label: '产品部' },
]
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTreeSelect v-model="v1" :data="treeData" size="sm" placeholder="Small" />
    <NTreeSelect v-model="v2" :data="treeData" size="md" placeholder="Medium" />
    <NTreeSelect v-model="v3" :data="treeData" size="lg" placeholder="Large" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(undefined)
const v2 = ref(undefined)
const v3 = ref(undefined)

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
  ]},
  { key: 'product', label: '产品部' },
]
<\/script>`

const clearableCode = `<template>
  <NTreeSelect v-model="val" :data="treeData" clearable placeholder="可清除" />
</template>

<script setup lang="ts">
const val = ref('fe')

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
  ]},
  { key: 'product', label: '产品部' },
]
<\/script>`

const searchCode = `<template>
  <NTreeSelect v-model="val" :data="treeData" searchable placeholder="可搜索" />
</template>

<script setup lang="ts">
const val = ref(undefined)

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
    { key: 'qa', label: '测试组' },
  ]},
  { key: 'product', label: '产品部', children: [
    { key: 'pm', label: '产品经理组' },
    { key: 'ui', label: 'UI 设计组' },
  ]},
]
<\/script>`

const multipleCode = `<template>
  <NTreeSelect v-model="val" :data="treeData" multiple default-expand-all placeholder="请选择多个" />
</template>

<script setup lang="ts">
const val = ref<any[]>([])

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
    { key: 'qa', label: '测试组' },
  ]},
  { key: 'product', label: '产品部' },
  { key: 'hr', label: '人事部' },
]
<\/script>`

const expandCode = `<template>
  <NTreeSelect v-model="val" :data="treeData" default-expand-all placeholder="默认展开" />
</template>

<script setup lang="ts">
const val = ref(undefined)

const treeData = [
  { key: 'tech', label: '技术部', children: [
    { key: 'fe', label: '前端组' },
    { key: 'be', label: '后端组' },
  ]},
  { key: 'product', label: '产品部' },
]
<\/script>`

const fieldCode = `<template>
  <NTreeSelect
    v-model="val"
    :data="customData"
    key-field="id"
    label-field="name"
    children-field="subs"
    default-expand-all
    placeholder="自定义字段"
  />
</template>

<script setup lang="ts">
const val = ref(undefined)

const customData = [
  { id: 'c1', name: '分类一', subs: [
    { id: 'c1-1', name: '子类 1-1' },
    { id: 'c1-2', name: '子类 1-2' },
  ]},
  { id: 'c2', name: '分类二', subs: [
    { id: 'c2-1', name: '子类 2-1' },
  ]},
]
<\/script>`

const disabledCode = `<template>
  <NTreeSelect v-model="val" :data="disabledData" default-expand-all placeholder="含禁用项" />
</template>

<script setup lang="ts">
const val = ref(undefined)

const disabledData = [
  { key: 'a', label: '选项 A', disabled: true },
  { key: 'b', label: '选项 B', children: [
    { key: 'b1', label: 'B-1' },
    { key: 'b2', label: 'B-2', disabled: true },
  ]},
  { key: 'c', label: '选项 C' },
]
<\/script>`

const borderlessCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NTreeSelect v-model="v1" :data="treeData" borderless placeholder="无边框" />
    <NTreeSelect v-model="v2" :data="treeData" loading placeholder="加载中" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref(undefined)
const v2 = ref(undefined)

const treeData = [
  { key: 'tech', label: '技术部' },
  { key: 'product', label: '产品部' },
]
<\/script>`

const combineCode = `<template>
    <NCard title="部门人员配置" segmented>
        <div style="display:flex;flex-direction:column;gap:16px;">
            <NTreeSelect v-model="dept" :data="deptData" searchable clearable default-expand-all placeholder="选择部门" />
            <NInput v-model="memberName" placeholder="成员姓名" clearable />
            <NInput v-model="memberRole" placeholder="角色" />
            <NButton type="primary" @click="handleAdd">添加成员</NButton>
        </div>
    </NCard>
</template>

<script setup lang="ts">
const dept = ref(undefined)
const memberName = ref('')
const memberRole = ref('')

const deptData = [
  { key: 'dev', label: '研发中心', children: [
    { key: 'dev-fe', label: '前端开发部' },
    { key: 'dev-be', label: '后端开发部' },
  ]},
  { key: 'ops', label: '运营中心', children: [
    { key: 'ops-mk', label: '市场部' },
    { key: 'ops-cs', label: '客服部' },
  ]},
]

function handleAdd() {
  if (!dept.value) return
  if (!memberName.value) return
  console.log('添加成功')
}
<\/script>`

// ========== API ==========
const propColumns = [
{ key: 'name', title: '参数', code: true },
{ key: 'type', title: '类型', code: true },
{ key: 'default', title: '默认值', code: true },
{ key: 'desc', title: '说明' },
]

const propData = [
{ name: 'modelValue', type: 'any', default: 'undefined', desc: '选中值（v-model），单选为 key，多选为 key[]' },
{ name: 'data', type: 'TreeData[]', default: '[]', desc: '树形数据' },
{ name: 'placeholder', type: 'string', default: "'请选择'", desc: '占位文本' },
{ name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
{ name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清除' },
{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
{ name: 'keyField', type: 'string', default: "'key'", desc: '节点唯一标识字段名' },
{ name: 'labelField', type: 'string', default: "'label'", desc: '节点显示文本字段名' },
{ name: 'childrenField', type: 'string', default: "'children'", desc: '子节点字段名' },
{ name: 'multiple', type: 'boolean', default: 'false', desc: '是否多选' },
{ name: 'searchable', type: 'boolean', default: 'false', desc: '是否可搜索' },
{ name: 'defaultExpandAll', type: 'boolean', default: 'false', desc: '是否默认展开所有节点' },
{ name: 'borderless', type: 'boolean', default: 'false', desc: '是否无边框' },
{ name: 'loading', type: 'boolean', default: 'false', desc: '是否加载中' },
{ name: 'error', type: 'boolean', default: 'false', desc: '是否错误状态' },
{ name: 'cascade', type: 'boolean', default: 'true', desc: '多选时是否级联勾选（预留）' },
]

const eventColumns = [
{ key: 'name', title: '事件名', code: true },
{ key: 'type', title: '类型', code: true },
{ key: 'desc', title: '说明' },
]

const eventData = [
{ name: 'update:modelValue', type: '(value: any) => void', desc: '选中值变化时触发' },
{ name: 'change', type: '(value: any) => void', desc: '选中值变化时触发' },
{ name: 'search', type: '(value: string) => void', desc: '搜索关键词变化时触发' },
]
</script>
