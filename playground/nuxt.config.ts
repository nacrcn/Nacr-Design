export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    public: {
      siteUrl: 'https://design.nacr.cn',
      siteName: 'Nacr Design',
      siteDescription: 'Nacr Design - 基于 Nuxt 3/4 的企业级 Vue 3 组件库，提供 80+ 高质量组件、ECharts 图表、TypeScript 支持、主题定制',
    },
  },

  modules: ['../src/module'],

  nacrDesign: {
    prefix: 'N',
    global: true,
    iconfontUrl: '//at.alicdn.com/t/c/font_5196910_uj9szaavkpp.js',
  },

  app: {
    head: {
      title: 'Nacr Design',
      titleTemplate: '%s - Nacr Design',
      meta: [
        { name: 'description', content: 'Nacr Design - 基于 Nuxt 3/4 的企业级 Vue 3 组件库，提供 80+ 高质量组件、ECharts 图表、TypeScript 支持、主题定制' },
        { name: 'keywords', content: 'Nacr Design, Vue 3, Nuxt 3, Nuxt 4, UI 组件库, 组件库, TypeScript, ECharts, 企业级, 开源' },
        { name: 'author', content: 'Nacr Team' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3b82f6' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Nacr Design' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:image', content: 'https://design.nacr.cn/og-image.png' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://design.nacr.cn/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://design.nacr.cn' },
      ],
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },

  css: ['~/assets/styles/global.css'],

  devServer: {
    port: 3001,
  },
})
