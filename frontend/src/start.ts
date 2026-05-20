import { createStart, createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { hasAuthCookies } from './lib/authentication/authenticate'

const authMiddleware = createMiddleware().server(async ({ pathname, next }) => {
  const isAuthenticated = hasAuthCookies()

  // .startsWith() cleanly handles both '/dashboard' and nested routes like '/dashboard/settings'
  const isDashboardRoute = pathname.startsWith('/dashboard')

  const isAuthRoute =
    pathname.startsWith('/signin') || pathname.startsWith('/register')

  // Keep signed-in users out of auth pages.
  if (isAuthenticated && isAuthRoute) {
    throw redirect({ to: '/dashboard' })
  }

  // Keep signed-out users out of protected dashboard pages.
  if (!isAuthenticated && isDashboardRoute) {
    throw redirect({ to: '/signin' })
  }

  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [authMiddleware],
}))
