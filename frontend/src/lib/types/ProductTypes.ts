import z from 'zod'

type Tag = string

export type ProductCategory =
  | 'TEMPLATES'
  | 'MOCKUPS'
  | 'GRAPHICS'
  | 'ICONS'
  | 'FONTS'
  | '3D_MODELS'

/**
 * Product stored in DB
 */
export interface ProductTypes {
  id?: string
  user_id?: string
  name: string
  price: string
  description: string
  isPublished: boolean

  tags: Tag[]
  categories: ProductCategory[]

  included: string[]

  /**
   * Preview/product image URLs
   */
  images: string[]

  /**
   * Downloadable asset URLs
   */
  asset_urls: string[]
}

const fileSchema = z
  .array(z.instanceof(File))
  .min(1, {
    message: 'At least one file is required',
  })
  .max(10, {
    message: 'Maximum 10 files allowed',
  })

/**
 * Product form schema
 */
export const ProductSchema = z.object({
  name: z.string().min(3, {
    message: 'Name is required',
  }),

  description: z.string().min(3, {
    message: 'Description is required',
  }),

  price: z.string().regex(/^\d+\.\d{1,2}$/, {
    message: 'Price must be in format 0.0 or 0.00',
  }),

  tags: z.array(z.string()).min(1, {
    message: 'At least one tag is required',
  }),

  included: z.array(z.string()).min(1, {
    message: 'At least one included item is required',
  }),

  categories: z
    .array(
      z.enum([
        'TEMPLATES',
        'MOCKUPS',
        'GRAPHICS',
        'ICONS',
        'FONTS',
        '3D_MODELS',
      ]),
    )
    .min(1, {
      message: 'At least one category is required',
    }),

  /**
   * Product preview images
   */
  images: fileSchema,

  /**
   * Actual downloadable assets
   */
  assets: fileSchema,
})

export type ProductFormTypes = z.infer<typeof ProductSchema>
