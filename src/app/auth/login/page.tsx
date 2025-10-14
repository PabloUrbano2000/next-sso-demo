'use client'

import { useAuth } from '@/context/AuthContext'
import { appendQueryParams } from '@/utils/params'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()

  const { clientId, redirectUri, email, user, setEmail, setUser } = useAuth()

  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  React.useEffect(() => {
    if (!email || !user) {
      redirect(
        `/auth/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
      )
    }
  }, [email, user])

  if (!email || !user) {
    return <></>
  }

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

        const newRedirectUri = appendQueryParams(redirectUri, {
          token: data.access_token,
          registration: 'false',
          gm_sso_redirect: 'true'
        })

        location.href = newRedirectUri
      } else {
        const data = await res.json()
        setStatus(`Error: ${data.error || 'Login fallido'}`)
      }
    } catch (err) {
      setStatus('Error de red')
    }
  }

  const handleUpdateEmail = () => {
    router.push(
      `/auth/check-email?client_id=${clientId}&redirect_uri=${redirectUri}`
    )
  }

  const firstName =
    user?.firstName[0]?.toUpperCase() +
    user?.firstName?.substring(1, user?.firstName?.length)

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>
          ¡Bienvenido {firstName}!
        </h1>

        <h4 className='text-sm font-light text-center mb-5 text-gray-800'>
          Sigue personalizando tu experiencia con notas y newsletters
          seleccionados, juegos y mucho más.
        </h4>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex relative w-full'>
            <input
              readOnly
              type='email'
              placeholder='Email'
              value={email}
              required
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 disabled w-full'
            />
            <button
              type='button'
              className='button widgetBtn'
              onClick={handleUpdateEmail}
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
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
            />
          </div>

          <button
            type='submit'
            className='py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition'
          >
            Continuar
          </button>
          {status && <p className='mt-4 text-center text-gray-700'>{status}</p>}
        </form>

        <div className='flex justify-center items-center mb-2'>
          <div className='flex bg-black w-full h-0.5'></div>
          <span className='p-0 px-2 text-black'>O</span>
          <div className='flex bg-black w-full h-0.5'></div>
        </div>
      </div>
    </div>
  )
}
