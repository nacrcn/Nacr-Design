<template>
  <div class="doc-page">
    <h1>Cascader 级联选择</h1>
    <p class="doc-page__desc">用于从一组相关联的数据集合中进行选择，支持搜索、多选、自定义分隔符等。</p>

    <!-- 基础用法 -->
    <DemoBlock
      title="基础用法"
      description="通过 v-model 绑定选中值数组，options 设置级联数据："
      :code="basicCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val1" :options="regionOptions" placeholder="请选择地区" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val1.join(' / ') || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 不同尺寸 -->
    <DemoBlock
      title="不同尺寸"
      description="设置 size 属性使用三种预设尺寸："
      :code="sizeCode"
    >
      <div style="max-width:360px;display:flex;flex-direction:column;gap:12px;">
        <NCascader v-model="vs1" :options="regionOptions" size="sm" placeholder="Small" />
        <NCascader v-model="vs2" :options="regionOptions" size="md" placeholder="Medium" />
        <NCascader v-model="vs3" :options="regionOptions" size="lg" placeholder="Large" />
      </div>
    </DemoBlock>

    <!-- 可清除 -->
    <DemoBlock
      title="可清除"
      description="设置 clearable 允许清除已选项："
      :code="clearableCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val2" :options="regionOptions" clearable placeholder="可清除" />
      </div>
    </DemoBlock>

    <!-- 自定义分隔符 -->
    <DemoBlock
      title="自定义分隔符"
      description="设置 separator 改变显示分隔符："
      :code="separatorCode"
    >
      <div style="max-width:360px;display:flex;flex-direction:column;gap:12px;">
        <NCascader v-model="val3" :options="regionOptions" separator=" / " placeholder="默认斜杠" />
        <NCascader v-model="val4" :options="regionOptions" separator=" > " placeholder="箭头分隔" />
        <NCascader v-model="val5" :options="regionOptions" separator="-" placeholder="短横线" />
      </div>
    </DemoBlock>

    <!-- 搜索功能 -->
    <DemoBlock
      title="搜索功能"
      description="设置 searchable 开启搜索，输入关键词过滤可选项："
      :code="searchCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val6" :options="regionOptions" searchable placeholder="可搜索" @search="onSearch" />
      </div>
    </DemoBlock>

    <!-- 多选模式 -->
    <DemoBlock
      title="多选模式"
      description="设置 multiple 开启多选，选中值以标签形式展示："
      :code="multipleCode"
    >
      <div style="max-width:400px;">
        <NCascader v-model="val7" :options="regionOptions" multiple placeholder="请选择多个" />
        <p style="margin-top:8px;font-size:13px;color:#6b7280;">选中：{{ val7.map((v: any[]) => v.join(' / ')).join('；') || '未选择' }}</p>
      </div>
    </DemoBlock>

    <!-- 无边框 -->
    <DemoBlock
      title="无边框"
      description="设置 borderless 移除触发器边框："
      :code="borderlessCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val8" :options="regionOptions" borderless placeholder="无边框" />
      </div>
    </DemoBlock>

    <!-- 加载中 -->
    <DemoBlock
      title="加载中"
      description="设置 loading 显示加载状态："
      :code="loadingCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val9" :options="regionOptions" loading placeholder="加载中" />
      </div>
    </DemoBlock>

    <!-- 禁用选项 -->
    <DemoBlock
      title="禁用选项"
      description="在 options 中设置 disabled: true 禁用特定选项："
      :code="disabledOptCode"
    >
      <div style="max-width:360px;">
        <NCascader v-model="val10" :options="disabledOptions" placeholder="含禁用项" />
      </div>
    </DemoBlock>

    <!-- 组合使用 -->
    <DemoBlock
      title="组合使用"
      description="在卡片中结合其他组件构建完整选择场景："
      :code="combineCode"
    >
      <NCard title="收货地址" style="max-width:420px;" segmented>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <NCascader v-model="addressRegion" :options="regionOptions" placeholder="选择省/市/区" clearable separator=" " />
          <NInput v-model="addressDetail" placeholder="详细地址" />
          <NInput v-model="addressName" placeholder="收件人" />
          <NInput v-model="addressPhone" placeholder="手机号" type="tel" />
          <NButton type="primary" @click="handleAddressSubmit">保存地址</NButton>
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

// ========== 级联数据 ==========
const regionOptions = [
  { label: '北京', value: 'bj', children: [
    { label: '朝阳区', value: 'cy' }, { label: '海淀区', value: 'hd' }, { label: '东城区', value: 'dc' }
  ]},
  { label: '上海', value: 'sh', children: [
    { label: '浦东新区', value: 'pd' }, { label: '静安区', value: 'ja' }, { label: '徐汇区', value: 'xh' }
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz', children: [
      { label: '天河区', value: 'th' }, { label: '越秀区', value: 'yx' }
    ]},
    { label: '深圳', value: 'sz', children: [
      { label: '南山区', value: 'ns' }, { label: '福田区', value: 'ft' }
    ]},
    { label: '东莞', value: 'dg' }
  ]},
  { label: '浙江', value: 'zj', children: [
    { label: '杭州', value: 'hz', children: [
      { label: '西湖区', value: 'xq' }, { label: '余杭区', value: 'yh' }
    ]},
    { label: '宁波', value: 'nb' }
  ]},
]

const disabledOptions = [
  { label: '北京', value: 'bj', disabled: true, children: [
    { label: '朝阳区', value: 'cy' }
  ]},
  { label: '上海', value: 'sh', children: [
    { label: '浦东新区', value: 'pd' }, { label: '静安区', value: 'ja', disabled: true }
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' }, { label: '深圳', value: 'sz' }
  ]},
]

// ========== 基础用法 ==========
const val1 = ref<string[]>([])

// ========== 尺寸 ==========
const vs1 = ref<string[]>([])
const vs2 = ref<string[]>([])
const vs3 = ref<string[]>([])

// ========== 清除 ==========
const val2 = ref<string[]>(['gd', 'gz', 'th'])

// ========== 分隔符 ==========
const val3 = ref<string[]>([])
const val4 = ref<string[]>([])
const val5 = ref<string[]>([])

// ========== 搜索 ==========
const val6 = ref<string[]>([])
function onSearch(_val: string) {
  // placeholder for search callback
}

// ========== 多选 ==========
const val7 = ref<any[]>([['gd', 'gz', 'th']])

// ========== 无边框 ==========
const val8 = ref<string[]>([])

// ========== 加载 ==========
const val9 = ref<string[]>([])

// ========== 禁用选项 ==========
const val10 = ref<string[]>([])

// ========== 组合 ==========
const addressRegion = ref<string[]>([])
const addressDetail = ref('')
const addressName = ref('')
const addressPhone = ref('')

function handleAddressSubmit() {
  if (!addressRegion.value.length) { message.warning('请选择地区'); return }
  if (!addressDetail.value) { message.warning('请输入详细地址'); return }
  message.success('地址保存成功！')
}

// ========== Code ==========
const basicCode = `<template>
  <NCascader v-model="val" :options="regionOptions" placeholder="请选择地区" />
</template>

<script setup lang="ts">
const val = ref<string[]>([])

const regionOptions = [
  { label: '北京', value: 'bj', children: [
    { label: '朝阳区', value: 'cy' },
    { label: '海淀区', value: 'hd' },
  ]},
  { label: '上海', value: 'sh', children: [
    { label: '浦东新区', value: 'pd' },
    { label: '静安区', value: 'ja' },
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const sizeCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NCascader v-model="v1" :options="options" size="sm" placeholder="Small" />
    <NCascader v-model="v2" :options="options" size="md" placeholder="Medium" />
    <NCascader v-model="v3" :options="options" size="lg" placeholder="Large" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref<string[]>([])
const v2 = ref<string[]>([])
const v3 = ref<string[]>([])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
  { label: '上海', value: 'sh', children: [{ label: '浦东新区', value: 'pd' }] },
]
<\/script>`

const clearableCode = `<template>
  <NCascader v-model="val" :options="options" clearable placeholder="可清除" />
</template>

<script setup lang="ts">
const val = ref<string[]>(['gd', 'gz'])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const separatorCode = `<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <NCascader v-model="v1" :options="options" separator=" / " placeholder="默认斜杠" />
    <NCascader v-model="v2" :options="options" separator=" > " placeholder="箭头分隔" />
    <NCascader v-model="v3" :options="options" separator="-" placeholder="短横线" />
  </div>
</template>

<script setup lang="ts">
const v1 = ref<string[]>([])
const v2 = ref<string[]>([])
const v3 = ref<string[]>([])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const searchCode = `<template>
  <NCascader v-model="val" :options="options" searchable placeholder="可搜索" />
</template>

<script setup lang="ts">
const val = ref<string[]>([])

const options = [
  { label: '北京', value: 'bj', children: [
    { label: '朝阳区', value: 'cy' },
    { label: '海淀区', value: 'hd' },
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const multipleCode = `<template>
  <NCascader v-model="val" :options="options" multiple placeholder="请选择多个" />
</template>

<script setup lang="ts">
const val = ref<any[]>([['gd', 'gz', 'th']])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz', children: [
      { label: '天河区', value: 'th' },
    ]},
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const borderlessCode = `<template>
  <NCascader v-model="val" :options="options" borderless placeholder="无边框" />
</template>

<script setup lang="ts">
const val = ref<string[]>([])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
  { label: '上海', value: 'sh', children: [{ label: '浦东新区', value: 'pd' }] },
]
<\/script>`

const loadingCode = `<template>
  <NCascader v-model="val" :options="options" loading placeholder="加载中" />
</template>

<script setup lang="ts">
const val = ref<string[]>([])

const options = [
  { label: '北京', value: 'bj', children: [{ label: '朝阳区', value: 'cy' }] },
]
<\/script>`

const disabledOptCode = `<template>
  <NCascader v-model="val" :options="disabledOptions" placeholder="含禁用项" />
</template>

<script setup lang="ts">
const val = ref<string[]>([])

const disabledOptions = [
  { label: '北京', value: 'bj', disabled: true, children: [
    { label: '朝阳区', value: 'cy' },
  ]},
  { label: '上海', value: 'sh', children: [
    { label: '浦东新区', value: 'pd' },
    { label: '静安区', value: 'ja', disabled: true },
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]
<\/script>`

const combineCode = `<template>
  <NCard title="收货地址" segmented>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <NCascader v-model="region" :options="regionOptions" placeholder="选择省/市/区" clearable separator=" " />
      <NInput v-model="detail" placeholder="详细地址" />
      <NInput v-model="name" placeholder="收件人" />
      <NInput v-model="phone" placeholder="手机号" type="tel" />
      <NButton type="primary" @click="handleSubmit">保存地址</NButton>
    </div>
  </NCard>
</template>

<script setup lang="ts">
const region = ref<string[]>([])
const detail = ref('')
const name = ref('')
const phone = ref('')

const regionOptions = [
  { label: '北京', value: 'bj', children: [
    { label: '朝阳区', value: 'cy' },
    { label: '海淀区', value: 'hd' },
  ]},
  { label: '上海', value: 'sh', children: [
    { label: '浦东新区', value: 'pd' },
    { label: '静安区', value: 'ja' },
  ]},
  { label: '广东', value: 'gd', children: [
    { label: '广州', value: 'gz' },
    { label: '深圳', value: 'sz' },
  ]},
]

function handleSubmit() {
  if (!region.value.length) return
  if (!detail.value) return
  console.log('保存成功')
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
  { name: 'modelValue', type: 'any[]', default: '[]', desc: '选中值数组（v-model），单选为 [v1,v2,v3]，多选为 [[v1,v2,v3], ...]' },
  { name: 'options', type: 'CascaderOption[]', default: '[]', desc: '级联选项数据' },
  { name: 'placeholder', type: 'string', default: "'请选择'", desc: '占位文本' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清除' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '尺寸' },
  { name: 'separator', type: 'string', default: "' / '", desc: '显示分隔符' },
  { name: 'multiple', type: 'boolean', default: 'false', desc: '是否多选' },
  { name: 'searchable', type: 'boolean', default: 'false', desc: '是否可搜索' },
  { name: 'checkStrategy', type: "'all' | 'parent' | 'child'", default: "'child'", desc: '多选勾选策略：child 仅叶子节点，parent 父子联动，all 所有可选' },
  { name: 'borderless', type: 'boolean', default: 'false', desc: '是否无边框' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '是否加载中' },
  { name: 'error', type: 'boolean', default: 'false', desc: '是否错误状态' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'update:modelValue', type: '(value: any[]) => void', desc: '选中值变化时触发' },
  { name: 'change', type: '(value: any[]) => void', desc: '选中值变化时触发' },
  { name: 'search', type: '(value: string) => void', desc: '搜索关键词变化时触发' },
]
</script>
