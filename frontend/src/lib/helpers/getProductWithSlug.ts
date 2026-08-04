// src/lib/authentication/authenticate.ts
import { createServerFn } from '@tanstack/react-start'
// Import directly from TanStack's server utilities:
import { getRequestHeaders } from '@tanstack/react-start/server'
import axiosClient from '#/components/client/axiosClient.ts'

export const getProductWithSlug = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      // Grab the headers from the incoming browser request
      const headers = getRequestHeaders()
      const cookie = headers.get('cookie') || ''

      if (!cookie) return null

      const res = await axiosClient.get(`product/${data.slug}`, {
        headers: { Cookie: cookie },
      })

      return res.data
    } catch (error) {
      return null
    }
  })
