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
import { FileQuestion, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import { Field, FieldGroup } from '#/components/ui/field.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Input } from '#/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'

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

import type {
  ProductFormTypes,
  ProductTypes,
} from '#/lib/types/ProductTypes.ts'
import { ProductSchema } from '#/lib/types/ProductTypes.ts'

import { supabase } from '#/lib/supabase.ts'
import {
  useAddProduct,
  useGetUserProducts,
} from '#/components/queries/products/ProductQuery.ts'
import AdminCard from '#/components/Dashboard/AdminCard.tsx'

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useGetUserProducts()
  const [isOpen, setIsOpen] = useState(false)
  const { mutate } = useAddProduct()
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
      price: '',
      tags: [],
      included: [],
      categories: [],
      images: [],
      assets: [],
    },
  })

  const selectedCategories = watch('categories')

  /**
   * Upload files to Supabase bucket
   */
  async function handleUploads(files: File[], folder: 'images' | 'assets') {
    return await Promise.all(
      files.map(async (file) => {
        const filePath = `${folder}/${crypto.randomUUID()}-${file.name}`

        const { error } = await supabase.storage
          .from('KCMart')
          .upload(filePath, file)

        if (error) {
          throw error
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('KCMart').getPublicUrl(filePath)

        return publicUrl
      }),
    )
  }

  async function onSubmit(validData: ProductFormTypes) {
    console.log(data)
    try {
      /**
       * Upload preview images
       */
      const imageUrls = await handleUploads(validData.images, 'images')

      /**
       * Upload downloadable assets
       */
      const assetUrls = await handleUploads(validData.assets, 'assets')

      /**
       * Final product object
       */
      const product: ProductTypes = {
        name: validData.name,
        description: validData.description,
        price: validData.price,

        tags: validData.tags,
        categories: validData.categories,

        included: validData.included,

        images: imageUrls,
        asset_urls: assetUrls,
        isPublished: false,
      }

      mutate(product)

      /**
       * Save to DB here
       */

      setIsOpen(false)
      reset()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <DashboardHeader />

      <div className={'p-10'}>
        {!data && (
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
        )}
        <div className={'w-full'}>
          {data && <AdminCard iterable={data} title={'My products'} />}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className={'fixed bottom-20 right-10 w-full'}>
            <Button
              variant={'ghost'}
              className={
                'bg-secondary text-bg border border-border rounded-full h-20 w-20 cursor-pointer hover:bg-secondary/80'
              }
            >
              <Plus size={40} className={'text-black font-bold size-1/2 '} />
            </Button>
          </DialogTrigger>

          <DialogContent className={'max-h-[90vh] overflow-y-auto '}>
            <form
              onSubmit={handleSubmit(onSubmit, (formErrors) =>
                console.log(formErrors),
              )}
            >
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
                  <Label htmlFor={'price'}>Price</Label>

                  <Input
                    id={'price'}
                    placeholder={'20.00'}
                    {...register('price')}
                  />

                  {errors.price && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.price.message}
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

                {/* TYPE + TAG */}
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-3'}>
                  {/* TYPE */}
                  <Field>
                    <Label htmlFor={'type'}>Category</Label>

                    <Select
                      onValueChange={(value) =>
                        setValue('categories', [
                          value as ProductFormTypes['categories'][0],
                        ])
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="TEMPLATES">Templates</SelectItem>

                          <SelectItem value="MOCKUPS">Mockups</SelectItem>

                          <SelectItem value="GRAPHICS">Graphics</SelectItem>

                          <SelectItem value="ICONS">Icons</SelectItem>

                          <SelectItem value="FONTS">Fonts</SelectItem>

                          <SelectItem value="3D_MODELS">3D Models</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {selectedCategories.length > 0 && (
                      <p className={'text-sm text-muted-foreground mt-1'}>
                        Selected: {selectedCategories.join(', ')}
                      </p>
                    )}

                    {errors.categories && (
                      <p className={'text-sm text-red-500 mt-1'}>
                        {errors.categories.message}
                      </p>
                    )}
                  </Field>

                  {/* TAGS */}
                  <Field>
                    <Label htmlFor={'tags'}>Tags</Label>

                    <Input
                      id={'tags'}
                      placeholder={'Photoshop, UI, Template'}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean)

                        setValue('tags', tags)
                      }}
                    />

                    {errors.tags && (
                      <p className={'text-sm text-red-500 mt-1'}>
                        {errors.tags.message}
                      </p>
                    )}
                  </Field>
                </div>

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

                      setValue('included', includes)
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

                      setValue('images', files)
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
                  <Label htmlFor={'assets'}>Product Assets</Label>

                  <Input
                    id={'assets'}
                    type={'file'}
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])

                      setValue('assets', files)
                    }}
                  />

                  {errors.assets && (
                    <p className={'text-sm text-red-500 mt-1'}>
                      {errors.assets.message as string}
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
