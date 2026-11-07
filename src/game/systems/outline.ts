import type * as Phaser from 'phaser'

// Máscara de opacidade (1 = pixel opaco) de um ou mais frames do MESMO tamanho, sobrepostos.
// Serve para o hit test por silhueta e para o outline de hover de um grupo (ex.: `computer` +
// `desk-lamp`, que são camadas do mesmo canvas).
export interface AlphaMask {
  width: number
  height: number
  data: Uint8Array
}

export function buildAlphaMask(scene: Phaser.Scene, parts: Array<{ key: string; frame?: string | number }>): AlphaMask {
  const first = scene.textures.getFrame(parts[0].key, parts[0].frame)
  const width = first.cutWidth
  const height = first.cutHeight
  const data = new Uint8Array(width * height)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('outline: canvas 2D indisponível')

  for (const part of parts) {
    const frame = scene.textures.getFrame(part.key, part.frame)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(
      frame.source.image as CanvasImageSource,
      frame.cutX,
      frame.cutY,
      frame.cutWidth,
      frame.cutHeight,
      0,
      0,
      frame.cutWidth,
      frame.cutHeight,
    )
    const px = ctx.getImageData(0, 0, width, height).data
    for (let i = 0; i < data.length; i++) if (px[i * 4 + 3] > 0) data[i] = 1
  }
  return { width, height, data }
}

export function maskAt(mask: AlphaMask, x: number, y: number): boolean {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  if (ix < 0 || iy < 0 || ix >= mask.width || iy >= mask.height) return false
  return mask.data[iy * mask.width + ix] === 1
}

// Caixa dos pixels opacos (px do canvas); `null` se a máscara estiver vazia.
export function maskBounds(mask: AlphaMask) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (!mask.data[y * mask.width + x]) continue
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x + 1)
      y1 = Math.max(y1, y + 1)
    }
  }
  return x0 === Infinity ? null : { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
}

// Gera (uma vez por chave) a textura do outline de hover: anel de 1 px, 4-vizinhança, por fora
// dos pixels opacos da máscara (bíblia, regra 13). A textura sai com 1 px de folga em cada lado
// (w+2 × h+2), então vai em (x-1, y-1) do canto do sprite.
export function ensureOutlineTexture(scene: Phaser.Scene, outKey: string, mask: AlphaMask, color: number): string {
  if (scene.textures.exists(outKey)) return outKey
  const { width: w, height: h } = mask
  const alphaAt = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : mask.data[y * w + x])

  const tex = scene.textures.createCanvas(outKey, w + 2, h + 2)
  if (!tex) throw new Error(`outline: não foi possível criar ${outKey}`)
  const ctx = tex.getContext()
  const out = ctx.createImageData(w + 2, h + 2)
  const r = (color >> 16) & 255
  const g = (color >> 8) & 255
  const b = color & 255

  for (let oy = 0; oy < h + 2; oy++) {
    for (let ox = 0; ox < w + 2; ox++) {
      const x = ox - 1
      const y = oy - 1
      if (alphaAt(x, y)) continue
      if (alphaAt(x - 1, y) || alphaAt(x + 1, y) || alphaAt(x, y - 1) || alphaAt(x, y + 1)) {
        const i = (oy * (w + 2) + ox) * 4
        out.data[i] = r
        out.data[i + 1] = g
        out.data[i + 2] = b
        out.data[i + 3] = 255
      }
    }
  }
  ctx.putImageData(out, 0, 0)
  tex.refresh()
  return outKey
}
