import { describe, expect, it } from 'vitest'
import { pickCloseupLayout, screenFontSize, type CloseupGeometry, type CloseupLayout } from '@/ui/closeup/layout'
import { bootSequence, parseCloseupSheet, parseOverlay, resolveSibling, SPEC, toRect, type CloseupSheet } from '@/ui/closeup/sheet'
import computerJson from '../public/assets/ui/closeup-computer.json'
import steamJson from '../public/assets/ui/closeup-computer-steam.json'

const GEO: CloseupGeometry = { size: SPEC.size, contentRect: SPEC.contentRect, crops: SPEC.crops }
const JSON_URL = 'assets/ui/closeup-computer.json'
const FRAME_URL = 'assets/ui/closeup-computer-frame.png'

const inside = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
  a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h

describe('closeup/layout.pickCloseupLayout (specs.md §3)', () => {
  it('1920×1080 → modo A, escala 6, conteúdo 1344×756', () => {
    const l = pickCloseupLayout(1920, 1080, GEO)
    expect(l.mode).toBe('A')
    expect(l.scale).toBe(6)
    expect(l.view).toEqual({ x: 0, y: 0, w: 1920, h: 1080 })
    expect(l.content).toEqual({ x: 48 * 6, y: 11 * 6, w: 224 * 6, h: 126 * 6 })
  })
  it('1920×950 (área útil do navegador) → A 5× com a tela em 1120×630', () => {
    const l = pickCloseupLayout(1920, 950, GEO)
    expect([l.mode, l.scale]).toEqual(['A', 5])
    expect([l.content.w, l.content.h]).toEqual([1120, 630])
  })
  it('1366×768 → A 4×; 1366×657 → A 3× (672×378)', () => {
    expect(pickCloseupLayout(1366, 768, GEO)).toMatchObject({ mode: 'A', scale: 4 })
    const l = pickCloseupLayout(1366, 657, GEO)
    expect([l.mode, l.scale, l.content.w, l.content.h]).toEqual(['A', 3, 672, 378])
  })
  it('768×1024 (tablet em retrato) → modo B 3×: recorte do monitor 744×540, tela 672×378', () => {
    const l = pickCloseupLayout(768, 1024, GEO)
    expect(l.mode).toBe('B')
    expect(l.scale).toBe(3)
    expect(l.crop).toEqual(SPEC.crops.monitor)
    expect(l.view).toEqual({ x: 12, y: 242, w: 744, h: 540 })
    // Conteúdo relativo ao recorte: (48 − 36, 11 − 0) × 3.
    expect(l.content).toEqual({ x: 12 + 36, y: 242 + 33, w: 672, h: 378 })
  })
  it('375×812 e 360×740 → modo C (sem ilustração, conteúdo na tela toda)', () => {
    for (const [w, h] of [[375, 812], [360, 740], [812, 375]]) {
      const l = pickCloseupLayout(w, h, GEO)
      expect(l.mode, `${w}×${h}`).toBe('C')
      expect(l.scale).toBe(0)
      expect(l.content).toEqual({ x: 0, y: 0, w, h })
    }
  })
  it('limiar do modo A em 960×540 (3×) e queda para C logo abaixo', () => {
    expect(pickCloseupLayout(960, 540, GEO)).toMatchObject({ mode: 'A', scale: 3 })
    // 959×539: A e B dão escala 2 (< minScale 3) → C
    expect(pickCloseupLayout(959, 539, GEO).mode).toBe('C')
  })
  it('respeita minContent e minScale do JSON', () => {
    // Com os padrões, 700×400 cai em C; com mínimos menores, cabe em A 2×.
    expect(pickCloseupLayout(700, 400, GEO).mode).toBe('C')
    const loose = { ...GEO, minScale: 2, minContent: { w: 400, h: 200 } }
    expect(pickCloseupLayout(700, 400, loose)).toMatchObject({ mode: 'A', scale: 2 })
    // Mínimo de conteúdo maior que a escala permite → passa para o próximo modo.
    const strict = { ...GEO, minContent: { w: 1400, h: 800 } }
    expect(pickCloseupLayout(1920, 1080, strict).mode).toBe('C')
  })
  it('invariantes: escala inteira, tudo em px inteiros, conteúdo ≥ 640×360 e dentro do recorte', () => {
    for (let w = 320; w <= 2560; w += 37) {
      for (let h = 320; h <= 1440; h += 41) {
        const l = pickCloseupLayout(w, h, GEO)
        if (l.mode === 'C') continue
        const tag = `${w}×${h}`
        expect(Number.isInteger(l.scale) && l.scale >= 3, tag).toBe(true)
        for (const v of [...Object.values(l.view), ...Object.values(l.content)]) expect(Number.isInteger(v), tag).toBe(true)
        expect(l.content.w, tag).toBeGreaterThanOrEqual(640)
        expect(l.content.h, tag).toBeGreaterThanOrEqual(360)
        expect(inside(l.view, { x: 0, y: 0, w, h }), tag).toBe(true)
        expect(inside(l.content, l.view), tag).toBe(true)
        // A prefere B só quando A não cabe.
        if (l.mode === 'B') expect(Math.floor(Math.min(w / 320, h / 180)) * 224 < 640 || Math.floor(Math.min(w / 320, h / 180)) < 3, tag).toBe(true)
      }
    }
  })
})

describe('closeup/layout.screenFontSize', () => {
  const at = (mode: CloseupLayout['mode'], scale: number) => ({ ...pickCloseupLayout(1920, 1080, GEO), mode, scale })
  it('modo C: 16 px', () => {
    expect(screenFontSize(pickCloseupLayout(375, 812, GEO))).toBe(16)
  })
  it('4 px de arte por letra, mínimo 14 px', () => {
    expect(screenFontSize(at('A', 3))).toBe(14)
    expect(screenFontSize(at('B', 3))).toBe(14)
    expect(screenFontSize(at('A', 4))).toBe(16)
    expect(screenFontSize(at('A', 5))).toBe(20)
    expect(screenFontSize(at('A', 6))).toBe(24)
  })
})

describe('closeup/sheet helpers', () => {
  it('toRect aceita array e objeto, com fallback', () => {
    const d = { x: 1, y: 2, w: 3, h: 4 }
    expect(toRect([5, 6, 7, 8], d)).toEqual({ x: 5, y: 6, w: 7, h: 8 })
    expect(toRect({ x: 5, w: 7 }, d)).toEqual({ x: 5, y: 2, w: 7, h: 4 })
    expect(toRect([1, 2, 3], d)).toEqual(d)
    expect(toRect(null, d)).toEqual(d)
  })
  it('resolveSibling resolve relativo ao JSON e mantém absolutos', () => {
    expect(resolveSibling('assets/ui/a.json', 'b.png')).toBe('assets/ui/b.png')
    expect(resolveSibling('a.json', 'b.png')).toBe('b.png')
    expect(resolveSibling('assets/ui/a.json', '/x/b.png')).toBe('/x/b.png')
    expect(resolveSibling('assets/ui/a.json', 'data:image/png;base64,AA')).toBe('data:image/png;base64,AA')
  })
})

describe('closeup/sheet.parseCloseupSheet', () => {
  const sheet = parseCloseupSheet(computerJson, JSON_URL, FRAME_URL)

  it('lê o JSON gerado (public/assets/ui/closeup-computer.json)', () => {
    expect(sheet.image).toBe('assets/ui/closeup-computer.png')
    expect(sheet.size).toEqual({ w: 320, h: 180 })
    expect(sheet.sheet).toEqual({ w: 8 * 320, h: 180 })
    expect(sheet.contentRect).toEqual(SPEC.contentRect)
    expect(sheet.crops).toEqual(SPEC.crops)
    expect(sheet.minContent).toEqual(SPEC.minContent)
    expect(sheet.minScale).toBe(3)
  })
  it('tags na ordem do arquivo com frames lado a lado', () => {
    expect(Object.keys(sheet.tags).sort()).toEqual(['boot', 'boot-night', 'off', 'off-night', 'on', 'on-night'])
    expect(sheet.tags.off.map((f) => f.x)).toEqual([0])
    expect(sheet.tags.boot).toEqual([{ x: 320, y: 0, duration: 60 }, { x: 640, y: 0, duration: 60 }])
    expect(sheet.tags.on.map((f) => f.x)).toEqual([960])
    expect(sheet.tags['boot-night'].map((f) => f.x)).toEqual([1600, 1920])
    expect(sheet.tags['on-night'].map((f) => f.x)).toEqual([2240])
  })
  it('9-slice: aceita `slices` (objeto) e resolve a imagem ao lado do JSON', () => {
    expect(sheet.frame9.image).toBe('assets/ui/closeup-computer-frame.png')
    expect(sheet.frame9.size).toEqual({ w: 48, h: 48 })
    expect(sheet.frame9.slice).toEqual({ top: 9, right: 8, bottom: 15, left: 8 })
    expect(sheet.frame9.scale).toBe(2)
  })
  it('JSON vazio ou inválido cai nos valores da spec', () => {
    for (const bad of [null, 42, 'x', [], {}]) {
      const s = parseCloseupSheet(bad, JSON_URL, FRAME_URL)
      expect(s.size).toEqual(SPEC.size)
      expect(s.contentRect).toEqual(SPEC.contentRect)
      expect(s.crops.full).toEqual({ x: 0, y: 0, w: 320, h: 180 })
      expect(s.crops.monitor).toEqual(SPEC.crops.monitor)
      expect(s.tags).toEqual({})
      expect(s.frame9.image).toBe(FRAME_URL)
      expect(s.frame9.slice).toEqual(SPEC.frame9.slice)
    }
  })
  // BUG (relatório QA M2): sem `meta.image`, o fallback `jsonUrl.replace('.json', '.png')` passa por
  // resolveSibling e ganha o diretório duas vezes ("assets/ui/assets/ui/closeup-computer.png").
  it('sem meta.image, a imagem é o PNG com o mesmo nome do JSON', () => {
    expect(parseCloseupSheet({ meta: {} }, JSON_URL, FRAME_URL).image).toBe('assets/ui/closeup-computer.png')
  })
  it('formato Array do Aseprite, sem frameTags: o 1º frame vira `on`', () => {
    const s = parseCloseupSheet(
      {
        frames: [
          { frame: { x: 0, y: 0, w: 100, h: 50 }, sourceSize: { w: 100, h: 50 }, duration: 80 },
          { frame: { x: 100, y: 0, w: 100, h: 50 }, duration: 80 },
        ],
        meta: { image: 'other.png', quartoPixel: { contentRect: [1, 2, 3, 4], frame9: { slice: [1, 2, 3, 4], scale: 3 } } },
      },
      JSON_URL,
      FRAME_URL,
    )
    expect(s.image).toBe('assets/ui/other.png')
    expect(s.size).toEqual({ w: 100, h: 50 })
    expect(s.sheet).toEqual({ w: 200, h: 50 })
    expect(s.tags).toEqual({ on: [{ x: 0, y: 0, duration: 80 }] })
    expect(s.contentRect).toEqual({ x: 1, y: 2, w: 3, h: 4 })
    expect(s.crops.full).toEqual({ x: 0, y: 0, w: 100, h: 50 })
    expect(s.frame9.slice).toEqual({ top: 1, right: 2, bottom: 3, left: 4 })
    expect(s.frame9.scale).toBe(3)
  })
})

describe('closeup/sheet.parseOverlay', () => {
  it('vapor da caneca: 3 frames de 12×12 a 200 ms em (68, 134)', () => {
    const ref = (computerJson.meta.quartoPixel as { steam?: unknown }).steam
    const o = parseOverlay(ref, steamJson, 'assets/ui/closeup-computer-steam.json')
    expect(o).toEqual({
      image: 'assets/ui/closeup-computer-steam.png',
      at: { x: 68, y: 134 },
      frame: { w: 12, h: 12 },
      count: 3,
      duration: 200,
    })
  })
  it('sem referência válida: undefined', () => {
    expect(parseOverlay(undefined, steamJson, 'x.json')).toBeUndefined()
    expect(parseOverlay({ at: [0, 0] }, steamJson, 'x.json')).toBeUndefined()
  })
})

describe('closeup/sheet.bootSequence', () => {
  const tags = parseCloseupSheet(computerJson, JSON_URL, FRAME_URL).tags
  it('dia: boot (2 × 60 ms) e depois on', () => {
    const s = bootSequence(tags, false, false)
    expect(s.boot.map((f) => [f.x, f.duration])).toEqual([[320, 60], [640, 60]])
    expect(s.on?.x).toBe(960)
  })
  it('noite: variantes -night pré-tingidas', () => {
    const s = bootSequence(tags, true, false)
    expect(s.boot.map((f) => f.x)).toEqual([1600, 1920])
    expect(s.on?.x).toBe(2240)
  })
  it('reduced motion: sem boot, direto para on', () => {
    expect(bootSequence(tags, false, true)).toEqual({ boot: [], on: tags.on[0] })
    expect(bootSequence(tags, true, true)).toEqual({ boot: [], on: tags['on-night'][0] })
  })
  it('encurta na proporção para caber em maxMs', () => {
    const long: CloseupSheet['tags'] = {
      boot: [{ x: 1, y: 0, duration: 200 }, { x: 2, y: 0, duration: 400 }],
      on: [{ x: 3, y: 0, duration: 100 }],
    }
    const s = bootSequence(long, false, false)
    expect(s.boot.map((f) => f.duration)).toEqual([100, 200])
    expect(s.boot.reduce((n, f) => n + f.duration, 0)).toBeLessThanOrEqual(300)
    expect(bootSequence(long, false, false, 1000).boot.map((f) => f.duration)).toEqual([200, 400])
  })
  it('noite sem variantes usa as de dia; sem `on` usa `off`; sem tags nada', () => {
    const dayOnly: CloseupSheet['tags'] = { boot: [{ x: 1, y: 0, duration: 10 }], off: [{ x: 0, y: 0, duration: 10 }] }
    const s = bootSequence(dayOnly, true, false)
    expect(s.boot.map((f) => f.x)).toEqual([1])
    expect(s.on?.x).toBe(0)
    expect(bootSequence({}, false, false)).toEqual({ boot: [], on: undefined })
  })
})
