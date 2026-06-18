<template>
  <div class="doc-page">
    <h1>Transfer 穿梭框</h1>
    <p class="doc-page__desc">用于在两栏之间移动元素，支持搜索过滤、自定义渲染、虚拟滚动分页、尺寸、禁用、高亮动画等功能。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 绑定目标侧已选值数组，options 提供全部可选数据："
      :code="basicCode"
    >
      <NTransfer v-model="target1" :options="cityOptions" />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target1.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 带搜索 -->
    <DemoBlock
      title="带搜索"
      description="设置 showSearch 后，两栏顶部展示搜索输入框，可快速过滤条目："
      :code="searchCode"
    >
      <NTransfer v-model="target2" :options="cityOptions" show-search />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target2.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 显示搜索时自定义过滤 -->
    <DemoBlock
      title="自定义过滤"
      description="通过 filter 属性自定义搜索逻辑，此处同时匹配 label 和 value："
      :code="filterCode"
    >
      <NTransfer v-model="target3" :options="cityOptions" show-search :filter="customFilter" />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target3.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 自定义标题 -->
    <DemoBlock
      title="自定义标题"
      description="通过 titles 属性设置左右两栏标题，是一个二元数组："
      :code="titleCode"
    >
      <NTransfer v-model="target4" :options="cityOptions" :titles="['候选城市', '已选城市']" show-search />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target4.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 自定义渲染 -->
    <DemoBlock
      title="自定义渲染"
      description="使用 #item 插槽自定义每个选项的渲染，参数 { option, direction }："
      :code="customCode"
    >
      <NTransfer v-model="target5" :options="userOptions" show-search>
        <template #item="{ option, direction }">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
            <span style="font-size:16px;flex-shrink:0;">{{ (option as any).icon }}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ option.label }}</div>
              <div style="font-size:11px;color:#9ca3af;">{{ (option as any).role }} · {{ direction === 'right' ? '已选' : '待选' }}</div>
            </div>
          </div>
        </template>
      </NTransfer>
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target5.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 禁用选项与全局禁用 -->
    <DemoBlock
      title="禁用选项与全局禁用"
      description="单个选项设置 disabled:true 禁用特定条目，全局 disabled 禁用整个穿梭框："
      :code="disabledCode"
    >
      <NTransfer v-model="target6" :options="mixedOptions" />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target6.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">小尺寸</p>
          <NTransfer v-model="target7" :options="cityOptions" size="sm" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">中等尺寸（默认）</p>
          <NTransfer v-model="target8" :options="cityOptions" size="md" />
        </div>
        <div>
          <p style="font-size:13px;color:#6b7280;margin-bottom:6px;">大尺寸</p>
          <NTransfer v-model="target9" :options="cityOptions" size="lg" />
        </div>
      </div>
    </DemoBlock>

    <!-- 清空目标侧 -->
    <DemoBlock
      title="清空目标侧"
      description="设置 showClearRight 后，右侧面板底部出现清空按钮："
      :code="clearCode"
    >
      <NTransfer v-model="target10" :options="cityOptions" show-clear-right />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标：{{ target10.join(', ') || '空' }}</p>
    </DemoBlock>

    <!-- 大数据量分页滚动 -->
    <DemoBlock
      title="大数据量分页滚动"
      description="通过 pageSize 控制每次渲染数量，列表滚动到底自动加载更多："
      :code="pageSizeCode"
    >
      <NTransfer v-model="target11" :options="bigOptions" show-search :page-size="20" />
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">目标列表共 {{ target11.length }} 项</p>
    </DemoBlock>

    <!-- 表单联动 -->
    <DemoBlock
      title="表单联动"
      description="结合 Card 组件重构完整场景，展示 change 事件处理："
      :code="formCode"
    >
      <NCard title="权限分配" style="max-width:700px;" segmented>
        <NTransfer v-model="target12" :options="permOptions" :titles="['可用权限', '已授权']" show-search @change="handleTransferChange" />
        <p v-if="lastTransferMsg" style="margin-top:8px;font-size:13px;color:#3b82f6;">{{ lastTransferMsg }}</p>
      </NCard>
    </DemoBlock>

    <!-- API 表格 -->
    <h2 style="margin-top:48px;">API</h2>
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
    <ApiTable title="TransferOption" :columns="optionColumns" :data="optionData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const target1 = ref<string[]>(['bj', 'sh'])
const target2 = ref<string[]>([])
const target3 = ref<string[]>([])
const target4 = ref<string[]>([])
const target5 = ref<string[]>([])
const target6 = ref<string[]>([])
const target7 = ref<string[]>([])
const target8 = ref<string[]>(['gz'])
const target9 = ref<string[]>([])
const target10 = ref<string[]>(['bj', 'sh', 'gz'])
const target11 = ref<string[]>([])
const target12 = ref<string[]>(['user:read', 'user:write'])

const cityOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
  { label: '西安', value: 'xa' },
  { label: '重庆', value: 'cq' },
]

const mixedOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh', disabled: true },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz', disabled: true },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
]

const userOptions = [
  { label: '张三', value: 'zhangsan', icon: '👨‍💻', role: '前端工程师' },
  { label: '李四', value: 'lisi', icon: '👩‍🎨', role: 'UI设计师' },
  { label: '王五', value: 'wangwu', icon: '🧑‍🔧', role: '后端工程师' },
  { label: '赵六', value: 'zhaoliu', icon: '👨‍💼', role: '产品经理' },
  { label: '孙七', value: 'sunqi', icon: '👩‍🔬', role: '测试工程师' },
  { label: '周八', value: 'zhouba', icon: '🧑‍🏫', role: '技术主管' },
]

const permOptions = [
  { label: '用户查看', value: 'user:read' },
  { label: '用户编辑', value: 'user:write' },
  { label: '用户删除', value: 'user:delete' },
  { label: '角色查看', value: 'role:read' },
  { label: '角色编辑', value: 'role:write' },
  { label: '系统配置', value: 'system:config' },
  { label: '日志查看', value: 'log:read' },
  { label: '数据导出', value: 'data:export' },
]

const bigOptions = Array.from({ length: 200 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: `item_${i + 1}`,
}))

const lastTransferMsg = ref('')

function customFilter(query: string, option: any) {
  const q = query.toLowerCase()
  return option.label.toLowerCase().includes(q) || String(option.value).toLowerCase().includes(q)
}

function handleTransferChange(_target: string[], direction: 'left' | 'right', moved: string[]) {
  lastTransferMsg.value = `方向: ${direction === 'right' ? '右移' : '左移'}, 移动: [${moved.join(', ')}]`
  setTimeout(() => { lastTransferMsg.value = '' }, 3000)
}

// ========== Code ==========
const basicCode = `<template>
  <NTransfer v-model="target" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref(['bj', 'sh'])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
  { label: '成都', value: 'cd' },
  { label: '武汉', value: 'wh' },
  { label: '南京', value: 'nj' },
]
<\\/script>`

const searchCode = `<template>
  <NTransfer v-model="target" :options="options" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
  { label: '杭州', value: 'hz' },
]
<\\/script>`

const filterCode = `<template>
  <NTransfer
    v-model="target"
    :options="options"
    show-search
    :filter="customFilter"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]

function customFilter(query: string, option: any) {
  const q = query.toLowerCase()
  return option.label.toLowerCase().includes(q) || String(option.value).toLowerCase().includes(q)
}
<\\/script>`

const titleCode = `<template>
  <NTransfer
    v-model="target"
    :options="options"
    :titles="['候选城市', '已选城市']"
    show-search
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]
<\\/script>`

const customCode = `<template>
  <NTransfer v-model="target" :options="users" show-search>
    <template #item="{ option, direction }">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
        <span style="font-size:16px;">{{ option.icon }}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:500;">{{ option.label }}</div>
          <div style="font-size:11px;color:#9ca3af;">{{ option.role }}</div>
        </div>
      </div>
    </template>
  </NTransfer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const users = [
  { label: '张三', value: 'zhangsan', icon: '👨‍💻', role: '前端工程师' },
  { label: '李四', value: 'lisi', icon: '👩‍🎨', role: 'UI设计师' },
  { label: '王五', value: 'wangwu', icon: '🧑‍🔧', role: '后端工程师' },
  { label: '赵六', value: 'zhaoliu', icon: '👨‍💼', role: '产品经理' },
]
<\\/script>`

const disabledCode = `<template>
  <NTransfer v-model="target" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh', disabled: true },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz', disabled: true },
  { label: '杭州', value: 'hz' },
]
<\\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:20px;">
    <NTransfer v-model="v1" :options="options" size="sm" />
    <NTransfer v-model="v2" :options="options" size="md" />
    <NTransfer v-model="v3" :options="options" size="lg" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref([])
const v2 = ref([])
const v3 = ref([])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]
<\\/script>`

const clearCode = `<template>
  <NTransfer v-model="target" :options="options" show-clear-right />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref(['bj', 'sh', 'gz'])
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
]
<\\/script>`

const pageSizeCode = `<template>
  <NTransfer
    v-model="target"
    :options="options"
    show-search
    :page-size="20"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref([])
const options = Array.from({ length: 200 }, (_, i) => ({
  label: \`选项 \${i + 1}\`,
  value: \`item_\${i + 1}\`,
}))
<\\/script>`

const formCode = `<template>
  <NCard title="权限分配" segmented>
    <NTransfer
      v-model="target"
      :options="options"
      :titles="['可用权限', '已授权']"
      show-search
      @change="handleChange"
    />
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const target = ref(['user:read', 'user:write'])
const options = [
  { label: '用户查看', value: 'user:read' },
  { label: '用户编辑', value: 'user:write' },
  { label: '用户删除', value: 'user:delete' },
  { label: '角色查看', value: 'role:read' },
  { label: '角色编辑', value: 'role:write' },
  { label: '系统配置', value: 'system:config' },
  { label: '日志查看', value: 'log:read' },
  { label: '数据导出', value: 'data:export' },
]

function handleChange(_target: string[], direction: 'left' | 'right', moved: string[]) {
  console.log('方向:', direction, '移动:', moved)
}
<\\/script>`

// ========== API ==========
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'any[]', default: '[]', desc: '目标侧已选值数组（v-model）' },
  { name: 'options', type: 'TransferOption[]', default: '[]', desc: '全部可选数据' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否全局禁用' },
  { name: 'showSearch', type: 'boolean', default: 'false', desc: '是否显示搜索框' },
  { name: 'filterable', type: 'boolean', default: 'true', desc: '是否启用默认过滤（配合搜索框）' },
  { name: 'filter', type: '(query: string, option: TransferOption) => boolean', default: '—', desc: '自定义过滤函数' },
  { name: 'titles', type: '[string, string]', default: "['源列表', '目标列表']", desc: '左右两栏标题' },
  { name: 'filterPlaceholder', type: 'string', default: "'搜索...'", desc: '搜索框占位文本' },
  { name: 'pageSize', type: 'number', default: '50', desc: '分页滚动每页条数' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '穿梭框尺寸' },
  { name: 'showClearRight', type: 'boolean', default: 'false', desc: '是否显示右侧清空按钮' },
  { name: 'emptyText', type: 'string', default: "'暂无数据'", desc: '无数据时的提示文本' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: any[]) => void', desc: '值变化时触发' },
  { name: 'change', type: '(targetValues: any[], direction: "left" | "right", movedValues: any[]) => void', desc: '元素移动后触发，direction 表示移动方向，movedValues 为移动的值' },
  { name: 'search', type: '(direction: "left" | "right", query: string) => void', desc: '搜索时触发' },
  { name: 'scroll', type: '(direction: "left" | "right", event: Event) => void', desc: '列表滚动时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'item', desc: '自定义选项渲染，参数 { option, direction }' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'clearRight', type: '() => void', desc: '清空右侧目标列表' },
]

const optionColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const optionData = [
  { name: 'label', type: 'string', default: '—', desc: '选项显示文本' },
  { name: 'value', type: 'any', default: '—', desc: '选项唯一标识值' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用该选项' },
]
</script>
