'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black flex flex-col items-center justify-between p-8 sm:p-20'>
      <main className='flex flex-col items-center text-center gap-10'>
        <div className='flex flex-col items-center gap-4'>
          <Image
            src='/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
            className='dark:invert'
          />
          <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight'>
            Centralización de Sesiones
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-md text-base sm:text-lg leading-relaxed'>
            Plataforma unificada para la gestión de autenticación entre
            <span className='font-medium text-gray-800 dark:text-gray-200'>
              {' '}
              elcomercio.pe, gestion.pe
            </span>{' '}
            y
            <span className='font-medium text-gray-800 dark:text-gray-200'>
              {' '}
              clubelcomercio.pe
            </span>
            . Diseñada con <strong>Next.js 15 (SSR)</strong> y desplegada en
            <strong> AWS Amplify</strong>.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 mt-4'>
          <a
            href='https://nextjs.org/docs'
            target='_blank'
            rel='noopener noreferrer'
            className='px-6 py-3 rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-black font-medium hover:opacity-90 transition'
          >
            Leer documentación
          </a>
          {/* <a
            href='/dashboard'
            className='px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition'
          >
            Ir al dashboard
          </a> */}
          <a
            href='https://aws.amazon.com/amplify/'
            target='_blank'
            rel='noopener noreferrer'
            className='px-6 py-3 rounded-full border border-transparent bg-blue-600 hover:bg-blue-700 text-white font-medium transition'
          >
            Ver en Amplify
          </a>
        </div>
      </main>

      <footer className='flex gap-6 text-sm text-gray-500 dark:text-gray-400 mt-16'>
        <a
          href='https://nextjs.org/learn'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline hover:text-gray-700 dark:hover:text-gray-200'
        >
          Learn
        </a>
        {/* <a
          href='https://vercel.com/templates'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline hover:text-gray-700 dark:hover:text-gray-200'
        >
          Templates
        </a> */}
        <a
          href='https://nextjs.org'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline hover:text-gray-700 dark:hover:text-gray-200'
        >
          Next.js →
        </a>
      </footer>
    </div>
  )
}
