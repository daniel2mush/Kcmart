import { createFileRoute } from '@tanstack/react-router'
import AxiosClient from '#/components/client/axiosClient.ts'
import { AxiosError, isAxiosError } from 'axios'
import { jsonResponse } from '#/lib/productResponse'

export const Route = createFileRoute('/api/products/categories')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await AxiosClient.get('/product/categories', {
            withCredentials: true,
          })

          return jsonResponse(res.data, 200)
        } catch (e) {
          if (isAxiosError(e)) {
            throw new AxiosError(e.response?.data)
          }
          throw e
        }
      },
    },
  },
})
