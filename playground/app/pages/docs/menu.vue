<template>
  <div class="doc-page">
    <h1>Menu 菜单</h1>
    <p class="doc-page__desc">为页面和功能提供导航的菜单列表，支持子菜单、分组、折叠、暗色主题、手风琴模式、徽标、Logo 插槽等。</p>

    <DemoBlock title="综合示例" description="包含 Logo、徽标、子菜单、分组、折叠切换的完整侧边栏演示。" :code="fullCode">
      <div style="display:flex;gap:24px;">
        <!-- 亮色完整侧边栏 -->
        <NMenu v-model="active16" :items="fullItems" :collapsed="fullCollapsed" accordion :style="{ width: fullCollapsed ? '56px' : '240px', height: '520px' }">
          <template #logo="{ collapsed }">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;">N</span>
              <span v-if="!collapsed" style="font-weight:800;font-size:17px;letter-spacing:-0.5px;">NacrDesign</span>
            </div>
          </template>
          <template #footer="{ collapsed }">
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div v-if="!collapsed" style="display:flex;align-items:center;gap:8px;">
                <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
                <div>
                  <div style="font-size:13px;font-weight:500;">用户名</div>
                  <div style="font-size:11px;color:var(--n-color-text-secondary);">admin@example.com</div>
                </div>
              </div>
              <div v-else style="display:flex;align-items:center;justify-content:center;">
                <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
              </div>
              <div @click="fullCollapsed = !fullCollapsed" style="display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:6px 0;border-radius:6px;transition:background 0.15s;" onmouseenter="this.style.background='var(--n-color-fill-hover, rgba(0,0,0,0.04))'" onmouseleave="this.style.background='transparent'">
                <svg :style="{ transform: fullCollapsed ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                <span v-if="!collapsed" style="font-size:13px;">收起菜单</span>
              </div>
            </div>
          </template>
        </NMenu>
        <!-- 暗色完整侧边栏 -->
        <div style="border-radius:8px;overflow:hidden;">
          <NMenu v-model="active16b" :items="fullItems" :collapsed="fullCollapsedDark" accordion theme="dark" :style="{ width: fullCollapsedDark ? '56px' : '240px', height: '520px' }">
            <template #logo="{ collapsed }">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:22px;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;">N</span>
                <span v-if="!collapsed" style="font-weight:800;font-size:17px;letter-spacing:-0.5px;color:#fff;">NacrDesign</span>
              </div>
            </template>
            <template #footer="{ collapsed }">
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div v-if="!collapsed" style="display:flex;align-items:center;gap:8px;">
                  <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
                  <div>
                    <div style="font-size:13px;font-weight:500;color:rgba(255,255,255,0.9);">用户名</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.45);">admin@example.com</div>
                  </div>
                </div>
                <div v-else style="display:flex;align-items:center;justify-content:center;">
                  <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
                </div>
                <div @click="fullCollapsedDark = !fullCollapsedDark" style="display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:6px 0;border-radius:6px;transition:background 0.15s;" onmouseenter="this.style.background='var(--n-menu-hover-bg, rgba(255,255,255,0.06))'" onmouseleave="this.style.background='transparent'">
                  <svg :style="{ transform: fullCollapsedDark ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:rgba(255,255,255,0.65);"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                  <span v-if="!collapsed" style="font-size:13px;color:rgba(255,255,255,0.65);">收起菜单</span>
                </div>
              </div>
            </template>
          </NMenu>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock title="基础用法" description="通过 items 定义菜单项，v-model 绑定当前选中项。" :code="basicCode">
      <NMenu v-model="active1" :items="basicItems" style="width: 224px;" />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前选中：{{ active1 }}</div>
    </DemoBlock>

    <DemoBlock title="带 Logo" description="使用 #logo 插槽自定义顶部品牌区域，折叠时自动隐藏文字。" :code="logoCode">
      <div style="display:flex;gap:16px;">
        <NMenu v-model="active1b" :items="basicItems" style="width: 224px;">
          <template #logo="{ collapsed }">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">🚀</span>
              <span v-if="!collapsed" style="font-weight:700;font-size:16px;">NacrDesign</span>
            </div>
          </template>
        </NMenu>
        <NMenu v-model="active1b" :items="basicItems" collapsed style="width: 56px;">
          <template #logo="{ collapsed }">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">🚀</span>
              <span v-if="!collapsed" style="font-weight:700;font-size:16px;">NacrDesign</span>
            </div>
          </template>
        </NMenu>
      </div>
    </DemoBlock>

    <DemoBlock title="徽标 Badge" description="通过 badge 字段为菜单项添加徽标。" :code="badgeCode">
      <NMenu v-model="active1c" :items="badgeItems" style="width: 224px;">
        <template #logo>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🚀</span>
            <span style="font-weight:700;font-size:16px;">NacrDesign</span>
          </div>
        </template>
      </NMenu>
    </DemoBlock>

    <DemoBlock title="子菜单" description="支持 children 配置子菜单，点击展开/收起。" :code="subCode">
      <NMenu v-model="active2" :items="subItems" style="width: 224px;">
        <template #logo>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🚀</span>
            <span style="font-weight:700;font-size:16px;">NacrDesign</span>
          </div>
        </template>
      </NMenu>
    </DemoBlock>

    <DemoBlock title="菜单分组" description="通过 type: 'group' 创建菜单分组，分组标题不可选中。" :code="groupCode">
      <NMenu v-model="active3" :items="groupItems" style="width: 224px;">
        <template #logo>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🚀</span>
            <span style="font-weight:700;font-size:16px;">NacrDesign</span>
          </div>
        </template>
      </NMenu>
    </DemoBlock>

    <DemoBlock title="暗色主题" description="设置 theme 为 dark 使用暗色主题，文字自动切换为白色。" :code="darkCode">
      <div style="border-radius:8px;overflow:hidden;width:224px;">
        <NMenu v-model="active4" :items="darkItems" theme="dark">
          <template #logo>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">🌙</span>
              <span style="font-weight:700;font-size:16px;color:#fff;">Dark Admin</span>
            </div>
          </template>
        </NMenu>
      </div>
    </DemoBlock>

    <DemoBlock title="暗色主题 + 分组" description="暗色主题下菜单分组同样正确显示白色文字。" :code="darkGroupCode">
      <div style="border-radius:8px;overflow:hidden;width:224px;">
        <NMenu v-model="active4b" :items="groupItems" theme="dark" />
      </div>
    </DemoBlock>

    <DemoBlock title="手风琴模式" description="设置 accordion 后，同一时刻只有一个子菜单展开。" :code="accordionCode">
      <NMenu v-model="active5" :items="subItems" accordion style="width: 224px;" />
    </DemoBlock>

    <DemoBlock title="折叠模式" description="设置 collapsed 让菜单仅显示图标，hover 时弹出 tooltip。" :code="collapsedCode">
      <div style="display:flex;gap:16px;">
        <NMenu v-model="active6" :items="subItems" collapsed style="width: 56px;">
          <template #logo>
            <span style="font-size:20px;">🚀</span>
          </template>
        </NMenu>
        <NMenu v-model="active6" :items="subItems" style="width: 224px;">
          <template #logo>
            <span style="font-size:20px;">🚀</span>
          </template>
        </NMenu>
      </div>
    </DemoBlock>

    <DemoBlock title="水平模式" description="设置 mode 为 horizontal 水平排列，子菜单以下拉方式展开。" :code="horizontalCode">
      <NMenu v-model="active7" :items="horizontalItems" mode="horizontal">
        <template #logo>
          <span style="font-weight:700;font-size:16px;">Nacr</span>
        </template>
      </NMenu>
    </DemoBlock>

    <DemoBlock title="水平暗色模式" description="水平菜单同样支持暗色主题。" :code="horizontalDarkCode">
      <div style="border-radius:8px;overflow:visible;">
        <NMenu v-model="active7b" :items="horizontalItems" mode="horizontal" theme="dark">
          <template #logo>
            <span style="font-weight:700;font-size:16px;color:#fff;">Nacr</span>
          </template>
        </NMenu>
      </div>
    </DemoBlock>

    <DemoBlock title="默认展开" description="通过 defaultOpenKeys 设置默认展开的子菜单。" :code="defaultOpenCode">
      <NMenu v-model="active8" :items="subItems" :default-open-keys="['components']" style="width: 224px;" />
    </DemoBlock>

    <DemoBlock title="禁用菜单项" description="设置 disabled 禁用某个菜单项。" :code="disabledCode">
      <NMenu v-model="active9" :items="disabledItems" style="width: 224px;" />
    </DemoBlock>

    <DemoBlock title="不可选中" description="设置 selectable: false 使菜单项不可选中（仍可点击触发 select 事件）。" :code="selectableCode">
      <NMenu v-model="active10" :items="selectableItems" style="width: 224px;" />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">当前选中：{{ active10 }}</div>
    </DemoBlock>

    <DemoBlock title="分割线与自定义缩进" description="插入 { divider: true } 显示分割线；inlineIndent 控制缩进。" :code="dividerIndentCode">
      <NMenu v-model="active11" :items="dividerItems" :inline-indent="24" style="width: 224px;" />
    </DemoBlock>

    <DemoBlock title="底部插槽" description="使用 #footer 插槽在菜单底部添加内容。" :code="footerCode">
      <NMenu v-model="active12" :items="subItems" style="width: 224px; height: 340px;">
        <template #logo>
          <span style="font-size:20px;">🚀</span>
        </template>
        <template #footer="{ collapsed }">
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <NIcon name="shezhi" :size="16" />
            <span v-if="!collapsed">系统设置</span>
          </div>
        </template>
      </NMenu>
    </DemoBlock>

    <DemoBlock title="事件回调" description="监听 select 和 openChange 事件。" :code="eventCode">
      <NMenu v-model="active13" :items="subItems" style="width: 224px;" @select="onSelect" @open-change="onOpenChange" />
      <div style="margin-top:8px;font-size:var(--n-font-size-sm);color:var(--n-color-text-secondary);">
        select：{{ selectMsg }}<br />
        openChange：{{ openMsg }}
      </div>
    </DemoBlock>

    <DemoBlock title="受控展开" description="通过 v-model:open-keys 受控管理展开的子菜单。" :code="controlledCode">
      <NSpace style="margin-bottom:12px;">
        <NButton size="sm" @click="openKeys = ['components']">展开组件</NButton>
        <NButton size="sm" @click="openKeys = ['system']">展开系统</NButton>
        <NButton size="sm" @click="openKeys = []">全部收起</NButton>
      </NSpace>
      <NMenu v-model="active14" v-model:open-keys="openKeys" :items="subItems" style="width: 224px;" />
    </DemoBlock>

    <DemoBlock title="折叠切换" description="通过 #footer 插槽放置折叠按钮，点击即可展开/收起侧边栏。" :code="toggleCode">
      <NMenu v-model="active15" :items="subItems" :collapsed="isCollapsed" :style="{ width: isCollapsed ? '56px' : '224px' }">
        <template #logo="{ collapsed }">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🚀</span>
            <span v-if="!collapsed" style="font-weight:700;font-size:16px;">NacrDesign</span>
          </div>
        </template>
        <template #footer="{ collapsed }">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <NIcon name="shezhi" :size="16" />
              <span v-if="!collapsed">系统设置</span>
            </div>
            <div @click="isCollapsed = !isCollapsed" style="display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:6px 0;">
              <svg :style="{ transform: isCollapsed ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
              <span v-if="!collapsed" style="font-size:13px;">收起菜单</span>
            </div>
          </div>
        </template>
      </NMenu>
    </DemoBlock>

    <ApiTable title="Props" :columns="propColumns" :data="propData" />
    <ApiTable title="MenuItem 类型" :columns="typeColumns" :data="typeData" />
    <ApiTable title="Events" :columns="eventColumns" :data="eventData" />
    <ApiTable title="Slots" :columns="slotColumns" :data="slotData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ layout: 'doc' })

const active1 = ref('shouye')
const active1b = ref('shouye')
const active1c = ref('shouye')
const active2 = ref('form')
const active3 = ref('input')
const active4 = ref('shouye')
const active4b = ref('input')
const active5 = ref('data')
const active6 = ref('shouye')
const active7 = ref('shouye')
const active7b = ref('shouye')
const active8 = ref('form')
const active9 = ref('shouye')
const active10 = ref('')
const active11 = ref('shouye')
const active12 = ref('shouye')
const active13 = ref('form')
const active14 = ref('form')
const active15 = ref('shouye')
const active16 = ref('shouye')
const active16b = ref('shouye')
const isCollapsed = ref(false)
const fullCollapsed = ref(false)
const fullCollapsedDark = ref(false)
const openKeys = ref<(string | number)[]>(['components'])
const selectMsg = ref('—')
const openMsg = ref('—')

const basicItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo' },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]

const badgeItems = [
  { key: 'shouye', label: '首页', icon: 'shouye', badge: 'New' },
  { key: 'xiaoxi', label: '消息', icon: 'sousuo', badge: 3 },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]

const subItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
    { key: 'nav', label: '导航', icon: 'dingwei' },
  ]},
  { key: 'system', label: '系统', icon: 'shezhi', children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
    { key: 'role', label: '角色管理', icon: 'anquan' },
  ]},
  { key: 'wode', label: '我的', icon: 'wode' },
]

const groupItems = [
  { key: 'g1', label: '基础组件', type: 'group' as const, children: [
    { key: 'input', label: '输入框', icon: 'bianji' },
    { key: 'button', label: '按钮', icon: 'dianzan' },
    { key: 'select', label: '选择器', icon: 'xiala' },
  ]},
  { key: 'g2', label: '数据展示', type: 'group' as const, children: [
    { key: 'table', label: '表格', icon: 'shuju' },
    { key: 'tree', label: '树形控件', icon: 'zhankai' },
  ]},
  { key: 'g3', label: '导航', type: 'group' as const, children: [
    { key: 'menu', label: '菜单', icon: 'dingwei' },
    { key: 'tabs', label: '标签页', icon: 'biaoqian' },
  ]},
]

const darkItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]

const horizontalItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
    { key: 'nav', label: '导航', icon: 'dingwei' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]

const disabledItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo', disabled: true },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]

const selectableItems = [
  { key: 'home', label: '首页（可选中）', icon: 'shouye' },
  { key: 'about', label: '关于（不可选中）', icon: 'sousuo', selectable: false },
  { key: 'docs', label: '文档', icon: 'chuangzuo', children: [
    { key: 'guide', label: '指南（不可选中）', icon: 'dingwei', selectable: false },
    { key: 'api', label: 'API 参考（可选中）', icon: 'bianji' },
  ]},
]

const dividerItems = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo' },
  { divider: true },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]

function onSelect(key: string | number) { selectMsg.value = `选中 ${key}` }
function onOpenChange(keys: (string | number)[]) { openMsg.value = `展开项 [${keys.join(', ')}]` }

const fullItems = [
  { key: 'shouye', label: '首页', icon: 'shouye', badge: 'New' },
  { key: 'dashboard', label: '仪表盘', icon: 'shuju' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
    { key: 'nav', label: '导航', icon: 'dingwei', badge: 3 },
  ]},
  { divider: true },
  { key: 'g1', label: '系统管理', type: 'group' as const, children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
    { key: 'role', label: '角色管理', icon: 'anquan' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode', badge: 5 },
]

/* ---------- Demo Code ---------- */
const basicCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo' },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]
<\/script>`

const logoCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;">
    <template #logo="{ collapsed }">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚀</span>
        <span v-if="!collapsed" style="font-weight:700;font-size:16px;">NacrDesign</span>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo' },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const badgeCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;">
    <template #logo>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚀</span>
        <span style="font-weight:700;font-size:16px;">NacrDesign</span>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye', badge: 'New' },
  { key: 'xiaoxi', label: '消息', icon: 'sousuo', badge: 3 },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const subCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;">
    <template #logo>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚀</span>
        <span style="font-weight:700;font-size:16px;">NacrDesign</span>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('form')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
    { key: 'nav', label: '导航', icon: 'dingwei' },
  ]},
  { key: 'system', label: '系统', icon: 'shezhi', children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
    { key: 'role', label: '角色管理', icon: 'anquan' },
  ]},
  { key: 'wode', label: '我的', icon: 'wode' },
]
<\/script>`

const groupCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;">
    <template #logo>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚀</span>
        <span style="font-weight:700;font-size:16px;">NacrDesign</span>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('input')
const items = [
  { key: 'g1', label: '基础组件', type: 'group', children: [
    { key: 'input', label: '输入框', icon: 'bianji' },
    { key: 'button', label: '按钮', icon: 'dianzan' },
    { key: 'select', label: '选择器', icon: 'xiala' },
  ]},
  { key: 'g2', label: '数据展示', type: 'group', children: [
    { key: 'table', label: '表格', icon: 'shuju' },
    { key: 'tree', label: '树形控件', icon: 'zhankai' },
  ]},
]
<\/script>`

const darkCode = `<template>
  <div style="border-radius:8px;overflow:hidden;width:224px;">
    <NMenu v-model="active" :items="items" theme="dark">
      <template #logo>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:20px;">🌙</span>
          <span style="font-weight:700;font-size:16px;color:#fff;">Dark Admin</span>
        </div>
      </template>
    </NMenu>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]
<\/script>`

const darkGroupCode = `<template>
  <div style="border-radius: 8px; overflow: hidden; width: 224px;">
    <NMenu v-model="active" :items="items" theme="dark" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('input')
const items = [
  { key: 'g1', label: '基础组件', type: 'group', children: [
    { key: 'input', label: '输入框', icon: 'bianji' },
    { key: 'button', label: '按钮', icon: 'dianzan' },
  ]},
  { key: 'g2', label: '数据展示', type: 'group', children: [
    { key: 'table', label: '表格', icon: 'shuju' },
  ]},
]
<\/script>`

const accordionCode = `<template>
  <NMenu v-model="active" :items="items" accordion style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('data')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
  { key: 'system', label: '系统', icon: 'shezhi', children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
  ]},
]
<\/script>`

const collapsedCode = `<template>
  <div style="display: flex; gap: 16px;">
    <NMenu v-model="active" :items="items" collapsed style="width: 56px;" />
    <NMenu v-model="active" :items="items" style="width: 224px;" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const horizontalCode = `<template>
  <NMenu v-model="active" :items="items" mode="horizontal">
    <template #logo>
      <span style="font-weight:700;font-size:16px;">Nacr</span>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]
<\/script>`

const horizontalDarkCode = `<template>
  <div style="border-radius: 8px; overflow: visible;">
    <NMenu v-model="active" :items="items" mode="horizontal" theme="dark">
      <template #logo>
        <span style="font-weight:700;font-size:16px;color:#fff;">Nacr</span>
      </template>
    </NMenu>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const defaultOpenCode = `<template>
  <NMenu v-model="active" :items="items" :default-open-keys="['components']" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('form')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
]
<\/script>`

const disabledCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo', disabled: true },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const selectableCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('home')
const items = [
  { key: 'home', label: '首页（可选中）', icon: 'shouye' },
  { key: 'about', label: '关于（不可选中）', icon: 'sousuo', selectable: false },
  { key: 'docs', label: '文档', icon: 'chuangzuo', children: [
    { key: 'guide', label: '指南（不可选中）', icon: 'dingwei', selectable: false },
    { key: 'api', label: 'API 参考（可选中）', icon: 'bianji' },
  ]},
]
<\/script>`

const dividerIndentCode = `<template>
  <NMenu v-model="active" :items="items" :inline-indent="24" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'sousuo', label: '搜索', icon: 'sousuo' },
  { divider: true },
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode' },
]
<\/script>`

const footerCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px; height: 340px;">
    <template #logo>
      <span style="font-size:20px;">🚀</span>
    </template>
    <template #footer="{ collapsed }">
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <NIcon name="shezhi" :size="16" />
        <span v-if="!collapsed">系统设置</span>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const eventCode = `<template>
  <NMenu v-model="active" :items="items" style="width: 224px;" @select="onSelect" @open-change="onOpenChange" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('form')
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
  ]},
]
function onSelect(key: string | number) { console.log('选中', key) }
function onOpenChange(keys: (string | number)[]) { console.log('展开项', keys) }
<\/script>`

const controlledCode = `<template>
  <NSpace style="margin-bottom: 12px;">
    <NButton size="sm" @click="openKeys = ['components']">展开组件</NButton>
    <NButton size="sm" @click="openKeys = ['system']">展开系统</NButton>
    <NButton size="sm" @click="openKeys = []">全部收起</NButton>
  </NSpace>
  <NMenu v-model="active" v-model:open-keys="openKeys" :items="items" style="width: 224px;" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('form')
const openKeys = ref<(string | number)[]>(['components'])
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
  ]},
  { key: 'system', label: '系统', icon: 'shezhi', children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
  ]},
]
<\/script>`

const toggleCode = `<template>
  <NMenu v-model="active" :items="items" :collapsed="collapsed" :style="{ width: collapsed ? '56px' : '224px' }">
    <template #logo="{ collapsed }">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚀</span>
        <span v-if="!collapsed" style="font-weight:700;font-size:16px;">NacrDesign</span>
      </div>
    </template>
    <template #footer="{ collapsed }">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <NIcon name="shezhi" :size="16" />
          <span v-if="!collapsed">系统设置</span>
        </div>
        <div @click="collapsed = !collapsed" style="display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:6px 0;">
          <svg :style="{ transform: collapsed ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
          <span v-if="!collapsed" style="font-size:13px;">收起菜单</span>
        </div>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const collapsed = ref(false)
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
]
<\/script>`

const fullCode = `<template>
  <NMenu v-model="active" :items="items" :collapsed="collapsed" accordion :style="{ width: collapsed ? '56px' : '240px', height: '520px' }">
    <template #logo="{ collapsed }">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:22px;font-weight:800;">N</span>
        <span v-if="!collapsed" style="font-weight:800;font-size:17px;">NacrDesign</span>
      </div>
    </template>
    <template #footer="{ collapsed }">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div v-if="!collapsed" style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
          <div>
            <div style="font-size:13px;font-weight:500;">用户名</div>
            <div style="font-size:11px;color:var(--n-color-text-secondary);">admin@example.com</div>
          </div>
        </div>
        <div v-else style="display:flex;align-items:center;justify-content:center;">
          <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600;">U</div>
        </div>
        <div @click="collapsed = !collapsed" style="display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:6px 0;">
          <svg :style="{ transform: collapsed ? 'rotate(180deg)' : '', transition: 'transform 0.25s' }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
          <span v-if="!collapsed" style="font-size:13px;">收起菜单</span>
        </div>
      </div>
    </template>
  </NMenu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active = ref('shouye')
const collapsed = ref(false)
const items = [
  { key: 'shouye', label: '首页', icon: 'shouye', badge: 'New' },
  { key: 'dashboard', label: '仪表盘', icon: 'shuju' },
  { key: 'components', label: '组件', icon: 'chuangzuo', children: [
    { key: 'form', label: '表单', icon: 'bianji' },
    { key: 'data', label: '数据展示', icon: 'shuju' },
    { key: 'nav', label: '导航', icon: 'dingwei', badge: 3 },
  ]},
  { divider: true },
  { key: 'g1', label: '系统管理', type: 'group', children: [
    { key: 'user', label: '用户管理', icon: 'huiyuan' },
    { key: 'role', label: '角色管理', icon: 'anquan' },
  ]},
  { key: 'shezhi', label: '设置', icon: 'shezhi' },
  { key: 'wode', label: '我的', icon: 'wode', badge: 5 },
]
<\/script>`

/* ---------- API Tables ---------- */
const propColumns = [
  { key: 'name', title: '参数', code: true },
  { key: 'type', title: '类型', code: true },
  { key: 'default', title: '默认值', code: true },
  { key: 'desc', title: '说明' },
]
const typeColumns = [
  { key: 'name', title: '属性', code: true },
  { key: 'type', title: '类型', code: true },
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
  { name: 'modelValue', type: 'string | number', default: '—', desc: '当前选中项 key（v-model）' },
  { name: 'items', type: 'MenuItem[]', default: '—', desc: '菜单项数据（必填）' },
  { name: 'mode', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: '菜单模式' },
  { name: 'theme', type: "'light' | 'dark'", default: "'light'", desc: '主题风格' },
  { name: 'collapsed', type: 'boolean', default: 'false', desc: '是否折叠（仅垂直模式）' },
  { name: 'accordion', type: 'boolean', default: 'false', desc: '手风琴模式' },
  { name: 'defaultOpenKeys', type: '(string | number)[]', default: '[]', desc: '默认展开子菜单（非受控）' },
  { name: 'openKeys', type: '(string | number)[]', default: '—', desc: '受控展开子菜单（v-model:open-keys）' },
  { name: 'inlineIndent', type: 'number', default: '16', desc: '菜单项缩进（px）' },
  { name: 'popupClassName', type: 'string', default: "''", desc: '水平模式下弹出菜单自定义类名' },
  { name: 'width', type: 'string | number', default: '—', desc: '菜单宽度' },
]
const typeData = [
  { name: 'key', type: 'string | number', desc: '唯一标识' },
  { name: 'label', type: 'string', desc: '标题' },
  { name: 'icon', type: 'string', desc: '图标名称' },
  { name: 'disabled', type: 'boolean', desc: '是否禁用' },
  { name: 'divider', type: 'boolean', desc: '是否为分割线' },
  { name: 'selectable', type: 'boolean', desc: '是否可选中，默认 true' },
  { name: 'type', type: "'group'", desc: '设为 "group" 创建分组' },
  { name: 'badge', type: 'string | number', desc: '徽标内容' },
  { name: 'children', type: 'MenuItem[]', desc: '子菜单或分组子项' },
]
const eventData = [
  { name: 'update:modelValue', type: '(key: string | number) => void', desc: '选中项变化' },
  { name: 'select', type: '(key: string | number, item: MenuItem) => void', desc: '选择菜单项' },
  { name: 'update:openKeys', type: '(keys: (string|number)[]) => void', desc: '展开变化' },
  { name: 'openChange', type: '(keys: (string|number)[]) => void', desc: '展开变化' },
]
const slotData = [
  { name: 'logo', desc: '顶部品牌/Logo 区域，参数 { collapsed }' },
  { name: 'footer', desc: '菜单底部区域，参数 { collapsed }，常用于折叠按钮或用户信息' },
]
</script>
