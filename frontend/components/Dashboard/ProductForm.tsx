import {useEffect, useState} from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@apollo/client/react'
import {Loader2, Upload} from 'lucide-react'

import {
  ProductSchema,
  type ProductFormTypes,
  type ProductResponseTypes,
  type CategoryTypes,
  type TagsTypes
} from '@/lib/types/ProductTypes'
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_WITH_SLUG,
  GET_USER_PRODUCTS
} from '@/lib/query/product'
import { GET_CATEGORIES } from '@/lib/query/category'
import { GET_TAGS } from '@/lib/query/tag'
import { handleUploads } from '@/lib/helpers/productHelper'

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductFormProps {
  setOpenDialogue: (value: boolean) => void
  productSlug?: string
  clearProductSlug: () => void
}

export function ProductForm({ setOpenDialogue, productSlug, clearProductSlug }: ProductFormProps) {
  const isEditMode = !!productSlug

  // Data fetching
  const { data: categories_res, loading: category_loading } = useQuery(GET_CATEGORIES)
  const { data: tags_res, loading: tags_loading } = useQuery(GET_TAGS)
  const { data: product_data, loading: product_loading } = useQuery(GET_PRODUCT_WITH_SLUG, {
    variables: { slug: productSlug },
    skip: !isEditMode,
  })

  const [create_product, { loading: isCreating }] = useMutation(CREATE_PRODUCT)
  const [update_product, { loading: isUpdating }] = useMutation(UPDATE_PRODUCT)


  const [isLoading, setIsLoading] = useState(false)

  const isSubmitting =isLoading || isCreating || isUpdating
  const isLoadingProduct = isEditMode && product_loading

  const catValue = categories_res as {categories:CategoryTypes[]}
  const tagValue = tags_res as {tags:TagsTypes[]}
  const pValue = product_data as {productWithSlug:ProductResponseTypes}

  const categories = catValue?.categories || []
  const tags = tagValue?.tags || []
  const product = pValue?.productWithSlug || undefined

  const { register, handleSubmit, setValue, watch, control, reset, formState: { errors } } = useForm<ProductFormTypes>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price_cents: '',
      tags: [],
      included: [],
      categories: [],
      images: [],
      asset_url: undefined,
    },
  })

  const selectedTags = watch('tags') || []
  const selectedCategories = watch('categories') || []

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && product) {
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
  }, [product, isEditMode, reset])

  const toggleArrayItem = (field: 'tags' | 'categories', id: string) => {
    const currentArray = field === 'tags' ? selectedTags : selectedCategories
    const updated = currentArray.includes(id)
      ? currentArray.filter((itemId) => itemId !== id)
      : [...currentArray, id]
    setValue(field, updated, { shouldValidate: true })
  }

  // Unified submit handler for both Create and Update
  const onSubmit = async (validData: ProductFormTypes) => {
    setIsLoading(true)
    const priceCents = Math.round(parseFloat(validData.price_cents) * 100)

    try {
      let imageUrls: string[] = []
      let assetUrl: string = ''

      // Only upload files if creating a new product
      if (!isEditMode) {
        imageUrls = await handleUploads(validData.images, 'images')
        const assetUrls = await handleUploads(validData.asset_url ? [validData.asset_url] : [], 'assets')
        assetUrl = assetUrls[0] || ''
      }

      const baseVariables = {
        name: validData.name,
        description: validData.description,
        priceCent: priceCents,
        included: validData.included,
        categoriesIds: validData.categories,
        tagIds: validData.tags,
      }

      const refetch = [{ query: GET_USER_PRODUCTS, variables: { page: 1, limit: 10 } }]

      if (isEditMode) {
        await update_product({
          variables: { ...baseVariables, slug: productSlug, product_id: product?.id },
          refetchQueries: refetch,
        })
        toast.success('Product updated successfully')
      } else {
        await create_product({
          variables: { ...baseVariables, images: imageUrls, assetUrl },
          refetchQueries: refetch,
        })
        toast.success('Product created successfully')
      }

      reset()
      clearProductSlug()
      setIsLoading(false)
      setOpenDialogue(false)
    } catch (error) {
      setIsLoading(false)
      setOpenDialogue(false)
      console.error('Error saving product:', error)
      toast.error( 'Failed to save product')
    }
  }

  const handleCancel = () => {
    reset()
    clearProductSlug()
    setOpenDialogue(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">{isEditMode ? 'Update Product' : 'Add New Product'}</DialogTitle>
        <DialogDescription>
          {isEditMode ? 'Modify the details of your existing product.' : 'Fill in the details to create a new product.'}
        </DialogDescription>
      </DialogHeader>

      {isLoadingProduct ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <FieldGroup className="space-y-4">
          {/* NAME */}
          <Field>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g. Premium UI Kit" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </Field>

          {/* PRICE */}
          <Field>
            <Label htmlFor="price_cents">Price (USD)</Label>
            <Input id="price_cents" type="number" step="0.01" placeholder="29.99" {...register('price_cents')} />
            {errors.price_cents && <p className="text-sm text-red-500 mt-1">{errors.price_cents.message}</p>}
          </Field>

          {/* DESCRIPTION */}
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your product..." className="min-h-25" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </Field>

          {/* CATEGORIES & TAGS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <Label>Categories</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-border rounded-md p-3 bg-background">
                {category_loading ? <p className="text-sm text-secondary">Loading...</p> : categories.map((cat) => (
                  <label key={cat.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary transition-colors">
                    <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleArrayItem('categories', cat.id)} />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="text-sm text-red-500 mt-1">{errors.categories.message}</p>}
            </Field>

            <Field>
              <Label>Tags</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border border-border rounded-md p-3 bg-background">
                {tags_loading ? <p className="text-sm text-secondary">Loading...</p> : tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:text-primary transition-colors">
                    <Checkbox checked={selectedTags.includes(tag.id)} onCheckedChange={() => toggleArrayItem('tags', tag.id)} />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
              {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>}
            </Field>
          </div>

          {/* INCLUDES */}
          <Field>
            <Label htmlFor="includes">What&#39;s Included</Label>
            <Controller
              name="included"
              control={control}
              render={({  }) => (
                <Textarea
              id="includes"
              value={(watch('included') ?? []).join('\n')}
              placeholder={
                'One item per line\nExample:\nFigma file\nDocumentation'
              }
              onChange={(e) => {
                const includes = e.target.value
                  .split('\n')
                  .map((item) => item.trim())

                setValue('included', includes, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }}
            />
              )}
            />
            {errors.included && <p className="text-sm text-red-500 mt-1">{errors.included.message}</p>}
          </Field>

          {/* FILES (Only for Create Mode) */}
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
  <Label>Product Images</Label>
  <label
    htmlFor="images"
    className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 py-2 text-sm text-secondary transition-colors hover:border-primary/50 hover:text-primary"
  >
    <Upload size={16} className="shrink-0" />
    <span className="truncate">
      {watch('images')?.length
        ? `${watch('images')?.length} image(s) selected`
        : 'Click to upload product images'}
    </span>
  </label>
  {/* The real input is hidden, but the label above triggers it */}
  <Input
    id="images"
    type="file"
    multiple
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const files = Array.from(e.target.files ?? [])
      setValue('images', files, { shouldValidate: true, shouldDirty: true })
    }}
  />
  {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images.message as string}</p>}
</Field>

{/* ASSET */}
<Field>
  <Label>Product Asset (ZIP/PDF)</Label>
  <label
    htmlFor="asset_url"
    className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 py-2 text-sm text-secondary transition-colors hover:border-primary/50 hover:text-primary"
  >
    <Upload size={16} className="shrink-0" />
    <span className="truncate">
      {watch('asset_url')?.name ?? 'Click to upload ZIP, PDF or design files'}
    </span>
  </label>
  <Input
    id="asset_url"
    type="file"
    accept=".zip,.pdf,.rar,.sketch,.fig"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0]
      setValue('asset_url', file, { shouldValidate: true, shouldDirty: true })
    }}
  />
  {errors.asset_url && <p className="text-sm text-red-500 mt-1">{errors.asset_url.message as string}</p>}
</Field>
            </div>
          )}
        </FieldGroup>
      )}

      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button  type="submit" disabled={isSubmitting || isLoadingProduct}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoading && isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditMode ? 'Update Product' : 'Create Product'}</>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}