import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  createDeposit,
  fetchProfile,
  requestWithdrawal,
  type DepositResponse,
  type ProfileResponse,
} from '@/lib/api'
import {
  Gem,
  ChevronRight,
  Link2,
  Copy,
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'

const formatTon = (value?: number | null, fallback = '—') => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback
  }
  return `${value.toFixed(2)} TON`
}

const normalizeAmount = (value: string) => Number.parseFloat(value.replace(',', '.'))

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [isDepositOpen, setDepositOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('10')
  const [depositResult, setDepositResult] = useState<DepositResponse | null>(null)
  const [depositMessage, setDepositMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [isWithdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('5')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawMessage, setWithdrawMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [actionLoading, setActionLoading] = useState<'deposit' | 'withdraw' | null>(null)
  const [copyHint, setCopyHint] = useState<string | null>(null)

  const loadProfile = async (showLoader = true) => {
    if (showLoader) {
      setProfileLoading(true)
    }
    try {
      const data = await fetchProfile()
      setProfile(data)
      setProfileError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить профиль'
      setProfileError(message)
    } finally {
      if (showLoader) {
        setProfileLoading(false)
      }
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const statsCards = useMemo(
    () => [
      {
        label: 'Доступно',
        value: profileLoading ? 'Загрузка…' : formatTon(profile?.balance, '0 TON'),
      },
      {
        label: 'Зарезервировано',
        value: profileLoading ? '—' : formatTon(profile?.reservedBalance, '0 TON'),
      },
    ],
    [profile, profileLoading],
  )

  const handleCopy = async (value: string, message = 'Скопировано') => {
    if (!value) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        setCopyHint(message)
        setTimeout(() => setCopyHint(null), 2000)
      }
    } catch {
      setCopyHint('Не удалось скопировать')
      setTimeout(() => setCopyHint(null), 2000)
    }
  }

  const handleDeposit = async () => {
    const amount = normalizeAmount(depositAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setDepositMessage({ type: 'error', text: 'Введите корректную сумму' })
      return
    }

    setActionLoading('deposit')
    setDepositResult(null)
    setDepositMessage(null)

    try {
      const result = await createDeposit(amount)
      setDepositResult(result)
      setDepositMessage({ type: 'success', text: 'Ссылка для перевода сформирована' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось создать заявку на пополнение'
      setDepositMessage({ type: 'error', text: message })
    } finally {
      setActionLoading(null)
    }
  }

  const handleWithdraw = async () => {
    const amount = normalizeAmount(withdrawAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setWithdrawMessage({ type: 'error', text: 'Введите корректную сумму' })
      return
    }

    if (!withdrawAddress.trim()) {
      setWithdrawMessage({ type: 'error', text: 'Укажите TON-адрес получателя' })
      return
    }

    setActionLoading('withdraw')
    setWithdrawMessage(null)

    try {
      await requestWithdrawal({ amount, recipientAddress: withdrawAddress.trim() })
      setWithdrawMessage({ type: 'success', text: 'Заявка на вывод отправлена' })
      setWithdrawAmount('5')
      setWithdrawAddress('')
      await loadProfile(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось отправить заявку'
      setWithdrawMessage({ type: 'error', text: message })
    } finally {
      setActionLoading(null)
    }
  }

  const resetDepositState = () => {
    setDepositMessage(null)
    setDepositResult(null)
    setDepositOpen(false)
  }

  const resetWithdrawState = () => {
    setWithdrawMessage(null)
    setWithdrawOpen(false)
  }

  const initials = (profile?.username || 'Market')[0]?.toUpperCase()

  return (
    <div className="space-y-6 px-4 py-5">
      <Sheet open={isDepositOpen} onOpenChange={(open) => (open ? setDepositOpen(true) : resetDepositState())}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto bg-[#0b131d] text-foreground">
          <SheetHeader>
            <SheetTitle className="text-white">Пополнение баланса</SheetTitle>
            <SheetDescription>Создайте перевод с уникальным кодом, чтобы пополнить внутренний баланс.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Сумма в TON
              </label>
              <Input
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
                className="h-12 rounded-2xl border border-white/12 bg-[#101b28]/90 text-white placeholder:text-muted-foreground"
                inputMode="decimal"
                placeholder="10"
              />
              <p className="text-[11px] text-muted-foreground">Минимальная сумма: 0.1 TON</p>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={actionLoading === 'deposit'}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#3c8dff,#2560ff)] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(59,140,255,0.4)]"
            >
              {actionLoading === 'deposit' ? 'Формируем ссылку...' : 'Сформировать ссылку'}
            </Button>

            {depositMessage && (
              <div
                className={cn(
                  'rounded-2xl border px-4 py-3 text-sm',
                  depositMessage.type === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : 'border-red-400/40 bg-red-500/10 text-red-200',
                )}
              >
                {depositMessage.text}
              </div>
            )}

            {depositResult && (
              <div className="space-y-4 rounded-3xl border border-white/8 bg-[#101b28]/85 p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Комментарий</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-white">{depositResult.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(depositResult.code, 'Комментарий скопирован')}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">TON-ссылка</p>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={depositResult.tonLink}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-semibold text-primary hover:underline"
                    >
                      {depositResult.tonLink}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(depositResult.tonLink, 'Ссылка скопирована')}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                  <span>Отсканируйте QR-код или используйте ссылку для перевода.</span>
                  <img src={depositResult.qrCode} alt="TON QR" className="h-44 w-44 rounded-2xl border border-white/10 bg-white/5 p-3" />
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isWithdrawOpen} onOpenChange={(open) => (open ? setWithdrawOpen(true) : resetWithdrawState())}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-[#0b131d] text-foreground">
          <SheetHeader>
            <SheetTitle className="text-white">Вывод средств</SheetTitle>
            <SheetDescription>Средства будут отправлены на указанный TON-адрес после подтверждения заявки.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Сумма в TON
              </label>
              <Input
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
                className="h-12 rounded-2xl border border-white/12 bg-[#101b28]/90 text-white placeholder:text-muted-foreground"
                inputMode="decimal"
                placeholder="5"
              />
              <p className="text-[11px] text-muted-foreground">Минимальная сумма: 1 TON</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                TON-адрес получателя
              </label>
              <Input
                value={withdrawAddress}
                onChange={(event) => setWithdrawAddress(event.target.value)}
                className="h-12 rounded-2xl border border-white/12 bg-[#101b28]/90 text-white placeholder:text-muted-foreground"
                placeholder="EQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={actionLoading === 'withdraw'}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#ff6a3a,#ff9a3a)] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,140,78,0.35)]"
            >
              {actionLoading === 'withdraw' ? 'Отправляем заявку...' : 'Отправить заявку'}
            </Button>

            {withdrawMessage && (
              <div
                className={cn(
                  'rounded-2xl border px-4 py-3 text-sm',
                  withdrawMessage.type === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : 'border-red-400/40 bg-red-500/10 text-red-200',
                )}
              >
                {withdrawMessage.text}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Card className="rounded-3xl border border-white/5 bg-[#101822]/90 p-5 text-foreground shadow-[0_14px_32px_rgba(8,14,20,0.55)]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffbb56,#ff8c2f)] text-2xl font-bold text-black shadow-[0_14px_24px_rgba(255,153,0,0.45)]">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">{profile?.username ?? 'Quant Market'}</h2>
            <p className="text-xs text-muted-foreground">
              {profile?.tonAddress ? 'Ваш персональный аккаунт в Quant Market' : 'Подключите кошелек, чтобы использовать все функции'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadProfile()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:text-white"
          >
            <RefreshCw className={cn('h-4 w-4', profileLoading && 'animate-spin')} />
          </button>
        </div>
      </Card>

      <section>
        <h3 className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Баланс
          <span className="text-[11px] font-normal normal-case tracking-normal text-muted-foreground/80">
            {copyHint}
          </span>
        </h3>
        <Card className="mt-3 space-y-4 rounded-3xl border border-white/5 bg-[#101822]/90 p-5 shadow-[0_14px_32px_rgba(8,14,20,0.55)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Текущий баланс</p>
              <p className="mt-2 text-2xl font-semibold text-white">{profileLoading ? '—' : formatTon(profile?.balance, '0 TON')}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Зарезервировано: {profileLoading ? '—' : formatTon(profile?.reservedBalance, '0 TON')}
              </p>
              {profileError && <p className="mt-2 text-xs text-red-300">{profileError}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => setDepositOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#3c8dff,#2560ff)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(59,140,255,0.35)]"
              >
                <ArrowDownCircle className="h-4 w-4" />
                Пополнить
              </Button>
              <Button
                type="button"
                onClick={() => setWithdrawOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff6a3a,#ff9a3a)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(255,140,78,0.35)]"
              >
                <ArrowUpCircle className="h-4 w-4" />
                Вывести
              </Button>
            </div>
          </div>

          {profile?.tonAddress && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#0f1720]/80 px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">TON-адрес</p>
                <p className="mt-1 text-sm font-semibold text-white">{profile.tonAddress}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(profile.tonAddress, 'Адрес скопирован')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          )}
        </Card>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Статистика
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {statsCards.map((card, index) => (
            <Card
              key={card.label}
              className={cn(
                'rounded-3xl border border-white/6 bg-[#0f1720]/90 p-4 text-foreground shadow-[0_12px_28px_rgba(8,14,20,0.55)]',
                index === 1 && 'bg-[linear-gradient(135deg,rgba(36,135,255,0.15),rgba(21,89,255,0.2))]',
              )}
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {card.label}
                </span>
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Gem className="h-4 w-4 text-primary" />
                  {card.value}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Рефералы
        </h3>
        <Card className="mt-3 rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(111,50,255,0.3),rgba(37,72,255,0.35))] p-5 shadow-[0_18px_32px_rgba(27,24,70,0.55)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 text-lg font-semibold text-white">
              1
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Заработайте на продвижении</p>
              <p className="text-xs text-white/80">
                Рекомендуйте наш маркет своим друзьям и получайте процент от их покупок.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Приглашения
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Card className="rounded-3xl border border-white/5 bg-[#101822]/90 p-4 text-center shadow-[0_12px_26px_rgba(8,14,20,0.5)]">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold text-white">0</span>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Приглашено друзей</p>
            </div>
          </Card>
          <Card className="rounded-3xl border border-white/5 bg-[#101822]/90 p-4 text-center shadow-[0_12px_26px_rgba(8,14,20,0.5)]">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold text-white">0 TON</span>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Получить</p>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Ссылки
        </h3>
        <Card className="mt-3 overflow-hidden rounded-3xl border border-white/5 bg-[#101822]/90 shadow-[0_10px_22px_rgba(8,14,20,0.5)]">
          <div className="divide-y divide-white/5">
            {['Новостной канал', 'Поддержка', 'FAQ'].map((link) => (
              <button
                key={link}
                type="button"
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-foreground transition hover:bg-white/5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Link2 className="h-4 w-4" />
                  </span>
                  {link}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

export default ProfilePage
