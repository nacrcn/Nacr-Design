<template>
  <div class="doc-page">
    <h1>Card 卡片</h1>
    <p class="doc-page__desc">最基础的卡片容器，支持标题、封面、操作区、多种变体与尺寸。</p>

    <DemoBlock title="基础用法" description="包含标题、内容和底部操作的简单卡片：" :code="basicCode">
      <NCard title="卡片标题" style="max-width:360px;">
        <p>卡片内容，这是最基本的卡片用法。卡片可以包含任何内容。</p>
        <template #footer>
          <NSpace :gap="8">
            <NButton size="sm" type="primary">确定</NButton>
            <NButton size="sm">取消</NButton>
          </NSpace>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="卡片变体" description="通过 variant 设置不同外观风格：" :code="variantCode">
      <NSpace :gap="16" wrap>
        <NCard title="默认" variant="default" style="width:220px;">
          <p>默认边框卡片</p>
        </NCard>
        <NCard title="强调边框" variant="bordered" style="width:220px;">
          <p>主题色边框卡片</p>
        </NCard>
        <NCard title="阴影" variant="shadow" style="width:220px;">
          <p>阴影风格卡片</p>
        </NCard>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="尺寸" description="通过 size 设置卡片大小，支持 sm / md / lg 三种尺寸：" :code="sizeCode">
      <NSpace :gap="16" wrap>
        <NCard title="小卡片" size="sm" style="width:220px;">
          <p>小尺寸</p>
        </NCard>
        <NCard title="中卡片" size="md" style="width:220px;">
          <p>中等尺寸（默认）</p>
        </NCard>
        <NCard title="大卡片" size="lg" style="width:220px;">
          <p>大尺寸</p>
        </NCard>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="悬停效果" description="设置 hoverable 让鼠标悬停时显示阴影提升效果：" :code="hoverCode">
      <NSpace :gap="16" wrap>
        <NCard title="可悬停" variant="shadow" hoverable style="width:260px;">
          <p>鼠标悬停试试，会有阴影提升效果。</p>
        </NCard>
        <NCard title="可悬停" variant="default" hoverable style="width:260px;">
          <p>默认变体也可以悬停。</p>
        </NCard>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="带封面" description="使用 #cover 插槽添加卡片封面图片：" :code="coverCode">
      <NCard title="风景摄影" hoverable style="width:320px;">
        <template #cover>
          <div class="demo-cover">
            <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="320" height="160" fill="#e0f2fe" />
              <circle cx="260" cy="40" r="24" fill="#fbbf24" />
              <path d="M0 120 L60 70 L120 100 L180 50 L240 90 L320 60 L320 160 L0 160Z" fill="#86efac" />
              <path d="M0 135 L80 110 L160 130 L240 95 L320 120 L320 160 L0 160Z" fill="#4ade80" />
            </svg>
          </div>
        </template>
        <p>在封面插槽中放置图片，图片宽度自动撑满卡片。</p>
        <template #footer>
          <NSpace :gap="8">
            <NButton size="sm" type="primary">查看详情</NButton>
            <NButton size="sm">收藏</NButton>
          </NSpace>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="头部额外内容" description="通过 header-extra 属性或 #header-extra 插槽在标题右侧展示额外信息：" :code="extraCode">
      <NCard title="订单详情" header-extra="2024-01-15" style="max-width:400px;">
        <p>订单编号：NACR-20240115-001</p>
        <p>订单金额：¥299.00</p>
        <template #footer>
          <NTag type="success" size="sm">已完成</NTag>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="操作区" description="使用 #actions 插槽在卡片底部添加操作按钮：" :code="actionsCode">
      <NCard title="项目配置" style="max-width:400px;">
        <p>当前环境：生产环境</p>
        <p>版本号：v2.4.1</p>
        <template #actions>
          <NButton size="sm" type="primary">编辑</NButton>
          <NButton size="sm">复制</NButton>
          <NButton size="sm" variant="outlined" type="danger">删除</NButton>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="分段卡片" description="设置 segmented 让卡片内容区域之间使用分隔线代替边框，视觉更紧凑：" :code="segmentedCode">
      <NCard title="分段卡片" segmented hoverable style="max-width:400px;">
        <p>卡片内容区域，分段模式下各区域之间使用细线分隔。</p>
        <template #actions>
          <NButton size="sm" type="primary">保存</NButton>
          <NButton size="sm">取消</NButton>
        </template>
        <template #footer>
          <span style="font-size:12px;color:var(--n-color-text-tertiary)">最后更新于 3 分钟前</span>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="可关闭" description="设置 closable 显示关闭按钮，关闭时触发 close 事件：" :code="closableCode">
      <NCard title="可关闭卡片" closable style="max-width:360px;" @close="onClose">
        <p>点击右上角关闭按钮可以关闭此卡片。</p>
      </NCard>
      <NAlert v-if="closed" type="success" style="max-width:360px;margin-top:12px;" closable @close="closed = false">
        卡片已关闭
      </NAlert>
    </DemoBlock>

    <DemoBlock title="可折叠" description="设置 collapsible 让卡片可以折叠/展开，支持 v-model:collapsed 双向绑定：" :code="collapsibleCode">
      <NCard title="可折叠卡片" collapsible style="max-width:400px;">
        <p>点击标题栏右侧箭头图标即可折叠/展开卡片内容。</p>
        <p>折叠时只显示标题栏，展开时显示完整内容。</p>
      </NCard>
    </DemoBlock>

    <DemoBlock title="自定义头部" description="使用 #header 插槽完全自定义头部内容，设置后 title 属性无效：" :code="slotCode">
      <NCard variant="shadow" style="max-width:400px;">
        <template #header>
          <div style="display:flex;align-items:center;gap:8px;">
            <NAvatar size="sm" round>Z</NAvatar>
            <div>
              <div style="font-size:15px;font-weight:600;color:var(--n-color-text);">张三</div>
              <div style="font-size:12px;color:var(--n-color-text-tertiary);">高级工程师</div>
            </div>
          </div>
        </template>
        <p>自定义头部可以使用头像、标签等任何内容，完全自由布局。</p>
        <template #actions>
          <NButton size="sm" type="primary">关注</NButton>
          <NButton size="sm">私信</NButton>
        </template>
      </NCard>
    </DemoBlock>

    <DemoBlock title="组合使用" description="卡片内嵌套组合多个组件，构建复杂信息展示：" :code="combineCode">
      <NCard title="团队成员" style="max-width:480px;">
        <template #header-extra>
          <NButton size="sm" type="primary">添加成员</NButton>
        </template>
        <div class="member-list">
          <div v-for="member in members" :key="member.name" class="member-item">
            <NAvatar :color="member.color" size="sm" round>{{ member.name[0] }}</NAvatar>
            <div class="member-info">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-role">{{ member.role }}</span>
            </div>
            <NTag :type="member.tagType" size="sm">{{ member.status }}</NTag>
          </div>
        </div>
        <template #footer>
          <span style="font-size:13px;color:var(--n-color-text-secondary);">共 {{ members.length }} 名成员</span>
        </template>
      </NCard>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<NCard title="卡片标题">
  <p>卡片内容，这是最基本的卡片用法。</p>
  <template #footer>
    <NSpace :gap="8">
      <NButton size="sm" type="primary">确定</NButton>
      <NButton size="sm">取消</NButton>
    </NSpace>
  </template>
</NCard>`

const variantCode = `<NCard title="默认" variant="default">
  <p>默认边框卡片</p>
</NCard>
<NCard title="强调边框" variant="bordered">
  <p>主题色边框卡片</p>
</NCard>
<NCard title="阴影" variant="shadow">
  <p>阴影风格卡片</p>
</NCard>`

const sizeCode = `<NCard title="小卡片" size="sm">
  <p>小尺寸</p>
</NCard>
<NCard title="中卡片" size="md">
  <p>中等尺寸（默认）</p>
</NCard>
<NCard title="大卡片" size="lg">
  <p>大尺寸</p>
</NCard>`

const hoverCode = `<NCard title="可悬停" variant="shadow" hoverable>
  <p>鼠标悬停试试，会有阴影提升效果。</p>
</NCard>
<NCard title="可悬停" variant="default" hoverable>
  <p>默认变体也可以悬停。</p>
</NCard>`

const coverCode = `<NCard title="风景摄影" hoverable>
  <template #cover>
    <img src="图片地址" alt="封面" />
  </template>
  <p>在封面插槽中放置图片，图片宽度自动撑满卡片。</p>
  <template #footer>
    <NButton size="sm" type="primary">查看详情</NButton>
  </template>
</NCard>`

const extraCode = `<NCard title="订单详情" header-extra="2024-01-15">
  <p>订单编号：NACR-20240115-001</p>
  <p>订单金额：¥299.00</p>
  <template #footer>
    <NTag type="success" size="sm">已完成</NTag>
  </template>
</NCard>`

const actionsCode = `<NCard title="项目配置">
  <p>当前环境：生产环境</p>
  <p>版本号：v2.4.1</p>
  <template #actions>
    <NButton size="sm" type="primary">编辑</NButton>
    <NButton size="sm">复制</NButton>
    <NButton size="sm" variant="outlined" type="danger">删除</NButton>
  </template>
</NCard>`

const segmentedCode = `<NCard title="分段卡片" segmented hoverable>
  <p>卡片内容区域，分段模式下各区域之间使用细线分隔。</p>
  <template #actions>
    <NButton size="sm" type="primary">保存</NButton>
    <NButton size="sm">取消</NButton>
  </template>
  <template #footer>
    <span>最后更新于 3 分钟前</span>
  </template>
</NCard>`

const closableCode = `<NCard title="可关闭卡片" closable @close="onClose">
  <p>点击右上角关闭按钮可以关闭此卡片。</p>
</NCard>`

const collapsibleCode = `<NCard title="可折叠卡片" collapsible>
  <p>点击标题栏右侧箭头图标即可折叠/展开卡片内容。</p>
  <p>折叠时只显示标题栏，展开时显示完整内容。</p>
</NCard>`

const slotCode = `<NCard variant="shadow">
  <template #header>
    <div style="display:flex;align-items:center;gap:8px;">
      <NAvatar size="sm" round>Z</NAvatar>
      <div>
        <div>张三</div>
        <div>高级工程师</div>
      </div>
    </div>
  </template>
  <p>自定义头部可以使用头像、标签等任何内容。</p>
  <template #actions>
    <NButton size="sm" type="primary">关注</NButton>
    <NButton size="sm">私信</NButton>
  </template>
</NCard>`

const combineCode = `<NCard title="团队成员">
  <template #header-extra>
    <NButton size="sm" type="primary">添加成员</NButton>
  </template>
  <!-- 成员列表 -->
  <template #footer>
    <span>共 N 名成员</span>
  </template>
</NCard>`

const closed = ref(false)

function onClose() {
  closed.value = true
}

const members = [
  { name: '李明', role: '前端开发', status: '在线', color: '#1677ff', tagType: 'success' as const },
  { name: '王芳', role: '产品设计', status: '忙碌', color: '#f5222d', tagType: 'warning' as const },
  { name: '赵强', role: '后端开发', status: '离线', color: '#52c41a', tagType: 'default' as const },
]

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'title', type: 'string', default: "''", desc: '卡片标题' },
  { name: 'variant', type: "'default' | 'bordered' | 'shadow'", default: "'default'", desc: '卡片变体样式' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '卡片尺寸' },
  { name: 'hoverable', type: 'boolean', default: 'false', desc: '鼠标悬停时是否显示悬浮效果' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框（仅非 bordered 变体时有效）' },
  { name: 'segmented', type: 'boolean', default: 'false', desc: '是否使用分段样式（分隔线代替边框）' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '是否显示关闭按钮' },
  { name: 'collapsible', type: 'boolean', default: 'false', desc: '是否可折叠' },
  { name: 'header-extra', type: 'string', default: "''", desc: '标题右侧额外文字' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'params', title: '参数', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'close', params: '-', desc: '点击关闭按钮时触发' },
  { name: 'update:collapsed', params: '(collapsed: boolean)', desc: '折叠状态变化时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '卡片主体内容' },
  { name: 'header', desc: '自定义头部区域，设置后 title 属性无效' },
  { name: 'header-extra', desc: '头部右侧额外内容，设置后 header-extra 属性无效' },
  { name: 'cover', desc: '卡片封面图区域' },
  { name: 'actions', desc: '卡片操作按钮区域' },
  { name: 'footer', desc: '卡片底部区域' },
]
</script>

<style scoped>
.demo-cover {
  width: 100%;
  overflow: hidden;
}

.demo-cover svg {
  width: 100%;
  display: block;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--n-color-text, #1f2937);
}

.member-role {
  display: block;
  font-size: 12px;
  color: var(--n-color-text-tertiary, #9ca3af);
}
</style>
