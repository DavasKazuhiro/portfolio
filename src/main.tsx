import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import '@/i18n'
import '@/app/global.css'

// Sem <StrictMode>: a montagem dupla em dev cria e destrói o Phaser.Game duas vezes,
// e o AudioContext fechado do primeiro gera erros no console.
createRoot(document.getElementById('root')!).render(<App />)
