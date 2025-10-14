'use client'

import { useEffect } from 'react'

export default function LogoutPage() {
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
        const params = new URLSearchParams(window.location.search)
        const redirectUri = params.get('redirect_uri')!
        window.location.href = redirectUri
      }
    }

    logout()
  }, [])

  return (
    <div className='flex h-screen items-center justify-center text-gray-700'>
      Cerrando sesión...
    </div>
  )
}
