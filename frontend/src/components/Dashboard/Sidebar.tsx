import React, { useState } from 'react'
import {
  Cuboid,
  FileType,
  Folder,
  Home,
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
  X,
} from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible.tsx'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useGetUser, useLogout } from '../queries/auth/AuthQuery.ts'
import { toast } from 'sonner'

type NavsTypes = {
  navName: string
  navValue: string
  navIcons: React.ReactNode
}

const NavLisits: NavsTypes[] = [
  {
    navName: 'All',
    navValue: 'all',
    navIcons: <Home size={18} />,
  },
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
    link: '/dashboard/profile',
    icon: <User size={15} />,
  },
  {
    navName: 'Settings',
    link: '/dashboard/settings',
    icon: <Settings size={15} />,
  },
  {
    navName: 'Folders',
    link: '/dashboard/folders',
    icon: <Folder size={15} />,
  },
  {
    navName: 'My Products',
    link: '/dashboard/products',
    icon: <PackageCheck size={15} />,
  },
  {
    navName: 'Purchase History',
    link: '/dashboard/purchase_history',
    icon: <ReceiptText size={15} />,
  },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync, isPending } = useLogout()
  const router = useRouter()
  const navigate = useNavigate()

  const { data } = useGetUser()
  const user = data as User | null

  function handleUrl(value: string) {
    navigate({
      to: '/dashboard',
      search: {
        page: 1,
        category: value,
      },
    })

    onClose?.()
  }

  async function handleLogout() {
    try {
      await mutateAsync()

      toast.success('Logged out successfully')

      router.invalidate()
      router.navigate({ to: '/' })
    } catch (error: any) {
      console.log(error?.message, 'Error data')
      toast.error(error?.message ?? 'Failed to logout')
    }
  }

  const collapsed = !mobile && isCollapsed

  return (
    <aside
      className={
        mobile
          ? 'relative h-screen w-72 border-r border-border bg-surface'
          : `relative h-screen shrink-0 border-r border-border bg-surface ${
              isCollapsed ? 'w-20' : 'w-64'
            } transition-all duration-500 ease-in-out`
      }
    >
      {/* Desktop collapse button */}
      {!mobile && (
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-5 top-6 z-50 size-10 cursor-pointer rounded-full border border-border bg-app text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:text-primary"
        >
          {isCollapsed ? <SidebarOpen size={18} /> : <SidebarClose size={18} />}
        </Button>
      )}

      <div className="flex h-full w-full flex-col">
        {/* Logo */}
        <div className="flex h-28 items-center justify-between px-4">
          <h1
            className={`flex items-center gap-3 text-2xl font-bold ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-app text-sm text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              KC
            </span>

            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                collapsed
                  ? 'w-0 -translate-x-2 opacity-0'
                  : 'w-28 translate-x-0 opacity-100'
              }`}
            >
              KCMart
            </span>
          </h1>

          {/* Mobile close button */}
          {mobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close sidebar"
              className="cursor-pointer"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Main navigation */}
        <nav className="w-full flex-1 px-3">
          {NavLisits.map((nav) => (
            <button
              type="button"
              onClick={() => handleUrl(nav.navValue)}
              key={nav.navValue}
              title={collapsed ? nav.navName : undefined}
              className="group mb-1 flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted transition-colors hover:bg-app hover:text-primary"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-inset/60 text-secondary transition-colors group-hover:border-border">
                {nav.navIcons}
              </span>

              <div
                className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                  collapsed ? 'max-w-0' : 'max-w-44'
                }`}
              >
                <p
                  className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                    collapsed
                      ? '-translate-x-2 opacity-0'
                      : 'translate-x-0 opacity-100'
                  }`}
                >
                  {nav.navName}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* User section */}
        {user && (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="relative w-full overflow-visible px-3 pb-5"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full cursor-pointer rounded-xl border border-border bg-app p-2 text-left text-secondary transition-colors hover:text-primary"
              >
                <div className="flex w-full items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-app">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </div>

                  <div
                    className={`${
                      collapsed ? 'w-0' : 'max-w-44'
                    } overflow-hidden transition-all duration-500 ease-in-out`}
                  >
                    <p
                      className={`truncate text-xs font-semibold transition-all duration-500 ease-in-out ${
                        collapsed
                          ? '-translate-x-2 opacity-0'
                          : 'translate-x-0 opacity-100'
                      }`}
                    >
                      {user.first_name} {user.last_name}
                    </p>

                    <p
                      className={`truncate text-[11px] text-muted transition-all duration-500 ease-in-out ${
                        collapsed
                          ? '-translate-x-2 opacity-0'
                          : 'translate-x-0 opacity-100'
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="absolute right-3 bottom-24 left-3 flex flex-col gap-1 rounded-xl border border-border bg-app p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
                {UserNavs.map((nav) => (
                  <Link
                    to={nav.link}
                    key={nav.link}
                    onClick={() => onClose?.()}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    title={collapsed ? nav.navName : undefined}
                  >
                    <span className="shrink-0">{nav.icon}</span>

                    <p
                      className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                      }`}
                    >
                      {nav.navName}
                    </p>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  type="button"
                  disabled={isPending}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  title={collapsed ? 'Logout' : undefined}
                >
                  <LogOut size={15} className="shrink-0" />

                  <p
                    className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
                      collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    }`}
                  >
                    {isPending ? 'Logging out...' : 'Logout'}
                  </p>
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </aside>
  )
}
