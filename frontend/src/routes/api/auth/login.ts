import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { setCookie } from '@tanstack/react-start/server'
import { axiosClient } from '../../../components/client/axiosClient'

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const getRefreshTokenFromHeader = (setCookieHeader?: string | string[]) => {
  if (!setCookieHeader) return undefined

  const refreshCookie = setCookieHeader
    .toString()
    .split(',')
    .find((cookie) => cookie.trim().startsWith('refresh_token='))

  return refreshCookie?.split(';')[0].split('=')[1]
}

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request: req }) => {
        const data = await req.json()

        if (!data) {
          return jsonResponse({ detail: 'No credentials provided' }, 400)
        }

        try {
          const res = await axiosClient.post('user/login/', data, {
            skipAuth: true,
            skipAuthRefresh: true,
          })

          const payload = res.data

          setCookie('access_token', payload.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          })

          const refreshToken = getRefreshTokenFromHeader(
            res.headers['set-cookie'],
          )

          if (refreshToken) {
            setCookie('refresh_token', refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            })
          }

          return jsonResponse(payload, 200)
        } catch (error) {
          console.error('Login Error in API Proxy:', error)

          if (isAxiosError(error)) {
            return jsonResponse(
              error.response?.data || { detail: 'Login failed' },
              error.response?.status || 500,
            )
          }

          return jsonResponse({ detail: 'Internal server error' }, 500)
        }
      },
    },
  },
})
