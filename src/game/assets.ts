// Chaves e caminhos dos assets carregados pelo Preload. Caminhos relativos ao index.html
// (o build usa `base: './'`).
export const ASSETS = {
  roomMap: { key: 'room-map', url: 'maps/room.tmj' },
  // `tileset` é o nome do tileset dentro do .tmj (precisa bater exatamente).
  roomTiles: { key: 'tiles-placeholder-room', url: 'assets/tiles/placeholder-room.png', tileset: 'placeholder-room' },
} as const

// Cores da paleta provisória (docs/arte/biblia-de-arte.md) usadas pelo canvas.
export const PALETTE = {
  bg: 0x1b1526,
  panel: 0x2b2140,
  border: 0x0f0b17,
  ink: 0xf3e9d2,
  accent: 0xf4b860,
  cyan: 0x5ec4d6,
} as const
