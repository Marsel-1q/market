import { useEffect } from 'react'

const updateViewportVariables = (height?: number, stableHeight?: number) => {
  const root = document.documentElement
  if (typeof height === 'number') {
    root.style.setProperty('--tg-viewport-height', `${height}px`)
  }
  if (typeof stableHeight === 'number') {
    root.style.setProperty('--tg-viewport-stable-height', `${stableHeight}px`)
  }
}

export const useTelegramViewport = () => {
  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp
    if (!webApp) return

    updateViewportVariables(webApp.viewportHeight, webApp.viewportStableHeight)

    const handleViewportChange = (props: { height: number; isStateStable: boolean }) => {
      updateViewportVariables(props.height, webApp.viewportStableHeight)
    }

    webApp.onEvent?.('viewportChanged', handleViewportChange)

    return () => {
      webApp.offEvent?.('viewportChanged', handleViewportChange)
    }
  }, [])
}
