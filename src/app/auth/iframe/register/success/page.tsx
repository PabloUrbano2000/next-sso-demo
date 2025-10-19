'use client'

import { useAuth } from '@/context/AuthContext'
import { SuccessView } from '@/modules/auth/components/success'

export default function IframeRegisterSuccessPage() {
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
    window.top?.postMessage(
      {
        eventName: 'iframe-close'
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
    window.top?.postMessage(
      {
        eventName: 'iframe-close'
      },
      '*'
    )
  }

  return (
    <SuccessView
      type='register'
      onRedirectReferer={redirectToReferer}
      onRedirectSubs={redirectToSubs}
    ></SuccessView>
  )
}
