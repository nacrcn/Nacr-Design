<template>
  <header class="doc-header">
    <div class="doc-header__left">
      <button class="doc-header__menu-btn" @click="sidebarOpen = !sidebarOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <NuxtLink to="/" class="doc-header__logo">
        <span class="doc-header__logo-icon">N</span>
        <span class="doc-header__logo-text">NacrDesign</span>
      </NuxtLink>
    </div>

    <div class="doc-header__center">
      <div class="doc-header__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>搜索组件...</span>
        <kbd>⌘K</kbd>
      </div>
    </div>

    <div class="doc-header__right">
      <nav class="doc-header__nav">
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/docs/start">开发指南</NuxtLink>
        <NuxtLink to="/docs/button">组件</NuxtLink>
      </nav>
      <a href="https://github.com/nacrcn/Nacr-Design" target="_blank" rel="noopener" class="doc-header__gitee" title="GitHub">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      </a>
      <a href="https://gitee.com/wuaxcn/nacr-design" target="_blank" rel="noopener" class="doc-header__gitee" title="Gitee">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.926c0 .982.796 1.778 1.778 1.778h4.452c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-2.963a.593.593 0 0 1-.593-.592v-1.482a.593.593 0 0 1 .593-.592h4.746a.592.592 0 0 1 .593.592v3.554a4 4 0 0 1-4 4H9.185a4 4 0 0 1-4-4V9.778a4 4 0 0 1 4-4h8.89z"/></svg>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebarOpen = useState('sidebar-open', () => false)
</script>

<style scoped>
.doc-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.92);
}

.doc-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doc-header__menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #1f2937;
  padding: 4px;
}

.doc-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f2937;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
}

.doc-header__logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: #fff;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 800;
}

.doc-header__center {
  flex: 1;
  max-width: 320px;
  margin: 0 24px;
}

.doc-header__search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.doc-header__search:hover {
  border-color: #3b82f6;
}

.doc-header__search kbd {
  margin-left: auto;
  padding: 1px 6px;
  font-size: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: monospace;
}

.doc-header__right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.doc-header__nav {
  display: flex;
  gap: 20px;
}

.doc-header__nav a {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.doc-header__nav a:hover,
.doc-header__nav a.router-link-active {
  color: #3b82f6;
}

.doc-header__github {
  color: #6b7280;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.doc-header__github:hover {
  color: #1f2937;
}

.doc-header__gitee {
  color: #6b7280;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.doc-header__gitee:hover {
  color: var(--n-color-primary, #3b82f6);
}

@media (max-width: 768px) {
  .doc-header__menu-btn {
    display: flex;
  }

  .doc-header__center,
  .doc-header__nav {
    display: none;
  }
}
</style>
