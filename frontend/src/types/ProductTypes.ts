import type { RegistrationSchema } from '#/validation/auth'
import type z from 'zod'

type tag = string

type types =
  | 'Templates'
  | 'Mockups'
  | 'Graphics'
  | 'Icons'
  | 'Fonts'
  | '3D Models'

export interface ProductTypes {
  id: number
  name: string
  price: number
  description: string
  tags: string
  types: types

  image: string[]
  included: tag[]
}

export type RegistrationTypes = z.infer<typeof RegistrationSchema>
