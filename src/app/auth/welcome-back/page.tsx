'use client'

import { useAuth } from '@/context/AuthContext'
import { LoginSuccessData } from '@/modules/auth/components/forms/login'
import { SocialMergeView } from '@/modules/auth/components/forms/social-merge'
import { appendPianoQueryParams } from '@/utils/params'
import { useRouter } from 'next/navigation'

export default function WelcomeBackPage() {
  const router = useRouter()

  const { redirectUri, email, channel, setToken } = useAuth()

  if (!email) {
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
    router.push(`/auth/check-email`)
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <SocialMergeView
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onEditEmail={handleUpdateEmail}
      ></SocialMergeView>
    </div>
  )
}
