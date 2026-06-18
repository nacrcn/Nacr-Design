/**
 * useLoading — 异步加载状态管理
 */
export function useLoading(initial = false) {
  const loading = ref(initial)

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }

  return { loading: readonly(loading), withLoading }
}
