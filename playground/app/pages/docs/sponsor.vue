<template>
  <div class="doc-page sponsor">
    <h1>赞助支持</h1>
    <p class="doc-page__desc">NacrDesign 是开源免费项目，你的赞助将帮助我们持续维护和改进。</p>

    <!-- 赞助商列表 -->
    <h2>赞助商</h2>
    <p class="sponsor__tip">感谢以下赞助商对 NacrDesign 的支持，如果你也想成为赞助商，请通过下方方式联系我们。</p>
    <div class="sponsor__ad-grid" v-if="sponsors.length">
      <a v-for="s in sponsors" :key="s.name" :href="s.url" target="_blank" rel="noopener" class="sponsor__ad-card">
        <img v-if="s.logo" :src="s.logo" :alt="s.name" class="sponsor__ad-logo" />
        <div v-else class="sponsor__ad-logo-placeholder">{{ s.name.charAt(0) }}</div>
        <div class="sponsor__ad-info">
          <h4>{{ s.name }}</h4>
          <p>{{ s.desc }}</p>
        </div>
      </a>
    </div>
    <NEmpty v-else description="暂无赞助商，欢迎成为第一位赞助商 ❤️" style="margin-bottom: 36px;" />

    <!-- 赞助方式 -->
    <h2>赞助方式</h2>
    <p>扫描下方二维码，通过微信或支付宝赞助我们：</p>
    <div class="sponsor__qr-wrap">
      <img src="https://imgsbad.semoun.com/uploads/2026/01/17/696b433eb9417.jpg" alt="微信 / 支付宝收款码" class="sponsor__qr-img" />
      <div class="sponsor__qr-labels">
        <NTag type="success" effect="light" size="sm" round>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-3.986-6.343-8.326-6.548v-.01z"/></svg>
          微信支付
        </NTag>
        <NTag type="primary" effect="light" size="sm" round>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.871 4.326-2.962-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>
          支付宝
        </NTag>
      </div>
    </div>

    <h2>为什么赞助？</h2>
    <div class="sponsor__grid">
      <div class="sponsor__card">
        <div class="sponsor__card-icon">⚡</div>
        <h3>持续开发</h3>
        <p>支持维护者投入更多时间开发新组件和功能。</p>
      </div>
      <div class="sponsor__card">
        <div class="sponsor__card-icon">🐛</div>
        <h3>Bug 修复</h3>
        <p>加快问题响应与修复速度，保障库的稳定性。</p>
      </div>
      <div class="sponsor__card">
        <div class="sponsor__card-icon">📖</div>
        <h3>文档完善</h3>
        <p>编写更详细的文档、教程和最佳实践指南。</p>
      </div>
      <div class="sponsor__card">
        <div class="sponsor__card-icon">🌐</div>
        <h3>基础设施</h3>
        <p>文档站部署、CI/CD 流水线和测试服务。</p>
      </div>
    </div>

    <h2>其他方式</h2>
    <ul class="sponsor__list">
      <li>在 <a href="https://gitee.com/wuaxcn/nacr-design" target="_blank" rel="noopener">Gitee</a> 上点亮 Star ⭐</li>
      <li>在 <a href="https://github.com/nacrcn/Nacr-Design" target="_blank" rel="noopener">GitHub</a> 上点亮 Star ⭐</li>
      <li>向身边需要组件库的朋友推荐 NacrDesign</li>
      <li>提交 Issue 或 PR 参与项目共建</li>
      <li>成为赞助商，在上方展示你的品牌</li>
    </ul>

    <h2>致谢</h2>
    <p>感谢每一位赞助者，你们的支持是 NacrDesign 持续前进的动力！</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

useDocSeo({
  title: '赞助支持 - Nacr Design',
  description: '赞助 Nacr Design 开源项目，帮助团队持续维护和改进。支持微信、支付宝赞助。',
  keywords: ['赞助', '捐赠', '开源赞助'],
})

interface Sponsor {
  name: string
  logo?: string
  desc: string
  url: string
}

// 手动维护赞助商列表，赞助后在此添加
const sponsors: Sponsor[] = [
//   {
//     name: '示例公司',
//     logo: 'https://example.com/logo.png',
//     desc: '示例公司 — 提供优质云服务',
//     url: 'https://example.com',
//   },
]
</script>

<style scoped>
/* 赞助商广告列表 */
.sponsor__tip {
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--nd-color-text-secondary, #6b7280);
}
.sponsor__ad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  margin-bottom: 36px;
}
.sponsor__ad-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  text-decoration: none;
  transition: all 0.2s;
}
.sponsor__ad-card:hover {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}
.sponsor__ad-logo {
  width: 44px;
  height: 44px;
  border-radius: var(--n-radius-lg, 8px);
  object-fit: contain;
  background: var(--nd-color-bg-sunken, #f9fafb);
  flex-shrink: 0;
}
.sponsor__ad-logo-placeholder {
  width: 44px;
  height: 44px;
  border-radius: var(--n-radius-lg, 8px);
  background: linear-gradient(135deg, var(--n-color-primary, #3b82f6), var(--n-color-primary-active, #1d4ed8));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}
.sponsor__ad-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  margin-bottom: 2px;
}
.sponsor__ad-info p {
  font-size: 12px;
  color: var(--nd-color-text-secondary, #6b7280);
  line-height: 1.5;
}

/* 收款码 */
.sponsor__qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0 36px;
}
.sponsor__qr-img {
  width: 100%;
  max-width: 700px;
  border-radius: var(--n-radius-xl, 12px);
  border: 1px solid var(--nd-color-border, #e5e7eb);
}
.sponsor__qr-labels {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

/* 为什么赞助 */
.sponsor__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}
.sponsor__card {
  padding: 20px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  transition: all 0.2s;
}
.sponsor__card:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.06);
}
.sponsor__card-icon { font-size: 28px; margin-bottom: 8px; }
.sponsor__card h3 { font-size: 15px; font-weight: 600; color: var(--nd-color-text, #1f2937); margin-bottom: 4px; }
.sponsor__card p { font-size: 13px; color: var(--nd-color-text-secondary, #6b7280); line-height: 1.6; }

/* 其他方式 */
.sponsor__list {
  padding-left: 20px;
  list-style: disc;
  margin-bottom: 36px;
}
.sponsor__list li { font-size: 14px; color: var(--nd-color-text-secondary, #6b7280); line-height: 2; }
.sponsor__list a { color: var(--n-color-primary, #3b82f6); text-decoration: none; }
.sponsor__list a:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .sponsor__grid { grid-template-columns: 1fr; }
  .sponsor__qr-img { width: 200px; }
}
</style>
