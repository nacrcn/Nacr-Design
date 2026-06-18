/**
 * useMessage — 轻量消息提示 composable
 * 结合插件注入的全局容器使用
 */
export function useMessage() {
  const nuxtApp = useNuxtApp()
  const messages = useState<MessageItem[]>('n-messages', () => [])

  interface MessageItem {
    id: number
    text: string
    type: 'info' | 'success' | 'warning' | 'error'
  }

  let _id = 0

  function show(text: string, type: MessageItem['type'] = 'info', duration = 3000) {
    const id = ++_id
    messages.value.push({ id, text, type })
    setTimeout(() => {
      messages.value = messages.value.filter(m => m.id !== id)
    }, duration)
  }

  return {
    messages,
    info: (text: string, duration?: number) => show(text, 'info', duration),
    success: (text: string, duration?: number) => show(text, 'success', duration),
    warning: (text: string, duration?: number) => show(text, 'warning', duration),
    error: (text: string, duration?: number) => show(text, 'error', duration),
  }
}
