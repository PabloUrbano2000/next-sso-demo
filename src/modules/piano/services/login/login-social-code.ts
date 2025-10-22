import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
  force_show_captcha?: boolean
}

interface SuccessResponse {
  access_token: string
  status: string
  linking_state: string
  social_type: string
  email: string
  first_name: string
  last_name: string
  password_confirmation_available: boolean
  linked_social_accounts: []
  redirect_uri: string
}

interface Props {
  api_token: string
  aid: string
  response_id: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const loginSocialCode = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/publisher/login/social/code`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        aid: data.aid,
        api_token: data.api_token,
        response_id: data.response_id
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
