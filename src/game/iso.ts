// Projeção isométrica 2:1 (tile 64×32, ADR 0005), a mesma que o Tiled usa em mapas "isometric".
// Convenção do projeto (ADR 0004): o vértice de cima do tile (0,0) — o canto do fundo do quarto,
// no chão — fica na origem do mundo. O room-shell e os objetos são posicionados a partir daí.
export const TILE_W = 64
export const TILE_H = 32

// Unidades do gerador de arte (tools/art/lib.mjs): 1 tile = 8 unidades no chão; em z, 1 unidade
// sobe 2 px. Usado pelos stand-ins e para ler caixas das specs.
export const UNITS_PER_TILE = 8
export const PX_PER_UNIT_Z = 2

// Aceita coordenadas fracionárias de tile (ex.: o centro do tile (2,3) é (2.5, 3.5)).
// Meio tile dá sempre px inteiro (16/8), então âncoras em centros de tile caem em pixel inteiro.
export function isoToScreen(col: number, row: number) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  }
}

// Ponto (x, y, z) em unidades do gerador → px do mundo (mesma conta de `proj` em tools/art/lib.mjs).
export function unitsToScreen(x: number, y: number, z = 0) {
  const p = isoToScreen(x / UNITS_PER_TILE, y / UNITS_PER_TILE)
  return { x: p.x, y: p.y - z * PX_PER_UNIT_Z }
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

// Âncora de um objeto (bíblia de arte): centro do retângulo da pegada, no chão. Para objetos de
// parede o retângulo tem altura zero na borda da parede, e o centro é a base da parede.
export function tileRectCenter(rect: TileRect) {
  return { col: (rect.x0 + rect.x1) / 2, row: (rect.y0 + rect.y1) / 2 }
}
