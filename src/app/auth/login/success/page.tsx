'use client'

import { useAuth } from '@/context/AuthContext'
import { SuccessView } from '@/modules/auth/components/success'
import { appendPianoQueryParams } from '@/utils/params'

export default function LoginSuccessPage() {
  const { redirectUri, email, token } = useAuth()

  if (!token) {
    return <></>
  }

  const redirectToSubs = () => {
    const landingSubs =
      new URL(decodeURIComponent(redirectUri)).origin + '/suscripciones/'

    location.href = appendPianoQueryParams(landingSubs, token, 'false')
  }

  const redirectToReferer = () => {
    location.href = appendPianoQueryParams(redirectUri, token, 'false')
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <SuccessView
        type='login'
        onRedirectReferer={redirectToReferer}
        onRedirectSubs={redirectToSubs}
      ></SuccessView>
    </div>
  )
}
