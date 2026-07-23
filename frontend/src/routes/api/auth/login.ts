import { createFileRoute } from '@tanstack/react-router'
import axios, { isAxiosError } from 'axios'

export const Route = createFileRoute('/api/auth/login')({
  server: {
    handlers: {
      POST: async ({ request: req }) => {
        const data = await req.json()
        if (!data) {
          return new Response(JSON.stringify({ detail: 'No credentials' }), {
            status: 400,
          })
        }

        const params = new URLSearchParams()
        params.append('username', data.email)
        params.append('password', data.password)

        try {
          const res = await axios.post(
            `${process.env.VITE_PUBLIC_API}auth/jwt/login`,
            params,
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
          )

          // Grab the raw cookie string from FastAPI
          const setCookieHeader = res.headers['set-cookie']

          // Use standard Web Headers to proxy it perfectly
          const headers = new Headers({ 'Content-Type': 'application/json' })

          if (setCookieHeader) {
            // Axios can return an array of cookies or a single string
            if (Array.isArray(setCookieHeader)) {
              setCookieHeader.forEach((c) => headers.append('Set-Cookie', c))
            } else {
              headers.append('Set-Cookie', setCookieHeader)
            }
          }

          // Return success! The browser will read the Set-Cookie header automatically.
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers,
          })
        } catch (error) {
          if (isAxiosError(error)) {
            return new Response(
              JSON.stringify(
                error.response?.data || { detail: 'Login failed' },
              ),
              {
                status: error.response?.status || 401,
              },
            )
          }
          return new Response(JSON.stringify({ detail: 'Error' }), {
            status: 500,
          })
        }
      },
    },
  },
})
