import { useAuth } from '@/context/AuthContext'
import React, { useState } from 'react'

interface Props {
  isIframe?: boolean
  onExists: () => void
  onNotExists: () => void
  onFailed?: () => void
}

export const CheckEmailView = ({
  isIframe = false,
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
    <div
      className={`w-full max-w-md bg-white p-8 ${
        isIframe ? '' : 'rounded-xl shadow-lg'
      }`}
    >
      <h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>
        Crea una cuenta o inicia sesión para seguir leyendo
      </h1>
      <h4 className='text-sm font-light text-center mb-5 text-gray-800'>
        Comienza a personalizar tu experiencia con notas y newsletters
        seleccionados, juegos y mucho más.
      </h4>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            type='email'
            placeholder='Email'
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
        >
          {loading ? 'Verificando...' : 'Continuar'}
        </button>
        {status && <p className='mt-4 text-center text-gray-700'>{status}</p>}
      </form>
      <div className='flex justify-center items-center mb-2'>
        <div className='flex bg-black w-full h-0.5'></div>
        <span className='p-0 px-2 text-black'>O</span>
        <div className='flex bg-black w-full h-0.5'></div>
      </div>

      <div className='text-center'>
        <p className='text-center text-gray-900 text-sm'>
          Al crear la cuenta acepto los Términos y Condiciones y Política de
          Privacidad.
        </p>
      </div>
    </div>
  )
}
