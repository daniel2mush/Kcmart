import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import axiosClient from '#/components/client/axiosClient.ts'

export const Route = createFileRoute('/api/products/get_user_products')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // 1. Parse the incoming request URL
        const url = new URL(request.url)

        // 2. Read query params (with sensible defaults)
        const page = url.searchParams.get('page') ?? '1'
        const limit = url.searchParams.get('limit') ?? '10'

        console.log(limit)

        try {
          // 3. Pass the dynamic params to your backend request
          const res = await axiosClient.get(`product/user/all`, {
            params: { page, limit },
            withCredentials: true,
          })

          return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (e) {
          if (isAxiosError(e)) {
            return new Response(JSON.stringify({ error: e.response?.data }), {
              status: e.response?.status ?? 500,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          return new Response(
            JSON.stringify({
              error: e instanceof Error ? e.message : 'Unknown error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
