'use client'

import { useAuth } from '@/context/AuthContext'
import {
  LoginSuccessData,
  LoginView
} from '@/modules/auth/components/forms/login'
import { appendPianoQueryParams } from '@/utils/params'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const { redirectUri, email, user, channel, setToken } = useAuth()

  if (!email || !user) {
    return <></>
  }

  const handleSuccess = (data?: LoginSuccessData) => {
    setToken(data?.access_token || '')

    if (channel === 'landing') {
      location.href = appendPianoQueryParams(
        redirectUri,
        data?.access_token || '',
        'false'
      )
    } else {
      router.replace('/auth/login/success')
    }
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(`/auth/check-email${location.search}`)
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <LoginView
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onEditEmail={handleUpdateEmail}
      ></LoginView>
    </div>
  )
}
