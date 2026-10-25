// Ponto único de acesso ao conteúdo. Cada idioma tem os mesmos arquivos em content/<lang>/.
// EN ainda não existe (ver docs/conteudo/pendencias.md); usa PT como fallback.
import about from './pt/about.json'
import awards from './pt/awards.json'
import education from './pt/education.json'
import experiences from './pt/experiences.json'
import extras from './pt/extras.json'
import profile from './pt/profile.json'
import projects from './pt/projects.json'
import skills from './pt/skills.json'

const pt = { about, awards, education, experiences, extras, profile, projects, skills }

export type Content = typeof pt
export type Locale = 'pt' | 'en'

const byLocale: Record<Locale, Content> = { pt, en: pt }

export function getContent(locale: Locale): Content {
  return byLocale[locale]
}
