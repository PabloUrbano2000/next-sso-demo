/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
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
      // const res = await fetch(`/api/auth/social/${social}`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json', 'x-brand': clientId }
      // })

      // console.log(res)

      // const data = await res.json()

      // if (data.uri) {
      const width = 600
      const height = 650

      // Tamaño de la ventana del navegador
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const origin = encodeURIComponent(
        'http://localhost:3000/api/auth/social/callback'
      )

      const uri = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?as=8bNVjo7RBrxZKlDZBA7zYYSYOCiy8qLCL6lhUw-tJag&client_id=1091574505245-hd5ma7kv3tnrbeic39sqaglpps83bt1o.apps.googleusercontent.com&scope=openid%20email%20profile&response_type=id_token&gsiwebsdk=gis_attributes&redirect_uri=gis_transform&response_mode=form_post&origin=${origin}&display=popup&prompt=select_account&gis_params=Ci1odHRwczovL3N0YWdpbmcuZDF2MXNxaG1jYWJ3dWcuYW1wbGlmeWFwcC5jb20SDWdpc190cmFuc2Zvcm0YByorOGJOVmpvN1JCcnhaS2xEWkJBN3pZWVNZT0NpeThxTENMNmxoVXctdEphZzJJMTA5MTU3NDUwNTI0NS1oZDVtYTdrdjN0bnJiZWljMzlzcWFnbHBwczgzYnQxby5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbTgBQkA3MjI3OGI4MDJhNTBlY2MxZGE4ZGRlZTFiMTlhZTFmOTE2MzZlYjM4NmI2ZWU1OTdhOWYwZTZjMzBmYzE3ZDY5&service=lso&o2v=1&flowName=GeneralOAuthFlow`

      window.open(
        uri,
        'piano_login',
        `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
      )
      // }
    } catch (err) {
      console.error(err)
    }
  }

  const capitalizeName =
    social[0].toUpperCase() + social.substring(1, social.length)

  return (
    <button
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
