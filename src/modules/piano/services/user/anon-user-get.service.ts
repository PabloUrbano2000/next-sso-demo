import axios, { AxiosError } from 'axios'

import { piano } from '@/constants/piano'

interface SuccessResponse {
  code: number
  user: {
    first_name: string | null
    last_name: string | null
    personal_name: string | null
    email: string
    uid: string
    create_date: number
  }
}

interface ErrorResponse {
  piano_status: number
  code: number
  ts: number
  message: string
}

interface Props {
  user_token: string
  aid: string
}

interface ServiceResult<T, E> {
  success?: T
  error?: E
}

export const anonUserGet = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const endpoint = `${piano.fullApiVersion.v3}/anon/user/get`
  try {
    const response = await axios.post<SuccessResponse>(
      endpoint,
      {
        aid: data.aid
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          aid: data.aid,
          user_token: data.user_token
        }
      }
    )

    if (response.data?.code !== 0) {
      return {
        error: {
          ...(response.data as unknown as ErrorResponse),
          piano_status: response.status
        }
      }
    }

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
