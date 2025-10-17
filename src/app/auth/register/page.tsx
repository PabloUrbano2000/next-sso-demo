'use client'

import { useAuth } from '@/context/AuthContext'
import {
  RegisterSuccessData,
  RegisterView
} from '@/modules/auth/components/register'
import { appendQueryParams } from '@/utils/params'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

export default function RegisterPage() {
  const router = useRouter()

  const { clientId, redirectUri, email } = useAuth()

  React.useEffect(() => {
    if (!email) {
      redirect(
        `/auth/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
      )
    }
  }, [email])

  if (!email) {
    return <></>
  }

  const handleSuccess = (data?: RegisterSuccessData) => {
    const newRedirectUri = appendQueryParams(redirectUri, {
      token: data?.access_token || '',
      registration: 'true',
      gm_sso_redirect: 'true'
    })

    location.href = newRedirectUri
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(
      `/auth/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
    )
  }

  return (
    <div className='flex min-h-screen py-8 items-center justify-center bg-gray-100 px-4'>
      <RegisterView
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onEditEmail={handleUpdateEmail}
      ></RegisterView>
    </div>
  )
}
