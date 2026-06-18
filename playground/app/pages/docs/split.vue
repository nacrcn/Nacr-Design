<template>
  <div class="doc-page">
    <h1>Split 分割面板</h1>
    <p class="doc-page__desc">
      可拖拽调整大小的分割面板，支持水平和垂直方向、双向绑定比例、自定义分割条大小、禁用拖拽等。
    </p>

    <!-- ────── 水平分割 ────── -->
    <DemoBlock title="水平分割" description="默认为水平方向，拖拽中间分割条调整左右面板比例。" :code="hCode">
      <NSplit direction="horizontal" :default-ratio="0.4" style="height:200px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel">左面板</div>
        </template>
        <template #2>
          <div class="split-demo-panel">右面板</div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 垂直分割 ────── -->
    <DemoBlock title="垂直分割" description="设置 direction 为 vertical 实现上下分割，分割线自动变为横向手柄。" :code="vCode">
      <NSplit direction="vertical" :default-ratio="0.35" style="height:240px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel">上方面板</div>
        </template>
        <template #2>
          <div class="split-demo-panel">下方面板</div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 双向绑定 ────── -->
    <DemoBlock title="双向绑定" description="通过 v-model:ratio 绑定分割比例，可用于外部控制或读取当前比例。" :code="bindCode">
      <div class="demo-col">
        <NSplit v-model:ratio="bindRatio" direction="horizontal" style="height:160px;" class="split-demo-wrap">
          <template #1>
            <div class="split-demo-panel">左面板</div>
          </template>
          <template #2>
            <div class="split-demo-panel">右面板</div>
          </template>
        </NSplit>
        <NSpace :size="8" align="center">
          <span style="font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前比例：{{ (bindRatio * 100).toFixed(0) }}%</span>
          <NButton size="sm" variant="secondary" @click="bindRatio = 0.25">25%</NButton>
          <NButton size="sm" variant="secondary" @click="bindRatio = 0.5">50%</NButton>
          <NButton size="sm" variant="secondary" @click="bindRatio = 0.75">75%</NButton>
        </NSpace>
      </div>
    </DemoBlock>

    <!-- ────── 最小/最大比例 ────── -->
    <DemoBlock title="限制范围" description="通过 min 和 max 限制拖拽范围，下方示例限制为 20%~50%。" :code="rangeCode">
      <NSplit :default-ratio="0.35" :min="0.2" :max="0.5" style="height:160px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel">受限面板 (20%~50%)</div>
        </template>
        <template #2>
          <div class="split-demo-panel">右面板</div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 自定义分割条大小 ────── -->
    <DemoBlock title="自定义分割条" description="通过 bar-size 设置分割条宽度(px)，hover 时高亮提示可拖拽。" :code="barCode">
      <NSplit :default-ratio="0.5" :bar-size="8" style="height:160px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel">左面板</div>
        </template>
        <template #2>
          <div class="split-demo-panel">右面板</div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 禁用拖拽 ────── -->
    <DemoBlock title="禁用拖拽" description="设置 disabled 禁止拖拽调整比例。" :code="disabledCode">
      <NSplit :default-ratio="0.4" disabled style="height:160px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel">固定比例面板</div>
        </template>
        <template #2>
          <div class="split-demo-panel">右面板</div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 嵌套分割 ────── -->
    <DemoBlock title="嵌套分割" description="Split 可以嵌套使用，实现多区域复杂布局。" :code="nestedCode">
      <NSplit direction="horizontal" :default-ratio="0.35" style="height:240px;" class="split-demo-wrap">
        <template #1>
          <div class="split-demo-panel" style="background:var(--n-color-primary-light);color:var(--n-color-primary);">侧边面板</div>
        </template>
        <template #2>
          <NSplit direction="vertical" :default-ratio="0.6" style="height:100%;">
            <template #1>
              <div class="split-demo-panel">主内容区域</div>
            </template>
            <template #2>
              <div class="split-demo-panel" style="background:var(--n-color-fill);">底部区域</div>
            </template>
          </NSplit>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── 自定义内容 ────── -->
    <DemoBlock title="自定义内容" description="面板中放置任意内容，如图表、列表、代码编辑器等。" :code="contentCode">
      <NSplit direction="horizontal" :default-ratio="0.45" style="height:220px;" class="split-demo-wrap">
        <template #1>
          <div style="padding:16px;overflow:auto;height:100%;">
            <p style="font-weight:600;margin:0 0 8px;">文件列表</p>
            <div v-for="f in files" :key="f" class="split-file-item">{{ f }}</div>
          </div>
        </template>
        <template #2>
          <div style="padding:16px;overflow:auto;height:100%;font-family:monospace;font-size:13px;color:var(--n-color-text-secondary);">
            <p style="font-weight:600;margin:0 0 8px;color:var(--n-color-text);">编辑器</p>
            <pre>// 选择左侧文件查看内容
const greeting = 'Hello World'
console.log(greeting)</pre>
          </div>
        </template>
      </NSplit>
    </DemoBlock>

    <!-- ────── API ────── -->
    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const bindRatio = ref(0.4)
const files = ['index.vue', 'main.ts', 'app.vue', 'nuxt.config.ts', 'package.json']

const hCode = `<NSplit direction="horizontal" :default-ratio="0.4">
  <template #1>左面板</template>
  <template #2>右面板</template>
</NSplit>`

const vCode = `<NSplit direction="vertical" :default-ratio="0.35">
  <template #1>上方面板</template>
  <template #2>下方面板</template>
</NSplit>`

const bindCode = `<NSplit v-model:ratio="ratio" direction="horizontal">
  <template #1>左面板</template>
  <template #2>右面板</template>
</NSplit>
<NButton @click="ratio = 0.25">25%</NButton>
<NButton @click="ratio = 0.5">50%</NButton>
<NButton @click="ratio = 0.75">75%</NButton>`

const rangeCode = `<NSplit :default-ratio="0.35" :min="0.2" :max="0.5">
  <template #1>受限面板 (20%~50%)</template>
  <template #2>右面板</template>
</NSplit>`

const barCode = `<NSplit :default-ratio="0.5" :bar-size="8">
  <template #1>左面板</template>
  <template #2>右面板</template>
</NSplit>`

const disabledCode = `<NSplit :default-ratio="0.4" disabled>
  <template #1>固定比例面板</template>
  <template #2>右面板</template>
</NSplit>`

const nestedCode = `<NSplit direction="horizontal" :default-ratio="0.35">
  <template #1>侧边面板</template>
  <template #2>
    <NSplit direction="vertical" :default-ratio="0.6">
      <template #1>主内容区域</template>
      <template #2>底部区域</template>
    </NSplit>
  </template>
</NSplit>`

const contentCode = `<NSplit direction="horizontal" :default-ratio="0.45">
  <template #1>
    <div>文件列表</div>
  </template>
  <template #2>
    <div>编辑器内容</div>
  </template>
</NSplit>`

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
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '分割方向' },
  { name: 'defaultRatio', type: 'number', default: '0.5', desc: '初始分割比例(0~1)' },
  { name: 'ratio', type: 'number', default: '—', desc: '当前分割比例（支持 v-model:ratio）' },
  { name: 'min', type: 'number', default: '0.1', desc: '最小比例' },
  { name: 'max', type: 'number', default: '0.9', desc: '最大比例' },
  { name: 'barSize', type: 'number', default: '4', desc: '分割条大小(px)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用拖拽' },
]

const eventData = [
  { name: 'update:ratio', type: '(ratio: number) => void', desc: '比例变化时触发（用于 v-model）' },
  { name: 'resize', type: '(ratio: number) => void', desc: '拖拽结束时触发，返回当前比例' },
]

const slotData = [
  { name: '1', desc: '第一个面板内容' },
  { name: '2', desc: '第二个面板内容' },
]
</script>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.split-demo-wrap {
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg);
  overflow: hidden;
}
.split-demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--n-color-text-secondary);
  font-size: var(--n-font-size-sm);
}
.split-file-item {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--n-font-size-sm);
  color: var(--n-color-text-secondary);
  transition: background 0.15s;
}
.split-file-item:hover {
  background: var(--n-color-fill-hover);
}
</style>
