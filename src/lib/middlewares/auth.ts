import { NextRequest, NextResponse } from 'next/server'

export function handleAuth(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get('client_id')
  const redirectUri = req.nextUrl.searchParams.get('redirect_uri')

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(new URL('/error', req.url))
  }

  // Podrías adjuntar headers si quieres pasarlos a páginas internas
  const res = NextResponse.next()
  res.headers.set('x-client-id', clientId)
  res.headers.set('x-redirect-uri', redirectUri)

  return res
}
