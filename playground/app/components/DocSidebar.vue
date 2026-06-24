<template>
  <aside :class="['doc-sidebar', { 'doc-sidebar--open': sidebarOpen }]">
    <nav class="doc-sidebar__nav">
      <div v-for="group in menu" :key="group.title" class="doc-sidebar__group">
        <div class="doc-sidebar__group-title">{{ group.title }}</div>
        <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="doc-sidebar__link"
          @click="sidebarOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>
  </aside>
  <div v-if="sidebarOpen" class="doc-sidebar__overlay" @click="sidebarOpen = false" />
</template>

<script setup lang="ts">
const sidebarOpen = useState('sidebar-open', () => false)

const menu = [
  {
    title: '开发指南',
    items: [
      { label: '快速开始', path: '/docs/start' },
      { label: '介绍', path: '/docs/intro' },
      { label: '更新记录', path: '/docs/changelog' },
      { label: '开发团队', path: '/docs/team' },
      { label: '赞助支持', path: '/docs/sponsor' },
      { label: 'llms.txt', path: '/docs/llms' },
    ],
  },
  {
    title: '通用',
    items: [
      { label: 'Button 按钮', path: '/docs/button' },
      { label: 'Icon 图标', path: '/docs/icon' },
    ],
  },
  {
    title: '数据展示',
    items: [
      { label: 'Card 卡片', path: '/docs/card' },
      { label: 'Table 表格', path: '/docs/table' },
      { label: 'Avatar 头像', path: '/docs/avatar' },
      { label: 'Badge 徽标', path: '/docs/badge' },
      { label: 'Calendar 日历', path: '/docs/calendar' },
      { label: 'Carousel 走马灯', path: '/docs/carousel' },
      { label: 'Collapse 折叠面板', path: '/docs/collapse' },
      { label: 'Comment 评论', path: '/docs/comment' },
      { label: 'Descriptions 描述列表', path: '/docs/descriptions' },
      { label: 'Empty 空状态', path: '/docs/empty' },
      { label: 'Image 图片', path: '/docs/image' },
      { label: 'Popover 气泡卡片', path: '/docs/popover' },
      { label: 'Statistic 统计数值', path: '/docs/statistic' },
      { label: 'Tabs 标签页', path: '/docs/tabs' },
      { label: 'Tag 标签', path: '/docs/tag' },
      { label: 'Timeline 时间线', path: '/docs/timeline' },
      { label: 'Chart 图表', path: '/docs/chart' },
      { label: 'OrganizationChart 组织架构图', path: '/docs/organization-chart' },
    ],
  },
  {
    title: '导航',
    items: [
      { label: 'Breadcrumb 面包屑', path: '/docs/breadcrumb' },
      { label: 'Dropdown 下拉菜单', path: '/docs/dropdown' },
      { label: 'Menu 菜单', path: '/docs/menu' },
      { label: 'PageHeader 页头', path: '/docs/page-header' },
      { label: 'Pagination 分页', path: '/docs/pagination' },
      { label: 'Steps 步骤条', path: '/docs/steps' },
      { label: 'Anchor 锚点', path: '/docs/anchor' },
      { label: 'BackTop 回到顶部', path: '/docs/back-top' },
    ],
  },
  {
    title: '布局',
    items: [
      { label: 'Divider 分割线', path: '/docs/divider' },
      { label: 'Grid 栅格', path: '/docs/grid' },
      { label: 'Layout 布局', path: '/docs/layout' },
      { label: 'Space 间距', path: '/docs/space' },
      { label: 'Affix 固钉', path: '/docs/affix' },
      { label: 'Split 分割面板', path: '/docs/split' },
      { label: 'Watermark 水印', path: '/docs/watermark' },
    ],
  },
  {
    title: '反馈',
    items: [
      { label: 'Alert 警告提示', path: '/docs/alert' },
      { label: 'Drawer 抽屉', path: '/docs/drawer' },
      { label: 'Modal 对话框', path: '/docs/modal' },
      { label: 'Notification 通知提醒', path: '/docs/notification' },
      { label: 'Popconfirm 气泡确认框', path: '/docs/popconfirm' },
      { label: 'Progress 进度条', path: '/docs/progress' },
      { label: 'Result 结果页', path: '/docs/result' },
      { label: 'Spin 加载中', path: '/docs/spin' },
      { label: 'Skeleton 骨架屏', path: '/docs/skeleton' },
      { label: 'Tooltip 文字提示', path: '/docs/tooltip' },
      { label: 'Tour 漫游式引导', path: '/docs/tour' },
    ],
  },
  {
    title: '表单',
    items: [
      { label: 'Form 表单', path: '/docs/form' },
      { label: 'Input 输入框', path: '/docs/input' },
      { label: 'Textarea 文本域', path: '/docs/textarea' },
      { label: 'InputNumber 数字输入框', path: '/docs/input-number' },
      { label: 'InputTag 标签输入框', path: '/docs/input-tag' },
      { label: 'VerificationCode 验证码', path: '/docs/verification-code' },
      { label: 'Select 选择器', path: '/docs/select' },
      { label: 'Cascader 级联选择', path: '/docs/cascader' },
      { label: 'TreeSelect 树选择', path: '/docs/tree-select' },
      { label: 'Checkbox 复选框', path: '/docs/checkbox' },
      { label: 'Radio 单选框', path: '/docs/radio' },
      { label: 'Switch 开关', path: '/docs/switch' },
      { label: 'Slider 滑动输入条', path: '/docs/slider' },
      { label: 'Rate 评分', path: '/docs/rate' },
      { label: 'DatePicker 日期选择器', path: '/docs/date-picker' },
      { label: 'TimePicker 时间选择器', path: '/docs/time-picker' },
      { label: 'ColorPicker 颜色选择器', path: '/docs/color-picker' },
      { label: 'Mention 提及', path: '/docs/mention' },
      { label: 'Transfer 穿梭框', path: '/docs/transfer' },
      { label: 'Upload 上传', path: '/docs/upload' },
      { label: 'CodeEditor 代码编辑器', path: '/docs/code-editor' },
      { label: 'Markdown 编辑器 & 渲染', path: '/docs/md-editor' },
    ],
  },
  {
    title: '组合式函数',
    items: [
      { label: 'useToggle', path: '/docs/composables/use-toggle' },
      { label: 'useLoading', path: '/docs/composables/use-loading' },
      { label: 'useMessage', path: '/docs/composables/use-message' },
    ],
  },
]
</script>

<style scoped>
.doc-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 260px;
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
  overflow-y: auto;
  z-index: 90;
  transition: transform 0.3s ease;
}

.doc-sidebar__nav {
  padding: 16px 0 40px;
}

.doc-sidebar__group {
  margin-bottom: 8px;
}

.doc-sidebar__group-title {
  padding: 8px 24px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.doc-sidebar__link {
  display: block;
  padding: 8px 24px 8px 32px;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.doc-sidebar__link:hover {
  color: #3b82f6;
  background: #eff6ff;
}

.doc-sidebar__link.router-link-active {
  color: #3b82f6;
  background: #eff6ff;
  border-left-color: #3b82f6;
  font-weight: 500;
}

.doc-sidebar__overlay {
  display: none;
}

@media (max-width: 768px) {
  .doc-sidebar {
    transform: translateX(-100%);
  }

  .doc-sidebar--open {
    transform: translateX(0);
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  }

  .doc-sidebar__overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: 60px;
    background: rgba(0, 0, 0, 0.3);
    z-index: 80;
  }
}
</style>
