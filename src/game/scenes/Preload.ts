import * as Phaser from 'phaser'
import { ASSETS, PALETTE, ROOM_SPRITES } from '../assets'
import { createMissingStandIns } from '../objects/standins'

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
    // Sprites gerados: PNG + JSON Hash do Aseprite (pivot e meta.quartoPixel no JSON).
    for (const [key, base] of Object.entries(ROOM_SPRITES)) {
      this.load.aseprite(key, `${base}.png`, `${base}.json`)
    }
  }

  create() {
    // Arte que ainda não chegou vira stand-in com o mesmo contrato (avisado no console em dev).
    const standIns = createMissingStandIns(this)
    if (standIns.length && import.meta.env.DEV) console.info(`[quarto] stand-ins: ${standIns.join(', ')}`)
    this.scene.start('Room')
  }
}
