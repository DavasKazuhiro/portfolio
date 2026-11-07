// Janela com cortinas na parede do fundo (à direita), sprite `window` (wall-back).
// Períodos: day, dusk, night. Só o vidro é "luz"; o resto (moldura, peitoril, cortinas, varão) recebe
// o tint do período já no desenho, porque o sprite inteiro fica acima do tint no jogo.
import { inside, PX, shaded } from '../lib.mjs'
import { P } from '../palette.mjs'
import { roomCanvas, WINDOW } from '../room.mjs'

const SKY = {
  day: (x, z, [gx0, gx1, gz0, gz1]) => {
    const u = (x - gx0) / (gx1 - gx0), v = (z - gz0) / (gz1 - gz0)
    const cloud = ((u - 0.68) / 0.16) ** 2 + ((v - 0.8) / 0.06) ** 2 < 1 || ((u - 0.8) / 0.11) ** 2 + ((v - 0.84) / 0.05) ** 2 < 1
      || ((u - 0.2) / 0.1) ** 2 + ((v - 0.62) / 0.04) ** 2 < 1
    if (cloud) return 'cream-3'
    return v > 0.55 ? 'sky-0' : 'sky-1'
  },
  dusk: (x, z, [gx0, gx1, gz0, gz1]) => {
    const u = (x - gx0) / (gx1 - gx0), v = (z - gz0) / (gz1 - gz0)
    if (((u - 0.7) / 0.2) ** 2 + ((v - 0.08) / 0.12) ** 2 < 1) return 'gold-3' // sol se pondo
    return v > 0.72 ? 'pink' : v > 0.4 ? 'red-3' : 'gold-1'
  },
  night: (x, z, [gx0, gx1, gz0, gz1]) => {
    const u = (x - gx0) / (gx1 - gx0), v = (z - gz0) / (gz1 - gz0)
    const moon = ((u - 0.28) / 0.12) ** 2 + ((v - 0.78) / 0.07) ** 2
    const bite = ((u - 0.34) / 0.1) ** 2 + ((v - 0.81) / 0.06) ** 2
    if (moon < 1 && bite >= 1) return 'cream-3'
    for (const [su, sv] of [[0.72, 0.9], [0.86, 0.66], [0.6, 0.55], [0.14, 0.4], [0.82, 0.28], [0.45, 0.2]]) {
      if (Math.abs(u - su) < 0.03 && Math.abs(v - sv) < 0.018) return 'sky-2'
    }
    return v > 0.5 ? 'teal-0' : 'teal-1'
  },
}
const GLINT = { day: 'sky-2', dusk: 'gold-3', night: 'teal-2' }

/**
 * Desenha a janela. Com `mask`, pinta o vidro de branco e o resto de preto (para saber o que é luz).
 */
export function renderWindow(period = 'day', { mask = false } = {}) {
  const c = roomCanvas(mask ? '#000000' : P.outline)
  const { box, object } = c
  const col = (t) => (mask ? '#000000' : P[t])
  const glass = (t) => (mask ? '#ffffff' : P[t])
  const [gx0, gx1, gz0, gz1] = WINDOW.glass
  const [cz0, cz1] = WINDOW.curtainZ

  // Moldura + vidro (face +y, de frente para o quarto) e peitoril.
  object([
    box(WINDOW.frame, (f, x, z, bx) => {
      if (f === 'top') return col('cream-2')
      if (f === 'x') return col('cream-1')
      if (!(inside(x, gx0, gx1) && inside(z, gz0, gz1))) {
        if (z > bx[5] - PX * 1.5) return col('cream-0') // sombra sob o varão
        // Sombra interna de 1 px no alto e à esquerda do vão (luz vem de fora).
        if (inside(x, gx0 - 0.3, gx1) && inside(z, gz1, gz1 + PX)) return col('cream-1')
        return col('cream-2')
      }
      if (inside(x, 45.5, 46.5) || inside(z, 41.5, 42.5)) return col('cream-2') // caixilho
      if (inside(z, gz1 - PX, gz1) || inside(x, gx0, gx0 + PX * 0.6)) return col('cream-0')
      const d = (x - gx0) + (z - gz0) * 0.55
      if ((d > 9 && d < 10.5) || (d > 11.5 && d < 12)) return glass(GLINT[period])
      return glass(SKY[period](x, z, WINDOW.glass))
    }),
    box(WINDOW.sill, shaded({ top: col('cream-2'), front: col('cream-1'), front2: col('cream-0'), side: col('cream-1'), side2: col('cream-0'), hi: col('cream-3') })),
  ])

  // Cortinas: dobras verticais de 2 px; a borda clara fica do lado da janela (luz).
  for (const [x0, x1] of WINDOW.curtains) {
    const litLeft = x0 > 45
    object([box([x0, x1, 0, 1.5, cz0, cz1], (f, x, z) => {
      if (f !== 'y') return col('gold-0')
      if (z > cz1 - 1) return col('gold-0')
      const t = x - x0
      if (litLeft ? t < 0.6 : t > x1 - x0 - 0.6) return col('gold-3')
      return Math.floor(t * 2) % 2 ? col('gold-1') : col('gold-0')
    })])
  }
  // Varão.
  object([box(WINDOW.rod, shaded({ top: col('gold-1'), front: col('gold-0'), side: col('gold-0') }))])

  return c
}
