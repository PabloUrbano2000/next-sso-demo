'use client'

import { AuthProvider } from '@/context/AuthContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [queryData, setQueryData] = useState({
    clientId: '',
    redirectUri: '',
    channel: ''
  })
  const [isReady, setIsReady] = useState(false)

  const isIframePath = pathname.includes('iframe')

  useEffect(() => {
    const clientId = params.get('client_id') ?? ''
    const redirectUri = params.get('redirect_uri') ?? ''
    const channel = params.get('channel') ?? 'organic'

    if (!clientId || !redirectUri) {
      router.replace('/error')
    }
    setQueryData({
      clientId: clientId,
      redirectUri: redirectUri,
      channel: channel
    })

    if (
      !pathname.startsWith('/auth/logout') &&
      !pathname.includes('/check-email')
    ) {
      if (pathname.includes('iframe')) {
        router.replace(`/auth/iframe/check-email${location.search}`)
      } else {
        router.replace(`/auth/check-email${location.search}`)
      }
    }

    setIsReady(true)
  }, [])

  if (!isReady) {
    return <div className='flex w-full bg-white justify-center'></div>
  }

  if (isIframePath) {
    return (
      <div className='flex w-full bg-white justify-center'>
        <AuthProvider
          initialClientId={queryData.clientId}
          initialRedirectUri={queryData.redirectUri}
          initialChannel={queryData.channel}
        >
          {children}
        </AuthProvider>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <AuthProvider
        initialClientId={queryData.clientId}
        initialRedirectUri={queryData.redirectUri}
        initialChannel={queryData.channel}
      >
        {children}
      </AuthProvider>
    </div>
  )
}
