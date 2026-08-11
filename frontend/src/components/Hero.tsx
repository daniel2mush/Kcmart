import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap/dist/gsap'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!heroRef.current) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.9 },
        delay: 0.2,
        onComplete: () => {
          gsap.set(heroRef.current, {
            clearProps: 'opacity,visibility',
          })
          gsap.set(['.hero-title', '.hero-copy'], {
            clearProps: 'opacity,visibility,transform,filter',
          })
        },
      })

      timeline
        .fromTo(
          '.hero-title',
          {
            y: 30,
            autoAlpha: 0,
            filter: 'blur(8px)',
          },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
          },
        )
        .fromTo(
          '.hero-copy',
          {
            y: 18,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
          },
          '-=0.45',
        )
    },
    { scope: heroRef },
  )

  return (
    <div
      ref={heroRef}
      className="w-full h-[clamp(30dvh,50dvw,70dvh)] overflow-hidden"
    >
      <div className=" flex justify-center items-center h-full relative ">
        <div className=" opacity-5 absolute top-0 left-0 w-full h-full">
          <img src="Hero.webp" />
        </div>
        <div className=" items text-center space-y-5 z-30 max-w-500 mx-auto w-full">
          <h1
            className="hero-title text-secondary font-black text-[clamp(1.5rem,5vw,4rem)] leading-tight"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            E-commerce power house. {<br />}Made for designers and developers.
          </h1>
          <p
            className="hero-copy text-[clamp(0.875rem,2vw,1.25rem)] text-muted mx-auto"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            Getting your mockups and your elements to make your designs
            amazing{' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
