import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { useTelegramTheme } from '@/hooks/useTelegramTheme'
import { useTelegramViewport } from '@/hooks/useTelegramViewport'

const MarketPage = lazy(() => import('@/pages/Market/MarketPage'))
const ActivityPage = lazy(() => import('@/pages/Activity/ActivityPage'))
const StoragePage = lazy(() => import('@/pages/Storage/StoragePage'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))

const Loader = () => (
  <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
    Загрузка интерфейса...
  </div>
)

function App() {
  useTelegramTheme()
  useTelegramViewport()

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/market" replace />} />
              <Route path="market" element={<MarketPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="storage" element={<StoragePage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TonConnectUIProvider>
  )
}

export default App
