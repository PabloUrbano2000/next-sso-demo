'use client'

import { useRouter } from 'next/navigation'

import { CheckEmailView } from '@/modules/auth/components/forms/check-email'

export default function CheckEmailPage() {
  const router = useRouter()

  const handleExists = () => {
    router.push('/auth/login')
  }

  const handleNotExists = () => {
    router.push('/auth/register')
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
