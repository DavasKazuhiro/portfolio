import type * as Phaser from 'phaser'
import { ASSETS } from '../assets'
import { tiledObjectToTileRect, TILE_W, type TileRect } from '../iso'
import { isInteractableId, type InteractableId } from '../objects/registry'

export const SHELL_LAYER = 'room-shell'
export const INTERACTABLES_LAYER = 'interactables'
export const DECOR_LAYER = 'decor'

export interface PlacedSpec {
  // Retângulo da pegada em tiles (objetos de parede: altura zero na borda da parede).
  footprint: TileRect
}
export interface InteractableSpec extends PlacedSpec {
  id: InteractableId
}
export interface DecorSpec extends PlacedSpec {
  // Nome do arquivo do sprite (chave da textura).
  name: string
}

export interface RoomMapData {
  map: Phaser.Tilemaps.Tilemap
  // Canto superior esquerdo do image layer `room-shell` no mundo (só usado se o PNG não tiver
  // pivot; o normal é o pivot do JSON pôr o canto do fundo na origem).
  shellTopLeft: { x: number; y: number } | null
  interactables: InteractableSpec[]
  decor: DecorSpec[]
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

function footprintOf(obj: Phaser.Types.Tilemaps.TiledObject, tileHeight: number): TileRect {
  return tiledObjectToTileRect(
    { x: obj.x ?? 0, y: obj.y ?? 0, width: obj.width ?? 0, height: obj.height ?? 0 },
    tileHeight,
  )
}

// Lê o room.tmj (ADR 0004):
// - image layer `room-shell`: a casca do quarto (piso, paredes, sombras), desenhada como imagem;
// - object layer `interactables`: retângulo da pegada + propriedade `id` (fallback: nome);
// - object layer `decor`: decoração e luzes; o nome do objeto é o nome do arquivo do sprite.
// Não há tile layers: a arte é gerada inteira (ADR 0005).
export function readRoomMap(scene: Phaser.Scene): RoomMapData {
  const map = scene.make.tilemap({ key: ASSETS.roomMap.key })

  const shell = map.images.find((img: { name: string }) => img.name === SHELL_LAYER) as
    | { x: number; y: number }
    | undefined
  if (!shell) console.warn(`room.tmj: image layer "${SHELL_LAYER}" não encontrado`)
  // No Tiled o vértice de cima do tile (0,0) fica em x = altura do mapa × meio tile.
  const shellTopLeft = shell ? { x: shell.x - (map.height * TILE_W) / 2, y: shell.y } : null

  const interactables: InteractableSpec[] = []
  const objectLayer = map.getObjectLayer(INTERACTABLES_LAYER)
  if (!objectLayer) console.warn(`room.tmj: object layer "${INTERACTABLES_LAYER}" não encontrado`)
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
    interactables.push({ id: raw, footprint: footprintOf(obj, map.tileHeight) })
  }

  const decor: DecorSpec[] = []
  for (const obj of map.getObjectLayer(DECOR_LAYER)?.objects ?? []) {
    if (!obj.name) {
      console.warn(`room.tmj: objeto ${obj.id} do layer "${DECOR_LAYER}" sem nome; ignorado`)
      continue
    }
    decor.push({ name: obj.name, footprint: footprintOf(obj, map.tileHeight) })
  }

  return { map, shellTopLeft, interactables, decor }
}
