import axios, { type AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
}

interface SuccessResponse {
  access_token?: string
  refresh_token?: string
  status: string
  linking_state?: string
  social_type?: string
  email: string
  first_name?: string
  last_name?: string
  password_confirmation_available?: boolean
  linked_social_accounts?: []
  redirect_uri?: string
  error_message?: string
  warn_message?: string
  additional_input_state?: string
  need_email?: boolean
  response_type?: string
}

interface Props {
  aid: string
  provider_access_token: string
  state: string
}

export const authSocialState = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const piano = getPianoAttrs()

  console.log(data)

  const endpoint = `${piano.fullApiVersion.v1}/identity/auth/social/state`
  try {
    const response = await axios.post<SuccessResponse>(
      endpoint,
      {
        client_id: data.aid,
        provider_access_token: data.provider_access_token,
        state: data.state
      },
      {
        headers: {
          'Content-Type': 'application/json'
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
