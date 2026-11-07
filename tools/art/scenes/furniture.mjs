// Decoração de chão do grupo do computador: cadeira (`desk-chair`) e gabinete fino (`pc-tower`).
import { inside, PX, shaded } from '../lib.mjs'
import { P } from '../palette.mjs'
import { CHAIR_C, roomCanvas, TOWER } from '../room.mjs'

const T = (t) => P[t]

/** Cadeira giratória do teste aprovado, centrada em CHAIR_C, de frente para o monitor (encosto em +y). */
export function renderDeskChair() {
  const c = roomCanvas()
  const { box, cylinder, object } = c
  const [cx, cy] = CHAIR_C
  const base = shaded({ top: T('graphite-2'), front: T('graphite-1'), side: T('graphite-0') })
  const wheel = { top: T('graphite-2'), side: T('graphite-1'), lit: T('graphite-2'), dark: T('graphite-0') }
  const seamY = cy - 0.45
  object([
    box([cx - 5.5, cx + 5.5, cy - 0.65, cy + 0.65, 0.6, 1.6], base),
    box([cx - 0.65, cx + 0.65, cy - 5.25, cy + 5.75, 0.6, 1.6], base),
    ...[[cx - 5.2, cy], [cx + 5.2, cy], [cx, cy - 4.85], [cx, cy + 5.35]].map(([x, y]) => cylinder([x, y, 0.55, 0, 0.8], wheel)),
    cylinder([cx, cy, 0.7, 1.6, 9], wheel),
    // Assento.
    box([cx - 4.5, cx + 4.5, cy - 4.25, cy + 3.75, 9, 12], (f, p, q, bx) => {
      if (f === 'top') return p > bx[1] - PX * 1.5 || q > bx[3] - PX * 1.5 ? T('red-3') : inside(q, seamY, seamY + PX * 2) ? T('red-0') : T('red-2')
      if (f === 'y') return q > bx[5] - PX ? T('red-3') : T('red-1')
      return T('red-0')
    }),
    // Encosto (na frente, voltado para o visitante).
    box([cx - 4, cx + 4, cy + 2.75, cy + 4.75, 12, 27], (f, x, z, bx) => {
      if (f === 'top') return T('red-3')
      if (f === 'x') return T('red-0')
      if (z > bx[5] - PX * 1.5 || x < bx[0] + PX * 1.5) return T('red-3')
      if (inside(z, 19, 19 + PX * 2)) return T('red-0')
      return z > 19 ? T('red-2') : T('red-1')
    }),
  ])
  return c
}

/** Gabinete fino. `frame` 0: LED todo `sky-0`; 1: trecho de cima em `sky-2`. */
export function renderPcTower(frame = 0) {
  const c = roomCanvas()
  const [x0, , , , , z1] = TOWER
  c.object([c.box(TOWER, (f, a, b, bx) => {
    if (f === 'top') return a > bx[1] - PX * 1.5 || b > bx[3] - PX * 1.5 ? T('graphite-3') : T('graphite-2')
    if (f === 'x') return T('graphite-0')
    // Face +y (frente): a = x, b = z.
    if (inside(a, x0 + 0.9, x0 + 0.9 + PX * 2) && inside(b, 3, 18)) return frame === 1 && b > 12 ? T('sky-2') : T('sky-0')
    if (inside(b, 15.5, 17) && inside(a, x0 + 2.4, x0 + 4.2)) return T('graphite-0')
    if (inside(a, x0 + 2.4, x0 + 4.2) && inside(b, 3, 12) && b % 1.2 < 0.6) return T('graphite-0')
    return b > z1 - PX ? T('graphite-3') : T('graphite-1')
  })])
  return c
}
