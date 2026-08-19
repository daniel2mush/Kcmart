import type z from 'zod'
import {LoginSchema, RegistrationSchema} from "@/lib/validation/auth";

export type LoginTypes = z.infer<typeof LoginSchema>
export type RegistrationTypes = z.infer<typeof RegistrationSchema>
