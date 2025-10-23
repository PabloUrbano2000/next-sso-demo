import { getEnv } from '@/config/envs'
import { BRANDS, type Brand } from '@/constants/brands'
import { type NextRequest, NextResponse } from 'next/server'

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-brand',
  'Access-Control-Allow-Credentials': 'true'
}

export function handleApi(req: NextRequest) {
  const origin = req.headers.get('origin') ?? ''
  const envs = getEnv()
  const allowedOrigins: string[] = envs.ALLOWED_DOMAINS
  const isAllowedOrigin = allowedOrigins.includes(origin)

  const isPreflight = req.method === 'OPTIONS'

  if (isPreflight) {
    const headers = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions
    }

    return new NextResponse(null, {
      status: 204,
      headers
    })
  }
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  const brand =
    (req.headers.get('x-brand') as Brand) ||
    req.nextUrl.searchParams.get('state')

  console.log('hash', decodeURIComponent(req.nextUrl.href))
  
  const validBrands = Object.values(BRANDS)

  if (typeof brand !== 'string' || !validBrands.includes(brand as Brand)) {
    return NextResponse.json({ error: 'Brand Not Allowed' }, { status: 405 })
  }

  return response
}
