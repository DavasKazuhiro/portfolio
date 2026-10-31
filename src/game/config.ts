import * as Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preload } from './scenes/Preload'
import { Room } from './scenes/Room'

export function createGame(parent: HTMLElement) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    backgroundColor: '#1b1526',
    scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
    scene: [Boot, Preload, Room],
  })
  // Só em dev: acesso ao jogo pelo console/Playwright para depuração e testes e2e.
  if (import.meta.env.DEV) (window as unknown as { __game?: Phaser.Game }).__game = game
  return game
}
