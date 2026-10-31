import * as Phaser from 'phaser'

// Mínimo possível: não há assets para a tela de loading (a barra é desenhada com Graphics).
// Fica como ponto de entrada para quando a tela de loading ganhar arte (M2/M4).
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create() {
    this.scene.start('Preload')
  }
}
