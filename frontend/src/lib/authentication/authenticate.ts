import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const hasAuthCookies = createServerOnlyFn(() => {
  const refreshToken = getCookie('refresh_token')
  return Boolean(refreshToken)
})

export const getIsAuthenticated = createServerFn({
  method: 'GET',
}).handler(async () => {
  return hasAuthCookies()
})
