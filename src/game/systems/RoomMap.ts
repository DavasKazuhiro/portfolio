import * as Phaser from 'phaser'
import { ASSETS } from '../assets'
import { isoToScreen, tiledObjectToTileRect, TILE_H, TILE_W, type TileRect } from '../iso'
import { isInteractableId, type InteractableId } from '../objects/registry'
import type { Rect } from './cameraMath'

export const INTERACTABLES_LAYER = 'interactables'

export interface InteractableSpec {
  id: InteractableId
  footprint: TileRect
}

export interface RoomMap {
  map: Phaser.Tilemaps.Tilemap
  // Retângulo do mundo ocupado pelo quarto (chão + paredes), para a câmera enquadrar.
  bounds: Rect
  interactables: InteractableSpec[]
}

type TiledProperty = { name: string; value: unknown }

// O Phaser mantém `properties` como veio do Tiled: array de {name, type, value} (formato atual)
// ou objeto simples (formato antigo). Aceita os dois.
function readProperty(properties: unknown, name: string): unknown {
  if (Array.isArray(properties)) {
    return (properties as TiledProperty[]).find((p) => p.name === name)?.value
  }
  if (properties && typeof properties === 'object') return (properties as Record<string, unknown>)[name]
  return undefined
}

// Monta todas as tile layers do .tmj e lê o object layer `interactables`.
//
// Alinhamento Phaser × Tiled (documentado em docs/adr/arquitetura/cena.md):
// - O Phaser desenha cada tile com o canto superior esquerdo em (pixelX, pixelY), e o Tiled
//   alinha tiles mais altos que o grid pelo pé. Os tiles têm 32×48, então cada camada sobe
//   (alturaDoTile - 16) px.
// - Cada camada também anda -16 px em x para que o vértice de cima do tile (0,0) caia na origem
//   do mundo, igual a `isoToScreen`.
export function buildRoomMap(scene: Phaser.Scene): RoomMap {
  const map = scene.make.tilemap({ key: ASSETS.roomMap.key })
  const tileset = map.addTilesetImage(ASSETS.roomTiles.tileset, ASSETS.roomTiles.key)
  if (!tileset) throw new Error(`room.tmj: tileset "${ASSETS.roomTiles.tileset}" não encontrado`)

  const lift = tileset.tileHeight - map.tileHeight
  let wallHeight = 0
  map.layers.forEach((layerData, index) => {
    const layer = map.createLayer(layerData.name, tileset, -TILE_W / 2, -lift)
    if (!layer) return
    // Quarto pequeno: sem culling (evita sumir tile alto na borda com o zoom).
    if (layer instanceof Phaser.Tilemaps.TilemapLayer) layer.setSkipCull(true)
    layer.setDepth(index)
    if (layerData.name !== 'floor') wallHeight = Math.max(wallHeight, lift)
  })

  // Quarto ocupa do canto esquerdo (0, altura) ao direito (largura, 0) e sobe a altura das paredes.
  const left = isoToScreen(0, map.height).x
  const right = isoToScreen(map.width, 0).x
  const top = isoToScreen(0, 0).y - wallHeight
  const bottom = isoToScreen(map.width, map.height).y
  const bounds = { x: left, y: top, width: right - left, height: bottom - top }

  const interactables: InteractableSpec[] = []
  const objectLayer = map.getObjectLayer(INTERACTABLES_LAYER)
  if (!objectLayer) {
    console.warn(`room.tmj: object layer "${INTERACTABLES_LAYER}" não encontrado`)
  }
  for (const obj of objectLayer?.objects ?? []) {
    const raw = readProperty(obj.properties, 'id') ?? obj.name
    if (typeof raw !== 'string' || !isInteractableId(raw)) {
      console.warn(`room.tmj: objeto ${obj.id} com id inválido (${String(raw)}); ignorado`)
      continue
    }
    if (interactables.some((item) => item.id === raw)) {
      console.warn(`room.tmj: id "${raw}" repetido; só o primeiro vale`)
      continue
    }
    const width = obj.width || TILE_H
    const height = obj.height || TILE_H
    interactables.push({
      id: raw,
      footprint: tiledObjectToTileRect({ x: obj.x ?? 0, y: obj.y ?? 0, width, height }, map.tileHeight),
    })
  }

  return { map, bounds, interactables }
}
