import { createFileRoute } from '@tanstack/react-router'
import { AxiosError, isAxiosError } from 'axios'
import { jsonResponse } from '#/lib/json_response_helper.ts'
import axiosClient from '#/components/client/axiosClient.ts'

export const Route = createFileRoute('/api/products/categories')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await axiosClient.get(`category/all`, {
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
