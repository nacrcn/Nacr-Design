<template>
  <div class="doc-page">
    <h1>Tooltip 文字提示</h1>
    <p class="doc-page__desc">简单的文字提示气泡，支持多个方向、触发方式、自定义颜色和箭头。</p>

    <DemoBlock title="基础用法" description="鼠标悬停时显示提示文字。" :code="basicCode">
      <NSpace>
        <NTooltip>
          <template #trigger>
            <NButton>悬停提示</NButton>
          </template>
          这是一段提示文字
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="不同方向" description="通过 placement 设置弹出方向，支持 12 个位置。" :code="placementCode">
      <div class="placement-grid">
        <NTooltip placement="top-start"><template #trigger><NButton size="sm">上左</NButton></template>top-start</NTooltip>
        <NTooltip placement="top"><template #trigger><NButton size="sm">上</NButton></template>top</NTooltip>
        <NTooltip placement="top-end"><template #trigger><NButton size="sm">上右</NButton></template>top-end</NTooltip>
        <NTooltip placement="left-start"><template #trigger><NButton size="sm">左上</NButton></template>left-start</NTooltip>
        <NTooltip placement="left"><template #trigger><NButton size="sm">左</NButton></template>left</NTooltip>
        <NTooltip placement="left-end"><template #trigger><NButton size="sm">左下</NButton></template>left-end</NTooltip>
        <NTooltip placement="right-start"><template #trigger><NButton size="sm">右上</NButton></template>right-start</NTooltip>
        <NTooltip placement="right"><template #trigger><NButton size="sm">右</NButton></template>right</NTooltip>
        <NTooltip placement="right-end"><template #trigger><NButton size="sm">右下</NButton></template>right-end</NTooltip>
        <NTooltip placement="bottom-start"><template #trigger><NButton size="sm">下左</NButton></template>bottom-start</NTooltip>
        <NTooltip placement="bottom"><template #trigger><NButton size="sm">下</NButton></template>bottom</NTooltip>
        <NTooltip placement="bottom-end"><template #trigger><NButton size="sm">下右</NButton></template>bottom-end</NTooltip>
      </div>
    </DemoBlock>

    <DemoBlock title="点击触发" description="设置 trigger 为 click，点击触发显示，再次点击或点击外部关闭。" :code="clickCode">
      <NSpace>
        <NTooltip trigger="click">
          <template #trigger>
            <NButton>点击提示</NButton>
          </template>
          点击外部区域关闭
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="自定义颜色" description="通过 color 设置背景色，textColor 设置文字颜色。" :code="colorCode">
      <NSpace>
        <NTooltip color="#3b82f6" textColor="#fff">
          <template #trigger><NButton type="primary">蓝色</NButton></template>
          蓝色提示
        </NTooltip>
        <NTooltip color="#10b981" textColor="#fff">
          <template #trigger><NButton>绿色</NButton></template>
          绿色提示
        </NTooltip>
        <NTooltip color="#f59e0b" textColor="#fff">
          <template #trigger><NButton>橙色</NButton></template>
          橙色提示
        </NTooltip>
        <NTooltip color="#ef4444" textColor="#fff">
          <template #trigger><NButton>红色</NButton></template>
          红色提示
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="隐藏箭头" description="设置 arrow 为 false 隐藏箭头。" :code="noArrowCode">
      <NSpace>
        <NTooltip :arrow="false">
          <template #trigger><NButton>无箭头</NButton></template>
          没有箭头的提示
        </NTooltip>
        <NTooltip placement="right" :arrow="false">
          <template #trigger><NButton>右侧无箭头</NButton></template>
          右侧提示
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="延迟显示" description="通过 show-delay 和 hide-delay 控制显示/隐藏的延迟时间（毫秒）。" :code="delayCode">
      <NSpace>
        <NTooltip :show-delay="500" :hide-delay="200">
          <template #trigger><NButton>延迟 500ms 显示</NButton></template>
          等待 500ms 后才显示
        </NTooltip>
        <NTooltip :show-delay="0" :hide-delay="1000">
          <template #trigger><NButton>延迟 1s 隐藏</NButton></template>
          鼠标移出 1s 后才隐藏
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="带图标触发" description="结合 NIcon 组件作为触发元素。" :code="iconCode">
      <NSpace>
        <NTooltip>
          <template #trigger>
            <NIcon name="sousuo" :size="20" style="cursor:pointer;color:var(--n-color-text-secondary);" />
          </template>
          搜索
        </NTooltip>
        <NTooltip>
          <template #trigger>
            <NIcon name="bangzhu" :size="20" style="cursor:pointer;color:var(--n-color-text-secondary);" />
          </template>
          帮助
        </NTooltip>
        <NTooltip>
          <template #trigger>
            <NIcon name="tishi" :size="20" style="cursor:pointer;color:var(--n-color-text-secondary);" />
          </template>
          提示信息
        </NTooltip>
        <NTooltip>
          <template #trigger>
            <NIcon name="shezhi" :size="20" style="cursor:pointer;color:var(--n-color-text-secondary);" />
          </template>
          设置
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="禁用状态" description="设置 disabled 后不显示提示。" :code="disabledCode">
      <NSpace>
        <NTooltip disabled>
          <template #trigger><NButton disabled>禁用提示</NButton></template>
          这段文字不会显示
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <DemoBlock title="偏移距离" description="通过 offset 控制提示框与触发元素的距离，默认 8px。" :code="offsetCode">
      <NSpace>
        <NTooltip :offset="4">
          <template #trigger><NButton size="sm">4px</NButton></template>
          紧凑距离
        </NTooltip>
        <NTooltip :offset="8">
          <template #trigger><NButton size="sm">8px（默认）</NButton></template>
          默认距离
        </NTooltip>
        <NTooltip :offset="20">
          <template #trigger><NButton size="sm">20px</NButton></template>
          较远距离
        </NTooltip>
      </NSpace>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

const basicCode = `<template>
  <NTooltip>
    <template #trigger>
      <NButton>悬停提示</NButton>
    </template>
    这是一段提示文字
  </NTooltip>
</template>`

const placementCode = `<template>
  <NTooltip placement="top"><template #trigger><NButton>上</NButton></template>top</NTooltip>
  <NTooltip placement="top-start"><template #trigger><NButton>上左</NButton></template>top-start</NTooltip>
  <NTooltip placement="top-end"><template #trigger><NButton>上右</NButton></template>top-end</NTooltip>
  <NTooltip placement="bottom"><template #trigger><NButton>下</NButton></template>bottom</NTooltip>
  <NTooltip placement="left"><template #trigger><NButton>左</NButton></template>left</NTooltip>
  <NTooltip placement="right"><template #trigger><NButton>右</NButton></template>right</NTooltip>
</template>`

const clickCode = `<template>
  <NTooltip trigger="click">
    <template #trigger>
      <NButton>点击提示</NButton>
    </template>
    点击外部区域关闭
  </NTooltip>
</template>`

const colorCode = `<template>
  <NSpace>
    <NTooltip color="#3b82f6" textColor="#fff">
      <template #trigger><NButton type="primary">蓝色</NButton></template>
      蓝色提示
    </NTooltip>
    <NTooltip color="#10b981" textColor="#fff">
      <template #trigger><NButton>绿色</NButton></template>
      绿色提示
    </NTooltip>
    <NTooltip color="#ef4444" textColor="#fff">
      <template #trigger><NButton>红色</NButton></template>
      红色提示
    </NTooltip>
  </NSpace>
</template>`

const noArrowCode = `<template>
  <NSpace>
    <NTooltip :arrow="false">
      <template #trigger><NButton>无箭头</NButton></template>
      没有箭头的提示
    </NTooltip>
    <NTooltip placement="right" :arrow="false">
      <template #trigger><NButton>右侧无箭头</NButton></template>
      右侧提示
    </NTooltip>
  </NSpace>
</template>`

const delayCode = `<template>
  <NSpace>
    <NTooltip :show-delay="500" :hide-delay="200">
      <template #trigger><NButton>延迟 500ms 显示</NButton></template>
      等待 500ms 后才显示
    </NTooltip>
    <NTooltip :show-delay="0" :hide-delay="1000">
      <template #trigger><NButton>延迟 1s 隐藏</NButton></template>
      鼠标移出 1s 后才隐藏
    </NTooltip>
  </NSpace>
</template>`

const iconCode = `<template>
  <NSpace>
    <NTooltip>
      <template #trigger>
        <NIcon name="sousuo" :size="20" style="cursor:pointer;" />
      </template>
      搜索
    </NTooltip>
    <NTooltip>
      <template #trigger>
        <NIcon name="bangzhu" :size="20" style="cursor:pointer;" />
      </template>
      帮助
    </NTooltip>
    <NTooltip>
      <template #trigger>
        <NIcon name="tishi" :size="20" style="cursor:pointer;" />
      </template>
      提示信息
    </NTooltip>
  </NSpace>
</template>`

const disabledCode = `<template>
  <NTooltip disabled>
    <template #trigger><NButton disabled>禁用提示</NButton></template>
    这段文字不会显示
  </NTooltip>
</template>`

const offsetCode = `<template>
  <NSpace>
    <NTooltip :offset="4">
      <template #trigger><NButton>4px</NButton></template>
      紧凑距离
    </NTooltip>
    <NTooltip :offset="16">
      <template #trigger><NButton>16px</NButton></template>
      较远距离
    </NTooltip>
  </NSpace>
</template>`

/* ---------- API Tables ---------- */

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
  { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'", default: "'top'", desc: '提示框出现的位置' },
  { name: 'trigger', type: "'hover' | 'click'", default: "'hover'", desc: '触发方式' },
  { name: 'color', type: 'string', default: '—', desc: '背景颜色' },
  { name: 'textColor', type: 'string', default: '—', desc: '文字颜色' },
  { name: 'arrow', type: 'boolean', default: 'true', desc: '是否显示箭头' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
  { name: 'showDelay', type: 'number', default: '0', desc: '显示延迟(ms)' },
  { name: 'hideDelay', type: 'number', default: '100', desc: '隐藏延迟(ms)' },
  { name: 'offset', type: 'number', default: '8', desc: '与触发元素的间距(px)' },
]

const eventData = [
  { name: 'show', type: '() => void', desc: '提示框显示时触发' },
  { name: 'hide', type: '() => void', desc: '提示框隐藏时触发' },
]

const slotData = [
  { name: 'default', desc: '提示内容' },
  { name: 'trigger', desc: '触发元素' },
]
</script>

<style scoped>
.placement-grid {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 8px;
  justify-items: center;
}
</style>
