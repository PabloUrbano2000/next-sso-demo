'use client'

import { useAuth } from '@/context/AuthContext'
import { SuccessView } from '@/modules/auth/components/success'
import { appendPianoQueryParams } from '@/utils/params'

export default function RegisterSuccessPage() {
  const { redirectUri, email, token } = useAuth()

  if (!email) {
    return <></>
  }

  const redirectToSubs = () => {
    const landingSubs =
      new URL(decodeURIComponent(redirectUri)).origin + '/suscripciones/'

    location.href = appendPianoQueryParams(landingSubs, token, 'true')
  }

  const redirectToReferer = () => {
    location.href = appendPianoQueryParams(redirectUri, token, 'true')
  }

  return (
    <div className='flex min-h-screen py-8 items-center justify-center bg-gray-100 px-4'>
      <SuccessView
        type='register'
        onRedirectReferer={redirectToReferer}
        onRedirectSubs={redirectToSubs}
      ></SuccessView>
    </div>
  )
}
