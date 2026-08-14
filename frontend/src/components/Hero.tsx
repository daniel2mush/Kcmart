import { useRef, useEffect } from 'react'

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   let ctx: gsap.Context | undefined
  //
  //   const run = async () => {
  //     if (!heroRef.current) return
  //
  //     const { gsap } = await import('gsap')
  //
  //     ctx = gsap.context(() => {
  //       const timeline = gsap.timeline({
  //         defaults: { ease: 'power3.out', duration: 0.9 },
  //         delay: 0.2,
  //         onComplete: () => {
  //           gsap.set(heroRef.current, {
  //             clearProps: 'opacity,visibility',
  //           })
  //           gsap.set(['.hero-title', '.hero-copy'], {
  //             clearProps: 'opacity,visibility,transform,filter',
  //           })
  //         },
  //       })
  //
  //       timeline
  //         .fromTo(
  //           '.hero-title',
  //           {
  //             y: 30,
  //             autoAlpha: 0,
  //             filter: 'blur(8px)',
  //           },
  //           {
  //             y: 0,
  //             autoAlpha: 1,
  //             filter: 'blur(0px)',
  //           },
  //         )
  //         .fromTo(
  //           '.hero-copy',
  //           {
  //             y: 18,
  //             autoAlpha: 0,
  //           },
  //           {
  //             y: 0,
  //             autoAlpha: 1,
  //           },
  //           '-=0.45',
  //         )
  //     }, heroRef)
  //   }
  //
  //   run()
  //
  //   return () => {
  //     ctx?.revert()
  //   }
  // }, [])

  return (
    <div className=" container w-full overflow-hidden">
      <div className=" container flex justify-center items-center h-full w-full relative ">
        <div className="opacity-5 absolute top-0 left-0 w-full h-full ">
          <img
            src="Hero.webp"
            alt=""
            className={' object-cover w-full h-full'}
          />
        </div>
        <div className="items text-center space-y-5 z-30 mx-auto px-10 md:px-15 w-full  h-full ">
          <h1
            className="hero-title text-secondary font-black leading-tight text-3xl md:text-5xl lg:text-6xl "
            // style={{ opacity: 0, visibility: 'hidden' }}
          >
            E-commerce power house
            <br />
            Made for designers and developers
          </h1>
          <p
            className="hero-copy text-sm max-w-sm md:max-w-full md:text-2xl  text-muted mx-auto"
            // style={{ opacity: 0, visibility: 'hidden' }}
          >
            Getting your mockups and your elements to make your designs amazing
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
