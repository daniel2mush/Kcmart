import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboard from '#/components/Dashboard/dashboard.tsx'
import { getIsAuthenticated } from '#/lib/authentication/authenticate.ts'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getIsAuthenticated()
    if (!user) throw redirect({ to: '/signin' })
  },
})
function RouteComponent() {
  return (
    <div>
      <Dashboard />
    </div>
  )
}
