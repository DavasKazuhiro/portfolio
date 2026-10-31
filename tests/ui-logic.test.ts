import { describe, expect, it } from 'vitest'
import { getContent } from '@/content'
import en from '@/i18n/locales/en.json'
import pt from '@/i18n/locales/pt.json'
import { wrapFocusIndex } from '@/ui/a11y/focusable'
import { sortProjects } from '@/ui/panels/computer/projects'
import { toLocale } from '@/ui/panels/locale'

describe('wrapFocusIndex (foco preso)', () => {
  it('avança e volta ao início', () => {
    expect(wrapFocusIndex(0, 3, false)).toBe(1)
    expect(wrapFocusIndex(2, 3, false)).toBe(0)
  })
  it('Shift+Tab recua e vai para o fim', () => {
    expect(wrapFocusIndex(1, 3, true)).toBe(0)
    expect(wrapFocusIndex(0, 3, true)).toBe(2)
  })
  it('foco fora da lista entra pelo começo ou fim', () => {
    expect(wrapFocusIndex(-1, 3, false)).toBe(0)
    expect(wrapFocusIndex(-1, 3, true)).toBe(2)
  })
  it('lista vazia', () => {
    expect(wrapFocusIndex(-1, 0, false)).toBe(-1)
  })
})

describe('sortProjects', () => {
  it('destaques primeiro, mantendo a ordem relativa', () => {
    const list = [{ n: 'a' }, { n: 'b', destaque: true }, { n: 'c' }, { n: 'd', destaque: true }]
    expect(sortProjects(list).map((p) => p.n)).toEqual(['b', 'd', 'a', 'c'])
  })
  it('não perde projetos do conteúdo real', () => {
    const { projects } = getContent('pt')
    expect(sortProjects(projects)).toHaveLength(projects.length)
  })
})

describe('toLocale', () => {
  it('mapeia idiomas do navegador', () => {
    expect(toLocale('en-US')).toBe('en')
    expect(toLocale('pt-BR')).toBe('pt')
    expect(toLocale(undefined)).toBe('pt')
  })
})

describe('i18n', () => {
  type Tree = { [k: string]: string | Tree }
  const keys = (o: Tree, prefix = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : keys(v, `${prefix}${k}.`)))

  it('PT e EN têm as mesmas chaves', () => {
    expect(keys(en as Tree).sort()).toEqual(keys(pt as Tree).sort())
  })
})
