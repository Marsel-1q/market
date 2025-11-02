import {
  Gem,
  Info,
  Menu,
  Plus,
  X,
  ChevronRight,
} from 'lucide-react'

export const AppHeader = () => {
  return (
    <header className="relative overflow-hidden rounded-t-[32px] bg-[#0f1720]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1b2a3a_0%,rgba(12,18,27,0.6)_60%,rgba(12,18,27,0.9)_100%)]" />
      <div className="relative flex flex-col gap-3 px-4 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-muted-foreground shadow-inner shadow-black/60 backdrop-blur"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101b28]/90 px-3 py-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3c7dfa,#53d7ff)] text-white shadow-lg shadow-blue-500/40">
              <Gem className="h-4 w-4" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Mini App
              </span>
              <span className="text-sm font-semibold text-white">
                Quant Market
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-muted-foreground shadow-inner shadow-black/60 backdrop-blur"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffad33,#ff7b1a)] px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_25px_rgba(255,153,0,0.4)]"
          >
            <Info className="h-4 w-4" />
            Информация
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#101b28]/80 px-3 py-1.5 text-sm font-semibold text-foreground shadow-inner shadow-black/30">
            <span className="flex items-center gap-1 text-primary">
              <Gem className="h-4 w-4" />
              0.00
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Plus className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
