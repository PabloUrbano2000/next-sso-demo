import { useAuth } from '@/context/AuthContext'
import { getDeviceCategory } from '@/utils/navigator'
import React, { useState } from 'react'
import { RegisterDto } from '../../dtos/register.dto'
import { Button } from '../shared/buttons'
import { EditButton } from '../shared/edit-button'
import { ThirdProviders } from '../shared/providers'

export interface RegisterSuccessData {
  access_token: string
  user: {
    first_name: string | null
    last_name: string | null
  }
}

interface Props {
  onEditEmail: () => void
  onSuccess: (data?: RegisterSuccessData) => void
  onFailed?: () => void
}

export const RegisterView = ({
  onEditEmail,
  onSuccess,
  onFailed = () => {}
}: Props): React.ReactNode => {
  const { clientId, email, redirectUri } = useAuth()

  const [data, setData] = useState({
    password: '',
    firstName: '',
    lastName: '',
    contactPhone: '',
    dataTreatment: false,
    ageConfirmation: false
  })
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target
    setData((data) => ({
      ...data,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Cargando...')

    console.log(data)

    const bodyData: RegisterDto = {
      email: email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      contact_phone: data.contactPhone,
      terms_and_privacy_policy: true,
      data_treatment: data.dataTreatment,
      age_confirmation: data.ageConfirmation,
      origin_device: getDeviceCategory(),
      origin_user_agent: navigator.userAgent,
      origin_referer: decodeURIComponent(redirectUri),
      origin_domain: new URL(decodeURIComponent(redirectUri)).origin
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-brand': clientId },
        body: JSON.stringify(bodyData)
      })

      if (res.ok) {
        setStatus('Registro correcto')
        const data = await res.json()

        onSuccess(data)
      } else {
        const data = await res.json()
        setStatus(`Error: ${data.error || 'Registro fallido'}`)
        onFailed()
      }
    } catch (err) {
      setStatus('Error de red')
      onFailed()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='form'>
      <div>
        <h1 className='form-title'>¡Te damos la bienvenida!</h1>
        <h4 className='form-subtitle'>
          Creando tu cuenta podrás acceder a Gestión, PerúQuiosco, y disfrutar
          de los beneficios que El Comercio tiene para ti.
        </h4>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            readOnly
            type='email'
            placeholder='Email'
            value={email}
            className='input'
            disabled
          />
          <EditButton onClick={onEditEmail}></EditButton>
        </div>

        <div className='flex relative w-full'>
          <input
            name='password'
            type='password'
            placeholder='Crea una contraseña'
            value={data.password}
            onChange={onChange}
            required
            className='input'
          />
        </div>

        <div className='flex gap-4'>
          <div className='flex relative w-full'>
            <input
              name='firstName'
              type='text'
              placeholder='Nombre'
              value={data.firstName}
              onChange={onChange}
              required
              className='input'
            />
          </div>

          <div className='flex relative w-full'>
            <input
              name='lastName'
              type='text'
              placeholder='Apellido'
              value={data.lastName}
              onChange={onChange}
              required
              className='input'
            />
          </div>
        </div>

        <div className='flex relative w-full'>
          <input
            name='contactPhone'
            type='tel'
            placeholder='Teléfono (opcional)'
            value={data.contactPhone}
            onChange={onChange}
            className='input'
          />
        </div>

        <Button type='submit' style='dark'>
          {loading ? 'Verificando...' : 'Continuar'}
        </Button>

        <div className='text-center'>
          <p className='text-center text-gray-900 text-sm'>
            Al crear la cuenta acepto los{' '}
            <a
              className='terms'
              href='https://elcomercio.pe/terminos-y-condiciones/'
              rel='noreferrer'
              target='_blank'
            >
              Términos y Condiciones
            </a>{' '}
            y{' '}
            <a
              className='terms'
              href='https://elcomercio.pe/politicas-privacidad/'
              rel='noreferrer'
              target='_blank'
            >
              Política de Privacidad
            </a>
            .
          </p>
        </div>

        <div className='md:flex md:items-center mb-1'>
          <div className=''></div>
          <label className='block'>
            <input
              className='mr-2 leading-tight'
              type='checkbox'
              checked={data.dataTreatment}
              onChange={(ev) =>
                setData((data) => ({
                  ...data,
                  dataTreatment: ev.target.checked
                }))
              }
            ></input>
            <span className='text-gray-900 text-sm'>
              Al registrarme autorizo el uso de mis datos para fines
              adicionales.
            </span>
          </label>
        </div>

        <div className='md:flex md:items-center mb-1'>
          <div className=''></div>
          <label className='block'>
            <input
              className='mr-2 leading-tight'
              type='checkbox'
              checked={data.ageConfirmation}
              onChange={(ev) =>
                setData((data) => ({
                  ...data,
                  ageConfirmation: ev.target.checked
                }))
              }
            ></input>
            <span className='text-gray-900 text-sm'>
              Declaro ser mayor de edad.
            </span>
          </label>
        </div>

        {status && <p className='mt-4 text-center text-gray-700'>{status}</p>}
      </form>

      <div className='separator'>
        <div className='separator-line'></div>
        <span className='separator-text'>o</span>
        <div className='separator-line'></div>
      </div>

      <ThirdProviders clientId={clientId} providers={['google', 'facebook']} />

      <div className='subscriber-container'>
        <p>Para tener acceso a todo el contenido de El Comercio</p>
        <a href='https://elcomercio.pe/suscripciones/'>
          Ver planes de suscripción
        </a>
      </div>
    </div>
  )
}
