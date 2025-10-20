'use client'

import { CheckEmailView } from '@/modules/auth/components/check-email'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()

  const handleExists = () => {
    router.push('/auth/login' + location.search)
  }

  const handleNotExists = () => {
    router.push('/auth/register' + location.search)
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <CheckEmailView
        onExists={handleExists}
        onNotExists={handleNotExists}
      ></CheckEmailView>
    </div>
  )
}
