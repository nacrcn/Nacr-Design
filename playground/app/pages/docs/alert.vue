<template>
  <div class="doc-page">
    <h1>Alert 警告提示</h1>
    <p class="doc-page__desc">
      展示需要用户关注的信息。支持 4 种语义类型、描边/强调边框变体、可关闭以及顶部横幅模式。
    </p>

    <!-- ────── 不同类型 ────── -->
    <DemoBlock
      title="不同类型"
      description="通过 type 属性设置信息 info、成功 success、警告 warning、错误 error 四种语义类型。"
      :code="typeCode"
    >
      <div class="demo-col">
        <NAlert title="信息提示" type="info">当前版本已更新至 v2.0，请查看发布日志。</NAlert>
        <NAlert title="成功提示" type="success">数据已成功保存到服务器。</NAlert>
        <NAlert title="警告提示" type="warning">您的账户余额不足，请注意及时充值。</NAlert>
        <NAlert title="错误提示" type="error">网络请求失败，请检查网络连接后重试。</NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 无标题 ────── -->
    <DemoBlock
      title="无标题"
      description="省略 title 仅展示纯文本内容，适用于简短的提示信息。"
      :code="noTitleCode"
    >
      <div class="demo-col">
        <NAlert type="info">此处仅展示一条简短的信息提示。</NAlert>
        <NAlert type="success">操作已成功完成！</NAlert>
        <NAlert type="warning">请注意，此操作不可逆。</NAlert>
        <NAlert type="error">操作失败，请稍后重试。</NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 描边模式 ────── -->
    <DemoBlock
      title="描边模式"
      description="设置 outlined 属性去掉背景色，仅保留边框线框风格。"
      :code="outlinedCode"
    >
      <div class="demo-col">
        <NAlert title="信息提示" type="info" outlined>这是一条描边风格的信息提示。</NAlert>
        <NAlert title="成功提示" type="success" outlined>这是一条描边风格的成功提示。</NAlert>
        <NAlert title="警告提示" type="warning" outlined>这是一条描边风格的警告提示。</NAlert>
        <NAlert title="错误提示" type="error" outlined>这是一条描边风格的错误提示。</NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 左侧强调边框 ────── -->
    <DemoBlock
      title="左侧强调边框"
      description="设置 border-accent 属性，左侧显示加粗的颜色边框，增强视觉引导。"
      :code="accentCode"
    >
      <div class="demo-col">
        <NAlert title="信息提示" type="info" border-accent>左侧带有粗边框的信息样式。</NAlert>
        <NAlert title="成功提示" type="success" border-accent>左侧带有粗边框的成功样式。</NAlert>
        <NAlert title="警告提示" type="warning" border-accent>左侧带有粗边框的警告样式。</NAlert>
        <NAlert title="错误提示" type="error" border-accent>左侧带有粗边框的错误样式。</NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 可关闭 ────── -->
    <DemoBlock
      title="可关闭"
      description="设置 closable 后显示关闭按钮，点击可关闭并触发 close 事件。"
      :code="closableCode"
    >
      <div class="demo-col">
        <NAlert title="可关闭的信息" type="info" closable>您可以点击右侧的关闭按钮来关闭此提示。</NAlert>
        <NAlert title="可关闭的错误" type="error" closable>这是一条可关闭的错误提示。</NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 不显示图标 ────── -->
    <DemoBlock
      title="不显示图标"
      description="设置 :show-icon=false 隐藏左侧图标区域，适用于信息简洁的场景。"
      :code="noIconCode"
    >
      <NAlert type="warning" :show-icon="false">没有图标的警告提示，看起来更加简洁。</NAlert>
    </DemoBlock>

    <!-- ────── 横幅模式 ────── -->
    <DemoBlock
      title="横幅模式"
      description="设置 banner 属性以顶部横幅形式展示，边框圆角置零且左右无边框。"
      :code="bannerCode"
    >
      <NAlert type="warning" banner closable>
        系统将于今晚 22:00 – 次日 06:00 进行维护升级，届时服务将暂时不可用，请提前做好准备。
      </NAlert>
    </DemoBlock>

    <!-- ────── 自定义图标 ────── -->
    <DemoBlock
      title="自定义图标"
      description="通过 icon 插槽自定义左侧图标，图标名称参考 Icon 组件内置列表。"
      :code="customIconCode"
    >
      <div class="demo-col">
        <NAlert title="自定义图标" type="success">
          <template #icon>
            <NIcon name="shandian" size="20" />
          </template>
          发布成功！新版本已上线。
        </NAlert>
        <NAlert title="自定义图标" type="info">
          <template #icon>
            <NIcon name="bangzhu" size="20" />
          </template>
          小提示：按 Ctrl+S 可快速保存。
        </NAlert>
      </div>
    </DemoBlock>

    <!-- ────── 组合用法 ────── -->
    <DemoBlock
      title="组合用法"
      description="多种属性可自由组合，如同时使用描边 + 强调边框 + 可关闭。"
      :code="comboCode"
    >
      <div class="demo-col">
        <NAlert title="描边 + 强调边框" type="warning" outlined border-accent closable>
          这是一段组合了描边、左侧强调边框和可关闭功能的警告信息。
        </NAlert>
        <NAlert title="横幅 + 可关闭" type="error" banner closable>
          当前服务异常，技术团队正在紧急修复中。
        </NAlert>
      </div>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

/* ── 代码片段 ── */
const typeCode = `<NAlert title="信息提示" type="info">当前版本已更新。</NAlert>
<NAlert title="成功提示" type="success">数据已保存。</NAlert>
<NAlert title="警告提示" type="warning">余额不足。</NAlert>
<NAlert title="错误提示" type="error">请求失败。</NAlert>`

const noTitleCode = `<NAlert type="info">一条简短的信息提示。</NAlert>
<NAlert type="success">操作已成功完成！</NAlert>
<NAlert type="warning">此操作不可逆。</NAlert>
<NAlert type="error">请稍后重试。</NAlert>`

const outlinedCode = `<NAlert title="信息提示" type="info" outlined>描边风格信息提示。</NAlert>
<NAlert title="成功提示" type="success" outlined>描边风格成功提示。</NAlert>
<NAlert title="警告提示" type="warning" outlined>描边风格警告提示。</NAlert>
<NAlert title="错误提示" type="error" outlined>描边风格错误提示。</NAlert>`

const accentCode = `<NAlert title="信息提示" type="info" border-accent>左侧粗边框样式。</NAlert>
<NAlert title="成功提示" type="success" border-accent>左侧粗边框样式。</NAlert>
<NAlert title="警告提示" type="warning" border-accent>左侧粗边框样式。</NAlert>
<NAlert title="错误提示" type="error" border-accent>左侧粗边框样式。</NAlert>`

const closableCode = `<NAlert title="可关闭的信息" type="info" closable>点击右侧关闭按钮关闭。</NAlert>
<NAlert title="可关闭的错误" type="error" closable>可关闭的错误提示。</NAlert>`

const noIconCode = `<NAlert type="warning" :show-icon="false">
  没有图标的警告提示。
</NAlert>`

const bannerCode = `<NAlert type="warning" banner closable>
  系统将于今晚维护升级，届时服务暂不可用。
</NAlert>`

const customIconCode = `<NAlert title="自定义图标" type="success">
  <template #icon>
    <NIcon name="shandian" size="20" />
  </template>
  发布成功！
</NAlert>

<NAlert title="自定义图标" type="info">
  <template #icon>
    <NIcon name="bangzhu" size="20" />
  </template>
  小提示：按 Ctrl+S 可快速保存。
</NAlert>`

const comboCode = `<NAlert title="描边+强调边框" type="warning" outlined border-accent closable>
  组合了描边、强调边框和可关闭的警告。
</NAlert>

<NAlert title="横幅+可关闭" type="error" banner closable>
  当前服务异常，正在修复中。
</NAlert>`

/* ── 表格定义 ── */
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
  { name: 'title', type: 'string', default: '—', desc: '警告标题，不设置则仅展示内容' },
  { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", desc: '警告语义类型' },
  { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
  { name: 'showIcon', type: 'boolean', default: 'true', desc: '是否显示左侧图标' },
  { name: 'outlined', type: 'boolean', default: 'false', desc: '是否为描边风格（无背景色）' },
  { name: 'borderAccent', type: 'boolean', default: 'false', desc: '是否显示左侧加粗强调边框' },
  { name: 'banner', type: 'boolean', default: 'false', desc: '是否为顶部横幅模式' },
]

const eventData = [
  { name: 'close', type: '() => void', desc: '关闭时触发' },
]

const slotData = [
  { name: 'default', desc: '警告内容区' },
  { name: 'title', desc: '自定义标题区' },
  { name: 'icon', desc: '自定义左侧图标' },
  { name: 'close-icon', desc: '自定义关闭按钮图标' },
]
</script>

<style scoped>
.demo-col {
  display: grid;
  gap: 14px;
}
</style>
