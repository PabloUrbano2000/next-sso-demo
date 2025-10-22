import { z } from 'zod'

export const MergeDto = z.object({
  email: z.email('Email is invalid').optional(),
  password: z.string().optional(),
  confirmed_token: z.string().optional()
})

export type MergeDto = z.infer<typeof MergeDto>
