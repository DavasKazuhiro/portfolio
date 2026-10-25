import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EventBus } from '@/game/EventBus'
import { useGameStore } from '@/store/useGameStore'

function closePanel() {
  useGameStore.getState().close()
  EventBus.emit('panel-closed')
}

// Hospeda o painel do objeto aberto. No M1+ cada id ganha seu painel temático (lazy).
export function PanelHost() {
  const { t } = useTranslation()
  const openId = useGameStore((s) => s.openId)

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  if (!openId) return null

  return (
    <div className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <h2 id="panel-title">{t(`objects.${openId}`)}</h2>
      <p>{t('panel.placeholder')}</p>
      <button className="pixel-btn" autoFocus onClick={closePanel}>
        {t('hud.close')}
      </button>
    </div>
  )
}
