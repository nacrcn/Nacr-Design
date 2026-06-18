<template>
  <div class="doc-page intro">
    <h1>关于 NacrDesign</h1>
    <p class="doc-page__desc">面向企业级场景的 Nuxt 3/4 Vue 组件库，让开发更高效、体验更一致。</p>

    <div class="intro__banner">
      <div class="intro__banner-bg" />
      <div class="intro__banner-content">
        <h2>Nacr Design</h2>
        <p>简洁 · 专业 · 开箱即用</p>
      </div>
    </div>

    <h2>设计理念</h2>
    <p>NacrDesign 的核心设计目标是<b>降低企业级应用的开发成本</b>，同时提供一致、高质量的交互体验。我们坚信组件库应该：</p>


    <h2>技术栈</h2>
    <div class="intro__tech-list">
      <div class="intro__tech">
        <span class="intro__tech-name">Vue 3</span>
        <span class="intro__tech-desc">Composition API &amp; Script Setup</span>
      </div>
      <div class="intro__tech">
        <span class="intro__tech-name">Nuxt 3/4</span>
        <span class="intro__tech-desc">Module 自动集成 &amp; SSR</span>
      </div>
      <div class="intro__tech">
        <span class="intro__tech-name">TypeScript</span>
        <span class="intro__tech-desc">完整类型推导与自动补全</span>
      </div>
      <div class="intro__tech">
        <span class="intro__tech-name">ECharts</span>
        <span class="intro__tech-desc">内置图表组件按需加载</span>
      </div>
      <div class="intro__tech">
        <span class="intro__tech-name">CSS Variables</span>
        <span class="intro__tech-desc">主题定制零预处理依赖</span>
      </div>
      <div class="intro__tech">
        <span class="intro__tech-name">Iconfont</span>
        <span class="intro__tech-desc">Symbol 模式自定义图标</span>
      </div>
    </div>

    <h2>联系我们</h2>
    <div class="intro__contact-list">
      <div class="intro__contact">
        <div class="intro__contact-icon" style="background: linear-gradient(135deg, var(--n-color-primary, #3b82f6), var(--n-color-primary-active, #1d4ed8))">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="intro__contact-info">
          <span class="intro__contact-label">QQ</span>
          <span class="intro__contact-value">21089086</span>
        </div>
      </div>
      <div class="intro__contact">
        <div class="intro__contact-icon" style="background: linear-gradient(135deg, var(--n-color-success, #22c55e), #059669)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <div class="intro__contact-info">
          <span class="intro__contact-label">微信</span>
          <span class="intro__contact-value">rsrx9595</span>
        </div>
      </div>
    </div>

    <h2>开源协议</h2>
    <p>NacrDesign 基于 <b>MIT</b> 协议开源，你可以自由地在个人或商业项目中使用、修改和分发。</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })
</script>

<style scoped>
.intro__banner {
  position: relative;
  border-radius: var(--n-radius-xl, 12px);
  overflow: hidden;
  padding: 48px 32px;
  margin-bottom: 36px;
  text-align: center;
}

.intro__banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  z-index: 0;
}

.intro__banner-content {
  position: relative;
  z-index: 1;
}

.intro__banner-content h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #93c5fd, var(--n-color-primary, #3b82f6), var(--n-color-success, #22c55e));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  border: none;
  padding: 0;
}

.intro__banner-content p {
  font-size: 16px;
  color: #94a3b8;
}

.intro__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.intro__card {
  padding: 22px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  transition: all 0.2s;
}

.intro__card:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.06);
}

.intro__card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--n-radius-xl, 12px);
  margin-bottom: 12px;
}

.intro__card h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  margin-bottom: 6px;
}

.intro__card p {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
  line-height: 1.7;
}

.intro__tech-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 36px;
}

.intro__tech {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-lg, 8px);
  transition: border-color 0.2s;
}

.intro__tech:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
}

.intro__tech-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--n-color-primary, #3b82f6);
  white-space: nowrap;
}

.intro__tech-desc {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
}

.intro__contact-list {
  display: flex;
  gap: 16px;
  margin-bottom: 36px;
}

.intro__contact {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  transition: all 0.2s;
}

.intro__contact:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.06);
}

.intro__contact-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--n-radius-xl, 12px);
  flex-shrink: 0;
}

.intro__contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.intro__contact-label {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
}

.intro__contact-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .intro__grid {
    grid-template-columns: 1fr;
  }
  .intro__contact-list {
    flex-direction: column;
  }
}
</style>
