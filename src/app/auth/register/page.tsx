'use client'

import { useAuth } from '@/context/AuthContext'
import {
  RegisterSuccessData,
  RegisterView
} from '@/modules/auth/components/register'
import { appendPianoQueryParams } from '@/utils/params'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const { redirectUri, email, channel, setToken } = useAuth()

  if (!email) {
    return <></>
  }

  const handleSuccess = (data?: RegisterSuccessData) => {
    setToken(data?.access_token || '')

    if (channel === 'landing') {
      location.href = appendPianoQueryParams(
        redirectUri,
        data?.access_token || '',
        'true'
      )
    } else {
      router.replace('/auth/register/success')
    }
  }

  const handleFailed = () => {}

  const handleUpdateEmail = () => {
    router.push(`/auth/check-email${location.search}`)
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <RegisterView
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onEditEmail={handleUpdateEmail}
      ></RegisterView>
    </div>
  )
}
