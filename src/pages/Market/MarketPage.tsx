import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChannelCard } from '@/components/ui/channel-card'
import { Input } from '@/components/ui/input'
import coconutImage from '@/assets/images/coconut.svg'
import { ComingSoon } from '@/components/ui/coming-soon'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Grid3X3,
  LayoutList,
  Gem,
  Search,
  SlidersHorizontal,
  ListFilter,
  Share2,
  ExternalLink,
  Handshake,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListingItemPreview {
  name: string
  quantity: number
  image: string
}

interface ListingItem {
  name: string
  id: string
  price: string
  priceTon: number
  createdAt: string
  timeLeft?: string
  multiplier?: string
  type: 'instant' | 'delayed'
  hasImproved?: boolean
  images?: string[]
  items: ListingItemPreview[]
}

type ListingEntry = {
  listing: ListingItem
  giftIds: Set<string>
  totalQuantity: number
  unitPrice: number
  hasImproved: boolean
}

const categories = [
  { id: 'gifts', label: 'Подарки' },
  { id: 'channels', label: 'Каналы' },
]

const channelItems: ListingItem[] = [
  {
    name: 'Coconut Drink x26',
    id: '18459',
    price: '7.3',
    priceTon: 7.3,
    createdAt: '2023-11-01T11:30:00Z',
    timeLeft: '8ч',
    multiplier: 'x26',
    type: 'instant',
    images: [coconutImage],
    items: [{ name: 'Coconut Drink', quantity: 26, image: coconutImage }],
  },
  {
    name: 'Surfboard Pack',
    id: '18458',
    price: '9.5',
    priceTon: 9.5,
    createdAt: '2023-11-01T10:05:00Z',
    timeLeft: '8ч',
    multiplier: 'x2',
    type: 'instant',
    images: [coconutImage, coconutImage],
    items: [
      { name: 'Surfboard', quantity: 4, image: coconutImage },
      { name: 'Pink Flamingo', quantity: 6, image: coconutImage },
    ],
  },
  {
    name: 'Shadow Buddy Pack',
    id: '18457',
    price: '11.2',
    priceTon: 11.2,
    createdAt: '2023-10-31T19:15:00Z',
    timeLeft: '5ч',
    multiplier: 'x3',
    type: 'delayed',
    hasImproved: true,
    images: [coconutImage, coconutImage, coconutImage],
    items: [
      { name: 'Shadow Buddy', quantity: 6, image: coconutImage },
      { name: 'Torch', quantity: 5, image: coconutImage },
      { name: 'Pink Flamingo', quantity: 4, image: coconutImage },
    ],
  },
  {
    name: 'Sunset Surf',
    id: '18456',
    price: '3.4',
    priceTon: 3.4,
    createdAt: '2023-10-30T08:45:00Z',
    timeLeft: '5ч',
    multiplier: 'x4',
    type: 'delayed',
    images: [coconutImage, coconutImage, coconutImage, coconutImage],
    items: [
      { name: 'Sunset Surf', quantity: 4, image: coconutImage },
      { name: 'Coconut Drink', quantity: 3, image: coconutImage },
      { name: 'Pink Flamingo', quantity: 2, image: coconutImage },
      { name: 'Torch', quantity: 1, image: coconutImage },
    ],
  },
]

type BaseFilterKey = 'gift' | 'type' | 'sort'
type FilterKey = BaseFilterKey | 'advanced'

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
] as const

const typeOptions = [
  { id: 'all', label: 'Все' },
  { id: 'instant', label: 'Мгновенная' },
  { id: 'delayed', label: 'С ожиданием' },
] as const

const sortOptions = [
  { id: 'date-new', label: 'Дата: Новые сначала' },
  { id: 'date-old', label: 'Дата: Старые сначала' },
  { id: 'price-asc', label: 'Цена: По возрастанию' },
  { id: 'price-desc', label: 'Цена: По убыванию' },
  { id: 'unit-price', label: 'Цена за единицу' },
  { id: 'amount-asc', label: 'Количество: По возрастанию' },
  { id: 'amount-desc', label: 'Количество: По убыванию' },
] as const

type GiftFilterId = (typeof giftOptions)[number]['id']
type TypeFilterId = (typeof typeOptions)[number]['id']
type SortFilterId = (typeof sortOptions)[number]['id']

type FilterState = {
  gift: GiftFilterId
  type: TypeFilterId
  sort: SortFilterId
}

const defaultFilters: FilterState = {
  gift: 'all',
  type: 'all',
  sort: 'date-new',
}

type AdvancedFilterState = {
  priceRange: [number, number]
  quantityRange: [number, number]
  exactGiftOnly: boolean
  showImproved: boolean
}

const defaultAdvancedFilters: AdvancedFilterState = {
  priceRange: [2.11, 100000],
  quantityRange: [1, 780],
  exactGiftOnly: false,
  showImproved: false,
}

const normalizeGiftId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')

const giftOptionMap = giftOptions.reduce((acc, option) => {
  acc[option.id] = option
  return acc
}, {} as Record<GiftFilterId, (typeof giftOptions)[number]>)

const typeOptionMap = typeOptions.reduce((acc, option) => {
  acc[option.id] = option
  return acc
}, {} as Record<TypeFilterId, (typeof typeOptions)[number]>)

const sortOptionMap = sortOptions.reduce((acc, option) => {
  acc[option.id] = option
  return acc
}, {} as Record<SortFilterId, (typeof sortOptions)[number]>)

const sheetMeta: Record<FilterKey, { title: string; description: string }> = {
  gift: { title: 'Подарок', description: 'Выберите подходящий фильтр' },
  type: { title: 'Тип', description: 'Выберите подходящий фильтр' },
  sort: { title: 'Сортировка', description: 'Выберите подходящий фильтр' },
  advanced: { title: 'Фильтры', description: 'Выберите подходящий фильтр' },
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
    <span className="line-clamp-1 text-sm font-semibold text-white">{value}</span>
  </button>
)

const MarketPage = () => {
  const PRICE_LIMITS: [number, number] = [0, 100000]
  const QUANTITY_LIMITS: [number, number] = [1, 1000]

  const [activeCategory, setActiveCategory] = useState('channels')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [pendingFilters, setPendingFilters] = useState<FilterState>(defaultFilters)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(defaultAdvancedFilters)
  const [pendingAdvanced, setPendingAdvanced] = useState<AdvancedFilterState>(defaultAdvancedFilters)
  const [activeSheet, setActiveSheet] = useState<FilterKey | null>(null)
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null)
  const [giftSearch, setGiftSearch] = useState('')
  const isGiftCategory = activeCategory === 'gifts'

  useEffect(() => {
    if (isGiftCategory) {
      setActiveSheet(null)
      setSelectedListing(null)
    }
  }, [isGiftCategory])

  const filteredGiftOptions = useMemo(() => {
    const needle = giftSearch.trim().toLowerCase()
    if (!needle) {
      return giftOptions
    }
    return giftOptions.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  }, [giftSearch])

  const filteredItems = useMemo(() => {
    if (isGiftCategory) {
      return []
    }

    const prepared: ListingEntry[] = channelItems.map((listing) => {
      const giftIds = new Set<string>()
      let totalQuantity = 0
      listing.items.forEach((item) => {
        giftIds.add(normalizeGiftId(item.name))
        totalQuantity += item.quantity
      })

      const unitPrice = totalQuantity > 0 ? listing.priceTon / totalQuantity : listing.priceTon

      return {
        listing,
        giftIds,
        totalQuantity,
        unitPrice,
        hasImproved: Boolean(listing.hasImproved),
      }
    })

    const giftFilter = filters.gift
    const [minPrice, maxPrice] = advancedFilters.priceRange
    const [minQty, maxQty] = advancedFilters.quantityRange

    const filtered = prepared.filter((entry) => {
      const { listing, giftIds, totalQuantity, hasImproved } = entry

      if (filters.type !== 'all' && listing.type !== filters.type) {
        return false
      }

      if (!advancedFilters.showImproved && hasImproved) {
        return false
      }

      if (listing.priceTon < minPrice || listing.priceTon > maxPrice) {
        return false
      }

      if (totalQuantity < minQty || totalQuantity > maxQty) {
        return false
      }

      if (giftFilter === 'all') {
        return true
      }

      if (!giftIds.has(giftFilter)) {
        return false
      }

      if (!advancedFilters.exactGiftOnly) {
        return true
      }

      return giftIds.size === 1 && giftIds.has(giftFilter)
    })

    const sorted = [...filtered]

    switch (filters.sort) {
      case 'date-new':
        sorted.sort(
          (a, b) =>
            new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime(),
        )
        break
      case 'date-old':
        sorted.sort(
          (a, b) =>
            new Date(a.listing.createdAt).getTime() - new Date(b.listing.createdAt).getTime(),
        )
        break
      case 'price-asc':
        sorted.sort((a, b) => a.listing.priceTon - b.listing.priceTon)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.listing.priceTon - a.listing.priceTon)
        break
      case 'unit-price':
        sorted.sort((a, b) => a.unitPrice - b.unitPrice)
        break
      case 'amount-asc':
        sorted.sort((a, b) => a.totalQuantity - b.totalQuantity)
        break
      case 'amount-desc':
        sorted.sort((a, b) => b.totalQuantity - a.totalQuantity)
        break
      default:
        break
    }

    return sorted.map((entry) => entry.listing)
  }, [advancedFilters, filters, isGiftCategory])

  const openSheet = (key: FilterKey) => {
    setPendingFilters(filters)
    if (key === 'gift') {
      setGiftSearch('')
    }
    if (key === 'advanced') {
      setPendingAdvanced(advancedFilters)
    }
    setActiveSheet(key)
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setActiveSheet(null)
      setPendingFilters(filters)
      setGiftSearch('')
      setPendingAdvanced(advancedFilters)
    }
  }

  const handleListingSheetChange = (open: boolean) => {
    if (!open) {
      setSelectedListing(null)
    }
  }

  useEffect(() => {
    if (selectedListing && !filteredItems.some((item) => item.id === selectedListing.id)) {
      setSelectedListing(null)
    }
  }, [filteredItems, selectedListing])

  const applyFilters = () => {
    setFilters(pendingFilters)
    if (activeSheet === 'advanced') {
      setAdvancedFilters(pendingAdvanced)
    }
    setActiveSheet(null)
  }

  const resetCurrentFilter = () => {
    if (!activeSheet) return
    if (activeSheet === 'advanced') {
      setPendingAdvanced(defaultAdvancedFilters)
      return
    }
    const key = activeSheet as BaseFilterKey
    setPendingFilters((prev) => ({
      ...prev,
      [key]: defaultFilters[key],
    }))
    if (key === 'gift') {
      setGiftSearch('')
    }
  }

  const updatePendingFilter = <K extends BaseFilterKey>(key: K, value: FilterState[K]) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const selectedLabels = {
    gift: giftOptionMap[filters.gift]?.label ?? 'Все',
    type: typeOptionMap[filters.type]?.label ?? 'Все',
    sort: sortOptionMap[filters.sort]?.label ?? 'Дата',
  }

  const hasAdvancedChanges =
    advancedFilters.priceRange[0] !== defaultAdvancedFilters.priceRange[0] ||
    advancedFilters.priceRange[1] !== defaultAdvancedFilters.priceRange[1] ||
    advancedFilters.quantityRange[0] !== defaultAdvancedFilters.quantityRange[0] ||
    advancedFilters.quantityRange[1] !== defaultAdvancedFilters.quantityRange[1] ||
    advancedFilters.exactGiftOnly !== defaultAdvancedFilters.exactGiftOnly ||
    advancedFilters.showImproved !== defaultAdvancedFilters.showImproved

  const renderListingPreviewGrid = () => {
    if (!selectedListing) return null
    const items = selectedListing.items
    const total = items.length
    if (total === 0) return null

    const renderTile = (
      item: ListingItemPreview,
      key: string,
      options: { compact?: boolean } = {},
    ) => (
      <div
        key={key}
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#162130] p-3',
          options.compact ? 'h-20' : 'h-24',
        )}
      >
        <img
          src={item.image}
          alt={item.name}
          className={cn(
            'object-contain',
            options.compact ? 'max-h-[70%] max-w-[70%]' : 'max-h-full max-w-full',
          )}
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(59,140,255,0.2)] px-2 py-[2px] text-[11px] font-semibold text-[#9cd4ff]">
          x{item.quantity}
        </span>
      </div>
    )

    if (total === 1) {
      return (
        <div className="rounded-[28px] border border-white/10 bg-[#101b28]/95 p-4">
          <div className="relative flex h-52 items-center justify-center rounded-3xl bg-[#162130] p-6">
            <img
              src={items[0].image}
              alt={items[0].name}
              className="max-h-full max-w-full object-contain"
            />
            <span className="absolute bottom-10 right-10 rounded-full bg-[rgba(59,140,255,0.2)] px-3 py-1 text-xs font-semibold text-[#9cd4ff]">
              x{items[0].quantity}
            </span>
          </div>
        </div>
      )
    }

    if (total === 2) {
      return (
        <div className="rounded-[28px] border border-white/10 bg-[#101b28]/95 p-4">
          <div className="grid grid-cols-2 gap-3">
            {items.slice(0, 2).map((item, index) => renderTile(item, `item-${index}`, { compact: true }))}
          </div>
        </div>
      )
    }

    if (total === 3) {
      return (
        <div className="rounded-[28px] border border-white/10 bg-[#101b28]/95 p-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <div className="col-span-2 relative flex h-24 items-center justify-center rounded-2xl bg-[#162130] p-3">
              <img
                src={items[0].image}
                alt={items[0].name}
                className="max-h-full max-w-full object-contain"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(59,140,255,0.2)] px-2 py-[2px] text-[11px] font-semibold text-[#9cd4ff]">
                x{items[0].quantity}
              </span>
            </div>
            {items.slice(1).map((item, index) => renderTile(item, `item-${index + 1}`))}
          </div>
        </div>
      )
    }

    const remaining = total > 4 ? total - 4 : 0
    const visible = items.slice(0, 4)

    return (
      <div className="rounded-[28px] border border-white/10 bg-[#101b28]/95 p-4">
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {visible.map((item, index) =>
            index === 3 && remaining > 0 ? (
              <div key="more" className="flex h-24 items-center justify-center rounded-2xl bg-[#162130]">
                <span className="rounded-full bg-[rgba(59,140,255,0.2)] px-3 py-1 text-xs font-semibold text-[#9cd4ff]">
                  +{remaining} еще
                </span>
              </div>
            ) : (
              renderTile(item, `item-${index}`)
            ),
          )}
        </div>
      </div>
    )
  }

  const handleAdvancedRangeChange = (
    key: keyof Pick<AdvancedFilterState, 'priceRange' | 'quantityRange'>,
    value: number[],
  ) => {
    if (value.length !== 2) return
    const [min, max] = value
    setPendingAdvanced((prev) => ({
      ...prev,
      [key]: [Math.min(min, max), Math.max(min, max)] as [number, number],
    }))
  }

  const handleAdvancedInputChange = (
    key: keyof Pick<AdvancedFilterState, 'priceRange' | 'quantityRange'>,
    index: 0 | 1,
    raw: string,
    minLimit: number,
    maxLimit: number,
  ) => {
    const numeric = Number(raw.replace(',', '.'))
    if (Number.isNaN(numeric)) return
    setPendingAdvanced((prev) => {
      const target = [...prev[key]] as [number, number]
      target[index] = Math.min(maxLimit, Math.max(minLimit, numeric))
      return {
        ...prev,
        [key]: target[0] > target[1] ? [target[1], target[0]] as [number, number] : (target as [number, number]),
      }
    })
  }

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
                    'flex items-center gap-3 rounded-2xl border border-transparent bg-[#0f1720]/80 px-4 py-3 transition',
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
                          <span className="text-xs text-muted-foreground">
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

    if (activeSheet === 'type') {
      return (
        <ScrollArea className="mt-5 flex-1 pr-1">
          <RadioGroup
            value={pendingFilters.type}
            onValueChange={(value) => updatePendingFilter('type', value as FilterState['type'])}
            className="space-y-2"
          >
            {typeOptions.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border border-transparent bg-[#0f1720]/80 px-4 py-3 transition',
                  pendingFilters.type === option.id
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

    if (activeSheet === 'advanced') {
      const [priceMin, priceMax] = pendingAdvanced.priceRange
      const [quantityMin, quantityMax] = pendingAdvanced.quantityRange

      return (
        <ScrollArea className="mt-5 flex-1 pr-1">
          <div className="flex flex-col gap-4 pb-3 pr-3">
            <div className="rounded-3xl border border-white/12 bg-[#101b28]/95 px-5 py-5 shadow-[0_16px_32px_rgba(10,17,27,0.6)]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(59,140,255,0.18)] text-primary">
                  <Gem className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Цена</p>
                  <p className="text-xs text-muted-foreground">Диапазон значения в TON</p>
                </div>
              </div>
              <Slider
                value={pendingAdvanced.priceRange}
                min={PRICE_LIMITS[0]}
                max={PRICE_LIMITS[1]}
                step={0.01}
                onValueChange={(value) => handleAdvancedRangeChange('priceRange', value)}
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input
                  value={priceMin.toString()}
                  onChange={(event) =>
                    handleAdvancedInputChange('priceRange', 0, event.target.value, PRICE_LIMITS[0], PRICE_LIMITS[1])
                  }
                  className="h-11 rounded-2xl border border-white/12 bg-[#0f1720]/90 text-sm text-white placeholder:text-muted-foreground"
                  inputMode="decimal"
                />
                <Input
                  value={priceMax.toString()}
                  onChange={(event) =>
                    handleAdvancedInputChange('priceRange', 1, event.target.value, PRICE_LIMITS[0], PRICE_LIMITS[1])
                  }
                  className="h-11 rounded-2xl border border-white/12 bg-[#0f1720]/90 text-sm text-white placeholder:text-muted-foreground"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-[#101b28]/95 px-5 py-5 shadow-[0_16px_32px_rgba(10,17,27,0.6)]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(59,140,255,0.18)] text-primary">
                  <ListFilter className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Количество</p>
                  <p className="text-xs text-muted-foreground">Укажите требуемый диапазон</p>
                </div>
              </div>
              <Slider
                value={pendingAdvanced.quantityRange}
                min={QUANTITY_LIMITS[0]}
                max={QUANTITY_LIMITS[1]}
                step={1}
                onValueChange={(value) => handleAdvancedRangeChange('quantityRange', value)}
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input
                  value={quantityMin.toString()}
                  onChange={(event) =>
                    handleAdvancedInputChange('quantityRange', 0, event.target.value, QUANTITY_LIMITS[0], QUANTITY_LIMITS[1])
                  }
                  className="h-11 rounded-2xl border border-white/12 bg-[#0f1720]/90 text-sm text-white placeholder:text-muted-foreground"
                  inputMode="numeric"
                />
                <Input
                  value={quantityMax.toString()}
                  onChange={(event) =>
                    handleAdvancedInputChange('quantityRange', 1, event.target.value, QUANTITY_LIMITS[0], QUANTITY_LIMITS[1])
                  }
                  className="h-11 rounded-2xl border border-white/12 bg-[#0f1720]/90 text-sm text-white placeholder:text-muted-foreground"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-[#101b28]/95 px-5 py-4 shadow-[0_16px_32px_rgba(10,17,27,0.6)]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Только точный подарок</span>
                  <span className="text-xs text-muted-foreground">Совпадает с выбранным фильтром</span>
                </div>
                <Switch
                  checked={pendingAdvanced.exactGiftOnly}
                  onCheckedChange={(value) =>
                    setPendingAdvanced((prev) => ({ ...prev, exactGiftOnly: value }))
                  }
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Показать с улучшенными подарками</span>
                  <span className="text-xs text-muted-foreground">Включая редкие модификации</span>
                </div>
                <Switch
                  checked={pendingAdvanced.showImproved}
                  onCheckedChange={(value) =>
                    setPendingAdvanced((prev) => ({ ...prev, showImproved: value }))
                  }
                />
              </div>
            </div>
          </div>
        </ScrollArea>
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
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mx-auto mb-3 grid w-[240px] grid-cols-2 overflow-hidden rounded-full border border-white/5 bg-[#101822] p-1.5">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
               className={cn(
                'flex h-9 items-center justify-center rounded-full text-sm font-semibold leading-none transition-all',
                'data-[state=active]:bg-[linear-gradient(135deg,#3b8bff,#2560ff)] data-[state=active]:pl-4 data-[state=active]:pr-4 data-[state=active]:text-white',
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

      {isGiftCategory ? (
        <ComingSoon
          message="Подарки в маркете появятся совсем скоро"
          className="mt-2 h-[60vh] border-white/5 bg-[#101822]/70"
        />
      ) : (
        <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] items-center gap-3">
        <FilterCard
          label="Подарок"
          value={selectedLabels.gift}
          onClick={() => openSheet('gift')}
        />
        <FilterCard
          label="Тип"
          value={selectedLabels.type}
          onClick={() => openSheet('type')}
        />
        <FilterCard
          label="Сортировка"
          value={selectedLabels.sort}
          onClick={() => openSheet('sort')}
        />
        <button
          type="button"
          onClick={() => openSheet('advanced')}
          className={cn(
            'relative flex h-16 items-center justify-center rounded-2xl border border-white/5 bg-[#101822]/90 text-white shadow-inner shadow-black/20 transition active:scale-[0.97]',
            hasAdvancedChanges ? 'border-primary/50' : undefined,
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
          {hasAdvancedChanges && (
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,140,255,0.8)]" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-muted-foreground">
        <span>Всего {filteredItems.length} лотов</span>
        <div className="inline-flex rounded-full border border-white/5 bg-[#101822]/90 p-1 text-foreground shadow-inner shadow-black/30">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
              viewMode === 'grid'
                ? 'bg-[linear-gradient(135deg,#3b8bff,#2560ff)] text-white'
                : 'text-muted-foreground',
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            Сетка
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
              viewMode === 'list'
                ? 'bg-[linear-gradient(135deg,#3b8bff,#2560ff)] text-white'
                : 'text-muted-foreground',
            )}
          >
            <LayoutList className="h-4 w-4" />
            Список
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredItems.map((item, index) => (
            <ChannelCard
              key={`${item.id}-${index}`}
              {...item}
              onClick={() => setSelectedListing(item)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {filteredItems.map((item) => {
            const thumbnail =
              item.images && item.images.length > 0
                ? item.images[0]
                : (item as { imageUrl?: string }).imageUrl ?? coconutImage

            return (
              <div
                key={item.id}
                className="flex cursor-pointer items-center justify-between rounded-3xl border border-white/5 bg-[#111822]/90 px-4 py-3 shadow-[0_10px_24px_rgba(8,14,20,0.55)] transition hover:border-primary/40"
                role="button"
                onClick={() => setSelectedListing(item)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#162130] shadow-inner shadow-black/30">
                    {thumbnail ? (
                      <img src={thumbnail} alt={item.name} className="h-full w-full object-cover" />
                    ) : null}
                    {item.multiplier ? (
                      <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-[6px] py-[1px] text-[10px] font-semibold uppercase tracking-wider text-white">
                        {item.multiplier}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      #{item.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-white">
                  <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs uppercase tracking-widest text-green-400">
                    Buy
                  </span>
                  <div className="flex items-center gap-1">
                    <Gem className="h-4 w-4 text-primary" />
                    <span>{item.price}</span>
                    <span className="text-xs font-medium text-muted-foreground/80">TON</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Sheet open={!!activeSheet} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="bottom"
          className="mx-auto flex h-[78vh] max-h-[660px] w-full max-w-[420px] flex-col rounded-t-[32px] border border-white/12 bg-[#101b28] px-5 pb-8 pt-9 text-foreground shadow-[0_-28px_70px_rgba(5,10,18,0.75)]"
        >
          {activeSheet && (
            <div className="flex h-full flex-col overflow-hidden">
              <SheetHeader className="space-y-1 text-left">
                <SheetTitle className="text-[22px] font-semibold text-white">
                  {sheetMeta[activeSheet].title}
                </SheetTitle>
                <SheetDescription>
                  {sheetMeta[activeSheet].description}
                </SheetDescription>
              </SheetHeader>
              {renderSheetBody()}
              <div className="mt-6 flex shrink-0 items-center gap-3">
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

      <Sheet open={!!selectedListing} onOpenChange={handleListingSheetChange}>
        <SheetContent
          side="bottom"
          className="mx-auto flex h-[80vh] max-h-[700px] w-full max-w-[420px] flex-col rounded-t-[32px] border border-white/12 bg-[#101b28] px-5 pb-8 pt-9 text-foreground shadow-[0_-28px_70px_rgba(5,10,18,0.75)]"
        >
          {selectedListing && (
            <div className="flex h-full flex-col overflow-hidden">
              <SheetHeader className="space-y-1 text-left">
                <SheetTitle className="text-[22px] font-semibold text-white">
                  {selectedListing.name}
                </SheetTitle>
                <SheetDescription className="text-sm text-[#8a96a8]">
                  Подборка предметов из набора
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 shrink-0">{renderListingPreviewGrid()}</div>

              <div className="mt-5 flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 text-white">
                  {selectedListing.items.slice(0, 2).map((item, index) => (
                    <span key={`${item.name}-${index}`} className="text-base font-semibold">
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                  {selectedListing.items.length > 2 ? (
                    <span className="text-sm text-muted-foreground">
                      +{selectedListing.items.length - 2} предметов
                    </span>
                  ) : null}
                </div>
                <span className="rounded-full bg-[#162130] px-4 py-1 text-sm font-semibold text-muted-foreground">
                  #{selectedListing.id}
                </span>
              </div>

              <div className="mt-5 flex-1 overflow-hidden">
                <div className="h-full rounded-3xl border border-white/10 bg-[#101b28]/95">
                  <ScrollArea className="h-full">
                    <div className="divide-y divide-white/8">
                      {selectedListing.items.map((item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="flex items-center gap-3 px-5 py-4 text-sm text-white"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#162130]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-10 max-w-full object-contain"
                            />
                          </div>
                          <div className="flex flex-1 items-center justify-between gap-3">
                            <div className="flex flex-col">
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Количество: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="mt-6 shrink-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#162130] text-sm text-white shadow-inner shadow-black/20"
                  >
                    <Share2 className="h-4 w-4" />
                    Поделиться
                  </Button>
                  <Button className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#3b8bff,#2560ff)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,140,255,0.45)] hover:bg-[linear-gradient(135deg,#3b8bff,#2560ff)]">
                    <ExternalLink className="h-4 w-4" />
                    Открыть канал
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-[#162130] text-sm font-semibold text-white hover:bg-[#1b2c3c]"
                  >
                    <Handshake className="h-4 w-4" />
                    Сделать оффер
                  </Button>
                  <Button className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#3b8bff,#2560ff)] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,140,255,0.45)] hover:bg-[linear-gradient(135deg,#3b8bff,#2560ff)]">
                    <ShoppingBag className="h-4 w-4" />
                    Купить канал
                    <span className="text-[11px] font-medium text-white/80">
                      {selectedListing.priceTon} TON
                    </span>
                  </Button>
                </div>
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

export default MarketPage
