<template>
  <div class="doc-page">
    <h1>Descriptions 描述列表</h1>
    <p class="doc-page__desc">
      以键值对形式展示信息，常用于详情页。支持边框模式、多种尺寸、标签位置、垂直布局等。
    </p>

    <!-- ────── 综合演示 ────── -->
    <DemoBlock
      title="综合演示"
      description="一个完整的订单详情描述列表，展示边框模式、跨列、标签居上等多种特性组合使用。"
      :code="combinedCode"
    >
      <NDescriptions title="订单详情" :column="3" bordered label-placement="top">
        <NDescriptionsItem label="订单编号">202506240001</NDescriptionsItem>
        <NDescriptionsItem label="下单时间">2025-06-24 10:30:00</NDescriptionsItem>
        <NDescriptionsItem label="订单状态">
          <span style="color: var(--n-color-primary);">已发货</span>
        </NDescriptionsItem>
        <NDescriptionsItem label="收货人">张三</NDescriptionsItem>
        <NDescriptionsItem label="联系电话">138****8888</NDescriptionsItem>
        <NDescriptionsItem label="支付方式">微信支付</NDescriptionsItem>
        <NDescriptionsItem label="收货地址" :span="2">北京市朝阳区建国路88号SOHO现代城A座1205</NDescriptionsItem>
        <NDescriptionsItem label="商品总价">¥ 299.00</NDescriptionsItem>
        <NDescriptionsItem label="备注" :span="3">请尽快发货，工作日白天方便收件。</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 NDescriptions 和 NDescriptionsItem 组合使用。" :code="basicCode">
      <NDescriptions title="用户信息" :column="2">
        <NDescriptionsItem label="用户名">张三</NDescriptionsItem>
        <NDescriptionsItem label="手机号">138****8888</NDescriptionsItem>
        <NDescriptionsItem label="邮箱">zhangsan@example.com</NDescriptionsItem>
        <NDescriptionsItem label="地址">北京市朝阳区</NDescriptionsItem>
        <NDescriptionsItem label="备注" :span="2">这是一段较长的备注信息，可以跨列显示。</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <!-- ────── 边框模式 ────── -->
    <DemoBlock title="边框模式" description="设置 bordered 属性展示带边框的描述列表。" :code="borderedCode">
      <NDescriptions title="产品信息" :column="2" bordered>
        <NDescriptionsItem label="产品名称">NacrDesign 组件库</NDescriptionsItem>
        <NDescriptionsItem label="版本号">v0.1.8</NDescriptionsItem>
        <NDescriptionsItem label="框架">Vue 3</NDescriptionsItem>
        <NDescriptionsItem label="许可协议">MIT License</NDescriptionsItem>
        <NDescriptionsItem label="描述" :span="2">一套高质量的 Vue 3 组件库，提供丰富的企业级组件。</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <!-- ────── 标签位置 ────── -->
    <DemoBlock title="标签位置" description="通过 label-placement 设置标签在左侧或上方显示。" :code="labelPlacementCode">
      <NSpace vertical :size="20">
        <NDescriptions title="标签在左侧（默认）" :column="2" bordered>
          <NDescriptionsItem label="品牌">Apple</NDescriptionsItem>
          <NDescriptionsItem label="型号">iPhone 16 Pro</NDescriptionsItem>
          <NDescriptionsItem label="颜色">原色钛金属</NDescriptionsItem>
          <NDescriptionsItem label="存储">256GB</NDescriptionsItem>
        </NDescriptions>
        <NDescriptions title="标签在上方" :column="3" bordered label-placement="top">
          <NDescriptionsItem label="品牌">Apple</NDescriptionsItem>
          <NDescriptionsItem label="型号">iPhone 16 Pro</NDescriptionsItem>
          <NDescriptionsItem label="颜色">原色钛金属</NDescriptionsItem>
          <NDescriptionsItem label="存储">256GB</NDescriptionsItem>
          <NDescriptionsItem label="屏幕">6.3 英寸</NDescriptionsItem>
          <NDescriptionsItem label="重量">199g</NDescriptionsItem>
        </NDescriptions>
      </NSpace>
    </DemoBlock>

    <!-- ────── 不同列数 ────── -->
    <DemoBlock title="不同列数" description="通过 column 设置每行显示的列数。" :code="columnCode">
      <NSpace vertical :size="20">
        <NDescriptions title="两列（默认）" :column="2" bordered>
          <NDescriptionsItem label="姓名">李四</NDescriptionsItem>
          <NDescriptionsItem label="年龄">28</NDescriptionsItem>
          <NDescriptionsItem label="职位">前端工程师</NDescriptionsItem>
          <NDescriptionsItem label="城市">上海</NDescriptionsItem>
        </NDescriptions>
        <NDescriptions title="三列" :column="3" bordered>
          <NDescriptionsItem label="姓名">李四</NDescriptionsItem>
          <NDescriptionsItem label="年龄">28</NDescriptionsItem>
          <NDescriptionsItem label="职位">前端工程师</NDescriptionsItem>
          <NDescriptionsItem label="城市">上海</NDescriptionsItem>
          <NDescriptionsItem label="部门">技术部</NDescriptionsItem>
          <NDescriptionsItem label="工号">EMP-0042</NDescriptionsItem>
        </NDescriptions>
      </NSpace>
    </DemoBlock>

    <!-- ────── 不同尺寸 ────── -->
    <DemoBlock title="不同尺寸" description="通过 size 设置描述列表的内边距大小和字号。" :code="sizeCode">
      <NSpace vertical :size="20">
        <NDescriptions title="小尺寸 (sm)" :column="2" bordered size="sm">
          <NDescriptionsItem label="姓名">王五</NDescriptionsItem>
          <NDescriptionsItem label="年龄">32</NDescriptionsItem>
        </NDescriptions>
        <NDescriptions title="中等尺寸 (md)" :column="2" bordered size="md">
          <NDescriptionsItem label="姓名">王五</NDescriptionsItem>
          <NDescriptionsItem label="年龄">32</NDescriptionsItem>
        </NDescriptions>
        <NDescriptions title="大尺寸 (lg)" :column="2" bordered size="lg">
          <NDescriptionsItem label="姓名">王五</NDescriptionsItem>
          <NDescriptionsItem label="年龄">32</NDescriptionsItem>
        </NDescriptions>
      </NSpace>
    </DemoBlock>

    <!-- ────── 跨列显示 ────── -->
    <DemoBlock title="跨列显示" description="通过 span 属性设置 NDescriptionsItem 占用列数。" :code="spanCode">
      <NDescriptions title="服务器信息" :column="3" bordered>
        <NDescriptionsItem label="主机名称">web-server-01</NDescriptionsItem>
        <NDescriptionsItem label="IP 地址">192.168.1.100</NDescriptionsItem>
        <NDescriptionsItem label="端口">8080</NDescriptionsItem>
        <NDescriptionsItem label="操作系统" :span="2">CentOS 7.9 x86_64</NDescriptionsItem>
        <NDescriptionsItem label="内存">32GB</NDescriptionsItem>
        <NDescriptionsItem label="描述" :span="3">该服务器用于承载前端静态资源和 API 网关，请勿随意重启。</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <!-- ────── 无标题模式 ────── -->
    <DemoBlock title="无标题模式" description="不传入 title 属性可以使用无标题的简洁模式。" :code="noTitleCode">
      <NDescriptions :column="2" bordered label-placement="top">
        <NDescriptionsItem label="访问量">12,345</NDescriptionsItem>
        <NDescriptionsItem label="转化率">3.2%</NDescriptionsItem>
        <NDescriptionsItem label="客单价">¥ 186.50</NDescriptionsItem>
        <NDescriptionsItem label="复购率">28%</NDescriptionsItem>
      </NDescriptions>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="NDescriptions Props" :columns="propColumns" :data="descPropData" />
    <ApiTable title="NDescriptionsItem Props" :columns="propColumns" :data="itemPropData" />
    <ApiTable title="NDescriptions Slots" :columns="slotColumns" :data="descSlotData" />
    <ApiTable title="NDescriptionsItem Slots" :columns="slotColumns" :data="itemSlotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const combinedCode = `<NDescriptions title="订单详情" :column="3" bordered label-placement="top">
  <NDescriptionsItem label="订单编号">202506240001</NDescriptionsItem>
  <NDescriptionsItem label="下单时间">2025-06-24 10:30:00</NDescriptionsItem>
  <NDescriptionsItem label="订单状态">已发货</NDescriptionsItem>
  <NDescriptionsItem label="收货地址" :span="2">北京市朝阳区...</NDescriptionsItem>
  <NDescriptionsItem label="备注" :span="3">请尽快发货</NDescriptionsItem>
</NDescriptions>`

const basicCode = `<NDescriptions title="用户信息" :column="2">
  <NDescriptionsItem label="用户名">张三</NDescriptionsItem>
  <NDescriptionsItem label="手机号">138****8888</NDescriptionsItem>
  <NDescriptionsItem label="备注" :span="2">跨列内容</NDescriptionsItem>
</NDescriptions>`

const borderedCode = `<NDescriptions title="产品信息" :column="2" bordered>
  <NDescriptionsItem label="产品名称">NacrDesign 组件库</NDescriptionsItem>
  <NDescriptionsItem label="版本号">v0.1.8</NDescriptionsItem>
  <NDescriptionsItem label="描述" :span="2">一套高质量的 Vue 3 组件库</NDescriptionsItem>
</NDescriptions>`

const labelPlacementCode = `<!-- 标签在左侧（默认） -->
<NDescriptions :column="2" bordered>
  <NDescriptionsItem label="品牌">Apple</NDescriptionsItem>
  <NDescriptionsItem label="型号">iPhone 16 Pro</NDescriptionsItem>
</NDescriptions>

<!-- 标签在上方 -->
<NDescriptions :column="3" bordered label-placement="top">
  <NDescriptionsItem label="品牌">Apple</NDescriptionsItem>
  <NDescriptionsItem label="型号">iPhone 16 Pro</NDescriptionsItem>
  <NDescriptionsItem label="颜色">原色钛金属</NDescriptionsItem>
</NDescriptions>`

const columnCode = `<NDescriptions :column="2" bordered>...</NDescriptions>
<NDescriptions :column="3" bordered>...</NDescriptions>`

const sizeCode = `<NDescriptions :column="2" bordered size="sm">...</NDescriptions>
<NDescriptions :column="2" bordered size="md">...</NDescriptions>
<NDescriptions :column="2" bordered size="lg">...</NDescriptions>`

const spanCode = `<NDescriptions :column="3" bordered>
  <NDescriptionsItem label="主机名称">web-server-01</NDescriptionsItem>
  <NDescriptionsItem label="IP 地址">192.168.1.100</NDescriptionsItem>
  <NDescriptionsItem label="端口">8080</NDescriptionsItem>
  <NDescriptionsItem label="操作系统" :span="2">CentOS 7.9</NDescriptionsItem>
  <NDescriptionsItem label="内存">32GB</NDescriptionsItem>
  <NDescriptionsItem label="描述" :span="3">跨三列内容</NDescriptionsItem>
</NDescriptions>`

const noTitleCode = `<NDescriptions :column="2" bordered label-placement="top">
  <NDescriptionsItem label="访问量">12,345</NDescriptionsItem>
  <NDescriptionsItem label="转化率">3.2%</NDescriptionsItem>
</NDescriptions>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const descPropData = [
  { name: 'title', type: 'string', default: '—', desc: '标题，不设置则不显示标题区域' },
  { name: 'column', type: 'number', default: '2', desc: '每行显示的列数' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: '描述列表尺寸' },
  { name: 'labelPlacement', type: "'left' | 'top'", default: "'left'", desc: '标签位置：左侧或上方' },
  { name: 'vertical', type: 'boolean', default: 'false', desc: '是否使用垂直布局' },
]

const itemPropData = [
  { name: 'label', type: 'string', default: '—', desc: '字段标签（必填）' },
  { name: 'span', type: 'number', default: '1', desc: '占用列数' },
]

const descSlotData = [
  { name: 'default', desc: '描述列表内容，放置 NDescriptionsItem' },
]

const itemSlotData = [
  { name: 'default', desc: '字段值内容' },
]
</script>
