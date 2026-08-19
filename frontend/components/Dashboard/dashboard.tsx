'use client'
import { useState } from 'react'
import DashboardContent from '@/components/Dashboard/DashboardContent'
import Sidebar from '@/components/Dashboard/Sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Dashboard = ({user}:{user:User}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-app">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 lg:block">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar user={user} mobile onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Mobile header */}
        <div className="flex h-16 items-center border-b border-border px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(true)}
            className="cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </Button>

          <h1 className="ml-3 text-lg font-bold text-secondary">KCMart</h1>
        </div>
        <div className={'max-h-screen overflow-y-scroll'}>
          <DashboardContent />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
