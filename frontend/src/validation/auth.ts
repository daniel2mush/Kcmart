import z from 'zod'

export const RegistrationSchema = z
  .object({
    email: z.email({ error: 'Email is required' }),
    password: z.string().min(3, { error: 'Password must not be empty' }),
    first_name: z
      .string()
      .min(5, { error: 'First name cannot be lesser than 5 characters' })
      .max(225),
    last_name: z
      .string()
      .min(5, { error: 'Last name cannot be lesser than 5 characters' })
      .max(225),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
