interface DocSeoOptions {
  title: string
  description: string
  keywords?: string[]
}

export function useDocSeo(options: DocSeoOptions) {
  const siteUrl = 'https://design.nacr.cn'
  const route = useRoute()
  const fullUrl = `${siteUrl}${route.path}`
  const defaultKeywords = ['Nacr Design', 'Vue 3', 'Nuxt', '组件库', 'TypeScript']

  useSeoMeta({
    title: options.title,
    ogTitle: options.title,
    description: options.description,
    ogDescription: options.description,
    ogUrl: fullUrl,
    ogImage: 'https://design.nacr.cn/og-image.png',
    twitterCard: 'summary_large_image',
  })

  useHead({
    meta: [
      { name: 'keywords', content: [...defaultKeywords, ...(options.keywords || [])].join(', ') },
    ],
    link: [
      { rel: 'canonical', href: fullUrl },
    ],
  })
}
