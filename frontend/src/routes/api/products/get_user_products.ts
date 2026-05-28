import { createFileRoute } from '@tanstack/react-router'

import axiosClient from '#/components/client/axiosClient.ts'

export const Route = createFileRoute('/api/products/get_user_products')({
  server: {
    handlers: {
      GET: async ({ request: req }) => {
        console.log('I was called')
        try {
          const res = await axiosClient.get('products/user/', {
            withCredentials: true,
          })

          return new Response(JSON.stringify(res.data), { status: 200 })
        } catch (e) {
          if (e) {
            throw new Error('Error', e)
          }

          if (isAxiosError(e)) {
            throw new Error('Error', e.response?.data)
          }
        }
      },
    },
  },
})
