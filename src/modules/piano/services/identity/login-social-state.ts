import axios, { type AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
}

interface SuccessResponse {
  state: string
  aid: string
  social_app_id: string
  url: string | null
  services_id: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

interface Props {
  aid: string
  social_type: 'GOOGLE' | 'APPLE' | 'FACEBOOK'
}

export const loginSocialState = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/identity/login/social/state`
  try {
    const response = await axios.get<SuccessResponse>(endpoint, {
      params: {
        client_id: data.aid,
        social_type: data.social_type
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
