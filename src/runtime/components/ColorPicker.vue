<template>
    <div ref="pickerRef"
        :class="['n-color-picker', `n-color-picker--${size}`, `n-color-picker--${type}`, { 'n-color-picker--disabled': disabled, 'n-color-picker--open': open }]">
        <div class="n-color-picker__trigger" @click="toggleOpen">
            <span class="n-color-picker__swatch" :style="swatchStyle" />
            <span class="n-color-picker__text">{{ triggerText }}</span>
            <span v-if="clearable && hasValue" class="n-color-picker__clear" @click.stop="handleClear">×</span>
        </div>
        <transition name="n-color-picker__fade">
            <div v-show="open" class="n-color-picker__dropdown">
                <template v-if="type === 'preset'">
                    <div class="n-cp-presets">
                        <div v-for="c in presetColors" :key="c"
                            :class="['n-cp-preset', { 'n-cp-preset--sel': modelValue === c }]"
                            :style="{ background: c }" @click="selectPreset(c)">
                            <svg v-if="modelValue === c" class="n-cp-preset-check" viewBox="0 0 24 24" fill="none"
                                stroke="#fff" stroke-width="3" stroke-linecap="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                </template>
                <template v-if="type === 'color'">
                    <div ref="svPanelRef" class="n-cp-sv" @mousedown.prevent="onSvStart">
                        <div class="n-cp-sv-hue" :style="svHueStyle" />
                        <div class="n-cp-sv-white" />
                        <div class="n-cp-sv-black" />
                        <div class="n-cp-sv-thumb" :style="svThumbStyle" />
                    </div>
                    <div class="n-cp-bar"><span class="n-cp-bar-label">H</span>
                        <div ref="hueBarRef" class="n-cp-hue" @mousedown.prevent="onHueStart">
                            <div class="n-cp-bar-thumb" :style="hueThumbStyle" />
                        </div>
                    </div>
                    <div v-if="showAlpha" class="n-cp-bar"><span class="n-cp-bar-label">A</span>
                        <div ref="alphaBarRef" class="n-cp-alpha" :style="alphaBarBg" @mousedown.prevent="onAlphaStart">
                            <div class="n-cp-bar-thumb" :style="alphaThumbStyle" />
                        </div><span class="n-cp-alpha-txt">{{ alphaPercent }}%</span>
                    </div>
                    <div class="n-cp-quick">
                        <div v-for="c in presetColors" :key="c" class="n-cp-qi" :style="{ background: c }"
                            @click="selectPreset(c)" />
                    </div>
                    <div class="n-cp-inputs">
                        <div class="n-cp-fmt">
                            <button :class="fmtCls('hex')" @click="inputFormat = 'hex'">HEX</button>
                            <button :class="fmtCls('rgb')" @click="inputFormat = 'rgb'">RGB</button>
                            <button :class="fmtCls('hsl')" @click="inputFormat = 'hsl'">HSL</button>
                        </div>
                        <div class="n-cp-irow">
                            <template v-if="inputFormat === 'hex'"><input :value="hexStr" class="n-cp-hex"
                                    @change="onHexInput" /></template>
                            <template v-if="inputFormat === 'rgb'">
                                <input type="number" min="0" max="255" :value="rgb.r" class="n-cp-num"
                                    @input="onRgbInput('r', $event)" />
                                <input type="number" min="0" max="255" :value="rgb.g" class="n-cp-num"
                                    @input="onRgbInput('g', $event)" />
                                <input type="number" min="0" max="255" :value="rgb.b" class="n-cp-num"
                                    @input="onRgbInput('b', $event)" />
                                <input v-if="showAlpha" type="number" min="0" max="100" :value="alphaPercent"
                                    class="n-cp-num" @input="onAlphaNum($event)" />
                            </template>
                            <template v-if="inputFormat === 'hsl'">
                                <input type="number" min="0" max="360" :value="Math.round(hsv.h)" class="n-cp-num"
                                    @input="onHslInput('h', $event)" />
                                <input type="number" min="0" max="100" :value="hslP.s" class="n-cp-num"
                                    @input="onHslInput('s', $event)" />
                                <input type="number" min="0" max="100" :value="hslP.l" class="n-cp-num"
                                    @input="onHslInput('l', $event)" />
                                <input v-if="showAlpha" type="number" min="0" max="100" :value="alphaPercent"
                                    class="n-cp-num" @input="onAlphaNum($event)" />
                            </template>
                        </div>
                    </div>
                    <div class="n-cp-footer"><button class="n-cp-btn" @click="handleClear">清除</button><button
                            class="n-cp-btn n-cp-btn--p" @click="confirmColor">确定</button></div>
                </template>
                <template v-if="type === 'gradient'">
                    <!-- 渐变预览 -->
                    <div class="n-cp-gp" :style="gradPreviewStyle" />

                    <!-- 渐变类型切换 -->
                    <div class="n-cp-bar">
                        <span class="n-cp-bar-label">类型</span>
                        <div class="n-cp-gtypes">
                            <button :class="['n-cp-gtype', { 'n-cp-gtype--a': gradType === 'linear' }]" @click="gradType = 'linear'">线性</button>
                            <button :class="['n-cp-gtype', { 'n-cp-gtype--a': gradType === 'radial' }]" @click="gradType = 'radial'">径向</button>
                        </div>
                    </div>

                    <!-- 线性渐变角度拨盘（PS风格） -->
                    <div v-if="gradType === 'linear'" class="n-cp-angle-ring-wrap">
                        <div ref="angleRingRef" class="n-cp-angle-ring" @mousedown.prevent="onAngleRingStart">
                            <svg class="n-cp-angle-svg" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--n-color-border)"
                                    stroke-width="1.5" />
                                <!-- 刻度线 -->
                                <line v-for="t in 12" :key="t"
                                    :x1="40 + 30 * Math.cos((t * 30 - 90) * Math.PI / 180)"
                                    :y1="40 + 30 * Math.sin((t * 30 - 90) * Math.PI / 180)"
                                    :x2="40 + 34 * Math.cos((t * 30 - 90) * Math.PI / 180)"
                                    :y2="40 + 34 * Math.sin((t * 30 - 90) * Math.PI / 180)"
                                    stroke="var(--n-color-text-disabled)" stroke-width="1" />
                                <!-- 方向指示线 -->
                                <line :x1="40" :y1="40"
                                    :x2="40 + 26 * Math.cos((gradAngle - 90) * Math.PI / 180)"
                                    :y2="40 + 26 * Math.sin((gradAngle - 90) * Math.PI / 180)"
                                    stroke="var(--n-color-primary)" stroke-width="2" stroke-linecap="round" />
                                <!-- 可拖拽圆球 -->
                                <circle :cx="40 + 34 * Math.cos((gradAngle - 90) * Math.PI / 180)"
                                    :cy="40 + 34 * Math.sin((gradAngle - 90) * Math.PI / 180)" r="6"
                                    :fill="'var(--n-color-primary)'" stroke="#fff" stroke-width="2"
                                    style="cursor:grab;filter:drop-shadow(0 1px 2px rgba(0,0,0,.2))" />
                            </svg>
                            <!-- 中心角度数字 -->
                            <span class="n-cp-angle-center">{{ gradAngle }}°</span>
                        </div>
                    </div>

                    <!-- 色标条（可交互拖拽） -->
                    <div class="n-cp-stops-track">
                        <div class="n-cp-stops-bar" :style="stopsBarBg" @click.self="onStopsBarClick"></div>
                        <div v-for="(stop, idx) in gradStops" :key="idx"
                            :class="['n-cp-stop', { 'n-cp-stop--active': activeStopIdx === idx }]"
                            :style="{ left: `${stop.position * 100}%` }"
                            @mousedown.prevent.stop="onStopStart(idx, $event)"
                            @click.stop>
                            <div class="n-cp-stop-marker" :style="{ background: stop.color }" />
                        </div>
                    </div>

                    <!-- 当前色标编辑器 -->
                    <div v-if="activeStopIdx >= 0 && activeStopIdx < gradStops.length" class="n-cp-stop-editor">
                        <!-- SV 面板 -->
                        <div ref="gSvPanelRef" class="n-cp-sv" @mousedown.prevent="onGSvStart">
                            <div class="n-cp-sv-hue" :style="gSvHueStyle" />
                            <div class="n-cp-sv-white" />
                            <div class="n-cp-sv-black" />
                            <div class="n-cp-sv-thumb" :style="gSvThumbStyle" />
                        </div>
                        <!-- Hue 条 -->
                        <div class="n-cp-bar"><span class="n-cp-bar-label">H</span>
                            <div ref="gHueBarRef" class="n-cp-hue" @mousedown.prevent="onGHueStart">
                                <div class="n-cp-bar-thumb" :style="gHueThumbStyle" />
                            </div>
                        </div>
                        <!-- Alpha 条 -->
                        <div v-if="showAlpha" class="n-cp-bar"><span class="n-cp-bar-label">A</span>
                            <div ref="gAlphaBarRef" class="n-cp-alpha" :style="gAlphaBarBg" @mousedown.prevent="onGAlphaStart">
                                <div class="n-cp-bar-thumb" :style="gAlphaThumbStyle" />
                            </div><span class="n-cp-alpha-txt">{{ gAlphaPercent }}%</span>
                        </div>
                        <!-- HEX 输入 + 位置 -->
                        <div class="n-cp-stop-row">
                            <input :value="activeStopColor" class="n-cp-ghex" @change="onGStopHexInput($event)" />
                            <div class="n-cp-stop-pos">
                                <input type="number" min="0" max="100" :value="Math.round(gradStops[activeStopIdx].position * 100)"
                                    class="n-cp-num n-cp-num--pos" @input="onStopPosInput($event)" />
                                <span class="n-cp-stop-pos-label">%</span>
                            </div>
                            <button v-if="gradStops.length > 2" class="n-cp-stop-del" title="删除色标"
                                @click="removeStop(activeStopIdx)">×</button>
                        </div>
                    </div>

                    <div class="n-cp-footer"><button class="n-cp-btn" @click="handleClear">清除</button><button
                            class="n-cp-btn n-cp-btn--p" @click="confirmGrad">确定</button></div>
                </template>
            </div>
        </transition>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
type CPType = 'preset' | 'color' | 'gradient'
type CPFmt = 'hex' | 'rgb' | 'hsl'
interface Props { modelValue?: string; type?: CPType; format?: CPFmt; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; clearable?: boolean; showAlpha?: boolean; presets?: string[] }
const props = withDefaults(defineProps<Props>(), { modelValue: '#3b82f6', type: 'color', format: 'hex', size: 'md', disabled: false, clearable: false, showAlpha: false, presets: undefined })
const emit = defineEmits<{ 'update:modelValue': [v: string | undefined]; change: [v: string | undefined] }>()

const dp = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#78716c', '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff']
const presetColors = computed(() => props.presets ?? dp)
const open = ref(false); const pickerRef = ref<HTMLElement>(); const inputFormat = ref<CPFmt>(props.format)
const hsv = reactive({ h: 217, s: 0.76, v: 0.96 }); const alpha = ref(1)
const svPanelRef = ref<HTMLElement>(); const hueBarRef = ref<HTMLElement>(); const alphaBarRef = ref<HTMLElement>()
const gradStart = ref('#3b82f6'); const gradEnd = ref('#10b981'); const gradDir = ref('to right')
const dirs = [
    { v: 'to right', ang: '0deg' }, { v: 'to bottom right', ang: '45deg' }, { v: 'to bottom', ang: '90deg' }, { v: 'to bottom left', ang: '135deg' },
    { v: 'to left', ang: '180deg' }, { v: 'to top left', ang: '225deg' }, { v: 'to top', ang: '270deg' }, { v: 'to top right', ang: '315deg' }
]

// ---- Enhanced gradient state ----
interface GradStop { color: string; position: number }
const gradType = ref<'linear' | 'radial'>('linear')
const gradAngle = ref(90)
const gradStops = ref<GradStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#10b981', position: 1 }
])
const activeStopIdx = ref(0)

// Gradient stop picker state
const gHsv = reactive({ h: 217, s: 0.76, v: 0.96 }); const gAlpha = ref(1)
const gSvPanelRef = ref<HTMLElement>(); const gHueBarRef = ref<HTMLElement>(); const gAlphaBarRef = ref<HTMLElement>()
const angleRingRef = ref<HTMLElement>()

function hsvToRgb(h: number, s: number, v: number) { const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c; let r = 0, g = 0, b = 0; if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c } else if (h < 180) { g = c; b = x } else if (h < 240) { g = x; b = c } else if (h < 300) { r = x; b = c } else { r = c; b = x } return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) } }
function rgbToHsv(r: number, g: number, b: number) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; const s = mx === 0 ? 0 : d / mx, v = mx; if (d) { if (mx === r) h = (((g - b) / d) % 6 + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60 } return { h, s, v } }
function rgbToHsl(r: number, g: number, b: number) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); if (mx === r) h = (((g - b) / d) % 6 + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60 } return { h, s, l } }
function hslToRgb(h: number, s: number, l: number) { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2; let r = 0, g = 0, b = 0; if (h < 60) { r = c; g = x } else if (h < 120) { r = x; g = c } else if (h < 180) { g = c; b = x } else if (h < 240) { g = x; b = c } else if (h < 300) { r = x; b = c } else { r = c; b = x } return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) } }
function hexToRgb(hex: string) { hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(c => c + c).join(''); const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16); if (hex.length === 8) return { r, g, b, a: parseInt(hex.slice(6, 8), 16) / 255 }; return { r, g, b } }
function rgbToHex(r: number, g: number, b: number, a?: number) { const h = '#' + [r, g, b].map(c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join(''); return (a !== undefined && a < 1) ? h + Math.round(a * 255).toString(16).padStart(2, '0') : h }

const rgb = computed(() => hsvToRgb(hsv.h, hsv.s, hsv.v))
const hexStr = computed(() => rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b, alpha.value < 1 ? alpha.value : undefined))
const alphaPercent = computed(() => Math.round(alpha.value * 100))
const hslP = computed(() => { const h = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b); return { h: Math.round(h.h), s: Math.round(h.s * 100), l: Math.round(h.l * 100) } })
const hasValue = computed(() => !!props.modelValue)

function fmtOut(r: number, g: number, b: number, a: number): string {
    if (props.format === 'hex') return rgbToHex(r, g, b, a < 1 ? a : undefined)
    if (props.format === 'rgb') return a < 1 ? `rgba(${r},${g},${b},${Math.round(a * 100) / 100})` : `rgb(${r},${g},${b})`
    const hs = rgbToHsl(r, g, b), hh = Math.round(hs.h), ss = Math.round(hs.s * 100), ll = Math.round(hs.l * 100)
    return a < 1 ? `hsla(${hh},${ss}%,${ll}%,${Math.round(a * 100) / 100})` : `hsl(${hh},${ss}%,${ll}%)`
}

const svHueStyle = computed(() => ({ background: `hsl(${hsv.h},100%,50%)` }))
const svThumbStyle = computed(() => ({ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }))
const hueThumbStyle = computed(() => ({ left: `${(hsv.h / 360) * 100}%` }))
const alphaThumbStyle = computed(() => ({ left: `${alpha.value * 100}%` }))
const alphaBarBg = computed(() => { const { r, g, b } = rgb.value; return { background: `linear-gradient(to right,rgba(${r},${g},${b},0),rgb(${r},${g},${b}))` } })
const swatchStyle = computed(() => ({ background: props.modelValue || '#3b82f6' }))
const triggerText = computed(() => { if (!props.modelValue) return '-'; return props.type === 'gradient' ? '渐变色' : props.modelValue })
const gradPreviewStyle = computed(() => {
    const sorted = [...gradStops.value].sort((a, b) => a.position - b.position)
    const stops = sorted.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(',')
    if (gradType.value === 'radial') return { background: `radial-gradient(circle, ${stops})` }
    const dirStr = gradDir.value || `${gradAngle.value}deg`
    return { background: `linear-gradient(${dirStr}, ${stops})` }
})

// Stops bar background helper
const stopsBarBg = computed(() => {
    const sorted = [...gradStops.value].sort((a, b) => a.position - b.position)
    const stops = sorted.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(',')
    return { background: `linear-gradient(to right, ${stops})` }
})

// Active stop color as hex
const activeStopColor = computed(() => {
    if (activeStopIdx.value < 0 || activeStopIdx.value >= gradStops.value.length) return '#000000'
    return gradStops.value[activeStopIdx.value].color
})

// Gradient stop picker computed styles
const gRgb = computed(() => hsvToRgb(gHsv.h, gHsv.s, gHsv.v))
const gSvHueStyle = computed(() => ({ background: `hsl(${gHsv.h},100%,50%)` }))
const gSvThumbStyle = computed(() => ({ left: `${gHsv.s * 100}%`, top: `${(1 - gHsv.v) * 100}%` }))
const gHueThumbStyle = computed(() => ({ left: `${(gHsv.h / 360) * 100}%` }))
const gAlphaThumbStyle = computed(() => ({ left: `${gAlpha.value * 100}%` }))
const gAlphaBarBg = computed(() => { const { r, g, b } = gRgb.value; return { background: `linear-gradient(to right,rgba(${r},${g},${b},0),rgb(${r},${g},${b}))` } })
const gAlphaPercent = computed(() => Math.round(gAlpha.value * 100))

watch(() => props.modelValue, v => { if (!v) return; props.type === 'gradient' ? parseGrad(v) : parseColor(v) }, { immediate: true })

function parseColor(v: string) { try { if (v.startsWith('#')) { const c = hexToRgb(v) as any; if (isNaN(c.r)) return; const h = rgbToHsv(c.r, c.g, c.b); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (c.a !== undefined) alpha.value = c.a } else if (v.startsWith('rgb')) { const m = v.match(/[\d.]+/g); if (!m || m.length < 3) return; const h = rgbToHsv(+m[0], +m[1], +m[2]); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (m[3] !== undefined) alpha.value = +m[3] } else if (v.startsWith('hsl')) { const m = v.match(/[\d.]+/g); if (!m || m.length < 3) return; const c = hslToRgb(+m[0], +m[1] / 100, +m[2] / 100); const h = rgbToHsv(c.r, c.g, c.b); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (m[3] !== undefined) alpha.value = +m[3] } } catch {/* */ } }
function parseGrad(v: string) {
    // Try enhanced format: linear-gradient(90deg, #xxx 0%, #yyy 100%)
    const linearM = v.match(/linear-gradient\(([^,]+),\s*(.+)\)/)
    if (linearM) {
        gradType.value = 'linear'
        const dirStr = linearM[1].trim()
        const angleM = dirStr.match(/^([\d.]+)deg$/)
        if (angleM) {
            gradAngle.value = Math.round(parseFloat(angleM[1]))
            // Try matching to a preset direction
            const matchedDir = dirs.find(d => d.v === `${Math.round(parseFloat(angleM[1]))}deg`)
            gradDir.value = matchedDir ? matchedDir.v : ''
        } else {
            gradDir.value = dirStr
            // Derive angle from direction
            const matched = dirs.find(d => d.v === dirStr)
            gradAngle.value = matched ? parseInt(matched.ang) : 90
        }
        const stopsStr = linearM[2].trim()
        const parsed = parseStopsStr(stopsStr)
        if (parsed.length > 0) { gradStops.value = parsed; activeStopIdx.value = 0; syncStopToPicker() }
        return
    }
    const radialM = v.match(/radial-gradient\(([^,]+),\s*(.+)\)/)
    if (radialM) {
        gradType.value = 'radial'
        const stopsStr = radialM[2].trim()
        const parsed = parseStopsStr(stopsStr)
        if (parsed.length > 0) { gradStops.value = parsed; activeStopIdx.value = 0; syncStopToPicker() }
        return
    }
    // Fallback: old format linear-gradient(to right, #xxx, #yyy)
    const m = v.match(/linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/)
    if (m) { gradType.value = 'linear'; gradDir.value = m[1].trim(); gradAngle.value = 90; gradStops.value = [{ color: m[2].trim(), position: 0 }, { color: m[3].trim(), position: 1 }]; activeStopIdx.value = 0; syncStopToPicker() }
}

function parseStopsStr(s: string): GradStop[] {
    const parts = s.split(',').map(p => p.trim()).filter(Boolean)
    const stops: GradStop[] = []
    for (const p of parts) {
        const m = p.match(/([^ ]+)\s+([\d.]+)%/)
        if (m) stops.push({ color: m[1], position: Math.max(0, Math.min(1, parseFloat(m[2]) / 100)) })
        else stops.push({ color: p, position: stops.length / Math.max(parts.length - 1, 1) })
    }
    return stops
}

function syncStopToPicker() {
    const idx = activeStopIdx.value
    if (idx < 0 || idx >= gradStops.value.length) return
    const c = gradStops.value[idx].color
    parseColor(c)
    // Copy parsed hsv to gradient picker hsv
    gHsv.h = hsv.h; gHsv.s = hsv.s; gHsv.v = hsv.v; gAlpha.value = alpha.value
}

function syncPickerToStop() {
    const idx = activeStopIdx.value
    if (idx < 0 || idx >= gradStops.value.length) return
    const hex = rgbToHex(gRgb.value.r, gRgb.value.g, gRgb.value.b, gAlpha.value < 1 ? gAlpha.value : undefined)
    gradStops.value[idx].color = hex
}

// Gradient stop drag
function onStopStart(idx: number, e: MouseEvent) {
    activeStopIdx.value = idx
    syncStopToPicker()
    const track = (e.target as HTMLElement).closest('.n-cp-stops-track') as HTMLElement
    const bar = track?.querySelector('.n-cp-stops-bar') as HTMLElement
    if (!bar) return
    const barRect = bar.getBoundingClientRect()
    const mv = (ev: MouseEvent) => {
        ev.preventDefault()
        const pos = Math.max(0, Math.min(1, (ev.clientX - barRect.left) / barRect.width))
        gradStops.value[idx].position = pos
    }
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up)
}

// Add stop by clicking bar
function onStopsBarClick(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement
    const rect = bar.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    // Interpolate color at position
    const sorted = [...gradStops.value].sort((a, b) => a.position - b.position)
    let color = sorted[0]?.color || '#000000'
    for (let i = 0; i < sorted.length - 1; i++) {
        if (pos >= sorted[i].position && pos <= sorted[i + 1].position) {
            const t = sorted[i + 1].position === sorted[i].position ? 0 : (pos - sorted[i].position) / (sorted[i + 1].position - sorted[i].position)
            color = interpolateColor(sorted[i].color, sorted[i + 1].color, t)
            break
        }
    }
    gradStops.value.push({ color, position: pos })
    activeStopIdx.value = gradStops.value.length - 1
    syncStopToPicker()
}

function interpolateColor(c1: string, c2: string, t: number): string {
    const rgb1 = hexToRgb(c1.startsWith('#') ? c1 : '#000000') as { r: number; g: number; b: number }
    const rgb2 = hexToRgb(c2.startsWith('#') ? c2 : '#ffffff') as { r: number; g: number; b: number }
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t)
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t)
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)
    return rgbToHex(r, g, b)
}

function removeStop(idx: number) {
    gradStops.value.splice(idx, 1)
    if (activeStopIdx.value >= gradStops.value.length) activeStopIdx.value = gradStops.value.length - 1
    if (activeStopIdx.value >= 0) syncStopToPicker()
}

function onGradAngle(e: Event) {
    let v = parseInt((e.target as HTMLInputElement).value)
    if (isNaN(v)) return
    v = Math.max(0, Math.min(360, v))
    gradAngle.value = v
    gradDir.value = ''
}

// PS-style angle ring drag
function onAngleRingStart(e: MouseEvent) {
    updateAngleFromEvent(e)
    const mv = (ev: MouseEvent) => { ev.preventDefault(); updateAngleFromEvent(ev) }
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }
    document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up)
}
function updateAngleFromEvent(e: MouseEvent) {
    const el = angleRingRef.value; if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90
    if (ang < 0) ang += 360
    // Snap to 15° increments when Shift is held
    if (e.shiftKey) ang = Math.round(ang / 15) * 15
    gradAngle.value = Math.round(ang) % 360
    gradDir.value = ''
}

function onGStopHexInput(e: Event) {
    const v = (e.target as HTMLInputElement).value.trim()
    if (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v)) {
        const c = hexToRgb(v) as any
        const h = rgbToHsv(c.r, c.g, c.b)
        gHsv.h = h.h; gHsv.s = h.s; gHsv.v = h.v
        if (c.a !== undefined) gAlpha.value = c.a
        syncPickerToStop()
    }
}

function onStopPosInput(e: Event) {
    let v = parseInt((e.target as HTMLInputElement).value)
    if (isNaN(v)) return
    v = Math.max(0, Math.min(100, v))
    if (activeStopIdx.value >= 0 && activeStopIdx.value < gradStops.value.length) {
        gradStops.value[activeStopIdx.value].position = v / 100
    }
}

// Gradient SV / Hue / Alpha drag handlers
function onGSvStart(e: MouseEvent) { updateGSv(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateGSv(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateGSv(e: MouseEvent) { const el = gSvPanelRef.value; if (!el) return; const r = el.getBoundingClientRect(); gHsv.s = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); gHsv.v = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)); syncPickerToStop() }
function onGHueStart(e: MouseEvent) { updateGHue(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateGHue(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateGHue(e: MouseEvent) { const el = gHueBarRef.value; if (!el) return; const r = el.getBoundingClientRect(); gHsv.h = Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360)); syncPickerToStop() }
function onGAlphaStart(e: MouseEvent) { updateGAlpha(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateGAlpha(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateGAlpha(e: MouseEvent) { const el = gAlphaBarRef.value; if (!el) return; const r = el.getBoundingClientRect(); gAlpha.value = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); syncPickerToStop() }

function toggleOpen() { if (!props.disabled) open.value = !open.value }
function selectPreset(c: string) { parseColor(c); alpha.value = 1; const out = fmtOut(rgb.value.r, rgb.value.g, rgb.value.b, alpha.value); emit('update:modelValue', out); emit('change', out); if (props.type === 'preset') open.value = false }
function handleClear() { emit('update:modelValue', undefined); emit('change', undefined); open.value = false }
function confirmColor() { const out = fmtOut(rgb.value.r, rgb.value.g, rgb.value.b, alpha.value); emit('update:modelValue', out); emit('change', out); open.value = false }
function confirmGrad() {
    const sorted = [...gradStops.value].sort((a, b) => a.position - b.position)
    const stops = sorted.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(',')
    let v: string
    if (gradType.value === 'radial') {
        v = `radial-gradient(circle, ${stops})`
    } else {
        const dirStr = gradDir.value || `${gradAngle.value}deg`
        v = `linear-gradient(${dirStr}, ${stops})`
    }
    emit('update:modelValue', v); emit('change', v); open.value = false
}

function onSvStart(e: MouseEvent) { updateSv(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateSv(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateSv(e: MouseEvent) { const el = svPanelRef.value; if (!el) return; const r = el.getBoundingClientRect(); hsv.s = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); hsv.v = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)) }
function onHueStart(e: MouseEvent) { updateHue(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateHue(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateHue(e: MouseEvent) { const el = hueBarRef.value; if (!el) return; const r = el.getBoundingClientRect(); hsv.h = Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360)) }
function onAlphaStart(e: MouseEvent) { updateAlpha(e); const mv = (ev: MouseEvent) => { ev.preventDefault(); updateAlpha(ev) }; const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up) }; document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up) }
function updateAlpha(e: MouseEvent) { const el = alphaBarRef.value; if (!el) return; const r = el.getBoundingClientRect(); alpha.value = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) }

function onHexInput(e: Event) { const v = (e.target as HTMLInputElement).value.trim(); if (/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v)) { parseColor(v); const c = hexToRgb(v) as any; if (c.a !== undefined) alpha.value = c.a } }
function onRgbInput(ch: 'r' | 'g' | 'b', e: Event) { let v = parseInt((e.target as HTMLInputElement).value); if (isNaN(v)) return; v = Math.max(0, Math.min(255, v)); const c = { ...rgb.value, [ch]: v }; const h = rgbToHsv(c.r, c.g, c.b); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v }
function onAlphaNum(e: Event) { let v = parseInt((e.target as HTMLInputElement).value); if (isNaN(v)) return; alpha.value = Math.max(0, Math.min(1, v / 100)) }
function onHslInput(ch: 'h' | 's' | 'l', e: Event) { let v = parseInt((e.target as HTMLInputElement).value); if (isNaN(v)) return; const h = { ...hslP.value, [ch]: ch === 'h' ? v : v / 100 }; const c = hslToRgb(h.h, h.s, h.l); const hv = rgbToHsv(c.r, c.g, c.b); hsv.h = hv.h; hsv.s = hv.s; hsv.v = hv.v }
function onGStop(_w: 'start' | 'end', _e: Event) { /* legacy, no-op */ }
function onGHex(_w: 'start' | 'end', _e: Event) { /* legacy, no-op */ }
function fmtCls(f: CPFmt) { return ['n-cp-ft', { 'n-cp-ft--a': inputFormat.value === f }] }
function onClickOutside(e: Event) { if (pickerRef.value && !pickerRef.value.contains(e.target as HTMLElement)) open.value = false }
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>


<style scoped>
.n-color-picker {
    position: relative;
    display: inline-block
}

.n-color-picker--sm .n-color-picker__trigger {
    height: 28px;
    font-size: 12px;
    padding: 0 8px
}

.n-color-picker--md .n-color-picker__trigger {
    height: 34px;
    font-size: 13px;
    padding: 0 10px
}

.n-color-picker--lg .n-color-picker__trigger {
    height: 40px;
    font-size: 14px;
    padding: 0 12px
}

.n-color-picker__trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 6px;
    background: var(--n-color-bg);
    cursor: pointer;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
    min-width: 120px
}

.n-color-picker--gradient .n-color-picker__trigger {
    min-width: 180px
}

.n-color-picker__trigger:hover {
    border-color: var(--n-color-primary)
}

.n-color-picker--open .n-color-picker__trigger {
    border-color: var(--n-color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, .1)
}

.n-color-picker--disabled .n-color-picker__trigger {
    opacity: .5;
    cursor: not-allowed
}

.n-color-picker__swatch {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 1px solid var(--n-color-border);
    flex-shrink: 0
}

.n-color-picker__text {
    flex: 1;
    font-size: inherit;
    color: var(--n-color-text-secondary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0
}

.n-color-picker__clear {
    color: var(--n-color-text-disabled);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
    transition: color .2s
}

.n-color-picker__clear:hover {
    color: var(--n-color-text-secondary)
}

.n-color-picker__dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: var(--n-color-bg);
    border: 1px solid var(--n-color-border);
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, .12), 0 2px 8px rgba(0, 0, 0, .06);
    padding: 14px;
    z-index: 1050;
    width: 232px
}

.n-color-picker--preset .n-color-picker__dropdown {
    width: auto;
    min-width: 200px
}

.n-color-picker--gradient .n-color-picker__dropdown {
    width: 280px
}

.n-cp-sv {
    position: relative;
    width: 100%;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    cursor: crosshair;
    margin-bottom: 10px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.06)
}

.n-cp-sv-hue {
    position: absolute;
    inset: 0
}

.n-cp-sv-white {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #fff, transparent)
}

.n-cp-sv-black {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #000, transparent)
}

.n-cp-sv-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 0 0 1.5px rgba(0, 0, 0, .2), 0 2px 6px rgba(0, 0, 0, .2);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 2
}

.n-cp-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px
}

.n-cp-bar-label {
    font-size: 11px;
    color: var(--n-color-text-disabled);
    width: 28px;
    flex-shrink: 0
}

.n-cp-hue {
    flex: 1;
    height: 12px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.06), 0 1px 0 rgba(255,255,255,.5)
}

.n-cp-alpha {
    flex: 1;
    height: 10px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    background-image: linear-gradient(45deg, #c0c0c0 25%, transparent 25%), linear-gradient(-45deg, #c0c0c0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #c0c0c0 75%), linear-gradient(-45deg, transparent 75%, #c0c0c0 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0
}

.n-cp-bar-thumb {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2.5px solid var(--n-color-primary);
    box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: box-shadow .15s
}

.n-cp-alpha-txt {
    font-size: 11px;
    color: var(--n-color-text-disabled);
    width: 32px;
    flex-shrink: 0;
    text-align: right
}

.n-cp-quick {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px
}

.n-cp-qi {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, .08);
    transition: transform .15s
}

.n-cp-qi:hover {
    transform: scale(1.25)
}

.n-cp-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px
}

.n-cp-preset {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
    transition: border-color .15s, transform .15s
}

.n-cp-preset:hover {
    transform: scale(1.15)
}

.n-cp-preset--sel {
    border-color: var(--n-color-primary)
}

.n-cp-preset-check {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, .5))
}

.n-cp-inputs {
    margin-bottom: 10px
}

.n-cp-fmt {
    display: flex;
    border: 1px solid var(--n-color-border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 6px
}

.n-cp-ft {
    flex: 1;
    padding: 3px 0;
    border: none;
    background: var(--n-color-bg);
    font-size: 11px;
    color: var(--n-color-text-disabled);
    cursor: pointer;
    transition: all .15s
}

.n-cp-ft:not(:last-child) {
    border-right: 1px solid var(--n-color-border)
}

.n-cp-ft--a {
    background: var(--n-color-primary);
    color: #fff
}

.n-cp-ft:hover:not(.n-cp-ft--a) {
    color: var(--n-color-text-secondary)
}

.n-cp-irow {
    display: flex;
    gap: 4px
}

.n-cp-hex {
    flex: 1;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    outline: none;
    font-family: monospace
}

.n-cp-hex:focus {
    border-color: var(--n-color-primary)
}

.n-cp-num {
    width: 0;
    flex: 1;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
    outline: none;
    text-align: center;
    font-family: monospace;
    -moz-appearance: textfield;
    appearance: textfield
}

.n-cp-num::-webkit-inner-spin-button,
.n-cp-num::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0
}

.n-cp-num:focus {
    border-color: var(--n-color-primary)
}

.n-cp-footer {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--n-color-border)
}

.n-cp-btn {
    padding: 5px 16px;
    border: 1px solid var(--n-color-border);
    border-radius: 6px;
    background: var(--n-color-bg);
    color: var(--n-color-text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s
}

.n-cp-btn:hover {
    border-color: var(--n-color-primary);
    color: var(--n-color-primary);
    box-shadow: 0 1px 3px rgba(59,130,246,.15)
}

.n-cp-btn--p {
    background: var(--n-color-primary);
    border-color: var(--n-color-primary);
    color: #fff
}

.n-cp-btn--p:hover {
    opacity: .9;
    color: #fff;
    box-shadow: 0 2px 6px rgba(59,130,246,.3)
}

.n-cp-gp {
    height: 48px;
    border-radius: 8px;
    margin-bottom: 12px;
    border: 1px solid var(--n-color-border);
    box-shadow: inset 0 1px 3px rgba(0,0,0,.06)
}

.n-cp-gtypes {
    display: flex;
    gap: 0;
    flex: 1;
    border: 1px solid var(--n-color-border);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,.04)
}

.n-cp-gtype {
    flex: 1;
    border: none;
    background: var(--n-color-bg);
    padding: 5px 0;
    font-size: 12px;
    font-weight: 500;
    color: var(--n-color-text-disabled);
    cursor: pointer;
    transition: all .2s
}

.n-cp-gtype:not(:last-child) {
    border-right: 1px solid var(--n-color-border)
}

.n-cp-gtype--a {
    background: var(--n-color-primary);
    color: #fff;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.1)
}

.n-cp-gtype:hover:not(.n-cp-gtype--a) {
    background: var(--n-color-fill);
    color: var(--n-color-text-secondary)
}



/* Stops track — container holds bar + markers on top */
.n-cp-stops-track {
    position: relative;
    height: 28px;
    margin: 4px 10px 14px;
    /* give extra vertical room for markers above/below the bar */
}

.n-cp-stops-bar {
    position: absolute;
    top: 8px;
    left: 0;
    right: 0;
    height: 12px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--n-color-border);
    box-shadow: inset 0 1px 3px rgba(0,0,0,.08)
}

.n-cp-stop {
    position: absolute;
    top: 0;
    width: 20px;
    height: 28px;
    transform: translateX(-50%);
    cursor: grab;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .12s ease
}

.n-cp-stop--active {
    z-index: 3;
    transform: translateX(-50%) scale(1.15)
}

.n-cp-stop-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 0 0 1px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.18);
    transition: all .15s ease
}

.n-cp-stop:hover .n-cp-stop-marker {
    box-shadow: 0 0 0 1px rgba(0,0,0,.18), 0 3px 8px rgba(0,0,0,.22)
}

.n-cp-stop--active .n-cp-stop-marker {
    border-color: #fff;
    box-shadow: 0 0 0 2.5px var(--n-color-primary), 0 2px 10px rgba(59,130,246,.35)
}

/* Stop editor panel */
.n-cp-stop-editor {
    margin-bottom: 8px;
    background: var(--n-color-fill);
    border-radius: 8px;
    padding: 10px;
    border: 1px solid var(--n-color-border)
}

.n-cp-stop-editor .n-cp-sv {
    height: 130px;
    margin-bottom: 8px;
    border-radius: 8px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,.08)
}

.n-cp-stop-editor .n-cp-bar {
    margin-bottom: 10px
}

.n-cp-stop-editor .n-cp-hue {
    height: 12px;
    border-radius: 6px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,.06)
}

.n-cp-stop-editor .n-cp-alpha {
    height: 12px;
    border-radius: 6px
}

.n-cp-stop-editor .n-cp-bar-thumb {
    width: 16px;
    height: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,.2)
}

.n-cp-stop-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px
}

.n-cp-stop-pos {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0
}

.n-cp-num--pos {
    width: 48px !important;
    flex: none !important
}

.n-cp-stop-pos-label {
    font-size: 11px;
    color: var(--n-color-text-disabled)
}

.n-cp-stop-del {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid var(--n-color-border);
    background: var(--n-color-bg);
    color: var(--n-color-text-disabled);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all .2s
}

.n-cp-stop-del:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2
}

/* Angle ring (PS-style) */
.n-cp-angle-ring-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 10px
}

.n-cp-angle-ring {
    position: relative;
    width: 80px;
    height: 80px;
    cursor: pointer;
    user-select: none
}

.n-cp-angle-svg {
    width: 100%;
    height: 100%;
    display: block
}

.n-cp-angle-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: 600;
    color: var(--n-color-text-secondary);
    pointer-events: none;
    font-variant-numeric: tabular-nums
}



.n-cp-ghex {
    flex: 1;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 6px;
    padding: 5px 8px;
    font-size: 12px;
    outline: none;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    background: var(--n-color-bg);
    transition: border-color .2s, box-shadow .2s
}

.n-cp-ghex:focus {
    border-color: var(--n-color-primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, .1)
}

.n-color-picker__fade-enter-active,
.n-color-picker__fade-leave-active {
    transition: all .15s ease
}

.n-color-picker__fade-enter-from,
.n-color-picker__fade-leave-to {
    opacity: 0;
    transform: translateY(-4px)
}
</style>