import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
}

interface SuccessResponse {
  first_name: string | null
  last_name: string | null
  uid: string
  email: string
  phone: string | null
  create_date: number
  reset_password_email_sent: boolean
  password: string
  custom_fields: { name: string; value: unknown }[]
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

export async function getUsers(
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> {
  const piano = getPianoAttrs()

  const endpoint = `${piano.fullApiVersion.v1}/publisher/users/get`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
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
