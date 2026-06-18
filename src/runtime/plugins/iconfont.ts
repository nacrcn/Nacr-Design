import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

/**
 * iconfont 图标插件
 *
 * - 默认加载组件库内置图标（Symbol 模式），去掉硬编码 fill 以支持 color 属性
 * - 用户可通过 nacrDesign.iconfontUrl 额外引入自定义图标
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const config = useRuntimeConfig()
  const customUrl = config.public.nacrDesign?.iconfontUrl

  // 加载内置图标（Symbol 模式 JS）
  loadIconfontSprite('/iconfont/iconfont.js')

  // 加载用户自定义的 iconfont 图标
  if (customUrl) {
    loadIconfontSprite(customUrl)
  }
})

/**
 * 加载 iconfont Symbol 模式 JS 并注入 SVG sprite
 * 自动去掉硬编码的 fill 属性，使 color / currentColor 生效
 */
async function loadIconfontSprite(url: string) {
  try {
    const res = await fetch(url)
    let text = await res.text()

    // 去掉硬编码的 fill="#000000" 等属性，让 currentColor 生效
    text = text.replace(/\s+fill\s*=\s*["'][^"']*["']/gi, '')

    // 从 JS 字符串中提取 SVG 内容
    // iconfont 生成的 JS 格式: window._iconfont_svg_string_XXXXX = '<svg>...</svg>'
    const svgMatch = text.match(/<svg[^>]*>[\s\S]*<\/svg>/i)
    if (svgMatch) {
      const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svgEl.style.display = 'none'
      svgEl.innerHTML = svgMatch[0]
      document.body.insertBefore(svgEl, document.body.firstChild)
    }
  }
  catch (e) {
    console.warn('[nacrDesign] Failed to load iconfont sprite:', url, e)
  }
}
