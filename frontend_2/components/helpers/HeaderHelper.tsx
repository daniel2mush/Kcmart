'use client'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from "next/navigation";

// Map routes to their display titles (O(1) lookup, much cleaner than switch)
const PAGE_TITLES: Record<string, string> = {
  '/templates': 'Templates',
  '/mockups': 'Mockups',
  '/graphics': 'Graphics',
  '/magazines': 'Magazines',
  '/about': 'About Us',
  '/support': 'Support',
  '/contact': 'Contact',
  '/terms': 'Terms of Service',
  '/privacy': 'Privacy Policy',
  '/license': 'License Agreement',
}

const HeaderHelper = () => {
  const pathname = usePathname()

  // Compute title once. Fallback to formatted pathname if not in map (e.g. /settings -> Settings)
  const currentPageTitle = PAGE_TITLES[pathname] || pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2)

  // Don't render on home page or if no title exists
  if (pathname === '/' || !currentPageTitle) return null

  return (
    <header className="relative w-full min-h-62.5 md:min-h-87.5 flex items-center justify-center overflow-hidden bg-surface border-b border-border/50">

      {/* Background image layer (opacity applied directly to image, not wrapper) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero.webp"
          alt=""
          fill
          priority={false}
          className="object-cover opacity-10"
        />
      </div>

      {/* Gradient overlay to blend the bottom seamlessly into the page background */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-surface/50 to-surface" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">

        {/* Semantic Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-200">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={16} className="text-muted-foreground/50" />
            </li>
            <li className="font-medium text-primary">
              {currentPageTitle}
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-secondary">
          {currentPageTitle}
        </h1>
      </div>
    </header>
  )
}

export default HeaderHelper