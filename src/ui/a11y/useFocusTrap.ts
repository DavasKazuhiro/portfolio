import { useEffect, type RefObject } from 'react'
import { getFocusable, wrapFocusIndex } from './focusable'

/**
 * Prende o foco dentro de `ref` enquanto `active`: Tab/Shift+Tab circulam pelos
 * focáveis e foco que escapa (ex.: clique fora) volta para o contêiner.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const container = ref.current
    if (!active || !container) return

    // Painéis podem focar um item próprio (autoFocus); senão o foco vai para o diálogo.
    if (!container.contains(document.activeElement)) container.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = getFocusable(container)
      e.preventDefault()
      const current = items.indexOf(document.activeElement as HTMLElement)
      const next = wrapFocusIndex(current, items.length, e.shiftKey)
      ;(next >= 0 ? items[next] : container).focus()
    }
    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Node && !container.contains(e.target)) container.focus()
    }

    container.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [ref, active])
}
