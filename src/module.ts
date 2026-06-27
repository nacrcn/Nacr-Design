import {
  defineNuxtModule,
  addComponentsDir,
  addImports,
  addPlugin,
  createResolver,
} from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * 组件前缀，默认 'N'
   * 例：Button → <NButton>
   */
  prefix?: string
  /**
   * 是否全局注册所有组件，默认 true
   */
  global?: boolean
  /**
   * iconfont.cn Symbol 模式的 JS 链接
   * 在 iconfont.cn 创建项目后，选择 Symbol 模式即可获取
   * 例：'//at.alicdn.com/t/c/xxxxx.js'
   */
  iconfontUrl?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nacr-design',
    configKey: 'nacrDesign',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    prefix: 'N',
    global: true,
    iconfontUrl: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // 1. 自动注册组件
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      global: options.global,
    })

    // 2. 自动注册 composables（逐个注册，避免 index.ts 桶文件重复）
    const composables = ['useToggle', 'useLoading', 'useMessage', 'useNotification', 'useChart', 'useIconNames']
    for (const name of composables) {
      addImports({ name, from: resolve(`./runtime/composables/${name}`) })
    }

    // 3. 注册 iconfont 插件
    addPlugin(resolve('./runtime/plugins/iconfont'))

    // 4. 将内置 iconfont 资源目录注册为 Nitro 公共资源
    ;(nuxt.options as any).nitro = (nuxt.options as any).nitro || {}
    ;((nuxt.options as any).nitro.publicAssets = (nuxt.options as any).nitro.publicAssets || []).push(
      {
        baseURL: '/iconfont',
        dir: resolve('./runtime/assets/iconfont'),
      },
      {
        baseURL: '/file-icons',
        dir: resolve('./runtime/assets/file-icons'),
      },
    )

    // 5. 全局设计令牌 CSS
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css.unshift(resolve('./runtime/assets/css/variables.css'))

    // 7. 将模块配置注入运行时
    nuxt.options.runtimeConfig.public.nacrDesign = {
      prefix: options.prefix,
      iconfontUrl: options.iconfontUrl || '',
    }

    // 8. 开发模式下确保模块被转译
    nuxt.options.build.transpile.push('nacr-design')
  },
})
