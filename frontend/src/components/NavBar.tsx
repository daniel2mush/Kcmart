import {
  Facebook,
  Instagram,
  Menu,
  MoreHorizontal,
  Twitter,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useMediaQuery } from 'react-responsive'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { Button } from './ui/button'

// --- Types ---
type NavItem = {
  title: string
  link: string
}

type SocialLink = {
  icon: React.ReactNode
  link: string
  label: string
}

// --- Data ---
const navList: NavItem[] = [
  { title: 'Discover', link: '/' },
  { title: 'Templates', link: '/templates' },
  { title: 'Mockups', link: '/mockups' },
  { title: 'Graphics', link: '/graphics' },
]

const moreNav: NavItem[] = [
  { title: 'Magazines', link: '/magazines' },
  { title: 'About', link: '/about' },
  { title: 'Support', link: '/support' },
  { title: 'Contact', link: '/contact' },
]

const socialLinks: SocialLink[] = [
  {
    icon: <Instagram size={20} />,
    link: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    icon: <Facebook size={20} />,
    link: 'https://facebook.com',
    label: 'Facebook',
  },
  {
    icon: <Twitter size={20} />,
    link: 'https://twitter.com',
    label: 'Twitter',
  },
]

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const pathname = useLocation().pathname
  const navigate = useNavigate()

  const invalidPaths = ['/dashboard', '/signin', '/register']
  const isDashboardRoute =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  // --- Scroll listener for background effect ---
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // --- Prevent body scroll when mobile menu open ---
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // --- Close mobile menu on Escape key ---
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)

  if (isDashboardRoute || invalidPaths.includes(pathname)) return null

  return (
    <>
      {/*
        Navbar:
        Using `sticky top-0` natively handles taking up space in the document flow
        without needing manual placeholder height calculations or ResizeObservers.
      */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-app/80 shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="flex h-20 items-center justify-between max-w-7xl mx-auto px-6 md:px-10 py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-black text-2xl text-secondary">KCMart</h1>
          </Link>

          {!isMobile ? (
            <>
              {/* Desktop Navigation */}
              <ul className="flex items-center gap-6 text-secondary">
                {navList.map((nav) => (
                  <li key={nav.title}>
                    <Link
                      to={nav.link}
                      activeOptions={{ exact: true }}
                      activeProps={{
                        className:
                          '!text-primary bg-surface rounded-md border border-border px-4 py-2',
                      }}
                      className="text-[15px] text-secondary hover:text-primary transition-transform duration-200 hover:-translate-y-0.5 block"
                    >
                      {nav.title}
                    </Link>
                  </li>
                ))}

                {/* More Dropdown */}
                <li className="relative">
                  <Collapsible
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer border-0 bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-0 text-secondary hover:text-primary"
                        aria-label="More navigation options"
                      >
                        {isDropdownOpen ? (
                          <X size={20} />
                        ) : (
                          <MoreHorizontal size={20} />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="absolute right-0 top-12 w-48 overflow-hidden rounded-md border border-border bg-app p-2 shadow-lg z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2">
                      <ul className="flex flex-col gap-1">
                        {moreNav.map((item) => (
                          <li key={item.title}>
                            <Link
                              to={item.link}
                              onClick={() => setIsDropdownOpen(false)}
                              className="block rounded-sm px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-inset hover:text-primary"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              </ul>

              {/* Desktop Right Side */}
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-6 text-secondary">
                  {socialLinks.map((social) => (
                    <a
                      key={social.link}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-primary"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <Link
                  to="/signin"
                  className="rounded-xl border border-border bg-app px-5 py-2 text-secondary transition-colors hover:bg-app/80 hover:text-primary"
                >
                  Sign In
                </Link>
              </div>
            </>
          ) : (
            /* Mobile Menu Toggle */
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-primary z-50"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-app px-4 py-8 sm:px-6 sm:py-10 transition-transform duration-300 ease-in-out overflow-y-auto ${
            isMobileMenuOpen
              ? 'translate-y-0 pointer-events-auto'
              : '-translate-y-full pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-sm mx-auto">
            {[...navList, ...moreNav].map((nav) => (
              <Link
                key={nav.title}
                to={nav.link}
                onClick={toggleMobileMenu}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary hover:text-primary transition-colors"
              >
                {nav.title}
              </Link>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex gap-6 sm:gap-8 text-secondary">
              {socialLinks.map((social) => (
                <a
                  key={social.link}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate({ to: '/signin' })
              }}
              variant="outline"
              size="lg"
              className="w-44 sm:w-48 border-border text-secondary hover:text-primary"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
