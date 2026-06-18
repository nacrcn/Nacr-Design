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
}

.doc-header__github:hover {
  color: #1f2937;
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
