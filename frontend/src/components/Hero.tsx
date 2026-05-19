import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
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
          gsap.set(['.hero-art', '.hero-title', '.hero-copy'], {
            clearProps: 'opacity,visibility,transform,filter',
          })
          gsap.to('.hero-art-left', {
            x: -22,
            scale: 1.015,
            duration: 4.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
          gsap.to('.hero-art-right', {
            x: 22,
            scale: 1.015,
            duration: 5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        },
      })

      timeline
        .fromTo(
          '.hero-art',
          {
            autoAlpha: 0,
            scale: 0.96,
            filter: 'blur(14px)',
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.12,
          },
        )
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
          '-=0.45',
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
    <div ref={heroRef} className="w-full h-[70dvh] overflow-hidden">
      <div className=" flex justify-center items-center h-full relative ">
        <div className=" opacity-20">
          <div
            className="hero-art hero-art-left absolute top-0 left-0"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <img src="/hero-side.png" alt="" className="w-[50vw]" />
          </div>
          <div
            className="hero-art hero-art-right absolute bottom-0 right-0 rotate-180"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <img src="/hero-side.png" alt="" className="w-[50vw]" />
          </div>
        </div>
        <div className=" items text-center space-y-10 z-30 max-w-7xl mx-auto w-full">
          <h1
            className="hero-title text-6xl font-black"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            E-commerce power house. {<br />}Made for designers and developers.
          </h1>
          <p
            className="hero-copy text-secondary text-xl"
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
