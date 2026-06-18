import { createApp, h } from 'vue'
import Notification from '../components/Notification.vue'
import type { App } from 'vue'

type NotifyType = 'info' | 'success' | 'warning' | 'error'

interface NotifyOptions {
  type?: NotifyType
  title?: string
  content: string
  duration?: number
}

let instance: any = null
let app: App | null = null

function getInstance() {
  if (!instance) {
    const div = document.createElement('div')
    document.body.appendChild(div)
    app = createApp(Notification)
    instance = app.mount(div)
  }
  return instance
}

export function useNotification() {
  function notify(opts: NotifyOptions | string) {
    const o: NotifyOptions = typeof opts === 'string' ? { content: opts } : opts
    getInstance().add({ type: 'info', ...o })
  }
  notify.info = (opts: NotifyOptions | string) => {
    const o = typeof opts === 'string' ? { content: opts } : opts
    getInstance().add({ type: 'info', ...o })
  }
  notify.success = (opts: NotifyOptions | string) => {
    const o = typeof opts === 'string' ? { content: opts } : opts
    getInstance().add({ type: 'success', ...o })
  }
  notify.warning = (opts: NotifyOptions | string) => {
    const o = typeof opts === 'string' ? { content: opts } : opts
    getInstance().add({ type: 'warning', ...o })
  }
  notify.error = (opts: NotifyOptions | string) => {
    const o = typeof opts === 'string' ? { content: opts } : opts
    getInstance().add({ type: 'error', ...o })
  }
  return { notify }
}
