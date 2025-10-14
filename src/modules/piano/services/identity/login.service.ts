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
  stay_logged_in?: boolean | null
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const login = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const endpoint = `${
    getPianoAttrs().fullApiVersion.v1
  }/publisher/identity/login`
  try {
    const response = await axios.post<SuccessResponse>(
      endpoint,
      {
        aid: data.aid,
        email: data.email,
        password: data.password,
        stay_logged_in: data.stay_logged_in
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
