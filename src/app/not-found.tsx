'use client'

import { useRouter } from 'next/navigation'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-xl mb-6'>Oops! La página que buscas no existe.</p>
      <button
        onClick={() => router.push('/')}
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
      >
        Volver al inicio
      </button>
    </div>
  )
}
