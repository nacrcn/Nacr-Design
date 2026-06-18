export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    public: {
      siteUrl: 'https://design.nacr.cn',
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
      title: 'NacrDesign',
      meta: [
        { name: 'description', content: 'NacrDesign - A Vue 3 UI Component Library for Nuxt' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  css: ['~/assets/styles/global.css'],

  devServer: {
    port: 3001,
  },
})
