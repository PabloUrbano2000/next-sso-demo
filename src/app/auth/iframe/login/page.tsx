'use client'

import { useAuth } from '@/context/AuthContext'
import { LoginSuccessData, LoginView } from '@/modules/auth/components/login'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

export default function LoginPage() {
  const router = useRouter()

  const { clientId, redirectUri, email, user } = useAuth()

  React.useEffect(() => {
    if (!email || !user) {
      redirect(
        `/auth/iframe/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
      )
    }
  }, [email, user])

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
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(
      `/iframe/auth/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
    )
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
