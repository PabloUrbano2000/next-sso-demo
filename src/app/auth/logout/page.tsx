'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { redirectUri } = useAuth()

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (e) {
        console.error('Error en logout:', e)
      } finally {
        location.href = redirectUri
      }
    }

    logout()
  }, [])

  return (
    <div className='flex items-center justify-center text-gray-700'>
      Cerrando sesión...
    </div>
  )
}
