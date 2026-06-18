<template>
  <div class="doc-layout">
    <DocHeader />
    <div class="doc-layout__body">
      <DocSidebar />
      <main class="doc-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.doc-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.doc-layout__body {
  display: flex;
  flex: 1;
  padding-top: 60px; /* header height */
}

.doc-layout__content {
  flex: 1;
  min-width: 0;
  padding: 40px 48px 80px;
  margin-left: 260px; /* sidebar width */
}

@media (max-width: 768px) {
  .doc-layout__content {
    margin-left: 0;
    padding: 24px 16px 60px;
  }
}
</style>
