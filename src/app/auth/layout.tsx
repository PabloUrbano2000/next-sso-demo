'use client'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'

import {
  AuthProvider,
  type Channel,
  isValidChannel
} from '@/context/AuthContext'
import { Header } from '@/modules/shared/components/header'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [queryData, setQueryData] = useState<{
    clientId: string
    redirectUri: string
    channel: Channel
  }>({
    clientId: '',
    redirectUri: '',
    channel: 'organic'
  })
  const [isReady, setIsReady] = useState(false)

  const isIframePath = pathname.includes('iframe')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const clientId = params.get('client_id') ?? ''
    const redirectUri = params.get('redirect_uri') ?? ''
    const channel = isValidChannel(params.get('channel') || '')
      ? (params.get('channel') as Channel)
      : 'organic'

    if (!clientId || !redirectUri) {
      router.replace('/error')
      return
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
  }, [pathname, router])

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
    <div className='flex min-h-screen items-center flex-col bg-white'>
      <Header />
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
