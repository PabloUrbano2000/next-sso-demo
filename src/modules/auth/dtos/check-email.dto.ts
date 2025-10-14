import { z } from 'zod'

export const CheckEmailDto = z.object({
  email: z.email('Email is invalid')
})

export type CheckEmailDto = z.infer<typeof CheckEmailDto>
