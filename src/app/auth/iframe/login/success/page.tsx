'use client'

import { useAuth } from '@/context/AuthContext'
import { SuccessView } from '@/modules/auth/components/success'

export default function IframeLoginSuccessPage() {
  const { redirectUri, email } = useAuth()

  if (!email) {
    return <></>
  }

  const redirectToSubs = () => {
    const landingSubs =
      new URL(decodeURIComponent(redirectUri)).origin + '/suscripciones/'

    window.top?.postMessage(
      {
        eventName: 'redirect-action',
        uri: landingSubs
      },
      '*'
    )
  }

  const redirectToReferer = () => {
    window.top?.postMessage(
      {
        eventName: 'redirect-action',
        uri: decodeURIComponent(redirectUri)
      },
      '*'
    )
  }

  return (
    <SuccessView
      type='login'
      onRedirectReferer={redirectToReferer}
      onRedirectSubs={redirectToSubs}
    ></SuccessView>
  )
}
