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
  email?: string
  password?: string
  confimed_token?: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const loginSocialCodeConfirm = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/publisher/login/social/codeConfirm`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        aid: data.aid,
        api_token: data.api_token,
        email: data.email,
        password: data.password,
        confimed_token: data.confimed_token
      }
    })

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
