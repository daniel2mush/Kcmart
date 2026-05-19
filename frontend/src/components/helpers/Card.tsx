import { useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'

interface CardProps {
  drop: {
    id: number
    name: string
    price: number
    types: string
    tags: string
    image: string[]
  }
  index: number
}
export const Card = ({ drop, index }: CardProps) => {
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([])
  const actionRefs = useRef<Array<HTMLDivElement | null>>([])

  const handleMouseEnter = (index: number) => {
    const overlay = overlayRefs.current[index]
    const action = actionRefs.current[index]

    if (overlay) {
      gsap.to(overlay, {
        y: -40,
        duration: 0.05,
        ease: 'power2.inOut',
      })
    }

    if (action) {
      gsap.to(action, {
        opacity: 1,
        y: -10,
        duration: 0.1,
        ease: 'power2.inOut',
      })
    }
  }

  const handleMouseLeave = (index: number) => {
    const overlay = overlayRefs.current[index]
    const action = actionRefs.current[index]

    if (overlay) {
      gsap.to(overlay, {
        y: 0,
        duration: 0.05,
        ease: 'power2.in',
      })
    }

    if (action) {
      gsap.to(action, {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.in',
      })
    }
  }

  return (
    <div
      key={index}
      className=" relative w-96 h-80 bg-app rounded-lg overflow-hidden border border-border group cursor-pointer"
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={() => handleMouseLeave(index)}
    >
      <div>
        <img
          src={drop.image[0]}
          alt={drop.name}
          className="w-full h-56 object-cover rounded-t-lg object-center"
        />
      </div>
      <div
        ref={(el) => {
          overlayRefs.current[index] = el
        }}
        className="absolute left-0 bg-surface w-full h-full px-4 transition-all duration-300"
      >
        <div className=" flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold mt-4">{drop.name}</h2>
            <p className="text-sm text-muted mt-2 line-clamp-3">
              <span className="text-md text-muted mr-4">
                {drop.types} - {drop.tags}
              </span>
            </p>
          </div>
          <p className="text-sm font-bold mt-4">${drop.price}</p>
        </div>
        <div
          ref={(el) => {
            actionRefs.current[index] = el
          }}
          className="opacity-0"
        >
          <Link
            to={drop.types.toLocaleLowerCase() + '/' + drop.id}
            className=" mt-4  py-2.5 px-3 rounded-md bg-app w-full block text-center text-sm font-medium text-primary transition-colors duration-200 hover:bg-app/10 border border-border  "
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  )
}
