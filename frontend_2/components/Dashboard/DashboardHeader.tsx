import { Link, useLocation } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

const DashboardHeader = () => {
  const pathname = useLocation().pathname
  const getHeading = (pathname: string) => {
    switch (pathname) {
      case '/dashboard/profile':
        return 'Profile'
      case '/dashboard/products':
        return 'Products'
      case '/dashboard/purchase_history':
        return 'Purchase History'
      case '/dashboard/settings':
        return 'Settings'
      case '/dashboard/folders':
        return 'Folders'
      default:
        return ''
    }
  }
  const heading = getHeading(pathname)
  return (
    <div className="  relative min-h-[40dvh] w-full flex justify-center items-center overflow-hidden">
      <div className=" z-0 absolute top-0 left-0 opacity-5">
        <img src="/Hero.webp" alt="Hero" className=" object-cover" />
      </div>

      <div className=" z-50">
        <div className="text-secondary text-sm  flex justify-center items-center gap-3 mb-4">
          <Link to="/dashboard" className=" cursor-pointer hover:text-primary">
            Dashboard
          </Link>
          <span>
            <ArrowRight className=" inline" size={16} />
          </span>
          <span className=" text-primary">{heading}</span>
        </div>

        <h1 className=" text-[clamp(1.5rem,5vw,4rem)] text-secondary font-bold">
          {heading}
        </h1>
      </div>
    </div>
  )
}

export default DashboardHeader
