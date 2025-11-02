import { useEffect } from 'react'

const themeMapping: Record<string, string> = {
  '--tg-theme-bg-color': 'bg_color',
  '--tg-theme-text-color': 'text_color',
  '--tg-theme-hint-color': 'hint_color',
  '--tg-theme-link-color': 'link_color',
  '--tg-theme-button-color': 'button_color',
  '--tg-theme-button-text-color': 'button_text_color',
  '--tg-theme-secondary-bg-color': 'secondary_bg_color',
}

export const useTelegramTheme = () => {
  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp
    if (!webApp?.themeParams) return

    const root = document.documentElement
    const themeParams = webApp.themeParams as Record<string, string>

    Object.entries(themeMapping).forEach(([cssVar, tgKey]) => {
      const value = themeParams[tgKey]
      if (value) {
        root.style.setProperty(cssVar, value)
      }
    })
  }, [])
}
