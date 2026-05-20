import React, { useState } from 'react'
import {
  Cuboid,
  FileType,
  Folder,
  Image,
  LayoutTemplate,
  LogOut,
  Newspaper,
  PackageCheck,
  Palette,
  ReceiptText,
  Settings,
  SidebarClose,
  SidebarOpen,
  Sparkles,
  User,
} from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible.tsx'
import { useUserStore } from '#/store.ts'
import { Link, useRouter } from '@tanstack/react-router'
import { useLogout } from '../queries/auth/AuthQuery.ts'
import { toast } from 'sonner'

type NavsTypes = {
  navName: string
  navValue: string
  navIcons: React.ReactNode
}
const NavLisits: NavsTypes[] = [
  {
    navName: 'Templates',
    navValue: 'templates',
    navIcons: <LayoutTemplate size={18} />,
  },
  {
    navName: 'Mockups',
    navValue: 'mockups',
    navIcons: <Image size={18} />,
  },
  {
    navName: 'Graphics',
    navValue: 'graphics',
    navIcons: <Palette size={18} />,
  },
  {
    navName: 'Icons',
    navValue: 'icons',
    navIcons: <Sparkles size={18} />,
  },
  {
    navName: 'Fonts',
    navValue: 'fonts',
    navIcons: <FileType size={18} />,
  },
  {
    navName: '3D Models',
    navValue: 'models',
    navIcons: <Cuboid size={18} />,
  },
  {
    navName: 'Magazines',
    navValue: 'magazines',
    navIcons: <Newspaper size={18} />,
  },
]

interface UserNavTypes {
  navName: string
  link: string
  icon: React.ReactNode
}

const UserNavs: UserNavTypes[] = [
  {
    navName: 'Profile',
    link: '/profile',
    icon: <User size={15} />,
  },
  {
    navName: 'Settings',
    link: '/settings',
    icon: <Settings size={15} />,
  },
  {
    navName: 'Folders',
    link: '/folders',
    icon: <Folder size={15} />,
  },
  {
    navName: 'My Products',
    link: '/dashboard',
    icon: <PackageCheck size={15} />,
  },
  {
    navName: 'Purchase History',
    link: '/dashboard',
    icon: <ReceiptText size={15} />,
  },
]
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { mutateAsync, isPending } = useLogout()
  const router = useRouter()

  const { email, first_name, last_name } = useUserStore().user as {
    email: string
    first_name: string
    last_name: string
  }
  const initials = `${first_name[0] || 'K'}${last_name[0] || 'C'}`

  return (
    <div
      className={`relative h-screen max-w-64 border-r border-border bg-surface ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-500 ease-in-out`}
    >
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant={'ghost'}
        size={'icon'}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-5 top-6 z-10 size-10 cursor-pointer rounded-full border border-border bg-app text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:text-primary"
      >
        {isCollapsed ? <SidebarOpen size={18} /> : <SidebarClose size={18} />}
      </Button>
      <div className="sticky top-0 flex h-full w-full flex-col">
        {/*  Logo*/}
        <div className="flex h-28 items-center justify-center px-4">
          <h1
            className={`flex items-center gap-3 text-2xl font-bold transition-all duration-500 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-app text-sm text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              KC
            </span>
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                isCollapsed
                  ? 'w-0 opacity-0 -translate-x-2'
                  : 'w-28 translate-x-0 opacity-100'
              }`}
            >
              KCMart
            </span>
          </h1>
        </div>

        {/*
        Sidebar Section
        */}

        <div className="w-full flex-1 px-3">
          {NavLisits.map((nav, i) => {
            return (
              <button
                type="button"
                key={i}
                title={isCollapsed ? nav.navName : undefined}
                className="group mb-1 flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted transition-colors hover:bg-app hover:text-primary"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-inset/60 text-secondary transition-colors group-hover:border-border">
                  {nav.navIcons}
                </span>
                <div
                  className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${isCollapsed ? 'max-w-0' : 'max-w-44'}`}
                >
                  <p
                    className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                      isCollapsed
                        ? '-translate-x-2 opacity-0'
                        : 'translate-x-0 opacity-100'
                    }`}
                  >
                    {nav.navName}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        {/*  Prodfile section*/}

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative w-full overflow-visible px-3 pb-5"
        >
          <CollapsibleTrigger className="w-full cursor-pointer rounded-xl border border-border bg-app p-2 text-left text-secondary transition-colors hover:text-primary">
            <div className="flex w-full items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-app">
                {initials}
              </div>
              <div
                className={`${isCollapsed ? 'w-0' : 'max-w-44'} overflow-hidden transition-all duration-500 ease-in-out`}
              >
                <p
                  className={`truncate text-xs font-semibold ${
                    isCollapsed
                      ? 'opacity-0 -translate-x-2'
                      : 'translate-x-0 opacity-100'
                  } transition-all duration-500 ease-in-out`}
                >
                  {first_name} {last_name}
                </p>
                <p
                  className={`truncate text-[11px] text-muted ${
                    isCollapsed
                      ? 'opacity-0 -translate-x-2'
                      : 'translate-x-0 opacity-100'
                  } transition-all duration-500 ease-in-out`}
                >
                  {email}
                </p>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="absolute bottom-24 left-3 right-3 flex flex-col gap-1 rounded-xl border border-border bg-app p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
              {UserNavs.map((navs, i) => (
                <Link
                  to={navs.link}
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  title={isCollapsed ? navs.navName : undefined}
                >
                  <span className="shrink-0">{navs.icon}</span>
                  <p
                    className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                      isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    {navs.navName}
                  </p>
                </Link>
              ))}
              <button
                onClick={() => {
                  mutateAsync()
                    .then(() => {
                      toast.success('Logged out successfully')
                      router.navigate({ to: '/' })
                      router.invalidate()
                    })
                    .catch((data) => {
                      console.log(data.message, 'Error data')
                      toast.error(data.message)
                    })
                }}
                type="button"
                disabled={isPending}
                className="flex items-center gap-3 rounded-lg cursor-pointer bg-red-600 px-3 py-2 text-sm text-primary transition-colors hover:bg-red-500"
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut size={15} className="shrink-0" />
                <p
                  className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  Logout
                </p>
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export default Sidebar
