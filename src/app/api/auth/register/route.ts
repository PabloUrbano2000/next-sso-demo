import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getPianoInfo } from '@/lib/piano'
import { LoginDto } from '@/modules/auth/dtos/login.dto'
import { RegisterDto } from '@/modules/auth/dtos/register.dto'
import { register } from '@/modules/piano/services/identity/register.service'
import { anonUserGet } from '@/modules/piano/services/user/anon-user-get.service'
import { handleCustomError, handleUnexpectedError } from '@/utils/handle-errors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const brand = req.headers.get('x-brand')

  const pianoCtx = getPianoInfo(brand)

  const body = await req.json()

  const parsed = LoginDto.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { aid, apiToken } = pianoCtx
  const {
    email,
    password,
    first_name,
    last_name,
    terms_and_privacy_policy,
    data_treatment,
    age_confirmation,
    contact_phone,
    origin_device,
    origin_domain,
    origin_referer,
    origin_user_agent
  } = body as RegisterDto

  try {
    const { success: registerSuccess, error: registerError } = await register({
      email,
      password,
      first_name,
      last_name,
      consents: {
        terms_and_privacy_policy: terms_and_privacy_policy,
        data_treatment: data_treatment,
        age_confirmation: age_confirmation
      },
      custom_fields: {
        contact_phone: contact_phone,
        origin_device: origin_device,
        origin_domain: origin_domain,
        origin_referer: origin_referer,
        origin_user_agent: origin_user_agent
      },
      api_token: apiToken,
      aid: aid
    })

    if (registerError) {
      if (registerError.error_code_list) {
        const { message } = registerError.error_code_list[0] || {}
        if (message?.toString().includes('You already have an account')) {
          return handleCustomError({
            data: { message: 'Already has account.' }
          })
        }
      }

      throw registerError
    }

    const { success: userGet, error: userGetError } = await anonUserGet({
      user_token: registerSuccess?.access_token || '',
      aid: aid
    })

    if (userGetError) throw userGetError

    const navCookies = await cookies()

    navCookies.set({
      name: 'token-sso',
      value: registerSuccess?.access_token || '',
      // httpOnly: true, // más seguro, no accesible por JS en cliente
      // secure: true,     // requiere HTTPS en prod
      path: '/',
      maxAge: 60 * 60, // 1 hora
      sameSite: 'lax'
    })

    return NextResponse.json({
      user: {
        uid: userGet?.user.uid,
        first_name: userGet?.user.first_name,
        last_name: userGet?.user.last_name,
        email: userGet?.user.email
      },
      access_token: registerSuccess?.access_token,
      refresh_token: registerSuccess?.refresh_token,
      email_confirmation_required: registerSuccess?.email_confirmation_required,
      extend_expired_access_enabled:
        registerSuccess?.extend_expired_access_enabled
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
