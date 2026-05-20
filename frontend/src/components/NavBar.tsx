import {
  Facebook,
  Instagram,
  Menu,
  MoreHorizontal,
  Twitter,
  X,
} from 'lucide-react'
import type React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { Link, useLocation } from '@tanstack/react-router'
import { gsap } from 'gsap'
import { useMediaQuery } from 'react-responsive'
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
    link: 'http://instagram.com',
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
  // const { isAuthenticated } = useRouteContext({ from: '__root__' })
  const navRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0)

  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const pathname = useLocation().pathname

  useGSAP(
    () => {
      if (
        pathname === '/dashboard' ||
        pathname === '/signin' ||
        pathname === 'register'
      )
        return null
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
    { dependencies: [pathname], scope: navRef },
  )

  useGSAP(
    () => {
      if (!isMobileMenuOpen) return

      gsap.fromTo(
        mobileMenuRef.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.6, ease: 'power4.out' },
      )

      gsap.fromTo(
        '.mobile-nav-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        },
      )
    },
    { dependencies: [isMobileMenuOpen], scope: mobileMenuRef },
  )

  useEffect(() => {
    const onScroll = () => setIsFixed(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!navRef.current) return
    setPlaceholderHeight(navRef.current.offsetHeight)
    const ro = new ResizeObserver(() => {
      if (navRef.current) setPlaceholderHeight(navRef.current.offsetHeight)
    })
    ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: 'power4.in',
        onComplete: () => setIsMobileMenuOpen(false),
      })
    } else {
      setIsMobileMenuOpen(true)
    }
  }

  if (
    pathname === '/dashboard' ||
    pathname === '/signin' ||
    pathname === 'register'
  )
    return null

  return (
    <>
      {isFixed && <div aria-hidden style={{ height: placeholderHeight }} />}
      <div
        ref={navRef}
        id="container"
        className={`${isFixed ? 'fixed top-0 left-0 right-0 backdrop-blur-md bg-app/80 shadow-md' : 'fixed top-0'} z-1000 h-20 w-full px-6 md:px-10 py-5 transition-all duration-300`}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="logo"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h1 className=" font-black text-2xl text-secondary">KCMart</h1>
          </Link>

          {!isMobile ? (
            <>
              <ul className=" content flex items-center justify-center gap-6 text-secondary">
                {navList.map((nav, i) => (
                  <div
                    key={i}
                    className="nav-item"
                    style={{ opacity: 0, visibility: 'hidden' }}
                  >
                    <li className="text-[15px] text-secondary hover:text-primary transition-transform duration-200 hover:-translate-y-0.5">
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
                    </li>
                  </div>
                ))}
                <div
                  className="nav-item"
                  style={{ opacity: 0, visibility: 'hidden' }}
                >
                  <li className="text-[15px] text-secondary hover:text-primary">
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
                          {isOpen ? <X /> : <MoreHorizontal />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="absolute text-secondary -right-10 top-12 overflow-hidden rounded-md border border-border bg-app p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2">
                        <ul className="flex flex-col gap-1">
                          {moreNav.map((item) => (
                            <li key={item.title}>
                              {item.link ? (
                                <Link
                                  to={item.link}
                                  onClick={() => setIsOpen(false)}
                                  className="block rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-inset hover:text-primary"
                                >
                                  {item.title}
                                </Link>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                </div>
              </ul>
              <div className=" flex items-center gap-10">
                <div className=" social flex justify-center items-center gap-6 text-secondary">
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
                  <Link
                    to="/signin"
                    className=" px-5 py-2 rounded-xl bg-app  border border-border text-secondary hover:text-primary cursor-pointer transition-colors hover:bg-app/80"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-primary z-50"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[999] bg-app flex flex-col items-center justify-center p-10 overflow-hidden"
        >
          <div className="flex flex-col items-center gap-8 w-full">
            {[...navList, ...moreNav].map((nav, i) => (
              <div key={i} className="mobile-nav-item">
                <Link
                  to={nav.link}
                  onClick={toggleMobileMenu}
                  className="text-4xl font-bold text-secondary hover:text-primary transition-colors"
                >
                  {nav.title}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-8">
            <div className="flex gap-8">
              {iconList.map((icon, i) => (
                <a
                  key={i}
                  href={icon.link}
                  className="mobile-nav-item text-secondary hover:text-primary"
                >
                  {icon.icon}
                </a>
              ))}
            </div>
            <div className="mobile-nav-item">
              <Button
                variant="outline"
                size="lg"
                className="w-48 border-border text-secondary hover:text-primary"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
