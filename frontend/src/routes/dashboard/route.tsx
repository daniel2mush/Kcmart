import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getIsAuthenticated } from '#/lib/helpers/authentication/authenticate.ts'

export const Route = createFileRoute('/dashboard')({
  component: Outlet,
  beforeLoad: async () => {
    const user = await getIsAuthenticated()
    if (!user) throw redirect({ to: '/signin' })
  },
})
