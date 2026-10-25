import * as Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Room } from './scenes/Room'

export function createGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    backgroundColor: '#1b1526',
    scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
    scene: [Boot, Room],
  })
}
