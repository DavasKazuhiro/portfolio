import { describe, expect, it } from 'vitest'
import { INTERACTABLES, isInteractableId } from '@/game/objects/registry'
import en from '@/i18n/locales/en.json'
import pt from '@/i18n/locales/pt.json'

describe('registry de interagíveis', () => {
  it('ids são únicos', () => {
    const ids = INTERACTABLES.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todo objeto tem rótulo em PT e EN', () => {
    for (const { id } of INTERACTABLES) {
      expect(pt.objects).toHaveProperty(id)
      expect(en.objects).toHaveProperty(id)
    }
  })

  it('valida ids vindos do Tiled', () => {
    expect(isInteractableId('computer')).toBe(true)
    expect(isInteractableId('geladeira')).toBe(false)
  })
})
