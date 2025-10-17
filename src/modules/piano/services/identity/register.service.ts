import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
  force_show_captcha?: boolean
}

interface SuccessResponse {
  access_token: string
  refresh_token: string
  email_confirmation_required: boolean
  extend_expired_access_enabled: boolean
}

interface Props {
  api_token: string
  aid: string
  email: string
  password: string
  first_name: string
  last_name: string
  consents: {
    terms_and_privacy_policy: boolean
    data_treatment?: boolean
    age_confirmation?: boolean
  }
  custom_fields: {
    contact_phone?: string
    origin_device?: string
    origin_user_agent?: string
    origin_domain?: string
    origin_referer?: string
  }
  stay_logged_in?: boolean | null
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const register = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  const endpoint = `${piano.fullApiVersion.v1}/publisher/identity/register`
  try {
    const response = await axios.post<SuccessResponse>(
      endpoint,
      {
        aid: data.aid,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        consents: JSON.stringify(data.consents),
        custom_fields: JSON.stringify({
          ...data.custom_fields,
          origin_device: data.custom_fields.origin_device
            ? JSON.stringify([data.custom_fields.origin_device])
            : undefined
        })
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: data.api_token
        }
      }
    )

    return { success: response.data }
  } catch (err) {
    const axiosErr = err as AxiosError<ErrorResponse>
    if (axiosErr.response) {
      return {
        error: {
          ...axiosErr.response.data,
          piano_status: axiosErr.response.status || 400
        }
      }
    }
    throw err
  }
}
