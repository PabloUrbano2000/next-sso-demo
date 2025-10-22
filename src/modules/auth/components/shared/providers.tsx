import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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

  useEffect(() => {
    const loginMessage = (event: MessageEvent) => {
      console.log(event)
      if (typeof event.data !== 'object') return
      if (event.data && event.data.eventName === 'auth-login-callback') {
        const {
          payload: { status, user: { email } = {}, access_token, message }
        } = event.data

        if (status === 'success') {
          setToken(access_token)
          router.push('/auth/login/success')
        } else if (status === 'confirm') {
          setEmail(email)
          router.push('/auth/welcome-back')
        }
      }
    }
    window.addEventListener('message', loginMessage)
    return () => {
      window.removeEventListener('message', loginMessage)
    }
  }, [])

  return (
    <>
      {providers.length === 0 ? null : (
        <div className='social-container'>
          {providers.includes('google') && (
            <SocialButton clientId={clientId} social='google'></SocialButton>
          )}
          {providers.includes('facebook') && (
            <SocialButton clientId={clientId} social='facebook'></SocialButton>
          )}
        </div>
      )}
    </>
  )
}
