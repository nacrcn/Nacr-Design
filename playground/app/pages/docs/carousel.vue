<template>
  <div class="doc-page">
    <h1>Carousel 走马灯</h1>
    <p class="doc-page__desc">轮播组件，支持自动播放、方向切换、多种指示点样式、箭头触发方式及循环控制。</p>

    <DemoBlock title="基础用法" description="默认水平方向自动播放，左右箭头切换，底部圆点指示器跳转。" :code="basicCode">
      <NCarousel style="max-width:560px;">
        <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
          Slide {{ i }}
        </div>
      </NCarousel>
    </DemoBlock>

    <DemoBlock title="指示点样式" description="通过 dot-type 设置指示点样式，支持 dot（圆点）、line（线段）、number（数字）三种。" :code="dotTypeCode">
      <NSpace vertical :gap="24">
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">dot（默认）</p>
          <NCarousel dot-type="dot" style="max-width:560px;">
            <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              Slide {{ i }}
            </div>
          </NCarousel>
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">line</p>
          <NCarousel dot-type="line" style="max-width:560px;">
            <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              Slide {{ i }}
            </div>
          </NCarousel>
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">number</p>
          <NCarousel dot-type="number" style="max-width:560px;">
            <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              Slide {{ i }}
            </div>
          </NCarousel>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="指示点位置" description="通过 dot-position 设置指示点位置，水平方向支持 top / bottom，垂直方向支持 left / right。" :code="dotPosCode">
      <NSpace :gap="24" wrap>
        <div style="width:260px;">
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">bottom（默认）</p>
          <NCarousel dot-position="bottom">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              {{ i }}
            </div>
          </NCarousel>
        </div>
        <div style="width:260px;">
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">top</p>
          <NCarousel dot-position="top">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              {{ i }}
            </div>
          </NCarousel>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="垂直方向" description="设置 direction 为 vertical 开启垂直轮播，需指定容器高度。" :code="verticalCode">
      <NCarousel direction="vertical" dot-position="right" style="max-width:560px;height:220px;">
        <div v-for="i in 4" :key="i" class="carousel-slide carousel-slide--vertical" :style="{ background: colors[i - 1] }">
          Slide {{ i }}
        </div>
      </NCarousel>
    </DemoBlock>

    <DemoBlock title="箭头触发方式" description="通过 arrow-trigger 设置箭头显示方式：always（始终显示）和 hover（悬停显示）。" :code="arrowCode">
      <NSpace vertical :gap="24">
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">always（默认）</p>
          <NCarousel arrow-trigger="always" style="max-width:560px;">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              Slide {{ i }}
            </div>
          </NCarousel>
        </div>
        <div>
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">hover（悬停显示）</p>
          <NCarousel arrow-trigger="hover" style="max-width:560px;">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              Slide {{ i }}
            </div>
          </NCarousel>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="关闭自动播放" description="设置 autoplay 为 false 关闭自动播放。" :code="noAutoCode">
      <NCarousel :autoplay="false" style="max-width:560px;">
        <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
          Slide {{ i }}
        </div>
      </NCarousel>
    </DemoBlock>

    <DemoBlock title="自定义间隔与速度" description="通过 interval 设置自动播放间隔毫秒数，duration 设置切换动画时长毫秒数。" :code="intervalCode">
      <NCarousel :interval="1500" :duration="600" style="max-width:560px;">
        <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
          Slide {{ i }}
        </div>
      </NCarousel>
    </DemoBlock>

    <DemoBlock title="禁止循环" description="设置 loop 为 false 后，到达首尾不再循环切换。" :code="loopCode">
      <NCarousel :loop="false" style="max-width:560px;">
        <div v-for="i in 4" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
          Slide {{ i }}
        </div>
      </NCarousel>
    </DemoBlock>

    <DemoBlock title="隐藏箭头与指示点" description="通过 show-arrow 和 show-dots 控制箭头和指示点的显示。" :code="hideCode">
      <NSpace :gap="24" wrap>
        <div style="width:260px;">
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">无箭头</p>
          <NCarousel :show-arrow="false">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              {{ i }}
            </div>
          </NCarousel>
        </div>
        <div style="width:260px;">
          <p style="font-size:13px;color:var(--n-color-text-secondary);margin-bottom:8px;">无指示点</p>
          <NCarousel :show-dots="false">
            <div v-for="i in 3" :key="i" class="carousel-slide" :style="{ background: colors[i - 1] }">
              {{ i }}
            </div>
          </NCarousel>
        </div>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="图片轮播" description="搭配 Image 组件实现图片轮播，开启预览功能。" :code="imageCode">
      <NCarousel :interval="4000" style="max-width:560px;">
        <NImage
          v-for="(url, i) in images"
          :key="i"
          :src="url"
          :alt="'图片' + (i + 1)"
          preview
          :preview-urls="images"
          :initial-index="i"
          :width="560"
          :height="300"
          fit="cover"
          shape="rounded"
        />
      </NCarousel>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const colors = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f']

const images = [
  'https://pan.nacr.cn/f/pWHL/u=2906853932%2C1643767316&fm=253&app=138&f=JPEG.jpg',
  'https://pan.nacr.cn/f/Qqs3/u=3821071028%2C8110015&fm=253&app=138&f=JPEG.jpg',
  'https://pan.nacr.cn/f/1YUe/u=2320700119%2C1197838426&fm=253&app=138&f=JPEG.jpg',
]

const basicCode = `<NCarousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
  <div>Slide 4</div>
</NCarousel>`

const dotTypeCode = `<NCarousel dot-type="dot">...</NCarousel>
<NCarousel dot-type="line">...</NCarousel>
<NCarousel dot-type="number">...</NCarousel>`

const dotPosCode = `<NCarousel dot-position="bottom">...</NCarousel>
<NCarousel dot-position="top">...</NCarousel>`

const verticalCode = `<NCarousel direction="vertical" dot-position="right" style="height:220px;">
  <div style="height:100%">Slide 1</div>
  <div style="height:100%">Slide 2</div>
</NCarousel>`

const arrowCode = `<NCarousel arrow-trigger="always">...</NCarousel>
<NCarousel arrow-trigger="hover">...</NCarousel>`

const noAutoCode = `<NCarousel :autoplay="false">
  <div>Slide 1</div>
  <div>Slide 2</div>
</NCarousel>`

const intervalCode = `<NCarousel :interval="1500" :duration="600">
  <div>Slide 1</div>
  <div>Slide 2</div>
</NCarousel>`

const loopCode = `<NCarousel :loop="false">
  <div>Slide 1</div>
  <div>Slide 2</div>
</NCarousel>`

const hideCode = `<NCarousel :show-arrow="false">...</NCarousel>
<NCarousel :show-dots="false">...</NCarousel>`

const imageCode = `<NCarousel :interval="4000">
  <NImage
    v-for="(url, i) in images"
    :key="i"
    :src="url"
    preview
    :preview-urls="images"
    :initial-index="i"
    :width="560"
    :height="300"
    fit="cover"
    shape="rounded"
  />
</NCarousel>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'autoplay', type: 'boolean', default: 'true', desc: '是否自动播放' },
  { name: 'interval', type: 'number', default: '3000', desc: '自动播放间隔(ms)' },
  { name: 'duration', type: 'number', default: '400', desc: '切换动画时长(ms)' },
  { name: 'loop', type: 'boolean', default: 'true', desc: '是否循环播放' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '轮播方向' },
  { name: 'dotType', type: "'dot' | 'line' | 'number'", default: "'dot'", desc: '指示点样式' },
  { name: 'dotPosition', type: "'bottom' | 'top' | 'left' | 'right'", default: "'bottom'", desc: '指示点位置' },
  { name: 'showDots', type: 'boolean', default: 'true', desc: '是否显示指示点' },
  { name: 'showArrow', type: 'boolean', default: 'true', desc: '是否显示箭头' },
  { name: 'arrowTrigger', type: "'always' | 'hover'", default: "'always'", desc: '箭头显示触发方式' },
  { name: 'pauseOnHover', type: 'boolean', default: 'true', desc: '鼠标悬停时暂停自动播放' },
  { name: 'height', type: 'number | string', default: '—', desc: '容器高度（垂直方向时有用）' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'change', type: '(current: number, prev: number) => void', desc: '轮播切换时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '轮播子项内容' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'prev', type: '() => void', desc: '切换到上一张' },
  { name: 'next', type: '() => void', desc: '切换到下一张' },
  { name: 'goTo', type: '(index: number) => void', desc: '切换到指定索引' },
]
</script>

<style scoped>
.carousel-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  border-radius: var(--n-radius-lg, 12px);
  user-select: none;
}

.carousel-slide--vertical {
  height: 100%;
}
</style>
