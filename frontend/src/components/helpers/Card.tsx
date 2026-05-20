import { useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'

interface CardProps {
  id: number
  name: string
  price: number
  types: string
  tags: string
  image: string[]
}
interface ValidCardProps {
  title: string
  viewMoreLink?: string
  iterable: CardProps[]
  sliceValue?: number
}
export const Card = ({
  iterable,
  title,
  viewMoreLink,
  sliceValue,
}: ValidCardProps) => {
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([])
  const actionRefs = useRef<Array<HTMLDivElement | null>>([])
  const backdropRef = useRef<Array<HTMLDivElement | null>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 },
      })

      timeline
        .to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        .fromTo(
          '.header-text > *',
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
          },
          '-=0.3'
        )
        .fromTo(
          '.card-item',
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.4'
        )
    },
    { scope: containerRef }
  )

  const handleMouseEnter = (index: number) => {
    const overlay = overlayRefs.current[index]
    const action = actionRefs.current[index]
    const backdrop = backdropRef.current[index]

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

    if (backdrop) {
      gsap.to(backdrop, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.inOut',
      })
    }
  }

  const handleMouseLeave = (index: number) => {
    const overlay = overlayRefs.current[index]
    const action = actionRefs.current[index]
    const backdrop = backdropRef.current[index]

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

    if (backdrop) {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className=" space-y-6 w-full h-full p-10 "
      style={{ opacity: 0, transform: 'translateY(-20px)' }}
    >
      <div className=" header-text  flex justify-between items-center">
        <h1
          className="text-3xl font-bold text-center md:text-start text-secondary flex justify-between items-center"
          style={{ opacity: 0 }}
        >
          {title}
        </h1>

        {viewMoreLink && (
          <Link
            to={viewMoreLink}
            className=" text-secondary flex justify-center items-center gap-1 text-[12px] font-medium t-2 hover:text-primary/80 transition-colors duration-200"
            style={{ opacity: 0 }}
          >
            View More
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
      <div className=" flex justify-center items-center md:">
        <div
          className={` grid-contents grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 w-full`}
        >
          {iterable.slice(0, sliceValue).map((drop, index) => (
            <div
              key={index}
              className="card-item relative w-full h-80 bg-app rounded-lg overflow-hidden border border-border group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{ opacity: 0 }}
            >
              <div
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                id="backdrop"
                ref={(el) => {
                  backdropRef.current[index] = el
                }}
                className=" absolute top-0 right-0 opacity-0 z-50 w-full backdrop-blur-sm bg-black/5 h-full"
              />
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
                className="absolute z-50 left-0 bg-surface w-full h-full px-4 transition-all duration-300"
              >
                <div className=" flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold mt-4 text-secondary">
                      {drop.name}
                    </h2>
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
          ))}
        </div>
      </div>
    </div>
  )
}
