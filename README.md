<h1 align="center">Nacr Design</h1>

<p align="center">
  <strong>基于 Nuxt 3/4 的企业级 UI 组件库</strong>
</p>

<p align="center">
  <a href="http://design.nacr.cn/">🏠 官网文档</a> ·
  <a href="https://npmjs.com/package/nacr-design">
    <img src="https://img.shields.io/npm/v/nacr-design.svg" alt="npm version" />
  </a>
  <a href="https://npmjs.com/package/nacr-design">
    <img src="https://img.shields.io/npm/dm/nacr-design.svg" alt="npm downloads" />
  </a>
  <a href="https://gitee.com/wuaxcn/nacr-design">
    <img src="https://img.shields.io/badge/Gitee-wuaxcn%2Fnacr--design-C71D23?logo=gitee" alt="Gitee" />
  </a>
  <a href="https://github.com/nacrcn/Nacr-Design">
    <img src="https://img.shields.io/badge/GitHub-nacrcn%2FNacr--Design-181717?logo=github" alt="GitHub" />
  </a>
  <a href="https://github.com/nacrcn/Nacr-Design/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" />
  </a>
</p>

---

## 介绍

Nacr Design 是一套为 Nuxt 3/4 打造的企业级 Vue 3 组件库，提供 **80+ 高质量组件**、丰富的组合式函数和开箱即用的图表能力，助你快速搭建现代化 Web 应用。

👉 **在线体验：[http://design.nacr.cn/](http://design.nacr.cn/)**

### 特性

- **Nuxt Module** — 一行配置即可集成，组件和 Composables 自动导入
- **80+ 组件** — 涵盖基础、布局、导航、数据录入、数据展示、反馈等场景
- **ECharts 图表** — 内置 `NChart` 组件 + `useChart` 组合式函数，按需加载
- **TypeScript** — 完整类型推导，开发体验一流
- **Markdown 支持** — 内置 Markdown 编辑器与渲染组件
- **主题定制** — CSS 变量 + BEM 命名，灵活可控
- **Tree-shakable** — 按需导入，包体积最优

---

## 安装

```bash
# npm
npm install nacr-design

# pnpm
pnpm add nacr-design

# yarn
yarn add nacr-design
```

## 快速开始

在 `nuxt.config.ts` 中注册模块：

```ts
export default defineNuxtConfig({
  modules: ['nacr-design'],

  // 可选配置
  nacrDesign: {
    prefix: 'N',          // 组件前缀，默认 'N'
    global: true,         // 全局注册，默认 true
    iconfontUrl: '',      // Iconfont 图标链接
  },
})
```

组件自动可用，无需手动 import：

```vue
<template>
  <NButton variant="primary">确定</NButton>
  <NInput v-model="value" label="名称" />
  <NChart :option="chartOption" height="300" />
</template>
```

Composables 也自动导入：

```ts
const { state, toggle } = useToggle()
const { loading, withLoading } = useLoading()
const { success, error } = useMessage()
const { info } = useNotification()
const { setOption, resize } = useChart(chartRef)
```

---

## 组件一览

> 📖 完整文档及在线示例请访问 [http://design.nacr.cn/](http://design.nacr.cn/)

### 🎨 基础

| 组件 | 说明 |
| --- | --- |
| **Button** | 按钮组件，支持 primary / secondary / danger / ghost 等变体，支持 loading、disabled、图标等 |
| **Icon** | 图标组件，支持 Iconfont SVG 图标与自定义图标，按需加载 |
| **Divider** | 分割线，支持水平/垂直方向、文案居中 |
| **Space** | 间距组件，快速控制元素间距与换行 |
| **Grid / GridItem** | 24 栅格系统，支持响应式断点与 flex 布局 |
| **Layout** | 页面布局容器，支持 Header / Sider / Content / Footer 组合 |

### ✏️ 数据录入

| 组件 | 说明 |
| --- | --- |
| **Input** | 输入框，支持前后缀、清除、密码模式、错误提示 |
| **Textarea** | 多行文本域，支持自动高度、字数限制 |
| **InputNumber** | 数字输入框，支持步进器、精度、格式化 |
| **InputTag** | 标签输入框，回车生成标签，支持拖拽排序 |
| **Select** | 选择器，支持搜索、多选、分组、远程加载、虚拟滚动 |
| **Cascader** | 级联选择，支持多选、搜索、异步加载 |
| **TreeSelect** | 树形选择器，支持搜索、多选、勾选策略 |
| **Checkbox / CheckboxGroup** | 复选框与复选框组，支持全选、不确定状态 |
| **Radio / RadioGroup** | 单选框与单选框组，支持按钮样式 |
| **Switch** | 开关，支持文案、加载态、自定义颜色 |
| **Slider** | 滑动条，支持范围选择、标记点 |
| **Rate** | 评分组件，支持半星、自定义图标、只读 |
| **DatePicker** | 日期选择器，支持日期/月份/年份/范围选择 |
| **TimePicker** | 时间选择器，支持范围选择 |
| **ColorPicker** | 颜色选择器，支持多种格式输出 |
| **Upload** | 上传组件，支持拖拽、粘贴、图片裁剪、批量上传 |
| **Mention** | 提及组件，@ 触发下拉选择 |
| **VerificationCode** | 验证码输入框，自动聚焦跳转 |
| **Form / FormItem** | 表单与表单项，支持规则校验、布局模式、联动 |

### 📊 数据展示

| 组件 | 说明 |
| --- | --- |
| **Table** | 表格组件，支持排序、筛选、分页、固定列/头、可展开行、树形数据、虚拟滚动 |
| **Tag** | 标签，支持多种类型色、可关闭、圆角、实心/描边/朴素风格 |
| **Badge** | 徽标数字，支持小红点、自定义数值、独立使用 |
| **Avatar / AvatarGroup** | 头像与头像组，支持形状、状态指示、文字头像 |
| **Card** | 卡片，支持阴影、悬浮效果、头部/底部插槽 |
| **Collapse** | 折叠面板，支持手风琴模式、嵌套 |
| **Carousel** | 走马灯/轮播，支持自动播放、指示器、淡入淡出 |
| **Tabs / TabsPanel** | 标签页，支持卡片/线型样式、滚动、拖拽排序 |
| **Timeline** | 时间线，支持自定义节点、左右交替 |
| **Descriptions** | 描述列表，支持多列排列、边框模式 |
| **Statistic** | 统计数值，支持前缀后缀、趋势箭头、动画 |
| **Empty** | 空状态占位，支持自定义插图 |
| **Skeleton** | 骨架屏，支持多种占位形状组合 |
| **Image** | 图片，支持预览、懒加载 |
| **Comment** | 评论组件，支持嵌套回复 |
| **Calendar** | 日历，支持日期选择、事件标记 |
| **Chart** | ECharts 图表容器，内置自适应与按需加载 |
| **Popover** | 气泡卡片，支持多种触发方式 |
| **Tooltip** | 文字提示，轻量 hover 信息展示 |

### 🧭 导航

| 组件 | 说明 |
| --- | --- |
| **Menu** | 导航菜单，支持垂直/水平模式、折叠、多级子菜单 |
| **Breadcrumb** | 面包屑，支持路由自动生成、分隔符自定义 |
| **Steps** | 步骤条，支持导航/描述/图标状态 |
| **Anchor** | 锚点导航，滚动定位 |
| **Dropdown** | 下拉菜单，支持分组、快捷键 |
| **PageHeader** | 页头，支持面包屑、操作区 |
| **Pagination** | 分页，支持页码跳转、每页条数选择、简洁模式 |
| **Affix** | 固钉，滚动到阈值后固定定位 |
| **BackTop** | 回到顶部，平滑滚动 |

### 💬 反馈

| 组件 | 说明 |
| --- | --- |
| **Alert** | 警告提示，支持多种类型、可关闭、图标 |
| **Modal** | 对话框，支持确认/自定义/全屏模式、拖拽 |
| **Drawer** | 抽屉，支持多方向、多层嵌套 |
| **Notification** | 通知提醒框，可配置位置与自动关闭 |
| **Popconfirm** | 气泡确认框，轻量级操作确认 |
| **Progress** | 进度条，支持线形/圆形/仪表盘样式 |
| **Result** | 结果页，支持成功/错误/信息/警告状态 |
| **Spin** | 加载中旋转指示器 |
| **Skeleton** | 骨架屏加载占位 |

### 📐 布局

| 组件 | 说明 |
| --- | --- |
| **Layout** | 页面整体布局容器 |
| **LayoutHeader** | 头部区域 |
| **LayoutSider** | 侧边栏区域，支持折叠 |
| **LayoutContent** | 内容区域 |
| **LayoutFooter** | 底部区域 |
| **Grid / GridItem** | 24 栅格布局 |
| **Space** | 间距布局 |
| **Split** | 分割面板，支持拖拽调整比例 |
| **OverflowList** | 溢出列表，自动收纳溢出项 |

### 📝 其他

| 组件 | 说明 |
| --- | --- |
| **ConfigProvider** | 全局配置组件，统一设置组件默认行为 |
| **Watermark** | 水印组件，支持文字/图片水印 |
| **Trigger** | 触发器，精准控制弹出层定位 |
| **MdEditor** | Markdown 编辑器，支持实时预览与工具栏 |
| **MdRender** | Markdown 渲染器，支持代码高亮 |
| **Transfer** | 穿梭框，支持搜索与自定义渲染 |

---

## 组合式函数（Composables）

| 函数 | 说明 |
| --- | --- |
| `useToggle` | 布尔状态切换 |
| `useLoading` | 异步加载状态管理，自动追踪 Promise |
| `useMessage` | 轻量级消息提示（success / error / warning / info） |
| `useNotification` | 通知提醒管理 |
| `useChart` | ECharts 图表实例管理，自动 resize 与销毁 |

---

## 版本管理

本项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和 Changelog。

### 添加变更记录

每次有意义的改动后，运行：

```bash
pnpm changeset
```

按提示选择变更类型（patch / minor / major）并填写描述。

### 发布新版本

```bash
# 1. 消费所有 changeset，更新版本号并生成 CHANGELOG
pnpm changeset:version

# 2. 构建并发布到 npm
pnpm release
```

---

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 构建文档站
pnpm build:docs

# 类型检查
pnpm typecheck
```

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 链接

- 🏠 官网文档：[http://design.nacr.cn/](http://design.nacr.cn/)
- 📦 npm 包：[https://www.npmjs.com/package/nacr-design](https://www.npmjs.com/package/nacr-design)
- 🐙 Gitee：[https://gitee.com/wuaxcn/nacr-design](https://gitee.com/wuaxcn/nacr-design)
- 🐙 GitHub：[https://github.com/nacrcn/Nacr-Design](https://github.com/nacrcn/Nacr-Design)

---

## 许可

[MIT](./LICENSE)
