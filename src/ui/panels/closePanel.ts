import { EventBus } from '@/game/EventBus'
import { useGameStore } from '@/store/useGameStore'

// Único caminho de fechamento: estado da UI + zoom-out da câmera.
// A devolução do foco é feita pelo PanelHost quando o diálogo desmonta.
export function closePanel() {
  useGameStore.getState().close()
  EventBus.emit('panel-closed')
}
