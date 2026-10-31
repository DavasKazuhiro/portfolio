import * as Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { Interactable } from '../objects/Interactable'
import type { InteractableId } from '../objects/registry'
import { FocusCamera } from '../systems/FocusCamera'
import { buildRoomMap } from '../systems/RoomMap'

// O quarto: mapa do Tiled + objetos interagíveis + câmera de foco.
//
// Fluxo de abertura (único para clique e para 'focus-object' vindo da UI):
//   zoom da câmera → 'object-open' (uma vez por foco) → painel abre na UI.
// 'panel-closed' → zoom-out → quarto livre de novo. É idempotente em qualquer estado.
export class Room extends Phaser.Scene {
  private focusCam?: FocusCamera
  private objects = new Map<InteractableId, Interactable>()
  private hoveredId: InteractableId | null = null
  private queuedFocus: InteractableId | null = null
  private unsubscribers: Array<() => void> = []

  constructor() {
    super('Room')
  }

  create() {
    const room = buildRoomMap(this)
    this.focusCam = new FocusCamera(this, room.bounds)

    for (const spec of room.interactables) {
      const obj = new Interactable(this, spec, {
        onHover: (id, over) => this.handleHover(id, over),
        onClick: (id) => this.openObject(id),
      })
      this.objects.set(spec.id, obj)
    }

    this.unsubscribers.push(
      EventBus.on('focus-object', (id) => this.requestFocus(id)),
      EventBus.on('panel-closed', () => this.closeObject()),
    )
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanup, this)

    EventBus.emit('scene-ready', this.scene.key)
  }

  private get isFree() {
    return this.focusCam?.state === 'room'
  }

  private handleHover(id: InteractableId, over: boolean) {
    if (over) {
      if (!this.isFree) return
      this.setHovered(id)
    } else if (this.hoveredId === id) {
      this.setHovered(null)
    }
  }

  private setHovered(id: InteractableId | null) {
    if (this.hoveredId === id) return
    if (this.hoveredId) this.objects.get(this.hoveredId)?.setHighlighted(false)
    this.hoveredId = id
    if (id) this.objects.get(id)?.setHighlighted(true)
    EventBus.emit('object-hover', id)
  }

  // 'focus-object' vindo da UI. Se chegar durante o zoom-out (painel acabou de fechar e o
  // visitante já escolheu outro objeto no menu), fica guardado e roda quando a cena ficar livre;
  // só o último pedido vale. Em outros estados ocupados é ignorado, como o clique.
  private requestFocus(id: InteractableId) {
    if (this.focusCam?.state === 'zooming-out') {
      const queued = this.queuedFocus !== null
      this.queuedFocus = id
      if (!queued) {
        this.focusCam.release(() => {
          const next = this.queuedFocus
          this.queuedFocus = null
          if (next) this.openObject(next)
        })
      }
      return
    }
    this.openObject(id)
  }

  // Clique no canvas ou 'focus-object'. Ignorado durante o zoom ou com painel aberto.
  // Objeto que ainda não está no mapa abre sem zoom (a UI continua funcionando).
  private openObject(id: InteractableId) {
    if (!this.focusCam || !this.isFree) return
    const obj = this.objects.get(id)
    this.setHovered(null)
    this.setCursors(false)
    this.focusCam.focus(obj?.bounds ?? null, () => EventBus.emit('object-open', id))
  }

  private closeObject() {
    if (!this.focusCam) return
    this.focusCam.release()
    this.setCursors(true)
  }

  private setCursors(enabled: boolean) {
    for (const obj of this.objects.values()) obj.setCursor(enabled)
  }

  private cleanup() {
    for (const off of this.unsubscribers) off()
    this.unsubscribers = []
    this.focusCam?.destroy()
    this.focusCam = undefined
    for (const obj of this.objects.values()) obj.destroy()
    this.objects.clear()
    this.hoveredId = null
    this.queuedFocus = null
  }
}
