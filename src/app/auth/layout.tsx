import { AuthProvider } from '@/context/AuthContext'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default async function AuthLayout({ children }: LayoutProps) {
  const hdrs = await headers()
  const clientId = hdrs.get('x-client-id')
  const redirectUri = hdrs.get('x-redirect-uri')

  if (!clientId || !redirectUri) {
    redirect('/error')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <AuthProvider initialClientId={clientId} initialRedirectUri={redirectUri}>
        {children}
      </AuthProvider>
    </div>
  )
}
