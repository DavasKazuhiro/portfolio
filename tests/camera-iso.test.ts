import { describe, expect, it } from 'vitest'
import { isoToScreen, TILE_H, TILE_W, tiledObjectToTileRect, tileRectCenter, unitsToScreen } from '@/game/iso'
import { isInteractableId } from '@/game/objects/registry'
import {
  clampZoom,
  FOCUS_FILL,
  fitZoom,
  focusZoom,
  MAX_ZOOM,
  MIN_ZOOM,
  padRect,
  rectCenter,
} from '@/game/systems/cameraMath'
// `?raw` (Vite) evita depender de tipos do Node só para ler o .tmj.
import roomRaw from '../public/maps/room.tmj?raw'

describe('cameraMath.clampZoom', () => {
  it('arredonda para baixo e mantém inteiro', () => {
    expect(clampZoom(3.9)).toBe(3)
    expect(clampZoom(2)).toBe(2)
  })
  it('respeita os limites', () => {
    expect(clampZoom(0)).toBe(MIN_ZOOM)
    expect(clampZoom(-5)).toBe(MIN_ZOOM)
    expect(clampZoom(100)).toBe(MAX_ZOOM)
  })
})

describe('cameraMath.fitZoom', () => {
  it('maior zoom inteiro que cabe nos dois eixos', () => {
    // 1280/256 = 5, 720/176 = 4,09 → 4
    expect(fitZoom(1280, 720, { x: 0, y: 0, width: 256, height: 176 })).toBe(4)
  })
  it('aplica a fração de preenchimento', () => {
    // 0,6 × 1280 / 32 = 24, 0,6 × 720 / 16 = 27 → 24, limitado a MAX_ZOOM
    expect(fitZoom(1280, 720, { x: 0, y: 0, width: 32, height: 16 }, FOCUS_FILL)).toBe(MAX_ZOOM)
    // 0,5 × 400 / 100 = 2
    expect(fitZoom(400, 400, { x: 0, y: 0, width: 100, height: 100 }, 0.5)).toBe(2)
  })
  it('viewport menor que o retângulo nunca dá zoom < 1', () => {
    expect(fitZoom(100, 100, { x: 0, y: 0, width: 500, height: 500 })).toBe(MIN_ZOOM)
  })
  it('retângulo degenerado não divide por zero', () => {
    expect(fitZoom(800, 600, { x: 0, y: 0, width: 0, height: 10 })).toBe(MIN_ZOOM)
    expect(fitZoom(800, 600, { x: 0, y: 0, width: 10, height: -1 })).toBe(MIN_ZOOM)
  })
  it('resultado é sempre inteiro (pixel art)', () => {
    for (const [w, h] of [[360, 640], [375, 812], [1366, 768], [1920, 1080]]) {
      const z = fitZoom(w, h, { x: -136, y: -40, width: 272, height: 120 })
      expect(Number.isInteger(z)).toBe(true)
    }
  })
})

describe('cameraMath.focusZoom', () => {
  const small = { x: 0, y: 0, width: 32, height: 16 }
  const big = { x: 0, y: 0, width: 300, height: 300 }
  it('sempre ao menos 1 nível acima da visão do quarto', () => {
    expect(focusZoom(400, 400, big, 2)).toBe(3)
    expect(focusZoom(360, 640, big, 1)).toBe(2)
  })
  it('usa o encaixe quando ele é maior', () => {
    // 0,6 × 1280 / 32 = 24 → MAX
    expect(focusZoom(1280, 720, small, 3)).toBe(MAX_ZOOM)
    // 0,6 × 320 / 32 = 6, 0,6 × 160 / 16 = 6 → 6 (> roomZoom + 1)
    expect(focusZoom(320, 160, small, 2)).toBe(6)
  })
  it('não passa do MAX_ZOOM mesmo com roomZoom alto', () => {
    expect(focusZoom(1280, 720, big, MAX_ZOOM)).toBe(MAX_ZOOM)
  })
})

describe('cameraMath.rectCenter / padRect', () => {
  it('centro arredondado para pixel inteiro', () => {
    expect(rectCenter({ x: 0, y: 0, width: 10, height: 20 })).toEqual({ x: 5, y: 10 })
    expect(rectCenter({ x: 1, y: 1, width: 3, height: 3 })).toEqual({ x: 3, y: 3 })
  })
  it('padRect cresce igual nos quatro lados e preserva o centro', () => {
    const r = { x: 10, y: 20, width: 30, height: 40 }
    const p = padRect(r, 8)
    expect(p).toEqual({ x: 2, y: 12, width: 46, height: 56 })
    expect(rectCenter(p)).toEqual(rectCenter(r))
  })
})

describe('iso', () => {
  it('tile 64×32 (ADR 0005)', () => {
    expect(TILE_W).toBe(64)
    expect(TILE_H).toBe(32)
  })

  it('isoToScreen: vértice de cima do tile (0,0) na origem', () => {
    expect(isoToScreen(0, 0)).toEqual({ x: 0, y: 0 })
    expect(isoToScreen(1, 0)).toEqual({ x: 32, y: 16 })
    expect(isoToScreen(0, 1)).toEqual({ x: -32, y: 16 })
    expect(isoToScreen(2.5, 3.5)).toEqual({ x: -32, y: 96 })
    // Canto da frente do quarto 7×7.
    expect(isoToScreen(7, 7)).toEqual({ x: 0, y: 224 })
  })

  it('isoToScreen: centros de tile caem em pixel inteiro', () => {
    for (let c = 0; c < 7; c++) {
      for (let r = 0; r < 7; r++) {
        const p = isoToScreen(c + 0.5, r + 0.5)
        expect(Number.isInteger(p.x) && Number.isInteger(p.y), `tile (${c},${r})`).toBe(true)
      }
    }
  })

  it('unitsToScreen: 8 unidades = 1 tile; z sobe 2 px por unidade', () => {
    expect(unitsToScreen(8, 0)).toEqual(isoToScreen(1, 0))
    expect(unitsToScreen(16, 24)).toEqual(isoToScreen(2, 3))
    expect(unitsToScreen(0, 0, 10)).toEqual({ x: 0, y: -20 })
  })

  it('tiledObjectToTileRect: 1 tile = tileHeight (32) unidades nos dois eixos', () => {
    // O computador do room.tmj: x=0, y=0, 128×128 → tiles (0,0)–(4,4)
    expect(tiledObjectToTileRect({ x: 0, y: 0, width: 128, height: 128 })).toEqual({ x0: 0, y0: 0, x1: 4, y1: 4 })
    // pc-tower: x=128, y=0, 32×32 → tile (4,0)–(5,1)
    expect(tiledObjectToTileRect({ x: 128, y: 0, width: 32, height: 32 })).toEqual({ x0: 4, y0: 0, x1: 5, y1: 1 })
  })
  it('tiledObjectToTileRect: aceita frações e tileHeight custom', () => {
    expect(tiledObjectToTileRect({ x: 16, y: 48, width: 16, height: 16 })).toEqual({ x0: 0.5, y0: 1.5, x1: 1, y1: 2 })
    expect(tiledObjectToTileRect({ x: 32, y: 16, width: 16, height: 16 }, 16)).toEqual({ x0: 2, y0: 1, x1: 3, y1: 2 })
  })
  it('tiledObjectToTileRect: objeto de tamanho zero vira ponto', () => {
    const r = tiledObjectToTileRect({ x: 32, y: 32, width: 0, height: 0 }, TILE_H)
    expect(r).toEqual({ x0: 1, y0: 1, x1: 1, y1: 1 })
  })
  it('tileRectCenter: centro da pegada', () => {
    expect(tileRectCenter({ x0: 0, y0: 0, x1: 4, y1: 4 })).toEqual({ col: 2, row: 2 })
    // Objeto de parede (altura zero): centro na borda.
    expect(tileRectCenter({ x0: 5, y0: 0, x1: 6.5, y1: 0 })).toEqual({ col: 5.75, row: 0 })
  })
})

describe('public/maps/room.tmj', () => {
  type TiledObject = { id: number; name: string; x: number; y: number; width: number; height: number; properties?: { name: string; value: unknown }[] }
  type Layer = { name: string; type: string; image?: string; objects?: TiledObject[] }
  const map = JSON.parse(roomRaw) as {
    orientation: string
    tilewidth: number
    tileheight: number
    width: number
    height: number
    layers: Layer[]
    tilesets: unknown[]
  }
  const layer = map.layers.find((l) => l.name === 'interactables')
  // Mesma regra de RoomMap.ts: propriedade `id` e, na falta dela, o nome do objeto.
  const idOf = (o: TiledObject) => o.properties?.find((p) => p.name === 'id')?.value ?? o.name

  it('é isométrico 64×32, 7×7, com o object layer "interactables"', () => {
    expect(map.orientation).toBe('isometric')
    expect(map.tilewidth).toBe(TILE_W)
    expect(map.tileheight).toBe(TILE_H)
    expect(map.width).toBe(7)
    expect(map.height).toBe(7)
    expect(layer?.type).toBe('objectgroup')
  })

  it('casca no image layer "room-shell", decor em object layer e nenhum tileset (ADR 0005)', () => {
    expect(map.tilesets).toEqual([])
    expect(map.layers.some((l) => l.type === 'tilelayer')).toBe(false)
    const shell = map.layers.find((l) => l.name === 'room-shell')
    expect(shell?.type).toBe('imagelayer')
    expect(shell?.image).toBe('../assets/tiles/room-shell.png')
    expect(map.layers.find((l) => l.name === 'decor')?.type).toBe('objectgroup')
    // Ordem de desenho: casca, decor, interagíveis.
    expect(map.layers.map((l) => l.name)).toEqual(['room-shell', 'decor', 'interactables'])
  })

  it('todo id do layer interactables passa em isInteractableId', () => {
    const objects = layer?.objects ?? []
    expect(objects.length).toBeGreaterThan(0)
    for (const o of objects) {
      const id = idOf(o)
      expect(typeof id === 'string' && isInteractableId(id), `objeto ${o.id} (${String(id)})`).toBe(true)
    }
  })

  it('ids não se repetem e nome bate com a propriedade id', () => {
    const objects = layer?.objects ?? []
    const ids = objects.map(idOf)
    expect(new Set(ids).size).toBe(ids.length)
    for (const o of objects) {
      const prop = o.properties?.find((p) => p.name === 'id')?.value
      if (prop !== undefined) expect(prop).toBe(o.name)
    }
  })

  it('footprints (interagíveis e decor) ficam dentro do mapa 7×7', () => {
    const decor = map.layers.find((l) => l.name === 'decor')?.objects ?? []
    for (const o of [...(layer?.objects ?? []), ...decor]) {
      const r = tiledObjectToTileRect(o, map.tileheight)
      expect(r.x0).toBeGreaterThanOrEqual(0)
      expect(r.y0).toBeGreaterThanOrEqual(0)
      expect(r.x1).toBeLessThanOrEqual(map.width)
      expect(r.y1).toBeLessThanOrEqual(map.height)
    }
  })
})
