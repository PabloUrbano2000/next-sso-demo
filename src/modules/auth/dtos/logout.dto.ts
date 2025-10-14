import { z } from 'zod'

export const LogoutDto = z.object({
  token: z.string('Token is required')
})

export type LogoutDto = z.infer<typeof LogoutDto>
