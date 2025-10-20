import React from 'react'

interface Props {
  onRedirectReferer: () => void
  onRedirectSubs: () => void
  type: 'register' | 'login'
}

export const SuccessView = ({
  onRedirectReferer,
  onRedirectSubs,
  type
}: Props): React.ReactNode => {
  return (
    <div className='form'>
      <h1 className='form-title'>
        {type === 'login'
          ? '¡Que bueno verte de nuevo en El Comercio!'
          : '¡Bienvenido a El Comercio!'}
        <br />
        Tenemos algo para ti
      </h1>

      <h4 className='text-sm font-light text-center mb-5 text-gray-800'>
        Siendo parte de nuestra comunidad, puedes acceder
        <strong>ahorrando un 20% en beneficios exclusivos</strong> y descubrir
        todo el contenido que El Comercio tiene para ti.
      </h4>
      <button
        type='submit'
        className='flex w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition mb-2 cursor-pointer text-center justify-center'
        onClick={onRedirectSubs}
      >
        Ver planes de suscripción
      </button>
      <button
        type='submit'
        className='flex w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer text-center justify-center'
        onClick={onRedirectReferer}
      >
        Seguir leyendo la nota
      </button>
    </div>
  )
}
