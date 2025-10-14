import { NextResponse } from 'next/server'

import { ExtendedNextRequest } from '@/types/next'
import { handleApi } from './lib/middlewares/api'
import { handleAuth } from './lib/middlewares/auth'



export function middleware(req: ExtendedNextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/api')) return handleApi(req)

  if (path.startsWith('/auth')) return handleAuth(req)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)']
}
