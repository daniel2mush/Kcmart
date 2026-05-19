import { useRef } from 'react'
import { gsap } from 'gsap'
import { latestDrops } from '../lib/staticResources'
import { Button } from './ui/button'
import { useGSAP } from '@gsap/react'
import { Link } from '@tanstack/react-router'
import { Card } from './helpers/Card'

const Latest = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2,
    })
  }, [])

  return (
    <div ref={containerRef} className="  h-[60dvh] bg-surface overflow- ">
      <div className="max-w-7xl mx-auto w-full p-10 space-y-10">
        <h1 className="text-3xl font-bold">Latest Drops</h1>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestDrops.map((drop, index) => (
            <Card drop={drop} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Latest
