import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { BottomNavigation } from './BottomNavigation'

export const MainLayout = () => {
  return (
    <div className="flex min-h-[var(--tg-viewport-height,100dvh)] justify-center bg-transparent text-foreground">
      <div className="flex w-full max-w-[420px] flex-1 flex-col rounded-t-[32px] bg-[rgba(12,18,27,0.92)] shadow-[0_-10px_40px_rgba(0,0,0,0.45)] backdrop-blur">
        <AppHeader />
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}
