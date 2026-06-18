<template>
  <div class="doc-page">
    <h1>BackTop 回到顶部</h1>
    <p class="doc-page__desc">当滚动区域滚动到一定高度后，显示返回顶部按钮，点击后平滑滚动到顶部。</p>

    <!-- ────── 基础用法 ────── -->
    <DemoBlock title="基础用法" description="在卡片内向下滚动，右下角出现回到顶部按钮，点击即可回到顶部。" :code="basicCode">
      <div class="scroll-card-wrap">
        <NBackTop :target="() => basicInner" :visibility-height="100" :right="16" :bottom="16" />
        <div ref="basicInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行内容 — 继续向下滚动查看效果
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 主要样式 ────── -->
    <DemoBlock title="主要样式" description="设置 type=primary 使按钮使用主题色背景。" :code="primaryCode">
      <div class="scroll-card-wrap">
        <NBackTop type="primary" :target="() => primaryInner" :visibility-height="100" :right="16" :bottom="16" />
        <div ref="primaryInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 主要样式按钮
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 方形按钮 ────── -->
    <DemoBlock title="方形按钮" description="设置 shape=square 使用圆角方形按钮。" :code="squareCode">
      <div class="scroll-card-wrap">
        <NBackTop shape="square" :target="() => squareInner" :visibility-height="100" :right="16" :bottom="16" />
        <div ref="squareInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 方形按钮
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 自定义位置与尺寸 ────── -->
    <DemoBlock title="自定义位置与尺寸" description="通过 right / bottom 调整位置，size 调整大小。" :code="positionCode">
      <div class="scroll-card-wrap">
        <NBackTop :target="() => posInner" :visibility-height="100" :right="24" :bottom="24" :size="48" />
        <div ref="posInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 右下偏移 24px，尺寸 48px
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 自定义内容 ────── -->
    <DemoBlock title="自定义内容" description="通过默认插槽自定义按钮内部内容。" :code="slotCode">
      <div class="scroll-card-wrap">
        <NBackTop type="primary" shape="square" :target="() => slotInner" :visibility-height="100" :right="16" :bottom="16" :size="44">
          <span style="font-size:12px;font-weight:600;letter-spacing:1px;">TOP</span>
        </NBackTop>
        <div ref="slotInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 自定义内容插槽
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 动画时长 ────── -->
    <DemoBlock title="动画时长" description="通过 duration 控制回到顶部的滚动动画时长(ms)，设为 0 则立即跳转。" :code="durationCode">
      <NSpace :size="12">
        <NButton @click="durationInner?.scrollTo({ top: 0 })">重置</NButton>
        <NButton variant="secondary" @click="smoothMsg = '慢速动画'; durationVal = 1200">慢速 1200ms</NButton>
        <NButton variant="secondary" @click="smoothMsg = '快速动画'; durationVal = 200">快速 200ms</NButton>
        <NButton variant="secondary" @click="smoothMsg = '立即跳转'; durationVal = 0">立即 0ms</NButton>
      </NSpace>
      <p style="margin-top:8px;color:var(--n-color-text-tertiary);font-size:13px;">当前：{{ smoothMsg }}</p>
      <div class="scroll-card-wrap" style="margin-top:12px;">
        <NBackTop :target="() => durationInner" :visibility-height="80" :right="16" :bottom="16" :duration="durationVal" />
        <div ref="durationInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — {{ smoothMsg }}
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- ────── 监听事件 ────── -->
    <DemoBlock title="监听事件" description="click 事件和 show 事件。" :code="eventCode">
      <div class="scroll-card-wrap">
        <NBackTop :target="() => eventInner" :visibility-height="80" :right="16" :bottom="16" @click="clickCount++" @show="onShow" />
        <div ref="eventInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 滚动查看事件
          </div>
        </div>
      </div>
      <p style="margin-top:8px;color:var(--n-color-text-tertiary);font-size:13px;">
        点击次数：{{ clickCount }} | 显示状态：{{ showStatus ? '已显示' : '已隐藏' }}
      </p>
    </DemoBlock>

    <!-- ────── 多种组合 ────── -->
    <DemoBlock title="多种组合" description="下方默认圆形、上方主要方形，同时作用于同一滚动容器。" :code="comboCode">
      <div class="scroll-card-wrap">
        <NBackTop :target="() => comboInner" :visibility-height="100" :right="16" :bottom="16" />
        <NBackTop type="primary" shape="square" :target="() => comboInner" :visibility-height="100" :right="16" :bottom="68" :size="36">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15" /></svg>
        </NBackTop>
        <div ref="comboInner" class="scroll-card">
          <div v-for="i in 30" :key="i" class="scroll-card__item">
            第 {{ i }} 行 — 双按钮组合
          </div>
        </div>
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicInner = ref<HTMLElement | null>(null)
const primaryInner = ref<HTMLElement | null>(null)
const squareInner = ref<HTMLElement | null>(null)
const posInner = ref<HTMLElement | null>(null)
const slotInner = ref<HTMLElement | null>(null)
const durationInner = ref<HTMLElement | null>(null)
const eventInner = ref<HTMLElement | null>(null)
const comboInner = ref<HTMLElement | null>(null)

const durationVal = ref(500)
const smoothMsg = ref('默认 500ms')
const clickCount = ref(0)
const showStatus = ref(false)

function onShow(val: boolean) {
  showStatus.value = val
}

const basicCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="16" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">
        第 {{ i }} 行内容
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>

<style scoped>
.scroll-card-wrap {
  position: relative;
  height: 320px;
  overflow: hidden;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
}
.scroll-card {
  height: 100%;
  overflow: auto;
}
.scroll-card__item {
  padding: 14px 20px;
  border-bottom: 1px solid var(--n-color-border);
}
<\/style>`

const primaryCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop type="primary" :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="16" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>`

const squareCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop shape="square" :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="16" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>`

const positionCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop :target="() => scrollRef" :visibility-height="100" :right="24" :bottom="24" :size="48" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>`

const slotCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop type="primary" shape="square" :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="16" :size="44">
      <span style="font-size:12px;font-weight:600;">TOP</span>
    </NBackTop>
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>`

const durationCode = `<template>
  <NSpace :size="12">
    <NButton @click="scrollRef?.scrollTo({ top: 0 })">重置</NButton>
    <NButton @click="duration = 1200">慢速 1200ms</NButton>
    <NButton @click="duration = 200">快速 200ms</NButton>
    <NButton @click="duration = 0">立即 0ms</NButton>
  </NSpace>
  <div class="scroll-card-wrap" style="margin-top:12px;">
    <NBackTop :target="() => scrollRef" :visibility-height="80" :right="16" :bottom="16" :duration="duration" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
const duration = ref(500)
<\/script>`

const eventCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop :target="() => scrollRef" :visibility-height="80" :right="16" :bottom="16" @click="clickCount++" @show="onShow" />
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
  <p>点击次数：{{ clickCount }} | 显示状态：{{ showStatus ? '已显示' : '已隐藏' }}</p>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
const clickCount = ref(0)
const showStatus = ref(false)

function onShow(val: boolean) {
  showStatus.value = val
}
<\/script>`

const comboCode = `<template>
  <div class="scroll-card-wrap">
    <NBackTop :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="16" />
    <NBackTop type="primary" shape="square" :target="() => scrollRef" :visibility-height="100" :right="16" :bottom="68" :size="36">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </NBackTop>
    <div ref="scrollRef" class="scroll-card">
      <div v-for="i in 30" :key="i" class="scroll-card__item">第 {{ i }} 行</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
<\/script>`

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
  { name: 'visibilityHeight', type: 'number', default: '400', desc: '滚动高度达到此值后显示按钮(px)' },
  { name: 'right', type: 'number', default: '40', desc: '距离右侧距离(px)' },
  { name: 'bottom', type: 'number', default: '40', desc: '距离底部距离(px)' },
  { name: 'target', type: '() => HTMLElement | null', default: '—', desc: '监听滚动的目标容器，默认为 window' },
  { name: 'duration', type: 'number', default: '500', desc: '回到顶部动画时长(ms)，0 为立即跳转' },
  { name: 'type', type: "'default' | 'primary'", default: "'default'", desc: '按钮类型：默认白底或主题色' },
  { name: 'shape', type: "'circle' | 'square'", default: "'circle'", desc: '按钮形状' },
  { name: 'size', type: 'number', default: '40', desc: '按钮尺寸(px)' },
]

const eventData = [
  { name: 'click', type: '() => void', desc: '点击按钮时触发' },
  { name: 'show', type: '(visible: boolean) => void', desc: '按钮显示/隐藏状态变化时触发' },
]

const slotData = [
  { name: 'default', desc: '自定义按钮内容，默认为向上箭头图标' },
]
</script>

<style scoped>
.scroll-card-wrap {
  position: relative;
  height: 320px;
  border: 1px solid var(--n-color-border, #e5e7eb);
  border-radius: var(--n-radius-lg, 12px);
  background: var(--n-color-bg, #fff);
  overflow: hidden;
}

.scroll-card {
  height: 100%;
  overflow: auto;
}

.scroll-card__item {
  padding: 14px 20px;
  border-bottom: 1px solid var(--n-color-border, #e5e7eb);
  color: var(--n-color-text-secondary, #666);
  font-size: 14px;
}

.scroll-card__item:last-child {
  border-bottom: none;
}
</style>
