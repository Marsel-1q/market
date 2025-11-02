import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ComingSoon } from '@/components/ui/coming-soon'
import { cn } from '@/lib/utils'

const topTabs = [
  { id: 'items', label: 'Предметы' },
  { id: 'offers', label: 'Офферы' },
  { id: 'activity', label: 'Активность' },
]

const secondaryTabs = [
  { id: 'channels', label: 'Каналы' },
  { id: 'gifts', label: 'Подарки' },
]

const StoragePage = () => {
  const [section, setSection] = useState('items')
  const [subcategory, setSubcategory] = useState('channels')
  const isGiftSubcategory = subcategory === 'gifts'

  return (
    <div className="space-y-6 px-4 py-5">

      <Tabs value={section} onValueChange={setSection}>
        <TabsList className="mb-3 grid grid-cols-3 gap-1.5 overflow-hidden rounded-full border border-white/5 bg-[#101822] p-1.5">
          {topTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'flex h-9 items-center justify-center rounded-full text-sm font-semibold leading-none transition-all',
                'data-[state=active]:bg-[linear-gradient(135deg,#3b8bff,#2560ff)] data-[state=active]:px-4 data-[state=active]:text-white',
                'data-[state=inactive]:text-muted-foreground',
              )}
            >
              <span className="inline-flex -translate-y-[6px] transform">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs value={subcategory} onValueChange={setSubcategory}>
        <TabsList className="mb-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-full border border-white/5 bg-[#101822] p-1.5">
          {secondaryTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'flex h-9 items-center justify-center rounded-full text-sm font-semibold leading-none transition-all',
                'data-[state=active]:bg-[#2487ff] data-[state=active]:px-4 data-[state=active]:text-white',
                'data-[state=inactive]:text-muted-foreground',
              )}
            >
              <span className="inline-flex -translate-y-[2px] transform">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isGiftSubcategory ? (
        <ComingSoon
          message="Хранилище подарков скоро будет доступно"
          className="flex-1 border-white/6 bg-[#0f1720]/80"
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-white/5 bg-[#0f1720]/90 px-6 py-12 text-center shadow-[0_12px_30px_rgba(8,14,20,0.5)]">
          <div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,#253650,rgba(12,18,27,0.6))] shadow-[0_20px_40px_rgba(8,14,20,0.55)]">
            <div className="relative h-24 w-20">
              <div className="absolute inset-x-0 bottom-0 h-20 rounded-full bg-[#1d2735]" />
              <div className="absolute inset-x-2 bottom-6 h-14 rounded-full bg-[#2e3b4d]" />
              <div className="absolute inset-x-[14px] bottom-12 h-8 rounded-full bg-[#3b4d60]" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Каналы не найдены</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ваши каналы появятся здесь
          </p>
          <Button className="mt-6 rounded-full bg-[linear-gradient(135deg,#3c8dff,#2560ff)] px-8 py-6 text-base font-semibold text-white shadow-[0_12px_24px_rgba(59,140,255,0.4)]">
            Добавить канал
          </Button>
      </div>
      )}
    </div>
  )
}

export default StoragePage
