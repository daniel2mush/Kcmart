import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const NotFound = () => {
  return (
    <div
      className={'w-full max-h-screen min-h-screen relative overflow-hidden '}
    >
      <div className={'absolute z-0 opacity-5'}>
        <img
          src={'/Hero.webp'}
          alt="background"
          className={'object-cover object-center'}
        />
      </div>
      <div
        className={
          ' absolute  w-full h-full z-50 flex justify-center items-center h-screen'
        }
      >
        <div className={'flex items-center justify-center flex-col gap-7'}>
          <h1 className={'text-secondary text-2xl md:text-6xl font-bold '}>
            Page not found!
          </h1>
          <p>The page your are looking for is not found or it's deleted</p>
          <Link
            to={'/'}
            className={
              'text-app p-2 bg-primary rounded-md flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/80'
            }
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
