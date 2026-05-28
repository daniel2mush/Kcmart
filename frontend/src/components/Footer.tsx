import { Link, useLocation } from '@tanstack/react-router'
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  const pathname = useLocation().pathname
  const invalidPaths = ['/dashboard', '/signin', '/register', '/dashboard/']
  const isDashboardRoute =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  if (isDashboardRoute || invalidPaths.includes(pathname)) return
  return (
    <footer className="w-full bg-app border-t border-border text-muted ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-black text-secondary ">KCMart</h2>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Professional design resources for creators — templates, mockups,
            graphics and magazine layouts to speed up your workflow and polish
            your brand.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className=" place-items-end">
          <h3 className="font-semibold mb-3 text-secondary">Products</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/templates" className="hover:text-primary">
                Templates
              </Link>
            </li>
            <li>
              <Link to="/mockups" className="hover:text-primary">
                Mockups
              </Link>
            </li>
            <li>
              <Link to="/graphics" className="hover:text-primary">
                Graphics
              </Link>
            </li>
            <li>
              <Link to="/magazines" className="hover:text-primary">
                Magazines
              </Link>
            </li>
          </ul>
        </div>

        <div className=" place-items-end">
          <h3 className="font-semibold mb-3 text-secondary">Company</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-primary">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div className=" place-items-end">
          <h3 className="font-semibold mb-3 text-secondary">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/terms" className="hover:text-primary">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/license" className="hover:text-primary">
                License
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} KCMart. All rights reserved.
          </p>
          <div className="text-sm text-muted">
            Built with care · Design resources
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
