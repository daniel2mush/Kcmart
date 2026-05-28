import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProductTypes } from '#/lib/types/ProductTypes.ts'
import { toast } from 'sonner'

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {},
  })
}

export const useGetUserProducts = () => {
  return useQuery({
    queryKey: ['products', 'user'],
    queryFn: async () => {
      console.log('I was called, query ')
      const res = await fetch('/api/products/get_user_products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail)
      }
      return data
    },
  })
}

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['products', 'addProduct'],

    mutationFn: async (data: ProductTypes) => {
      console.log(data)
      const res = await fetch('/api/products/add_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const resData = await res.json()

      if (!res.ok) {
        throw new Error(resData?.detail || 'Failed to add product')
      }

      return resData
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      toast.success('Product added successfully.')
    },

    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ['products', 'updateProduct'],
    mutationFn: async () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })
}

export const useDeleteProduct = () => {
  return useMutation({
    mutationKey: ['products', 'deleteProduct'],
    mutationFn: async () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })
    },
  })
}
