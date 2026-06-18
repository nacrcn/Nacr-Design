<template>
  <div class="doc-page">
    <h1>Mention 提及</h1>
    <p class="doc-page__desc">用于在输入中提及某人或某事，支持多前缀触发、异步加载、自定义过滤、头像描述展示等功能。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="输入 @ 触发下拉菜单，选择后自动插入提及内容："
      :code="basicCode"
    >
      <NMention v-model="val1" :options="users" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val1 || '暂无' }}</p>
    </DemoBlock>

    <!-- 多前缀触发 -->
    <DemoBlock
      title="多前缀触发"
      description="设置 prefix 为数组，输入 @ 提及用户，输入 # 触发话题："
      :code="multiPrefixCode"
    >
      <NMention v-model="val2" :options="allOptions" :prefix="['@', '#']" placeholder="输入 @ 提及用户，# 触发话题" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val2 || '暂无' }}</p>
    </DemoBlock>

    <!-- 带头像和描述 -->
    <DemoBlock
      title="带头像和描述"
      description="选项支持 avatar 和 description 字段，下拉列表自动展示头像与描述信息："
      :code="avatarCode"
    >
      <NMention v-model="val3" :options="usersWithAvatar" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val3 || '暂无' }}</p>
    </DemoBlock>

    <!-- 自定义渲染 -->
    <DemoBlock
      title="自定义渲染"
      description="使用 #option 插槽完全自定义下拉选项的渲染方式："
      :code="customCode"
    >
      <NMention v-model="val4" :options="usersWithAvatar">
        <template #option="{ option }">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">{{ (option as any).emoji }}</span>
            <div>
              <div style="font-weight:600;">{{ option.label }}</div>
              <div style="font-size:11px;color:#9ca3af;">{{ option.value }}</div>
            </div>
          </div>
        </template>
      </NMention>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val4 || '暂无' }}</p>
    </DemoBlock>

    <!-- 自定义过滤 -->
    <DemoBlock
      title="自定义过滤"
      description="通过 filter 属性自定义搜索逻辑，此处实现拼音首字母匹配："
      :code="filterCode"
    >
      <NMention v-model="val5" :options="chineseUsers" :filter="pinyinFilter" placeholder="输入 @ 后搜索拼音首字母" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val5 || '暂无' }}</p>
    </DemoBlock>

    <!-- 异步加载 -->
    <DemoBlock
      title="异步加载"
      description="设置 loading 属性展示加载状态，配合 search 事件实现异步搜索："
      :code="asyncCode"
    >
      <NMention v-model="val6" :options="asyncOptions" :loading="asyncLoading" @search="handleSearch" />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val6 || '暂无' }}</p>
    </DemoBlock>

    <!-- 整行模式 -->
    <DemoBlock
      title="整行模式"
      description="设置 whole 后，选中时插入 option.value 而非 option.label："
      :code="wholeCode"
    >
      <NMention v-model="val7" :options="users" whole />
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">内容：{{ val7 || '暂无' }}</p>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NMention v-model="val8" :options="users" size="sm" placeholder="小尺寸" />
        <NMention v-model="val9" :options="users" size="md" placeholder="中等尺寸" />
        <NMention v-model="val10" :options="users" size="lg" placeholder="大尺寸" />
      </div>
    </DemoBlock>

    <!-- 可清空、字数统计与禁用 -->
    <DemoBlock
      title="可清空、字数统计与禁用"
      description="clearable 显示清空按钮，maxlength + showCount 显示字数统计，disabled 禁用输入："
      :code="extraCode"
    >
      <div style="display:flex;flex-direction:column;gap:12px;">
        <NMention v-model="val11" :options="users" clearable placeholder="可清空" :maxlength="100" show-count />
        <NMention v-model="val12" :options="users" disabled placeholder="禁用状态" />
      </div>
    </DemoBlock>

    <!-- API 表格 -->
    <h2 style="margin-top:48px;">API</h2>
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
    <ApiTable title="MentionOption" :columns="optionTypeColumns" :data="optionTypeData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

// ========== demos ==========
const val1 = ref('')
const val2 = ref('')
const val3 = ref('')
const val4 = ref('')
const val5 = ref('')
const val6 = ref('')
const val7 = ref('')
const val8 = ref('')
const val9 = ref('')
const val10 = ref('')
const val11 = ref('')
const val12 = ref('这是禁用内容')

const users = [
  { label: '张三', value: 'zhangsan', prefix: '@' },
  { label: '李四', value: 'lisi', prefix: '@' },
  { label: '王五', value: 'wangwu', prefix: '@' },
  { label: '赵六', value: 'zhaoliu', prefix: '@' },
  { label: '孙七', value: 'sunqi', prefix: '@' },
]

const topics = [
  { label: '前端开发', value: 'frontend', prefix: '#' },
  { label: '后端架构', value: 'backend', prefix: '#' },
  { label: '产品设计', value: 'design', prefix: '#' },
]

const allOptions = computed(() => [...users, ...topics])

const usersWithAvatar = [
  { label: '奥特曼', value: 'aoteman', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aoteman', description: '产品经理' },
  { label: '蜘蛛侠', value: 'zhizhuxia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spider', description: '前端工程师' },
  { label: '钢铁侠', value: 'gangtiexia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ironman', description: '全栈大佬' },
  { label: '黑寡妇', value: 'heiguafu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=widow', description: '测试专家' },
]

const chineseUsers = [
  { label: '周杰', value: 'zhoujie' },
  { label: '张伟', value: 'zhangwei' },
  { label: '赵磊', value: 'zhaolei' },
  { label: '郑凯', value: 'zhengkai' },
]

function pinyinFilter(pattern: string, option: any) {
  const py: Record<string, string> = { '周杰': 'zj', '张伟': 'zw', '赵磊': 'zl', '郑凯': 'zk' }
  const p = py[option.label] || ''
  return p.includes(pattern.toLowerCase()) || option.label.includes(pattern) || option.value.toLowerCase().includes(pattern.toLowerCase())
}

// async
const asyncLoading = ref(false)
const asyncOptions = ref<any[]>([])

function handleSearch(pattern: string) {
  if (!pattern) { asyncOptions.value = []; return }
  asyncLoading.value = true
  setTimeout(() => {
    asyncOptions.value = [
      { label: `${pattern}-用户A`, value: `${pattern}-user-a` },
      { label: `${pattern}-用户B`, value: `${pattern}-user-b` },
      { label: `${pattern}-用户C`, value: `${pattern}-user-c` },
    ]
    asyncLoading.value = false
  }, 800)
}

// ========== Code ==========
const basicCode = `<template>
  <NMention v-model="value" :options="users" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const users = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' },
  { label: '赵六', value: 'zhaoliu' },
  { label: '孙七', value: 'sunqi' },
]
<\\/script>`

const multiPrefixCode = `<template>
  <NMention
    v-model="value"
    :options="allOptions"
    :prefix="['@', '#']"
    placeholder="输入 @ 提及用户，# 触发话题"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const value = ref('')
const users = [
  { label: '张三', value: 'zhangsan', prefix: '@' },
  { label: '李四', value: 'lisi', prefix: '@' },
  { label: '王五', value: 'wangwu', prefix: '@' },
]
const topics = [
  { label: '前端开发', value: 'frontend', prefix: '#' },
  { label: '后端架构', value: 'backend', prefix: '#' },
  { label: '产品设计', value: 'design', prefix: '#' },
]
const allOptions = computed(() => [...users, ...topics])
<\\/script>`

const avatarCode = `<template>
  <NMention v-model="value" :options="usersWithAvatar" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const usersWithAvatar = [
  { label: '奥特曼', value: 'aoteman', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aoteman', description: '产品经理' },
  { label: '蜘蛛侠', value: 'zhizhuxia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spider', description: '前端工程师' },
  { label: '钢铁侠', value: 'gangtiexia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ironman', description: '全栈大佬' },
  { label: '黑寡妇', value: 'heiguafu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=widow', description: '测试专家' },
]
<\\/script>`

const customCode = `<template>
  <NMention v-model="value" :options="usersWithEmoji">
    <template #option="{ option }">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:18px;">{{ option.emoji }}</span>
        <div>
          <div style="font-weight:600;">{{ option.label }}</div>
          <div style="font-size:11px;color:#9ca3af;">{{ option.value }}</div>
        </div>
      </div>
    </template>
  </NMention>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const usersWithEmoji = [
  { label: '奥特曼', value: 'aoteman', emoji: '🦸' },
  { label: '蜘蛛侠', value: 'zhizhuxia', emoji: '🕷️' },
  { label: '钢铁侠', value: 'gangtiexia', emoji: '🤖' },
]
<\\/script>`

const filterCode = `<template>
  <NMention
    v-model="value"
    :options="chineseUsers"
    :filter="pinyinFilter"
    placeholder="输入 @ 后搜索拼音首字母"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const chineseUsers = [
  { label: '周杰', value: 'zhoujie' },
  { label: '张伟', value: 'zhangwei' },
  { label: '赵磊', value: 'zhaolei' },
  { label: '郑凯', value: 'zhengkai' },
]

function pinyinFilter(pattern: string, option: any) {
  const py: Record<string, string> = { '周杰': 'zj', '张伟': 'zw', '赵磊': 'zl', '郑凯': 'zk' }
  const p = py[option.label] || ''
  return p.includes(pattern.toLowerCase()) || option.label.includes(pattern) || option.value.toLowerCase().includes(pattern.toLowerCase())
}
<\\/script>`

const asyncCode = `<template>
  <NMention
    v-model="value"
    :options="asyncOptions"
    :loading="loading"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const loading = ref(false)
const asyncOptions = ref<any[]>([])

function handleSearch(pattern: string) {
  if (!pattern) { asyncOptions.value = []; return }
  loading.value = true
  setTimeout(() => {
    asyncOptions.value = [
      { label: \`\${pattern}-用户A\`, value: \`\${pattern}-user-a\` },
      { label: \`\${pattern}-用户B\`, value: \`\${pattern}-user-b\` },
      { label: \`\${pattern}-用户C\`, value: \`\${pattern}-user-c\` },
    ]
    loading.value = false
  }, 800)
}
<\\/script>`

const wholeCode = `<template>
  <NMention v-model="value" :options="users" whole />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const users = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' },
]
<\\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NMention v-model="v1" :options="users" size="sm" placeholder="小尺寸" />
    <NMention v-model="v2" :options="users" size="md" placeholder="中等尺寸" />
    <NMention v-model="v3" :options="users" size="lg" placeholder="大尺寸" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const users = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
]
<\\/script>`

const extraCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NMention
      v-model="v1"
      :options="users"
      clearable
      placeholder="可清空"
      :maxlength="100"
      show-count
    />
    <NMention v-model="v2" :options="users" disabled placeholder="禁用状态" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('这是禁用内容')
const users = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
]
<\\/script>`

// ========== API ==========
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'modelValue', type: 'string', default: "''", desc: '绑定值（v-model）' },
  { name: 'options', type: 'MentionOption[]', default: '[]', desc: '提及选项数组' },
  { name: 'prefix', type: 'string | string[]', default: "'@'", desc: '触发提及的前缀符号，支持数组传入多个前缀' },
  { name: 'placeholder', type: 'string', default: "'输入 @ 提及'", desc: '占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'readonly', type: 'boolean', default: 'false', desc: '是否只读' },
  { name: 'rows', type: 'number', default: '3', desc: '文本域行数' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '输入框尺寸' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否显示加载状态' },
  { name: 'filter', type: '(pattern: string, option: MentionOption) => boolean', default: '—', desc: '自定义过滤函数，返回 true 表示匹配' },
  { name: 'placement', type: "'bottom-start' | 'bottom' | 'top-start' | 'top'", default: "'bottom-start'", desc: '下拉菜单弹出位置' },
  { name: 'whole', type: 'boolean', default: 'false', desc: '整行模式，选中时插入 option.value 而非 option.label' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  { name: 'maxlength', type: 'number', default: '—', desc: '最大输入长度' },
  { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字数统计（需配合 maxlength）' },
  { name: 'emptyText', type: 'string', default: "'无匹配结果'", desc: '无匹配选项时的提示文字' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: string) => void', desc: '值变化时触发' },
  { name: 'select', type: '(option: MentionOption, prefix: string) => void', desc: '选择提及项时触发，第二个参数为触发前缀' },
  { name: 'search', type: '(pattern: string, prefix: string) => void', desc: '搜索时触发，可用于异步加载选项' },
  { name: 'focus', type: '(event: FocusEvent) => void', desc: '获得焦点时触发' },
  { name: 'blur', type: '(event: FocusEvent) => void', desc: '失去焦点时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'option', desc: '自定义下拉选项渲染，参数 { option, index }' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'focus', type: '() => void', desc: '使文本域获得焦点' },
  { name: 'blur', type: '() => void', desc: '使文本域失去焦点' },
]

const optionTypeColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const optionTypeData = [
  { name: 'label', type: 'string', default: '—', desc: '选项显示文本' },
  { name: 'value', type: 'string', default: '—', desc: '选项值，选中后插入的标识' },
  { name: 'avatar', type: 'string', default: '—', desc: '头像图片 URL' },
  { name: 'description', type: 'string', default: '—', desc: '描述文字' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用该选项' },
  { name: 'prefix', type: 'string', default: '—', desc: '该选项所属前缀，多前缀模式下用于分组过滤' },
]
</script>
