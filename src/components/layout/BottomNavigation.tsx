import { NavLink, useLocation } from 'react-router-dom'
import {
  ShoppingBag,
  BarChart3,
  Archive,
  User2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/market', label: 'Маркет', icon: ShoppingBag },
  { to: '/activity', label: 'Активность', icon: BarChart3 },
  { to: '/storage', label: 'Хранилище', icon: Archive },
  { to: '/profile', label: 'Профиль', icon: User2 },
]

export const BottomNavigation = () => {
  const location = useLocation()

  return (
    <nav className="sticky bottom-0 z-50 w-full rounded-b-[32px] border-t border-white/5 bg-[#0a1118]/95 px-2 pb-4 pt-3 shadow-[0_-12px_32px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mx-auto grid max-w-[420px] grid-cols-4 gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive: navActive }) =>
                cn(
                  'group flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-150',
                  (isActive || navActive)
                    ? 'bg-primary/15 text-foreground shadow-[0_8px_16px_rgba(59,130,246,0.2)]'
                    : 'hover:text-foreground',
                )
              }
            >
              <Icon
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  'h-5 w-5 transition-transform duration-150',
                  (isActive)
                    ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.55)] group-active:scale-95'
                    : 'text-muted-foreground group-active:scale-95',
                )}
              />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
