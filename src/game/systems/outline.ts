import type * as Phaser from 'phaser'

// Gera (uma vez) a textura do outline de hover: anel de 1 px, 4-vizinhança, ao redor dos pixels
// opacos da textura original. A textura sai com 1 px de folga em cada lado (w+2 × h+2), então o
// sprite do outline vai em (x-1, y-1) do sprite original, com a mesma origem em pixels.
// Funciona para qualquer textura com fonte desenhável (PNG carregado ou CanvasTexture).
export function ensureOutlineTexture(scene: Phaser.Scene, key: string, color: number): string {
  const outKey = `${key}__outline`
  if (scene.textures.exists(outKey)) return outKey

  const frame = scene.textures.getFrame(key)
  const w = frame.cutWidth
  const h = frame.cutHeight

  const read = document.createElement('canvas')
  read.width = w
  read.height = h
  const readCtx = read.getContext('2d', { willReadFrequently: true })
  if (!readCtx) throw new Error('outline: canvas 2D indisponível')
  readCtx.drawImage(frame.source.image as CanvasImageSource, -frame.cutX, -frame.cutY)
  const src = readCtx.getImageData(0, 0, w, h).data
  const alphaAt = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : src[(y * w + x) * 4 + 3])

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
      if (alphaAt(x, y) > 0) continue
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
