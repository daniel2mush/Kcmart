import {
  type ProductResponseTypes,
  ProductSchema,
} from '#/lib/types/ProductTypes'
import type {
  CategoryTypes,
  TagsTypes,
  ProductFormTypes,
} from '#/lib/types/ProductTypes'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Field, FieldGroup } from '../ui/field'
import { Label } from '#/components/ui/label.tsx'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '#/components/ui/input.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
import { Button } from '../ui/button'
import {
  CREATE_PRODUCT,
  GET_PRODUCT_WITH_SLUG,
  GET_USER_PRODUCTS,
  UPDATE_PRODUCT,
} from '#/lib/query/product.ts'
import { toast } from 'sonner'
import { handleUploads } from '#/lib/helpers/productHelper.ts'
import { useMutation, useQuery } from '@apollo/client/react'
import { GET_CATEGORIES } from '#/lib/query/category.ts'
import { GET_TAGS } from '#/lib/query/tag.ts'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import { useEffect, useState } from 'react'

interface ProductFormProps {
  setOpenDialogue: (value: boolean) => void
  productSlug?: string
}

export function ProductForm({
  setOpenDialogue,
  productSlug,
}: ProductFormProps) {
  const { data: categories_res, loading: category_loading } =
    useQuery(GET_CATEGORIES)
  const { data: tags_res, loading: tags_loading } = useQuery(GET_TAGS)
  const [create_product] = useMutation(CREATE_PRODUCT)
  const { data: product_data, loading: product_slug_loading } = useQuery(
    GET_PRODUCT_WITH_SLUG,
    {
      variables: {
        slug: productSlug,
      },
      skip: !productSlug,
    },
  )

  const isEditMode = productSlug != null

  const categoryData = categories_res as { categories: CategoryTypes[] }
  const tagsData = tags_res as { tags: TagsTypes[] }

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

  register('included')
  register('images')
  register('asset_url')

  const selectedTags = watch('tags')
  const selectedCategories = watch('categories')

  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]
    setValue('tags', updated, { shouldValidate: true })
  }
  const toggleCategory = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]
    setValue('categories', updated, { shouldValidate: true })
  }

  async function onSubmit(validData: ProductFormTypes) {
    const priceCents = Math.round(parseFloat(validData.price_cents) * 100)

    console.log('I was called')

    try {
      const imageUrls = await handleUploads(validData.images, 'images')
      const assetUrls = await handleUploads(validData.asset_url, 'assets')

      console.log('images', imageUrls)
      console.log('assets', assetUrls)

      const variables = {
        name: validData.name,
        description: validData.description,
        priceCent: Number(priceCents),
        included: validData.included,
        categoriesIds: validData.categories,
        tagIds: validData.tags,
        images: imageUrls,
        assetUrl: assetUrls[0],
      }

      await create_product({
        variables,
        refetchQueries: [
          {
            query: GET_USER_PRODUCTS,
            variables: {
              page: 1,
              limit: 10,
            },
          },
        ],
      })

      toast.success('Product Added')
      setOpenDialogue(false)
      reset()
    } catch (error) {
      console.error('Error adding product:', error)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error(error?.message)
      setOpenDialogue(false)
    }
  }

  useEffect(() => {
    if (isEditMode && !product_slug_loading) {
      console.log(product_data, 'Product data')

      const { productWithSlug: product } = product_data as {
        productWithSlug: ProductResponseTypes
      }

      reset({
        name: product.name,
        description: product.description,
        price_cents: String(product.priceCent / 100),
        included: product.included ?? [],
        categories: product.categories.map((c) => c.id),
        tags: product.tags.map((t) => t.id),
        images: [],
        asset_url: undefined,
      })
    }
  }, [product_slug_loading, isEditMode])

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, (form_errors) => {
          console.log('FORM ERRORS:', form_errors)
        })}
      >
        <DialogHeader>
          <DialogTitle>
            {/* { isEditMode ? 'Update product' : 'Add product'}*/}
            Add product
          </DialogTitle>
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
              {!category_loading &&
                categoryData.categories.map((cat) => (
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
              {!tags_loading &&
                tagsData.tags.map((tag) => (
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
              value={watch('included')}
              placeholder={
                'One item per line\nExample:\nFigma file\nDocumentation'
              }
              onChange={(e) => {
                const includes = e.target.value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean)
                setValue('included', includes, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
            {errors.included && (
              <p className={'text-sm text-red-500 mt-1'}>
                {errors.included.message}
              </p>
            )}
          </Field>

          {!isEditMode && (
            <>
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
                    setValue('images', files, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
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
                      setValue('asset_url', file, {
                        shouldValidate: true,
                      })
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
            </>
          )}
        </FieldGroup>

        <DialogFooter className={'mt-6'}>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                // setProductSlug(null)
                // setIsEditMode(false)
                // reset()
              }}
            >
              Cancel
            </Button>
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
    </>
  )
}
