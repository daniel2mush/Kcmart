import { useRef } from 'react'
import { gsap } from 'gsap'
import { latestDrops } from '../lib/staticResources'
import { useGSAP } from '@gsap/react'
import { Card } from './helpers/Card'

const Latest = () => {
  // const containerRef = useRef<HTMLDivElement>(null)

  // useGSAP(() => {
  //   gsap.from(containerRef.current, {
  //     opacity: 0,
  //     y: 20,
  //     duration: 0.8,
  //     ease: 'power3.out',
  //     delay: 0.2,
  //   })
  // }, [])

  return (
    <div className=" max-w-500 mx-auto  min-h-[60dvh] bg-surface overflow-hidden flex items-center justify-center">
      <div className="h-full mx-auto w-full flex justify-center items-center ">
        <Card title="Latest Drops" iterable={latestDrops} viewMoreLink="#" />
      </div>
    </div>
  )
}

export default Latest
