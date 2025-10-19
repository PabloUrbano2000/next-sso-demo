'use client'

import { useAuth } from '@/context/AuthContext'
import {
  RegisterSuccessData,
  RegisterView
} from '@/modules/auth/components/register'
import { useRouter } from 'next/navigation'

export default function IframeRegisterPage() {
  const router = useRouter()

  const { email, channel } = useAuth()

  if (!email) {
    return <></>
  }

  const handleSuccess = (data?: RegisterSuccessData) => {
    const info = {
      eventName: 'auth-register-success',
      accessToken: data?.access_token || '',
      user: data?.user || {}
    }
    window.top?.postMessage(info, '*')

    if (channel === 'landing') {
      window.top?.postMessage(
        {
          eventName: 'iframe-close'
        },
        '*'
      )
    } else {
      router.replace('/auth/iframe/register/success')
    }
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(`/auth/iframe/check-email${location.search}`)
  }

  return (
    <RegisterView
      isIframe
      onSuccess={handleSuccess}
      onFailed={handleFailed}
      onEditEmail={handleUpdateEmail}
    ></RegisterView>
  )
}
