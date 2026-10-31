import { useTranslation } from 'react-i18next'
import { INTERACTABLES } from '@/game/objects/registry'
import { useGameStore } from '@/store/useGameStore'
import { rememberFocus } from '@/ui/a11y/focusReturn'
import { requestOpen } from './requestOpen'

export function Hud() {
  const { t, i18n } = useTranslation()
  const hoveredId = useGameStore((s) => s.hoveredId)
  const openId = useGameStore((s) => s.openId)
  const muted = useGameStore((s) => s.muted)
  const toggleMuted = useGameStore((s) => s.toggleMuted)

  return (
    <>
      {/* Gêmeo acessível do quarto: navegável por teclado e leitor de tela, primeiro na
          ordem de Tab. Usa o mesmo fluxo do clique (zoom da câmera → 'object-open'). */}
      <nav className="sr-only objects-menu" aria-label={t('hud.objectsMenu')}>
        <ul>
          {INTERACTABLES.map((item) => (
            <li key={item.id}>
              <button
                className="pixel-btn"
                onClick={(e) => {
                  rememberFocus(e.currentTarget)
                  requestOpen(item.id)
                }}
              >
                {t(item.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="hud">
        <button
          className="pixel-btn"
          lang={i18n.language === 'pt' ? 'en' : 'pt'}
          onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
        >
          {t('hud.language')}
        </button>
        <button className="pixel-btn" onClick={toggleMuted}>
          {muted ? t('hud.mute') : t('hud.unmute')}
        </button>
      </div>
      {hoveredId && !openId && (
        <div className="tooltip" aria-hidden="true">
          {t(`objects.${hoveredId}`)}
        </div>
      )}
    </>
  )
}
