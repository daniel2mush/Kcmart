import { createFileRoute } from '@tanstack/react-router'
import DashboardHeader from '#/components/Dashboard/DashboardHeader.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import { useEffect, useState } from 'react'
import { FileQuestion, Loader, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Field, FieldGroup } from '#/components/ui/field.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Input } from '#/components/ui/input.tsx'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Textarea } from '#/components/ui/textarea.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import type {
  CategoryTypes,
  ProductFormTypes,
  ProductResponseTypes,
  TagsTypes,
} from '#/lib/types/ProductTypes.ts'
import { ProductSchema } from '#/lib/types/ProductTypes.ts'

import AdminCard from '#/components/Dashboard/AdminCard.tsx'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  CREATE_PRODUCT,
  GET_PRODUCT_WITH_SLUG,
  GET_USER_PRODUCTS,
  UPDATE_PRODUCT,
} from '#/lib/query/product.ts'
import { GET_CATEGORIES } from '#/lib/query/category.ts'
import { GET_TAGS } from '#/lib/query/tag.ts'
import { handleUploads } from '#/lib/helpers/productHelper.ts'
import { toast } from 'sonner'
import { AdminProduct } from '#/components/Dashboard/Product.tsx'

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [productSlug, setProductSlug] = useState<string | null>(null)

  const [update_product] = useMutation(UPDATE_PRODUCT)

  const [isEditMode, setIsEditMode] = useState(false)

  // Register hidden/custom managed fields with react-hook-form

  // Watch current values to control checkbox states

  /**
   * Upload files to Supabase bucket
   */

  /**
   * Toggle a category ID in the selected categories array
   */

  // useEffect(() => {
  //   if (!product_data?.productWithSlug) return
  //
  //   const product = product_data.productWithSlug
  //
  //   reset({
  //     name: product.name,
  //     description: product.description,
  //     price_cents: String(product.priceCent / 100),
  //     included: product.included ?? [],
  //     categories: product.categories.map((c) => c.id),
  //     tags: product.tags.map((t) => t.id),
  //     images: [],
  //     asset_url: undefined,
  //   })
  //
  //   setIsEditMode(true)
  // }, [product_data, reset])

  // const openCreateDialog = () => {
  //   setIsEditMode(false)
  //   setProductSlug(null)
  //
  //   reset({
  //     name: '',
  //     description: '',
  //     price_cents: '',
  //     included: [],
  //     categories: [],
  //     tags: [],
  //     images: [],
  //     asset_url: undefined,
  //   })
  //
  //   setIsOpen(true)
  // }

  return (
    <div>
      <AdminProduct />
    </div>
  )
}
