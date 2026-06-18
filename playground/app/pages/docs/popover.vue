<template>
  <div class="doc-page">
    <h1>Popover 气泡卡片</h1>
    <p class="doc-page__desc">点击或悬停弹出气泡卡片，常用于展示附加信息或操作面板。</p>

    <!-- 1. 基础用法 -->
    <DemoBlock title="基础用法" description="默认 hover 触发，鼠标移入显示气泡卡片。" :code="basicCode">
      <NSpace>
        <NPopover title="提示" trigger="hover">
          <template #trigger>
            <NButton>悬停我</NButton>
          </template>
          这是一条气泡卡片内容，鼠标移出自动隐藏。
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 2. 触发方式 -->
    <DemoBlock title="触发方式" description="支持 hover、click、focus、manual 四种触发方式。" :code="triggerCode">
      <NSpace>
        <NPopover title="悬停触发" trigger="hover">
          <template #trigger><NButton>Hover</NButton></template>
          鼠标悬停触发
        </NPopover>
        <NPopover title="点击触发" trigger="click">
          <template #trigger><NButton variant="secondary">Click</NButton></template>
          点击触发，点击外部关闭
        </NPopover>
        <NPopover title="聚焦触发" trigger="focus">
          <template #trigger><NInput placeholder="聚焦输入框" style="width:180px;" /></template>
          输入框聚焦时触发
        </NPopover>
        <NPopover v-model="manualVisible" title="手动控制" trigger="manual">
          <template #trigger><NButton variant="outline" @click="manualVisible = !manualVisible">手动切换</NButton></template>
          通过 v-model 手动控制显隐
        </NPopover>
      </NSpace>
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        手动控制状态：{{ manualVisible ? '显示' : '隐藏' }}
      </div>
    </DemoBlock>

    <!-- 3. 弹出位置 -->
    <DemoBlock title="弹出位置" description="支持 12 个弹出方位。" :code="placementCode">
      <div style="display:flex;justify-content:center;">
        <div class="placement-grid">
          <div class="placement-row">
            <NPopover placement="top-start" trigger="click"><template #trigger><NButton size="sm">上左</NButton></template>top-start</NPopover>
            <NPopover placement="top" trigger="click"><template #trigger><NButton size="sm">上</NButton></template>top</NPopover>
            <NPopover placement="top-end" trigger="click"><template #trigger><NButton size="sm">上右</NButton></template>top-end</NPopover>
          </div>
          <div class="placement-row" style="justify-content:space-between;width:100%;">
            <NPopover placement="left-start" trigger="click"><template #trigger><NButton size="sm">左上</NButton></template>left-start</NPopover>
            <NPopover placement="right-start" trigger="click"><template #trigger><NButton size="sm">右上</NButton></template>right-start</NPopover>
          </div>
          <div class="placement-row" style="justify-content:space-between;width:100%;">
            <NPopover placement="left" trigger="click"><template #trigger><NButton size="sm">左</NButton></template>left</NPopover>
            <NPopover placement="right" trigger="click"><template #trigger><NButton size="sm">右</NButton></template>right</NPopover>
          </div>
          <div class="placement-row" style="justify-content:space-between;width:100%;">
            <NPopover placement="left-end" trigger="click"><template #trigger><NButton size="sm">左下</NButton></template>left-end</NPopover>
            <NPopover placement="right-end" trigger="click"><template #trigger><NButton size="sm">右下</NButton></template>right-end</NPopover>
          </div>
          <div class="placement-row">
            <NPopover placement="bottom-start" trigger="click"><template #trigger><NButton size="sm">下左</NButton></template>bottom-start</NPopover>
            <NPopover placement="bottom" trigger="click"><template #trigger><NButton size="sm">下</NButton></template>bottom</NPopover>
            <NPopover placement="bottom-end" trigger="click"><template #trigger><NButton size="sm">下右</NButton></template>bottom-end</NPopover>
          </div>
        </div>
      </div>
    </DemoBlock>

    <!-- 4. 不显示箭头 -->
    <DemoBlock title="不显示箭头" description="设置 arrow 为 false 可隐藏气泡箭头。" :code="arrowCode">
      <NSpace>
        <NPopover title="有箭头" trigger="hover" placement="bottom">
          <template #trigger><NButton>有箭头</NButton></template>
          显示箭头的气泡卡片
        </NPopover>
        <NPopover title="无箭头" trigger="hover" placement="bottom" :arrow="false">
          <template #trigger><NButton variant="secondary">无箭头</NButton></template>
          不显示箭头的气泡卡片
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 5. 延迟显示/隐藏 -->
    <DemoBlock title="延迟显示/隐藏" description="设置 delay 来控制显示和隐藏的延迟时间(ms)，可传入数组分别设置 [show, hide]。" :code="delayCode">
      <NSpace>
        <NPopover title="统一延迟" trigger="hover" :delay="300" placement="bottom">
          <template #trigger><NButton>延迟 300ms</NButton></template>
          表示显示和隐藏都是 300ms 延迟
        </NPopover>
        <NPopover title="分别延迟" trigger="hover" :delay="[200, 500]" placement="bottom">
          <template #trigger><NButton variant="secondary">显示200 / 隐藏500</NButton></template>
          数组格式：[showDelay, hideDelay]
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 6. 自定义偏移距离 -->
    <DemoBlock title="自定义偏移距离" description="设置 offset 控制气泡与触发元素的距离(px)。" :code="offsetCode">
      <NSpace>
        <NPopover title="默认间距" trigger="hover" placement="right" :offset="8">
          <template #trigger><NButton>8px</NButton></template>
          默认偏移距离
        </NPopover>
        <NPopover title="较大间距" trigger="hover" placement="right" :offset="20">
          <template #trigger><NButton variant="secondary">20px</NButton></template>
          偏移 20px
        </NPopover>
        <NPopover title="紧贴" trigger="hover" placement="right" :offset="2">
          <template #trigger><NButton variant="outline">2px</NButton></template>
          几乎紧贴
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 7. 自定义宽度 -->
    <DemoBlock title="自定义宽度" description="设置 width 控制气泡卡片宽度，支持数字(px)或字符串。" :code="widthCode">
      <NSpace>
        <NPopover title="固定宽度" trigger="click" placement="bottom" :width="280">
          <template #trigger><NButton>宽度 280px</NButton></template>
          设置了固定宽度的气泡卡片，内容超出会自动换行显示。
        </NPopover>
        <NPopover title="百分比宽度" trigger="click" placement="bottom" width="30vw">
          <template #trigger><NButton variant="secondary">30vw</NButton></template>
          使用视口百分比单位设置宽度。
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 8. 带底部操作 -->
    <DemoBlock title="带底部操作" description="使用 footer 插槽添加底部操作按钮。" :code="footerCode">
      <NSpace>
        <NPopover title="确认操作" trigger="click" placement="bottom">
          <template #trigger><NButton>删除项目</NButton></template>
          确定要删除这个项目吗？此操作不可撤销。
          <template #footer>
            <NButton size="sm" @click="footerMsg = '已取消'">取消</NButton>
            <NButton size="sm" variant="danger" @click="footerMsg = '已删除'">确定</NButton>
          </template>
        </NPopover>
      </NSpace>
      <div v-if="footerMsg" style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">{{ footerMsg }}</div>
    </DemoBlock>

    <!-- 9. 自定义头部 -->
    <DemoBlock title="自定义头部" description="使用 header 插槽自定义头部内容。" :code="headerCode">
      <NSpace>
        <NPopover trigger="click" placement="bottom">
          <template #trigger><NButton>用户信息</NButton></template>
          <template #header>
            <div style="display:flex;align-items:center;gap:8px;">
              <NAvatar size="sm">U</NAvatar>
              <div>
                <div style="font-weight:600;font-size:var(--n-font-size-md);color:var(--n-color-text);">张三</div>
                <div style="font-size:var(--n-font-size-xs);color:var(--n-color-text-quaternary);">zhangsan@example.com</div>
              </div>
            </div>
          </template>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>个人中心</div>
            <div>账号设置</div>
            <div>退出登录</div>
          </div>
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 10. 禁用状态 -->
    <DemoBlock title="禁用状态" description="设置 disabled 时气泡卡片不会弹出。" :code="disabledCode">
      <NSpace>
        <NPopover title="正常" trigger="hover">
          <template #trigger><NButton>正常</NButton></template>
          可以正常弹出
        </NPopover>
        <NPopover title="禁用" trigger="hover" disabled>
          <template #trigger><NButton disabled>禁用</NButton></template>
          不会弹出
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 11. 嵌套复杂内容 -->
    <DemoBlock title="嵌套复杂内容" description="气泡卡片内可以嵌入表格、表单等复杂内容。" :code="complexCode">
      <NSpace>
        <NPopover trigger="click" placement="bottom" :width="320" title="任务详情">
          <template #trigger><NButton variant="outline">查看详情</NButton></template>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--n-color-text-tertiary);">任务名称</span>
              <span>首页重构</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--n-color-text-tertiary);">负责人</span>
              <span>李四</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--n-color-text-tertiary);">优先级</span>
              <NTag size="sm" type="warning">高</NTag>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--n-color-text-tertiary);">进度</span>
              <NProgress :percent="72" :stroke-width="6" style="width:120px;" />
            </div>
          </div>
        </NPopover>
      </NSpace>
    </DemoBlock>

    <!-- 12. 方法调用 -->
    <DemoBlock title="方法调用" description="通过 ref 调用 show / hide 方法手动控制。" :code="methodCode">
      <NSpace>
        <NPopover ref="methodPopoverRef" title="方法控制" trigger="click" placement="bottom">
          <template #trigger><NButton>目标气泡</NButton></template>
          通过下方按钮控制显隐
        </NPopover>
        <NButton variant="secondary" @click="methodPopoverRef?.show()">显示</NButton>
        <NButton variant="secondary" @click="methodPopoverRef?.hide()">隐藏</NButton>
      </NSpace>
    </DemoBlock>

    <!-- 13. 事件回调 -->
    <DemoBlock title="事件回调" description="监听 show / hide 事件。" :code="eventCode">
      <NSpace>
        <NPopover title="事件回调" trigger="click" placement="bottom" @show="onShow" @hide="onHide">
          <template #trigger><NButton>点击触发事件</NButton></template>
          切换气泡时会触发事件
        </NPopover>
      </NSpace>
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        {{ eventMsg || '暂无事件' }}
      </div>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
    <ApiTable title="Methods" :columns="methodColumns" :data="methodData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const manualVisible = ref(false)
const footerMsg = ref('')
const eventMsg = ref('')
const methodPopoverRef = ref<{ show: () => void; hide: () => void } | null>(null)

function onShow() { eventMsg.value = `show 事件触发 — ${new Date().toLocaleTimeString()}` }
function onHide() { eventMsg.value = `hide 事件触发 — ${new Date().toLocaleTimeString()}` }

const basicCode = `<NPopover title="提示" trigger="hover">
  <template #trigger>
    <NButton>悬停我</NButton>
  </template>
  这是一条气泡卡片内容。
</NPopover>`

const triggerCode = `<!-- Hover -->
<NPopover title="悬停触发" trigger="hover">
  <template #trigger><NButton>Hover</NButton></template>
  鼠标悬停触发
</NPopover>

<!-- Click -->
<NPopover title="点击触发" trigger="click">
  <template #trigger><NButton>Click</NButton></template>
  点击触发，点击外部关闭
</NPopover>

<!-- Focus -->
<NPopover title="聚焦触发" trigger="focus">
  <template #trigger><NInput placeholder="聚焦输入框" /></template>
  输入框聚焦时触发
</NPopover>

<!-- Manual -->
<NPopover v-model="manualVisible" title="手动控制" trigger="manual">
  <template #trigger><NButton @click="manualVisible = !manualVisible">手动切换</NButton></template>
  通过 v-model 手动控制
</NPopover>`

const placementCode = `<NPopover placement="top-start" trigger="click">
  <template #trigger><NButton>上左</NButton></template>
  top-start
</NPopover>
<!-- 支持 12 个位置：top / top-start / top-end / bottom / bottom-start / bottom-end / left / left-start / left-end / right / right-start / right-end -->`

const arrowCode = `<NPopover title="有箭头" trigger="hover" :arrow="true">
  <template #trigger><NButton>有箭头</NButton></template>
  显示箭头
</NPopover>

<NPopover title="无箭头" trigger="hover" :arrow="false">
  <template #trigger><NButton>无箭头</NButton></template>
  不显示箭头
</NPopover>`

const delayCode = `<!-- 统一延迟 -->
<NPopover title="统一延迟" trigger="hover" :delay="300">
  <template #trigger><NButton>延迟 300ms</NButton></template>
  显示和隐藏都是 300ms 延迟
</NPopover>

<!-- 分别延迟 -->
<NPopover title="分别延迟" trigger="hover" :delay="[200, 500]">
  <template #trigger><NButton>显示200 / 隐藏500</NButton></template>
  数组格式：[showDelay, hideDelay]
</NPopover>`

const offsetCode = `<NPopover title="默认间距" :offset="8">
  <template #trigger><NButton>8px</NButton></template>
  默认偏移距离
</NPopover>

<NPopover title="较大间距" :offset="20">
  <template #trigger><NButton>20px</NButton></template>
  偏移 20px
</NPopover>

<NPopover title="紧贴" :offset="2">
  <template #trigger><NButton>2px</NButton></template>
  几乎紧贴
</NPopover>`

const widthCode = `<NPopover title="固定宽度" :width="280">
  <template #trigger><NButton>宽度 280px</NButton></template>
  设置了固定宽度的气泡卡片。
</NPopover>

<NPopover title="百分比宽度" width="30vw">
  <template #trigger><NButton>30vw</NButton></template>
  使用视口百分比单位。
</NPopover>`

const footerCode = `<NPopover title="确认操作" trigger="click">
  <template #trigger><NButton>删除项目</NButton></template>
  确定要删除这个项目吗？
  <template #footer>
    <NButton size="sm" @click="onCancel">取消</NButton>
    <NButton size="sm" variant="danger" @click="onConfirm">确定</NButton>
  </template>
</NPopover>`

const headerCode = `<NPopover trigger="click">
  <template #trigger><NButton>用户信息</NButton></template>
  <template #header>
    <div style="display:flex;align-items:center;gap:8px;">
      <NAvatar size="sm">U</NAvatar>
      <div>
        <div style="font-weight:600;">张三</div>
        <div style="font-size:12px;color:#999;">zhangsan@example.com</div>
      </div>
    </div>
  </template>
  <div>个人中心</div>
  <div>账号设置</div>
  <div>退出登录</div>
</NPopover>`

const disabledCode = `<NPopover title="正常" trigger="hover">
  <template #trigger><NButton>正常</NButton></template>
  可以正常弹出
</NPopover>

<NPopover title="禁用" trigger="hover" disabled>
  <template #trigger><NButton disabled>禁用</NButton></template>
  不会弹出
</NPopover>`

const complexCode = `<NPopover trigger="click" :width="320" title="任务详情">
  <template #trigger><NButton variant="outline">查看详情</NButton></template>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <div style="display:flex;justify-content:space-between;">
      <span>任务名称</span><span>首页重构</span>
    </div>
    <div style="display:flex;justify-content:space-between;">
      <span>负责人</span><span>李四</span>
    </div>
    <div style="display:flex;justify-content:space-between;">
      <span>优先级</span><NTag size="sm" type="warning">高</NTag>
    </div>
    <div style="display:flex;justify-content:space-between;">
      <span>进度</span><NProgress :percent="72" :stroke-width="6" style="width:120px;" />
    </div>
  </div>
</NPopover>`

const methodCode = `<NPopover ref="popoverRef" title="方法控制" trigger="click">
  <template #trigger><NButton>目标气泡</NButton></template>
  通过按钮控制显隐
</NPopover>

<NButton @click="popoverRef?.show()">显示</NButton>
<NButton @click="popoverRef?.hide()">隐藏</NButton>`

const eventCode = `<NPopover title="事件回调" trigger="click" @show="onShow" @hide="onHide">
  <template #trigger><NButton>点击触发事件</NButton></template>
  切换气泡时会触发事件
</NPopover>`

const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]

const propData = [
  { name: 'title', type: 'string', default: '—', desc: '卡片标题' },
  { name: 'trigger', type: "'hover' | 'click' | 'focus' | 'manual'", default: "'hover'", desc: '触发方式' },
  { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", default: "'top'", desc: '弹出位置，共 12 个方位' },
  { name: 'arrow', type: 'boolean', default: 'true', desc: '是否显示箭头' },
  { name: 'offset', type: 'number', default: '8', desc: '气泡与触发元素的间距(px)' },
  { name: 'width', type: 'number | string', default: '—', desc: '气泡卡片宽度' },
  { name: 'delay', type: 'number | [number, number]', default: '—', desc: '延迟(ms)，数字统一设置，数组分别设置 [show, hide]' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'modelValue', type: 'boolean', default: '—', desc: '显隐状态，支持 v-model' },
]

const eventColumns = [
  { key: 'name', title: '事件名', code: true },
  { key: 'desc', title: '说明' },
]

const eventData = [
  { name: 'show', desc: '气泡显示时触发' },
  { name: 'hide', desc: '气泡隐藏时触发' },
  { name: 'update:modelValue', desc: '显隐状态变化时触发' },
  { name: 'update:visible', desc: '显隐状态变化时触发' },
]

const slotColumns = [
  { key: 'name', title: '插槽名', code: true },
  { key: 'desc', title: '说明' },
]

const slotData = [
  { name: 'default', desc: '气泡卡片内容' },
  { name: 'trigger', desc: '触发元素' },
  { name: 'header', desc: '自定义头部（设置后 title 不生效）' },
  { name: 'footer', desc: '底部操作区域' },
]

const methodColumns = [
  { key: 'name', title: '方法名', code: true },
  { key: 'desc', title: '说明' },
]

const methodData = [
  { name: 'show()', desc: '显示气泡' },
  { name: 'hide()', desc: '隐藏气泡' },
  { name: 'updatePos()', desc: '更新气泡位置' },
]
</script>

<style scoped>
.placement-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.placement-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
