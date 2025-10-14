import { isAxiosError } from 'axios'
import { NextResponse } from 'next/server'

export function handleUnexpectedError(error: unknown) {
  let message: string | object | null
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'object') {
    message = error
  } else {
    message = String(error)
  }
  return NextResponse.json(
    {
      code: 'UNEXPECTED_SERVER_ERROR',
      message
    },
    { status: 500 }
  )
}

export function handleAxiosError(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status || 400
    const message = error.response?.data || { code: 'BAD_REQUEST' }
    return NextResponse.json(message, { status })
  }
  handleUnexpectedError(error)
}

interface CustomError {
  status?: number
  code?: string
  data: unknown
}

export function handleCustomError(error: CustomError) {
  const status = error?.status || 400
  const message = error?.data || { code: 'BAD_REQUEST' }
  return NextResponse.json(message, { status })
}
