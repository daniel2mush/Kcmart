import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CategoryTypes,
  GetProductsParams,
  ProductResponseTypes,
  ProductTypes,
} from '#/lib/types/ProductTypes.ts'
import { toast } from 'sonner'

export const useGetAllProducts = ({
  page = 1,
  limit = 10,
}: GetProductsParams = {}) => {
  return useQuery({
    // 1. Include params in queryKey so React Query refetches when page/limit changes
    queryKey: ['products', 'user', { page, limit }],

    // 2. Query function receives parameters
    queryFn: async () => {
      // Build search params dynamically
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const res = await fetch(
        `/api/products/get_all_published_products?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail)
      }

      return data as ProductResponseTypes[]
    },
  })
}

export const useGetUserProducts = ({
  page = 1,
  limit = 10,
}: GetProductsParams = {}) => {
  return useQuery({
    // 1. Include params in queryKey so React Query refetches when page/limit changes
    queryKey: ['products', 'user', { page, limit }],

    // 2. Query function receives parameters
    queryFn: async () => {
      // Build search params dynamically
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const res = await fetch(
        `/api/products/get_user_products?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail)
      }

      return data as ProductResponseTypes[]
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
  const queryClient = useQueryClient()

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
  const queryClient = useQueryClient()

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

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/products/categories', {
        method: 'GET',
      })
      const resData = await res.json()
      if (!res.ok) {
        throw new Error(resData?.detail || 'Failed to get categories')
      }
      return resData as CategoryTypes[]
    },
  })
}

export const useGetTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await fetch('/api/products/tags', {
        method: 'GET',
      })
      const resData = await res.json()
      if (!res.ok) {
        throw new Error(resData?.detail || 'Failed to get product tags')
      }
      return resData as CategoryTypes[]
    },
  })
}
