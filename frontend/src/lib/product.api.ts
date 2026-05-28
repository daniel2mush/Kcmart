// import type { ProductTypes } from '#/lib/types/ProductTypes.ts'
// import axiosClient from '#/components/client/axiosClient.ts'
// import { getCookie } from '@tanstack/react-start/server'
// import { isAxiosError } from 'axios'
//
// const access_token = getCookie('access_token')
//
// const jsonResponse = (body: unknown, status: number) =>
//   new Response(JSON.stringify(body), {
//     status,
//     headers: { 'Content-Type': 'application/json' },
//   })
//
// export const productApi = {
//   create: async (data: any) => {
//     try {
//       const res = await axiosClient.post('/product/create/', data, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${access_token}`,
//         },
//       })
//
//       return jsonResponse(res.data, 200)
//     } catch (error: any) {
//       if (error.response && error.response.status === 401) {
//         throw error.response.data
//       }
//       if (isAxiosError(error)) {
//         throw error.response?.data?.detail
//       }
//     }
//   },
//   update: async (product_id: string, data: ProductTypes) => {
//     product_id
//     data
//   },
//   delete: async (product_id: string) => {
//     product_id
//   },
//   getAll: async () => {},
//   getUserProducts: async () => {},
// }
