import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getPianoInfo } from '@/lib/piano'
import { LoginDto } from '@/modules/auth/dtos/login.dto'
import { login } from '@/modules/piano/services/identity/login.service'
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
  const { email, password, stay_logged_in } = body as LoginDto

  try {
    const { success: loginSuccess, error: loginError } = await login({
      email,
      password,
      stay_logged_in,
      api_token: apiToken,
      aid: aid
    })

    if (loginError) {
      if (loginError.error_code_list) {
        const { message } = loginError.error_code_list[0] || {}
        if (
          message?.toString().includes('email and password is not recognized')
        ) {
          return handleCustomError({
            data: { message: 'Email or password are invalid.' }
          })
        }
      }

      throw loginError
    }

    const { success: userGet, error: userGetError } = await anonUserGet({
      user_token: loginSuccess?.access_token || '',
      aid: aid
    })

    if (userGetError) throw userGetError

    const navCookies = await cookies()

    navCookies.set({
      name: 'token-sso',
      value: loginSuccess?.access_token || '',
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
      access_token: loginSuccess?.access_token,
      refresh_token: loginSuccess?.refresh_token,
      email_confirmation_required: loginSuccess?.email_confirmation_required,
      extend_expired_access_enabled: loginSuccess?.extend_expired_access_enabled
    })
  } catch (error) {
    console.log(error)
    return handleUnexpectedError(error)
  }
}
