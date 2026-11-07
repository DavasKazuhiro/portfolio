// Período do dia (bíblia de arte, "Dia, entardecer e noite"). A troca visual (tint e tags) fica
// em systems/DayNight.ts; aqui só as regras puras, testáveis sem Phaser.
export type Period = 'day' | 'dusk' | 'night'

// Tags que valem em cada período, por ordem de preferência. Tags fora da lista (como `idle`)
// valem em qualquer período.
const PERIOD_TAGS: Record<Period, readonly string[]> = {
  day: ['day', 'off'],
  dusk: ['dusk', 'on', 'night'],
  night: ['night', 'on'],
}
const PERIODIC = new Set(['day', 'dusk', 'night', 'on', 'off'])

// Escolhe a tag de um sprite para o período.
// - `undefined` em `tag` = sprite sem tags: mostra o frame 0.
// - `visible: false` = só tem tags de outro período (ex.: `light-computer` só tem `night`).
export function pickTag(tags: readonly string[], period: Period): { tag?: string; visible: boolean } {
  if (tags.length === 0) return { visible: true }
  for (const name of PERIOD_TAGS[period]) if (tags.includes(name)) return { tag: name, visible: true }
  const neutral = tags.find((t) => !PERIODIC.has(t))
  if (neutral) return { tag: neutral, visible: true }
  return { visible: false }
}

// Horário local do visitante (game-design.md, "Dia/noite"): dia 7h–17h, entardecer 17h–19h,
// noite 19h–7h.
export function periodAt(date: Date): Period {
  const h = date.getHours()
  if (h >= 7 && h < 17) return 'day'
  if (h >= 17 && h < 19) return 'dusk'
  return 'night'
}

// `?period=day|dusk|night` na URL (só em dev, ver Room) força o período para prévia e QA.
export function parsePeriod(value: string | null | undefined): Period | null {
  return value === 'day' || value === 'dusk' || value === 'night' ? value : null
}
