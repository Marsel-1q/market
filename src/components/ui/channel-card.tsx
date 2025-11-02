import { Gem } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChannelCardProps {
  name: string
  id: string
  price: string
  timeLeft?: string
  multiplier?: string
  imageUrl?: string
  images?: string[]
  onClick?: () => void
  className?: string
}

export const ChannelCard = ({
  name,
  id,
  price,
  timeLeft,
  multiplier = 'x2',
  imageUrl,
  images,
  onClick,
  className,
}: ChannelCardProps) => {
  const mediaSources =
    images && images.length > 0
      ? images.slice(0, 4)
      : imageUrl
        ? [imageUrl]
        : []

  const renderMedia = () => {
    if (mediaSources.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/40">
          ?
        </div>
      )
    }

    if (mediaSources.length === 1) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-[1.1rem] bg-[#162130] p-6">
          <img
            src={mediaSources[0]}
            alt={name}
            className="max-h-full max-w-full object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]"
          />
        </div>
      )
    }

    if (mediaSources.length === 2) {
      return (
        <div className="grid h-full w-full grid-rows-2 gap-3 p-3">
          {mediaSources.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex items-center justify-center rounded-xl bg-[#162130] p-3"
            >
              <img
                src={src}
                alt={`${name} preview ${index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )
    }

    if (mediaSources.length === 3) {
      return (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-3 p-3">
          <div className="col-span-2 flex items-center justify-center rounded-xl bg-[#162130] p-3">
            <img
              src={mediaSources[0]}
              alt={`${name} preview 1`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {mediaSources.slice(1).map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex items-center justify-center rounded-xl bg-[#162130] p-3"
            >
              <img
                src={src}
                alt={`${name} preview ${index + 2}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-3 p-3">
        {mediaSources.slice(0, 4).map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="flex items-center justify-center rounded-xl bg-[#162130] p-3"
          >
            <img
              src={src}
              alt={`${name} preview ${index + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn(
        'relative flex flex-col gap-3 rounded-3xl border border-white/6 bg-[#0f1720] p-3 shadow-[0_12px_32px_rgba(8,14,20,0.55)] transition hover:border-primary/40',
        onClick ? 'cursor-pointer' : '',
        className,
      )}
    >
      {timeLeft ? null : null}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#1b2735]">
        {renderMedia()}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white shadow-inner shadow-black/40">
          {multiplier}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-muted-foreground">#{id}</p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#3c8dff_0%,#1f67ff_100%)] py-2 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(53,123,255,0.45)] transition-transform active:scale-[0.97]">
          <Gem className="h-4 w-4" />
          {price}
        </button>
      </div>
    </div>
  )
}
