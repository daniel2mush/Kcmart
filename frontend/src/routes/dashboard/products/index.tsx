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
import { useState } from 'react'
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
  ProductFormTypes,
  ProductResponseTypes,
  ProductTypes,
} from '#/lib/types/ProductTypes.ts'
import { ProductSchema } from '#/lib/types/ProductTypes.ts'
import { supabase } from '#/lib/supabase.ts'
import {
  useAddProduct,
  useGetCategories,
  useGetTags,
} from '#/components/queries/products/ProductQuery.ts'
import AdminCard from '#/components/Dashboard/AdminCard.tsx'
import { useQuery } from '@apollo/client/react'
import { GET_USER_PRODUCTS } from '#/lib/query/product.ts'

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync } = useAddProduct()
  const { data: categoryData } = useGetCategories()
  const { data: tagsData } = useGetTags()
  const { data, loading } = useQuery(GET_USER_PRODUCTS, {
    variables: {
      limit: 10,
      page: 1,
    },
  })

  const queryData = data as { user_products: ProductResponseTypes[] }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormTypes>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price_cents: '',
      tags: [],
      included: [],
      categories: [],
      images: [],
    },
  })

  // Register hidden/custom managed fields with react-hook-form
  register('included')
  register('images')
  register('asset_url')

  // Watch current values to control checkbox states
  const selectedTags = watch('tags')
  const selectedCategories = watch('categories')

  /**
   * Upload files to Supabase bucket
   */
  async function handleUploads(
    files: File[] | File | null | undefined,
    folder: 'images' | 'assets',
  ): Promise<string[]> {
    // 1. Normalize input to a single array type
    const fileArray = Array.isArray(files) ? files : files ? [files] : []

    // 2. Return early if empty
    if (fileArray.length === 0) return []

    // 3. Process all files safely
    return await Promise.all(
      fileArray.map(async (file) => {
        const filePath = `${folder}/${crypto.randomUUID()}-${file.name}`
        const { error } = await supabase.storage
          .from('KCMart')
          .upload(filePath, file)

        if (error) throw error

        const {
          data: { publicUrl },
        } = supabase.storage.from('KCMart').getPublicUrl(filePath)

        return publicUrl
      }),
    )
  }

  /**
   * Toggle a tag ID in the selected tags array
   */
  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]
    setValue('tags', updated, { shouldValidate: true })
  }

  /**
   * Toggle a category ID in the selected categories array
   */
  const toggleCategory = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    setValue('categories', updated, { shouldValidate: true })
  }

  async function onSubmit(validData: ProductFormTypes) {
    try {
      // Upload images and assets
      const imageUrls = await handleUploads(validData.images, 'images')
      const assetUrls = await handleUploads(validData.asset_url, 'assets')

      // Convert price from dollar string to cents integer
      const priceCents = Math.round(parseFloat(validData.price_cents) * 100)

      const product: ProductTypes = {
        name: validData.name,
        description: validData.description,
        price_cent: priceCents,
        tag_ids: validData.tags,
        categories_ids: validData.categories,
        included: validData.included,
        images: imageUrls,
        asset_url: assetUrls[0],
      }

      await mutateAsync(product)
      setIsOpen(false)
      reset()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div>
      <DashboardHeader />
      <div className={'p-10'}>
        {loading && (
          <div
            className={
              'spinner-border mt-50 w-full flex justify-center items-center'
            }
          >
            <Loader />
          </div>
        )}
        {!loading && !data ? (
          <div>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                  <FileQuestion />
                </EmptyMedia>
                <EmptyTitle>No data</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any product yet. Get started by
                  creating your first product.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  className={'text-black cursor-pointer'}
                  onClick={() => setIsOpen(true)}
                >
                  Add product
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className={'w-full'}>
            {!loading && queryData.user_products.length > 0 && (
              <AdminCard
                iterable={queryData.user_products}
                title={'My products'}
              />
            )}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className={'fixed bottom-20 right-10'}>
            <Button
              variant={'ghost'}
              className={
                'bg-secondary text-bg border border-border rounded-full h-20 w-20 cursor-pointer hover:bg-secondary/80'
              }
            >
              <Plus size={40} className={'text-black font-bold size-1/2'} />
            </Button>
          </DialogTrigger>

          <DialogContent className={'max-h-[90vh] overflow-y-auto'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Add new product</DialogTitle>
                <DialogDescription />
              </DialogHeader>

              <FieldGroup className={'space-y-4 py-4'}>
                {/* NAME */}
                <Field>
                  <Label htmlFor={'name'}>Name</Label>
                  <Input
                    id={'name'}
                    placeholder={'Enter product name'}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                {/* PRICE */}
                <Field>
                  <Label htmlFor={'price_cents'}>Price (USD)</Label>
                  <Input
                    id={'price_cents'}
                    placeholder={'20.00'}
                    {...register('price_cents')}
                  />
                  {errors.price_cents && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.price_cents.message}
                    </p>
                  )}
                </Field>

                {/* DESCRIPTION */}
                <Field>
                  <Label htmlFor={'description'}>Description</Label>
                  <Textarea
                    id={'description'}
                    placeholder={'Enter product description'}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.description.message}
                    </p>
                  )}
                </Field>

                {/* CATEGORIES */}
                <Field>
                  <Label>Categories</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                    {categoryData?.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center space-x-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedCategories.includes(cat.id)}
                          onCheckedChange={() => toggleCategory(cat.id)}
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.categories && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.categories.message}
                    </p>
                  )}
                </Field>

                {/* TAGS */}
                <Field>
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                    {tagsData?.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center space-x-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleTag(tag.id)}
                        />
                        <span>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.tags.message}
                    </p>
                  )}
                </Field>

                {/* INCLUDES */}
                <Field>
                  <Label htmlFor={'includes'}>Includes</Label>
                  <Textarea
                    id={'includes'}
                    placeholder={
                      'One item per line\nExample:\nFigma file\nDocumentation'
                    }
                    onChange={(e) => {
                      const includes = e.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)
                      setValue('included', includes, { shouldValidate: true })
                    }}
                  />
                  {errors.included && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.included.message}
                    </p>
                  )}
                </Field>

                {/* IMAGES */}
                <Field>
                  <Label htmlFor={'images'}>Product Images</Label>
                  <Input
                    id={'images'}
                    type={'file'}
                    multiple
                    accept={'image/*'}
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])
                      setValue('images', files, { shouldValidate: true })
                    }}
                  />
                  {errors.images && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.images.message as string}
                    </p>
                  )}
                </Field>

                {/* ASSETS */}
                <Field>
                  <Label htmlFor={'asset_url'}>Product Asset</Label>
                  <Input
                    id={'asset_url'}
                    type={'file'}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setValue('asset_url', file, { shouldValidate: true })
                      } else {
                        // Reset or clear field state if user cancelled
                        setValue('asset_url', undefined as unknown as File, {
                          shouldValidate: true,
                        })
                      }
                    }}
                  />
                  {errors.asset_url && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.asset_url.message as string}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter className={'mt-6'}>
                <DialogClose asChild>
                  <Button variant={'outline'}>Cancel</Button>
                </DialogClose>

                <Button
                  type={'submit'}
                  disabled={isSubmitting}
                  className={'text-black'}
                >
                  {isSubmitting ? 'Adding...' : 'Add product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
