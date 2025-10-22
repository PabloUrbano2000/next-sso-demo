import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
  force_show_captcha?: boolean
}

interface SuccessResponse {
  uri: string
}

interface Props {
  api_token: string
  aid: string
  social_type: string
  redirect_uri: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const loginSocial = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/publisher/login/social`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        aid: data.aid,
        api_token: data.api_token,
        social_type: data.social_type,
        redirect_uri: data.redirect_uri
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
