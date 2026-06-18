<h1 align="center">Nacr Design</h1>

<p align="center">
  <strong>Enterprise-grade UI Component Library for Nuxt 3/4</strong>
</p>

<p align="center">
  <a href="http://design.nacr.cn/">🏠 Documentation</a> ·
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
    <img src="https://img.shields.io/badge/license-Apache--2.0%20%2B%20Commons%20Clause-blue.svg" alt="license" />
  </a>
</p>

---

## Introduction

Nacr Design is an enterprise-grade Vue 3 component library built for Nuxt 3/4, providing **80+ high-quality components**, rich composables and out-of-the-box chart capabilities to help you build modern web applications quickly.

👉 **Live Demo: [http://design.nacr.cn/](http://design.nacr.cn/)**

### Features

- **Nuxt Module** — Integrate with a single line of config, auto-import components & composables
- **80+ Components** — Covering basic, layout, navigation, data entry, data display, feedback scenarios
- **ECharts Integration** — Built-in `NChart` component + `useChart` composable, on-demand loading
- **TypeScript** — Full type inference, first-class IDE autocomplete
- **Markdown Support** — Built-in Markdown editor and rendering components
- **Theme Customization** — CSS variables + BEM naming, flexible and controllable
- **Tree-shakable** — On-demand import, optimal bundle size

---

## Installation

```bash
# npm
npm install nacr-design

# pnpm
pnpm add nacr-design

# yarn
yarn add nacr-design
```

## Quick Start

Register the module in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nacr-design'],

  // Optional configuration
  nacrDesign: {
    prefix: 'N',          // Component prefix, default 'N'
    global: true,         // Global registration, default true
    iconfontUrl: '',      // Iconfont SVG icon URL
  },
})
```

Components are auto-available, no manual import needed:

```vue
<template>
  <NButton variant="primary">Confirm</NButton>
  <NInput v-model="value" label="Name" />
  <NChart :option="chartOption" height="300" />
</template>
```

Composables are also auto-imported:

```ts
const { state, toggle } = useToggle()
const { loading, withLoading } = useLoading()
const { success, error } = useMessage()
const { info } = useNotification()
const { setOption, resize } = useChart(chartRef)
```

---

## Composables

| Function | Description |
| --- | --- |
| `useToggle` | Boolean state toggle |
| `useLoading` | Async loading state management, auto-track Promise |
| `useMessage` | Lightweight message tips (success / error / warning / info) |
| `useNotification` | Notification management |
| `useChart` | ECharts instance management, auto resize & destroy |

---

## Version Management

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and changelog.

### Add a changeset

After each meaningful change, run:

```bash
pnpm changeset
```

Follow the prompts to select the change type (patch / minor / major) and write a description.

### Publish a new version

```bash
# 1. Consume all changesets, update version numbers and generate CHANGELOG
pnpm changeset:version

# 2. Build and publish to npm
pnpm release
```

---

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build

# Build documentation site
pnpm build:docs

# Type check
pnpm typecheck
```

---

## Contributing

Issues and Pull Requests are welcome!

---

## Links

- 🏠 Documentation: [http://design.nacr.cn/](http://design.nacr.cn/)
- 📦 npm: [https://www.npmjs.com/package/nacr-design](https://www.npmjs.com/package/nacr-design)
- 🐙 Gitee: [https://gitee.com/wuaxcn/nacr-design](https://gitee.com/wuaxcn/nacr-design)
- 🐙 GitHub: [https://github.com/nacrcn/Nacr-Design](https://github.com/nacrcn/Nacr-Design)

---

## License

[Apache 2.0 + Commons Clause](./LICENSE)

This project is licensed under the Apache 2.0 License with the Commons Clause restriction: **Commercial use is allowed, but re-packaging and re-selling is prohibited**. You are free to use this library as a dependency in commercial projects, but you may not re-package, re-brand, or distribute this library or its derivative works as a standalone UI component library or design system for sale or commercial distribution.
