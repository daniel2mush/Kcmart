import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import axiosClient from '#/components/client/axiosClient.ts'

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const data = await request.json()

          if (!data?.email || !data?.password) {
            return new Response(
              JSON.stringify({ detail: 'Email and password are required' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
          }

          const params = new URLSearchParams()
          params.set('username', data.email)
          params.set('password', data.password)

          const res = await axiosClient.post(`auth/jwt/login`, params, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
          })

          const headers = new Headers({
            'Content-Type': 'application/json',
          })

          const setCookie = res.headers['set-cookie']

          if (setCookie) {
            if (Array.isArray(setCookie)) {
              for (const cookie of setCookie) {
                headers.append('Set-Cookie', cookie)
              }
            } else {
              headers.append('Set-Cookie', setCookie)
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
            }),
            {
              status: 200,
              headers,
            },
          )
        } catch (error) {
          console.error('LOGIN ERROR:', error)

          if (isAxiosError(error)) {
            console.error('FASTAPI STATUS:', error.response?.status)
            console.error('FASTAPI DATA:', error.response?.data)

            return new Response(
              JSON.stringify(
                error.response?.data ?? {
                  detail: 'Login failed',
                },
              ),
              {
                status: error.response?.status ?? 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
          }

          return new Response(
            JSON.stringify({
              detail: 'Internal server error',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
    },
  },
})
