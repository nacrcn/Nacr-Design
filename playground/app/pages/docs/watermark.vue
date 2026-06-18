<template>
  <div class="doc-page">
    <h1>Watermark 水印</h1>
    <p class="doc-page__desc">
      在页面上添加文字或图片水印，用于版权保护、信息标识或防止截图。支持多行文字、图片水印、全屏模式及动态移动效果。
    </p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="通过 content 设置水印文字，默认覆盖在子内容上方。" :code="basicCode">
      <NWatermark content="Nacr Design">
        <div class="watermark-preview">
          <p>这里是被水印覆盖的内容区域，水印文字会铺满整个容器。</p>
          <p>水印默认半透明，不会严重影响内容阅读。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 多行文字 ────── -->
    <DemoBlock title="多行文字" description="content 中使用 \\n 换行符即可生成多行水印文字。" :code="multilineCode">
      <NWatermark content="Nacr Design\n内部机密">
        <div class="watermark-preview">
          <p>多行水印适用于同时展示公司名称和安全等级等复合信息。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 自定义样式 ────── -->
    <DemoBlock title="自定义样式" description="通过 gapX / gapY 调整间距，rotate 旋转角度，fontSize / color / fontWeight 控制文字外观。" :code="customCode">
      <NWatermark content="CONFIDENTIAL" :gap-x="160" :gap-y="120" :rotate="-30" :font-size="16" font-weight="bold" color="rgba(255,0,0,0.06)">
        <div class="watermark-preview">
          <p>红色加粗倾斜水印，适用于机密文件场景。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 图片水印 ────── -->
    <DemoBlock title="图片水印" description="通过 image 属性指定图片 URL 作为水印，imageWidth / imageHeight 控制图片大小。" :code="imageCode">
      <NWatermark :image="imgUrl" :image-width="28" :image-height="28" :gap-x="80" :gap-y="80">
        <div class="watermark-preview">
          <p>使用图片替代文字作为水印标识。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 偏移位置 ────── -->
    <DemoBlock title="偏移位置" description="通过 offsetX / offsetY 调整水印的起始渲染位置。" :code="offsetCode">
      <NWatermark content="OFFSET" :offset-x="40" :offset-y="30" :gap-x="120" :gap-y="100">
        <div class="watermark-preview">
          <p>水印整体向右偏移 40px，向下偏移 30px。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 自定义透明度 ────── -->
    <DemoBlock title="自定义透明度" description="通过 opacity 控制水印整体透明度，取值 0~1，值越小水印越淡。" :code="opacityCode">
      <NSpace vertical :size="16">
        <NWatermark content="OPACITY 0.3" :opacity="0.3" :gap-x="120" :gap-y="100">
          <div class="watermark-preview">透明度 0.3 — 水印较淡</div>
        </NWatermark>
        <NWatermark content="OPACITY 0.7" :opacity="0.7" :gap-x="120" :gap-y="100">
          <div class="watermark-preview">透明度 0.7 — 水印较浓</div>
        </NWatermark>
      </NSpace>
    </DemoBlock>

    <!-- ────── 动态水印 ────── -->
    <DemoBlock title="动态水印" description="设置 movable 使水印持续平移，增加防截图难度。" :code="movableCode">
      <NWatermark content="MOVABLE" movable :gap-x="120" :gap-y="100">
        <div class="watermark-preview">
          <p>水印正在缓慢移动，可以有效防止静态截图盗用。</p>
        </div>
      </NWatermark>
    </DemoBlock>

    <!-- ────── 全屏水印 ────── -->
    <DemoBlock title="全屏水印" description="设置 fullscreen 后水印覆盖整个视口，不限于容器范围。" :code="fullscreenCode">
      <NButton variant="secondary" @click="showFullscreen">显示全屏水印（3秒后关闭）</NButton>
      <NWatermark v-if="fullscreenVisible" fullscreen content="Nacr Design\n内部文档" :gap-x="140" :gap-y="120" :font-size="14" />
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const fullscreenVisible = ref(false)
function showFullscreen() {
  fullscreenVisible.value = true
  setTimeout(() => { fullscreenVisible.value = false }, 3000)
}

// 用于图片水印 demo 的简易 SVG 内联图片
const imgUrl = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="rgba(0,0,0,0.06)"/><text x="16" y="20" text-anchor="middle" font-size="11" font-weight="bold" fill="rgba(0,0,0,0.3)">N</text></svg>')}`

const basicCode = `<NWatermark content="Nacr Design">
  <div>内容区域</div>
</NWatermark>`

const multilineCode = `<NWatermark content="Nacr Design\\n内部机密">
  <div>内容区域</div>
</NWatermark>`

const customCode = `<NWatermark content="CONFIDENTIAL"
  :gap-x="160" :gap-y="120"
  :rotate="-30" :font-size="16"
  font-weight="bold"
  color="rgba(255,0,0,0.06)">
  <div>内容区域</div>
</NWatermark>`

const imageCode = `<NWatermark
  :image="logoUrl"
  :image-width="28" :image-height="28"
  :gap-x="80" :gap-y="80">
  <div>内容区域</div>
</NWatermark>`

const offsetCode = `<NWatermark content="OFFSET"
  :offset-x="40" :offset-y="30"
  :gap-x="120" :gap-y="100">
  <div>内容区域</div>
</NWatermark>`

const opacityCode = `<NWatermark content="淡水印" :opacity="0.3" :gap-x="120" :gap-y="100">
  <div>透明度 0.3 — 水印较淡</div>
</NWatermark>
<NWatermark content="浓水印" :opacity="0.7" :gap-x="120" :gap-y="100">
  <div>透明度 0.7 — 水印较浓</div>
</NWatermark>`

const movableCode = `<NWatermark content="MOVABLE" movable :gap-x="120" :gap-y="100">
  <div>内容区域</div>
</NWatermark>`

const fullscreenCode = `<NWatermark fullscreen content="Nacr Design\\n内部文档" :gap-x="140" :gap-y="120" />`

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

const propData = [
  { name: 'content', type: 'string', default: "'Nacr Design'", desc: '水印文字，支持 \\n 换行' },
  { name: 'gapX', type: 'number', default: '100', desc: '水印水平间距(px)' },
  { name: 'gapY', type: 'number', default: '100', desc: '水印垂直间距(px)' },
  { name: 'rotate', type: 'number', default: '-22', desc: '旋转角度(°)' },
  { name: 'fontSize', type: 'number', default: '14', desc: '文字字号(px)' },
  { name: 'fontFamily', type: 'string', default: "'sans-serif'", desc: '字体' },
  { name: 'fontWeight', type: "'normal' | 'bold' | 'lighter'", default: "'normal'", desc: '字重' },
  { name: 'color', type: 'string', default: "'rgba(0,0,0,0.08)'", desc: '水印颜色' },
  { name: 'width', type: 'number', default: '120', desc: '水印单元宽度(px)' },
  { name: 'height', type: 'number', default: '64', desc: '水印单元高度(px)' },
  { name: 'offsetX', type: 'number', default: '0', desc: '水平偏移(px)' },
  { name: 'offsetY', type: 'number', default: '0', desc: '垂直偏移(px)' },
  { name: 'image', type: 'string', default: '—', desc: '图片水印 URL，设置后优先使用图片' },
  { name: 'imageWidth', type: 'number', default: '0', desc: '图片宽度(px)，0 表示原始宽度' },
  { name: 'imageHeight', type: 'number', default: '0', desc: '图片高度(px)，0 表示原始高度' },
  { name: 'opacity', type: 'number', default: '1', desc: '水印整体透明度(0~1)，值越小越淡' },
  { name: 'fullscreen', type: 'boolean', default: 'false', desc: '是否全屏显示水印' },
  { name: 'movable', type: 'boolean', default: 'false', desc: '水印是否持续移动（防截图）' },
]

const slotData = [
  { name: 'default', desc: '被水印覆盖的内容（fullscreen 模式下无效）' },
]
</script>

<style scoped>
.watermark-preview {
  padding: 28px 24px;
  background: var(--n-color-bg);
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  min-height: 200px;
  color: var(--n-color-text-secondary);
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
