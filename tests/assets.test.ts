import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ROOM_SPRITES } from '@/game/assets'
import { isInteractableId } from '@/game/objects/registry'
import roomRaw from '../public/maps/room.tmj?raw'

// Contrato dos assets gerados por tools/art (bíblia de arte, "Formato"; ADR 0005): cada sprite é
// PNG + JSON Hash do Aseprite com `meta.quartoPixel`, e todo sprite do room.tmj existe em disco.
const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))
const ASSETS_DIR = `${PUBLIC}assets/`

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`],
  )
}
const rel = (p: string) => p.slice(PUBLIC.length)

// Largura e altura do PNG (IHDR, bytes 16–23).
function pngSize(path: string) {
  const b = readFileSync(path)
  expect(b.subarray(1, 4).toString('latin1'), `${rel(path)} não é PNG`).toBe('PNG')
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
}

type Frame = { frame: { x: number; y: number; w: number; h: number }; duration?: number }
type Sheet = {
  frames: Record<string, Frame> | Frame[]
  meta: {
    image?: string
    size?: { w: number; h: number }
    frameTags?: { name: string; from: number; to: number }[]
    quartoPixel?: Record<string, unknown>
  }
}

const files = walk(ASSETS_DIR)
const jsons = files.filter((f) => f.endsWith('.json'))
const pngs = files.filter((f) => f.endsWith('.png'))
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8')) as Sheet

describe('public/assets: JSONs gerados', () => {
  it('há assets gerados', () => {
    expect(jsons.length).toBeGreaterThan(0)
  })

  for (const path of jsons) {
    describe(rel(path), () => {
      const json = read(path)
      const frames = Array.isArray(json.frames) ? json.frames : Object.values(json.frames ?? {})

      it('tem meta.quartoPixel (objeto)', () => {
        const qp = json.meta?.quartoPixel
        expect(qp && typeof qp === 'object' && !Array.isArray(qp)).toBe(true)
      })

      it('meta.image aponta para o PNG ao lado, do tamanho de meta.size', () => {
        const dir = path.slice(0, path.lastIndexOf('/') + 1)
        expect(json.meta.image).toBe(path.slice(dir.length).replace(/\.json$/, '.png'))
        const png = dir + json.meta.image
        expect(existsSync(png)).toBe(true)
        expect(pngSize(png)).toEqual(json.meta.size)
      })

      it('frames dentro do PNG e tags dentro da lista de frames', () => {
        expect(frames.length).toBeGreaterThan(0)
        const size = json.meta.size!
        for (const { frame: f } of frames) {
          expect(f.x >= 0 && f.y >= 0 && f.x + f.w <= size.w && f.y + f.h <= size.h).toBe(true)
        }
        for (const t of json.meta.frameTags ?? []) {
          expect(t.from >= 0 && t.from <= t.to && t.to < frames.length, `tag ${t.name}`).toBe(true)
        }
      })
    })
  }

  it('camadas (`layerOf`, `syncFramesWith`) apontam para sprites que existem, com o mesmo canvas e âncora', () => {
    const byName = new Map(jsons.map((p) => [p.slice(p.lastIndexOf('/') + 1, -5), read(p)]))
    for (const [name, json] of byName) {
      const qp = json.meta.quartoPixel ?? {}
      for (const key of ['layerOf', 'syncFramesWith'] as const) {
        const target = qp[key]
        if (target === undefined) continue
        expect(typeof target === 'string' && byName.has(target), `${name}.${key} = ${String(target)}`).toBe(true)
        const main = byName.get(target as string)!
        expect(qp.anchor, `${name}: âncora igual à de ${target as string}`).toEqual(main.meta.quartoPixel?.anchor)
        const f0 = (j: Sheet) => (Array.isArray(j.frames) ? j.frames : Object.values(j.frames))[0].frame
        expect([f0(json).w, f0(json).h], `${name}: canvas igual ao de ${target as string}`).toEqual([f0(main).w, f0(main).h])
      }
    }
  })

  it('todo PNG de objects/ e tiles/ tem o JSON ao lado', () => {
    for (const png of pngs.filter((p) => /assets\/(objects|tiles)\//.test(p))) {
      expect(existsSync(png.replace(/\.png$/, '.json')), rel(png)).toBe(true)
    }
  })
})

describe('sprites do quarto em disco', () => {
  type TiledObject = { id: number; name: string; properties?: { name: string; value: unknown }[] }
  type Layer = { name: string; type: string; image?: string; objects?: TiledObject[] }
  const map = JSON.parse(roomRaw) as { layers: Layer[] }
  const layer = (name: string) => map.layers.find((l) => l.name === name)
  const hasSprite = (base: string) => existsSync(`${PUBLIC}${base}.png`) && existsSync(`${PUBLIC}${base}.json`)

  it('ROOM_SPRITES: toda entrada tem PNG + JSON', () => {
    for (const [key, base] of Object.entries(ROOM_SPRITES)) expect(hasSprite(base), `${key} → ${base}`).toBe(true)
  })

  it('image layer room-shell aponta para um PNG que existe (com o JSON ao lado)', () => {
    const image = layer('room-shell')?.image
    expect(image).toBeDefined()
    const png = fileURLToPath(new URL(image!, new URL('../public/maps/', import.meta.url)))
    expect(existsSync(png)).toBe(true)
    expect(existsSync(png.replace(/\.png$/, '.json'))).toBe(true)
  })

  it('cada objeto de decor tem sprite (nome = arquivo, registrado em ROOM_SPRITES)', () => {
    const objects = layer('decor')?.objects ?? []
    expect(objects.length).toBeGreaterThan(0)
    for (const o of objects) {
      const base = (ROOM_SPRITES as Record<string, string>)[o.name]
      expect(base, `decor "${o.name}" fora de ROOM_SPRITES`).toBeDefined()
      expect(hasSprite(base), `decor "${o.name}"`).toBe(true)
    }
  })

  it('cada interagível do mapa tem sprite com `focus` no meta.quartoPixel', () => {
    for (const o of layer('interactables')?.objects ?? []) {
      const id = (o.properties?.find((p) => p.name === 'id')?.value ?? o.name) as string
      expect(isInteractableId(id)).toBe(true)
      const base = (ROOM_SPRITES as Record<string, string>)[id]
      expect(base, `interagível "${id}" fora de ROOM_SPRITES`).toBeDefined()
      expect(hasSprite(base)).toBe(true)
      const json = read(`${PUBLIC}${base}.json`)
      expect(json.meta.quartoPixel?.focus, `${id}: focus`).toBeDefined()
    }
  })
})
