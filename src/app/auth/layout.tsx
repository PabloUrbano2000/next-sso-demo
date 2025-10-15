import AuthLayoutClient from '@/modules/auth/layout'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const hdrs = await headers()
  const clientId = hdrs.get('x-client-id')
  const redirectUri = hdrs.get('x-redirect-uri')

  if (!clientId || !redirectUri) {
    redirect('/error')
  }

  return (
    <AuthLayoutClient clientId={clientId} redirectUri={redirectUri}>
      {children}
    </AuthLayoutClient>
  )
}
