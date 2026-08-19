'use client'
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname()
  const invalidPaths = ['/dashboard', '/login', '/register']
  const isDashboardRoute =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  if (isDashboardRoute || invalidPaths.includes(pathname)) return null

  return (
    // Changed bg-app to bg-surface so it visually separates from the main page body
    <footer className="w-full bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand & Description */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-block">
            <h2 className="text-2xl font-black text-primary tracking-tight hover:opacity-80 transition-opacity">
              KCMart
            </h2>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Professional design resources for creators. Premium templates, mockups,
            and graphics to speed up your workflow and polish your brand.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-9 h-9 rounded-full  text-secondary hover:bg-hover hover:text-primary transition-all duration-300"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-9 h-9 rounded-full  text-secondary hover:bg-hover hover:text-primary transition-all duration-300"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex items-center justify-center w-9 h-9 rounded-full  text-secondary hover:bg-hover hover:text-primary transition-all duration-300"
            >
              <FaTwitter size={16} />
            </a>
          </div>
        </div>

        {/* Products Links */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Products
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {['Templates', 'Mockups', 'Graphics', 'Magazines'].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Company
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {['About', 'Contact', 'Support'].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Legal
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {['Terms', 'Privacy', 'License'].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-secondary hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} KCMart. All rights reserved.</p>
          <p>
            Designed & Built by{' '}
            <a
              href="tel:+22371907048"
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              zcoder (+223 71 90 70 48)
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer