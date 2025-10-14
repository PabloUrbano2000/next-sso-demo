import { z } from 'zod'

export const LoginDto = z.object({
  email: z.email('Email is invalid'),
  password: z.string('Password is required'),
  stay_logged_in: z.boolean('Stay Logged In not valid').optional()
})

export type LoginDto = z.infer<typeof LoginDto>
