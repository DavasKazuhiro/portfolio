// Guarda quem abriu o painel para devolver o foco ao fechar.
// Fica fora do store: elementos do DOM não são estado serializável.

let remembered: HTMLElement | null = null

export function rememberFocus(el: Element | null) {
  remembered = el instanceof HTMLElement && el !== document.body ? el : null
}

/** Devolve (e esquece) o elemento guardado; cai no foco atual se nada foi guardado. */
export function takeRememberedFocus(): HTMLElement | null {
  const el = remembered ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
  remembered = null
  return el && el !== document.body ? el : null
}
