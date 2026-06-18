import type { ModuleOptions } from './module'

export type { ModuleOptions }

// 让 Nuxt 识别 nuxt.config 中的 nacrDesign 配置项
declare module '@nuxt/schema' {
  interface NuxtConfig {
    nacrDesign?: ModuleOptions
  }
}

// 使用模块扩展的方式声明运行时配置
// Nuxt 的 auto-import 会在编译时处理，这里只是类型提示
declare module 'nuxt/app' {
  interface RuntimeConfig {
    nacrDesign: {
      prefix: string
      iconfontUrl: string
    }
  }
}
