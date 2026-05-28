import { createFileRoute } from '@tanstack/react-router'
import axiosClient from '#/components/client/axiosClient.ts'
import { isAxiosError } from 'axios'
import { getCookie } from '@tanstack/react-start/server'

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const Route = createFileRoute('/api/products/add_product')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const access_token = getCookie('access_token')

          if (!access_token) {
            return jsonResponse({ detail: 'Unauthorized' }, 401)
          }

          const data = await request.json()

          if (!data) {
            return jsonResponse({ detail: 'No data provided' }, 400)
          }

          const res = await axiosClient.post('/product/create/', data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          })

          return jsonResponse(res.data, 200)
        } catch (error) {
          if (isAxiosError(error)) {
            console.log(error.response?.data)

            return jsonResponse(
              error.response?.data || {
                detail: 'Request failed',
              },
              error.response?.status || 500,
            )
          }

          console.log(error)

          return jsonResponse({ detail: 'Internal server error' }, 500)
        }
      },
    },
  },
})
