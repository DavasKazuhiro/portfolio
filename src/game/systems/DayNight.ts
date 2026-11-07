import * as Phaser from 'phaser'
import { PERIOD_TINT } from '../assets'
import { createLocalAnims, frameNames, frameTags, readQuartoPixel, tagFrames } from '../objects/spriteMeta'
import { prefersReducedMotion } from './motion'
import { pickTag, type Period } from './period'

// Duração da troca de período (crossfade). Com prefers-reduced-motion a troca é instantânea.
export const PERIOD_FADE = 600

interface Entry {
  sprite: Phaser.GameObjects.Sprite
  // Fora do tint: fontes de luz (`meta.quartoPixel.light`), como a janela pré-tingida e as luzes.
  light: boolean
  // Principal cujo frame esta camada acompanha (`syncFramesWith`).
  syncWith?: Phaser.GameObjects.Sprite
  tag?: string
  frames: string[]
}

// Dia, entardecer e noite (bíblia de arte, "Dia, entardecer e noite"; specs.md, "Camadas,
// profundidade e tint"):
// - o "retângulo MULTIPLY" sobre o quarto é feito como tint MULTIPLY (padrão do Phaser 4) em cada
//   sprite que não é luz. Com pixels só opacos ou transparentes, o resultado é o mesmo, sem
//   retângulo aparecendo sobre o fundo fora do quarto e sem mexer na profundidade: o que é luz
//   simplesmente não recebe tint, e por isso fica "acima" dele;
// - cada sprite mostra a tag do período (`pickTag`): janela `day`/`dusk`/`night` (pré-tingida),
//   luminária `off`/`on`, `light-computer` só em `dusk`/`night`;
// - camadas com `syncFramesWith` não animam sozinhas: copiam o índice do frame do principal;
// - a troca tem crossfade (tint interpolado, tags trocadas por um "fantasma" que some, luzes que
//   acendem/apagam por alpha), ou é instantânea com prefers-reduced-motion.
export class DayNight {
  private entries: Entry[] = []
  private current: Period
  private transition?: Phaser.Tweens.Tween
  // Cópias com o frame antigo, sumindo durante o crossfade (as que não são luz seguem o tint).
  private ghosts: Array<{ sprite: Phaser.GameObjects.Sprite; light: boolean }> = []
  private tint: number

  constructor(
    private readonly scene: Phaser.Scene,
    initial: Period,
  ) {
    this.current = initial
    this.tint = PERIOD_TINT[initial]
  }

  get period(): Period {
    return this.current
  }

  // Cria um sprite do quarto já no estado do período atual (origem = pivot do frame).
  add(key: string, x: number, y: number, depth: number, syncWith?: Phaser.GameObjects.Sprite) {
    const texture = this.scene.textures.get(key)
    const sprite = this.scene.add.sprite(x, y, key, frameNames(texture)[0]).setDepth(depth)
    const meta = readQuartoPixel(texture)
    const entry: Entry = { sprite, light: meta.light, syncWith, frames: [] }
    if (syncWith) {
      syncWith.on(Phaser.Animations.Events.ANIMATION_UPDATE, (_a: unknown, frame: Phaser.Animations.AnimationFrame) =>
        this.syncFrame(entry, frame.index - 1),
      )
    } else {
      createLocalAnims(this.scene, sprite)
    }
    this.entries.push(entry)
    this.applyEntry(entry, this.current)
    if (!entry.light) sprite.setTint(this.tint)
    return sprite
  }

  // Troca de período. `animate = false` (ou reduced-motion) troca na hora.
  set(period: Period, animate = true) {
    if (period === this.current) return
    this.current = period
    this.finishTransition()
    const from = this.tint
    const to = PERIOD_TINT[period]
    if (!animate || prefersReducedMotion()) {
      for (const e of this.entries) this.applyEntry(e, period)
      this.setTint(to)
      return
    }

    const fades: Array<{ sprite: Phaser.GameObjects.Sprite; from: number; to: number; hideAtEnd: boolean }> = []
    for (const e of this.entries) {
      const wasVisible = e.sprite.visible
      const oldFrame = e.sprite.frame.name
      this.applyEntry(e, period)
      const nowVisible = e.sprite.visible
      if (wasVisible && nowVisible && oldFrame !== e.sprite.frame.name) {
        // Fantasma com o frame antigo por cima, sumindo.
        const ghost = this.scene.add
          .sprite(e.sprite.x, e.sprite.y, e.sprite.texture.key, oldFrame)
          .setDepth(e.sprite.depth + 0.001)
        if (!e.light) ghost.setTint(from)
        this.ghosts.push({ sprite: ghost, light: e.light })
        fades.push({ sprite: ghost, from: 1, to: 0, hideAtEnd: true })
      } else if (!wasVisible && nowVisible) {
        fades.push({ sprite: e.sprite.setAlpha(0), from: 0, to: 1, hideAtEnd: false })
      } else if (wasVisible && !nowVisible) {
        e.sprite.setVisible(true)
        fades.push({ sprite: e.sprite, from: 1, to: 0, hideAtEnd: true })
      }
    }

    this.transition = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: PERIOD_FADE,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        const t = tween.getValue() ?? 1
        this.setTint(lerpColor(from, to, t))
        for (const f of fades) f.sprite.setAlpha(f.from + (f.to - f.from) * t)
      },
      onComplete: () => {
        this.setTint(to)
        for (const f of fades) {
          f.sprite.setAlpha(1)
          if (f.hideAtEnd) f.sprite.setVisible(false)
        }
        this.clearGhosts()
        this.transition = undefined
      },
    })
  }

  destroy() {
    this.transition?.stop()
    this.transition = undefined
    this.clearGhosts()
    for (const e of this.entries) e.syncWith?.off(Phaser.Animations.Events.ANIMATION_UPDATE)
    this.entries = []
  }

  // Termina na hora uma transição em curso (estado final já aplicado nas entradas).
  private finishTransition() {
    if (!this.transition) return
    this.transition.stop()
    this.transition = undefined
    this.clearGhosts()
    for (const e of this.entries) {
      e.sprite.setAlpha(1)
      this.applyEntry(e, this.current)
    }
  }

  private clearGhosts() {
    for (const g of this.ghosts) g.sprite.destroy()
    this.ghosts = []
  }

  private setTint(color: number) {
    this.tint = color
    for (const e of this.entries) if (!e.light) e.sprite.setTint(color)
    for (const g of this.ghosts) if (!g.light) g.sprite.setTint(color)
  }

  // Tag e visibilidade do período; anima a tag se tiver mais de um frame (e não for camada
  // sincronizada nem reduced-motion).
  private applyEntry(e: Entry, period: Period) {
    const texture = e.sprite.texture
    const tags = frameTags(texture)
    const choice = pickTag(
      tags.map((t) => t.name),
      period,
    )
    const tag = tags.find((t) => t.name === choice.tag)
    e.sprite.setVisible(choice.visible)
    if (e.tag === tag?.name && e.frames.length) return
    e.tag = tag?.name
    e.frames = tag ? tagFrames(texture, tag) : frameNames(texture).slice(0, 1)
    e.sprite.anims.stop()
    if (e.syncWith) {
      const index = e.syncWith.anims.currentFrame ? e.syncWith.anims.currentFrame.index - 1 : 0
      this.syncFrame(e, index)
      return
    }
    e.sprite.setFrame(e.frames[0])
    if (tag && e.frames.length > 1 && !prefersReducedMotion() && e.sprite.anims.exists(tag.name)) {
      e.sprite.play(tag.name)
    }
  }

  private syncFrame(e: Entry, index: number) {
    if (!e.frames.length) return
    e.sprite.setFrame(e.frames[Math.max(0, index) % e.frames.length])
  }
}

function lerpColor(a: number, b: number, t: number): number {
  const ch = (c: number, s: number) => (c >> s) & 255
  const mix = (s: number) => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t)
  return (mix(16) << 16) | (mix(8) << 8) | mix(0)
}
