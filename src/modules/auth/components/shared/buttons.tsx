import Image from 'next/image'
import { JSX } from 'react'

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
  const startLogin = async () => {
    try {
      const res = await fetch(`/api/auth/social/${social}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-brand': clientId }
      })

      console.log(res)

      const data = await res.json()

      if (data.uri) {
        const width = 600
        const height = 650

        // Tamaño de la ventana del navegador
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        window.open(
          data.uri,
          'piano_login',
          `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const capitalizeName =
    social[0].toUpperCase() + social.substring(1, social.length)

  return (
    <button
      className={`social-container__button ${social}`}
      onClick={() => startLogin()}
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
