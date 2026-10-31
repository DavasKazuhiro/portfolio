import type * as Phaser from 'phaser'
import type { InteractableId } from './registry'

// Sprites placeholder dos interagíveis (M1), desenhados pixel a pixel numa CanvasTexture.
// Cada objeto é uma pilha de "caixas" isométricas em coordenadas locais da pegada do objeto:
// x/y em tiles (0..largura/altura da pegada no Tiled) e z em pixels acima do chão.
// No M2 isto é trocado pelos sprites do art-director (public/assets/objects/<id>.png).

interface Box {
  x0: number
  x1: number
  y0: number
  y1: number
  z0: number
  z1: number
  top: string
  left: string
  right: string
  edge: string
  // Detalhe na face da frente-esquerda (plano y = y1); u, v ∈ [0,1) da esquerda/baixo.
  decorateLeft?: (u: number, v: number) => string | undefined
}

export interface PlaceholderSprite {
  key: string
  // Posição do canto superior esquerdo da textura relativa ao vértice de cima da pegada (x0, y0).
  offsetX: number
  offsetY: number
}

const HALF_W = 16
const HALF_H = 8

function project(x: number, y: number, z: number) {
  return { x: (x - y) * HALF_W, y: (x + y) * HALF_H - z }
}

const inRange = (v: number, a: number, b: number) => v >= a && v < b

// Qual face da caixa cobre o centro do pixel (sx, sy), em coordenadas de tela locais.
function faceAt(box: Box, sx: number, sy: number): { face: 'top' | 'left' | 'right'; u: number; v: number } | null {
  // Topo (z = z1)
  const a = sx / HALF_W
  const bt = (sy + box.z1) / HALF_H
  const tx = (a + bt) / 2
  const ty = (bt - a) / 2
  if (inRange(tx, box.x0, box.x1) && inRange(ty, box.y0, box.y1)) return { face: 'top', u: 0, v: 0 }
  // Frente-esquerda (y = y1)
  const lx = a + box.y1
  const lz = (lx + box.y1) * HALF_H - sy
  if (inRange(lx, box.x0, box.x1) && inRange(lz, box.z0, box.z1)) {
    return { face: 'left', u: (lx - box.x0) / (box.x1 - box.x0), v: (lz - box.z0) / (box.z1 - box.z0) }
  }
  // Frente-direita (x = x1)
  const ry = box.x1 - a
  const rz = (box.x1 + ry) * HALF_H - sy
  if (inRange(ry, box.y0, box.y1) && inRange(rz, box.z0, box.z1)) return { face: 'right', u: 0, v: 0 }
  return null
}

function hexToRgb(color: string): [number, number, number] {
  const n = Number.parseInt(color.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rasterize(scene: Phaser.Scene, key: string, boxes: Box[]): PlaceholderSprite {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const b of boxes) {
    for (const x of [b.x0, b.x1]) {
      for (const y of [b.y0, b.y1]) {
        for (const z of [b.z0, b.z1]) {
          const p = project(x, y, z)
          minX = Math.min(minX, p.x)
          minY = Math.min(minY, p.y)
          maxX = Math.max(maxX, p.x)
          maxY = Math.max(maxY, p.y)
        }
      }
    }
  }
  minX = Math.floor(minX)
  minY = Math.floor(minY)
  const w = Math.ceil(maxX) - minX
  const h = Math.ceil(maxY) - minY

  const colors: (string | undefined)[] = new Array(w * h)
  for (const box of boxes) {
    // Máscara desta caixa, para escurecer a silhueta (contorno de 1 px no tom escuro do material).
    const mask = new Uint8Array(w * h)
    const local: (string | undefined)[] = new Array(w * h)
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const hit = faceAt(box, px + minX + 0.5, py + minY + 0.5)
        if (!hit) continue
        mask[py * w + px] = 1
        let color = box[hit.face]
        if (hit.face === 'left' && box.decorateLeft) color = box.decorateLeft(hit.u, hit.v) ?? color
        local[py * w + px] = color
      }
    }
    const covered = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] === 1
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        if (!mask[py * w + px]) continue
        const silhouette = !covered(px - 1, py) || !covered(px + 1, py) || !covered(px, py - 1) || !covered(px, py + 1)
        colors[py * w + px] = silhouette ? box.edge : local[py * w + px]
      }
    }
  }

  const tex = scene.textures.createCanvas(key, w, h)
  if (!tex) throw new Error(`placeholder: não foi possível criar ${key}`)
  const ctx = tex.getContext()
  const img = ctx.createImageData(w, h)
  colors.forEach((color, i) => {
    if (!color) return
    const [r, g, b] = hexToRgb(color)
    img.data[i * 4] = r
    img.data[i * 4 + 1] = g
    img.data[i * 4 + 2] = b
    img.data[i * 4 + 3] = 255
  })
  ctx.putImageData(img, 0, 0)
  tex.refresh()
  return { key, offsetX: minX, offsetY: minY }
}

// Mesa (pegada 2×1) com monitor, teclado e gabinete.
function computerBoxes(): Box[] {
  const screen = (u: number, v: number) => {
    if (u < 0.08 || u >= 0.92 || v < 0.12 || v >= 0.88) return undefined
    // "linhas de código" na tela
    const row = Math.floor(v * 10)
    if (row % 2 === 0 && u > 0.18 && u < 0.3 + ((row * 37) % 50) / 100) return '#f3e9d2'
    return '#5ec4d6'
  }
  const led = (u: number, v: number) => (u > 0.6 && u < 0.85 && v > 0.8 && v < 0.88 ? '#5ec4d6' : undefined)
  const wood = { top: '#a0704f', left: '#7a5238', right: '#5e3e2a', edge: '#3d2618' }
  const dark = { top: '#3a2f52', left: '#2b2140', right: '#221a33', edge: '#0f0b17' }
  return [
    { x0: 0, x1: 2, y0: 0, y1: 1, z0: 0, z1: 12, ...wood },
    { x0: 0.95, x1: 1.15, y0: 0.2, y1: 0.35, z0: 12, z1: 15, ...dark },
    { x0: 0.45, x1: 1.6, y0: 0.15, y1: 0.4, z0: 15, z1: 32, ...dark, decorateLeft: screen },
    { x0: 0.55, x1: 1.45, y0: 0.6, y1: 0.82, z0: 12, z1: 13, top: '#d9cfb8', left: '#a69c86', right: '#a69c86', edge: '#5a5246' },
    { x0: 1.65, x1: 1.95, y0: 0.1, y1: 0.75, z0: 12, z1: 30, ...dark, decorateLeft: led },
  ]
}

// Caixa genérica que ocupa a pegada inteira (objetos sem placeholder próprio).
function genericBoxes(width: number, depth: number): Box[] {
  return [{ x0: 0, x1: width, y0: 0, y1: depth, z0: 0, z1: 16, top: '#9be7f2', left: '#5ec4d6', right: '#3f8fa0', edge: '#1f4a55' }]
}

export function createPlaceholder(
  scene: Phaser.Scene,
  id: InteractableId,
  footprint: { width: number; depth: number },
): PlaceholderSprite {
  // Texturas são globais ao jogo: se a cena reiniciar, reaproveita a já gerada.
  const key = `placeholder:${id}:${footprint.width}x${footprint.depth}`
  const cached = cache.get(key)
  if (cached && scene.textures.exists(key)) return cached
  const boxes = id === 'computer' ? computerBoxes() : genericBoxes(footprint.width, footprint.depth)
  const sprite = rasterize(scene, key, boxes)
  cache.set(key, sprite)
  return sprite
}

const cache = new Map<string, PlaceholderSprite>()
