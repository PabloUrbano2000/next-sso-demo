'use client'

import { CheckEmailView } from '@/modules/auth/components/check-email'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function IframeCheckEmailPage() {
  const router = useRouter()

  // Necesario para transiciones
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('iframe-child-ready'))
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleExists = () => {
    router.push('/auth/iframe/login' + location.search)
  }

  const handleNotExists = () => {
    router.push('/auth/iframe/register' + location.search)
  }

  return (
    <CheckEmailView
      onExists={handleExists}
      onNotExists={handleNotExists}
    ></CheckEmailView>
  )
}
