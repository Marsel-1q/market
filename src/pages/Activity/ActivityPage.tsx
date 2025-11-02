import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Gem, Search } from 'lucide-react'
import coconutImage from '@/assets/images/coconut.svg'
import { ComingSoon } from '@/components/ui/coming-soon'

const categories = [
  { id: 'gifts', label: 'Подарки' },
  { id: 'channels', label: 'Каналы' },
] as const

type ActivityCategory = (typeof categories)[number]['id']

interface ActivityItem {
  name: string
  id: string
  price: number
  volume: number
  timestamp: string
  status: string
  image: string
  type: ActivityCategory
  giftId: string
}

const activityItems: ActivityItem[] = [
  {
    name: 'Coconut Drink',
    id: '18438',
    price: 7.5,
    volume: 18,
    timestamp: '2023-11-01T17:25:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Coconut Drink',
    id: '18420',
    price: 9.5,
    volume: 11,
    timestamp: '2023-11-01T17:00:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Surfboard',
    id: '18419',
    price: 39,
    volume: 6,
    timestamp: '2023-11-01T16:33:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'surfboard',
  },
  {
    name: 'Coconut Drink',
    id: '18408',
    price: 2.7,
    volume: 22,
    timestamp: '2023-11-01T16:19:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Surfboard',
    id: '18424',
    price: 48,
    volume: 4,
    timestamp: '2023-11-01T15:39:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'surfboard',
  },
  {
    name: 'Coconut Drink',
    id: '18425',
    price: 2.5,
    volume: 25,
    timestamp: '2023-11-01T17:30:00',
    status: 'Sale',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Surfboard',
    id: '18426',
    price: 40.01,
    volume: 10,
    timestamp: '2023-11-01T17:18:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'surfboard',
  },
  {
    name: 'Pink Flamingo',
    id: '18427',
    price: 2.37,
    volume: 9,
    timestamp: '2023-11-01T17:06:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'pink-flamingo',
  },
  {
    name: 'Sand Castle',
    id: '18428',
    price: 4.6,
    volume: 20,
    timestamp: '2023-11-01T16:54:00',
    status: 'Sale',
    image: coconutImage,
    type: 'gifts',
    giftId: 'sand-castle',
  },
  {
    name: 'Shadow Buddy',
    id: '18429',
    price: 14.07,
    volume: 3,
    timestamp: '2023-11-01T16:42:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'shadow-buddy',
  },
  {
    name: 'Coconut Drink',
    id: '18430',
    price: 2.78,
    volume: 26,
    timestamp: '2023-11-01T16:30:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Surfboard',
    id: '18431',
    price: 39.31,
    volume: 7,
    timestamp: '2023-11-01T16:18:00',
    status: 'Sale',
    image: coconutImage,
    type: 'channels',
    giftId: 'surfboard',
  },
  {
    name: 'Pink Flamingo',
    id: '18432',
    price: 3.22,
    volume: 17,
    timestamp: '2023-11-01T16:06:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'pink-flamingo',
  },
  {
    name: 'Sand Castle',
    id: '18433',
    price: 5.97,
    volume: 5,
    timestamp: '2023-11-01T15:54:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'sand-castle',
  },
  {
    name: 'Shadow Buddy',
    id: '18434',
    price: 14.61,
    volume: 4,
    timestamp: '2023-11-01T15:42:00',
    status: 'Sale',
    image: coconutImage,
    type: 'channels',
    giftId: 'shadow-buddy',
  },
  {
    name: 'Torch',
    id: '18431',
    price: 1.92,
    volume: 12,
    timestamp: '2023-11-01T17:23:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'torch',
  },
  {
    name: 'Sunset Surf',
    id: '18432',
    price: 6.45,
    volume: 18,
    timestamp: '2023-11-01T17:16:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'sunset-surf',
  },
  {
    name: 'Shadow Buddy',
    id: '18433',
    price: 13.6,
    volume: 5,
    timestamp: '2023-11-01T17:09:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'shadow-buddy',
  },
  {
    name: 'Pink Flamingo',
    id: '18434',
    price: 3.05,
    volume: 21,
    timestamp: '2023-11-01T17:02:00',
    status: 'Sale',
    image: coconutImage,
    type: 'gifts',
    giftId: 'pink-flamingo',
  },
  {
    name: 'Sand Castle',
    id: '18435',
    price: 4.88,
    volume: 16,
    timestamp: '2023-11-01T16:55:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'sand-castle',
  },
  {
    name: 'Surfboard',
    id: '18436',
    price: 38.4,
    volume: 8,
    timestamp: '2023-11-01T16:48:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'surfboard',
  },
  {
    name: 'Coconut Drink',
    id: '18437',
    price: 2.15,
    volume: 27,
    timestamp: '2023-11-01T16:41:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'coconut-drink',
  },
  {
    name: 'Torch',
    id: '18438',
    price: 1.85,
    volume: 14,
    timestamp: '2023-11-01T16:34:00',
    status: 'Sale',
    image: coconutImage,
    type: 'gifts',
    giftId: 'torch',
  },
  {
    name: 'Sunset Surf',
    id: '18439',
    price: 7.1,
    volume: 11,
    timestamp: '2023-11-01T16:27:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'channels',
    giftId: 'sunset-surf',
  },
  {
    name: 'Pink Flamingo',
    id: '18440',
    price: 3.32,
    volume: 19,
    timestamp: '2023-11-01T16:20:00',
    status: 'Purchase',
    image: coconutImage,
    type: 'gifts',
    giftId: 'pink-flamingo',
  },
]



type FilterKey = 'gift' | 'sort'

const giftOptions = [
  {
    id: 'all',
    label: 'Все подарки',
    description: 'Показать все позиции',
    price: '',
    emoji: '✨',
  },
  {
    id: 'durov-glasses',
    label: 'Durov Glasses',
    description: '35 каналов в продаже',
    price: '350',
    emoji: '🕶️',
  },
  {
    id: 'redo',
    label: 'REDO',
    description: '82 канала в продаже',
    price: '140',
    emoji: '🧸',
  },
  {
    id: 'surfboard',
    label: 'Surfboard',
    description: '131 канал в продаже',
    price: '39',
    emoji: '🏄',
  },
  {
    id: 'sand-castle',
    label: 'Sand Castle',
    description: '157 каналов в продаже',
    price: '4.5',
    emoji: '🏖️',
  },
  {
    id: 'pink-flamingo',
    label: 'Pink Flamingo',
    description: '211 каналов в продаже',
    price: '3.16',
    emoji: '🦩',
  },
  {
    id: 'coconut-drink',
    label: 'Coconut Drink',
    description: '236 каналов в продаже',
    price: '1.64',
    emoji: '🥥',
  },
  {
    id: 'snoop-dogg',
    label: 'Snoop Dogg',
    description: '4 канала в продаже',
    price: '4.59',
    emoji: '🐶',
  },
]

const sortOptions = [
  { id: 'date-new', label: 'Дата: Новые сначала' },
  { id: 'date-old', label: 'Дата: Старые сначала' },
  { id: 'price-asc', label: 'Цена: По возрастанию' },
  { id: 'price-desc', label: 'Цена: По убыванию' },
  { id: 'volume-asc', label: 'Количество: По возрастанию' },
  { id: 'volume-desc', label: 'Количество: По убыванию' },
]

type GiftFilterId = (typeof giftOptions)[number]['id']
type SortFilterId = (typeof sortOptions)[number]['id']

type FilterState = {
  gift: GiftFilterId
  sort: SortFilterId
}

const defaultFilters: FilterState = {
  gift: 'all',
  sort: 'date-new',
}

const giftOptionMap = giftOptions.reduce<Record<GiftFilterId, (typeof giftOptions)[number]>>((acc, option) => {
  acc[option.id] = option
  return acc
}, {})

const sortOptionMap = sortOptions.reduce<Record<SortFilterId, (typeof sortOptions)[number]>>((acc, option) => {
  acc[option.id] = option
  return acc
}, {})

const sheetMeta: Record<FilterKey, { title: string; description: string }> = {
  gift: { title: 'Подарок', description: 'Выберите подходящий фильтр' },
  sort: { title: 'Сортировка', description: 'Выберите подходящий фильтр' },
}

const formatTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

interface FilterCardProps {
  label: string
  value: string
  onClick: () => void
}

const FilterCard = ({ label, value, onClick }: FilterCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-16 flex-col justify-between rounded-2xl border border-white/5 bg-[#101822]/90 px-4 py-3 text-left text-sm text-white shadow-inner shadow-black/20 transition active:scale-[0.98]"
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {label}
    </span>
    <span className="line-clamp-1 text-[12px] font-semibold text-white">{value}</span>
  </button>
)

const ActivityPage = () => {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('channels')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(defaultFilters)
  const [activeSheet, setActiveSheet] = useState<FilterKey | null>(null)
  const [giftSearch, setGiftSearch] = useState('')

  const isGiftsView = activeCategory === 'gifts'

  useEffect(() => {
    if (isGiftsView) {
      setActiveSheet(null)
    }
  }, [isGiftsView])

  const filteredGiftOptions = useMemo(() => {
    const needle = giftSearch.trim().toLowerCase()
    if (!needle) {
      return giftOptions
    }
    return giftOptions.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  }, [giftSearch])

  const openSheet = (key: FilterKey) => {
    setPendingFilters(filters)
    if (key === 'gift') {
      setGiftSearch('')
    }
    setActiveSheet(key)
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setActiveSheet(null)
      setPendingFilters(filters)
      setGiftSearch('')
    }
  }

  const updatePendingFilter = <K extends FilterKey>(key: K, value: FilterState[K]) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetCurrentFilter = () => {
    if (!activeSheet) return
    setPendingFilters((prev) => ({
      ...prev,
      [activeSheet]: defaultFilters[activeSheet],
    }))
    if (activeSheet === 'gift') {
      setGiftSearch('')
    }
  }

  const applyFilters = () => {
    setFilters(pendingFilters)
    setActiveSheet(null)
  }

  const selectedLabels = {
    gift: giftOptionMap[filters.gift]?.label ?? 'Все',
    sort: sortOptionMap[filters.sort]?.label ?? 'Дата',
  }

  const filteredItems = useMemo(() => {
    const byCategory = activityItems.filter((item) => item.type === activeCategory)

    const byGift = byCategory.filter((item) => {
      if (filters.gift === 'all') return true
      return item.giftId === filters.gift
    })

    const sorted = [...byGift]

    switch (filters.sort) {
      case 'date-new':
        sorted.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        break
      case 'date-old':
        sorted.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        break
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'volume-asc':
        sorted.sort((a, b) => (a.volume ?? 0) - (b.volume ?? 0))
        break
      case 'volume-desc':
        sorted.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
        break
      default:
        break
    }

    return sorted
  }, [activeCategory, filters])

  const renderSheetBody = () => {
    if (!activeSheet) return null

    if (activeSheet === 'gift') {
      return (
        <div className="mt-5 flex flex-1 flex-col">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={giftSearch}
              onChange={(event) => setGiftSearch(event.target.value)}
              placeholder="Название подарков"
              className="h-11 rounded-2xl border border-white/10 bg-[#0f1720]/90 pl-10 text-sm text-white placeholder:text-muted-foreground"
            />
          </div>
          <ScrollArea className="mt-4 flex-1 pr-1">
            <RadioGroup
              value={pendingFilters.gift}
              onValueChange={(value) => updatePendingFilter('gift', value as FilterState['gift'])}
              className="space-y-2"
            >
              {filteredGiftOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl border border-transparent bg-[#0f1720]/80 px-4 py-3 transition',
                    pendingFilters.gift === option.id
                      ? 'border-primary/60 bg-[#162438]'
                      : 'hover:border-primary/30 hover:bg-[#152030]'
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    className="h-5 w-5 border-white/20 text-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{option.label}</span>
                        {option.description ? (
                          <span className="text-[9px] text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {option.price ? (
                      <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <Gem className="h-4 w-4" />
                        {option.price}
                      </span>
                    ) : null}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </ScrollArea>
        </div>
      )
    }

    return (
      <ScrollArea className="mt-5 flex-1 pr-1">
        <RadioGroup
          value={pendingFilters.sort}
          onValueChange={(value) => updatePendingFilter('sort', value as FilterState['sort'])}
          className="space-y-2"
        >
          {sortOptions.map((option) => (
            <label
              key={option.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-transparent bg-[#0f1720]/80 px-4 py-3 transition',
                pendingFilters.sort === option.id
                  ? 'border-primary/60 bg-[#162438]'
                  : 'hover:border-primary/30 hover:bg-[#152030]'
              )}
            >
              <RadioGroupItem
                value={option.id}
                className="h-5 w-5 border-white/20 text-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm font-semibold text-white">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </ScrollArea>
    )
  }

  return (
    <div className="space-y-6 px-4 py-5">
      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as ActivityCategory)}
      >
        <TabsList className="mx-auto mb-3 grid w-[240px] grid-cols-2 overflow-hidden rounded-full border border-white/5 bg-[#101822] p-1.5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className={cn(
                'flex h-9 items-center justify-center rounded-full text-sm font-semibold leading-none transition-all',
                'data-[state=active]:bg-[linear-gradient(135deg,#3b8bff,#2560ff)] data-[state=active]:px-4 data-[state=active]:text-white',
                'data-[state=inactive]:text-muted-foreground',
              )}
            >
              <span className="inline-flex -translate-y-[6px] transform">
                {category.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {!isGiftsView && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] items-center gap-3">
          <FilterCard
            label="Подарок"
            value={selectedLabels.gift}
            onClick={() => openSheet('gift')}
          />
          <FilterCard
            label="Сортировка"
            value={selectedLabels.sort}
            onClick={() => openSheet('sort')}
          />
        </div>
      )}

      {isGiftsView ? (
        <ComingSoon
          message="Раздел с подарками скоро откроется"
          className="h-[55vh] border-white/5 bg-[#101822]/70"
        />
      ) : (
        <>
        <ScrollArea className="h-[55vh] rounded-3xl bg-[#101822]/60 p-1">
        {filteredItems.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Нет продаж по выбранным фильтрам
          </div>
        ) : (
          <div className="space-y-2 pb-4 pt-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-3xl bg-[#0f1720]/90 px-2.5 py-2.5 shadow-[0_6px_14px_rgba(8,14,20,0.35)]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#162438] shadow-inner shadow-black/40">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white/70">
                        {item.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-[2px]">
                    <p className="text-[12px] font-semibold text-white">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground">#{item.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <Badge className="rounded-full bg-[#2b5133] px-2 py-[4px] text-[8px] font-semibold uppercase tracking-[0.16em] text-[#77e484]">
                    {item.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-[12px] font-semibold text-white">
                    <Gem className="h-3.5 w-3.5" />
                    {item.price}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        </ScrollArea>

        <Sheet open={!!activeSheet} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="bottom"
          className="mx-auto flex h-[68vh] max-w-[420px] flex-col rounded-t-[32px] border border-white/10 bg-[#101b28] px-5 pb-6 pt-8 text-foreground shadow-[0_-24px_60px_rgba(5,10,18,0.75)]"
        >
          {activeSheet && (
            <div className="flex h-full flex-col">
              <SheetHeader className="space-y-1 text-left">
                <SheetTitle className="text-[22px] font-semibold text-white">
                  {sheetMeta[activeSheet].title}
                </SheetTitle>
                <SheetDescription>
                  {sheetMeta[activeSheet].description}
                </SheetDescription>
              </SheetHeader>
              {renderSheetBody()}
              <div className="mt-6 flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetCurrentFilter}
                  className="flex-1 rounded-2xl border border-white/10 bg-[#162230] text-white shadow-inner shadow-black/20 hover:bg-[#1b2c3d]"
                >
                  Сбросить
                </Button>
                <Button
                  type="button"
                  onClick={applyFilters}
                  className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#3b8bff,#2560ff)] text-base font-semibold text-white shadow-[0_12px_24px_rgba(59,140,255,0.45)] hover:bg-[linear-gradient(135deg,#3b8bff,#2560ff)]"
                >
                  Поиск
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
        </Sheet>
        </>
      )}
    </div>
  )
}

export default ActivityPage
