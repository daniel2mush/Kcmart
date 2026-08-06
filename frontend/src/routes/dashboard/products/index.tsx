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

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [productSlug, setProductSlug] = useState<string | null>(null)

  const { data: product_data, loading: product_slug_loading } = useQuery(
    GET_PRODUCT_WITH_SLUG,
    {
      variables: {
        slug: productSlug,
      },
      skip: !productSlug,
    },
  )

  const { data: categories_res, loading: category_loading } =
    useQuery(GET_CATEGORIES)
  const { data: tags_res, loading: tags_loading } = useQuery(GET_TAGS)
  const [create_product] = useMutation(CREATE_PRODUCT)
  const [update_product] = useMutation(UPDATE_PRODUCT)

  const { data, loading } = useQuery(GET_USER_PRODUCTS, {
    variables: {
      limit: 10,
      page: 1,
    },
  })

  const productData = data as { userProduct: ProductResponseTypes[] }

  const categoryData = categories_res as { categories: CategoryTypes[] }
  const tagsData = tags_res as { tags: TagsTypes[] }

  const [isEditMode, setIsEditMode] = useState(false)

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

  /**
   * Toggle a category ID in the selected categories array
   */

  async function onSubmit(validData: ProductFormTypes) {
    console.log('I was clicked')
    try {
      const priceCents = Math.round(parseFloat(validData.price_cents) * 100)

      if (isEditMode) {
        const variables = {
          name: validData.name,
          description: validData.description,
          priceCent: Number(priceCents),
          included: validData.included,
          categoriesIds: validData.categories,
          tagIds: validData.tags,
          slug: productSlug,
        }
        update_product({
          variables: variables,
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
          .then(({ data: pr, error: prError }) => {
            if (pr) {
              toast.success('Product Added')
            }

            if (prError) {
              toast.error(prError.message)
            }
          })
          .catch(({ error }) => toast.error(error))
        setIsOpen(false)
        reset()
        return
      }
      // Upload images and assets
      const imageUrls = await handleUploads(validData.images, 'images')
      const assetUrls = await handleUploads(validData.asset_url, 'assets')

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

      create_product({
        variables: variables,
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
        .then(({ data: pr, error: prError }) => {
          if (pr) {
            toast.success('Product Added')
          }

          if (prError) {
            toast.error(prError.message)
          }
        })
        .catch(({ error }) => toast.error(error))
      setIsOpen(false)
      reset()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  useEffect(() => {
    if (!product_data?.productWithSlug) return

    const product = product_data.productWithSlug

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

    setIsEditMode(true)
  }, [product_data, reset])

  const openCreateDialog = () => {
    setIsEditMode(false)
    setProductSlug(null)

    reset({
      name: '',
      description: '',
      price_cents: '',
      included: [],
      categories: [],
      tags: [],
      images: [],
      asset_url: undefined,
    })

    setIsOpen(true)
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
        {!loading && productData.userProduct.length === 0 ? (
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
            {!loading && productData.userProduct.length > 0 && (
              <AdminCard
                iterable={productData.userProduct}
                title={'My products'}
                getProductSlug={(slug) => {
                  setProductSlug(slug)
                  setIsOpen(true)
                }}
              />
            )}
          </div>
        )}

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)

            if (!open) {
              setProductSlug(null)
              reset()
            }
          }}
        >
          <DialogTrigger asChild className={'fixed bottom-20 right-10'}>
            <Button
              onClick={openCreateDialog}
              variant={'ghost'}
              className={
                'bg-secondary text-bg border border-border rounded-full h-20 w-20 cursor-pointer hover:bg-secondary/80'
              }
            >
              <Plus size={40} className={'text-black font-bold size-1/2'} />
            </Button>
          </DialogTrigger>

          <DialogContent className={'max-h-[90vh] overflow-y-auto'}>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log('FORM ERRORS:', errors)
              })}
            >
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? 'Update product' : 'Add product'}
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
                    value={watch('included').join('\n')}
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
                            setValue('asset_url', file, {
                              shouldValidate: true,
                            })
                          } else {
                            // Reset or clear field state if user cancelled
                            setValue(
                              'asset_url',
                              undefined as unknown as File,
                              {
                                shouldValidate: true,
                              },
                            )
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
                      setProductSlug(null)
                      setIsEditMode(false)
                      reset()
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
                  {isEditMode
                    ? isSubmitting
                      ? 'Updating.....'
                      : 'Update product'
                    : isSubmitting
                      ? 'Adding...'
                      : 'Add product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
