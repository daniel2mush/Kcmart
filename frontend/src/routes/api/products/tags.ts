import { createFileRoute } from '@tanstack/react-router'
import AxiosClient from '#/components/client/axiosClient.ts'
import { jsonResponse } from '#/lib/productResponse.ts'
import { AxiosError, isAxiosError } from 'axios'

export const Route = createFileRoute('/api/products/tags')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await AxiosClient.get('/product/tags', {
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
