import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { deleteCookie, getRequestHeaders } from '@tanstack/react-start/server'
import axiosClient from '#/components/client/axiosClient.ts'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async () => {
        try {
          const headers = getRequestHeaders()
          const cookie = headers.get('cookie') || ''

          const res = await axiosClient.post(
            `auth/jwt/logout`,
            {},
            {
              headers: {
                Cookie: cookie,
              },
            },
          )

          const cookie_name = cookie.split('=')[0]
          deleteCookie(cookie_name)

          if (res.status === 204) {
            return new Response(null, {
              status: 204,
            })
          }

          // 2. Handle any other successful responses (200, 201)
          return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          if (isAxiosError(error)) {
            console.log(error.response?.data.detail)

            const axioserror = error.response?.data || {
              detail: 'Unknown backend error',
            }
            const statusCode = error.response?.status || 400

            return new Response(JSON.stringify(axioserror), {
              status: statusCode,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          return new Response(
            JSON.stringify({ detail: 'Error occurred, please try again' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
