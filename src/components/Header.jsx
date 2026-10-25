import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, profile } from '../data/content'
import useScrollSpy from '../hooks/useScrollSpy'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(navLinks.map((l) => l.href.slice(1)))

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="interface header__bar">
        <a href="#home" className="logo">
          {profile.logo}
          <span>.</span>
        </a>

        <nav className="navbar" aria-label="Navegação principal">
          <ul className="nav-list">
            {navLinks.map((link, i) => (
              <li className="nav-item" key={link.href}>
                <a
                  className={`nav-link ${activeId === link.href.slice(1) ? 'active' : ''}`}
                  href={link.href}
                  style={{ '--i': i }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="btn-abrir"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="overlay-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
            />
            <motion.div
              className="menu-mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="btn-fechar">
                <button aria-label="Fechar menu" onClick={closeMenu}>
                  ×
                </button>
              </div>
              <nav aria-label="Navegação mobile">
                <ul>
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} onClick={closeMenu}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
