import * as Phaser from 'phaser'
import type { InteractableId } from './objects/registry'

// Contrato entre o canvas (Phaser) e a UI (React). Todo evento novo entra aqui.
export interface GameEvents {
  'scene-ready': [sceneKey: string]
  'object-hover': [id: InteractableId | null]
  'object-open': [id: InteractableId]
  'panel-closed': []
}

const emitter = new Phaser.Events.EventEmitter()

export const EventBus = {
  emit<E extends keyof GameEvents>(event: E, ...args: GameEvents[E]) {
    emitter.emit(event, ...args)
  },
  on<E extends keyof GameEvents>(event: E, fn: (...args: GameEvents[E]) => void) {
    emitter.on(event, fn)
    return () => {
      emitter.off(event, fn)
    }
  },
}
