import { z } from 'zod'

export const RegisterDto = z.object({
  email: z.email('Email is invalid'),
  password: z.string('Password is required'),
  first_name: z
    .string('First Name is required')
    .min(2, {
      error: 'min length 2 characters'
    })
    .regex(/^[A-Za-zñÑÁÉÍÓÚÀÂÊÔÃÕÜÇáéíóúêàâêôãõüç’'\s]*$/, {
      error: 'First Name is not valid'
    }),
  last_name: z
    .string('Last Name is required')
    .min(2, {
      error: 'Min length 2 characters'
    })
    .regex(/^[A-Za-zñÑÁÉÍÓÚÀÂÊÔÃÕÜÇáéíóúêàâêôãõüç’'\s]*$/, {
      error: 'Last Name is not valid'
    }),
  contact_phone: z.string().optional(),
  origin_device: z.string().optional(),
  origin_domain: z.string().optional(),
  origin_user_agent: z.string().optional(),
  origin_referer: z.string().optional(),
  terms_and_privacy_policy: z.boolean('Terms and privacy policy is not valid'),
  data_treatment: z.boolean('Data treatment is not valid').optional(),
  age_confirmation: z.boolean('Age confirmation is not valid').optional()
})

export type RegisterDto = z.infer<typeof RegisterDto>
