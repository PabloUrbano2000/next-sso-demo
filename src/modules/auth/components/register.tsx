import { useAuth } from '@/context/AuthContext'
import { getDeviceCategory } from '@/utils/navigator'
import React, { useState } from 'react'
import { RegisterDto } from '../dtos/register.dto'

export interface RegisterSuccessData {
  access_token: string
  user: {
    first_name: string | null
    last_name: string | null
  }
}

interface Props {
  isIframe?: boolean
  onEditEmail: () => void
  onSuccess: (data?: RegisterSuccessData) => void
  onFailed?: () => void
}

export const RegisterView = ({
  isIframe = false,
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

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target
    setData((data) => ({
      ...data,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    }
  }

  return (
    <div
      className={`w-full max-w-md bg-white p-8 ${
        isIframe ? '' : 'rounded-xl shadow-lg'
      }`}
    >
      <h1 className='text-2xl font-bold text-center mb-6 text-gray-800'>
        ¡Te damos la bienvenida!
      </h1>

      <h4 className='text-sm font-light text-center mb-5 text-gray-800'>
        Creando tu cuenta podrás acceder a Gestión, PerúQuiosco, y disfrutar de
        los beneficios que El Comercio tiene para ti.
      </h4>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex relative w-full'>
          <input
            readOnly
            type='email'
            placeholder='Email'
            value={email}
            required
            onChange={onChange}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 disabled w-full'
          />
          <button
            type='button'
            className='button widgetBtn'
            onClick={onEditEmail}
          >
            editar
          </button>
        </div>

        <div className='flex relative w-full'>
          <input
            name='password'
            type='password'
            placeholder='Crea una contraseña'
            value={data.password}
            onChange={onChange}
            required
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
          />
        </div>

        <div className='flex relative w-full'>
          <input
            name='firstName'
            type='text'
            placeholder='Nombre'
            value={data.firstName}
            onChange={onChange}
            required
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
          />
        </div>

        <div className='flex relative w-full'>
          <input
            name='lastName'
            type='text'
            placeholder='Apellido paterno'
            value={data.lastName}
            onChange={onChange}
            required
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
          />
        </div>

        <div className='flex relative w-full'>
          <input
            name='contactPhone'
            type='tel'
            placeholder='Teléfono (opcional)'
            value={data.contactPhone}
            onChange={onChange}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full'
          />
        </div>

        <button
          type='submit'
          className='py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition'
        >
          Continuar
        </button>

        <div className='text-center'>
          <p className='text-center text-gray-900 text-sm'>
            Al crear la cuenta acepto los Términos y Condiciones y Política de
            Privacidad.
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

      <div className='flex justify-center items-center mb-2'>
        <div className='flex bg-black w-full h-0.5'></div>
        <span className='p-0 px-2 text-black'>O</span>
        <div className='flex bg-black w-full h-0.5'></div>
      </div>
    </div>
  )
}
