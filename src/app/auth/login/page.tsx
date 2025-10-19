'use client'

import { useAuth } from '@/context/AuthContext'
import { LoginSuccessData, LoginView } from '@/modules/auth/components/login'
import { appendQueryParams } from '@/utils/params'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const { redirectUri, email, user } = useAuth()

  if (!email || !user) {
    return <></>
  }

  const handleSuccess = (data?: LoginSuccessData) => {
    const newRedirectUri = appendQueryParams(redirectUri, {
      token: data?.access_token || '',
      registration: 'false',
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
      <LoginView
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onEditEmail={handleUpdateEmail}
      ></LoginView>
    </div>
  )
}
