import { createFileRoute } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { deleteCookie, getCookie } from '@tanstack/react-start/server'
import { axiosClient } from '../../../components/client/axiosClient'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async () => {
        try {
          const accessToken = getCookie('access_token')

          const res = await axiosClient.post(
            'user/logout/',
            {},
            {
              skipAuthRefresh: true,
              withCredentials: true,
              headers: accessToken
                ? {
                    Authorization: `Bearer ${accessToken}`,
                  }
                : undefined,
            },
          )

          deleteCookie('refresh_token')
          deleteCookie('access_token')

          return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          deleteCookie('refresh_token')
          deleteCookie('access_token')

          if (isAxiosError(error)) {
            console.log(error.response?.data.detail)

            const axioserror = error.response?.data || {
              detail: 'Unknown backend error',
            }
            const statusCode = error.response?.status || 400

            return new Response(JSON.stringify(axioserror), {
              status: statusCode,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          return new Response(
            JSON.stringify({ detail: 'Error occurred, please try again' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
