import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'

export const Route = createFileRoute('/api/graphql')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Get the GraphQL request body
          const body = await request.text()

          // Get authentication cookie from browser
          const cookie = request.headers.get('cookie') ?? ''

          // Forward request to FastAPI
          const response = await axios.post(
            `${process.env.VITE_PUBLIC_API}graphql`,
            body,
            {
              headers: {
                'Content-Type':
                  request.headers.get('content-type') ?? 'application/json',

                Cookie: cookie,
              },
            },
          )

          return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          console.error('GRAPHQL PROXY ERROR:', error)

          if (axios.isAxiosError(error)) {
            console.error('FastAPI status:', error.response?.status)
            console.error('FastAPI response:', error.response?.data)

            return new Response(
              JSON.stringify(
                error.response?.data ?? {
                  errors: [
                    {
                      message: 'GraphQL request failed',
                    },
                  ],
                },
              ),
              {
                status: error.response?.status ?? 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
          }

          return new Response(
            JSON.stringify({
              errors: [
                {
                  message: 'GraphQL proxy failed',
                },
              ],
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      },
    },
  },
})
