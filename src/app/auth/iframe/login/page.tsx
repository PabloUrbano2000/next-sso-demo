'use client'

import { useAuth } from '@/context/AuthContext'
import { LoginSuccessData, LoginView } from '@/modules/auth/components/login'
import { useRouter } from 'next/navigation'

export default function IframeLoginPage() {
  const router = useRouter()

  const { email, user, channel, setToken } = useAuth()

  if (!email || !user) {
    return <></>
  }

  const handleSuccess = (data?: LoginSuccessData) => {
    const info = {
      eventName: 'auth-login-success',
      accessToken: data?.access_token || '',
      user: data?.user || {}
    }
    window.top?.postMessage(info, '*')

    setToken(data?.access_token || '')

    if (channel === 'landing') {
      window.top?.postMessage(
        {
          eventName: 'iframe-close'
        },
        '*'
      )
    } else {
      router.replace('/auth/iframe/login/success')
    }
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(`/auth/iframe/check-email${location.search}`)
  }

  return (
    <LoginView
      isIframe
      onSuccess={handleSuccess}
      onFailed={handleFailed}
      onEditEmail={handleUpdateEmail}
    ></LoginView>
  )
}
