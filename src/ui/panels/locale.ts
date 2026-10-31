import type { Locale } from '@/content'

/** Converte o idioma do i18next ('pt-BR', 'en-US'...) no locale do conteúdo. */
export function toLocale(language: string | undefined): Locale {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'pt'
}
