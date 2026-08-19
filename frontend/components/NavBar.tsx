'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, MoreHorizontal, X } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6'
import { Button } from './ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {useUserStore} from "@/lib/store";

type NavItem = { title: string; link: string }
type SocialLink = { icon: React.ReactNode; link: string; label: string }

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
  { icon: <FaInstagram size={18} />, link: 'https://instagram.com', label: 'Instagram' },
  { icon: <FaFacebookF size={18} />, link: 'https://facebook.com', label: 'Facebook' },
  { icon: <FaTwitter size={18} />, link: 'https://twitter.com', label: 'Twitter' },
]

// Helper to determine active route for styling
const isLinkActive = (pathname: string, link: string) => {
  if (link === '/') return pathname === '/'
  return pathname === link || pathname.startsWith(`${link}/`)
}

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const user = useUserStore()

  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLLIElement>(null)

  const hiddenRoutes = ['/dashboard', '/login', '/register']
  const shouldHideNav = hiddenRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))

  // Handle scroll effect for glassmorphism background
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  // useEffect(() => {
  //   // setIsMobileMenuOpen(false)
  //   setIsDropdownOpen(false)
  // }, [pathname])

  if (shouldHideNav) return null

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'backdrop-blur-md bg-app/80 shadow-md border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex h-20 items-center justify-between max-w-7xl mx-auto px-6 md:px-10">
          <Link href="/" className="flex items-center z-50">
            <h1 className="font-black text-2xl text-primary tracking-tight hover:opacity-80 transition-opacity">
              KCMart
            </h1>
          </Link>

          {!isMobile ? (
            <>
              {/* Desktop Navigation Links */}
              <ul className="flex items-center gap-8">
                {navList.map((nav) => {
                  const active = isLinkActive(pathname, nav.link)
                  return (
                    <li key={nav.title}>
                      <Link
                        href={nav.link}
                        className={`text-[15px] font-medium transition-all duration-200 hover:-translate-y-0.5 block relative ${
                          active ? 'text-primary' : 'text-secondary hover:text-primary'
                        }`}
                      >
                        {nav.title}
                        {active && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                        )}
                      </Link>
                    </li>
                  )
                })}

                {/* "More" Dropdown */}
                <li className="relative" ref={dropdownRef}>
                  <Collapsible open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <CollapsibleTrigger >

                        {isDropdownOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="absolute right-0 top-12 w-48 overflow-hidden rounded-lg border border-border bg-surface p-2 shadow-xl z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2">
                      <ul className="flex flex-col gap-1">
                        {moreNav.map((item) => {
                          const active = isLinkActive(pathname, item.link)
                          return (
                            <li key={item.title}>
                              <Link
                                href={item.link}
                                onClick={() => setIsDropdownOpen(false)}
                                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                  active 
                                    ? 'bg-inset text-primary' 
                                    : 'text-secondary hover:bg-inset hover:text-primary'
                                }`}
                              >
                                {item.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              </ul>

              {/* Desktop Right Side (Socials & Sign In) */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-secondary">
                  {socialLinks.map((social) => (
                    <a
                      key={social.link}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-inset text-secondary hover:text-primary transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <Link
                  href={user.user? '/dashboard' : '/login'}
                  className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-secondary transition-all hover:bg-hover hover:text-primary hover:border-primary/50"
                >
                  {
                    user.user ? 'Dashboard' : "Login"
                  }
                </Link>
              </div>
            </>
          ) : (
            /* Mobile Menu Toggle */
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-primary hover:bg-inset z-50"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay (Slides down from navbar) */}
      {isMobile && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`fixed top-20 left-0 right-0 bottom-0 z-40 flex flex-col items-center bg-app/95 backdrop-blur-lg px-6 py-8 transition-transform duration-300 ease-in-out overflow-y-auto ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-[120%]'
          }`}
        >
          <nav className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto mt-8">
            {[...navList, ...moreNav].map((nav) => {
              const active = isLinkActive(pathname, nav.link)
              return (
                <Link
                  key={nav.title}
                  href={nav.link}
                  className={`text-2xl font-bold transition-colors ${
                    active ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {nav.title}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto mb-8 flex flex-col items-center gap-8">
            <div className="flex gap-4 text-secondary">
              {socialLinks.map((social) => (
                <a
                  key={social.link}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-inset text-secondary hover:bg-hover hover:text-primary transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <Button
              onClick={() => router.push('/signin')}
              variant="outline"
              size="lg"
              className="w-full max-w-[200px] border-border text-secondary hover:text-primary hover:bg-hover"
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