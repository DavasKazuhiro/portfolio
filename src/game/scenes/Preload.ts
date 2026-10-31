import * as Phaser from 'phaser'
import { ASSETS, PALETTE } from '../assets'

// Barra de progresso "em pixel": blocos de tamanho inteiro, sem texto (texto é da UI/i18n).
const BAR_CELLS = 32

export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    const { width, height } = this.scale
    const px = Math.max(2, Math.floor(Math.min(width, height) / 160))
    const barW = BAR_CELLS * px
    const barH = 3 * px
    const x = Math.floor((width - barW) / 2)
    const y = Math.floor((height - barH) / 2)

    const frame = this.add.graphics()
    frame.fillStyle(PALETTE.border).fillRect(x - 2 * px, y - 2 * px, barW + 4 * px, barH + 4 * px)
    frame.fillStyle(PALETTE.ink).fillRect(x - px, y - px, barW + 2 * px, barH + 2 * px)
    frame.fillStyle(PALETTE.panel).fillRect(x, y, barW, barH)

    const fill = this.add.graphics()
    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      // Enche bloco a bloco, sem meio pixel.
      const cells = Math.floor(value * BAR_CELLS)
      fill.clear().fillStyle(PALETTE.accent).fillRect(x, y, cells * px, barH)
    })

    this.load.tilemapTiledJSON(ASSETS.roomMap.key, ASSETS.roomMap.url)
    this.load.image(ASSETS.roomTiles.key, ASSETS.roomTiles.url)
  }

  create() {
    this.scene.start('Room')
  }
}
