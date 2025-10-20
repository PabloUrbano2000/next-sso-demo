import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export interface LoginSuccessData {
  access_token: string
  user: {
    first_name: string | null
    last_name: string | null
  }
}

interface Props {
  isIframe?: boolean
  onSuccess: (data?: LoginSuccessData) => void
  onEditEmail: () => void
  onFailed?: () => void
}

export const LoginView = ({
  isIframe = false,
  onSuccess,
  onEditEmail,
  onFailed = () => {}
}: Props): React.ReactNode => {
  const router = useRouter()
  const { user, email, clientId } = useAuth()

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Cargando...')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-brand': clientId },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        setStatus('Login correcto')
        const data = await res.json()

        onSuccess(data)
      } else {
        const data = await res.json()
        setStatus(`Error: ${data.error || 'Login fallido'}`)
        onFailed()
      }
    } catch (err) {
      setStatus('Error de red')
      onFailed()
    }
  }

  const firstName =
    `${user?.firstName[0]?.toUpperCase()}` +
    user?.firstName?.substring(1, user?.firstName?.length)

  const resetLink = `/auth${isIframe ? '/iframe' : ''}/reset-password${
    location.search
  }`

  return (
    <div className='form'>
      <div>
        <h1 className='form-title'>¡Bienvenido {firstName}!</h1>
        <h4 className='form-subtitle'>
          Sigue personalizando tu experiencia con notas y newsletters
          seleccionados, juegos y mucho más.
        </h4>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            readOnly
            type='email'
            placeholder='Email'
            value={email}
            required
            className='input'
          />
          <button
            type='button'
            className='button widgetBtn'
            onClick={onEditEmail}
          >
            editar
          </button>
        </div>

        <div className='flex relative w-full'>
          <input
            type='password'
            placeholder='Ingresar contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='input'
          />
        </div>

        <button
          type='button'
          className='flex ml-auto text-black cursor-pointer hover:underline'
          onClick={() => router.push(resetLink)}
        >
          Olvidé mi contraseña
        </button>

        <button type='submit' className='dark-button'>
          Continuar
        </button>
        {status && <p className='mt-4 text-center text-gray-700'>{status}</p>}
      </form>

      <div className='separator'>
        <div className='separator-line'></div>
        <span className='separator-text'>o</span>
        <div className='separator-line'></div>
      </div>

      <div className='social-container'>
        <button className='social-container__button google'>
          <Image
            src='/static/icons/google.svg'
            width={20}
            height={20}
            alt='Google'
          ></Image>
          Iniciar con Google
        </button>
        <button className='social-container__button facebook'>
          <Image
            src='/static/icons/facebook.svg'
            width={20}
            height={20}
            alt='Google'
          ></Image>
          Iniciar con Facebook
        </button>
      </div>

      <div className='subscriber-container'>
        <p>Para tener acceso a todo el contenido de El Comercio</p>
        <a href='https://elcomercio.pe/suscripciones/'>
          Ver planes de suscripción
        </a>
      </div>
    </div>
  )
}
