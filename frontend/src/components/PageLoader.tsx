import { Boxes, PackageSearch, ShoppingBag } from 'lucide-react'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const PageLoader = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      tl.fromTo(
        '.loader-box',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          '.loader-icons > *',
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, stagger: 0.15, duration: 0.5 },
          '-=0.4'
        )
        .fromTo(
          '.loader-title',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.loader-desc',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )

      // Infinite floating animation for the box
      gsap.to('.loader-box', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    },
    { scope: container }
  )

  return (
    <div
      ref={container}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-app px-6 text-center"
    >
      <div className="loader-box mb-10 grid size-28 place-items-center border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
        <div className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-spin border border-primary/40" />
          <span className="absolute inset-2 border border-muted/40" />
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 animate-pulse bg-primary" />
          <PackageSearch
            className="relative size-8 text-primary"
            strokeWidth={1.7}
          />
        </div>
      </div>
      <div className="loader-icons mb-6 flex items-center gap-4 text-muted">
        <ShoppingBag className="size-5" strokeWidth={1.8} />
        <span className="h-px w-16 bg-border" />
        <Boxes className="size-5" strokeWidth={1.8} />
      </div>
      <p className="loader-title max-w-4xl text-4xl font-black leading-tight text-primary">
        Finding quality stock items for your next order.
      </p>
      <p className="loader-desc mt-5 max-w-xl text-base font-medium leading-7 text-muted">
        Checking inventory, images, and product details.
      </p>
    </div>
  )
}

export default PageLoader
