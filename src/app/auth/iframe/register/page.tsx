'use client'

import { useAuth } from '@/context/AuthContext'
import {
  RegisterSuccessData,
  RegisterView
} from '@/modules/auth/components/register'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

export default function IframeRegisterPage() {
  const router = useRouter()

  const { clientId, redirectUri, email } = useAuth()

  React.useEffect(() => {
    if (!email) {
      redirect(
        `/auth/iframe/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
      )
    }
  }, [email])

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
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(
      `/auth/iframe/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
    )
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
