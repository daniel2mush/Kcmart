import { Link, useLocation } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'

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

  // console.log(pathname)

  return (
    <div className="  relative min-h-[40dvh] w-full flex justify-center items-center overflow-hidden">
      <div className=" z-0 absolute top-0 left-0 opacity-5">
        <img src="Hero.webp" alt="Hero" className=" object-cover" />
      </div>

      <div className=" z-50">
        <div className="text-secondary text-sm  flex justify-center items-center gap-3 mb-4">
          <Link to="/" className=" cursor-pointer hover:text-primary">
            Home
          </Link>
          <span>
            <ArrowRight className=" inline" size={16} />
          </span>
          <span className=" text-primary">{Heading()}</span>
        </div>

        <h1 className=" text-[clamp(1.5rem,5vw,4rem)] text-secondary font-bold">
          {Heading()}
        </h1>
      </div>
    </div>
  )
}

export default HeaderHelper
