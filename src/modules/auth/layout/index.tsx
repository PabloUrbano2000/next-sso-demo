'use client'

import { AuthProvider } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function AuthLayout({
  children,
  clientId,
  redirectUri
}: {
  children: ReactNode
  clientId: string
  redirectUri: string
}) {
  const pathname = usePathname()
  const isIframePath = pathname.includes('iframe')

  if (isIframePath) {
    return (
      <div className='flex w-full bg-white justify-center'>
        <AuthProvider
          initialClientId={clientId}
          initialRedirectUri={redirectUri}
        >
          {children}
        </AuthProvider>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <AuthProvider initialClientId={clientId} initialRedirectUri={redirectUri}>
        {children}
      </AuthProvider>
    </div>
  )
}
