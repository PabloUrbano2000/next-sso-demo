/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */

import { useAuth } from '@/context/AuthContext'
import { getDeviceCategory } from '@/utils/navigator'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SocialButton } from './buttons'

interface ThirdProvidersProps {
  clientId: string
  providers: ('apple' | 'google' | 'facebook')[]
}

export const ThirdProviders = ({
  clientId,
  providers
}: ThirdProvidersProps) => {
  const router = useRouter()
  const { setEmail, setToken } = useAuth()
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      console.log('llegó aqui')
      window.removeEventListener('message', loginMessage)
      if (timer) {
        clearInterval(timer)
        setTimer(timer)
      }
    }
  }, [])

  const handleRedirect = (data: any) => {
    const { status, user: { email } = {}, access_token } = data

    if (status === 'success') {
      setToken(access_token)
      router.push('/auth/login/success')
    } else if (status === 'confirm') {
      setEmail(email)
      router.push('/auth/welcome-back')
    }
  }

  const loginMessage = (event: MessageEvent) => {
    if (typeof event.data !== 'object') return
    if (event.data && event.data.eventName === 'auth-login-callback') {
      handleRedirect(event.data.payload)
      console.log(event)
    }
  }

  const handleClickButton = () => {
    const isDesktop = getDeviceCategory() === 'desktop'

    console.log('un click mas', isDesktop)

    if (isDesktop) {
      window.addEventListener('message', loginMessage)
    } else {
      console.log('volvi a activarme')
      if (!timer) {
        const interval = setInterval(() => {
          const auth = localStorage.getItem('auth_result')
          if (auth) {
            console.log(JSON.parse(JSON.parse(auth)))
            handleRedirect(JSON.parse(JSON.parse(auth)))
            localStorage.removeItem('auth_result')
            setTimer(null)
            clearInterval(interval)
          }
        }, 1000)
        setTimer(interval)
      }
    }
  }

  return (
    <>
      {providers.length === 0 ? null : (
        <div className='social-container'>
          {providers.includes('google') && (
            <SocialButton
              onClick={handleClickButton}
              clientId={clientId}
              social='google'
            ></SocialButton>
          )}
          {providers.includes('facebook') && (
            <SocialButton
              onClick={handleClickButton}
              clientId={clientId}
              social='facebook'
            ></SocialButton>
          )}
        </div>
      )}
    </>
  )
}
