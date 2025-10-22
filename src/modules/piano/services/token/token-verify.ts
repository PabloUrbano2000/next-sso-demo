import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list: { message: string }[]
  force_show_captcha: boolean
}

interface SuccessResponse {
  access_token: string
  token_type: string
  expires_in: number
  email_confirmation_required: boolean
  pre_confirmed_user: boolean
  extend_expired_access_enabled: boolean
  pub_id: string
}

interface Props {
  api_token: string
  aid: string
  token: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const tokenVerify = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/publisher/token/verify`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        aid: data.aid,
        api_token: data.api_token,
        token: data.token
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
