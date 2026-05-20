import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { axiosClient } from '../../../components/client/axiosClient'

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export const Route = createFileRoute('/api/auth/register')({
  server: {
    handlers: {
      POST: async ({ request: req }) => {
        const data = await req.json()

        if (!data || Object.keys(data as Record<string, unknown>).length === 0) {
          return jsonResponse({ detail: 'No data found, please try again' }, 400)
        }

        try {
          const res = await axiosClient.post(
            'user/register/',
            data,
            {
              skipAuth: true,
              skipAuthRefresh: true,
            },
          )

          return jsonResponse(res.data, res.status)
        } catch (error) {
          if (isAxiosError(error)) {
            return jsonResponse(
              error.response?.data || { detail: 'Unknown backend error' },
              error.response?.status || 400,
            )
          }

          return jsonResponse({ detail: 'Error occurred, please try again' }, 500)
        }
      },
    },
  },
})
