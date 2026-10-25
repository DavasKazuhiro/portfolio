import { useEffect } from 'react'
import { EventBus } from '@/game/EventBus'
import { PhaserGame } from '@/game/PhaserGame'
import { useGameStore } from '@/store/useGameStore'
import { Hud } from '@/ui/hud/Hud'
import { PanelHost } from '@/ui/panels/PanelHost'

export function App() {
  useEffect(() => {
    const { setSceneKey, setHovered, open } = useGameStore.getState()
    const offs = [
      EventBus.on('scene-ready', setSceneKey),
      EventBus.on('object-hover', setHovered),
      EventBus.on('object-open', open),
    ]
    return () => offs.forEach((off) => off())
  }, [])

  return (
    <main className="app">
      <PhaserGame />
      <Hud />
      <PanelHost />
    </main>
  )
}
