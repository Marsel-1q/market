import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ComingSoonProps {
  label?: string
  message?: string
  className?: string
}

export const ComingSoon = ({
  label = 'Скоро',
  message = 'Мы готовим что-то особенное',
  className,
}: ComingSoonProps) => (
  <Card
    className={cn(
      'border-white/8 bg-[#101b28]/80 text-center shadow-[0_18px_48px_rgba(9,15,24,0.45)] backdrop-blur-md',
      className,
    )}
  >
    <CardContent className="flex h-full flex-col items-center justify-center gap-3 py-12">
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-full border border-primary/30 bg-primary/10 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
      >
        {label}
      </motion.span>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        className="text-3xl font-bold text-white"
      >
        soon
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="max-w-[240px] text-sm text-muted-foreground"
      >
        {message}
      </motion.p>
    </CardContent>
  </Card>
)
