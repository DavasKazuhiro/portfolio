// Lógica pura do ComputerPanel (testada em tests/ui-computer.test.ts).

export interface Project {
  icon: string
  titulo: string
  destaque?: boolean
  descricao: string
  tecnologias: readonly string[]
  link: string | null
}

/** Projetos com `destaque` primeiro; dentro de cada grupo mantém a ordem do JSON. */
export function sortProjects<T extends { destaque?: boolean }>(projects: readonly T[]): T[] {
  return [...projects.filter((p) => p.destaque), ...projects.filter((p) => !p.destaque)]
}
