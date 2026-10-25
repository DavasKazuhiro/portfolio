import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import pt from './locales/pt.json'

// Textos da interface. Conteúdo do portfolio (projetos, experiência...) fica em src/content.
void i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en } },
  lng: navigator.language.startsWith('pt') ? 'pt' : 'en',
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
})

export default i18n
