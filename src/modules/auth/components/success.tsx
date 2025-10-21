import Image from 'next/image'
import React from 'react'
import { Button } from './shared/buttons'

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
      <Image
        src={'/static/logo/elcomercio-square.svg'}
        width={113}
        height={108}
        alt='El Comercio Logo'
        className='mx-auto my-0'
        loading='eager'
      ></Image>
      <h1 className='form-title'>
        {type === 'login'
          ? '¡Que bueno verte de nuevo en El Comercio!'
          : '¡Bienvenido a El Comercio!'}
        <br />
        Tenemos algo para ti
      </h1>
      <h4 className='form-subtitle'>
        Siendo parte de nuestra comunidad, puedes acceder{' '}
        <strong>ahorrando un 20% en beneficios exclusivos</strong> y descubrir
        todo el contenido que El Comercio tiene para ti.
      </h4>
      <Button style='dark' onClick={onRedirectSubs}>
        Ver planes de suscripción
      </Button>
      <Button style='light' onClick={onRedirectReferer}>
        Seguir leyendo la nota
      </Button>
    </div>
  )
}
