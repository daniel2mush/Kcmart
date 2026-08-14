import { Link, useLocation } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

const HeaderHelper = () => {
  const location = useLocation()
  const pathname = location.pathname

  const Heading = () => {
    switch (pathname) {
      case '/templates':
        return 'Templates'
      case '/mockups':
        return 'Mockups'
      case '/graphics':
        return 'Graphics'
      case '/magazines':
        return 'Magazines'
      case '/about':
        return 'About'
      case '/support':
        return 'Support'
      case '/contact':
        return 'Contact'
      case '/terms':
        return 'Terms of Service'
      case '/privacy':
        return 'Privacy Policy'
      case '/license':
        return 'License'
      default:
        return ''
    }
  }

  return (
    <div className="relative w-full min-h-[30vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="Hero.webp"
          alt="Hero"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-secondary text-sm flex items-center justify-center gap-3 mb-4">
          <Link to="/" className="cursor-pointer hover:text-primary">
            Home
          </Link>
          <ArrowRight size={16} className="inline" />
          <span className="text-primary">{Heading()}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary">
          {Heading()}
        </h1>
      </div>
    </div>
  )
}

export default HeaderHelper
