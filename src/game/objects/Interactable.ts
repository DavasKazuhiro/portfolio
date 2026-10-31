import * as Phaser from 'phaser'
import { PALETTE } from '../assets'
import { isoToScreen } from '../iso'
import type { Rect } from '../systems/cameraMath'
import { ensureOutlineTexture } from '../systems/outline'
import type { InteractableSpec } from '../systems/RoomMap'
import { createPlaceholder } from './placeholders'
import type { InteractableId } from './registry'

// Profundidade base dos objetos (chão e paredes usam 0..n camadas).
const OBJECT_DEPTH = 100
// Distância máxima (px de tela) entre apertar e soltar para contar como clique, não arrasto.
const CLICK_SLOP = 8

export interface InteractableHandlers {
  onHover: (id: InteractableId, over: boolean) => void
  onClick: (id: InteractableId) => void
}

// Um objeto clicável do quarto: sprite + outline de hover (1 px em --accent).
export class Interactable {
  readonly id: InteractableId
  private readonly sprite: Phaser.GameObjects.Image
  private readonly outline: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, spec: InteractableSpec, handlers: InteractableHandlers) {
    this.id = spec.id
    const { footprint } = spec
    const art = createPlaceholder(scene, spec.id, {
      width: footprint.x1 - footprint.x0,
      depth: footprint.y1 - footprint.y0,
    })

    const anchor = isoToScreen(footprint.x0, footprint.y0)
    const x = Math.round(anchor.x + art.offsetX)
    const y = Math.round(anchor.y + art.offsetY)
    // Ordenação isométrica: quem tem o vértice da frente mais embaixo fica na frente.
    const depth = OBJECT_DEPTH + isoToScreen(footprint.x1, footprint.y1).y

    this.sprite = scene.add.image(x, y, art.key).setOrigin(0, 0).setDepth(depth)
    const outlineKey = ensureOutlineTexture(scene, art.key, PALETTE.accent)
    this.outline = scene.add
      .image(x - 1, y - 1, outlineKey)
      .setOrigin(0, 0)
      .setDepth(depth + 0.5)
      .setVisible(false)

    // Hit test por pixel: só a parte desenhada do objeto responde ao mouse.
    this.sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true })
    this.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => handlers.onHover(this.id, true))
    this.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => handlers.onHover(this.id, false))
    this.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (pointer.getDistance() <= CLICK_SLOP) handlers.onClick(this.id)
    })
  }

  setHighlighted(on: boolean) {
    this.outline.setVisible(on)
  }

  setCursor(enabled: boolean) {
    if (this.sprite.input) this.sprite.input.cursor = enabled ? 'pointer' : 'default'
  }

  // Retângulo do mundo usado pelo foco da câmera.
  get bounds(): Rect {
    return { x: this.sprite.x, y: this.sprite.y, width: this.sprite.width, height: this.sprite.height }
  }

  destroy() {
    this.sprite.destroy()
    this.outline.destroy()
  }
}
