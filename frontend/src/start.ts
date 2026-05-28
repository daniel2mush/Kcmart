import {
  createStart,
  createMiddleware,
  createCsrfMiddleware,
} from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { hasAuthCookies } from './lib/authentication/authenticate'

const authMiddleware = createMiddleware().server(async ({ request, next }) => {
  const isAuthenticated = hasAuthCookies()

  const url = new URL(request.url)
  const pathname = url.pathname


  const isDashboardRoute =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/')

  const isAuthRoute =
    pathname.startsWith('/signin') || pathname.startsWith('/register')

  if (isAuthenticated && isAuthRoute) {
    throw redirect({ to: '/dashboard' })
  }

  if (!isAuthenticated && isDashboardRoute) {
    throw redirect({ to: '/signin' })
  }

  return next()
})

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})
export const startInstance = createStart(() => ({
  requestMiddleware: [authMiddleware, csrfMiddleware],
}))
