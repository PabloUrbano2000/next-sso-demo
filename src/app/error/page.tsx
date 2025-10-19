export default function ErrorPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800'>
      <div className='bg-white rounded-xl shadow-sm p10 max-w-lg w-full text-center border border-gray-200 p-4'>
        <h1 className='text-2xl font-semibold mb-3'>Solicitud no válida</h1>
        <p className='text-sm text-gray-600 mb-2'>
          No se pudo continuar con el proceso de autenticación.
        </p>
        <p className='text-sm text-gray-500'>
          Faltan parámetros requeridos (<code>client_id</code> o{' '}
          <code>redirect_uri</code>).
        </p>
      </div>
    </main>
  )
}
