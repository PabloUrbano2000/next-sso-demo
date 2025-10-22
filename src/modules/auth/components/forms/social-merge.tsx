import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, SocialButton } from '../shared/buttons'
import { EditButton } from '../shared/edit-button'

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

export const SocialMergeView = ({
  isIframe = false,
  onSuccess,
  onEditEmail,
  onFailed = () => {}
}: Props): React.ReactNode => {
  const router = useRouter()
  const { user, email, clientId } = useAuth()

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loginMessage = (event: MessageEvent) => {
      console.log(event)
    }
    window.addEventListener('message', loginMessage)
    return () => {
      window.removeEventListener('message', loginMessage)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Cargando...')

    try {
      const res = await fetch('/api/auth/merge', {
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
    } finally {
      setLoading(false)
    }
  }

  const resetLink = `/auth${isIframe ? '/iframe' : ''}/reset-password${
    location.search
  }`

  return (
    <div className='form'>
      <div>
        <h1 className='form-title'>¡Bienvenido de vuelta!</h1>

        <h4 className='form-subtitle'>
          Para poder continuar necesitamos validar tu identidad
        </h4>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            readOnly
            type='email'
            placeholder='Email'
            value={email}
            className='input'
            disabled
          />
          <EditButton onClick={onEditEmail}></EditButton>
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

        <Button type='submit' style='dark'>
          {loading ? 'Verificando...' : 'Continuar'}
        </Button>

        {status && <p className='mt-4 text-center text-gray-700'>{status}</p>}
      </form>

      <div className='separator'>
        <div className='separator-line'></div>
        <span className='separator-text'>o</span>
        <div className='separator-line'></div>
      </div>

      <div className='social-container'>
        <SocialButton clientId={clientId} social='google'></SocialButton>
        <SocialButton clientId={clientId} social='facebook'></SocialButton>
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
