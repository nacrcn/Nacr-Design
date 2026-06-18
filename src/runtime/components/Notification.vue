<template>
  <teleport to="body">
    <div class="n-notification-container">
      <transition-group name="n-notification__slide">
        <div v-for="n in notifications" :key="n.id" :class="['n-notification', `n-notification--${n.type}`]">
          <span class="n-notification__icon">
            <NIcon :name="iconNames[n.type]" :size="20" />
          </span>
          <div class="n-notification__body">
            <div v-if="n.title" class="n-notification__title">{{ n.title }}</div>
            <div class="n-notification__content">{{ n.content }}</div>
          </div>
          <span class="n-notification__close" @click="remove(n.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NotificationItem {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  content: string
  duration?: number
}

const notifications = ref<NotificationItem[]>([])
let seed = 0

const iconNames: Record<string, string> = {
  info: 'tishi',
  success: 'chenggong',
  warning: 'tanhao',
  error: 'shibai',
}

function add(opts: Omit<NotificationItem, 'id'>) {
  const id = seed++
  const item: NotificationItem = { ...opts, id }
  notifications.value.push(item)
  const dur = opts.duration !== undefined ? opts.duration : 4500
  if (dur > 0) setTimeout(() => remove(id), dur)
}

function remove(id: number) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

defineExpose({ add, remove })
</script>

<style scoped>
.n-notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}
.n-notification {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--n-radius-lg);
  background: var(--n-color-bg-elevated);
  box-shadow: var(--n-shadow-lg);
  border-left: 4px solid;
  min-width: 300px;
  max-width: 420px;
  pointer-events: auto;
}
.n-notification--info { border-left-color: var(--n-color-info); }
.n-notification--success { border-left-color: var(--n-color-success); }
.n-notification--warning { border-left-color: var(--n-color-warning); }
.n-notification--error { border-left-color: var(--n-color-danger); }

.n-notification__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 1px;
}
.n-notification--info .n-notification__icon { color: var(--n-color-info); }
.n-notification--success .n-notification__icon { color: var(--n-color-success); }
.n-notification--warning .n-notification__icon { color: var(--n-color-warning); }
.n-notification--error .n-notification__icon { color: var(--n-color-danger); }

.n-notification__body { flex: 1; min-width: 0; }
.n-notification__title { font-weight: 600; font-size: var(--n-font-size-md); color: var(--n-color-text); margin-bottom: 4px; }
.n-notification__content { font-size: var(--n-font-size-sm); color: var(--n-color-text-secondary); line-height: 1.6; }

.n-notification__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: var(--n-radius-sm);
  color: var(--n-color-text-disabled);
  transition: all var(--n-transition-fast);
  margin-top: 1px;
}
.n-notification__close:hover {
  color: var(--n-color-text-secondary);
  background: rgba(0, 0, 0, 0.06);
}

.n-notification__slide-enter-active { transition: all 0.3s ease; }
.n-notification__slide-leave-active { transition: all 0.2s ease; }
.n-notification__slide-enter-from { opacity: 0; transform: translateX(100%); }
.n-notification__slide-leave-to { opacity: 0; transform: translateX(60px); }
</style>
