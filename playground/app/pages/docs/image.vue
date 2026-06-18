<template>
  <div class="doc-page">
    <h1>Image 图片</h1>
    <p class="doc-page__desc">展示图片，支持多种形状、懒加载、加载占位、加载失败回退、预览大图及多图预览。</p>

    <DemoBlock title="基础用法" description="通过 src 设置图片地址，默认包含懒加载。" :code="basicCode">
      <NImage :src="img1" alt="示例图片" :width="240" :height="160" shape="rounded" />
    </DemoBlock>

    <DemoBlock title="图片形状" description="通过 shape 设置图片形状，支持 square（方形）、rounded（圆角）、circle（圆形）。" :code="shapeCode">
      <NSpace>
        <div style="text-align:center;">
          <NImage :src="img1" alt="方形" shape="square" :width="100" :height="100" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">square</p>
        </div>
        <div style="text-align:center;">
          <NImage :src="img1" alt="圆角" shape="rounded" :width="100" :height="100" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">rounded</p>
        </div>
        <div style="text-align:center;">
          <NImage :src="img1" alt="圆形" shape="circle" :width="100" :height="100" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">circle</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="填充模式" description="通过 fit 设置图片填充方式，等同于 CSS object-fit 属性。使用正方形容器更易观察差异。" :code="fitCode">
      <NSpace>
        <div v-for="f in fits" :key="f" style="text-align:center;">
          <NImage :src="img1" :alt="f" :fit="f as any" :width="120" :height="120" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">{{ f }}</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="图片预览" description="设置 preview 开启点击预览大图功能，支持缩放、旋转操作及键盘快捷键（← → Esc +/-）。" :code="previewCode">
      <NImage :src="img2" alt="点击预览" preview :width="240" :height="160" shape="rounded" />
    </DemoBlock>

    <DemoBlock title="多图预览" description="通过 previewUrls 设置预览图片列表，点击任一图片可在预览中切换浏览。" :code="groupCode">
      <NSpace>
        <NImage
          v-for="(url, i) in allImgs"
          :key="i"
          :src="url"
          :alt="'图片' + (i + 1)"
          preview
          :preview-urls="allImgs"
          :initial-index="i"
          :width="140"
          :height="94"
          shape="rounded"
        />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义预览地址" description="通过 previewSrc 设置预览时所用的大图地址，与 src 缩略图不同。" :code="previewSrcCode">
      <NImage
        :src="img1"
        alt="自定义预览"
        preview
        :preview-src="img2"
        :width="160"
        :height="108"
        shape="rounded"
      />
    </DemoBlock>

    <DemoBlock title="加载失败回退" description="通过 fallback 设置图片加载失败时显示的备用图片地址。" :code="fallbackCode">
      <NSpace>
        <div style="text-align:center;">
          <NImage :src="brokenSrc" alt="无回退" :width="120" :height="120" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">无回退</p>
        </div>
        <div style="text-align:center;">
          <NImage :src="brokenSrc" :fallback="img3" alt="有回退" :width="120" :height="120" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">有回退</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义占位与错误" description="使用 placeholder 和 error 插槽自定义加载中和加载失败的展示内容。" :code="slotCode">
      <NSpace>
        <NImage :src="img1" :width="120" :height="120" shape="rounded">
          <template #placeholder>
            <div class="custom-slot custom-slot--loading">加载中…</div>
          </template>
        </NImage>
        <NImage :src="brokenSrc" :width="120" :height="120" shape="rounded">
          <template #error>
            <div class="custom-slot custom-slot--error">图片不可用</div>
          </template>
        </NImage>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义遮罩" description="使用 previewMask 插槽自定义预览悬停遮罩内容。" :code="maskCode">
      <NImage :src="img2" alt="自定义遮罩" preview :width="240" :height="160" shape="rounded">
        <template #previewMask>
          <div style="color:#fff;font-size:14px;display:flex;align-items:center;gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            查看大图
          </div>
        </template>
      </NImage>
    </DemoBlock>

    <DemoBlock title="设置宽高" description="通过 width 和 height 设置图片容器大小，支持数字(px)和字符串。" :code="sizeCode">
      <NSpace align="end">
        <NImage :src="img3" :width="64" :height="64" shape="rounded" />
        <NImage :src="img3" :width="100" :height="64" shape="rounded" />
        <NImage :src="img3" :width="64" :height="100" shape="rounded" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义圆角" description="通过 borderRadius 覆盖形状默认的圆角值。" :code="radiusCode">
      <NSpace>
        <NImage :src="img1" :width="100" :height="100" border-radius="16px" />
        <NImage :src="img1" :width="100" :height="100" border-radius="50% 0 50% 0" />
      </NSpace>
    </DemoBlock>

    <DemoBlock title="对象定位" description="通过 objectPosition 设置图片在容器中的聚焦位置，等同于 CSS object-position。" :code="positionCode">
      <NSpace>
        <div style="text-align:center;">
          <NImage :src="img3" :width="120" :height="120" fit="cover" object-position="top" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">top</p>
        </div>
        <div style="text-align:center;">
          <NImage :src="img3" :width="120" :height="120" fit="cover" object-position="center" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">center</p>
        </div>
        <div style="text-align:center;">
          <NImage :src="img3" :width="120" :height="120" fit="cover" object-position="bottom" shape="rounded" />
          <p style="font-size:12px;color:var(--n-color-text-secondary);margin-top:4px;">bottom</p>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="禁用懒加载" description="设置 lazy 为 false 可关闭原生懒加载。" :code="lazyCode">
      <NImage :src="img1" alt="不懒加载" :lazy="false" :width="240" :height="160" shape="rounded" />
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const img1 = 'https://pan.nacr.cn/f/pWHL/u=2906853932%2C1643767316&fm=253&app=138&f=JPEG.jpg'
const img2 = 'https://pan.nacr.cn/f/Qqs3/u=3821071028%2C8110015&fm=253&app=138&f=JPEG.jpg'
const img3 = 'https://pan.nacr.cn/f/1YUe/u=2320700119%2C1197838426&fm=253&app=138&f=JPEG.jpg'

// 用空字符串模拟加载失败，不依赖外部链接
const brokenSrc = ''

const fits = ['contain', 'cover', 'fill', 'none', 'scale-down']

const allImgs = [img1, img2, img3]

const basicCode = `<NImage src="https://example.com/image.jpg" :width="240" :height="160" shape="rounded" />`

const shapeCode = `<NImage src="..." shape="square" :width="100" :height="100" />
<NImage src="..." shape="rounded" :width="100" :height="100" />
<NImage src="..." shape="circle" :width="100" :height="100" />`

const fitCode = `<NImage fit="contain" :width="120" :height="120" shape="rounded" />
<NImage fit="cover" :width="120" :height="120" shape="rounded" />
<NImage fit="fill" :width="120" :height="120" shape="rounded" />
<NImage fit="none" :width="120" :height="120" shape="rounded" />
<NImage fit="scale-down" :width="120" :height="120" shape="rounded" />`

const previewCode = `<NImage src="..." preview :width="240" :height="160" shape="rounded" />`

const groupCode = `<NImage
  v-for="(url, i) in urls"
  :key="i"
  :src="url"
  preview
  :preview-urls="urls"
  :initial-index="i"
  :width="140"
  :height="94"
  shape="rounded"
/>`

const previewSrcCode = `<NImage
  src="thumb.jpg"
  preview
  preview-src="full.jpg"
  :width="160"
  :height="108"
  shape="rounded"
/>`

const fallbackCode = `<!-- 无回退：显示错误占位 -->
<NImage src="" :width="120" :height="120" shape="rounded" />

<!-- 有回退：失败后自动切换到备用图片 -->
<NImage src="" fallback="fallback.jpg" :width="120" :height="120" shape="rounded" />`

const slotCode = `<NImage src="..." :width="120" :height="120" shape="rounded">
  <template #placeholder>
    <div>加载中…</div>
  </template>
</NImage>

<NImage src="" :width="120" :height="120" shape="rounded">
  <template #error>
    <div>图片不可用</div>
  </template>
</NImage>`

const maskCode = `<NImage src="..." preview :width="240" :height="160" shape="rounded">
  <template #previewMask>
    <div>查看大图</div>
  </template>
</NImage>`

const sizeCode = `<NImage src="..." :width="64" :height="64" shape="rounded" />
<NImage src="..." :width="100" :height="64" shape="rounded" />
<NImage src="..." :width="64" :height="100" shape="rounded" />`

const radiusCode = `<NImage src="..." :width="100" :height="100" border-radius="16px" />
<NImage src="..." :width="100" :height="100" border-radius="50% 0 50% 0" />`

const positionCode = `<NImage src="..." fit="cover" object-position="top" :width="120" :height="120" shape="rounded" />
<NImage src="..." fit="cover" object-position="center" :width="120" :height="120" shape="rounded" />
<NImage src="..." fit="cover" object-position="bottom" :width="120" :height="120" shape="rounded" />`

const lazyCode = `<NImage src="..." :lazy="false" :width="240" :height="160" shape="rounded" />`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'src', type: 'string', default: '—', desc: '图片地址（必填）' },
  { name: 'alt', type: 'string', default: '—', desc: '图片替代文本' },
  { name: 'width', type: 'number | string', default: '—', desc: '容器宽度' },
  { name: 'height', type: 'number | string', default: '—', desc: '容器高度' },
  { name: 'fit', type: "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'", default: "'cover'", desc: '图片填充方式，等同 CSS object-fit' },
  { name: 'shape', type: "'square' | 'rounded' | 'circle'", default: "'square'", desc: '图片形状' },
  { name: 'preview', type: 'boolean', default: 'false', desc: '是否可预览大图' },
  { name: 'lazy', type: 'boolean', default: 'true', desc: '是否启用原生懒加载' },
  { name: 'fallback', type: 'string', default: '—', desc: '加载失败时显示的备用图片地址' },
  { name: 'previewSrc', type: 'string', default: '—', desc: '预览时使用的大图地址（默认使用 src）' },
  { name: 'objectPosition', type: 'string', default: '—', desc: '图片聚焦位置，等同 CSS object-position' },
  { name: 'borderRadius', type: 'string', default: '—', desc: '自定义圆角，覆盖 shape 的默认值' },
  { name: 'previewUrls', type: 'string[]', default: '[]', desc: '预览图片列表，用于多图预览切换' },
  { name: 'initialIndex', type: 'number', default: '0', desc: '多图预览时的初始索引' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'load', type: '(e: Event) => void', desc: '图片加载成功时触发' },
  { name: 'error', type: '(e: Event) => void', desc: '图片加载失败时触发' },
  { name: 'previewOpen', type: '() => void', desc: '预览窗口打开时触发' },
  { name: 'previewClose', type: '() => void', desc: '预览窗口关闭时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'placeholder', desc: '自定义加载中占位内容' },
  { name: 'error', desc: '自定义加载失败展示内容' },
  { name: 'previewMask', desc: '自定义预览悬停遮罩内容' },
]
</script>

<style scoped>
.custom-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
}

.custom-slot--loading {
  background: #f0f0ff;
  color: #6366f1;
}

.custom-slot--error {
  background: #fff0f0;
  color: #ef4444;
}
</style>
