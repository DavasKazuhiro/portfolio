// Projeção isométrica 2:1 (tile 32×16), a mesma que o Tiled usa em mapas "isometric".
// Convenção do projeto: o vértice de cima do tile (0,0) fica na origem do mundo. As camadas do
// Tiled são posicionadas para casar com isso (ver systems/RoomMap.ts).
export const TILE_W = 32
export const TILE_H = 16

// Aceita coordenadas fracionárias de tile (ex.: o centro do tile (2,3) é (2.5, 3.5)).
export function isoToScreen(col: number, row: number) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  }
}

export interface TileRect {
  x0: number
  y0: number
  x1: number
  y1: number
}

// Em mapas isométricos o Tiled guarda objetos num espaço "ortogonal" em que 1 tile vale
// `tileHeight` unidades nos dois eixos. Converte o retângulo do objeto para coordenadas de tile.
export function tiledObjectToTileRect(
  obj: { x: number; y: number; width: number; height: number },
  tileHeight = TILE_H,
): TileRect {
  return {
    x0: obj.x / tileHeight,
    y0: obj.y / tileHeight,
    x1: (obj.x + obj.width) / tileHeight,
    y1: (obj.y + obj.height) / tileHeight,
  }
}
