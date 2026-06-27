<template>
  <div class="doc-page changelog">
    <h1>更新记录</h1>
    <p class="doc-page__desc">NacrDesign 的版本发布历史记录，每次版本更新都会在此列出变更内容。</p>

    <div class="changelog__actions">
      <a href="https://gitee.com/wuaxcn/nacr-design/releases" target="_blank" rel="noopener" class="changelog__link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.926c0 .982.796 1.778 1.778 1.778h4.452c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-2.963a.593.593 0 0 1-.593-.592v-1.482a.593.593 0 0 1 .593-.592h4.746a.592.592 0 0 1 .593.592v3.554a4 4 0 0 1-4 4H9.185a4 4 0 0 1-4-4V9.778a4 4 0 0 1 4-4h8.89z" />
        </svg>
        Gitee Releases
      </a>
      <a href="https://github.com/nacrcn/Nacr-Design/releases" target="_blank" rel="noopener" class="changelog__link">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub Releases
      </a>
    </div>

    <div v-for="log in changelogs" :key="log.version" class="changelog__item">
      <div class="changelog__header">
        <NTag type="primary" effect="dark" size="sm" round>{{ log.version }}</NTag>
        <span class="changelog__date">{{ log.date }}</span>
        <NTag v-if="log.tag" :type="log.tagType" effect="light" size="sm" round>{{ log.tag }}</NTag>
      </div>
      <div class="changelog__body">
        <div v-for="section in log.sections" :key="section.title" class="changelog__section">
          <h4>{{ section.title }}</h4>
          <ul>
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

useDocSeo({
  title: '更新记录 - Nacr Design',
  description: 'Nacr Design 版本发布历史，查看每个版本的新功能、Bug 修复和破坏性变更。',
  keywords: ['更新记录', 'Changelog', '版本历史', '发布公告'],
})

interface ChangelogSection {
  title: string
  items: string[]
}

interface Changelog {
  version: string
  date: string
  tag?: string
  tagType?: 'primary' | 'success' | 'warning' | 'danger'
  sections: ChangelogSection[]
}

const changelogs: Changelog[] = [
  {
    version: 'v0.1.11',
    date: '2026-06-27',
    tag: '最新',
    tagType: 'primary',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          'Icon 图标：新增 105+ 图标，涵盖社交互动、媒体娱乐、生活服务、用户身份、状态反馈、操作工具、通用界面、创意装饰、英文技术、文件格式等分类',
          'Icon 图标：新增 Font Class 模式支持，通过 fontClass 属性使用图标字体类名',
          'Icon 图标文档：图标展示改为分类排列，新增搜索过滤与点击复制功能',
          'llms.txt：新增 LLM 友好的 API 文档文件，支持 npm 分发与网站托管',
          'llms.txt 文档页：新增 llms.txt 介绍页面，包含访问地址与使用说明',
          'FileList 文件列表：新增组件，自动识别文件后缀展示对应图标，支持列表模式和卡片网格模式切换，支持文件选择、自定义图标映射、自定义插槽等',
          'FileList 文件列表：新增 card 大卡片模式，图片文件直接展示缩略图预览，其他类型展示大图标',
          'FileList 文件列表：删除确认交互改为使用 Modal 对话框替代浏览器原生 confirm',
          'Pagination 分页：新增 v-model:pageSize 双向绑定每页条数',
        ],
      },
      {
        title: '🐛 修复',
        items: [
          'Upload 上传：修复使用默认插槽自定义触发区域时点击无效的问题，将 click 事件从按钮移至外层触发容器',
          'Timeline 时间线：修复交替展现模式（mode=alternate）布局错误，奇数项时间在左内容在右，偶数项内容在左时间在右',
        ],
      },
    ],
  },
  {
    version: 'v0.1.8',
    date: '2026-06-24',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          'ColorPicker 颜色选择器：渐变模式全面升级，支持线性渐变 / 径向渐变切换',
          'ColorPicker 颜色选择器：线性渐变方向采用 PS 风格圆形拨盘，拖拽圆球即可调整角度，按住 Shift 以 15° 步进吸附',
          'ColorPicker 颜色选择器：渐变模式支持多色标（Color Stop），可拖拽调整位置、点击空白处添加、超出 2 个时可删除',
          'ColorPicker 颜色选择器：渐变模式每个色标提供完整 SV 面板 + Hue 条 + Alpha 条拾色器',
          'ColorPicker 颜色选择器：渐变模式输出格式为标准 CSS 渐变字符串，支持带位置百分比的 color stop 语法',
          'ColorPicker 颜色选择器：渐变编辑器面板视觉美化，圆角卡片、阴影分隔、精致色标指示器',
          'CodeEditor 代码编辑器：新增组件，支持多语言语法高亮（基于 Shiki）、行号显示、Tab 缩进 / 反缩进、自动补全括号与引号、智能缩进、文件拖拽载入、折叠、字符统计与光标位置显示',
          'OrganizationChart 组织架构图：新增组件，支持层级树形数据可视化、节点展开/折叠、自定义节点插槽、选中状态、方法调用',
          'Button 按钮：新增 outline 描边变体、link 链接变体',
          'Button 按钮：新增 round 圆角胶囊、circle 圆形图标按钮形状',
          'Button 按钮：新增 #icon / #suffix-icon 插槽，支持前后置图标',
          'Button 按钮：新增 active 激活状态属性，适用于工具栏切换场景',
          'Button 按钮：新增 htmlType 属性，支持原生 button type',
          'Descriptions 描述列表：新增 bordered 边框模式',
          'Descriptions 描述列表：新增 size 尺寸属性（sm / md / lg）',
          'Descriptions 描述列表：新增 label-placement 标签位置属性（left / top）',
          'Descriptions 描述列表：新增 vertical 垂直布局属性',
          'Dropdown 下拉菜单：文档页扩充，新增触发方式、图标菜单、分割线与禁用、危险操作、弹出位置、自定义触发元素、事件回调等演示示例',
          'Dropdown 下拉菜单：DropdownItem.label 改为可选属性，支持无 label 的分割线（divider）菜单项',
          'Tour 漫游式引导：新增组件，支持分步引导、遮罩高亮、自定义弹出位置、步骤指示器、自定义按钮文字、自定义步骤内容插槽、事件回调等',
        ],
      },

      {
        title: '🐛 修复',
        items: [
          'Popconfirm 气泡确认框：修复首次点击气泡不显示的问题，改用 visibility + 始终渲染面板 DOM 确保位置计算正确',
          'DatePicker 日期选择器：修复 type="datetime" 模式下选择日期后日历面板不显示选中激活样式的问题',
          'DatePicker 日期选择器：修复 type="datetime" 模式下面板打开时未回显已选日期高亮的问题',
          'DatePicker 日期选择器：修复 type="datetime" 模式下点击外部关闭后重新打开仍残留上次临时选择的问题',
        ],
      },
    ],
  },
  {
    version: 'v0.1.7',
    date: '2026-06-23',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          'Table 表格：文档页新增综合演示，集成固定列、固定表头、自定义标签、文字省略、行选择、分页、工具栏等功能',
          'Menu 菜单：菜单项新增 to（路由跳转）、query（路由查询参数）、href（外部链接）、target（链接目标）、onClick（自定义点击回调）属性',
          'Menu 菜单：新增 #footer 底部插槽，支持折叠状态参数',
          'Menu 菜单：文档页新增底部插槽、折叠切换等演示示例',
          'Drawer 抽屉：新增 rounded 圆角模式，开启后抽屉带圆角并与视口边缘保持间距',
          'Drawer 抽屉：新增 margin 属性，自定义圆角模式边距，默认 10',
          'Drawer 抽屉：新增 radius 属性，自定义圆角模式下圆角大小，默认 12',
        ],
      },
      {
        title: '🐛 修复',
        items: [
          'Table 表格：修复选择列（全选 checkbox）表头在固定表头（scroll.y）模式下未随表头固定的问题，选择列现正确应用 sticky 定位',
          'Table 表格：修复展开列表头在固定表头模式下未随表头固定的问题',
          'Table 表格：修复选择列与展开列在水平滚动时未固定在左侧的问题',
        ],
      },
    ],
  },
  {
    version: 'v0.1.4',
    date: '2026-06-23',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          'Menu 菜单：移除 collapsed prop，改为根据 width 自动检测折叠状态；新增 collapsedWidth 折叠宽度阈值（默认 64px）；折叠后自动启用悬浮 tooltip / 子菜单弹窗；水平模式宽度自适应为 100%',
          'Watermark 水印：新增 density 密度预设（sparse / default / dense），快速调整水印疏密；新增 density-change 事件',
          'Grid 栅格：gap 支持数组 [rowGap, colGap] 分别控制行列间距；GridItem 新增 push / pull 属性；使用 minmax(0, 1fr) 防止内容溢出',
        ],
      },
      {
        title: '🐛 修复',
        items: [
          'Menu 菜单：修复折叠后 hover 无 tooltip / 子菜单弹窗的问题（使用 Teleport 到 body，避免 overflow:hidden 裁剪）',
          'Menu 菜单：修复水平模式（horizontal）宽度只有 224px 的问题，现自动设为 100%',
          'Watermark 水印：修复全屏水印在页面滚动时仅覆盖首屏的问题，现覆盖整个文档并可随滚动始终可见',
          'Affix 固钉：修复容器内固钉（设置 target 属性）滚动后定在页面上而非容器内的问题，容器内改用 position: absolute 定位',
          'Grid 栅格：修复所有列等宽但不按预期比例分配的问题',
        ],
      },
      {
        title: '💣 破坏性变更',
        items: [
          'Menu 移除 collapsed prop，改用 width + collapsedWidth 自动检测折叠；原先 :collapsed="isCollapsed" :style="{ width: isCollapsed ? \'56px\' : \'240px\' }" 写法需替换为 :width="isCollapsed ? 56 : 240"',
        ],
      },
    ],
  },
  {
    version: 'v0.1.3',
    date: '2026-06-18',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          '新增文档站点首页设计与组件展示',
          '新增 Gitee / GitHub 仓库链接引导',
          '文档站点使用组件主题色变量统一视觉风格',
        ],
      },
      {
        title: '🐛 修复',
        items: [
          '修复 @nuxt/module-builder 版本依赖不存在导致安装失败的问题',
        ],
      },
    ],
  },
  {
    version: 'v0.1.2',
    date: '2026-06-10',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          '新增 Result 结果页组件',
          '新增 Skeleton 骨架屏组件',
          'Notification 通知组件支持自定义持续时间',
        ],
      },
      {
        title: '🐛 修复',
        items: [
          '修复 Modal 对话框在 SSR 下渲染报错',
          '修复 Table 组件排序后分页状态未重置',
        ],
      },
    ],
  },
  {
    version: 'v0.1.1',
    date: '2026-05-28',
    sections: [
      {
        title: '🚀 新特性',
        items: [
          '新增 ColorPicker 颜色选择器组件',
          '新增 Mention 提及组件',
          '新增 Transfer 穿梭框组件',
        ],
      },
      {
        title: '💣 破坏性变更',
        items: [
          'Button 组件 type 属性更名为 variant',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0',
    date: '2026-05-15',
    tag: '首个版本',
    tagType: 'success',
    sections: [
      {
        title: '🎉 发布',
        items: [
          'NacrDesign 首个公开版本发布',
          '包含 80+ 高质量 Vue 3 组件',
          '内置 ECharts 图表集成（NChart / useChart）',
          '完整的 TypeScript 类型支持',
          'Nuxt Module 方式集成，组件与 Composables 自动导入',
          'CSS 变量架构，支持主题定制',
          '内置 Markdown 编辑器与渲染组件',
        ],
      },
    ],
  },
]
</script>

<style scoped>
.changelog__actions {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.changelog__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--n-radius-lg, 8px);
  border: 1px solid var(--nd-color-border, #e5e7eb);
  color: var(--nd-color-text-secondary, #6b7280);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.changelog__link:hover {
  border-color: var(--n-color-primary, #3b82f6);
  color: var(--n-color-primary, #3b82f6);
  background: var(--n-color-primary-light, #eff6ff);
}

.changelog__item {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  background: var(--nd-color-bg, #fff);
  transition: border-color 0.2s;
}

.changelog__item:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
}

.changelog__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--nd-color-border, #e5e7eb);
}

.changelog__date {
  font-size: 13px;
  color: var(--nd-color-text-tertiary, #9ca3af);
}

.changelog__section {
  margin-bottom: 12px;
}

.changelog__section:last-child {
  margin-bottom: 0;
}

.changelog__section h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  margin-bottom: 8px;
}

.changelog__section ul {
  padding-left: 20px;
  list-style: disc;
}

.changelog__section li {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
  line-height: 1.8;
}
</style>
