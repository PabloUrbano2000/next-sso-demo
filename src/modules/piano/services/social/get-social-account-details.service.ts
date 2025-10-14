import axios, { AxiosError } from 'axios'

import { piano } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
}

interface SuccessResponse {
  social_accounts: {
    provider_name: 'FACEBOOK' | 'GOOGLE' | 'APPLE'
    provider_user_id: string
    user_email: string
  }[]
}

interface Props {
  api_token: string
  aid: string
  uid?: string
  email?: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const socialAccountDetails = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const endpoint = `${piano.fullApiVersion.v1}/publisher/social/account-details`
  try {
    const response = await axios.get<SuccessResponse>(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: data.api_token
      },
      params: {
        aid: data.aid,
        uid: data.uid,
        email: data.email
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
