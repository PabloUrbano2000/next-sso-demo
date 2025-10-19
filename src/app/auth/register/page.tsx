'use client'

import { useAuth } from '@/context/AuthContext'
import {
  RegisterSuccessData,
  RegisterView
} from '@/modules/auth/components/register'
import { appendQueryParams } from '@/utils/params'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const { redirectUri, email } = useAuth()

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
    router.push(`/auth/check-email${location.search}`)
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
