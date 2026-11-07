// Cena de referência aprovada pelo Davi em 2026-10-31 (canto do quarto com a mesa do computador).
// Serve de guia de estilo e de teste de regressão do motor: node tools/art/build.mjs --reference
import { createCanvas, hash, inside, PX, shaded } from '../lib.mjs'
import { K } from '../palette.mjs'

export function renderReferenceDesk() {
  const c = createCanvas({ width: 400, height: 320, ox: 184, oy: 132, outlineColor: K.outline, bg: K.bg })
  const { box, cylinder, blob, object } = c
  const RX = 52, RY = 40, WALL = 58
  const desk = { x0: 5, x1: 39, y0: 0, y1: 14 }

  object([box([0, RX, 0, RY, -3, 0], (f, x, y) => {
    if (f !== 'top') return f === 'y' ? K.wallBase : K.wallBaseSide
    const plank = Math.floor(y / 4)
    const off = hash(plank, 3) * 21
    const seg = Math.floor((x + off) / 21)
    if (y % 4 < PX * 1.2 || (x + off) % 21 < PX * 2) return K.floorSeam
    if (x < 1.2 || y < 1.2) return K.floorAO
    const shade = (inside(x, desk.x0 + 1, desk.x1 + 1.5) && inside(y, 0, desk.y1 + 1.5)) || (inside(x, 40, 48.5) && inside(y, 3, 14.5)) || (inside(x, 22, 32) && inside(y, 15, 25))
    const lit = inside(x, 1, 16) && inside(y - x * 0.35, 17, 33)
    const grain = hash(Math.floor(x * 2) + seg * 7, plank) > 0.86 && (y % 4) > 1 && (y % 4) < 3
    if (shade) return K.floorShadow
    if (lit) return grain ? K.floorA : plank % 2 ? K.floorLitA : K.floorLitB
    if (grain) return K.floorGrain
    return plank % 2 ? K.floorA : K.floorB
  })])

  object([
    box([-3, RX, -3, 0, -3, WALL], (f, x, z, [, x1]) => {
      if (f === 'top') return x > x1 - PX * 1.5 ? K.wallCapHi : K.wallCap
      if (f === 'x') return K.wallCapHi
      if (z < 3) return z > 3 - PX * 1.5 ? K.wallBaseHi : K.wallBase
      if (z < 4.5 || x < 1.2) return K.wallAO
      return Math.floor(x / 4) % 2 ? K.wallBack : K.wallBack2
    }),
    box([-3, 0, -3, RY, -3, WALL], (f, y, z, [, , , y1]) => {
      if (f === 'top') return y > y1 - PX * 1.5 ? K.wallCapHi : K.wallCap
      if (f === 'y') return K.wallCapHi
      if (z < 3) return z > 3 - PX * 1.5 ? K.wallBaseHi : K.wallBase
      if (z < 4.5 || y < 1.2) return K.wallAO
      if (y < 16) return K.wallLeftHi
      return Math.floor(y / 4) % 2 ? K.wallLeft : K.wallLeft2
    }),
  ])

  object([
    box([0, 2, 18, 34, 22, 48], (f, y, z) => {
      if (f !== 'x') return f === 'top' ? K.winFrame : K.winFrameSide
      const inGlass = inside(y, 20, 32) && inside(z, 24, 46)
      if (!inGlass) return z > 47.5 ? K.winFrameDark : K.winFrame
      if (inside(y, 25.5, 26.5) || inside(z, 34.5, 35.5)) return K.winFrame
      const d = y - z * 0.5
      if ((d > 4 && d < 5.5) || (d > 6.5 && d < 7)) return K.glassHi
      const cloud = ((y - 28) / 3) ** 2 + ((z - 42) / 1.6) ** 2 < 1 || ((y - 30) / 2.2) ** 2 + ((z - 43) / 1.4) ** 2 < 1
      if (cloud) return K.cloud
      return z > 40 ? K.sky : z > 30 ? K.glass : K.glass2
    }),
    box([0, 4, 17, 35, 20, 22], shaded({ top: K.sill, front: K.winFrameSide, front2: K.winFrameDark, side: K.sill, side2: K.winFrameSide, hi: K.winFrame })),
  ])
  for (const [y0, y1] of [[15, 18], [34, 37]]) {
    object([box([0, 1.5, y0, y1, 19, 50], (f, y, z) => {
      if (f !== 'x') return K.curtainDark
      const fold = Math.floor((y - y0) * 2) % 2
      return z > 48 ? K.curtainDark : fold ? K.curtain : (y - y0) < 0.8 ? K.curtainHi : K.curtainDark
    })])
  }

  const drawers = (f, x, z, bx) => {
    if (f === 'top') return K.woodTop
    if (f === 'x') return z < 4 ? K.woodSide2 : K.woodSide
    if (inside(z, 6.4, 6.4 + PX * 2) || x < bx[0] + PX * 2 || x > bx[1] - PX * 2) return K.woodSeam
    const mid = (bx[0] + bx[1]) / 2
    for (const hz of [9.6, 3.2]) {
      if (inside(x, mid - 1.6, mid + 1.6) && inside(z, hz, hz + 1)) return z > hz + 0.5 ? K.brass : K.brassDark
    }
    if (z > 12.4) return K.woodHi
    return z < 2 || inside(z, 6.4, 7.6) ? K.woodFront2 : K.woodFront
  }
  const slab = (f, p, q, bx) => {
    if (f === 'top') {
      if (p > bx[1] - PX * 1.5 || q > bx[3] - PX * 1.5) return K.woodHi
      const g = hash(Math.floor(p * 1.5), Math.floor(q * 2))
      if (Math.floor(q * 2) % 3 === 0 && g > 0.55) return K.woodGrain
      return Math.floor(q * 2) % 5 === 0 ? K.woodTop2 : K.woodTop
    }
    if (f === 'y') return q > bx[5] - PX * 1.5 ? K.woodHi : q < bx[4] + PX * 2 ? K.woodFront2 : K.woodFront
    return q < bx[4] + PX * 2 ? K.woodSide2 : K.woodSide
  }
  const wood = { top: K.woodTop, front: K.woodFront, front2: K.woodFront2, side: K.woodSide, side2: K.woodSide2 }
  object([
    box([16, 35, 1, 2, 3, 13], () => K.woodDark),
    box([6, 16, 1, 13, 0, 13], drawers),
    box([35, 38, 1, 13, 0, 13], shaded(wood)),
    box([desk.x0, desk.x1, desk.y0, desk.y1, 13, 16], slab),
  ])

  const book = (front, side) => shaded({ top: K.page, front, side })
  object([
    box([11.5, 15, 1, 5, 16, 17.5], book(K.book1, K.book1s)),
    box([11.8, 14.6, 1.3, 4.6, 17.5, 18.8], book(K.book2, K.book2s)),
    box([12, 14.8, 1.1, 4.4, 18.8, 20.2], book(K.book3, K.book3s)),
  ])
  const leaves = { color: K.leaf, hi: K.leafHi, dark: K.leafDark }
  object([
    cylinder([9, 3.5, 2.1, 16, 21], { top: K.soil, side: K.pot, lit: K.potLit, dark: K.potSide }),
    ...[
      [9, 3.5, 25, 7, 5], [7.4, 2.6, 23.5, 6, 4], [10.6, 4.2, 23.5, 6, 4], [8.2, 4.8, 22.5, 5, 3.5],
      [9.8, 2.2, 27, 5, 4], [8.6, 3.2, 28.5, 4, 3.5], [10.2, 3.8, 26.5, 4, 3],
    ].map((b) => blob(b, leaves)),
  ])

  const codeLines = [
    [[0, 3, K.pink], [4, 6, K.glow]], [[2, 4, K.glow], [5, 9, K.accent]], [[2, 7, K.green]], [[4, 6, K.glow], [7, 10, K.dim]],
    [[4, 9, K.accent]], [[2, 3, K.glow]], [[0, 1, K.pink]], [[0, 4, K.glow], [5, 8, K.green]], [[2, 6, K.dim]],
  ]
  const metal = { top: K.monTop, front: K.monBody, side: K.monSide }
  object([
    box([19, 28, 3, 7, 16, 16.8], shaded({ ...metal, hi: K.chairBaseHi })),
    box([22.5, 24.5, 3, 4.5, 16.8, 21], shaded(metal)),
    box([15, 32, 3, 4.8, 21, 36], (f, x, z, bx) => {
      if (f === 'top') return K.monTop
      if (f === 'x') return K.monSide
      const sx0 = bx[0] + 0.9, sx1 = bx[1] - 0.9, sz0 = 22.2, sz1 = 35
      if (!(inside(x, sx0, sx1) && inside(z, sz0, sz1))) return z > bx[5] - PX ? K.monTop : K.monBezel
      if (z > sz1 - 1.6) return inside(x, sx0 + 0.5, sx0 + 1.2) ? K.pink : inside(x, sx0 + 1.6, sx0 + 2.3) ? K.accent : K.bar
      if (x < sx0 + 1.6) return K.screenHi
      const row = Math.floor((sz1 - 1.6 - z) / 1.2)
      const within = (sz1 - 1.6 - z) % 1.2 < 0.6
      const col = (x - sx0 - 2.2) / 1.05
      if (within && codeLines[row]) for (const [a, b, color] of codeLines[row]) if (col >= a && col < b) return color
      const d = (x - sx0) - (z - sz0) * 1.3
      if (d > 9 && d < 10.5) return K.screenHi
      return K.screen
    }),
  ])
  object([box([15, 29, 8, 12, 16, 17.2], (f, x, y, bx) => {
    if (f === 'y') return K.keySide
    if (f === 'x') return K.keyDark
    const kx = x - bx[0] - 0.6, ky = y - bx[2] - 0.5
    if (kx < 0 || ky < 0 || kx > 12.8 || ky > 3) return K.keyTop
    const row = Math.floor(ky / 0.75)
    if (row === 3 && kx > 3 && kx < 9.5) return (ky % 0.75) < 0.5 ? K.keyKey : K.keyGap
    if ((kx % 1) < 0.72 && (ky % 0.75) < 0.5) return K.keyKey
    return K.keyGap
  })])
  object([cylinder([32, 10.2, 0.9, 16, 17], { top: K.keyKey, side: K.keySide, lit: K.keyTop, dark: K.keyDark })])
  object([cylinder([34, 4.5, 1.6, 16, 21], {
    top: (u, v) => (u * u + v * v < 0.55 ? (u + v < -0.3 ? K.coffeeHi : K.coffee) : K.mugTop),
    side: K.mugSide, lit: K.mugLit, dark: K.mugDark,
  })])

  const lamp = { top: K.lampHi, side: K.lampBody, lit: K.lampHi, dark: K.lampSide }
  object([
    cylinder([37, 2, 1.4, 16, 16.8], lamp),
    box([36.6, 37.4, 1.6, 2.4, 16.8, 26], shaded({ top: K.lampHi, front: K.lampBody, side: K.lampSide })),
    cylinder([36, 3, 1.8, 24, 27.5], lamp),
    cylinder([36, 3, 1.1, 23.6, 24], { top: K.bulb, side: K.bulb, lit: K.bulb, dark: K.bulb }),
  ])

  object([box([40, 47, 4, 13, 0, 20], (f, a, b, bx) => {
    if (f === 'top') return a > bx[1] - PX * 1.5 || b > bx[3] - PX * 1.5 ? K.towerHi : K.towerTop
    if (f === 'x') return K.towerSide
    if (inside(a, 41, 41 + PX * 2) && inside(b, 4, 18)) return b > 11 ? K.ledHi : K.led
    if (inside(b, 15.5, 17) && inside(a, 43, 45.5)) return K.vent
    if (inside(a, 42.5, 46) && inside(b, 3, 12) && (b % 1.2) < 0.6) return K.vent
    return b > bx[5] - PX ? K.towerHi : K.towerFront
  })])

  const base = shaded({ top: K.chairBaseHi, front: K.chairBase, side: K.chairBaseSide })
  const wheel = { top: K.chairBaseHi, side: K.chairBase, lit: K.chairBaseHi, dark: K.chairBaseSide }
  object([
    box([21, 32, 18.6, 19.9, 0.6, 1.6], base),
    box([25.85, 27.15, 14, 25, 0.6, 1.6], base),
    ...[[21.3, 19.25], [31.7, 19.25], [26.5, 14.4], [26.5, 24.6]].map(([x, y]) => cylinder([x, y, 0.55, 0, 0.8], wheel)),
    cylinder([26.5, 19.25, 0.7, 1.6, 9], wheel),
    box([22, 31, 15, 23, 9, 12], (f, p, q, bx) => {
      if (f === 'top') return p > bx[1] - PX * 1.5 || q > bx[3] - PX * 1.5 ? K.chairTop : inside(q, 18.8, 18.8 + PX * 2) ? K.chairSeam : K.chairLit
      if (f === 'y') return q > bx[5] - PX ? K.chairTop : K.chair
      return K.chairSide
    }),
    box([22.5, 30.5, 22, 24, 12, 27], (f, x, z, bx) => {
      if (f === 'top') return K.chairTop
      if (f === 'x') return K.chairSide
      if (z > bx[5] - PX * 1.5 || x < bx[0] + PX * 1.5) return K.chairTop
      if (inside(z, 19, 19 + PX * 2)) return K.chairSeam
      return z > 19 ? K.chairLit : K.chair
    }),
  ])

  return c
}
