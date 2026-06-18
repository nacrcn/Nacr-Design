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
                    <div class="n-cp-gp" :style="gradPreviewStyle" />
                    <div class="n-cp-bar"><span class="n-cp-bar-label">方向</span>
                        <div class="n-cp-dirs">
                            <button v-for="d in dirs" :key="d.v"
                                :class="['n-cp-dir', { 'n-cp-dir--a': gradDir === d.v }]" :title="d.v"
                                :style="{ transform: `rotate(${d.ang})` }" @click="gradDir = d.v">→</button>
                        </div>
                    </div>
                    <div class="n-cp-gstop">
                        <span class="n-cp-glabel">起始色</span>
                        <label class="n-cp-nwrap"><span class="n-cp-nswatch" :style="{ background: gradStart }" /><input
                                type="color" :value="gradStart" class="n-cp-native"
                                @input="onGStop('start', $event)" /></label>
                        <input :value="gradStart" class="n-cp-ghex" @change="onGHex('start', $event)" />
                    </div>
                    <div class="n-cp-gstop">
                        <span class="n-cp-glabel">结束色</span>
                        <label class="n-cp-nwrap"><span class="n-cp-nswatch" :style="{ background: gradEnd }" /><input
                                type="color" :value="gradEnd" class="n-cp-native"
                                @input="onGStop('end', $event)" /></label>
                        <input :value="gradEnd" class="n-cp-ghex" @change="onGHex('end', $event)" />
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
const gradPreviewStyle = computed(() => ({ background: `linear-gradient(${gradDir.value},${gradStart.value},${gradEnd.value})` }))

watch(() => props.modelValue, v => { if (!v) return; props.type === 'gradient' ? parseGrad(v) : parseColor(v) }, { immediate: true })

function parseColor(v: string) { try { if (v.startsWith('#')) { const c = hexToRgb(v) as any; if (isNaN(c.r)) return; const h = rgbToHsv(c.r, c.g, c.b); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (c.a !== undefined) alpha.value = c.a } else if (v.startsWith('rgb')) { const m = v.match(/[\d.]+/g); if (!m || m.length < 3) return; const h = rgbToHsv(+m[0], +m[1], +m[2]); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (m[3] !== undefined) alpha.value = +m[3] } else if (v.startsWith('hsl')) { const m = v.match(/[\d.]+/g); if (!m || m.length < 3) return; const c = hslToRgb(+m[0], +m[1] / 100, +m[2] / 100); const h = rgbToHsv(c.r, c.g, c.b); hsv.h = h.h; hsv.s = h.s; hsv.v = h.v; if (m[3] !== undefined) alpha.value = +m[3] } } catch {/* */ } }
function parseGrad(v: string) { const m = v.match(/linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/); if (!m) return; gradDir.value = m[1].trim(); gradStart.value = m[2].trim(); gradEnd.value = m[3].trim() }

function toggleOpen() { if (!props.disabled) open.value = !open.value }
function selectPreset(c: string) { parseColor(c); alpha.value = 1; const out = fmtOut(rgb.value.r, rgb.value.g, rgb.value.b, alpha.value); emit('update:modelValue', out); emit('change', out); if (props.type === 'preset') open.value = false }
function handleClear() { emit('update:modelValue', undefined); emit('change', undefined); open.value = false }
function confirmColor() { const out = fmtOut(rgb.value.r, rgb.value.g, rgb.value.b, alpha.value); emit('update:modelValue', out); emit('change', out); open.value = false }
function confirmGrad() { const v = `linear-gradient(${gradDir.value},${gradStart.value},${gradEnd.value})`; emit('update:modelValue', v); emit('change', v); open.value = false }

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
function onGStop(w: 'start' | 'end', e: Event) { const v = (e.target as HTMLInputElement).value; if (w === 'start') gradStart.value = v; else gradEnd.value = v }
function onGHex(w: 'start' | 'end', e: Event) { const v = (e.target as HTMLInputElement).value.trim(); if (/^#[0-9a-fA-F]{6}$/.test(v)) { if (w === 'start') gradStart.value = v; else gradEnd.value = v } }
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
    top: calc(100% + 4px);
    left: 0;
    background: var(--n-color-bg);
    border: 1px solid var(--n-color-border);
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .1);
    padding: 12px;
    z-index: 1050;
    width: 232px
}

.n-color-picker--preset .n-color-picker__dropdown {
    width: auto;
    min-width: 200px
}

.n-color-picker--gradient .n-color-picker__dropdown {
    width: 264px
}

.n-cp-sv {
    position: relative;
    width: 100%;
    height: 150px;
    border-radius: 6px;
    overflow: hidden;
    cursor: crosshair;
    margin-bottom: 10px
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
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .3), 0 2px 4px rgba(0, 0, 0, .2);
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
    height: 10px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)
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
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--n-color-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
    transform: translate(-50%, -50%);
    pointer-events: none
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
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 8px
}

.n-cp-btn {
    padding: 4px 14px;
    border: 1px solid var(--n-color-border);
    border-radius: 4px;
    background: var(--n-color-bg);
    color: var(--n-color-text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all .15s
}

.n-cp-btn:hover {
    border-color: var(--n-color-primary);
    color: var(--n-color-primary)
}

.n-cp-btn--p {
    background: var(--n-color-primary);
    border-color: var(--n-color-primary);
    color: #fff
}

.n-cp-btn--p:hover {
    opacity: .85;
    color: #fff
}

.n-cp-gp {
    height: 64px;
    border-radius: 6px;
    margin-bottom: 10px
}

.n-cp-dirs {
    display: flex;
    gap: 4px;
    flex: 1
}

.n-cp-dir {
    width: 24px;
    height: 24px;
    border: 1px solid var(--n-color-border);
    border-radius: 4px;
    background: var(--n-color-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all .15s
}

.n-cp-dir--a {
    background: var(--n-color-primary);
    color: #fff;
    border-color: var(--n-color-primary)
}

.n-cp-dir:hover:not(.n-cp-dir--a) {
    border-color: var(--n-color-primary);
    color: var(--n-color-primary)
}

.n-cp-gstop {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px
}

.n-cp-glabel {
    font-size: 12px;
    color: var(--n-color-text-secondary);
    width: 42px;
    flex-shrink: 0
}

.n-cp-nwrap {
    position: relative;
    cursor: pointer;
    display: inline-block
}

.n-cp-nswatch {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--n-color-border);
    display: block
}

.n-cp-native {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%
}

.n-cp-ghex {
    flex: 1;
    border: 1px solid var(--n-color-border-hover);
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    outline: none;
    font-family: monospace
}

.n-cp-ghex:focus {
    border-color: var(--n-color-primary)
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