import { lazy, Suspense, useEffect, useRef, type ComponentType, type LazyExoticComponent } from 'react'
import { useTranslation } from 'react-i18next'
import type { InteractableId } from '@/game/objects/registry'
import { useGameStore } from '@/store/useGameStore'
import { takeRememberedFocus } from '@/ui/a11y/focusReturn'
import { useFocusTrap } from '@/ui/a11y/useFocusTrap'
import { Closeup } from '@/ui/closeup/Closeup'
import { CLOSEUPS, loadCloseup } from '@/ui/closeup/useCloseupSheet'
import { closePanel } from './closePanel'
import { GenericPanel } from './GenericPanel'
import type { PanelProps } from './types'

// Painéis temáticos por id, carregados sob demanda. Ids fora do mapa usam o GenericPanel.
const PANELS: Partial<Record<InteractableId, LazyExoticComponent<ComponentType<PanelProps>>>> = {
  computer: lazy(() => import('./ComputerPanel').then((m) => ({ default: m.ComputerPanel }))),
}

const TITLE_ID = 'panel-title'

// Hospeda o painel do objeto aberto: diálogo modal, foco preso, Esc/clique fora fecham.
export function PanelHost() {
  const { t } = useTranslation()
  const openId = useGameStore((s) => s.openId)
  const dialogRef = useRef<HTMLDivElement>(null)

  useFocusTrap(dialogRef, openId !== null)

  // Pré-carrega as ilustrações das visões de perto (são pequenas) para o boot entrar na abertura.
  useEffect(() => {
    for (const id of Object.keys(CLOSEUPS) as InteractableId[]) void loadCloseup(id)
  }, [])

  // Guarda quem abriu e devolve o foco quando o diálogo desmonta.
  useEffect(() => {
    if (!openId) return
    const returnTo = takeRememberedFocus()
    return () => {
      if (returnTo?.isConnected) returnTo.focus()
    }
  }, [openId])

  // Esc fecha. Painéis com navegação interna (ex.: pasta aberta) chamam
  // preventDefault() no seu onKeyDown para tratar o Esc antes.
  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  if (!openId) return null

  const Panel = PANELS[openId] ?? GenericPanel
  const dialogProps = {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': TITLE_ID,
    tabIndex: -1,
  } as const
  const content = (
    <Suspense
      fallback={
        <div className="panel" role="status">
          <h2 id={TITLE_ID}>{t(`objects.${openId}`)}</h2>
          <p>{t('panel.loading')}</p>
        </div>
      }
    >
      <Panel titleId={TITLE_ID} onClose={closePanel} />
    </Suspense>
  )

  // Objetos com visão de perto: ilustração frontal + painel dentro da área de conteúdo.
  if (CLOSEUPS[openId]) {
    return (
      <Closeup key={openId} id={openId} dialogRef={dialogRef} dialogProps={dialogProps} onOutsideClick={closePanel}>
        {content}
      </Closeup>
    )
  }

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel()
      }}
    >
      <div ref={dialogRef} className={`panel-dialog panel-dialog--${openId}`} {...dialogProps}>
        {content}
      </div>
    </div>
  )
}
