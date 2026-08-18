'use client'
import { useMemo, useEffect, useState, type ComponentType } from 'react'
import type { CountdownProps, CountdownRendererFn } from 'react-countdown'
import Image from "next/image";

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

    // Refactored into a clean array to avoid repeating JSX
    const timeUnits = [
      { label: 'Days', value: days },
      { label: 'Hours', value: hours },
      { label: 'Mins', value: minutes },
      { label: 'Secs', value: seconds },
    ]

    return (
      <div className="flex gap-2 sm:gap-3">
        {timeUnits.map(({ label, value }) => (
          <div
            key={label}
            // Glassmorphism effect: semi-transparent white with blur and subtle border
            className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[72px] px-2 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
          >
            {/* tabular-nums prevents the numbers from jittering left/right as they tick */}
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              {completed ? '00' : pad(value)}
            </div>
            <div className="text-[10px] sm:text-xs font-medium mt-1 uppercase tracking-wider text-gray-300">
              {label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    // Removed the global 'container' class to prevent 100dvw overflow bugs on mobile
    <section className=" container place-content-center relative w-full overflow-hidden">

      {/* Background Image */}
     <div className="absolute w-full opacity-10 inset-0 z-0">
        <Image
          src="/Hero.webp"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white rounded-full border border-white/20 backdrop-blur-sm">
              Limited Time Offer
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Lunch Hour <br /> <span className="text-primary">Flash Sale</span>
            </h2>

            <p className="text-lg text-gray-300 max-w-md mx-auto lg:mx-0">
              Get <span className="font-bold text-white">20% off</span> on all items during our lunch sale! Use code{' '}
              <code className="px-2 py-1 bg-white/10 rounded text-primary font-mono font-bold border border-white/20">LUNCH20</code>{' '}
              at checkout. Valid daily from 12 PM to 2 PM.
            </p>

            <div className="flex justify-center lg:justify-start">
              <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                Shop the Sale
              </button>
            </div>
          </div>

          {/* Right: Countdown */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
              Offer ends in:
            </p>

            {Countdown ? (
              <Countdown date={target} renderer={renderer} />
            ) : (
              // Loading Placeholder (matches the glassmorphism style)
              <div className="flex gap-2 sm:gap-3">
                {['Days', 'Hours', 'Mins', 'Secs'].map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[72px] px-2 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg animate-pulse"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white">--</div>
                    <div className="text-[10px] sm:text-xs font-medium mt-1 uppercase tracking-wider text-gray-300">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Promo2