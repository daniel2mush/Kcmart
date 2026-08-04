import { createFileRoute } from '@tanstack/react-router'
import axiosClient from '#/components/client/axiosClient.ts'
import { jsonResponse } from '#/lib/json_response_helper.ts'
import { isAxiosError } from 'axios'

export const Route = createFileRoute(
  '/api/products/get_all_published_products',
)({
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
          const req = await axiosClient.get('product/all', {
            params: { limit, page },
            withCredentials: true,
          })

          return jsonResponse(req.data, 200)
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
