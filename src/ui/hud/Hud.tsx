import { useTranslation } from 'react-i18next'
import { INTERACTABLES } from '@/game/objects/registry'
import { useGameStore } from '@/store/useGameStore'

export function Hud() {
  const { t, i18n } = useTranslation()
  const hoveredId = useGameStore((s) => s.hoveredId)
  const muted = useGameStore((s) => s.muted)
  const toggleMuted = useGameStore((s) => s.toggleMuted)
  const open = useGameStore((s) => s.open)

  return (
    <>
      <div className="hud">
        <button className="pixel-btn" onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}>
          {t('hud.language')}
        </button>
        <button className="pixel-btn" onClick={toggleMuted}>
          {muted ? t('hud.mute') : t('hud.unmute')}
        </button>
      </div>
      {hoveredId && <div className="tooltip">{t(`objects.${hoveredId}`)}</div>}
      {/* Gêmeo acessível do quarto: navegável por teclado e leitor de tela. */}
      <nav className="sr-only" aria-label={t('hud.objectsMenu')}>
        <ul>
          {INTERACTABLES.map((item) => (
            <li key={item.id}>
              <button onClick={() => open(item.id)}>{t(item.labelKey)}</button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
