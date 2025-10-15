'use client'

import { CheckEmailView } from '@/modules/auth/components/check-email'
import { useRouter } from 'next/navigation'

export default function CheckEmailPage() {
  const router = useRouter()

  const handleExists = () => {
    router.push('/auth/login' + location.search)
  }

  const handleNotExists = () => {
    router.push('/auth/register' + location.search)
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
      <CheckEmailView
        onExists={handleExists}
        onNotExists={handleNotExists}
      ></CheckEmailView>
    </div>
  )
}
