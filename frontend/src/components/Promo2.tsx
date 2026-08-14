import { useMemo, useEffect, useState, type ComponentType } from 'react'
import type { CountdownProps, CountdownRendererFn } from 'react-countdown'

const Promo2 = () => {
  const [Countdown, setCountdown] =
    useState<ComponentType<CountdownProps> | null>(null)

  useEffect(() => {
    void import('react-countdown').then((mod) => {
      const Comp = (mod.default ?? mod) as ComponentType<CountdownProps>
      setCountdown(() => Comp)
    })
  }, [])

  const target = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setHours(12, 0, 0, 0)
    const end = new Date(now)
    end.setHours(14, 0, 0, 0)

    if (now < start) return start
    if (now >= start && now < end) return end

    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(12, 0, 0, 0)
    return tomorrow
  }, [])

  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    const pad = (n: number) => String(n).padStart(2, '0')

    if (completed) {
      return (
        <div className="flex gap-3">
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center px-3 py-2 bg-app rounded"
            >
              <div className="text-3xl font-bold">00</div>
              <div className="text-xs text-muted mt-1 uppercase">{label}</div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className=" flex gap-3">
        <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
          <div className="text-3xl font-bold">{pad(days)}</div>
          <div className="text-xs font-bold mt-1 uppercase">Days</div>
        </div>
        <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
          <div className="text-3xl font-bold">{pad(hours)}</div>
          <div className="text-xs font-bold mt-1 uppercase">Hours</div>
        </div>
        <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
          <div className="text-3xl font-bold">{pad(minutes)}</div>
          <div className="text-xs font-bold mt-1 uppercase">Minutes</div>
        </div>
        <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
          <div className="text-3xl font-bold">{pad(seconds)}</div>
          <div className="text-xs font-bold mt-1 uppercase">Seconds</div>
        </div>
      </div>
    )
  }

  return (
    <div className="  container overflow-hidden relative w-full min-h-[30dvh] bg-app flex justify-center items-center">
      <div className="opacity-5 absolute inset-0 h-full">
        <img
          src="Hero.webp"
          alt="bg"
          className={'object-cover h-full w-full'}
        />
      </div>

      <div className="max-w-500 mx-auto w-full p-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="max-w-lg space-y-4 text-center md:text-start">
            <h1 className="text-secondary text-3xl font-bold">Lunch sales</h1>
            <p className="text-muted text-md">
              Get 20% off on all items during our lunch sales! Use code{' '}
              <strong>LUNCH20</strong> at checkout. Offer valid from 12 PM to 2
              PM daily. Don't miss out on this delicious deal!
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center md:justify-end gap-4">
            {Countdown ? (
              <Countdown date={target} renderer={renderer} />
            ) : (
              // placeholder while loading on client
              <div className="flex gap-3">
                {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center px-3 py-2 bg-app rounded"
                  >
                    <div className="text-3xl font-bold">--</div>
                    <div className="text-xs font-bold mt-1 uppercase">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promo2
