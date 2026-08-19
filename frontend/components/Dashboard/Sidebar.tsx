'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {useUserStore} from "@/lib/store";

interface NavItem {
  navName: string
  navValue: string
  navIcons: React.ReactNode
}

const navItems: NavItem[] = [
  { navName: 'All', navValue: 'all', navIcons: <Home size={18} /> },
  { navName: 'Templates', navValue: 'templates', navIcons: <LayoutTemplate size={18} /> },
  { navName: 'Mockups', navValue: 'mockups', navIcons: <Image size={18} /> },
  { navName: 'Graphics', navValue: 'graphics', navIcons: <Palette size={18} /> },
  { navName: 'Icons', navValue: 'icons', navIcons: <Sparkles size={18} /> },
  { navName: 'Fonts', navValue: 'fonts', navIcons: <FileType size={18} /> },
  { navName: '3D Models', navValue: 'models', navIcons: <Cuboid size={18} /> },
  { navName: 'Magazines', navValue: 'magazines', navIcons: <Newspaper size={18} /> },
]

interface UserNavItem {
  navName: string
  link: string
  icon: React.ReactNode
}

const userNavItems: UserNavItem[] = [
  { navName: 'Profile', link: '/dashboard/profile', icon: <User size={16} /> },
  { navName: 'Settings', link: '/dashboard/settings', icon: <Settings size={16} /> },
  { navName: 'Folders', link: '/dashboard/folders', icon: <Folder size={16} /> },
  { navName: 'My Products', link: '/dashboard/products', icon: <PackageCheck size={16} /> },
  { navName: 'Purchase History', link: '/dashboard/purchase_history', icon: <ReceiptText size={16} /> },
]

interface SidebarUser {
  first_name: string
  last_name: string
  email: string
}

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
  user: SidebarUser
}

export default function Sidebar({ mobile = false, onClose, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setUser = useUserStore((state) => state.setUser)
  
  const currentCategory = searchParams.get('category') || 'all'
  const collapsed = !mobile && isCollapsed

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/jwt/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (res.ok) {
        toast.success('Logged out successfully')
        setUser(null)
        router.push('/')

        router.refresh()

      } else {
        toast.error('Failed to logout')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <aside
      className={cn(
        'relative h-screen shrink-0 border-r border-border bg-surface transition-all duration-300 ease-in-out',
        mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Desktop collapse toggle */}
      {!mobile && (
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="icon"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-4 top-7 z-50 size-8 cursor-pointer rounded-full border border-border bg-surface text-secondary shadow-md hover:text-primary"
        >
          {isCollapsed ? <SidebarOpen size={16} /> : <SidebarClose size={16} />}
        </Button>
      )}

      <div className="flex h-full w-full flex-col">
        {/* Logo & Mobile Close */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-app text-sm font-bold text-primary">
              KC
            </span>
            <span
              className={cn(
                'text-lg font-bold text-primary overflow-hidden whitespace-nowrap transition-all duration-300',
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              )}
            >
              KCMart
            </span>
          </Link>

          {mobile && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close sidebar">
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((nav) => {
            const isActive = currentCategory === nav.navValue && pathname === '/dashboard'
            return (
              <Link
                key={nav.navValue}
                href={`/dashboard?category=${nav.navValue}`}
                onClick={() => mobile && onClose?.()}
                title={collapsed ? nav.navName : undefined}
                className={cn(
                  'group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-secondary hover:bg-app hover:text-primary border border-transparent'
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md text-secondary group-hover:text-primary transition-colors">
                  {nav.navIcons}
                </span>
                <span
                  className={cn(
                    'overflow-hidden whitespace-nowrap transition-all duration-300',
                    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  )}
                >
                  {nav.navName}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section (Replaced Collapsible with DropdownMenu for better UX) */}
        {user && (
          <div className="border-t border-border/50 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center gap-3 rounded-xl border border-border bg-app p-2 text-left transition-colors hover:bg-hover focus:outline-none focus:ring-2 focus:ring-primary/20">

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase text-primary-foreground">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  
                  <div className={cn(
                    'flex-1 overflow-hidden transition-all duration-300',
                    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  )}>
                    <p className="truncate text-sm font-semibold text-primary">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="truncate text-[11px] text-secondary">
                      {user.email}
                    </p>
                  </div>

                  {!collapsed && (
                    <ChevronUp size={16} className="shrink-0 text-secondary transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  )}
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                side="top" 
                align="start" 
                className={cn("w-56", collapsed ? "ml-2" : "w-[var(--radix-dropdown-menu-trigger-width)]")}
              >
                <DropdownMenuGroup>
                  {userNavItems.map((nav) => (
                    <DropdownMenuItem key={nav.link} >
                      <Link href={nav.link} onClick={() => mobile && onClose?.()} className="flex items-center gap-3 cursor-pointer">
                        {nav.icon}
                        <span>{nav.navName}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </aside>
  )
}