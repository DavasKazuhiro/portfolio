// Contas puras da câmera (sem Phaser), para poderem ser testadas isoladamente.

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export const MIN_ZOOM = 1
export const MAX_ZOOM = 8

// Fração da tela que o objeto em foco deve ocupar (no máximo) depois do zoom.
export const FOCUS_FILL = 0.6

// Maior zoom inteiro em que `rect` cabe na viewport ocupando no máximo `fill` dela.
export function fitZoom(viewW: number, viewH: number, rect: Rect, fill = 1): number {
  if (rect.width <= 0 || rect.height <= 0) return MIN_ZOOM
  const z = Math.floor(Math.min((viewW * fill) / rect.width, (viewH * fill) / rect.height))
  return clampZoom(z)
}

// Zoom do foco: sempre inteiro e sempre pelo menos 1 nível acima da visão do quarto.
export function focusZoom(viewW: number, viewH: number, rect: Rect, roomZoom: number): number {
  return clampZoom(Math.max(roomZoom + 1, fitZoom(viewW, viewH, rect, FOCUS_FILL)))
}

export function clampZoom(z: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.floor(z)))
}

export function rectCenter(rect: Rect) {
  return { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) }
}

export function padRect(rect: Rect, pad: number): Rect {
  return { x: rect.x - pad, y: rect.y - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
}
