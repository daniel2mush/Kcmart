import type { LoginSchema, RegistrationSchema } from '#/lib/validation/auth.ts'
import type z from 'zod'

export type LoginTypes = z.infer<typeof LoginSchema>
export type RegistrationTypes = z.infer<typeof RegistrationSchema>
