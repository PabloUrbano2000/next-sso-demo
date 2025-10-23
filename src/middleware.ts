import { NextResponse } from 'next/server'

import type { ExtendedNextRequest } from '@/types/next'
import { handleApi } from './lib/middlewares/api'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function middleware(req: ExtendedNextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/api')) return handleApi(req)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)']
}
