<template>
  <div class="doc-page team">
    <h1>开发团队</h1>
    <p class="doc-page__desc">NacrDesign 的持续发展离不开每一位贡献者的付出。</p>

    <h2>核心成员</h2>
    <div class="team__grid">
      <div v-for="member in coreMembers" :key="member.name" class="team__card">
        <div class="team__avatar" :style="{ background: member.color }">
          {{ member.name.charAt(0) }}
        </div>
        <div class="team__info">
          <h3>{{ member.name }}</h3>
          <p class="team__role">{{ member.role }}</p>
          <p class="team__bio">{{ member.bio }}</p>
          <div class="team__socials">
            <a v-if="member.gitee" :href="member.gitee" target="_blank" rel="noopener" title="Gitee">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.926c0 .982.796 1.778 1.778 1.778h4.452c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-2.963a.593.593 0 0 1-.593-.592v-1.482a.593.593 0 0 1 .593-.592h4.746a.592.592 0 0 1 .593.592v3.554a4 4 0 0 1-4 4H9.185a4 4 0 0 1-4-4V9.778a4 4 0 0 1 4-4h8.89z"/></svg>
            </a>
            <a v-if="member.github" :href="member.github" target="_blank" rel="noopener" title="GitHub">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <h2>贡献指南</h2>
    <p>NacrDesign 是一个开源项目，我们欢迎各种形式的贡献：</p>
    <div class="team__contributions">
      <div class="team__contribution">
        <div class="team__contribution-icon">🐛</div>
        <h4>反馈 Bug</h4>
        <p>在 <a href="https://gitee.com/wuaxcn/nacr-design/issues" target="_blank" rel="noopener">Gitee Issues</a> 或 <a href="https://github.com/nacrcn/Nacr-Design/issues" target="_blank" rel="noopener">GitHub Issues</a> 中提交问题。</p>
      </div>
      <div class="team__contribution">
        <div class="team__contribution-icon">💡</div>
        <h4>提出建议</h4>
        <p>欢迎在 Issues 中提出新功能或改进建议。</p>
      </div>
      <div class="team__contribution">
        <div class="team__contribution-icon">🔧</div>
        <h4>提交代码</h4>
        <p>Fork 仓库并提交 Pull Request，参与组件开发与优化。</p>
      </div>
      <div class="team__contribution">
        <div class="team__contribution-icon">📖</div>
        <h4>完善文档</h4>
        <p>帮助改进文档、补充示例，让更多人更好地使用。</p>
      </div>
    </div>

    <h2>致谢</h2>
    <p>感谢所有为 NacrDesign 贡献过代码、提出过建议的开发者，以及 Vue、Nuxt、ECharts 等开源社区的卓越工作。</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'doc' })

interface Member {
  name: string
  role: string
  bio: string
  color: string
  gitee?: string
  github?: string
}

const coreMembers: Member[] = [
  {
    name: '小豆子',
    role: '核心开发者 & 维护者',
    bio: 'NacrDesign 发起人，负责架构设计与核心组件开发。',
    color: 'var(--n-color-primary, #3b82f6)',
    gitee: 'https://gitee.com/wuaxcn',
    github: 'https://github.com/nacrcn',
  },
  // 可继续添加更多成员
]
</script>

<style scoped>
.team__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
}

.team__card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  transition: all 0.2s;
}

.team__card:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.06);
}

.team__avatar {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--n-radius-xl, 12px);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.team__info {
  min-width: 0;
}

.team__info h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  margin-bottom: 2px;
}

.team__role {
  font-size: 13px;
  color: var(--n-color-primary, #3b82f6);
  font-weight: 500;
  margin-bottom: 4px;
}

.team__bio {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
  line-height: 1.6;
  margin-bottom: 6px;
}

.team__socials {
  display: flex;
  gap: 10px;
}

.team__socials a {
  color: var(--nd-color-text-tertiary, #9ca3af);
  transition: color 0.2s;
  display: flex;
}

.team__socials a:hover {
  color: var(--n-color-primary, #3b82f6);
}

.team__contributions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}

.team__contribution {
  padding: 20px;
  border: 1px solid var(--nd-color-border, #e5e7eb);
  border-radius: var(--n-radius-xl, 12px);
  transition: all 0.2s;
}

.team__contribution:hover {
  border-color: var(--n-color-primary-light-hover, #93c5fd);
}

.team__contribution-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.team__contribution h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--nd-color-text, #1f2937);
  margin-bottom: 4px;
}

.team__contribution p {
  font-size: 13px;
  color: var(--nd-color-text-secondary, #6b7280);
  line-height: 1.6;
}

.team__contribution a {
  color: var(--n-color-primary, #3b82f6);
  text-decoration: none;
}

.team__contribution a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .team__contributions {
    grid-template-columns: 1fr;
  }
}
</style>
