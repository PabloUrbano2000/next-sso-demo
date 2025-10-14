import axios, { AxiosError } from 'axios'

import { getPianoAttrs } from '@/constants/piano'

interface ErrorResponse {
  piano_status: number
  error_code_list?: { message: string }[]
}

interface SuccessResponse {
  jti: string
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

export const logout = async (
  data: Props
): Promise<ServiceResult<SuccessResponse, ErrorResponse>> => {
  const endpoint = `${getPianoAttrs().fullApiVersion.v1}/publisher/logout/`
  try {
    const response = await axios.post<SuccessResponse>(endpoint, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: data.api_token
      },
      params: {
        aid: data.aid,
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
