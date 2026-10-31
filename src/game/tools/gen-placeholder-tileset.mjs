// Gera o tileset placeholder do quarto (M1): public/assets/tiles/placeholder-room.png
// Uso: node src/game/tools/gen-placeholder-tileset.mjs
//
// Sem dependências: desenha pixel a pixel num buffer RGBA e codifica o PNG com zlib.
// Cada tile tem 32×48 px: o losango do chão (32×16) ocupa as 16 linhas de baixo e as paredes
// sobem 32 px a partir das bordas de trás. Mesmo layout que o Tiled espera para tiles "altos"
// num mapa isométrico de 32×16 (alinhados pelo pé). Substituído pela arte do pack no M2.
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const TW = 32
const TH = 48
const FLOOR_Y = TH - 16 // topo do losango do chão dentro do tile
const WALL_H = 32
const COLS = 4
const ROWS = 2

// Paleta provisória (docs/arte/biblia-de-arte.md) + tons derivados para os placeholders.
const C = {
  border: '#0f0b17',
  panel: '#2b2140',
  ink: '#f3e9d2',
  accent: '#f4b860',
  cyan: '#5ec4d6',
  cyanLight: '#9be7f2',
  floorA: '#6b4f7a',
  floorB: '#5a4268',
  floorEdge: '#4a3558',
  rug: '#9c4a63',
  rugDark: '#7a3550',
  wallLit: '#7d6491',
  wallLitTop: '#a58dbb',
  wallShade: '#5e4a75',
  wallShadeTop: '#7d6491',
  baseboard: '#2b2140',
}

const W = TW * COLS
const H = TH * ROWS
const pixels = new Uint8Array(W * H * 4)

function hex(color) {
  const n = Number.parseInt(color.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function put(tile, x, y, color) {
  if (x < 0 || x >= TW || y < 0 || y >= TH) return
  const gx = (tile % COLS) * TW + x
  const gy = Math.floor(tile / COLS) * TH + y
  const i = (gy * W + gx) * 4
  const [r, g, b] = hex(color)
  pixels[i] = r
  pixels[i + 1] = g
  pixels[i + 2] = b
  pixels[i + 3] = 255
}

// Losango 32×16 que ladrilha sem sobreposição: linha i (0..7) cobre x ∈ [15-2i, 16+2i].
function inDiamond(x, y) {
  if (y < 0 || y > 15) return false
  const i = y < 8 ? y : 15 - y
  return x >= 15 - 2 * i && x <= 16 + 2 * i
}

// Primeira linha do losango em cada coluna (borda de trás). Colunas 0 e 31 são extrapoladas
// para que paredes vizinhas se encaixem sem buraco.
function backEdge(x) {
  return x < 16 ? Math.ceil((15 - x) / 2) : Math.ceil((x - 16) / 2)
}

function floorTile(tile, fill, edge, pattern) {
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < TW; x++) {
      if (!inDiamond(x, y)) continue
      // Borda da frente (embaixo) mais escura: deixa o grid legível.
      const front = !inDiamond(x, y + 1)
      let color = front ? edge : fill
      if (!front && pattern) color = pattern(x, y) ?? color
      put(tile, x, FLOOR_Y + y, color)
    }
  }
}

// Parede ao longo da borda de trás esquerda (x 0..15) ou direita (x 16..31).
function wall(tile, side, body, top, decorate) {
  const [x0, x1] = side === 'left' ? [0, 15] : [16, 31]
  for (let x = x0; x <= x1; x++) {
    const bottom = FLOOR_Y + backEdge(x) - 1
    for (let h = 0; h < WALL_H; h++) {
      const y = bottom - h
      let color = body
      if (h >= WALL_H - 2) color = top
      else if (h < 2) color = C.baseboard
      if (decorate) color = decorate(x, h) ?? color
      put(tile, x, y, color)
    }
  }
}

// Janela na parede esquerda: segue a inclinação da parede (h é a altura acima do chão).
function windowDeco(x, h) {
  if (x < 4 || x > 11 || h < 10 || h > 25) return undefined
  if (x === 4 || x === 11 || h === 10 || h === 25) return C.ink
  if (x === 8 && h > 10 && h < 25) return C.ink
  return (x + h) % 7 === 0 ? C.cyanLight : C.cyan
}

// Quadro na parede direita (marca o lugar dos futuros "frames").
function posterDeco(x, h) {
  if (x < 20 || x > 27 || h < 12 || h > 23) return undefined
  if (x === 20 || x === 27 || h === 12 || h === 23) return C.accent
  return C.panel
}

const TILES = [
  // 0: chão A · 1: chão B · 2: tapete
  () => floorTile(0, C.floorA, C.floorEdge),
  () => floorTile(1, C.floorB, C.floorEdge),
  () => floorTile(2, C.rug, C.rugDark, (x, y) => ((x + 2 * y) % 8 === 0 ? C.accent : undefined)),
  // 3: parede esquerda (iluminada pela janela) · 4: parede direita (sombra) · 5: canto
  () => wall(3, 'left', C.wallLit, C.wallLitTop),
  () => wall(4, 'right', C.wallShade, C.wallShadeTop),
  () => {
    wall(5, 'left', C.wallLit, C.wallLitTop)
    wall(5, 'right', C.wallShade, C.wallShadeTop)
  },
  // 6: parede esquerda com janela · 7: parede direita com quadro
  () => wall(6, 'left', C.wallLit, C.wallLitTop, windowDeco),
  () => wall(7, 'right', C.wallShade, C.wallShadeTop, posterDeco),
]
TILES.forEach((draw) => draw())

// --- PNG (RGBA 8 bits, sem filtro) ---
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // RGBA
const raw = Buffer.alloc((W * 4 + 1) * H)
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0
  Buffer.from(pixels.buffer, y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1)
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const out = resolve(root, 'public/assets/tiles/placeholder-room.png')
writeFileSync(out, png)
console.log(`ok: ${out} (${W}×${H}, ${TILES.length} tiles de ${TW}×${TH})`)
