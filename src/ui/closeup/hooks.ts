import { useSyncExternalStore } from 'react'

// Tamanho útil da janela (px CSS), atualizado no resize.
const subscribeResize = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}
let lastSize = { w: 0, h: 0 }
const getSize = () => {
  const w = document.documentElement.clientWidth || window.innerWidth
  const h = window.innerHeight
  if (w !== lastSize.w || h !== lastSize.h) lastSize = { w, h }
  return lastSize
}

export function useViewportSize() {
  return useSyncExternalStore(subscribeResize, getSize)
}

const REDUCED = '(prefers-reduced-motion: reduce)'
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches)
}
