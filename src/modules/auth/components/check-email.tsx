import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import React, { useState } from 'react'

interface Props {
  onExists: () => void
  onNotExists: () => void
  onFailed?: () => void
}

export const CheckEmailView = ({
  onExists,
  onNotExists,
  onFailed = () => {}
}: Props): React.ReactNode => {
  const { setEmail, setUser, clientId } = useAuth()
  const [emailInput, setEmailInput] = useState('')

  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-brand': clientId },
        body: JSON.stringify({ email: emailInput })
      })

      const data = await res.json()

      if (res.ok) {
        if (data.uid) {
          setEmail(emailInput)
          setUser({
            uid: data.uid,
            email: data.email,
            firstName: data.first_name ?? '',
            lastName: data.last_name ?? ''
          })

          onExists()
        } else {
          setEmail(emailInput)
          onNotExists()
        }
      } else {
        setStatus('Error al verificar el correo')
        onFailed()
      }
    } catch (err) {
      setStatus('Ocurrió un error inesperado')
      onFailed()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='form'>
      <div>
        <h1 className='form-title'>
          Ingresa tu correo para iniciar sesión o crear una cuenta
        </h1>
        <h4 className='form-subtitle'>
          Creando tu cuenta podrás acceder a Gestión, PerúQuiosco, y disfrutar
          de los beneficios que El Comercio tiene para ti.
        </h4>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            type='email'
            placeholder='Correo electrónico'
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className='input'
          />
        </div>

        <button type='submit' disabled={loading} className='dark-button'>
          {loading ? 'Verificando...' : 'Continuar'}
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
