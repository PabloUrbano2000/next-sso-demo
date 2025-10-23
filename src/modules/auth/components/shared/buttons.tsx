import Image from 'next/image'
import type { JSX } from 'react'

type ButtonElement = JSX.Element | React.ReactElement<unknown, string> | string

interface ButtonProps {
  children: ButtonElement
  type?: 'submit' | 'button'
  disabled?: boolean
  style?: 'light' | 'dark'
  onClick?: () => void
}

export const Button = ({
  children,
  type = 'button',
  disabled = false,
  style = 'light',
  onClick
}: ButtonProps): React.ReactNode => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${style}`}
    >
      {children}
    </button>
  )
}

interface SocialButton {
  social: 'google' | 'facebook' | 'appleid'
  clientId: string
}

export const SocialButton = ({
  social,
  clientId
}: SocialButton): React.ReactNode => {
  const startLogin = () => {
    const width = 600
    const height = 650

    // Tamaño de la ventana del navegador
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    let authUrl = ''
    if (social === 'google') {
      const params = new URLSearchParams({
        client_id:
          '1091574505245-hd5ma7kv3tnrbeic39sqaglpps83bt1o.apps.googleusercontent.com',
        redirect_uri: `${location.origin}/api/auth/social/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        nonce: crypto.randomUUID(),
        prompt: 'select_account',
        state: clientId
      })

      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    }

    window.open(
      authUrl,
      'google_auth',
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
    )
  }

  const capitalizeName = `${social[0].toUpperCase()}${social.substring(
    1,
    social.length
  )}`

  console.log(capitalizeName)

  return (
    <button
      type='button'
      className={`social-container__button ${social}`}
      onClick={startLogin}
    >
      <Image
        src={`/static/icons/${social}.svg`}
        width={20}
        height={20}
        alt={`${capitalizeName}`}
      ></Image>
      Iniciar con {capitalizeName}
    </button>
  )
}
