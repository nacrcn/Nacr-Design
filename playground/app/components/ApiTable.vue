<template>
  <div class="api-table-block">
    <h3 class="api-table-block__title">{{ title }}</h3>
    <table class="api-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="i">
          <td v-for="col in columns" :key="col.key">
            <code v-if="col.code">{{ row[col.key] }}</code>
            <template v-else>{{ row[col.key] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  title: string
  code?: boolean
}

defineProps<{
  title: string
  columns: Column[]
  data: Record<string, string>[]
}>()
</script>

<style scoped>
.api-table-block__title {
  font-size: 16px;
  font-weight: 600;
  margin: 32px 0 12px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.api-table th {
  text-align: left;
  padding: 10px 16px;
  background: var(--nd-color-bg-sunken);
  border-bottom: 2px solid var(--nd-color-border);
  font-weight: 600;
  color: var(--nd-color-text-secondary);
  white-space: nowrap;
}

.api-table td {
  padding: 10px 16px;
  border-bottom: 1px solid var(--nd-color-border);
  color: var(--nd-color-text);
}

.api-table td code {
  font-size: 13px;
  padding: 2px 6px;
  white-space: nowrap;
}
</style>
