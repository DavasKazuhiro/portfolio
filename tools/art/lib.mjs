// Motor de desenho da arte do quarto (ADR 0005). Sem dependências: rasteriza pixel a pixel
// num buffer RGBA e grava PNG com zlib. Regras de estilo em docs/arte/biblia-de-arte.md.
//
// Coordenadas de projeto: 8 unidades por tile (losango 64×32). +x anda (+2S, +S) px, +y anda (-2S, +S) px e
// +z sobe S px, com S = 2. PX = 1 pixel em unidades de projeto.
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

export const S = 2
export const PX = 1 / S
export const TILE = 8

export const inside = (v, a, b) => v >= a && v < b
// Ruído determinístico por célula (veios, textura, folhas): mesmo resultado a cada build.
export const hash = (a, b) => {
  const h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return h - Math.floor(h)
}

export const rgba = (c) => {
  const n = Number.parseInt(c.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]
}

/**
 * Cria uma tela. `ox`/`oy` = pixel onde cai a origem de projeto (0, 0, 0).
 * `outlineColor` contorna cada objeto; `bg` opcional (padrão: transparente).
 */
export function createCanvas({ width: W, height: H, ox: OX, oy: OY, outlineColor, bg }) {
  const pixels = new Uint8Array(W * H * 4)
  if (bg) for (let i = 0; i < W * H; i++) pixels.set(rgba(bg), i * 4)

  const ctr = (sx, sy) => [(sx + 0.5 - OX) / S, (sy + 0.5 - OY) / S]
  // Centro do pixel → coordenadas de mundo em cada plano de face.
  const onTop = (sx, sy, z) => { const [a, b] = ctr(sx, sy); const s = b + z; return [(a / 2 + s) / 2, (s - a / 2) / 2] }
  const onY = (sx, sy, y) => { const [a, b] = ctr(sx, sy); const x = a / 2 + y; return [x, x + y - b] }
  const onX = (sx, sy, x) => { const [a, b] = ctr(sx, sy); const y = x - a / 2; return [y, x + y - b] }
  const proj = (x, y, z) => [OX + 2 * S * (x - y), OY + S * (x + y) - S * z]
  const inBounds = (sx, sy) => sx >= 0 && sy >= 0 && sx < W && sy < H

  // Caixa [x0, x1, y0, y1, z0, z1]; paint(face, p, q, box) → cor ou null.
  // face 'top': p = x, q = y · face 'y' (frente-esquerda): p = x, q = z · face 'x' (frente-direita): p = y, q = z.
  function box(layer, bx, paint) {
    const [x0, x1, y0, y1, z0, z1] = bx
    const left = Math.floor(proj(x0, y1, 0)[0]) - 1, right = Math.ceil(proj(x1, y0, 0)[0]) + 1
    const top = Math.floor(proj(x0, y0, z1)[1]) - 1, bottom = Math.ceil(proj(x1, y1, z0)[1]) + 1
    for (let sy = Math.max(0, top); sy < Math.min(H, bottom); sy++) {
      for (let sx = Math.max(0, left); sx < Math.min(W, right); sx++) {
        let c = null
        const [tx, ty] = onTop(sx, sy, z1)
        if (inside(tx, x0, x1) && inside(ty, y0, y1)) c = paint('top', tx, ty, bx)
        else {
          const [lx, lz] = onY(sx, sy, y1)
          if (inside(lx, x0, x1) && inside(lz, z0, z1)) c = paint('y', lx, lz, bx)
          else {
            const [ry, rz] = onX(sx, sy, x1)
            if (inside(ry, y0, y1) && inside(rz, z0, z1)) c = paint('x', ry, rz, bx)
          }
        }
        if (c) layer.set(rgba(c), (sy * W + sx) * 4)
      }
    }
  }

  // Cilindro vertical [cx, cy, r, z0, z1]: tampa elíptica e lateral em três faixas (luz da esquerda).
  // `top` pode ser função (u, v) com u, v ∈ [-1, 1] dentro da elipse.
  // `rimBottom` (opcional): cor da última linha de pixels da lateral (borda de baixo de uma cúpula).
  function cylinder(layer, [cx, cy, r, z0, z1], { top, side, lit, dark, rimBottom }) {
    const A = 2 * Math.SQRT2 * S * r, B = Math.SQRT2 * S * r
    const [px, pyTop] = proj(cx, cy, z1), [, pyBot] = proj(cx, cy, z0)
    for (let sy = Math.floor(pyTop - B - 1); sy < pyBot + B + 1; sy++) {
      for (let sx = Math.floor(px - A - 1); sx < px + A + 1; sx++) {
        if (!inBounds(sx, sy)) continue
        const dx = sx + 0.5 - px
        const e = 1 - (dx / A) ** 2
        if (e < 0) continue
        const half = B * Math.sqrt(e)
        const dyT = sy + 0.5 - pyTop, dyB = sy + 0.5 - pyBot
        let c = null
        if (Math.abs(dyT) <= half) c = typeof top === 'function' ? top(dx / A, dyT / B) : top
        else if (dyT > 0 && dyB <= half) {
          const t = dx / A
          c = t < -0.45 ? lit : t > 0.45 ? dark : side
          if (rimBottom && dyB > half - 1) c = rimBottom
        }
        if (c) layer.set(rgba(c), (sy * W + sx) * 4)
      }
    }
  }

  // Mancha elíptica (folhagem): centro [x, y, z] em mundo, raios rx/ry em pixels.
  function blob(layer, [x, y, z, rx, ry], { color, hi, dark }) {
    const [px, py] = proj(x, y, z)
    for (let sy = Math.floor(py - ry); sy <= py + ry; sy++) {
      for (let sx = Math.floor(px - rx); sx <= px + rx; sx++) {
        if (!inBounds(sx, sy)) continue
        const u = (sx + 0.5 - px) / rx, v = (sy + 0.5 - py) / ry
        const d = u * u + v * v
        if (d > 1) continue
        const c = u + v < -0.7 && d > 0.25 ? hi : u + v > 0.8 ? dark : color
        layer.set(rgba(c), (sy * W + sx) * 4)
      }
    }
  }

  /**
   * Desenha um objeto: cada item de `draws` recebe o layer do objeto. O layer é contornado
   * por fora (1 px) e composto por cima do que já existe na tela.
   */
  function object(draws, { outline = true } = {}) {
    const layer = new Uint8Array(W * H * 4)
    for (const draw of draws) draw(layer)
    const solid = (x, y) => inBounds(x, y) && layer[(y * W + x) * 4 + 3] > 0
    if (outline) {
      const edge = []
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (solid(x, y) && (!solid(x - 1, y) || !solid(x + 1, y) || !solid(x, y - 1) || !solid(x, y + 1))) edge.push((y * W + x) * 4)
        }
      }
      const out = rgba(outlineColor)
      for (const i of edge) layer.set(out, i)
    }
    for (let i = 0; i < W * H; i++) if (layer[i * 4 + 3]) pixels.set(layer.subarray(i * 4, i * 4 + 4), i * 4)
  }

  return {
    width: W,
    height: H,
    pixels,
    proj,
    object,
    box: (bx, paint) => (layer) => box(layer, bx, paint),
    cylinder: (cyl, colors) => (layer) => cylinder(layer, cyl, colors),
    blob: (b, colors) => (layer) => blob(layer, b, colors),
    /** Pixels avulsos (detalhes de 1 px): lista de [sx, sy, cor] em px da tela. */
    dots: (list) => (layer) => { for (const [sx, sy, color] of list) if (inBounds(sx, sy)) layer.set(rgba(color), (sy * W + sx) * 4) },
    /** Grava PNG; `scale` inteiro só para prévias (os assets do jogo usam 1). */
    writePng: (path, scale = 1) => writePng(path, pixels, W, H, scale),
  }
}

/**
 * Faces sombreadas no padrão da bíblia: topo claro com filete de luz nas bordas da frente,
 * frente média e lateral escura, ambas um pouco mais escuras nos 30% de baixo.
 */
export const shaded = ({ top, front, front2 = front, side, side2 = side, hi }) => (f, p, q, [, x1, , y1, z0, z1]) => {
  if (f === 'top') return hi && (p > x1 - PX * 1.5 || q > y1 - PX * 1.5) ? hi : top
  const low = q < z0 + (z1 - z0) * 0.3
  if (f === 'y') return hi && q > z1 - PX ? hi : low ? front2 : front
  return low ? side2 : side
}

const crcTable = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})
const crc32 = (buf) => {
  let c = -1
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

export function writePng(path, pixels, W, H, scale = 1) {
  const OW = W * scale, OH = H * scale
  const raw = Buffer.alloc((OW * 4 + 1) * OH)
  for (let y = 0; y < OH; y++) {
    for (let x = 0; x < OW; x++) {
      const s = (Math.floor(y / scale) * W + Math.floor(x / scale)) * 4
      for (let k = 0; k < 4; k++) raw[y * (OW * 4 + 1) + 1 + x * 4 + k] = pixels[s + k]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(OW, 0)
  ihdr.writeUInt32BE(OH, 4)
  ihdr.set([8, 6, 0, 0, 0], 8)
  writeFileSync(path, Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]))
}
