import { Facebook, Instagram, MoreHorizontal, Twitter, X } from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { Link, useParams } from '@tanstack/react-router'
import { gsap } from 'gsap'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { Button } from './ui/button'

gsap.registerPlugin(useGSAP)

type navTypes = {
  title?: string
  link?: string
  icon?: React.ReactNode
}
const navList: navTypes[] = [
  {
    title: 'Discover',
    link: '/',
  },
  {
    title: 'Templates',
    link: '/templates',
  },
  {
    title: 'Mockups',
    link: '/mockups',
  },
  {
    title: 'Graphics',
    link: '/graphics',
  },
  {
    icon: <MoreHorizontal />,
  },
]

const moreNav: navTypes[] = [
  {
    title: 'Magazines',
    link: '/magazines',
  },
  {
    title: 'About',
    link: '/about',
  },
  {
    title: 'Support',
    link: '/support',
  },
  {
    title: 'Contact',
    link: '/contact',
  },
]

type IconsTypes = {
  icon: React.ReactNode
  link: string
}

const iconList: IconsTypes[] = [
  {
    icon: <Instagram size={20} />,
    link: 'http://instagrame.com',
  },
  {
    icon: <Facebook size={20} />,
    link: 'http://facebook.com',
  },
  {
    icon: <Twitter size={20} />,
    link: 'http://twitter.com',
  },
]

const NavBar = () => {
  const navRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useGSAP(
    () => {
      if (!navRef.current) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.7 },
      })

      timeline
        .fromTo(
          navRef.current,
          {
            y: -28,
            filter: 'blur(10px)',
          },
          {
            y: 0,
            filter: 'blur(0px)',
          },
        )
        .fromTo(
          '.logo',
          {
            y: -12,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
          },
          '-=0.35',
        )
        .fromTo(
          '.nav-item',
          {
            y: -10,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.08,
          },
          '-=0.45',
        )
        .fromTo(
          '.social-link',
          {
            scale: 0.75,
            autoAlpha: 0,
          },
          {
            scale: 1,
            autoAlpha: 1,
            stagger: 0.07,
          },
          '-=0.35',
        )
    },
    { scope: navRef },
  )

  return (
    <div
      ref={navRef}
      id="container"
      className="sticky top-0 left-0 z-50 h-20 w-full bg-app px-10 py-5 border-b border-border"
      style={{ transform: 'translateY(-28px)', filter: 'blur(10px)' }}
    >
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="logo"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <h1 className=" font-black text-2xl text-secondary">KCMart</h1>
        </Link>
        <ul className=" content flex items-center justify-center gap-6 text-muted">
          {navList.map((nav, i) => (
            <div
              key={i}
              className="nav-item"
              style={{ opacity: 0, visibility: 'hidden' }}
            >
              <li className="text-[15px] text-muted transition-transform duration-200 hover:-translate-y-0.5">
                {nav.link ? (
                  <Link
                    to={nav.link}
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className:
                        ' !text-primary w-full bg-surface rounded-md border border-border px-4 py-2',
                    }}
                  >
                    {nav.title}
                  </Link>
                ) : null}
                {nav.icon && (
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="relative"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer border-0 bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-0"
                      >
                        {isOpen ? <X /> : nav.icon}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="absolute -right-10 top-12  overflow-hidden rounded-md border border-border bg-app p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2">
                      <ul className="flex flex-col gap-1">
                        {moreNav.map((item) => (
                          <li key={item.title}>
                            {item.link ? (
                              <Link
                                to={item.link}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-sm px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-inset hover:text-primary"
                              >
                                {item.title}
                              </Link>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </li>
            </div>
          ))}
        </ul>
        <div className=" flex items-center gap-10">
          <div className=" social flex justify-center items-center gap-6">
            {iconList.map((icon, i) => (
              <a
                key={i}
                href={icon.link}
                className="social-link transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110"
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                {icon.icon}
              </a>
            ))}
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="border border-border text-primary transition-colors hover:bg-app/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
