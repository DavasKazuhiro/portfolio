import * as Phaser from 'phaser'

// Carrega o mínimo para a tela de loading. Assets do quarto entram aqui no M1/M2.
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create() {
    this.scene.start('Room')
  }
}
