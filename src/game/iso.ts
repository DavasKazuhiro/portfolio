// Projeção isométrica 2:1 (tile 32×16), a mesma que o Tiled usa em mapas "isometric".
export const TILE_W = 32
export const TILE_H = 16

export function isoToScreen(col: number, row: number) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  }
}
