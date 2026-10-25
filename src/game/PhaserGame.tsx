import type * as Phaser from 'phaser'
import { useEffect, useRef } from 'react'
import { createGame } from './config'

// Monta o Phaser uma única vez dentro de um div. Comunicação com a UI só via EventBus.
export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    gameRef.current = createGame(containerRef.current)
    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="game-canvas" aria-hidden="true" />
}
