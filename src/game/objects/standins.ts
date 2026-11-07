import type * as Phaser from 'phaser'
import { ROOM_SPRITES, type RoomSpriteKey } from '../assets'
import { unitsToScreen } from '../iso'

// Stand-ins dos sprites do quarto, para quando o PNG + JSON do art-director ainda não existe.
// Seguem o MESMO contrato dos arquivos gerados (docs/arte/biblia-de-arte.md e specs.md):
// canvas sem trim, frames "<chave> <n>", pivot inteiro = âncora, `meta.quartoPixel` com
// footprint/focus, camadas com o mesmo canvas e âncora do principal. Formas simples (caixas
// isométricas em unidades do gerador, como nas specs) com a paleta oficial.
// Quando o arquivo real existe, nada daqui roda.

type Box = [x0: number, x1: number, y0: number, y1: number, z0: number, z1: number]
interface Part {
  box: Box
  // Cores: topo, face +y (frente-esquerda), face +x (direita).
  top: string
  front: string
  side: string
}

const C = {
  outline: '#2a1b2a',
  graphite0: '#1f1c28',
  graphite1: '#2f2c3a',
  graphite2: '#4a4659',
  wood0: '#5a2e22',
  wood1: '#7a472b',
  wood2: '#97502c',
  wood4: '#b8733e',
  wood5: '#c87138',
  wood6: '#e8944a',
  gold1: '#e9c46a',
  gold0: '#c09a45',
  mauve0: '#4a3240',
  mauve1: '#6d5560',
  wall2: '#a9c1c6',
  wall4: '#c9d8da',
  cream0: '#a79f94',
  cream1: '#c8b89c',
  cream2: '#e7e1d8',
  cream3: '#f6f2ec',
  sky0: '#5ec4d6',
  sky1: '#8fd3e8',
  teal0: '#132f3d',
  teal1: '#1f4a5c',
  teal2: '#2b5f74',
  teal3: '#5f97a3',
  red0: '#83303a',
  red1: '#b04049',
  red2: '#c84f57',
} as const

const part = (box: Box, top: string, front: string, side: string): Part => ({ box, top, front, side })
const wood = (box: Box) => part(box, C.wood6, C.wood5, C.wood2)
const graphite = (box: Box) => part(box, C.graphite2, C.graphite1, C.graphite0)

interface StandInLayer {
  parts: Part[]
  outline?: boolean
}

interface StandInSpec {
  layers: StandInLayer[]
  // Âncora em unidades (x, y, z): vai no pivot.
  anchor: [number, number, number]
  margin: number
  // Caixas extras que só entram no tamanho do canvas (camadas do mesmo grupo).
  extent?: Box[]
  meta: Record<string, unknown>
  // Caixa de foco em unidades → `meta.quartoPixel.focus` em px do canvas.
  focusBox?: Box
}

// --- grupo do computador (specs.md §1) -------------------------------------------------------
const COMPUTER_PARTS: Part[] = [
  part([14, 29, 1, 2, 3, 13], C.wood0, C.wood0, C.wood0),
  part([1, 2, 14, 19, 3, 13], C.wood0, C.wood0, C.wood0),
  part([1, 13, 19, 29, 0, 13], C.wood5, C.wood5, C.wood2),
  wood([29, 32, 1, 13, 0, 13]),
  wood([0, 32, 0, 14, 13, 16]),
  wood([0, 14, 14, 30, 13, 16]),
  graphite([15, 24, 3, 7, 16, 16.8]),
  graphite([18.5, 20.5, 3, 4.5, 16.8, 21]),
  part([11, 28, 3, 4.8, 21, 36], C.graphite2, C.teal0, C.graphite0),
  part([3.4, 6.6, 1.9, 5.1, 16, 21], C.cream3, C.cream2, C.cream0),
  graphite([3, 9, 7, 10.5, 16, 17.2]),
  part([12.5, 26.5, 8, 12, 16, 17.2], C.cream2, C.cream1, C.cream0),
  part([28.6, 30.4, 9.3, 11.1, 16, 17], C.cream3, C.cream2, C.cream0),
]
const LAMP_PARTS: Part[] = [
  part([0.6, 3.4, 26.6, 29.4, 16, 16.8], C.teal3, C.teal2, C.teal1),
  part([1.6, 2.4, 27.6, 28.4, 16.8, 26], C.teal3, C.teal2, C.teal1),
  part([0.7, 4.3, 26.2, 29.8, 24, 27.5], C.teal3, C.teal2, C.teal1),
]
const COMPUTER_EXTENT: Box[] = [...COMPUTER_PARTS, ...LAMP_PARTS].map((p) => p.box)
const COMPUTER_ANCHOR: [number, number, number] = [16, 16, 0]

const SPECS: Partial<Record<RoomSpriteKey, StandInSpec>> = {
  'room-shell': {
    anchor: [0, 0, 0],
    margin: 0,
    layers: [
      {
        parts: [
          // parede do fundo (direita, plano row = 0): face visível = +y
          part([-3, 56, -3, 0, -3, 72], C.mauve0, C.wall2, C.mauve1),
          // parede esquerda (plano col = 0): face visível = +x
          part([-3, 0, -3, 56, -3, 72], C.mauve0, C.mauve1, C.wall4),
          // piso (7×7 tiles = 56 u) com 6 px de espessura
          part([0, 56, 0, 56, -3, 0], C.wood4, C.mauve1, C.mauve0),
        ],
      },
    ],
    meta: { footprint: [[0, 0, 7, 7]], mount: 'floor' },
  },
  window: {
    anchor: [46, 0, 0],
    margin: 0,
    layers: [
      {
        parts: [
          part([37, 40, -0.4, 0.4, 23, 60], C.gold1, C.gold1, C.gold0),
          part([40, 52, -0.5, 0.3, 24, 58], C.cream2, C.cream2, C.cream1),
          part([41, 51, -0.4, 0.4, 26, 57], C.sky1, C.sky1, C.sky1),
          part([52, 55, -0.4, 0.4, 23, 60], C.gold1, C.gold1, C.gold0),
        ],
      },
    ],
    meta: { mount: 'wall-back' },
  },
  computer: {
    anchor: COMPUTER_ANCHOR,
    margin: 2,
    extent: COMPUTER_EXTENT,
    layers: [{ parts: COMPUTER_PARTS, outline: true }],
    // braço A + monitor + teclado + gabinete, sem o braço B (specs.md, "Zoom")
    focusBox: [0, 38, 0, 14, 0, 36],
    meta: { footprint: [[0, 0, 4, 2], [0, 2, 2, 2]], mount: 'floor', hit: 'alpha' },
  },
  'desk-lamp': {
    anchor: COMPUTER_ANCHOR,
    margin: 2,
    extent: COMPUTER_EXTENT,
    layers: [{ parts: LAMP_PARTS, outline: true }],
    // O computador stand-in não desenha a luminária, então ela conta para hover e clique.
    meta: { layerOf: 'computer' },
  },
  'pc-tower': {
    anchor: [36, 4, 0],
    margin: 2,
    layers: [
      {
        parts: [graphite([33, 38, 2, 10, 0, 20]), part([33.5, 37.5, 9.9, 10.1, 16, 18], C.sky0, C.sky0, C.sky0)],
        outline: true,
      },
    ],
    meta: { footprint: [[0, 0, 1, 1]], mount: 'floor' },
  },
  'desk-chair': {
    anchor: [20, 20, 0],
    margin: 2,
    layers: [
      {
        parts: [
          graphite([16.5, 22.5, 17, 23, 0, 1.5]),
          graphite([19, 20, 19.5, 20.5, 1.5, 8]),
          part([16.5, 22.5, 16.5, 22.5, 8, 9.5], C.red2, C.red1, C.red0),
          part([16.5, 22.5, 22.5, 24, 9.5, 27], C.red2, C.red1, C.red0),
        ],
        outline: true,
      },
    ],
    meta: { footprint: [[0, 0, 1, 1]], mount: 'floor' },
  },
}

const inRange = (v: number, a: number, b: number) => v >= a && v < b

// Cor da caixa no centro do pixel (px de tela relativos à origem do mundo).
function colorAt(p: Part, sx: number, sy: number): string | null {
  const [x0, x1, y0, y1, z0, z1] = p.box
  // px → unidades: x - y = sx/4; x + y = sy/2 + z
  const a = sx / 4
  const bTop = sy / 2 + z1
  const tx = (a + bTop) / 2
  const ty = (bTop - a) / 2
  if (inRange(tx, x0, x1) && inRange(ty, y0, y1)) return p.top
  const fx = a + y1
  const fz = fx + y1 - sy / 2
  if (inRange(fx, x0, x1) && inRange(fz, z0, z1)) return p.front
  const ry = x1 - a
  const rz = x1 + ry - sy / 2
  if (inRange(ry, y0, y1) && inRange(rz, z0, z1)) return p.side
  return null
}

function screenBounds(boxes: Box[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [x0, x1, y0, y1, z0, z1] of boxes) {
    for (const x of [x0, x1]) {
      for (const y of [y0, y1]) {
        for (const z of [z0, z1]) {
          const p = unitsToScreen(x, y, z)
          minX = Math.min(minX, p.x)
          minY = Math.min(minY, p.y)
          maxX = Math.max(maxX, p.x)
          maxY = Math.max(maxY, p.y)
        }
      }
    }
  }
  return { minX: Math.floor(minX), minY: Math.floor(minY), maxX: Math.ceil(maxX), maxY: Math.ceil(maxY) }
}

function hex(color: string): [number, number, number] {
  const n = Number.parseInt(color.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function render(spec: StandInSpec) {
  const boxes = spec.extent ?? spec.layers.flatMap((l) => l.parts.map((p) => p.box))
  const b = screenBounds(boxes)
  const ox = b.minX - spec.margin
  const oy = b.minY - spec.margin
  const w = b.maxX - b.minX + spec.margin * 2
  const h = b.maxY - b.minY + spec.margin * 2
  const colors: (string | null)[] = new Array(w * h).fill(null)
  for (const layer of spec.layers) {
    for (const p of layer.parts) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const c = colorAt(p, x + ox + 0.5, y + oy + 0.5)
          if (c) colors[y * w + x] = c
        }
      }
    }
    if (layer.outline) {
      // Contorno de 1 px por dentro da silhueta (bíblia, regra 1).
      const solid = colors.map((c) => c !== null)
      const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && solid[y * w + x]
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (solid[y * w + x] && (!at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1))) {
            colors[y * w + x] = C.outline
          }
        }
      }
    }
  }
  const a = unitsToScreen(...spec.anchor)
  const anchor: [number, number] = [Math.round(a.x - ox), Math.round(a.y - oy)]
  let focus: number[] | undefined
  if (spec.focusBox) {
    const f = screenBounds([spec.focusBox])
    focus = [f.minX - ox, f.minY - oy, f.maxX - f.minX, f.maxY - f.minY]
  }
  return { w, h, colors, anchor, focus }
}

// Cria os stand-ins que faltam. Chamado no fim do Preload; devolve as chaves criadas.
export function createMissingStandIns(scene: Phaser.Scene): RoomSpriteKey[] {
  const created: RoomSpriteKey[] = []
  for (const key of Object.keys(ROOM_SPRITES) as RoomSpriteKey[]) {
    const spec = SPECS[key]
    if (!spec || scene.textures.exists(key)) continue
    const { w, h, colors, anchor, focus } = render(spec)
    const tex = scene.textures.createCanvas(key, w, h)
    if (!tex) continue
    const ctx = tex.getContext()
    const img = ctx.createImageData(w, h)
    colors.forEach((c, i) => {
      if (!c) return
      const [r, g, bl] = hex(c)
      img.data.set([r, g, bl, 255], i * 4)
    })
    ctx.putImageData(img, 0, 0)
    tex.refresh()
    const frame = tex.add(`${key} 0`, 0, 0, 0, w, h)
    if (frame) {
      frame.customPivot = true
      frame.pivotX = anchor[0] / w
      frame.pivotY = anchor[1] / h
    }
    tex.customData = {
      meta: { quartoPixel: { ...spec.meta, anchor, ...(focus ? { focus } : {}), standIn: true }, frameTags: [] },
    }
    created.push(key)
  }
  return created
}
