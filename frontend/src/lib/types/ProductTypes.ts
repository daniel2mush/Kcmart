import z from 'zod'

export interface ProductResponseTypes {
  id: string
  owner: string
  name: string
  slug: string
  description: string
  price: number
  status: string
  is_featured: boolean
  included: string[]
  tags: string[] // UUIDs
  categories: string[] // UUIDs
  images: string[]
  assets: string[]
}

export type CategoryTypes = {
  id: string
  name: string
  slug: string
}

export type TagsTypes = {
  id: string
  name: string
}

/**
 * Product payload sent to the backend
 */
export interface ProductTypes {
  name: string
  description: string
  price_cents: number // integer in cents
  tags: string[] // UUIDs
  categories: string[] // UUIDs
  included: string[]
  images: string[]
  asset_urls: string[]
}

const fileSchema = z
  .array(z.instanceof(File))
  .min(1, { message: 'At least one file is required' })
  .max(10, { message: 'Maximum 10 files allowed' })

/**
 * Product form schema – validates the input before sending
 */
export const ProductSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  price_cents: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Price must be a valid dollar amount (e.g., 20.00)',
  }),
  tags: z.array(z.string().uuid()).min(1, {
    message: 'At least one tag is required',
  }),
  categories: z.array(z.string().uuid()).min(1, {
    message: 'At least one category is required',
  }),
  included: z.array(z.string()).min(1, {
    message: 'At least one included item is required',
  }),
  images: fileSchema,
  assets: fileSchema,
})

export type ProductFormTypes = z.infer<typeof ProductSchema>
