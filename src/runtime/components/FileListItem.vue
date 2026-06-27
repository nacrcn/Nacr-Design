<template>
  <div
    :class="[
      'n-file-item',
      `n-file-item--${mode}`,
      {
        'n-file-item--selected': selected,
        'n-file-item--selectable': selectable,
      },
    ]"
    @click="handleClick"
  >
    <!-- Checkbox for selectable (list mode) -->
    <div v-if="selectable && mode === 'list'" class="n-file-item__checkbox" @click.stop>
      <NCheckbox :model-value="selected" @update:model-value="$emit('select', $event)" />
    </div>

    <!-- Card mode: image preview or large icon -->
    <div v-if="mode === 'card'" :class="['n-file-item__card-preview', { 'n-file-item__card-preview--image': isImage }]">
      <slot name="icon" :file="file" :ext="ext" :iconName="iconName">
        <img
          v-if="isImage && file.url"
          :src="file.url"
          class="n-file-item__card-image"
          :alt="file.name"
        />
        <div v-else class="n-file-item__card-icon">
          <img
            v-if="colorfulIconUrl"
            :src="colorfulIconUrl"
            class="n-file-item__colorful-icon n-file-item__colorful-icon--card"
            :alt="ext"
          />
          <NIcon v-else :name="iconName" :size="40" />
        </div>
      </slot>
      <!-- Overlay actions -->
      <div v-if="showActions" class="n-file-item__card-overlay" @click.stop>
        <slot name="actions" :file="file">
          <button class="n-file-item__card-action" title="下载" @click="$emit('file-click', file)">
            <NIcon name="shangchuan" :size="16" />
          </button>
          <button class="n-file-item__card-action n-file-item__card-action--danger" title="删除" @click="$emit('remove', file, index)">
            <NIcon name="shanchu" :size="16" />
          </button>
        </slot>
      </div>
      <!-- Checkbox overlay for card selectable -->
      <div v-if="selectable" class="n-file-item__card-checkbox" @click.stop>
        <NCheckbox :model-value="selected" @update:model-value="$emit('select', $event)" />
      </div>
    </div>

    <!-- Icon area (list / grid mode) -->
    <div v-if="mode !== 'card'" :class="iconClasses">
      <slot name="icon" :file="file" :ext="ext" :iconName="iconName">
        <img
          v-if="colorfulIconUrl"
          :src="colorfulIconUrl"
          :class="['n-file-item__colorful-icon', `n-file-item__colorful-icon--${mode}`]"
          :alt="ext"
        />
        <!-- grid mode: image thumbnail -->
        <img
          v-else-if="mode === 'grid' && isImage && file.url"
          :src="file.url"
          class="n-file-item__grid-image"
          :alt="file.name"
        />
        <NIcon v-else :name="iconName" :size="mode === 'grid' ? 28 : 18" />
      </slot>
      <span v-if="mode === 'grid' && !colorfulIconUrl && !(isImage && file.url)" class="n-file-item__ext-badge">{{ ext }}</span>
    </div>

    <!-- Info -->
    <div class="n-file-item__info">
      <slot name="name" :file="file">
        <span class="n-file-item__name" :title="file.name">{{ file.name }}</span>
      </slot>
      <div v-if="mode === 'list' && (showSize || showDate)" class="n-file-item__meta">
        <span v-if="showSize && file.size != null" class="n-file-item__size">{{ formatSize(file.size) }}</span>
        <span v-if="showDate && file.date" class="n-file-item__date">{{ file.date }}</span>
      </div>
      <div v-if="mode === 'grid'" class="n-file-item__meta-grid">
        <span v-if="showSize && file.size != null" class="n-file-item__size">{{ formatSize(file.size) }}</span>
      </div>
      <div v-if="mode === 'card'" class="n-file-item__meta-card">
        <span v-if="showSize && file.size != null" class="n-file-item__size">{{ formatSize(file.size) }}</span>
        <span v-if="showDate && file.date" class="n-file-item__date">{{ file.date }}</span>
      </div>
    </div>

    <!-- Actions (list mode) -->
    <div v-if="showActions && mode === 'list'" class="n-file-item__actions" @click.stop>
      <slot name="actions" :file="file">
        <button class="n-file-item__action" title="下载" @click="$emit('file-click', file)">
          <NIcon name="shangchuan" :size="14" />
        </button>
        <button class="n-file-item__action n-file-item__action--danger" title="删除" @click="$emit('remove', file, index)">
          <NIcon name="shanchu" :size="14" />
        </button>
      </slot>
    </div>

    <!-- Actions (grid mode) -->
    <div v-if="showActions && mode === 'grid'" class="n-file-item__grid-actions" @click.stop>
      <slot name="actions" :file="file">
        <button class="n-file-item__grid-action" title="下载" @click="$emit('file-click', file)">
          <NIcon name="shangchuan" :size="14" />
        </button>
        <button class="n-file-item__grid-action n-file-item__grid-action--danger" title="删除" @click="$emit('remove', file, index)">
          <NIcon name="shanchu" :size="14" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FileItem, FileIconMap } from './FileList.vue'

interface Props {
  file: FileItem
  mode?: 'list' | 'grid' | 'card'
  selectable?: boolean
  selected?: boolean
  showSize?: boolean
  showDate?: boolean
  showActions?: boolean
  icons?: FileIconMap
  colorfulIcons?: string[]
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'list',
  selectable: false,
  selected: false,
  showSize: true,
  showDate: false,
  showActions: true,
  icons: () => ({}),
  colorfulIcons: () => [],
  index: 0,
})

const emit = defineEmits<{
  click: [file: FileItem]
  select: [selected: boolean]
  remove: [file: FileItem, index: number]
  'file-click': [file: FileItem]
}>()

// Image extensions
const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp', 'ico', 'avif']

// File extension
const ext = computed(() => {
  const name = props.file.name || ''
  const dot = name.lastIndexOf('.')
  return dot > -1 ? name.slice(dot + 1).toLowerCase() : ''
})

// Is image file
const isImage = computed(() => {
  if (props.file.type) return props.file.type.startsWith('image/')
  return imageExts.includes(ext.value)
})

// 彩色 SVG 文件名映射
const svgFileMap: Record<string, string> = {
  pdf: 'PDF', doc: 'doc', docx: 'DOCX', dox: 'DOX',
  xls: 'xls', xlsx: 'XLSX', ppt: 'PPT', pptx: 'PPTX',
  txt: 'txt', text: 'TEXT', json: 'JSON', dif: 'DIF',
  xml: 'xml', html: 'html', md: 'md',
  jpg: 'JPG', jpeg: 'JPEG', png: 'png', svg: 'svg',
  mp3: 'MP3', ogg: 'OGG', m4a: 'M4A',
  zip: 'zip', iso: 'iso', exe: 'exe',
  js: 'js', css: 'css', py: 'py', java: 'java',
  jar: 'jar', class: 'class', sql: 'sql', yml: 'yml',
  dockerfile: 'dockerfile', gitignore: 'gitignore',
  wxs: 'WXS', file: 'file',
}

// 彩色图标 URL
const colorfulIconUrl = computed(() => {
  const lower = ext.value.toLowerCase()
  const svgName = svgFileMap[lower] || (props.colorfulIcons?.includes(lower) ? lower : null)
  if (!svgName) return null
  return `/file-icons/${svgName}.svg`
})

// NIcon 单色图标映射
const defaultIconMap: Record<string, string> = {
  pdf: 'pdf', doc: 'doc', docx: 'DOCX', xls: 'xls', xlsx: 'XLSX', ppt: 'PPT', pptx: 'PPTX',
  txt: 'txt', text: 'TEXT', json: 'json', JSON: 'JSON', xml: 'xml', html: 'html', md: 'md',
  js: 'js', css: 'css', py: 'py', java: 'java', jar: 'jar', class: 'class', sql: 'sql',
  yml: 'yml', dockerfile: 'dockerfile', gitignore: 'gitignore',
  jpg: 'jpg', JPG: 'JPG', jpeg: 'JPEG', png: 'png', svg: 'svg', bmp: 'BMP',
  mp3: 'mp3', MP3: 'MP3', ogg: 'OGG', m4a: 'M4A', aac: 'AAC',
  mp4: 'mp4', MP4: 'MP4',
  zip: 'zip', ZIP: 'ZIP', iso: 'iso',
  exe: 'exe', dox: 'DOX', dif: 'DIF', wxs: 'WXS',
}

const iconName = computed(() => {
  if (props.icons && props.icons[ext.value]) {
    return props.icons[ext.value]
  }
  const lower = ext.value.toLowerCase()
  if (defaultIconMap[lower]) return defaultIconMap[lower]
  if (defaultIconMap[ext.value]) return defaultIconMap[ext.value]
  return 'file'
})

// 图标容器类名
const iconClasses = computed(() => {
  const cls: string[] = ['n-file-item__icon']
  if (colorfulIconUrl.value || (props.mode !== 'card' && isImage.value && props.file.url)) {
    cls.push('n-file-item__icon--colorful')
  } else {
    cls.push(`n-file-item__icon--${extColor.value}`)
  }
  return cls
})

// 颜色分类
const extColor = computed(() => {
  const e = ext.value.toLowerCase()
  if (['pdf'].includes(e)) return 'danger'
  if (['doc', 'docx', 'txt', 'text', 'rtf'].includes(e)) return 'primary'
  if (['xls', 'xlsx', 'csv'].includes(e)) return 'success'
  if (['ppt', 'pptx'].includes(e)) return 'warning'
  if (imageExts.includes(e)) return 'info'
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(e)) return 'purple'
  if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(e)) return 'pink'
  if (['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(e)) return 'warning'
  if (['js', 'ts', 'py', 'java', 'html', 'css', 'json', 'xml', 'sql', 'yml', 'sh'].includes(e)) return 'code'
  return 'default'
})

function handleClick() {
  emit('click', props.file)
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}
</script>

<style scoped>
/* ====== List Mode ====== */
.n-file-item--list {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--n-color-border);
  transition: background 0.15s;
  cursor: default;
}

.n-file-item--list:last-child {
  border-bottom: none;
}

.n-file-item--list:hover {
  background: var(--n-color-fill-hover);
}

.n-file-item--selectable {
  cursor: pointer;
}

.n-file-item--selected {
  background: var(--n-color-primary-light, #eff6ff);
}

.n-file-item__checkbox {
  flex-shrink: 0;
}

/* ====== Icon (list / grid) ====== */
.n-file-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.n-file-item--list .n-file-item__icon {
  width: 32px;
  height: 32px;
  border-radius: var(--n-radius-sm, 4px);
}

.n-file-item--grid .n-file-item__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--n-radius-md, 6px);
  flex-direction: column;
  gap: 2px;
}

.n-file-item__icon--colorful {
  background: transparent !important;
}

.n-file-item__colorful-icon {
  object-fit: contain;
}

.n-file-item__colorful-icon--list {
  width: 28px;
  height: 28px;
}

.n-file-item__colorful-icon--grid {
  width: 44px;
  height: 44px;
}

.n-file-item__colorful-icon--card {
  width: 48px;
  height: 48px;
}

/* Grid image thumbnail */
.n-file-item__grid-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* Icon color variants (单色模式) */
.n-file-item__icon--default { color: var(--n-color-text-disabled, #9ca3af); background: var(--n-color-fill, #f9fafb); }
.n-file-item__icon--primary { color: var(--n-color-primary, #3b82f6); background: rgba(59, 130, 246, 0.1); }
.n-file-item__icon--success { color: var(--n-color-success, #22c55e); background: rgba(34, 197, 94, 0.1); }
.n-file-item__icon--warning { color: var(--n-color-warning, #f59e0b); background: rgba(245, 158, 11, 0.1); }
.n-file-item__icon--danger { color: var(--n-color-danger, #ef4444); background: rgba(239, 68, 68, 0.1); }
.n-file-item__icon--info { color: #06b6d4; background: rgba(6, 182, 212, 0.1); }
.n-file-item__icon--purple { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
.n-file-item__icon--pink { color: #ec4899; background: rgba(236, 72, 153, 0.1); }
.n-file-item__icon--code { color: #10b981; background: rgba(16, 185, 129, 0.1); }

/* Ext badge (grid mode, 单色模式) */
.n-file-item__ext-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* ====== Info ====== */
.n-file-item__info {
  flex: 1;
  min-width: 0;
}

.n-file-item__name {
  display: block;
  font-size: 13px;
  color: var(--n-color-text);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.n-file-item__meta {
  display: flex;
  gap: 12px;
  margin-top: 2px;
}

.n-file-item__meta-grid {
  margin-top: 2px;
}

.n-file-item__meta-card {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.n-file-item__size,
.n-file-item__date {
  font-size: 11px;
  color: var(--n-color-text-disabled, #9ca3af);
}

/* ====== Actions (list) ====== */
.n-file-item__actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.n-file-item--list:hover .n-file-item__actions {
  opacity: 1;
}

.n-file-item__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--n-radius-sm, 4px);
  background: transparent;
  color: var(--n-color-text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.15s;
}

.n-file-item__action:hover {
  background: var(--n-color-fill, #f3f4f6);
  color: var(--n-color-text);
}

.n-file-item__action--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--n-color-danger, #ef4444);
}

/* ====== Grid Mode ====== */
.n-file-item--grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg, 8px);
  background: var(--n-color-bg);
  cursor: default;
  position: relative;
  transition: all 0.2s;
}

.n-file-item--grid:hover {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.n-file-item--grid .n-file-item__name {
  text-align: center;
  font-size: 12px;
}

.n-file-item--grid .n-file-item__size {
  text-align: center;
}

.n-file-item--grid .n-file-item__info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Grid Actions */
.n-file-item__grid-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
}

.n-file-item--grid:hover .n-file-item__grid-actions {
  opacity: 1;
}

.n-file-item__grid-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--n-radius-sm, 4px);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.n-file-item__grid-action:hover {
  background: rgba(0, 0, 0, 0.7);
}

.n-file-item__grid-action--danger:hover {
  background: var(--n-color-danger, #ef4444);
}

.n-file-item--grid.n-file-item--selected {
  border-color: var(--n-color-primary, #3b82f6);
  background: var(--n-color-primary-light, #eff6ff);
}

/* ====== Card Mode ====== */
.n-file-item--card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--n-color-border);
  border-radius: var(--n-radius-lg, 8px);
  background: var(--n-color-bg);
  cursor: default;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.n-file-item--card:hover {
  border-color: var(--n-color-primary, #3b82f6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.n-file-item--card.n-file-item--selected {
  border-color: var(--n-color-primary, #3b82f6);
  background: var(--n-color-primary-light, #eff6ff);
}

/* Card preview area */
.n-file-item__card-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--n-color-fill, #f9fafb);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.n-file-item__card-preview--image {
  background: #f0f0f0;
}

/* Card image (for image files) */
.n-file-item__card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Card icon (for non-image files) */
.n-file-item__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card overlay actions */
.n-file-item__card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.n-file-item--card:hover .n-file-item__card-overlay {
  opacity: 1;
}

.n-file-item__card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--n-color-text, #1f2937);
  cursor: pointer;
  transition: all 0.15s;
}

.n-file-item__card-action:hover {
  background: #fff;
  transform: scale(1.1);
}

.n-file-item__card-action--danger:hover {
  background: var(--n-color-danger, #ef4444);
  color: #fff;
}

/* Card checkbox */
.n-file-item__card-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

/* Card info area */
.n-file-item--card .n-file-item__info {
  padding: 10px 12px;
}

.n-file-item--card .n-file-item__name {
  font-size: 13px;
  font-weight: 500;
}
</style>
