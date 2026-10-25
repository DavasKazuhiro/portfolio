import * as Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { isoToScreen, TILE_H, TILE_W } from '../iso'

const GRID = 8
const ZOOM = 3

// Placeholder do M0: chão isométrico desenhado com Graphics e um bloco "computador"
// clicável, só para validar a ponte Phaser ↔ React. Será substituído pelo mapa do Tiled.
export class Room extends Phaser.Scene {
  constructor() {
    super('Room')
  }

  create() {
    const floor = this.add.graphics()
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const { x, y } = isoToScreen(col, row)
        floor.fillStyle((row + col) % 2 ? 0x6b4f7a : 0x5a4268)
        floor.fillPoints(
          [
            new Phaser.Math.Vector2(x, y),
            new Phaser.Math.Vector2(x + TILE_W / 2, y + TILE_H / 2),
            new Phaser.Math.Vector2(x, y + TILE_H),
            new Phaser.Math.Vector2(x - TILE_W / 2, y + TILE_H / 2),
          ],
          true,
        )
      }
    }

    const desk = isoToScreen(2, 1)
    const computer = this.add.rectangle(desk.x, desk.y, 14, 12, 0x5ec4d6).setStrokeStyle(1, 0x2b2140)
    computer.setInteractive({ useHandCursor: true })
    computer.on('pointerover', () => {
      computer.setFillStyle(0x9be7f2)
      EventBus.emit('object-hover', 'computer')
    })
    computer.on('pointerout', () => {
      computer.setFillStyle(0x5ec4d6)
      EventBus.emit('object-hover', null)
    })
    computer.on('pointerdown', () => EventBus.emit('object-open', 'computer'))

    const center = isoToScreen(GRID / 2, GRID / 2)
    this.cameras.main.setZoom(ZOOM).centerOn(center.x, center.y)

    EventBus.emit('scene-ready', this.scene.key)
  }
}
